import { useState, useRef, useEffect } from 'react'; 
import deleteIcon from '../../assets/trash.png'
import editIcon from '../../assets/editRound.png'

export default function VendorCard({ vendor, onEdit, onDelete }) {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="entity-card">            

            <h4 className="entity-name-header">{vendor.name}</h4>

            <div className="entity-name-address">
                <span className="label">Address:</span>
                <span className="value">{vendor.address}</span>
            </div>
            
            <div className="entity-detail-row">
                <span className="label">Category:</span>
                <span className="value">{vendor.type2}</span>
            </div>

            <div className="entity-detail-row">
                <span className="label">Email:</span>
                <span className="value">{vendor.email}</span>
            </div>
            
            <div className="entity-detail-row">
                <span className="label">Contact:</span>
                <span className="value">{vendor.mobile}</span>
            </div>
            
            <div className="entity-detail-row">
                <span className="label">Country:</span>
                <span className="value">{vendor.country}</span>
            </div>     

            <div className='entity-option-buttons'>
                <button onClick={() => { 
                        onEdit(); 
                        setIsMenuOpen(false); 
                    }}>
                        <img className='entity-option-edit-icon' src={editIcon} alt='edit-icon' />
                </button>

                <button  onClick={() => { 
                                onDelete(); 
                                setIsMenuOpen(false); 
                            }}>
                            <img className='entity-option-delete-icon' src={deleteIcon} alt='delete-icon' />
                </button> 
            </div>    
        </div>
    );
}