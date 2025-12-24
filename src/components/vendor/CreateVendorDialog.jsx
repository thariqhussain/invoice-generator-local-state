import { useState, useEffect } from 'react';
import Input from '../../reusables/Input';
import Label from '../../reusables/Label';
import Button from '../../reusables/Button';
import './VendorDialog.css';

const initialFormState = {
    name: '',
    email: '',
    country: 'India',
    mobile: '',
    address: ''
};

const COUNTRIES = ["UK", "USA", "India", "Germany", "France", "Ireland"];

export default function CreateVendorDialog({ isOpen, onClose, onSubmit, vendorToEdit }) {
    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (vendorToEdit) {
            setForm(vendorToEdit);
        } else {
            setForm(initialFormState);
        }
    }, [vendorToEdit, isOpen]);

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

    const isEditing = !!vendorToEdit;
    const dialogTitle = isEditing ? 'Edit Vendor Details' : 'Create New Vendor';
    const submitButtonText = isEditing ? 'Save Changes' : 'Submit Vendor';

    return (
        <div className={`dialog-overlay ${isOpen ? 'open' : ''}`}> 
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <h3>{dialogTitle}</h3> 
                <form onSubmit={handleSubmit}>
                    
                    <Input id="vendor-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Vendor Name" required />
                    
                    <Input id="vendor-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required />
                    
                    <Input id="vendor-contact" type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="mobile Number" required />
                    
                    <Label htmlFor="vendor-country">Country</Label>
                    <select id="vendor-country" name="country" value={form.country} onChange={handleChange} required>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    <Input id="vendor-address" type="text" name="address" value={form.address} onChange={handleChange} placeholder="Vendor Address" required />
                    
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} style={{marginRight: '10px'}}>Cancel</button>
                        <Button type="submit">{submitButtonText}</Button> 
                    </div>
                </form>
            </div>
        </div>
    );
}