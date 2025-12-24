// services/invoiceService.js

import easyinvoice from 'easyinvoice';
import { BASE_URL } from "../config/api";

const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json'
    };
};

/**
 * Validates invoice data before processing
 */
const validateInvoiceData = (data) => {
    const errors = [];
    
    if (!data) {
        errors.push('No invoice data provided');
        return { isValid: false, errors };
    }
    
    if (!data.client?.id) errors.push('Client information missing');
    if (!data.company?.id) errors.push('Company information missing');
    if (!Array.isArray(data.invoice_items) || data.invoice_items.length === 0) {
        errors.push('No invoice items found');
    }
    if (!data.invoice_date) errors.push('Invoice date missing');
    if (!data.due_date) errors.push('Due date missing');
    
    // Validate date logic
    if (data.invoice_date && data.due_date) {
        const invoiceDate = new Date(data.invoice_date);
        const dueDate = new Date(data.due_date);
        if (isNaN(invoiceDate.getTime())) errors.push('Invalid invoice date format');
        if (isNaN(dueDate.getTime())) errors.push('Invalid due date format');
        if (dueDate < invoiceDate) errors.push('Due date cannot be before invoice date');
    }
    
    return { isValid: errors.length === 0, errors };
};

/**
 * Parse API date format: "07, Dec 2025" or "06, Jan 2026"
 * Returns: "2025-12-07"
 */
const parseAPIDate = (dateString) => {
    if (!dateString) return null;
    
    try {
        // Handle "07, Dec 2025" format
        const match = dateString.match(/(\d{1,2}),?\s+(\w+)\s+(\d{4})/);
        if (match) {
            const [, day, month, year] = match;
            const monthIndex = new Date(`${month} 1, 2000`).getMonth();
            return new Date(year, monthIndex, day);
        }
        
        // Fallback to standard parsing
        return new Date(dateString);
    } catch (error) {
        console.warn('Date parse error:', error);
        return null;
    }
};

/**
 * Flatten nested invoice items arrays into single array
 */
const flattenInvoiceItems = (invoiceItemsArray) => {
    if (!Array.isArray(invoiceItemsArray)) {
        console.warn('invoiceItemsArray is not an array:', invoiceItemsArray);
        return [];
    }

    const items = [];
    
    invoiceItemsArray.forEach((chain, chainIndex) => {
        // Handle both direct items and nested arrays
        if (!Array.isArray(chain)) {
            // If it's a direct item (not an array), treat it as a single-item chain
            if (chain && chain.project) {
                const item = chain;
                const project = item.project;
                const rate_amount = project.rate_amount || 0;
                const rate_mode = project.rate_mode || 'fixed';
                const currency = project.currency || 'USD';
                
                if (rate_amount > 0) {
                    let quantity = 1;
                    if (rate_mode === 'Hourly' || rate_mode === 'hourly') {
                        quantity = 8;
                    } else if (rate_mode === 'Daily' || rate_mode === 'daily') {
                        quantity = 22;
                    } else if (rate_mode === 'Monthly' || rate_mode === 'monthly') {
                        quantity = 1;
                    }
                    
                    const description = `${item.name} (${item.type1 || 'N/A'})\n${item.address || 'No address'}`;
                    
                    items.push({
                        quantity,
                        description,
                        tax: 0,
                        price: parseFloat(rate_amount) || 0,
                        currency: currency,
                        metadata: {
                            itemName: item.name,
                            itemType: item.type1,
                            chainIndex,
                            itemIndex: 0,
                            rateMode: rate_mode,
                            originalCurrency: currency
                        }
                    });
                }
            }
            return;
        }

        if (chain.length === 0) return;
        
        chain.forEach((item, itemIndex) => {
            if (!item || !item.project) {
                console.warn(`Item at chain ${chainIndex}, index ${itemIndex} missing project`, item);
                return;
            }
            
            const project = item.project;
            const rate_amount = project.rate_amount || 0;
            const rate_mode = project.rate_mode || 'fixed';
            const currency = project.currency || 'USD';
            
            if (rate_amount <= 0) {
                console.warn(`Invalid rate for ${item.name}: ${rate_amount}`);
                return;
            }
            
            // Determine quantity based on rate mode (case-insensitive)
            let quantity = 1;
            const modeLC = rate_mode.toLowerCase();
            if (modeLC === 'hourly') {
                quantity = 8; // Default 8 hours per day
            } else if (modeLC === 'daily') {
                quantity = 22; // Default working days in a month
            } else if (modeLC === 'monthly') {
                quantity = 1;
            }
            
            // Build hierarchy path
            const hierarchyPath = chain
                .slice(0, itemIndex + 1)
                .map(i => `${i.name || 'Unknown'} (${i.type1 || 'N/A'})`)
                .join(' → ');
            
            const description = `${hierarchyPath}\n${item.address || 'No address'}`;
            
            items.push({
                quantity,
                description,
                tax: 0,
                price: parseFloat(rate_amount) || 0,
                currency: currency,
                metadata: {
                    itemName: item.name,
                    itemType: item.type1,
                    chainIndex,
                    itemIndex,
                    rateMode: rate_mode,
                    originalCurrency: currency
                }
            });
        });
    });

    console.log('Flattened items count:', items.length);
    if (items.length === 0) {
        console.warn('No valid items were flattened from:', invoiceItemsArray);
    }

    return items;
};

