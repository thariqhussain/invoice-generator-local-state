import { useState, useEffect, useRef } from 'react';
import Input from '../../reusables/Input';
import Label from '../../reusables/Label';
import Button from '../../reusables/Button';
import './ProjectDialog.css';
import {useAllEntities} from '../Hooks/useAllEntities'

const RATE_MODES = ["Hourly", "Daily", "Weekly", "Monthly", "Milestone", "Fixed"];
const CURRENCIES = ["GBP", "USD", "INR", "EUR"];

const initialFormState = {
    name: '',
    description: '',
    givenById: '',        // Store ID for API
    givenByName: '',      // Store name for display
    takenById: '',        // Store ID for API
    takenByName: '',      // Store name for display
    startDate: '',
    endDate: '',
    rateMode: 'Hourly',
    rateAmount: '',
    currency: 'USD'
};

export default function CreateProjectDialog({ isOpen, onClose, onSubmit, projectToEdit }) {
    const [form, setForm] = useState(initialFormState);
    const [givenByDropdown, setGivenByDropdown] = useState(false);
    const [takenByDropdown, setTakenByDropdown] = useState(false);
    const givenByRef = useRef(null);
    const takenByRef = useRef(null);

    // ✅ Fetch all entities (Clients, Vendors, Companies, Consultants)
    const allEntities = useAllEntities();

    // ✅ Filter entities: exclude the one selected in takenBy from givenBy
    const givenByEntities = allEntities.filter(e => e.id !== form.takenById);

    // ✅ Filter entities: exclude the one selected in givenBy from takenBy  
    const takenByEntities = allEntities.filter(e => e.id !== form.givenById);

    useEffect(() => {
        if (projectToEdit) {
            setForm(projectToEdit);
        } else {
            setForm(initialFormState);
        }
    }, [projectToEdit, isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (givenByRef.current && !givenByRef.current.contains(event.target)) {
                setGivenByDropdown(false);
            }
            if (takenByRef.current && !takenByRef.current.contains(event.target)) {
                setTakenByDropdown(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ✅ Updated to store both ID and name
    const handleGivenBySelect = (entity) => {
        setForm({
            ...form,
            givenById: entity.id,        // Store ID for API
            givenByName: entity.name     // Store name for display
        });
        setGivenByDropdown(false);
    };

    // ✅ Updated to store both ID and name
    const handleTakenBySelect = (entity) => {
        setForm({
            ...form,
            takenById: entity.id,        // Store ID for API
            takenByName: entity.name     // Store name for display
        });
        setTakenByDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const isEditing = !!projectToEdit;
    const dialogTitle = isEditing ? 'Edit Project Details' : 'Create New Project';
    const submitButtonText = isEditing ? 'Save Changes' : 'Submit Project';

    return (
        <div className={`dialog-overlay ${isOpen ? 'open' : ''}`}> 
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <h3>{dialogTitle}</h3> 
                <form onSubmit={handleSubmit}>
                    
                    <Input 
                        id="project-name" 
                        type="text" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        placeholder="Project Name" 
                        required 
                    />
                    
                    <label htmlFor="project-description">Description</label>
                    <textarea 
                        id="project-description" 
                        name="description" 
                        value={form.description} 
                        onChange={handleChange} 
                        placeholder="Project Description" 
                        required
                    />

                    {/* Given By - ✅ All entities dropdown */}
                    <Label htmlFor="project-givenBy">Given By</Label>
                    <div className="dropdown-container" ref={givenByRef}>
                        <Input 
                            id="project-givenBy" 
                            type="text" 
                            name="givenByName"
                            value={form.givenByName}
                            onChange={handleChange}
                            placeholder="Select entity..." 
                            onFocus={() => setGivenByDropdown(true)}
                            readOnly
                        />
                        {givenByDropdown && (
                            <div className="dropdown-list">
                                {givenByEntities.length === 0 ? (
                                    <div className="dropdown-item empty-message">
                                        No entities available.
                                    </div>
                                ) : (
                                    givenByEntities.map((entity) => (
                                        <div 
                                            key={entity.id} 
                                            className="dropdown-item"
                                            onClick={() => handleGivenBySelect(entity)}
                                        >
                                            {entity.name} <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>({entity.type})</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Taken By - ✅ All entities dropdown */}
                    <Label htmlFor="project-takenBy">Taken By</Label>
                    <div className="dropdown-container" ref={takenByRef}>
                        <Input 
                            id="project-takenBy" 
                            type="text" 
                            name="takenByName"
                            value={form.takenByName}
                            onChange={handleChange}
                            placeholder="Select entity..." 
                            onFocus={() => setTakenByDropdown(true)}
                            readOnly
                        />
                        {takenByDropdown && (
                            <div className="dropdown-list">
                                {takenByEntities.length === 0 ? (
                                    <div className="dropdown-item empty-message">
                                        No entities available.
                                    </div>
                                ) : (
                                    takenByEntities.map((entity) => (
                                        <div 
                                            key={entity.id} 
                                            className="dropdown-item"
                                            onClick={() => handleTakenBySelect(entity)}
                                        >
                                            {entity.name} <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>({entity.type})</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <Label htmlFor="project-startDate">Start Date</Label>
                    <Input 
                        id="project-startDate" 
                        type="date" 
                        name="startDate" 
                        value={form.startDate} 
                        onChange={handleChange} 
                        required 
                    />

                    <Label htmlFor="project-endDate">End Date</Label>
                    <Input 
                        id="project-endDate" 
                        type="date" 
                        name="endDate" 
                        value={form.endDate} 
                        onChange={handleChange} 
                        required 
                    />

                    <Label htmlFor="project-rateMode">Rate Mode</Label>
                    <select 
                        id="project-rateMode" 
                        name="rateMode" 
                        value={form.rateMode} 
                        onChange={handleChange} 
                        required
                    >
                        {RATE_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                    </select>

                    <Label htmlFor="project-rateAmount">Rate Amount</Label>
                    <Input 
                        id="project-rateAmount" 
                        type="number" 
                        name="rateAmount" 
                        value={form.rateAmount} 
                        onChange={handleChange} 
                        placeholder="0.00"
                        step="0.01"
                        required 
                    />

                    <Label htmlFor="project-currency">Currency</Label>
                    <select 
                        id="project-currency" 
                        name="currency" 
                        value={form.currency} 
                        onChange={handleChange} 
                        required
                    >
                        {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                    </select>
                    
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} style={{marginRight: '10px'}}>Cancel</button>
                        <Button type="submit">{submitButtonText}</Button> 
                    </div>
                </form>
            </div>
        </div>
    );
}