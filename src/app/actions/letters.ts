'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createLetterSchema, updateLetterSchema, signLetterSchema } from '@/lib/validations'
import { canSendLetterTo, canViewLetter } from '@/lib/hierarchy'
import { createAuditLog } from '@/lib/audit'
import { headers } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import { LetterStatus } from '@prisma/client'

export async function createLetterAction(formData: FormData) {
    const currentNode = await requireAuth()

    const subject = formData.get('subject') as string
    const body = formData.get('body') as string
    const receiverId = formData.get('receiverId') as string
    const category = formData.get('category') as string
    const parentId = formData.get('parentId') as string || null
    const attachment = formData.get('attachment') as string || undefined
    const signedBySender = formData.get('signedBySender') === 'true'
    const requestType = formData.get('requestType') as 'GENERAL' | 'SICK_LEAVE' || 'GENERAL'
    const startDate = formData.get('startDate') as string || undefined
    const endDate = formData.get('endDate') as string || undefined
    const daysCount = formData.get('daysCount') ? Number(formData.get('daysCount')) : undefined

    const validation = createLetterSchema.safeParse({
        subject, body, receiverId, category, parentId, attachment, signedBySender,
        requestType, startDate, endDate, daysCount
    })
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    // Check if current node can send to receiver
    const canSend = await canSendLetterTo(currentNode.id, receiverId)
    if (!canSend) {
        return { error: 'You cannot send a letter to this recipient' }
    }

    const letter: any = {
        id: uuidv4(),
        subject,
        body,
        category,
        parentId,
        attachment,
        signedBySender,
        requestType,
        startDate,
        endDate,
        daysCount,
        senderId: currentNode.id,
        receiverId,
        status: 'DRAFT' as LetterStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    db.letters.push(letter)

    // Log letter creation
    const headersList = await headers()
    await createAuditLog({
        nodeId: currentNode.id,
        action: 'LETTER_CREATED',
        details: `Created ${requestType === 'SICK_LEAVE' ? 'sick leave request' : 'letter'}: ${subject}`,
        letterId: letter.id,
        ipAddress: headersList.get('x-forwarded-for') || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    })

    revalidatePath('/dashboard/letters')
    return { success: true, letterId: letter.id }
}

export async function updateLetterAction(letterId: string, formData: FormData) {
    const currentNode = await requireAuth()

    const subject = formData.get('subject') as string | null
    const body = formData.get('body') as string | null

    const updateData: any = {}
    if (subject) updateData.subject = subject
    if (body) updateData.body = body

    const validation = updateLetterSchema.safeParse(updateData)
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    // Check if letter exists and belongs to current node
    const letterIndex = db.letters.findIndex(l => l.id === letterId)

    if (letterIndex === -1) {
        return { error: 'Letter not found' }
    }

    const letter = db.letters[letterIndex]

    if (letter.senderId !== currentNode.id) {
        return { error: 'You can only edit your own letters' }
    }

    if (letter.status !== 'DRAFT') {
        return { error: 'You can only edit draft letters' }
    }

    db.letters[letterIndex] = {
        ...letter,
        ...updateData,
        updatedAt: new Date(),
    }

    // Log letter update
    const headersList = await headers()
    await createAuditLog({
        nodeId: currentNode.id,
        action: 'LETTER_UPDATED',
        details: `Updated letter: ${letter.subject}`,
        letterId: letter.id,
        ipAddress: headersList.get('x-forwarded-for') || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    })

    revalidatePath('/dashboard/letters')
    revalidatePath(`/dashboard/letters/${letterId}`)
    return { success: true }
}

export async function sendLetterAction(letterId: string) {
    const currentNode = await requireAuth()

    const letterIndex = db.letters.findIndex(l => l.id === letterId)

    if (letterIndex === -1) {
        return { error: 'Letter not found' }
    }

    const letter = db.letters[letterIndex]

    if (letter.senderId !== currentNode.id) {
        return { error: 'You can only send your own letters' }
    }

    if (letter.status !== 'DRAFT') {
        return { error: 'Letter has already been sent' }
    }

    db.letters[letterIndex] = {
        ...letter,
        status: 'SENT',
        updatedAt: new Date(),
    }

    // Log letter sent
    const headersList = await headers()
    await createAuditLog({
        nodeId: currentNode.id,
        action: 'LETTER_SENT',
        details: `Sent letter: ${letter.subject}`,
        letterId: letter.id,
        ipAddress: headersList.get('x-forwarded-for') || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    })

    revalidatePath('/dashboard/letters')
    revalidatePath(`/dashboard/letters/${letterId}`)
    return { success: true }
}

export async function signLetterAction(letterId: string, formData: FormData) {
    const currentNode = await requireAuth()

    const response = formData.get('response') as string | null

    const validation = signLetterSchema.safeParse({ response })
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const letterIndex = db.letters.findIndex(l => l.id === letterId)

    if (letterIndex === -1) {
        return { error: 'Letter not found' }
    }

    const letter = db.letters[letterIndex]

    if (letter.receiverId !== currentNode.id) {
        return { error: 'You can only sign letters addressed to you' }
    }

    if (letter.status !== 'SENT') {
        return { error: 'Letter must be sent before signing' }
    }

    const existingSignature = db.signatures.find(s => s.letterId === letterId)
    if (existingSignature) {
        return { error: 'Letter has already been signed' }
    }

    // Create signature
    const signature = {
        id: uuidv4(),
        letterId: letter.id,
        signedById: currentNode.id,
        response: response || null,
        signedAt: new Date(),
    }
    db.signatures.push(signature)

    // Update letter status
    const newStatus: LetterStatus = response ? 'RESPONDED' : 'SIGNED'
    db.letters[letterIndex] = {
        ...letter,
        status: newStatus,
        updatedAt: new Date(),
    }

    // SPECIAL LOGIC: If this is a sick leave request, decrease the sender's balance
    if (letter.requestType === 'SICK_LEAVE' && letter.daysCount) {
        const senderIndex = db.nodes.findIndex(n => n.id === letter.senderId)
        if (senderIndex !== -1) {
            db.nodes[senderIndex].sickLeaveBalance -= letter.daysCount
        }
    }

    // Log signature
    const headersList = await headers()
    await createAuditLog({
        nodeId: currentNode.id,
        action: response ? 'LETTER_RESPONDED' : 'LETTER_SIGNED',
        details: `Signed ${letter.requestType === 'SICK_LEAVE' ? 'sick leave request' : 'letter'}: ${letter.subject}`,
        letterId: letter.id,
        ipAddress: headersList.get('x-forwarded-for') || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    })

    revalidatePath('/dashboard/letters')
    revalidatePath(`/dashboard/letters/${letterId}`)
    revalidatePath('/dashboard/sick-leave/stats')
    revalidatePath('/dashboard/nodes')
    return { success: true }
}

export async function deleteLetterAction(letterId: string) {
    const currentNode = await requireAuth()

    const letterIndex = db.letters.findIndex(l => l.id === letterId)

    if (letterIndex === -1) {
        return { error: 'Letter not found' }
    }

    const letter = db.letters[letterIndex]

    if (letter.senderId !== currentNode.id) {
        return { error: 'You can only delete your own letters' }
    }

    // Remove letter
    db.letters.splice(letterIndex, 1)

    // Remove associated signatures
    const signatureIndex = db.signatures.findIndex(s => s.letterId === letterId)
    if (signatureIndex !== -1) {
        db.signatures.splice(signatureIndex, 1)
    }

    // Log letter deletion
    const headersList = await headers()
    await createAuditLog({
        nodeId: currentNode.id,
        action: 'LETTER_DELETED',
        details: `Deleted letter: ${letter.subject}`,
        ipAddress: headersList.get('x-forwarded-for') || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    })

    revalidatePath('/dashboard/letters')
    redirect('/dashboard/letters')
}
