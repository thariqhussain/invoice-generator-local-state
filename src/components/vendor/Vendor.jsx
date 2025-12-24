import { useState, useEffect } from 'react';
import Button from '../../reusables/Button'; 
import VendorCard from './VendorCard'
import CreateVendorDialog from './CreateVendorDialog'; 
import DeleteVendorDialog from './DeleteVendorDialog'
import { vendorCRUD } from '../../services/crudService';
import '../Entity.css'


export default function Vendor() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [vendors, setVendors] = useState([]); 
    const [vendorToEdit, setVendorToEdit] = useState(null); 
    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    const [vendorToDeleteId, setVendorToDeleteId] = useState(null); 

    // states for API fetching
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchVendors();
    }, [])

    const fetchVendors = async () => {
        setIsLoading(true);
        setError(null);

        const result = await vendorCRUD.getAll();

        if(result.success) {
            setVendors(result.data)
        } else {
            setError(result.message)
        }

        setIsLoading(false);
    }

    const handleCreateVendor = async (newVendor) => {
        setIsSubmitting(true);
        setError(null);

        const result = await vendorCRUD.create(newVendor);

        if (result.success) {
            await fetchVendors();
            setIsDialogOpen(false);
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    // const handleEditVendor = (updatedVendor) => {
    //     setVendors(prevVendors => 
    //         prevVendors.map(vendor => 
    //             vendor.id === updatedVendor.id ? updatedVendor : vendor
    //         )
    //     );
    //     setVendorToEdit(null);
    //     setIsDialogOpen(false);
    // };
     
    const handleEditVendor = async (updatedVendor) => {
        setIsSubmitting(true);
        setError(null);

        // Build the request data with explicit fields
        const dataToSend = {
            name: updatedVendor.name,
            email: updatedVendor.email,
            country: updatedVendor.country,
            mobile: updatedVendor.mobile,
            address: updatedVendor.address,
            type1: 'Vendor',                              // ✅ Always 'Vendor'
            type2: updatedVendor.type2,                   // ✅ Use the form's type2 value
            type3: updatedVendor.type3 || 'NotApplicable' // ✅ Default if not provided
        };

        // Debug: Log what's being sent to the API
        console.log('Sending update data:', dataToSend);

        const result = await vendorCRUD.update(updatedVendor.id, dataToSend);

        if (result.success) {
            // Refresh the client list from server
            await fetchVendors();
            setVendorToEdit(null);
            setIsDialogOpen(false);
            // Optional: Show success message
            console.log('Vendor updated successfully');
        } else {
            setError(result.message);
            // Debug: Log API error
            console.error('Update failed:', result.message);
        }

        setIsSubmitting(false);
    };

    // --- DELETE LOGICS ---
    
    const openDeleteDialog = (vendorId) => {
        setVendorToDeleteId(vendorId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setVendorToDeleteId(null);
    };

    const confirmDeleteVendor = async () => {
        if (vendorToDeleteId) {
            setError(null);

            const result = await vendorCRUD.delete(vendorToDeleteId);

            if (result.success) {
                // Refresh the vendor list from server
                await fetchVendors();
            } else {
                setError(result.message);
            }
        }
        closeDeleteDialog();
    };

    const openEditDialog = (vendor) => {
        setVendorToEdit(vendor);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setVendorToEdit(null); 
        setIsDialogOpen(false);
    };

    return (
        <div className="entities-page">
            <div className="entities-header">
                <h1>Vendors</h1>
                <Button onClick={() => { setVendorToEdit(null); setIsDialogOpen(true); }}>Create Vendor</Button>
            </div>
            
            <div className="entities-list">
                {vendors.map((vendor) => (
                    <VendorCard 
                        key={vendor.id} 
                        vendor={vendor} 
                        onEdit={() => openEditDialog(vendor)}
                        onDelete={() => openDeleteDialog(vendor.id)} 
                    />
                ))}

                {vendors.length === 0 && (
                    <p className="no-entities-message">
                        No vendors added yet. Click 'Create Vendor' to get started!
                    </p>
                )}
            </div>

            <CreateVendorDialog 
                isOpen={isDialogOpen}
                onClose={closeDialog}
                vendorToEdit={vendorToEdit} 
                onSubmit={vendorToEdit ? handleEditVendor : handleCreateVendor} 
            />
            
            <DeleteVendorDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDeleteVendor}
            />
        </div>
    );
}