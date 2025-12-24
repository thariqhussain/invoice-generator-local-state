import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import './InvoicePDFPreview.css';

export default function InvoicePDFPreview({ invoiceData }) {
    const fileName = `Invoice-${invoiceData.template_id}-${invoiceData.invoice_date}.pdf`;

    return (
        <div className="pdf-preview-container">
            {/* PDF Preview */}
            <div className="pdf-viewer-wrapper">
                <PDFViewer className="pdf-viewer">
                    <InvoicePDF invoiceData={invoiceData} />
                </PDFViewer>
            </div>
        </div>
    );
}