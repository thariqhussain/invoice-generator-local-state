import './Invoice.css';
import { useState } from 'react';
import deleteIcon from '../../assets/trash.png'
import editIcon from '../../assets/editRound.png'

export default function InvoiceCard({ invoice, onEdit, onDelete, generateInvoiceNumber }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleEdit = () => {
        onEdit(invoice);
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        onDelete(invoice);
        setShowDeleteDialog(false);
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
    };

    // Determine invoice display number based on type
    const getInvoiceDisplayNumber = () => {
        if (invoice.invoice_type === 'individual' && invoice.invoice_id) {
            return invoice.invoice_id.split('-').slice(0, 2).join('-');
        }
        return generateInvoiceNumber(invoice.invoice_id);
    };

    // Get invoice type badge styling
    const getInvoiceTypeBadge = () => {
        if (invoice.invoice_type === 'individual' || invoice.invoice_type === 'individual-all') {
            return {
                text: 'INDIVIDUAL',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                shadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
            };
        }
        return {
            text: 'BULK',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            shadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
        };
    };

    const badge = getInvoiceTypeBadge();

    return (
        <>
            <div className="invoice-card">
                {/* Invoice Type Badge - Positioned at top right */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: badge.background,
                    color: 'white',
                    boxShadow: badge.shadow,
                    zIndex: 10
                }}>
                    {badge.text}
                </div>

                <h4 className="invoice-number-header">
                    {getInvoiceDisplayNumber()}
                </h4>

                {/* ✅ ENHANCEMENT-2 FIX: Single invoice-client-section div for both bulk and individual invoices */}
                <div className="invoice-client-section" style={
                    invoice.invoice_type === 'individual' 
                        ? { 
                            borderLeft: '3px solid #8b5cf6',
                            background: '#002147'
                        }
                        : {}
                }>
                    <span className="label">
                        {invoice.invoice_type === 'individual' ? 'Entity:' : 'Client:'}
                    </span>
                    {/* ✅ ENHANCEMENT-2 FIX: Show client_name for both types (it contains entity name for individual invoices) */}
                    <span className="value">{invoice.client_name || 'N/A'}</span>
                </div>
                
                <div className="invoice-detail-row">
                    <span className="label">Status:</span>
                    <span className="value">{invoice.status || 'Draft'}</span>
                </div>

                <div className="invoice-detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{invoice.invoice_date}</span>
                </div>
                
                <div className="invoice-detail-row">
                    <span className="label">Due Date:</span>
                    <span className="value">{invoice.due_date}</span>
                </div>
                
                <div className="invoice-detail-row">
                    <span className="label">Amount:</span>
                    <span className="value amount">${invoice.total_amount?.toFixed(2) || '0.00'}</span>
                </div>

                <div className='invoice-action-buttons'>
                    <button onClick={handleEdit}>
                        <img className='invoice-edit-icon' src={editIcon} alt='edit-icon' />
                    </button>
                    <button onClick={handleDeleteClick}>
                        <img className='invoice-delete-icon' src={deleteIcon} alt='delete-icon' />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="generate-dialog-overlay open" onClick={cancelDelete}>
                    <div className="generate-dialog-content delete-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '15px',
                            fontWeight: 700,
                            fontSize: '1.6rem'
                        }}>
                            Confirm Deletion
                        </h3>
                        
                        <p style={{
                            color: '#475569',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            marginBottom: '30px'
                        }}>
                            Are you sure you want to permanently delete invoice <strong>{getInvoiceDisplayNumber()}</strong>? This action cannot be undone.
                        </p>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '20px'
                        }}>
                            <button 
                                onClick={confirmDelete}
                                title="Delete Invoice"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    border: '2px solid #f87171',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    background: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
                                    color: '#b91c1c'
                                }}
                            >
                                🗑️
                            </button>
                            
                            <button 
                                onClick={cancelDelete}
                                title="Cancel"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    border: '2px solid #cbd5e1',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                                    color: '#64748b'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}