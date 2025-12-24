// services/crudService.js

import { BASE_URL } from "../config/api";

const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json'
    };
};


export const clientCRUD = {
    create: async (data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
            
            const newClient = {
                id: newId,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Company',
                address: data.address
            };
            
            clients.push(newClient);
            localStorage.setItem('clients', JSON.stringify(clients));
            
            return {
                success: true,
                data: newClient,
                message: 'Client created successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error creating client'
            };
        }
    },

    getAll: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            
            return {
                success: true,
                data: clients,
                message: 'Clients fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.message || 'Error fetching clients'
            };
        }
    },

    getById: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const client = clients.find(c => c.id === id);
            
            if (!client) {
                throw new Error('Client not found');
            }
            
            return {
                success: true,
                data: client,
                message: 'Client fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching client'
            };
        }
    },

    update: async (id, data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const index = clients.findIndex(c => c.id === id);
            
            if (index === -1) {
                throw new Error('Client not found');
            }
            
            clients[index] = {
                id: id,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Company',
                address: data.address
            };
            
            localStorage.setItem('clients', JSON.stringify(clients));
            
            return {
                success: true,
                data: clients[index],
                message: 'Client updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error updating client'
            };
        }
    },

    delete: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const filtered = clients.filter(c => c.id !== id);
            
            if (clients.length === filtered.length) {
                throw new Error('Client not found');
            }
            
            localStorage.setItem('clients', JSON.stringify(filtered));
            
            return {
                success: true,
                message: 'Client deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error deleting client'
            };
        }
    }
};

export const vendorCRUD = {
    create: async (data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
            const newId = vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + 1 : 1;
            
            const newVendor = {
                id: newId,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Company',
                address: data.address
            };
            
            vendors.push(newVendor);
            localStorage.setItem('vendors', JSON.stringify(vendors));
            
            return {
                success: true,
                data: newVendor,
                message: 'Vendor created successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error creating vendor'
            };
        }
    },

    getAll: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
            
            return {
                success: true,
                data: vendors,
                message: 'Vendors fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.message || 'Error fetching vendors'
            };
        }
    },

    getById: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
            const vendor = vendors.find(v => v.id === id);
            
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            
            return {
                success: true,
                data: vendor,
                message: 'Vendor fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching vendor'
            };
        }
    },

    update: async (id, data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
            const index = vendors.findIndex(v => v.id === id);
            
            if (index === -1) {
                throw new Error('Vendor not found');
            }
            
            vendors[index] = {
                id: id,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Company',
                address: data.address
            };
            
            localStorage.setItem('vendors', JSON.stringify(vendors));
            
            return {
                success: true,
                data: vendors[index],
                message: 'Vendor updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error updating vendor'
            };
        }
    },

    delete: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
            const filtered = vendors.filter(v => v.id !== id);
            
            if (vendors.length === filtered.length) {
                throw new Error('Vendor not found');
            }
            
            localStorage.setItem('vendors', JSON.stringify(filtered));
            
            return {
                success: true,
                message: 'vendor deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error deleting vendor'
            };
        }
    }
};

export const companyCRUD = {
    create: async (data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const companies = JSON.parse(localStorage.getItem('companies') || '[]');
            const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
            
            const newCompany = {
                id: newId,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Technology',
                address: data.address
            };
            
            companies.push(newCompany);
            localStorage.setItem('companies', JSON.stringify(companies));
            
            return {
                success: true,
                data: newCompany,
                message: 'Company created successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error creating Company'
            };
        }
    },

    getAll: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const companies = JSON.parse(localStorage.getItem('companies') || '[]');
            
            return {
                success: true,
                data: companies,
                message: 'Companies fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.message || 'Error fetching companies'
            };
        }
    },

    getById: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const companies = JSON.parse(localStorage.getItem('companies') || '[]');
            const company = companies.find(c => c.id === id);
            
            if (!company) {
                throw new Error('Company not found');
            }
            
            return {
                success: true,
                data: company,
                message: 'Company fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching company'
            };
        }
    },

    update: async (id, data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const companies = JSON.parse(localStorage.getItem('companies') || '[]');
            const index = companies.findIndex(c => c.id === id);
            
            if (index === -1) {
                throw new Error('Company not found');
            }
            
            companies[index] = {
                id: id,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Technology',
                address: data.address
            };
            
            localStorage.setItem('companies', JSON.stringify(companies));
            
            return {
                success: true,
                data: companies[index],
                message: 'Company updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error updating company'
            };
        }
    },

    delete: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const companies = JSON.parse(localStorage.getItem('companies') || '[]');
            const filtered = companies.filter(c => c.id !== id);
            
            if (companies.length === filtered.length) {
                throw new Error('Company not found');
            }
            
            localStorage.setItem('companies', JSON.stringify(filtered));
            
            return {
                success: true,
                message: 'company deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error deleting company'
            };
        }
    }
};

