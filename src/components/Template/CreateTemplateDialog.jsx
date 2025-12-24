import { useState, useEffect, useRef } from 'react';
import Input from '../../reusables/Input';
import Label from '../../reusables/Label';
import Button from '../../reusables/Button';
import './TemplateDialog.css';
import { projectCRUD } from '../../services/crudService';

const initialFormState = {
    name: '',
    description: '',
    currency: 'USD',
    show_project_hirearchy: true, // Default as boolean for checkbox
    projects: []
};

const CURRENCIES = ["GBP", "USD", "INR", "EUR"];

export default function CreateTemplateDialog({ isOpen, onClose, onSubmit, templateToEdit, isSubmitting }) {
    const [form, setForm] = useState(initialFormState);
    const [projects, setProjects] = useState([]);
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [projectsError, setProjectsError] = useState(null);
    const dropdownRef = useRef(null);

    // Fetch projects from API when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        setLoadingProjects(true);
        setProjectsError(null);
        const result = await projectCRUD.getAll();
        if (result.success && Array.isArray(result.data)) {
            setProjects(result.data);
        } else {
            setProjectsError(result.message || 'Failed to load projects');
            setProjects([]);
        }
        setLoadingProjects(false);
    };

    // Correction-1: Syncing Edit Values and normalizing boolean fields
    useEffect(() => {
        if (isOpen) {
            if (templateToEdit) {
                setForm({
                    ...templateToEdit,
                    // Ensure projects is always an array
                    projects: Array.isArray(templateToEdit.projects) ? [...templateToEdit.projects] : [],
                    // Convert "on"/"off" strings or numbers to boolean for the checkbox
                    show_project_hirearchy: templateToEdit.show_project_hirearchy === "on" || templateToEdit.show_project_hirearchy === true
                });
            } else {
                setForm(initialFormState);
            }
        }
    }, [templateToEdit, isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProjectDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddProject = (project) => {
        if (!form.projects.some(p => p.id === project.id)) {
            setForm(prev => ({
                ...prev,
                projects: [...prev.projects, project]
            }));
            setShowProjectDropdown(false);
        }
    };

    const handleRemoveProject = (projectId) => {
        setForm(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.id !== projectId)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const isEditing = !!templateToEdit;

    return (
        <div className={`dialog-overlay ${isOpen ? 'open' : ''}`}> 
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <h3>{isEditing ? 'Edit Template Details' : 'Create New Template'}</h3> 
                <form onSubmit={handleSubmit}>
                    
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input 
                        id="template-name" 
                        type="text" 
                        name="name" 
                        value={form.name || ''} 
                        onChange={handleChange} 
                        placeholder="Template Name" 
                        required 
                        disabled={isSubmitting}
                    />
                    
                    <Label htmlFor="template-description">Description</Label>
                    <textarea 
                        id="template-description" 
                        name="description" 
                        value={form.description || ''} 
                        onChange={handleChange} 
                        placeholder="Template Description"
                        disabled={isSubmitting}
                    />

                    <Label htmlFor="template-currency">Currency</Label>
                    <select 
                        id="template-currency" 
                        name="currency" 
                        value={form.currency} 
                        onChange={handleChange} 
                        required
                        disabled={isSubmitting}
                    >
                        {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                    </select>

                    {/* Correction-2: Vertical Alignment and Scrolling Section */}
                    <div className="project-selection-section">
                        <div className="project-section-header">
                            <Label style={{ margin: 0 }}>Selected Projects</Label>
                            <button
                                type="button"
                                className="add-project-btn-text"
                                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                                disabled={isSubmitting || loadingProjects}
                            >
                                + Add Project
                            </button>
                        </div>

                        <div className="project-list-scroll-area" ref={dropdownRef}>
                            {!form.projects || form.projects.length === 0 ? (
                                <p className="placeholder-text">No projects selected</p>
                            ) : (
                                <ul className="project-vertical-items">
                                    {form.projects.map(proj => (
                                        <li key={proj.id} className="project-list-item">
                                            {/* Correction: Ensuring name is rendered correctly */}
                                            <span className="project-item-name">{proj.name}</span>
                                            <button
                                                type="button"
                                                className="remove-project-link"
                                                onClick={() => handleRemoveProject(proj.id)}
                                                disabled={isSubmitting}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Dropdown positioned relative to the container */}
                            {showProjectDropdown && (
                                <div className="project-dropdown-list">
                                    {loadingProjects ? (
                                        <div className="dropdown-item">Loading...</div>
                                    ) : (
                                        projects.map(proj => {
                                            const isSelected = form.projects.some(p => p.id === proj.id);
                                            return (
                                                <div 
                                                    key={proj.id}
                                                    className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => !isSelected && handleAddProject(proj)}
                                                >
                                                    {proj.name} {isSelected && '✓'}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="checkbox-row">
                        <input 
                            id="template-hierarchy" 
                            type="checkbox" 
                            name="show_project_hirearchy" 
                            checked={form.show_project_hirearchy} 
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        <Label htmlFor="template-hierarchy" style={{margin: 0, display: 'inline', marginLeft: '8px'}}>
                            Show Project Hierarchy
                        </Label>
                    </div>
                    
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : (isEditing ? 'Save Changes' : 'Submit Template')}
                        </Button> 
                    </div>
                </form>
            </div>
        </div>
    );
}