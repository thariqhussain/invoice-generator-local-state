import { useState, useRef, useEffect } from 'react'; 
import deleteIcon from '../../assets/trash.png'
import editIcon from '../../assets/editRound.png'

export default function ProjectCard({ project, onEdit, onDelete }) {
    
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

            <h4 className="entity-name-header">{project.name}</h4>

            <div className="entity-name-address">
                <span className="label">Description:</span>
                <span className="value">{project.description}</span>
            </div>
            
            <div className="entity-detail-row">
                <span className="label">Given By:</span>
                <span className="value">{project.given_by}</span>
            </div>

            <div className="entity-detail-row">
                <span className="label">Taken By:</span>
                <span className="value">{project.taken_by}</span>
            </div>
            
            <div className="entity-detail-row">
                <span className="label">Start Date:</span>
                <span className="value">{project.start_date}</span>
            </div>
            
            <div className="entity-detail-row">
                <span className="label">End Date:</span>
                <span className="value">{project.end_date}</span>
            </div>

            <div className="entity-detail-row">
                <span className="label">Rate Mode:</span>
                <span className="value">{project.rate_mode}</span>
            </div>

            <div className="entity-detail-row">
                <span className="label">Rate Amount:</span>
                <span className="value">{project.rate_amount} {project.currency}</span>
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