/**
 * Calculate totals with multi-currency support
 */
const calculateTotals = (items, taxConfig = {}) => {
    const { 
        taxPercentage = 10,
        applyTaxPerItem = false,
        currency = 'USD'
    } = taxConfig;
    
    let subtotal = 0;
    let totalTax = 0;

    items.forEach(item => {
        const itemPrice = (parseFloat(item.price) || 0) * (item.quantity || 1);
        subtotal += itemPrice;
    });
    
    if (applyTaxPerItem) {
        items.forEach(item => {
            const itemPrice = (parseFloat(item.price) || 0) * (item.quantity || 1);
            const itemTax = (itemPrice * taxPercentage) / 100;
            totalTax += itemTax;
        });
    } else {
        totalTax = (subtotal * taxPercentage) / 100;
    }
    
    const total = subtotal + totalTax;

    return { 
        subtotal: round(subtotal),
        tax: round(totalTax),
        total: round(total),
        currency,
        taxPercentage
    };
};

const round = (num) => Math.round(num * 100) / 100;

/**
 * Format date to "DD-MM-YYYY"
 */
const formatDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
        const date = parseAPIDate(dateString) || new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch {
        return dateString;
    }
};

/**
 * Format date for API: "DD-MM-YYYY"
 */
export const formatDateForAPI = (dateString) => {
    if (!dateString) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    }
    
    try {
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
            return dateString;
        }
        
        const date = parseAPIDate(dateString) || new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch {
        return dateString;
    }
};

/**
 * Transform API response to easyInvoice format
 */
const transformToInvoiceFormat = (apiData, taxConfig = {}) => {
    const client = apiData.client;
    const company = apiData.company;

    console.log('Starting transformToInvoiceFormat with:', {
        hasClient: !!client,
        hasCompany: !!company,
        invoiceItemsType: typeof apiData.invoice_items,
        invoiceItemsLength: Array.isArray(apiData.invoice_items) ? apiData.invoice_items.length : 'not-array'
    });

    // Normalize dates from API format
    apiData.invoice_date = formatDateForAPI(apiData.invoice_date);
    apiData.due_date = formatDateForAPI(apiData.due_date);

    console.log('After date formatting:', {
        invoice_date: apiData.invoice_date,
        due_date: apiData.due_date
    });

    // Flatten invoice items (handle nested arrays)
    if (Array.isArray(apiData.invoice_items)) {
        const flattened = [];
        apiData.invoice_items.forEach((item, index) => {
            if (Array.isArray(item)) {
                console.log(`Chain ${index} has ${item.length} items`);
                flattened.push(...item);
            } else {
                console.log(`Item ${index} is not an array, treating as single item`);
                flattened.push(item);
            }
        });
        console.log(`Flattened from ${apiData.invoice_items.length} chains to ${flattened.length} items`);
        apiData.invoice_items = flattened;
    }

    // Validate
    const validation = validateInvoiceData(apiData);
    if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        throw new Error(`Invalid invoice data: ${validation.errors.join(', ')}`);
    }

    const lineItems = flattenInvoiceItems(apiData.invoice_items);
    
    console.log('After flattenInvoiceItems:', {
        lineItemsCount: lineItems.length,
        lineItems: lineItems.slice(0, 2) // Log first 2 items
    });

    if (lineItems.length === 0) {
        throw new Error('No valid invoice items after processing');
    }

    // Determine primary currency (from company or first item)
    const primaryCurrency = company?.project?.currency || lineItems[0]?.currency || 'USD';
    
    const totals = calculateTotals(lineItems, { 
        taxPercentage: 10, 
        currency: primaryCurrency,
        ...taxConfig 
    });

    const invoiceNumber = apiData.invoice_number || `INV-${Date.now().toString().slice(-8)}`;

    console.log('Generated invoice:', {
        invoiceNumber,
        itemCount: lineItems.length,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        currency: primaryCurrency
    });

    return {
        documentTitle: "INVOICE",
        currency: totals.currency,
        taxNotation: "VAT",
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,

        sender: {
            company: company?.name || "Company Name",
            address: company?.address || "Company Address",
            zip: company?.postal_code || company?.zip || "",
            city: company?.city || "",
            country: company?.country || "",
            email: company?.email || "",
            phone: company?.mobile || company?.phone || "",
            website: company?.website || ""
        },

        client: {
            company: client?.name || "Client Name",
            address: client?.address || "Client Address",
            zip: client?.postal_code || client?.zip || "",
            city: client?.city || "",
            country: client?.country || "",
            email: client?.email || "",
            phone: client?.mobile || client?.phone || ""
        },

        invoiceNumber: invoiceNumber,
        invoiceDate: formatDate(apiData.invoice_date),
        dueDate: formatDate(apiData.due_date),

        products: lineItems.map(item => ({
            quantity: item.quantity,
            description: item.description,
            tax: 0,
            price: item.price.toFixed(2)
        })),

        subtotal: totals.subtotal.toFixed(2),
        tax: totals.tax.toFixed(2),
        total: totals.total.toFixed(2),

        footer: "Thank you for your business!",
        notice: `A finance charge of 1.5% will be made on unpaid balances after 30 days.\nTax: ${totals.taxPercentage}%`
    };
};

