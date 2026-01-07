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

        // Title
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('Official Letter', margin, yPosition)
        yPosition += 15

        // Status badge
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Status: ${letter.status}`, margin, yPosition)
        yPosition += 10

        // Separator
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10

        // From section
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('From:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.text(letter.sender.name, margin, yPosition)
        yPosition += 5
        doc.setFontSize(10)
        doc.text(letter.sender.position, margin, yPosition)
        yPosition += 5
        doc.text(letter.sender.email, margin, yPosition)
        yPosition += 10

        // To section
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('To:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.text(letter.receiver.name, margin, yPosition)
        yPosition += 5
        doc.setFontSize(10)
        doc.text(letter.receiver.position, margin, yPosition)
        yPosition += 5
        doc.text(letter.receiver.email, margin, yPosition)
        yPosition += 10

        // Date
        doc.setFontSize(10)
        doc.text(`Date: ${format(new Date(letter.createdAt), 'PPP')}`, margin, yPosition)
        yPosition += 15

        // Subject
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Subject:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        const subjectLines = doc.splitTextToSize(letter.subject, maxWidth)
        doc.text(subjectLines, margin, yPosition)
        yPosition += subjectLines.length * 7 + 10

        // Body
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Message:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        const bodyLines = doc.splitTextToSize(letter.body, maxWidth)
        doc.text(bodyLines, margin, yPosition)
        yPosition += bodyLines.length * 7 + 15

        // Signature section if exists
        if (letter.signature) {
            // Check if we need a new page
            if (yPosition > 250) {
                doc.addPage()
                yPosition = 20
            }

            doc.setDrawColor(0, 200, 0)
            doc.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 10

            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(0, 150, 0)
            doc.text('Digital Signature', margin, yPosition)
            yPosition += 10

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(0, 0, 0)
            doc.text(`Signed by: ${letter.signature.signedBy.name}`, margin, yPosition)
            yPosition += 5
            doc.text(`Position: ${letter.signature.signedBy.position}`, margin, yPosition)
            yPosition += 5
            doc.text(`Signed at: ${format(new Date(letter.signature.signedAt), 'PPpp')}`, margin, yPosition)
            yPosition += 10

            if (letter.signature.response) {
                doc.setFont('helvetica', 'bold')
                doc.text('Response:', margin, yPosition)
                yPosition += 7
                doc.setFont('helvetica', 'normal')
                const responseLines = doc.splitTextToSize(letter.signature.response, maxWidth)
                doc.text(responseLines, margin, yPosition)
            }
        }

        // Save the PDF
        const fileName = `letter-${letter.id}-${format(new Date(), 'yyyy-MM-dd')}.pdf`
        doc.save(fileName)
    }

    return (
        <Button onClick={generatePdf} variant="outline" size="sm" className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
        </Button>
    )
}
