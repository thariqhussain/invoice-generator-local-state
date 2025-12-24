import { useEffect, useState } from 'react';
import Button from '../../reusables/Button'; 
import ConsultantCard from './ConsultantCard'; 
import CreateConsultantDialog from './CreateConsultantDialog'
import DeleteConsultantDialog from './DeleteConsultantDialog'
import { consultantCRUD } from '../../services/crudService';
import '../Entity.css'
import searchIcon from '../../assets/search.png'
import crossIcon from '../../assets/remove.png'

export default function Consultant() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [consultants, setConsultants] = useState([]); 
    const [consultantToEdit, setConsultantToEdit] = useState(null); 
    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    const [consultantToDeleteId, setConsultantToDeleteId] = useState(null); 

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // API integration states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchConsultants();
    }, [])

    const fetchConsultants = async() => {
        setIsLoading(true);
        setError(null);

        const result = await consultantCRUD.getAll();

        if(result.success) {
            setConsultants(result.data)
        } else {
            setError(result.message)
        };

        setIsLoading(false);
    };

    const handleCreateConsultant = async (newConsultant) => {
        setIsSubmitting(true);
        setError(null);

        const result = await consultantCRUD.create(newConsultant);

        if (result.success) {
            await fetchConsultants();
            setIsDialogOpen(false);
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    // const handleEditConsultant = (updatedConsultant) => {
    //     setConsultants(prevConsultants => 
    //         prevConsultants.map(consultant => 
    //             consultant.id === updatedConsultant.id ? updatedConsultant : consultant
    //         )
    //     );
    //     setConsultantToEdit(null);
    //     setIsDialogOpen(false);
    // };

    // --- Delete logic ---
    
        const handleEditConsultant = async (updatedConsultant) => {
            setIsSubmitting(true);
            setError(null);
    
            // Build the request data with explicit fields
            const dataToSend = {
                name: updatedConsultant.name,
                email: updatedConsultant.email,
                country: updatedConsultant.country,
                mobile: updatedConsultant.mobile,
                address: updatedConsultant.address,
                type1: 'Consultant',                              // ✅ Always 'Consultant'
                type2: updatedConsultant.type2,                   // ✅ Use the form's type2 value
                type3: updatedConsultant.type3 || 'NotApplicable' // ✅ Default if not provided
            };
    
            // Debug: Log what's being sent to the API
            console.log('Sending update data:', dataToSend);
    
            const result = await consultantCRUD.update(updatedConsultant.id, dataToSend);
    
            if (result.success) {
                // Refresh the consultant list from server
                await fetchConsultants();
                setConsultantToEdit(null);
                setIsDialogOpen(false);
                // Optional: Show success message
                console.log('Consultant updated successfully');
            } else {
                setError(result.message);
                // Debug: Log API error
                console.error('Update failed:', result.message);
            }
    
            setIsSubmitting(false);
        };
    
    const openDeleteDialog = (consultantId) => {
        setConsultantToDeleteId(consultantId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setConsultantToDeleteId(null);
    };

    const confirmDeleteConsultant = async () => {
        if (consultantToDeleteId) {
            setError(null);

            const result = await consultantCRUD.delete(consultantToDeleteId);

            if (result.success) {
                // Refresh the consultant list from server
                await fetchConsultants();
            } else {
                setError(result.message);
            }
        }
        closeDeleteDialog();
    };

    const openEditDialog = (consultant) => {
        setConsultantToEdit(consultant);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setConsultantToEdit(null); 
        setIsDialogOpen(false);
    };

    const filteredConsultants = searchQuery.trim() === '' 
        ? consultants 
        : consultants.filter(consultant =>
            consultant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="entities-page">
            <div className="entities-header">
                <h1>Consultants</h1>
                <Button onClick={() => { setConsultantToEdit(null); setIsDialogOpen(true); }}>Create Consultant</Button>
            </div>
            
            <div className="entities-list">
                {filteredConsultants.map((consultant) => (
                    <ConsultantCard 
                        key={consultant.id} 
                        consultant={consultant} 
                        onEdit={() => openEditDialog(consultant)}
                        onDelete={() => openDeleteDialog(consultant.id)} 
                    />
                ))}

                {consultants.length === 0 && (
                    <p className="no-entities-message">
                        No consultants added yet. Click 'Create Consultant' to get started!
                    </p>
                )}

                {consultants.length > 0 && filteredConsultants.length === 0 && (
                    <p className="no-results-message">
                        No consultants found matching "{searchQuery}". Try a different search term.
                    </p>
                )}
            </div>

            <CreateConsultantDialog 
                isOpen={isDialogOpen}
                onClose={closeDialog}
                consultantToEdit={consultantToEdit} 
                onSubmit={consultantToEdit ? handleEditConsultant : handleCreateConsultant} 
            />
            
            <DeleteConsultantDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDeleteConsultant}
            />
        </div>
    );
}