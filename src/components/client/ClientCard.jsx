import { useState, useRef, useEffect } from 'react'; 
import './ClientCard.css'
import deleteIcon from '../../assets/trash.png'
import editIcon from '../../assets/editRound.png'

export default function ClientCard({ client, onEdit, onDelete }) {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const menuRef = useRef(null);
    const cardRef = useRef(null);

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

    // const handleCardClick = (e) => {
    //     if (e.target.closest('.entity-option-buttons')) {
    //         return;
    //     }
    //     setIsExpanded(true);
    // };

    return (
        <>  
            <div ref={cardRef} className='entity-card'>
                <h4 className="entity-name-header">{client.name}</h4>

                <div className="entity-name-address">
                    <span className="label">Address:</span>
                    <span className="value">{client.address}</span>
                </div>
                
                <div className="entity-detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{client.type2}</span>
                </div>

                <div className="entity-detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{client.email}</span>
                </div>
                
                <div className="entity-detail-row">
                    <span className="label">Mobile:</span>
                    <span className="value">{client.mobile}</span>
                </div>
                
                <div className="entity-detail-row">
                    <span className="label">Country:</span>
                    <span className="value">{client.country}</span>
                </div>

                    <div className='entity-option-buttons'>
                        <button onClick={(e) => { 
                            e.stopPropagation();
                            onEdit(); 
                        }}>
                            <img className='entity-option-edit-icon' src={editIcon} alt='edit-icon' />
                        </button>
                        <button className="delete-button" onClick={(e) => { 
                            e.stopPropagation();
                            onDelete(); 
                        }}>
                            <img className='entity-option-delete-icon' src={deleteIcon} alt='delete-icon' />
                        </button>
                    </div>
            </div>
        </>
    );
}