import { useState, useEffect } from 'react';
import Input from '../../reusables/Input';
import Label from '../../reusables/Label';
import Button from '../../reusables/Button';
import './ConsultantDialog.css';

const initialFormState = {
    name: '',
    email: '',
    country: 'India',
    mobile: '',
    type3: 'FullTime',
    address: ''
};

const COUNTRIES = ["UK", "USA", "India", "Germany", "France", "Ireland"];
const CONSULTANT_TYPES = ["FullTime", "PartTime", "InHouse"];

export default function CreateConsultantDialog({ isOpen, onClose, onSubmit, consultantToEdit }) {
    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (consultantToEdit) {
            setForm(consultantToEdit);
        } else {
            setForm(initialFormState);
        }
    }, [consultantToEdit, isOpen]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const isEditing = !!consultantToEdit;
    const dialogTitle = isEditing ? 'Edit Consultant Details' : 'Create New Consultant';
    const submitButtonText = isEditing ? 'Save Changes' : 'Submit Consultant';

    return (
        <div className={`dialog-overlay ${isOpen ? 'open' : ''}`}> 
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <h3>{dialogTitle}</h3> 
                <form onSubmit={handleSubmit}>
                    
                    <Input id="consultant-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Consultant Name" required />
                    
                    <Input id="consultant-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required />
                    
                    <Input id="consultant-phone" type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="mobile Number" required />
                    
                    <Label htmlFor="consultant-country">Country</Label>
                    <select id="consultant-country" name="country" value={form.country} onChange={handleChange} required>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <Label htmlFor="consultant-type">Consultant Type</Label>
                    <select id="consultant-type" name="type3" value={form.type3} onChange={handleChange} required>
                        {CONSULTANT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    
                    <Input id="consultant-address" type="text" name="address" value={form.address} onChange={handleChange} placeholder="Consultant Address" required />
                    
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} style={{marginRight: '10px'}}>Cancel</button>
                        <Button type="submit">{submitButtonText}</Button> 
                    </div>
                </form>
            </div>
        </div>
    );
}