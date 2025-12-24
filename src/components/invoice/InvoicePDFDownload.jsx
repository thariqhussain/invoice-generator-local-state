import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

export default function InvoicePDFDownload({ invoiceData }) {
    const getFileName = (invoice) => {
        const entityName = invoice.entity_name 
            ? invoice.entity_name.split(',')[0].trim().replace(/\s+/g, '-')
            : `Invoice-${invoice.template_id}`;
        return `${entityName}-${invoice.invoice_date}.pdf`;
    };

    return (
        <PDFDownloadLink
            document={<InvoicePDF invoiceData={invoiceData} />}
            fileName={getFileName(invoiceData)}
            style={{
                padding: '12px 24px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
        >
            {({ blob, url, loading, error }) =>
                loading ? '⏳ Preparing PDF...' : '📥 Download PDF'
            }
        </PDFDownloadLink>
    );
}