import { useState, useEffect } from 'react';
import Button from '../../reusables/Button'; 
import CompanyCard from './CompanyCard'; 
import CreateCompanyDialog from './CreateCompanyDialog'
import DeleteCompanyDialog from './DeleteCompanyDialog';
import { companyCRUD } from '../../services/crudService';
import '../Entity.css'

export default function Company() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [companies, setCompanies] = useState([]); 
    const [companyToEdit, setCompanyToEdit] = useState(null); 
    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    const [companyToDeleteId, setCompanyToDeleteId] = useState(null); 

    // API Integration:
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCompany();
    }, [])

    const fetchCompany = async () => {
        setIsLoading(true);
        setError(null);

        const result = await companyCRUD.getAll();

        if(result.success) {
            setCompanies(result.data);
        } else {
            setError(result.message)
        };

        setIsLoading(false);
    }

    const handleCreateCompany = async (newCompany) => {
        setIsSubmitting(true);
        setError(null);

        const result = await companyCRUD.create(newCompany);

        if (result.success) {
            // Refresh the company list from server
            await fetchCompany();
            setIsDialogOpen(false);
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    // const handleEditCompany = (updatedCompany) => {
    //     setCompanies(prevCompanies => 
    //         prevCompanies.map(company => 
    //             company.id === updatedCompany.id ? updatedCompany : company
    //         )
    //     );
    //     setCompanyToEdit(null);
    //     setIsDialogOpen(false);
    // };

    // --- Delete logic ---
    
    const handleEditCompany = async (updatedCompany) => {
        setIsSubmitting(true);
        setError(null);

        // Build the request data with explicit fields
        const dataToSend = {
            name: updatedCompany.name,
            email: updatedCompany.email,
            country: updatedCompany.country,
            mobile: updatedCompany.mobile,
            address: updatedCompany.address,
            type1: 'Company',                               // ✅ Always 'company'
            type2: updatedCompany.type2,                   // ✅ Use the form's type2 value
            type3: updatedCompany.type3 || 'NotApplicable' // ✅ Default if not provided
        };

        // Debug: Log what's being sent to the API
        console.log('Sending update data:', dataToSend);

        const result = await companyCRUD.update(updatedCompany.id, dataToSend);

        if (result.success) {
            // Refresh the company list from server
            await fetchCompany();
            setCompanyToEdit(null);
            setIsDialogOpen(false);
            // Optional: Show success message
            console.log('Company updated successfully');
        } else {
            setError(result.message);
            // Debug: Log API error
            console.error('Update failed:', result.message);
        }

        setIsSubmitting(false);
    };
    
    
    const openDeleteDialog = (companyId) => {
        setCompanyToDeleteId(companyId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setCompanyToDeleteId(null);
    };

    const confirmDeleteCompany = async () => {
        if (companyToDeleteId) {
            setError(null);

            const result = await companyCRUD.delete(companyToDeleteId);

            if (result.success) {
                // Refresh the company list from server
                await fetchCompany();
            } else {
                setError(result.message);
            }
        }
        closeDeleteDialog();
    };

    const openEditDialog = (company) => {
        setCompanyToEdit(company);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setCompanyToEdit(null); 
        setIsDialogOpen(false);
    };

    return (
        <div className="entities-page">
            <div className="entities-header">
                <h1>Companies</h1>
                <Button onClick={() => { setCompanyToEdit(null); setIsDialogOpen(true); }}>Create Company</Button>
            </div>
            
            <div className="entities-list">
                {companies.map((company) => (
                    <CompanyCard 
                        key={company.id} 
                        company={company} 
                        onEdit={() => openEditDialog(company)}
                        onDelete={() => openDeleteDialog(company.id)} 
                    />
                ))}

                {companies.length === 0 && (
                    <p className="no-entities-message">
                        No companies added yet. Click 'Create Company' to get started!
                    </p>
                )}
            </div>

            <CreateCompanyDialog 
                isOpen={isDialogOpen}
                onClose={closeDialog}
                companyToEdit={companyToEdit} 
                onSubmit={companyToEdit ? handleEditCompany : handleCreateCompany} 
                isSubmitting={isSubmitting}
            />
            
            <DeleteCompanyDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDeleteCompany}
            />
        </div>
    );
}