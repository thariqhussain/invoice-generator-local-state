import './ConsultantDialog.css'; 

export default function DeleteConsultantDialog({ isOpen, onClose, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={`dialog-overlay open`}> 
            <div className="dialog-content delete-dialog" onClick={e => e.stopPropagation()}>
                
                <h3 className="delete-title">Confirm Deletion</h3>
                <p className="delete-message">
                    Are you sure you want to permanently delete this consultant? This action cannot be undone.
                </p>
                
                <div className="delete-dialog-actions">                    
                    <button 
                        className="icon-button delete-confirm-btn" 
                        onClick={onConfirm}
                        title="Delete Consultant"
                    >
                        &#128465; 
                    </button>
                    
                    <button 
                        className="icon-button delete-cancel-btn" 
                        onClick={onClose}
                        title="Cancel"
                    >
                        &#x2715; 
                    </button>
                </div>
            </div>
        </div>
    );
}