// Rate limiting and caching for easyinvoice
let lastEasyInvoiceRequestTime = 0;
const EASYINVOICE_REQUEST_DELAY = 3000; // 3 seconds between easyinvoice requests
const pdfCache = new Map(); // Cache generated PDFs
let easyinvoiceRequestQueue = Promise.resolve(); // Queue for sequential requests

const throttledEasyInvoiceRequest = async (fn, retries = 3) => {
    return new Promise((resolve, reject) => {
        easyinvoiceRequestQueue = easyinvoiceRequestQueue.then(async () => {
            try {
                const now = Date.now();
                const timeSinceLastRequest = now - lastEasyInvoiceRequestTime;
                
                if (timeSinceLastRequest < EASYINVOICE_REQUEST_DELAY) {
                    const waitTime = EASYINVOICE_REQUEST_DELAY - timeSinceLastRequest;
                    console.log(`⏳ Waiting ${waitTime}ms before easyinvoice request...`);
                    await new Promise(r => setTimeout(r, waitTime));
                }
                
                lastEasyInvoiceRequestTime = Date.now();
                console.log('📤 Sending easyinvoice request...');
                
                try {
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    console.error('❌ EasyInvoice error:', error.message || error);
                    
                    // Check if it's a 429 (Too Many Requests) error
                    if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
                        if (retries > 0) {
                            console.warn(`⚠️ Rate limited! Retrying in 6 seconds... (${retries} retries left)`);
                            await new Promise(r => setTimeout(r, 6000));
                            lastEasyInvoiceRequestTime = Date.now();
                            
                            // Recursive retry
                            try {
                                const result = await throttledEasyInvoiceRequest(fn, retries - 1);
                                resolve(result);
                            } catch (retryError) {
                                reject(retryError);
                            }
                        } else {
                            reject(new Error('Max retries exceeded. EasyInvoice API is rate limiting. Please try again in a few minutes.'));
                        }
                    } else {
                        reject(error);
                    }
                }
            } catch (err) {
                reject(err);
            }
        });
    });
};

