import { useRef, useState } from 'react';
import downloadIcon from '../../assets/invoice/download.png';

export default function PDFDownloadMenu({ invoices, onClose }) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const handleBulkDownload = () => {
        invoices.forEach((invoice, index) => {
            setTimeout(() => {
                const pdfLink = document.querySelector(
                    `.pdf-preview-item:nth-child(${index + 1}) a[download]`
                );
                if (pdfLink) {
                    pdfLink.click();
                }
            }, index * 800);
        });
        setShowMenu(false);
    };

    const handleDownloadOne = (index) => {
        const pdfLink = document.querySelector(
            `.pdf-preview-item:nth-child(${index + 1}) a[download]`
        );
        if (pdfLink) {
            pdfLink.click();
        }
        setShowMenu(false);
    };

    return (
        <div className="pdf-download-menu-wrapper" ref={menuRef}>
            <button
                className="round-btn pdf-download-btn"
                onClick={() => setShowMenu(!showMenu)}
                title="Download PDFs"
            >
                <img src={downloadIcon} alt='download-icon' />
            </button>

            {showMenu && (
                <div className="pdf-download-dropdown">
                    <button 
                        className="pdf-download-option bulk"
                        onClick={handleBulkDownload}
                    >
                        📥 Download All ({invoices.length} files)
                    </button>
                    
                    <div className="pdf-download-divider"></div>
                    
                    <div className="pdf-download-list">
                        {invoices.map((invoice, index) => (
                            <button
                                key={invoice.invoice_id}
                                className="pdf-download-option individual"
                                onClick={() => handleDownloadOne(index)}
                            >
                                📄 {invoice.entity_name || `Invoice ${index + 1}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showMenu && (
                <div 
                    className="pdf-download-overlay"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}