export const consultantCRUD = {
    create: async (data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const consultants = JSON.parse(localStorage.getItem('consultants') || '[]');
            const newId = consultants.length > 0 ? Math.max(...consultants.map(c => c.id)) + 1 : 1;
            
            const newConsultant = {
                id: newId,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Individual',
                type3: data.type3 || 'InHouse',
                address: data.address
            };
            
            consultants.push(newConsultant);
            localStorage.setItem('consultants', JSON.stringify(consultants));
            
            return {
                success: true,
                data: newConsultant,
                message: 'Consultant created successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error creating Consultant'
            };
        }
    },

    getAll: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const consultants = JSON.parse(localStorage.getItem('consultants') || '[]');
            
            return {
                success: true,
                data: consultants,
                message: 'Consultants fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.message || 'Error fetching consultants'
            };
        }
    },

    getById: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const consultants = JSON.parse(localStorage.getItem('consultants') || '[]');
            const consultant = consultants.find(c => c.id === id);
            
            if (!consultant) {
                throw new Error('consultant not found');
            }
            
            return {
                success: true,
                data: consultant,
                message: 'consultant fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching consultant'
            };
        }
    },

    update: async (id, data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const consultants = JSON.parse(localStorage.getItem('consultants') || '[]');
            const index = consultants.findIndex(c => c.id === id);
            
            if (index === -1) {
                throw new Error('Consultant not found');
            }
            
            consultants[index] = {
                id: id,
                name: data.name,
                email: data.email,
                country: data.country,
                mobile: data.mobile,
                type2: data.type2 || 'Individual',
                type3: data.type3 || 'NotApplicable',
                address: data.address
            };
            
            localStorage.setItem('consultants', JSON.stringify(consultants));
            
            return {
                success: true,
                data: consultants[index],
                message: 'Consultant updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error updating consultant'
            };
        }
    },

    delete: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const consultants = JSON.parse(localStorage.getItem('consultants') || '[]');
            const filtered = consultants.filter(c => c.id !== id);
            
            if (consultants.length === filtered.length) {
                throw new Error('Consultant not found');
            }
            
            localStorage.setItem('consultants', JSON.stringify(filtered));
            
            return {
                success: true,
                message: 'consultant deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error deleting consultant'
            };
        }
    }
};

export const projectCRUD = {
    create: async (data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
            
            const newProject = {
                id: newId,
                name: data.name,
                description: data.description,
                start_date: data.startDate,
                end_date: data.endDate,
                given_by: data.givenByName,
                given_by_id: data.givenById,
                taken_by: data.takenByName,
                taken_by_id: data.takenById,
                rate_mode: data.rateMode,
                rate_amount: parseFloat(data.rateAmount),
                currency: data.currency
            };
            
            projects.push(newProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            
            return {
                success: true,
                data: newProject,
                message: 'Project created successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error creating project'
            };
        }
    },

    getAll: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            
            return {
                success: true,
                data: projects,
                message: 'Projects fetched successfully'
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.message || 'Error fetching projects'
            };
        }
    },

    update: async (id, data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const index = projects.findIndex(p => p.id === id);
            
            if (index === -1) {
                throw new Error('Project not found');
            }
            
            projects[index] = {
                id: id,
                name: data.name,
                description: data.description,
                start_date: data.startDate,
                end_date: data.endDate,
                given_by: data.givenByName,
                given_by_id: data.givenById,
                taken_by: data.takenByName,
                taken_by_id: data.takenById,
                rate_mode: data.rateMode,
                rate_amount: parseFloat(data.rateAmount),
                currency: data.currency
            };
            
            localStorage.setItem('projects', JSON.stringify(projects));
            
            return {
                success: true,
                data: projects[index],
                message: 'Project updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error updating project'
            };
        }
    },

    delete: async (id) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const filtered = projects.filter(p => p.id !== id);
            
            if (projects.length === filtered.length) {
                throw new Error('Project not found');
            }
            
            localStorage.setItem('projects', JSON.stringify(filtered));
            
            return {
                success: true,
                message: 'project deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error deleting project'
            };
        }
    }
};

