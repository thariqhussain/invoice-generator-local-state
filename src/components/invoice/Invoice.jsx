import { useState, useEffect } from 'react';
import Button from '../../reusables/Button';
import InvoicePrintView from './InvoicePrintView';
import InvoicePDFPreview from './InvoicePDFPreview';
import { templateCRUD, invoiceCRUD } from '../../services/crudService';
import { BASE_URL } from '../../config/api';
import './Invoice.css';
import backIcon from '../../assets/invoice/back.png';
import downloadZipIcon from '../../assets/downloadZip.png';
import editIcon from '../../assets/editNew.png';
import cancelIcon from '../../assets/remove.png';
import saveIcon from '../../assets/diskette.png';
import spinnerIcon from '../../assets/loading.png';
import InvoiceCard from './InvoiceCard';
import JSZip from 'jszip';
import { pdf } from '@react-pdf/renderer';

export default function Invoice() {
    const [viewMode, setViewMode] = useState('list');
    const [templates, setTemplates] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [invoiceData, setInvoiceData] = useState(null);
    const [previewType, setPreviewType] = useState('web');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [editableData, setEditableData] = useState(null);
    const [originalData, setOriginalData] = useState(null);

    const [showEntityDropdown, setShowEntityDropdown] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState('');
    const [mainEntities, setMainEntities] = useState([]);
    const [isLoadingEntities, setIsLoadingEntities] = useState(false);

    const [showHierarchy, setShowHierarchy] = useState(true);

    const fetchTemplateData = async (templateId) => {
        try {
            const url = `${BASE_URL}/api/invoice/print-view?template_id=${templateId}&hirearchy=True`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch template data');
            }

            const data = await response.json();
            return {
                company: data.company,
                client: data.client
            };
        } catch (err) {
            console.error('Error fetching template data:', err);
            throw err;
        }
    };


    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const templateResult = await templateCRUD.getAll();
            const savedInvoices = (JSON.parse(localStorage.getItem('invoicesList')) || []).filter(
                invoice => invoice.invoice_id && invoice.invoice_id !== 'undefined'
            );
            
            if (savedInvoices.length > 0) {
                setInvoices(savedInvoices);
            }

            if (templateResult.success) {
                setTemplates(templateResult.data);
            }

            const invoiceResult = await invoiceCRUD.getAll();
            if (invoiceResult.success) {
                const mergedInvoices = [...savedInvoices];
                invoiceResult.data.forEach(apiInvoice => {
                    if (!mergedInvoices.find(inv => inv.id === apiInvoice.invoice_id)) {
                        mergedInvoices.push(apiInvoice);
                    }
                });
                setInvoices(mergedInvoices);
                localStorage.setItem('invoicesList', JSON.stringify(mergedInvoices));
            } else if (savedInvoices.length === 0) {
                setInvoices([]);
            }
        } catch (err) {
            setError('Failed to load data');
        }

        setIsLoading(false);
    };

    const generateInvoiceNumber = (invoiceId) => {
        return `INV-${String(invoiceId).padStart(3, '0')}`;
    };

    const handleTemplateChange = (templateId) => {
        setSelectedTemplate(templateId);
        setShowEntityDropdown(false);
        setSelectedEntity('');
        setMainEntities([]);

        setShowHierarchy(true);
    };

    const handleIndividualInvoiceClick = async () => {
        if (!selectedTemplate) {
            setError('Please select a template first');
            return;
        }

        setIsLoadingEntities(true);
        setError(null);

        try {
            const url = `${BASE_URL}/api/invoice/print-view?template_id=${selectedTemplate}&hirearchy=True`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to load entities');
            }

            const data = await response.json();
            
            // Extract main entities (chain[0] items)
            const entities = data.invoice_items
                .filter(chain => Array.isArray(chain) && chain.length > 0)
                .map((chain, index) => ({
                    id: index,
                    name: chain[0].name,
                    country: chain[0].country || 'N/A',
                    chainData: chain,
                    fullInvoiceData: data // âœ… CORRECTION-1 FIX: Store full invoice data for each entity
                }));
            
            setMainEntities(entities);
            setShowEntityDropdown(true);
        } catch (err) {
            setError(err.message || 'Error loading entities');
        }

        setIsLoadingEntities(false);
    };

    const handleGenerateBulkInvoice = async () => {
        if (!selectedTemplate) {
            setError('Please select a template');
            return;
        }

        window.__currentInvoiceData = null;
        setIsGenerating(true);
        setError(null);

        try {
            const url = `${BASE_URL}/api/invoice/print-view?template_id=${selectedTemplate}&hirearchy=True`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to generate invoice');
            }

            const data = await response.json();
            
            const uniqueInvoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const invoiceWithId = {
                ...data,
                invoice_id: uniqueInvoiceId,
                invoice_type: 'bulk',
                show_project_hirearchy: showHierarchy // âœ… ADD THIS LINE
            };
            console.log('ðŸ”µ BULK INVOICE GENERATION:', {
                invoice_type: 'bulk',
                show_project_hirearchy: showHierarchy,
                showHierarchyState: showHierarchy,
                itemsCount: data.invoice_items.length
            });
            
            setInvoiceData(invoiceWithId);
            setViewMode('preview');
            setPreviewType('web');
            setIsDialogOpen(false);
            setSelectedTemplate('');
            setShowEntityDropdown(false);
        } catch (err) {
            setError(err.message || 'Error generating invoice');
        }

        setIsGenerating(false);
        setShowHierarchy(true);
    };

    // âœ… CORRECTION-1 FIX: Properly filter invoice data for individual entity
    const handleGenerateIndividualInvoice = async () => {
        if (!selectedEntity) {
            setError('Please select an entity');
            return;
        }

        window.__currentInvoiceData = null;
        setIsGenerating(true);
        setError(null);

        try {
            // âœ… ENHANCEMENT-2: Handle "All" option
            if (selectedEntity === 'all') {
                // Generate multiple invoices for all entities
                const invoices = [];
                
                for (let entityIndex = 0; entityIndex < mainEntities.length; entityIndex++) {
                    const entity = mainEntities[entityIndex];
                    const fullData = entity.fullInvoiceData;
                    const selectedChainData = entity.chainData;
                    
                    let individualTotal = 0;
                    if (Array.isArray(selectedChainData)) {
                        selectedChainData.forEach(item => {
                            const duration = item.duration !== undefined ? item.duration : 1;
                            const rate = item.rate_amount || (item.project?.rate_amount || 0);
                            individualTotal += (duration * rate);
                        });
                    }

                    const filteredData = {
                        ...fullData,
                        invoice_items: [selectedChainData],
                        client_name: `${entity.name}, ${entity.country}`,
                        entity_name: `${entity.name}, ${entity.country}`,
                        total_amount: individualTotal,
                        show_project_hirearchy: showHierarchy
                    };
                    
                    const entityNameShort = entity.name.split(',')[0].trim().replace(/\s+/g, '-');
                    const uniqueInvoiceId = `INV-${Date.now()}-IND-${entityNameShort}-${entityIndex}`;
                    
                    const invoiceWithId = {
                        ...filteredData,
                        invoice_id: uniqueInvoiceId,
                        invoice_type: 'individual',
                        entity_name: `${entity.name}, ${entity.country}`,
                        total_amount: individualTotal
                    };

                    invoices.push(invoiceWithId);
                }

                // Store all invoices with special flag for horizontal display
                setInvoiceData({
                    invoice_type: 'individual-all',
                    invoices: invoices,
                    show_project_hirearchy: showHierarchy
                });
                setViewMode('preview');
                setPreviewType('web');
                setIsDialogOpen(false);
                setSelectedTemplate('');
                setShowEntityDropdown(false);
                setSelectedEntity('');
            } else {
                // Original single entity logic
                const entityIndex = parseInt(selectedEntity);
                const entity = mainEntities[entityIndex];
                
                if (!entity) {
                    throw new Error('Entity not found');
                }

                const fullData = entity.fullInvoiceData;
                const selectedChainData = entity.chainData;
                
                let individualTotal = 0;
                if (Array.isArray(selectedChainData)) {
                    selectedChainData.forEach(item => {
                        const duration = item.duration !== undefined ? item.duration : 1;
                        const rate = item.rate_amount || (item.project?.rate_amount || 0);
                        individualTotal += (duration * rate);
                    });
                }

                const filteredData = {
                    ...fullData,
                    invoice_items: [selectedChainData],
                    client_name: `${entity.name}, ${entity.country}`,
                    entity_name: `${entity.name}, ${entity.country}`,
                    total_amount: individualTotal,
                    show_project_hirearchy: showHierarchy
                };
                
                const entityNameShort = entity.name.split(',')[0].trim().replace(/\s+/g, '-');
                const uniqueInvoiceId = `INV-${Date.now()}-IND-${entityNameShort}`;
                
                const invoiceWithId = {
                    ...filteredData,
                    invoice_id: uniqueInvoiceId,
                    invoice_type: 'individual',
                    entity_name: `${entity.name}, ${entity.country}`,
                    total_amount: individualTotal
                };

                setInvoiceData(invoiceWithId);
                setViewMode('preview');
                setPreviewType('web');
                setIsDialogOpen(false);
                setSelectedTemplate('');
                setShowEntityDropdown(false);
                setSelectedEntity('');
            }
        } catch (err) {
            console.error('Error generating individual invoice:', err);
            setError(err.message || 'Error generating invoice');
        }

        setIsGenerating(false);
        setShowHierarchy(true);
    };

    const handleSaveInvoice = async (invoiceData) => {
        if (invoiceData.invoice_type === 'individual-all' && Array.isArray(invoiceData.invoices)) {
            // Save all invoices
            try {
                const savedInvoicesList = [];
                for (const invoice of invoiceData.invoices) {
                    const result = await handleSaveInvoice(invoice);
                    savedInvoicesList.push(result);
                }
                return { message: `${savedInvoicesList.length} invoices saved successfully` };
            } catch (err) {
                setError(err.message || 'Error saving invoices');
                throw err;
            }
        }
        try {
            const url = `${BASE_URL}/api/invoice`;
            
            const convertDateFormat = (dateString) => {
                if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
                    return dateString;
                }
                
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                    const [year, month, day] = dateString.split('-');
                    return `${day}-${month}-${year}`;
                }
                
                const months = {
                    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                };
                
                const parts = dateString.split(' ');
                const day = parts[0].replace(',', '').padStart(2, '0');
                const month = months[parts[1]];
                const year = parts[2];
                
                return `${day}-${month}-${year}`;
            };

            // âœ… ISSUE-2 FIX: Calculate totalAmount correctly for both bulk and individual invoices
            let totalAmount = 0;
            
            if (invoiceData.invoice_type === 'individual') {
                // For individual invoices, calculate from the single chain only
                if (Array.isArray(invoiceData.invoice_items) && invoiceData.invoice_items.length > 0) {
                    const chain = invoiceData.invoice_items[0];
                    if (Array.isArray(chain)) {
                        chain.forEach(item => {
                            const duration = item.duration !== undefined ? item.duration : 1;
                            const rate = item.rate_amount || (item.project?.rate_amount || 0);
                            totalAmount += (duration * rate);
                        });
                    }
                }
            } else {
                // For bulk invoices, calculate from all chains
                totalAmount = invoiceData.invoice_items.reduce((sum, chain) => {
                    if (!Array.isArray(chain)) return sum;
                    const chainTotal = chain.reduce((chainSum, item) => {
                        const duration = item.duration !== undefined ? item.duration : 1;
                        const rate = item.rate_amount || (item.project?.rate_amount || 0);
                        return chainSum + (duration * rate);
                    }, 0);
                    return sum + chainTotal;
                }, 0);
            }

            const payload = {
                template_id: invoiceData.template_id,
                invoice_date: convertDateFormat(invoiceData.invoice_date),
                due_date: convertDateFormat(invoiceData.due_date),
                show_project_hirearchy: invoiceData.show_project_hirearchy || false,
                total_amount: totalAmount,
                status: 'draft',
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || errorData.message || 'Failed to save invoice');
            }

            const result = await response.json();

            // Determine client_name based on invoice type
            let displayClientName;
            if (invoiceData.invoice_type === 'individual') {
                displayClientName = invoiceData.entity_name;
            } else {
                displayClientName = invoiceData.client?.name || 'N/A';
            }

            const completeInvoice = {
                invoice_id: invoiceData.invoice_id,
                invoice_type: invoiceData.invoice_type || 'bulk',
                entity_name: invoiceData.entity_name || null,
                message: result.message,
                template_id: invoiceData.template_id,
                invoice_date: invoiceData.invoice_date,
                due_date: invoiceData.due_date,
                total_amount: totalAmount,
                status: 'draft',
                client_name: displayClientName,
                invoice_items: invoiceData.invoice_items,
                show_project_hirearchy: invoiceData.show_project_hirearchy ,
                company: invoiceData.company,     // ← ADD THIS
                client: invoiceData.client  
            };
            
            const savedInvoices = JSON.parse(localStorage.getItem('invoicesList')) || [];
            const invoiceIndex = savedInvoices.findIndex(inv => inv.invoice_id === completeInvoice.invoice_id);

            if (invoiceIndex !== -1) {
                savedInvoices[invoiceIndex] = completeInvoice;
                setInvoices(savedInvoices);
                localStorage.setItem('invoicesList', JSON.stringify(savedInvoices));
            } else {
                const updatedInvoices = [...savedInvoices, completeInvoice];
                setInvoices(updatedInvoices);
                localStorage.setItem('invoicesList', JSON.stringify(updatedInvoices));
            }

            return completeInvoice;
        } catch (err) {
            setError(err.message || 'Error saving invoice');
            throw err;
        }
    };

    const handleEditToggle = async () => {
        if (editMode) {
            setIsSaving(true);
            try {
                const updatedPayload = {
                    ...invoiceData,
                    invoice_date: window.__currentInvoiceData?.invoice_date || invoiceData.invoice_date,
                    due_date: window.__currentInvoiceData?.due_date || invoiceData.due_date,
                    invoice_items: window.__currentInvoiceData?.invoice_items || invoiceData.invoice_items,
                        show_project_hirearchy: window.__currentInvoiceData?.show_project_hirearchy ?? invoiceData.show_project_hirearchy 
                };

                await handleSaveInvoice(updatedPayload);
                setHasChanges(false);
                setEditMode(false);
                setIsSaving(false);
            } catch (error) {
                console.error('Save failed:', error);
                setIsSaving(false);
            }
        } else {
            setEditMode(true);
        }
    };

    const handleQuickSave = async () => {
        setIsSaving(true);

        try {
            const updatedPayload = {
                ...invoiceData,
                invoice_date: window.__currentInvoiceData?.invoice_date || invoiceData.invoice_date,
                due_date: window.__currentInvoiceData?.due_date || invoiceData.due_date,
                invoice_items: window.__currentInvoiceData?.invoice_items || invoiceData.invoice_items,
                    show_project_hirearchy: window.__currentInvoiceData?.show_project_hirearchy ?? invoiceData.show_project_hirearchy 
            };

            await handleSaveInvoice(updatedPayload);
            setHasChanges(false);
            setEditMode(false);
            setIsSaving(false);
        } catch (error) {
            console.error('Save failed:', error);
            setIsSaving(false);
        }
    };

    const handleQuickSaveMultiple = async () => {
        setIsSaving(true);

        try {
            for (const invoice of invoiceData.invoices) {
                const updatedPayload = {
                    ...invoice,
                    invoice_date: invoice.invoice_date,
                    due_date: invoice.due_date,
                    invoice_items: invoice.invoice_items,
                    show_project_hirearchy: invoice.show_project_hirearchy ?? true
                };

                await handleSaveInvoice(updatedPayload);
            }
            
            setHasChanges(false);
            setEditMode(false);
            setIsSaving(false);
        } catch (error) {
            console.error('Save failed:', error);
            setIsSaving(false);
        }
    };

    const handleDownloadAllPDFs = async () => {
        try {
            const zip = new JSZip();
            
            for (let i = 0; i < invoiceData.invoices.length; i++) {
                const invoice = invoiceData.invoices[i];
                const entityName = invoice.entity_name.split(',')[0].trim().replace(/\s+/g, '-');
                const fileName = `Invoice-${entityName}-${invoice.invoice_date}.pdf`;
                
                // Generate PDF blob
                const InvoicePDF = (await import('./InvoicePDF')).default;
                const blob = await pdf(<InvoicePDF invoiceData={invoice} />).toBlob();
                
                // Add to zip
                zip.file(fileName, blob);
            }
            
            // Generate and download zip
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `Invoices-${new Date().toISOString().split('T')[0]}.zip`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading PDFs:', error);
            setError('Failed to download invoices');
        }
    };

    const handleCancel = () => {
        setInvoiceData(invoiceData);
        setHasChanges(false);
        setEditMode(false);
    };

    const handleDownloadPDF = () => {
        if (editMode) {
            alert('Please save or cancel your changes before downloading.');
            return;
        }
        window.print();
    };

    const handleBackToList = () => {
        window.__currentInvoiceData = null;
        setViewMode('list');
        setInvoiceData(null);
        setSelectedTemplate('');
        setPreviewType('web');
        setEditMode(false);
        fetchInitialData(); // Refresh the list
    };

    const handleEditInvoice = async (invoice) => {
        try {
            setIsLoading(true);
            setError(null);

            // Step 1: Get invoice data from localStorage
            const savedInvoices = JSON.parse(localStorage.getItem('invoicesList')) || [];
            const fullInvoice = savedInvoices.find(inv => inv.invoice_id === invoice.invoice_id);

            if (!fullInvoice) {
                setError('Invoice data not found in localStorage');
                setIsLoading(false);
                return;
            }

            // Step 2: Check if company and client data exists
            if (!fullInvoice.company || !fullInvoice.client) {
                // Fetch from API if missing
                console.log('🔄 Fetching missing company/client data from API...');
                
                const templateData = await fetchTemplateData(fullInvoice.template_id);
                
                const completeInvoiceData = {
                    ...fullInvoice,
                    company: templateData.company,
                    client: templateData.client
                };

                // Update localStorage
                const updatedInvoices = savedInvoices.map(inv => 
                    inv.invoice_id === invoice.invoice_id ? completeInvoiceData : inv
                );
                localStorage.setItem('invoicesList', JSON.stringify(updatedInvoices));

                setInvoiceData(completeInvoiceData);
            } else {
                console.log('✅ Using complete data from localStorage');
                setInvoiceData(fullInvoice);
            }

            setViewMode('preview');
            setPreviewType('web');
            setEditMode(false);
            setIsLoading(false);

        } catch (err) {
            console.error('❌ Error in handleEditInvoice:', err);
            setError(err.message || 'Failed to load invoice for editing');
            setIsLoading(false);
        }
    };

    const handleDeleteInvoice = async (invoice) => {
        if (!invoice.invoice_id) {
            setError('Cannot delete: Invoice ID is missing');
            return;
        }
        
        try {
            const savedInvoices = JSON.parse(localStorage.getItem('invoicesList')) || [];
            const updatedInvoices = savedInvoices.filter(inv => inv.invoice_id !== invoice.invoice_id);
            
            localStorage.setItem('invoicesList', JSON.stringify(updatedInvoices));
            setInvoices(updatedInvoices);
        } catch (err) {
            console.error('Delete error:', err);
            setError(err.message || 'Error deleting invoice');
        }
    };

    const handleCloseDialog = () => {
        window.__currentInvoiceData = null;
        setIsDialogOpen(false);
        setSelectedTemplate('');
        setShowEntityDropdown(false);
        setSelectedEntity('');
        setMainEntities([]);
        setError(null);
        setShowHierarchy(true);
        setInvoiceData(null);
    };

    if (viewMode === 'preview' && invoiceData?.invoice_type === 'individual-all') {
        return (
            <div className="invoice-page">
                <div className="preview-selector">
                    <div className="preview-tabs">
                        <button 
                            className={`preview-tab ${previewType === 'web' ? 'active' : ''}`}
                            onClick={() => setPreviewType('web')}
                        >
                            🌐 Web Preview
                        </button>
                        <button 
                            className={`preview-tab ${previewType === 'pdf' ? 'active' : ''}`}
                            onClick={() => setPreviewType('pdf')}
                        >
                            📄 PDF Preview
                        </button>
                    </div>
                    
                    <div className="preview-action-buttons">
                        {previewType === 'pdf' && (
                            <>
                                <button
                                    className="action-btn download-btn"
                                    style={{
                                        background: 'white',
                                        boxShadow: '0px 4px 10px rgba(0,0,0,0.6)'
                                    }}
                                    onClick={handleDownloadAllPDFs}
                                    title="Download all invoices"
                                >
                                    <img src={downloadZipIcon} alt='download-icon' style={{ filter: 'brightness(0)' }} />
                                </button>
                            </>
                        )}
                        {previewType === 'web' ? (
                            <>
                                <button
                                    className={`action-btn save-transform-btn ${editMode ? 'text-mode' : 'icon-mode'}`}
                                    onClick={() => {
                                        if (editMode) {
                                            handleQuickSaveMultiple();
                                        } else {
                                            setEditMode(true);
                                        }
                                    }}
                                    disabled={isSaving}
                                    title={editMode ? "Save all invoices" : "Save invoices"}
                                >
                                    {isSaving ? (
                                        <img src={spinnerIcon} alt='spinner-icon' className="spinner-icon" />
                                    ) : editMode ? (
                                        <span className="save-edit-text">Save All</span>
                                    ) : (
                                        <img src={saveIcon} alt='save-icon' className="save-icon" />
                                    )}
                                </button>

                                {!editMode && (
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => setEditMode(true)}
                                        disabled={isSaving}
                                        title="Edit all invoices"
                                    >
                                        <img src={editIcon} alt='edit-icon' />
                                    </button>
                                )}

                                {!editMode ? (
                                    <button 
                                        className="round-btn round-btn-back" 
                                        onClick={handleBackToList} 
                                        title="Back to list"
                                    >
                                        <img src={backIcon} alt='back-button' />
                                    </button>
                                ) : (
                                    <button
                                        className="action-btn cancel-btn"
                                        onClick={() => setEditMode(false)}
                                        disabled={isSaving}
                                        title="Cancel editing"
                                    >
                                        <img src={cancelIcon} alt='cancel-icon' />
                                    </button>
                                )}
                            </>
                        ) : (
                            <button 
                                className="round-btn round-btn-back" 
                                onClick={handleBackToList} 
                                title="Back to list"
                            >
                                <img src={backIcon} alt='back-button' />
                            </button>
                        )}
                    </div>
                </div>

                {previewType === 'web' ? (
                    <div className="multiple-invoices-container">
                        {invoiceData.invoices.map((invoice, index) => (
                            <InvoicePrintView 
                                key={invoice.invoice_id}
                                invoiceData={invoice}
                                onBack={handleBackToList}
                                onSave={handleSaveInvoice}
                                onEditToggle={handleEditToggle}
                                onQuickSave={handleQuickSave}
                                onCancel={handleCancel}
                                editMode={editMode}
                                isSaving={isSaving}
                                hasChanges={hasChanges}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="multiple-pdf-preview-container">
                        {invoiceData.invoices.map((invoice, index) => (
                            <div key={invoice.invoice_id} className="pdf-preview-item">
                                <InvoicePDFPreview invoiceData={invoice} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }


    // Show Preview Mode
        if (viewMode === 'preview' && invoiceData && invoiceData.invoice_type !== 'individual-all') {
        return (
            <div className="invoice-page">
                <div className="preview-selector">
                    <div className="preview-tabs">
                        <button 
                            className={`preview-tab ${previewType === 'web' ? 'active' : ''}`}
                            onClick={() => setPreviewType('web')}
                        >
                            ðŸŒ Web Preview
                        </button>
                        <button 
                            className={`preview-tab ${previewType === 'pdf' ? 'active' : ''}`}
                            onClick={() => setPreviewType('pdf')}
                        >
                            ðŸ“„ PDF Preview
                        </button>
                    </div>
                    
                    <div className="preview-action-buttons">
                        {previewType === 'web' ? (
                            <>
                                <button
                                    className={`action-btn save-transform-btn ${editMode ? 'text-mode' : 'icon-mode'}`}
                                    onClick={handleQuickSave}
                                    disabled={isSaving}
                                    title={editMode ? "Save changes" : "Save invoice"}
                                >
                                    {isSaving ? (
                                        <img src={spinnerIcon} alt='spinner-icon' className="spinner-icon" />
                                    ) : editMode ? (
                                        <span className="save-edit-text">Save Edit</span>
                                    ) : (
                                        <img src={saveIcon} alt='save-icon' className="save-icon" />
                                    )}
                                </button>

                                {!editMode && (
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={handleEditToggle}
                                        disabled={isSaving || editMode}
                                        title="Edit invoice"
                                    >
                                        <img src={editIcon} alt='edit-icon' />
                                    </button>
                                )}

                                {!editMode ? (
                                    <button 
                                        className="round-btn round-btn-back" 
                                        onClick={handleBackToList} 
                                        title="Back"
                                    >
                                        <img src={backIcon} alt='back-button' />
                                    </button>
                                ) : (
                                    <button
                                        className="action-btn cancel-btn"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        title="Cancel editing"
                                    >
                                        <img src={cancelIcon} alt='cancel-icon' />
                                    </button>
                                )}
                            </>
                        ) : (
                            <button 
                                className="round-btn round-btn-back" 
                                onClick={handleBackToList} 
                                title="Back to list"
                            >
                                <img src={backIcon} alt='back-button' />
                            </button>
                        )}
                    </div>
                </div>

                {previewType === 'web' ? (
                    <InvoicePrintView 
                        invoiceData={window.__currentInvoiceData || invoiceData}
                        onBack={handleBackToList}
                        onSave={handleSaveInvoice}
                        onEditToggle={handleEditToggle}
                        onQuickSave={handleQuickSave}
                        onCancel={handleCancel}
                        editMode={editMode}
                        isSaving={isSaving}
                        hasChanges={hasChanges}
                    />
                ) : (
                    <InvoicePDFPreview 
                        invoiceData={window.__currentInvoiceData || invoiceData}
                    />
                )}
            </div>
        );
    }

    // Show List Mode
    return (
        <div className="invoice-page">
            <div className="invoice-header">
                <h1>Invoices</h1>
                <Button onClick={() => setIsDialogOpen(true)}>Generate Invoice</Button>
            </div>

            {error && (
                <div className="error-banner">
                    <span>âš ï¸ {error}</span>
                    <button onClick={() => setError(null)}>âœ•</button>
                </div>
            )}

            {isLoading ? (
                <div className="loading-container">
                    <p>Loading invoices...</p>
                </div>
            ) : (
                <div className="invoice-list">
                    {invoices
                        .filter(invoice => invoice.invoice_id && invoice.invoice_id !== 'undefined')
                        .map((invoice) => (
                        <InvoiceCard
                            key={invoice.invoice_id}
                            invoice={invoice}
                            onEdit={handleEditInvoice}
                            onDelete={handleDeleteInvoice}
                            generateInvoiceNumber={generateInvoiceNumber}
                        />
                    ))}

                    {invoices.filter(invoice => invoice.invoice_id && invoice.invoice_id !== 'undefined').length === 0 && (
                        <p className="no-invoices-message">
                            No invoices generated yet. Click 'Generate Invoice' to get started!
                        </p>
                    )}
                </div>
            )}

            {/* Enhanced Generate Invoice Dialog */}
            <div className={`generate-dialog-overlay ${isDialogOpen ? 'open' : ''}`} onClick={handleCloseDialog}>
                <div className="generate-dialog-content" onClick={(e) => e.stopPropagation()}>
                    <h3>Generate Invoice</h3>
                    
                    <div style={{ marginBottom: '25px' }}>
                        <label htmlFor="template-select">Select Template </label>
                        <select
                            id="template-select"
                            value={selectedTemplate}
                            onChange={(e) => handleTemplateChange(e.target.value)}
                            disabled={isGenerating || isLoadingEntities}
                        >
                            <option value="">-- Choose a template --</option>
                            {templates.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>

                        {selectedTemplate && !showEntityDropdown && (
                            <div className="template-info-box">
                                <p>Template selected successfully</p>
                                <p>
                                    {templates.find(t => t.id === parseInt(selectedTemplate))?.description || 'Ready to generate invoice'}
                                </p>
                            </div>
                        )}
                        {/* Hierarchy toggling */}
                        {selectedTemplate && (
                            <div className="checkbox-row" style={{ marginBottom: '25px' }}>
                                <input 
                                    id="show-hierarchy-checkbox" 
                                    type="checkbox" 
                                    checked={showHierarchy}
                                    onChange={(e) => setShowHierarchy(e.target.checked)}
                                    disabled={isGenerating || isLoadingEntities}
                                />
                                <label htmlFor="show-hierarchy-checkbox" style={{margin: 0, display: 'inline'}}>
                                    Show Hierarchy (Show sub-entities in invoice description)
                                </label>
                            </div>
                        )}
                    </div>

                    {showEntityDropdown && (
                        <div style={{ 
                            marginBottom: '25px',
                            padding: '20px',
                            background: '#f0f9ff',
                            borderRadius: '12px',
                            border: '2px solid #3b82f6',
                            animation: 'slideDown 0.3s ease'
                        }}>
                            <label htmlFor="entity-select" style={{ 
                                display: 'block',
                                marginBottom: '10px',
                                fontWeight: 600,
                                color: '#1e40af',
                                fontSize: '0.95rem'
                            }}>
                                Select Main Entity *
                            </label>
                            <select
                                id="entity-select"
                                value={selectedEntity}
                                onChange={(e) => setSelectedEntity(e.target.value)}
                                disabled={isGenerating}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #3b82f6',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    color: '#1e293b',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">-- Select an entity --</option>
                                <option value="all">All Entities</option>
                                {mainEntities.map((entity) => (
                                    <option key={entity.id} value={entity.id}>
                                        {entity.name}, {entity.country}
                                    </option>
                                ))}
                            </select>
                            {selectedEntity !== '' && (
                                <div style={{ 
                                    padding: '12px',
                                    background: selectedEntity === 'all' ? '#dcfce7' : 'white',
                                    borderRadius: '8px',
                                    border: selectedEntity === 'all' ? '1px solid #86efac' : '1px solid #bfdbfe',
                                    marginTop: '12px'
                                }}>
                                    <p style={{ 
                                        fontSize: '0.85rem',
                                        color: selectedEntity === 'all' ? '#15803d' : '#1e40af',
                                        margin: 0,
                                        fontWeight: 600
                                    }}>
                                        {selectedEntity === 'all' 
                                            ? `All ${mainEntities.length} entities will be invoiced` 
                                            : `Entity selected: ${mainEntities.find(e => e.id === parseInt(selectedEntity))?.name}`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="generate-dialog-actions" style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '10px',
                    }}>
                        <button 
                            type="button" 
                            onClick={handleCloseDialog}
                            disabled={isGenerating || isLoadingEntities}
                            style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%'}}
                        >
                            Cancel
                        </button>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {!showEntityDropdown && (
                                <button
                                    type="button"
                                    onClick={handleGenerateBulkInvoice}
                                    disabled={!selectedTemplate || isGenerating || isLoadingEntities}
                                    style={{
                                        background: selectedTemplate && !isGenerating 
                                            ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)'
                                            : 'white',
                                        opacity: !selectedTemplate || isGenerating ? 0.6 : 1
                                    }}
                                >
                                    {isGenerating ? 'Generating...' : 'Generate Bulk Invoice'}
                                </button>
                            )}

                            {!showEntityDropdown ? (
                                <button
                                    type="button"
                                    onClick={handleIndividualInvoiceClick}
                                    disabled={!selectedTemplate || isGenerating || isLoadingEntities}
                                    style={{
                                        background: selectedTemplate && !isGenerating
                                            ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                            : '#cbd5e1',
                                        boxShadow: selectedTemplate ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
                                        opacity: !selectedTemplate || isGenerating ? 0.6 : 1
                                    }}
                                >
                                    {isLoadingEntities ? 'Loading...' : 'Generate Individual Invoice'}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    onClick={handleGenerateIndividualInvoice}
                                    disabled={!selectedEntity || isGenerating}
                                    style={{
                                        background: selectedEntity && !isGenerating
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : '#cbd5e1',
                                        boxShadow: selectedEntity ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                                        opacity: !selectedEntity || isGenerating ? 0.6 : 1
                                    }}
                                >
                                    {isGenerating ? 'Generating...' : selectedEntity === 'all' ? 'Generate All Invoices' : selectedEntity !== '' ? 'Generate Individual' : 'Select Entity'}
                                </button>
                            )}
                        </div>
                    </div>

                    {templates.length === 0 && (
                        <div style={{ 
                            padding: '15px',
                            background: '#fef3c7',
                            borderRadius: '8px',
                            border: '1px solid #fde68a',
                            marginTop: '10px'
                        }}>
                            <p style={{ 
                                fontSize: '2rem',
                                fontFamily: 'bebas neue',
                                textAlign: 'centre',
                                color: '#92400e',
                                margin: 0
                            }}>
                                This section will be Released Sooner than you expect
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}