'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { format } from 'date-fns'

interface DownloadPdfButtonProps {
    letter: {
        id: string
        subject: string
        body: string
        status: string
        createdAt: Date
        sender: {
            name: string
            position: string
            email: string
        }
        receiver: {
            name: string
            position: string
            email: string
        }
        signature?: {
            signedAt: Date
            response?: string | null
            signedBy: {
                name: string
                position: string
            }
        } | null
    }
}

export function DownloadPdfButton({ letter }: DownloadPdfButtonProps) {
    function generatePdf() {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const margin = 20
        const maxWidth = pageWidth - 2 * margin
        let yPosition = 20

        // Helper to strip HTML tags
        const stripHtml = (html: string) => {
            const tmp = document.createElement('DIV')
            tmp.innerHTML = html
            return tmp.textContent || tmp.innerText || ''
        }

        const plainBody = stripHtml(letter.body)

        // Title
        doc.setFontSize(24)
        doc.setFont('helvetica', 'bold')
        doc.text('OFFICIAL COMMUNICATION', margin, yPosition)
        yPosition += 15

        // Status badge
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`STATUS: ${letter.status.toUpperCase()}`, margin, yPosition)
        yPosition += 10

        // Separator
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 15

        // From section
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('FROM:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.text(letter.sender.name, margin, yPosition)
        yPosition += 5
        doc.setFontSize(9)
        doc.text(letter.sender.position.toUpperCase(), margin, yPosition)
        yPosition += 5
        doc.text(letter.sender.email, margin, yPosition)
        yPosition += 15

        // To section
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('TO:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.text(letter.receiver.name, margin, yPosition)
        yPosition += 5
        doc.setFontSize(9)
        doc.text(letter.receiver.position.toUpperCase(), margin, yPosition)
        yPosition += 5
        doc.text(letter.receiver.email, margin, yPosition)
        yPosition += 15

        // Date
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(`DATE: ${format(new Date(letter.createdAt), 'PPP').toUpperCase()}`, margin, yPosition)
        yPosition += 20

        // Subject
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('SUBJECT:', margin, yPosition)
        yPosition += 10
        doc.setFont('helvetica', 'bold')
        const subjectLines = doc.splitTextToSize(letter.subject.toUpperCase(), maxWidth)
        doc.text(subjectLines, margin, yPosition)
        yPosition += subjectLines.length * 7 + 15

        // Body
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        const bodyLines = doc.splitTextToSize(plainBody, maxWidth)

        // Handle multi-page body
        bodyLines.forEach((line: string) => {
            if (yPosition > 270) {
                doc.addPage()
                yPosition = 20
            }
            doc.text(line, margin, yPosition)
            yPosition += 6
        })

        yPosition += 20

        // Signature section if exists
        if (letter.signature) {
            // Check if we need a new page
            if (yPosition > 230) {
                doc.addPage()
                yPosition = 20
            }

            doc.setDrawColor(0, 0, 0)
            doc.setLineWidth(0.2)
            doc.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 15

            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.text('DIGITAL SIGNATURE VERIFIED', margin, yPosition)
            yPosition += 10

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text(`Signed by: ${letter.signature.signedBy.name}`, margin, yPosition)
            yPosition += 5
            doc.text(`Position: ${letter.signature.signedBy.position}`, margin, yPosition)
            yPosition += 5
            doc.text(`Timestamp: ${format(new Date(letter.signature.signedAt), 'PPpp')}`, margin, yPosition)
            yPosition += 15

            if (letter.signature.response) {
                doc.setFont('helvetica', 'bold')
                doc.text('OFFICIAL RESPONSE:', margin, yPosition)
                yPosition += 7
                doc.setFont('helvetica', 'italic')
                const responseLines = doc.splitTextToSize(letter.signature.response, maxWidth)
                doc.text(responseLines, margin, yPosition)
            }
        }

        // Save the PDF
        const fileName = `letter-${letter.id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`
        doc.save(fileName)
    }

    return (
        <Button
            onClick={generatePdf}
            variant="outline"
            size="sm"
            className="rounded-none border-2 border-foreground font-black uppercase tracking-widest hover:bg-muted transition-all"
        >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
        </Button>
    )
}