export const templateCRUD = {
    create: async (data) => {
        try {
            const url = `${BASE_URL}/api/template`;
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || 'Failed to create Template';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return {
                success: true,
                data: result,
                message: 'Template created successfully'
            };
        } catch (error) {
            console.error('Create Template error:', error);
            return {
                success: false,
                message: error.message || 'Error creating Template'
            };         
        }
    },

    getAll: async () => {
        try {
            const url = `${BASE_URL}/api/templates`;
            const response = await fetch(url, { 
                method: 'GET', 
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to fetch templates');
            const data = await response.json();
            const templatesArray = Object.values(data);
            return { 
                success: true, 
                data: templatesArray, 
                message: 'Templates fetched successfully' 
            };
        } catch (error) {
            return { success: false, data: [], message: error.message || 'Error fetching templates' };
        }
    },

    update: async (id, data) => {
        try {
            const url = `${BASE_URL}/api/template?template_id=${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to update template');
            const result = await response.json();
            return { success: true, data: result, message: 'Template updated successfully' };
        } catch (error) {
            return { success: false, message: error.message || 'Error updating template' };
        }
    },

    delete: async (id) => {
        try {
            const url = `${BASE_URL}/api/template?template_id=${id}`;
            const response = await fetch(url, { method: 'DELETE', headers: getAuthHeaders() });

            if (!response.ok) throw new Error('Failed to delete template');
            return { success: true, message: 'Template deleted successfully' };
        } catch (error) {
            return { success: false, message: error.message || 'Error deleting template' };
        }
    },

    getMermaidDiagram: async (templateId) => {
        try {
            const url = `${BASE_URL}/api/template/tree-view?template_id=${templateId}`;
            const response = await fetch(url, { 
                method: 'GET', 
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to fetch mermaid diagram');
            
            const data = await response.json();
            
            // FIX: Backend returns { script: [...] } array
            // Join array with newlines to create valid Mermaid diagram
            const diagramCode = Array.isArray(data.script) 
                ? data.script.join('\n')
                : data.script;
            
            return { 
                success: true, 
                data: diagramCode,
                message: 'Mermaid diagram fetched successfully' 
            };
        } catch (error) {
            return { 
                success: false, 
                data: null, 
                message: error.message || 'Error fetching mermaid diagram' 
            };
        }
    },
};

// export const invoiceCRUD = {
//     create: async (data) => {
//         try {
//             const url = `${BASE_URL}/invoices`;
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(data)
//             });

//             if (!response.ok) throw new Error('Failed to create invoice');
//             const result = await response.json();
//             return { success: true, data: result, message: 'Invoice created successfully' };
//         } catch (error) {
//             return { success: false, message: error.message || 'Error creating invoice' };
//         }
//     },

//     getAll: async () => {
//         try {
//             const url = `${BASE_URL}/invoices`;
//             const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });

//             if (!response.ok) throw new Error('Failed to fetch invoices');
//             const data = await response.json();
//             return { success: true, data: Array.isArray(data) ? data : data.data || [], message: 'Invoices fetched successfully' };
//         } catch (error) {
//             return { success: false, data: [], message: error.message || 'Error fetching invoices' };
//         }
//     },

//     update: async (id, data) => {
//         try {
//             const url = `${BASE_URL}/invoices/${id}`;
//             const response = await fetch(url, {
//                 method: 'PATCH',
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(data)
//             });

//             if (!response.ok) throw new Error('Failed to update invoice');
//             const result = await response.json();
//             return { success: true, data: result, message: 'Invoice updated successfully' };
//         } catch (error) {
//             return { success: false, message: error.message || 'Error updating invoice' };
//         }
//     },

//     delete: async (id) => {
//         try {
//             const url = `${BASE_URL}/invoices/${id}`;
//             const response = await fetch(url, { method: 'DELETE', headers: getAuthHeaders() });

//             if (!response.ok) throw new Error('Failed to delete invoice');
//             return { success: true, message: 'Invoice deleted successfully' };
//         } catch (error) {
//             return { success: false, message: error.message || 'Error deleting invoice' };
//         }
//     }
// };


export const invoiceCRUD = {
    create: async (data) => {
        try {
            const url = `${BASE_URL}/api/invoice`;
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || 'Failed to create invoice';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return { 
                success: true, 
                data: result, 
                message: 'Invoice created successfully' 
            };
        } catch (error) {
            console.error('Create invoice error:', error);
            return { 
                success: false, 
                message: error.message || 'Error creating invoice' 
            };
        }
    },

    getAll: async () => {
        try {
            const url = `${BASE_URL}/api/invoices`;
            const response = await fetch(url, { 
                method: 'GET', 
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || 'Failed to fetch invoices';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return { 
                success: true, 
                data: Array.isArray(data) ? data : data.data || [], 
                message: 'Invoices fetched successfully' 
            };
        } catch (error) {
            console.error('Get invoices error:', error);
            return { 
                success: false, 
                data: [], 
                message: error.message || 'Error fetching invoices' 
            };
        }
    },

    update: async (id, data) => {
        try {
            const url = `${BASE_URL}/api/invoice?invoice_id=${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || 'Failed to update invoice';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return { 
                success: true, 
                data: result, 
                message: 'Invoice updated successfully' 
            };
        } catch (error) {
            console.error('Update invoice error:', error);
            return { 
                success: false, 
                message: error.message || 'Error updating invoice' 
            };
        }
    },

    delete: async (id) => {
        try {
            const url = `${BASE_URL}/api/invoice?invoice_id=${id}`;
            const response = await fetch(url, { 
                method: 'DELETE', 
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || 'Failed to delete invoice';
                throw new Error(errorMessage);
            }

            return { 
                success: true, 
                message: 'Invoice deleted successfully' 
            };
        } catch (error) {
            console.error('Delete invoice error:', error);
            return { 
                success: false, 
                message: error.message || 'Error deleting invoice' 
            };
        }
    }
};