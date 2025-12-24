import { useState, useEffect } from 'react';
import Input from '../../reusables/Input';
import Label from '../../reusables/Label';
import Button from '../../reusables/Button';
import './CompanyDialog.css';

const initialFormState = {
    name: '',
    email: '',
    country: 'India',
    mobile: '',
    address: ''
};

const COUNTRIES = ["UK", "USA", "India", "Germany", "France", "Ireland"];
const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Manufacturing", "Retail", "Education"];

export default function CreateCompanyDialog({ isOpen, onClose, onSubmit, companyToEdit }) {
    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (companyToEdit) {
            setForm(companyToEdit);
        } else {
            setForm(initialFormState);
        }
    }, [companyToEdit, isOpen]);

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

    const isEditing = !!companyToEdit;
    const dialogTitle = isEditing ? 'Edit Company Details' : 'Create New Company';
    const submitButtonText = isEditing ? 'Save Changes' : 'Submit Company';

    return (
        <div className={`dialog-overlay ${isOpen ? 'open' : ''}`}> 
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <h3>{dialogTitle}</h3> 
                <form onSubmit={handleSubmit}>
                    
                    <Input id="company-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Company Name" required />
                    
                    <Input id="company-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required />
                    
                    <Input id="company-phone" type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="mobile Number" required />
                    
                    <Label htmlFor="company-country">Country</Label>
                    <select id="company-country" name="country" value={form.country} onChange={handleChange} required>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    <Input id="company-address" type="text" name="address" value={form.address} onChange={handleChange} placeholder="Company Address" required />
                    
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} style={{marginRight: '10px'}}>Cancel</button>
                        <Button type="submit">{submitButtonText}</Button> 
                    </div>
                </form>
            </div>
        </div>
    );
}