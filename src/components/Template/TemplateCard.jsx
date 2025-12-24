import { useState, useRef, useEffect } from 'react'; 
import deleteIcon from '../../assets/trash.png'
import editIcon from '../../assets/editRound.png'
import treeView from '../../assets/treeView.png'

export default function TemplateCard({ template, onEdit, onDelete, onTreeView }) {
    
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

    const inrValue = {
        color: 'white',
        fontWeight: '350',
        fontSize: '14px',
        marginLeft: '6px'
    }

    return (
        <div className="template-card">

            <h4 className="template-name-header">{template.name}</h4>

            <div className="template-detail-row">
                <span className="label">Description:</span>
                <span className="value">{template.description}</span>
            </div>
            
            <div className="template-detail-row">
                <span className="label">Currency: <span style={inrValue}>INR</span></span>
                <span className="value">{template.currency}</span>
            </div>

            <div className="template-detail-row full-row">
                <span className="label">Projects:</span>
                <div className="projects-list">
                    {Array.isArray(template.projects) && template.projects.length > 0 
                        ? template.projects.map((project, idx) => (
                            <div key={idx} className="project-item">
                                From <b>{project.givenBy}</b> to <b>{project.takenBy}</b> at <b>{project.rateAmount} {project.currency}</b> per <b>{project.rateMode}</b>
                            </div>
                        ))
                        : <span className="value">Not Selected</span>
                    }
                </div>
            </div>
            
            <div className="template-detail-row hierarchy-row">
                <span className="label">Show Hierarchy:</span>
                <span className="value">{template.showHierarchy ? 'Yes' : 'No'}</span>
            </div>

            <div className='template-option-buttons'>
                <button onClick={() => { 
                        onEdit(); 
                        setIsMenuOpen(false); 
                        className='template-option-edit-btn'
                    }}>
                        <img className='template-option-edit-icon' src={editIcon} alt='edit-icon' />
                </button>

                <button onClick={() => { 
                    onDelete(); 
                    setIsMenuOpen(false); 
                }}>
                    <img className='template-option-delete-icon' src={deleteIcon} alt='delete-icon' />
                </button> 

                <button onClick={onTreeView}>
                    <img className='template-option-tree-view-icon' src={treeView} alt='tree-view-icon' />
                </button>
            </div> 
            
        </div>
    );
}