export const invoiceAPIService = {
    /**
     * Fetch invoice data from backend
     */
    fetchInvoiceData: async (templateId) => {
        try {
            const url = `${BASE_URL}/api/invoice/print-view?template_id=${templateId}&hirearchy=True`;

            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || `Failed to fetch invoice data (${response.status})`;
                throw new Error(errorMessage);
            }

            const apiData = await response.json();
            return {
                success: true,
                data: apiData,
                message: 'Invoice data fetched successfully'
            };
        } catch (error) {
            console.error('Fetch invoice data error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Error fetching invoice data'
            };
        }
    },

    /**
     * Transform and prepare invoice for rendering
     */
    prepareInvoice: (apiData, taxConfig = {}) => {
        try {
            const invoiceData = transformToInvoiceFormat(apiData, taxConfig);
            return {
                success: true,
                data: invoiceData,
                message: 'Invoice prepared successfully'
            };
        } catch (error) {
            console.error('Prepare invoice error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Error preparing invoice'
            };
        }
    },

    /**
     * Generate invoice PDF using easyInvoice with rate limiting
     */
    generatePDF: async (invoiceData) => {
        try {
            // Check cache first
            const cacheKey = invoiceData.invoiceNumber || JSON.stringify(invoiceData);
            const cachedPDF = pdfCache.get(cacheKey);
            if (cachedPDF) {
                console.log('✓ Using cached PDF');
                return {
                    success: true,
                    data: cachedPDF,
                    message: 'PDF generated successfully (cached)'
                };
            }

            const result = await throttledEasyInvoiceRequest(async () => {
                return await easyinvoice.createInvoice(invoiceData);
            });
            
            // Cache the result
            pdfCache.set(cacheKey, result);
            console.log('✓ PDF generated and cached');
            
            return {
                success: true,
                data: result,
                message: 'PDF generated successfully'
            };
        } catch (error) {
            console.error('Generate PDF error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Error generating PDF'
            };
        }
    },

    /**
     * Download PDF with rate limiting
     */
    downloadPDF: async (invoiceData, fileName = 'invoice.pdf') => {
        try {
            await throttledEasyInvoiceRequest(async () => {
                return await easyinvoice.download({
                    ...invoiceData,
                    download: true,
                    fileName: fileName
                });
            });

            console.log('✓ PDF downloaded');
            return {
                success: true,
                message: 'PDF downloaded successfully'
            };
        } catch (error) {
            console.error('Download PDF error:', error);
            return {
                success: false,
                message: error.message || 'Error downloading PDF'
            };
        }
    },

    /**
     * Export as PDF (opens in new tab) with rate limiting
     */
    exportPDF: async (invoiceData) => {
        try {
            const result = await throttledEasyInvoiceRequest(async () => {
                return await easyinvoice.createInvoice(invoiceData);
            });
            
            const blob = new Blob([result.pdf], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

            console.log('✓ PDF exported');
            return {
                success: true,
                message: 'PDF exported successfully'
            };
        } catch (error) {
            console.error('Export PDF error:', error);
            return {
                success: false,
                message: error.message || 'Error exporting PDF'
            };
        }
    },

    /**
     * Print invoice with rate limiting
     */
    printInvoice: async (invoiceData) => {
        try {
            const result = await throttledEasyInvoiceRequest(async () => {
                return await easyinvoice.createInvoice(invoiceData);
            });
            
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.srcDoc = result.pdf;
            document.body.appendChild(iframe);
            
            iframe.onload = function() {
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 100);
            };

            console.log('✓ Sent to printer');
            return {
                success: true,
                message: 'Invoice sent to printer'
            };
        } catch (error) {
            console.error('Print invoice error:', error);
            return {
                success: false,
                message: error.message || 'Error printing invoice'
            };
        }
    },

    /**
     * Save invoice to backend
     */
    saveInvoice: async (invoiceData) => {
        try {
            const url = `${BASE_URL}/api/invoice`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify(invoiceData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || `Failed to save invoice (${response.status})`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return {
                success: true,
                data: result,
                message: 'Invoice saved successfully'
            };
        } catch (error) {
            console.error('Save invoice error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Error saving invoice'
            };
        }
    },

    /**
     * Fetch all invoices from backend
     */
    getInvoices: async (filters = {}) => {
        try {
            const url = `${BASE_URL}/api/invoice`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || `Failed to fetch invoices (Status: ${response.status})`;
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

    /**
     * Get single invoice by ID
     */
    getInvoiceById: async (invoiceId) => {
        try {
            const url = `${BASE_URL}/api/invoice?invoice_id=${invoiceId}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || errorData.message || 'Failed to fetch invoice';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return {
                success: true,
                data: data,
                message: 'Invoice fetched successfully'
            };
        } catch (error) {
            console.error('Get invoice by ID error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Error fetching invoice'
            };
        }
    },

    /**
     * Delete invoice from backend
     */
    deleteInvoice: async (invoiceId) => {
        try {
            const url = `${BASE_URL}/api/invoice?invoice_id=${invoiceId}`;
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                credentials: 'include'
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