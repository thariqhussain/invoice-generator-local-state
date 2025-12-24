import { useState, useEffect } from 'react';
import { clientCRUD, companyCRUD, vendorCRUD, consultantCRUD } from '../../services/crudService';

export function useAllEntities() {
    const [allEntities, setAllEntities] = useState([]);

    useEffect(() => {
        const fetchAllEntities = async () => {
            const clients = await clientCRUD.getAll();
            const companies = await companyCRUD.getAll();
            const vendors = await vendorCRUD.getAll();
            const consultants = await consultantCRUD.getAll();

            const combined = [
                ...clients.data.map(c => ({ ...c, type: 'Client' })),
                ...companies.data.map(c => ({ ...c, type: 'Company' })),
                ...vendors.data.map(v => ({ ...v, type: 'Vendor' })),
                ...consultants.data.map(c => ({ ...c, type: 'Consultant' }))
            ];

            setAllEntities(combined);
        };

        fetchAllEntities();
    }, []);

    return allEntities;
}