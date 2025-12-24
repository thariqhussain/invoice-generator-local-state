import { useState, useEffect } from 'react';
import Button from '../../reusables/Button';
import ClientCard from './ClientCard';
import CreateClientDialog from './CreateClientDialog';
import DeleteClientDialog from './DeleteClientDialogue';
import '../Entity.css'
import { clientCRUD } from '../../services/crudService';

export default function Clients() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientToEdit, setClientToEdit] = useState(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [clientToDeleteId, setClientToDeleteId] = useState(null);

    // New states for API integration
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch clients from API on component mount
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setIsLoading(true);
        setError(null);

        const result = await clientCRUD.getAll();

        if (result.success) {
            setClients(result.data);
        } else {
            setError(result.message);
        }

        setIsLoading(false);
    };

    const handleCreateClient = async (newClient) => {
        setIsSubmitting(true);
        setError(null);

        const result = await clientCRUD.create(newClient);

        if (result.success) {
            // Refresh the client list from server
            await fetchClients();
            setIsDialogOpen(false);
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    const handleEditClient = async (updatedClient) => {
        setIsSubmitting(true);
        setError(null);

        // Build the request data with explicit fields
        const dataToSend = {
            name: updatedClient.name,
            email: updatedClient.email,
            country: updatedClient.country,
            mobile: updatedClient.mobile,
            address: updatedClient.address,
            type1: 'Client',                              // ✅ Always 'Client'
            type2: updatedClient.type2,                   // ✅ Use the form's type2 value
            type3: updatedClient.type3 || 'NotApplicable' // ✅ Default if not provided
        };

        // Debug: Log what's being sent to the API
        console.log('Sending update data:', dataToSend);

        const result = await clientCRUD.update(updatedClient.id, dataToSend);

        if (result.success) {
            // Refresh the client list from server
            await fetchClients();
            setClientToEdit(null);
            setIsDialogOpen(false);
            // Optional: Show success message
            console.log('Client updated successfully');
        } else {
            setError(result.message);
            // Debug: Log API error
            console.error('Update failed:', result.message);
        }

        setIsSubmitting(false);
    };

    // --- Delete logic ---

    const openDeleteDialog = (clientId) => {
        setClientToDeleteId(clientId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setClientToDeleteId(null);
    };

    const confirmDeleteClient = async () => {
        if (clientToDeleteId) {
            setError(null);

            const result = await clientCRUD.delete(clientToDeleteId);

            if (result.success) {
                // Refresh the client list from server
                await fetchClients();
            } else {
                setError(result.message);
            }
        }
        closeDeleteDialog();
    };

    const openEditDialog = (client) => {
        setClientToEdit(client);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setClientToEdit(null);
        setIsDialogOpen(false);
        setError(null); // Clear any errors when closing
    };

    return (
        <div className="entities-page">
            <div className="entities-header">
                <h1>Clients</h1>
                <Button onClick={() => { setClientToEdit(null); setIsDialogOpen(true); }}>Create Client</Button>
            </div>

            {/* Error Message Display */}
            {error && (
                <div style={{ 
                        padding: '5px', 
                        color: '#d32f2f', 
                        textAlign: 'center', 
                        backgroundColor: 'black', 
                        borderRadius: '4px', 
                        margin: '10px' 
                    }}>
                    <span>❌ {error}</span>
                    <button
                        onClick={() => setError(null)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '0 5px'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#888'
                }}>
                    <p>Loading clients...</p>
                </div>
            ) : (
                <div className="entities-list">
                    {clients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onEdit={() => openEditDialog(client)}
                            onDelete={() => openDeleteDialog(client.id)}
                        />
                    ))}

                    {clients.length === 0 && (
                        <p className="no-entities-message">
                            No clients added yet. Click 'Create Client' to get started!
                        </p>
                    )}
                </div>
            )}

            <CreateClientDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                clientToEdit={clientToEdit}
                onSubmit={clientToEdit ? handleEditClient : handleCreateClient}
                isSubmitting={isSubmitting}
            />

            <DeleteClientDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDeleteClient}
            />
        </div>
    );
}