import { useState, useEffect } from 'react';
import Input from '../../reusables/Input';
import Button from '../../reusables/Button';
import './ClientDialog.css';

const initialFormState = {
    name: '',
    email: '',
    country: 'India',
    mobile: '',
    type2: 'Company',
    address: ''
};

const COUNTRIES = ["UK", "USA", "India", "Germany", "France", "Ireland"];
const CLIENT_TYPES = ["Company", "Individual"];

export default function CreateClientDialog({ isOpen, onClose, onSubmit, clientToEdit, isSubmitting = false }) {
    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (clientToEdit) {
            setForm(clientToEdit);
        } else {
            setForm(initialFormState);
        }
    }, [clientToEdit, isOpen]);

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

    const isEditing = !!clientToEdit;
    const dialogTitle = isEditing ? 'Edit Client Details' : 'Create New Client';
    const submitButtonText = isSubmitting
        ? (isEditing ? 'Saving...' : 'Creating...')
        : (isEditing ? 'Save Changes' : 'Submit Client');

    return (
        <div className={`dialog-overlay ${isOpen ? 'open' : ''}`}>
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <h3>{dialogTitle}</h3>
                <form onSubmit={handleSubmit}>

                    <Input id="client-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required disabled={isSubmitting} />

                    <Input id="client-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required disabled={isSubmitting} />

                    <Input id="client-mobile" type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" required disabled={isSubmitting} />

                    <select id="client-country" name="country" value={form.country} onChange={handleChange} required disabled={isSubmitting}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select id="client-type" name="type2" value={form.type2} onChange={handleChange} required disabled={isSubmitting}>
                        {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <textarea id="client-address" name="address" value={form.address} onChange={handleChange} placeholder="Full Address" required rows="3" disabled={isSubmitting}></textarea>

                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} style={{ marginRight: '10px' }} disabled={isSubmitting}>Cancel</button>
                        <Button type="submit" disabled={isSubmitting}>{submitButtonText}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}