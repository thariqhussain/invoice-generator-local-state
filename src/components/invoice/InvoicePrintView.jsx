import { useRef, useState, useEffect } from 'react';
import './InvoicePrint.css';
import downloadIcon from '../../assets/invoice/download.png';
import editIcon from '../../assets/editIcon.png';
import cancelIcon from '../../assets/remove.png'
import saveIcon from '../../assets/diskette.png'
import spinnerIcon from '../../assets/loading.png'

export default function InvoicePrintView({ invoiceData, onBack, onSave, onEditToggle, onQuickSave, onCancel, editMode, isSaving, hasChanges }) {
    const printRef = useRef();

    const [expandedEntities, setExpandedEntities] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [tempExpenseAmount, setTempExpenseAmount] = useState({});
    
    const [editableData, setEditableData] = useState({
        invoice_date: invoiceData.invoice_date,
        due_date: invoiceData.due_date,
        items: invoiceData.invoice_items.map(chain => {
            if (!Array.isArray(chain)) return chain;
            return chain.map(item => ({
                ...item,
                duration: item.duration !== undefined ? item.duration : 0,
                rate_amount: item.rate_amount !== undefined ? item.rate_amount : (item.project?.rate_amount || 0),
                expenses: Array.isArray(item.expenses) ? item.expenses : []
            }));
        })
    });

    const [originalData, setOriginalData] = useState(null);
    const [editSessionData, setEditSessionData] = useState(null);
    const expenseTypes = ['Food', 'Travel', 'Lodging'];

    useEffect(() => {
        return () => {
            window.__currentInvoiceData = null;
        };
    }, []);

    useEffect(() => {
        setOriginalData({
            invoice_date: invoiceData.invoice_date,
            due_date: invoiceData.due_date,
            items: JSON.parse(JSON.stringify(editableData.items))
        });
    }, []);

    useEffect(() => {
        if (editMode) {
            setEditSessionData({
                invoice_date: editableData.invoice_date,
                due_date: editableData.due_date,
                items: JSON.parse(JSON.stringify(editableData.items))
            });
        }
    }, [editMode]);

    useEffect(() => {
        // Only update window data on initial render or when invoiceData changes
        window.__currentInvoiceData = {
            ...invoiceData,
            invoice_date: editableData.invoice_date,
            due_date: editableData.due_date,
            invoice_items: editableData.items,
            invoice_type: invoiceData.invoice_type,
            show_project_hirearchy: invoiceData.show_project_hirearchy ?? true
        };
    }, [invoiceData]); // Only depend on invoiceData, not editableData

    // ADD THIS NEW useEffect:
    useEffect(() => {
        // Update editable data when in edit mode
        if (editMode) {
            setEditSessionData({
                invoice_date: editableData.invoice_date,
                due_date: editableData.due_date,
                items: JSON.parse(JSON.stringify(editableData.items))
            });
        }
    }, [editMode]);

    const toggleExpenseSection = (chainIndex) => {
        setExpandedEntities(prev => ({
            ...prev,
            [chainIndex]: !prev[chainIndex]
        }));
    };

    const toggleDropdown = (chainIndex) => {
        setDropdownOpen(prev => ({
            ...prev,
            [chainIndex]: !prev[chainIndex]
        }));
    };

    const addExpense = (chainIndex, expenseType) => {
        const amount = tempExpenseAmount[`${chainIndex}-${expenseType}`] || 0;
        const newItems = [...editableData.items];
        
        const existingIndex = newItems[chainIndex][0].expenses.findIndex(e => e.type === expenseType);
        
        if (existingIndex === -1) {
            newItems[chainIndex][0].expenses.push({
                type: expenseType,
                description: '',
                amount: parseInt(amount) || 0
            });
        } else {
            newItems[chainIndex][0].expenses[existingIndex].amount = parseInt(amount) || 0;
        }
        
        setEditableData({
            ...editableData,
            items: newItems
        });

        setTempExpenseAmount(prev => ({
            ...prev,
            [`${chainIndex}-${expenseType}`]: 0
        }));
    };

    const removeExpense = (chainIndex, expenseType) => {
        const newItems = [...editableData.items];
        newItems[chainIndex][0].expenses = newItems[chainIndex][0].expenses.filter(e => e.type !== expenseType);
        setEditableData({
            ...editableData,
            items: newItems
        });
    };

    const handleExpenseDescriptionChange = (chainIndex, expenseType, description) => {
        const newItems = [...editableData.items];
        const expenseIndex = newItems[chainIndex][0].expenses.findIndex(e => e.type === expenseType);
        if (expenseIndex !== -1) {
            newItems[chainIndex][0].expenses[expenseIndex].description = description;
        }
        setEditableData({
            ...editableData,
            items: newItems
        });
    };

    const calculateTotalExpenses = (chainIndex) => {
        return editableData.items[chainIndex][0].expenses.reduce((sum, expense) => {
            return sum + (expense.amount || 0);
        }, 0);
    };

    const handleDateChange = (e, dateType) => {
        setEditableData({
            ...editableData,
            [dateType]: e.target.value
        });
    };

    const handleDurationChange = (chainIndex, itemIndex, value) => {
        const newItems = [...editableData.items];
        newItems[chainIndex][itemIndex].duration = parseFloat(value) || 0;
        setEditableData({
            ...editableData,
            items: newItems
        });
    };

    const handleRateAmountChange = (chainIndex, itemIndex, value) => {
        const newItems = [...editableData.items];
        newItems[chainIndex][itemIndex].rate_amount = parseFloat(value) || 0;
        setEditableData({
            ...editableData,
            items: newItems
        });
    };

// ✅ FIX: Correct calculation methods for individual invoices

    const calculateLineTotal = (item) => {
        const duration = item.duration || 1;
        const rateAmount = item.rate_amount || 0;
        return duration * rateAmount;
    };

    // ✅ FIXED: Calculate subtotal correctly for both bulk and individual invoices
    const calculateSubtotal = (items, invoiceType) => {
        if (!items || !Array.isArray(items)) return 0;
        
        // For individual invoices, only calculate from the first (and only) chain
        if (invoiceType === 'individual' && items.length === 1) {
            const chain = items[0];
            if (!Array.isArray(chain)) return 0;
            
            return chain.reduce((sum, item) => {
                return sum + calculateLineTotal(item);
            }, 0);
        }
        
        // For bulk invoices, calculate from all chains
        return items.reduce((sum, chain) => {
            if (!Array.isArray(chain)) return sum;
            const chainTotal = chain.reduce((chainSum, item) => {
                return chainSum + calculateLineTotal(item);
            }, 0);
            return sum + chainTotal;
        }, 0);
    };

    const calculateTax = (subtotal, taxRate = 10) => {
        return (subtotal * taxRate) / 100;
    };

    const calculateTotalWithTax = (subtotal, tax) => {
        return subtotal + tax;
    };

    const calculateTotal = (items, invoiceType) => {
        const subtotal = calculateSubtotal(items, invoiceType);
        const tax = calculateTax(subtotal, 10);
        return calculateTotalWithTax(subtotal, tax);
    };

    const formatCurrency = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const generateInvoiceNumber = () => {
        const baseNumber = invoiceData.template_id || 1;
        return `INV-${String(baseNumber).padStart(3, '0')}`;
    };

    useEffect(() => {
        console.log('InvoicePrintView loaded with:', {
            invoiceType: invoiceData.invoice_type,
            itemCount: editableData.items.length,
            hierarchyEnabled: invoiceData.show_project_hirearchy
        });
        
        if (invoiceData.invoice_type === 'individual' && editableData.items.length > 1) {
            console.warn('⚠️ Individual invoice has multiple items - data might be misaligned');
        }
        
        // ✅ Ensure window data stays in sync
        if (window.__currentInvoiceData) {
            window.__currentInvoiceData.invoice_type = invoiceData.invoice_type;
            window.__currentInvoiceData.show_project_hirearchy = invoiceData.show_project_hirearchy ?? true;
        }
    }, [invoiceData.invoice_type, invoiceData.show_project_hirearchy]);

    const getGroupedItems = () => {
        const invoiceType = invoiceData.invoice_type;
        const itemsCount = editableData.items.length;
        const hierarchyFromData = invoiceData.show_project_hirearchy;
        const showHierarchy = hierarchyFromData !== undefined ? hierarchyFromData : true;
        
        console.log('📊 GET GROUPED ITEMS:', {
            invoiceType: invoiceType,
            itemsCount: itemsCount,
            showHierarchy: showHierarchy
        });
        
        // For individual invoices, show only the single chain
        if (invoiceType === 'individual') {
            if (editableData.items.length === 1) {
                const chain = editableData.items[0];
                return [{
                    chainIndex: 0,
                    mainEntity: chain[0],
                    subEntities: chain,
                    showHierarchy: showHierarchy
                }];
            }
        }
        
        // For bulk invoices, show all chains with hierarchy setting
        return editableData.items.map((chain, chainIndex) => {
            // If showHierarchy is false, only show main entity [chain[0]]
            // If showHierarchy is true, show all (full chain)
            const itemsToDisplay = showHierarchy ? chain : [chain[0]];

            return {
                chainIndex,
                mainEntity: chain[0],
                subEntities: itemsToDisplay,
                showHierarchy: showHierarchy
            };
        });
    };

    const total = calculateTotal(editableData.items);
    const groupedItems = getGroupedItems();

    const saveInvoiceToLocalStorage = (invoice) => {
        try {
            const savedInvoices = JSON.parse(localStorage.getItem('invoicesList')) || [];
            const invoiceExists = savedInvoices.findIndex(inv => inv.invoice_id === invoice.invoice_id);
            
            if (invoiceExists !== -1) {
                savedInvoices[invoiceExists] = invoice;
            } else {
                savedInvoices.push(invoice);
            }
            
            localStorage.setItem('invoicesList', JSON.stringify(savedInvoices));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    const subtotalAmount = calculateSubtotal(editableData.items, invoiceData.invoice_type);
    const taxAmount = calculateTax(subtotalAmount, 10);
    const totalAmount = calculateTotalWithTax(subtotalAmount, taxAmount);

    return (
        <div className="print-view-container">
            {/* Invoice Content */}
            <div className="invoice-print-content" ref={printRef} id="invoice-content">
                {/* Header */}
                <div className="invoice-header">
                    <div className="invoice-title-section">
                        <h1 className="invoice-main-title">INVOICE</h1>
                        <p className="invoice-number">{generateInvoiceNumber()}</p>
                    </div>
                    <div className="invoice-dates">
                        <div className="date-item">
                            <span className="date-label">Invoice Date:</span>
                            {editMode ? (
                                <input
                                    type="date"
                                    className="editable-field"
                                    value={editableData.invoice_date}
                                    onChange={(e) => handleDateChange(e, 'invoice_date')}
                                />
                            ) : (
                                <span className="date-value">{editableData.invoice_date}</span>
                            )}
                        </div>
                        <div className="date-item">
                            <span className="date-label">Due Date:</span>
                            {editMode ? (
                                <input
                                    type="date"
                                    className="editable-field"
                                    value={editableData.due_date}
                                    onChange={(e) => handleDateChange(e, 'due_date')}
                                />
                            ) : (
                                <span className="date-value">{editableData.due_date}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Parties Information */}
                <div className="parties-section">
                    <div className="party-card client-card">
                        <h3 className="party-title">Bill To</h3>
                        <div className="party-details">
                            <p className="party-name">{invoiceData.client.name}</p>
                            <p>{invoiceData.client.address}</p>
                            <p>{invoiceData.client.email}</p>
                            <p>{invoiceData.client.mobile}</p>
                        </div>
                    </div>

                    <div className="party-card company-card">
                        <h3 className="party-title">From</h3>
                        <div className="party-details">
                            <p className="party-name">{invoiceData.company.name}</p>
                            <p>{invoiceData.company.address}</p>
                            <p>{invoiceData.company.email}</p>
                            <p>{invoiceData.company.mobile}</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Items */}
                <div className="invoice-items-section">
                    <h2 className="section-title">Invoice Details</h2>

                    <div className="entity-headers-row">
                        <div className="entity-header-cell">#</div>
                        <div className="entity-header-cell description">Description</div>
                        <div className="entity-header-cell rate-mode">Rate Mode</div>
                        <div className="entity-header-cell duration">Duration</div>
                        <div className="entity-header-cell rate-amount">Rate Amount</div>
                        <div className="entity-header-cell currency">Currency</div>
                        <div className="entity-header-cell total">Total</div>
                    </div>
                    <div className="entity-rows-wrapper">
                        {groupedItems.map(({ chainIndex, mainEntity, subEntities, showHierarchy }, groupIndex) => (
                            <div key={chainIndex}>
                                <div className="entity-row-container">
                                    <div className="entity-number-box">
                                        {String(groupIndex + 1).padStart(2, '0')}
                                    </div>

                                    <div className="entity-description-column">
                                        <div className="main-entity-name">
                                            {mainEntity.name}, {mainEntity.country || 'N/A'}
                                        </div>
                                        {/* ✅ NEW: Only show sub-entities if showHierarchy is true */}
                                        {showHierarchy && subEntities.length > 1 && subEntities
                                            .slice(1)
                                            .map((entity, idx) => (
                                                <div key={idx} className="sub-entity-text">
                                                    {entity.name}, {entity.country || 'N/A'}
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className="entity-column rate-mode">
                                        {mainEntity.project?.rate_mode || 'N/A'}
                                    </div>

                                    <div className="entity-column duration">
                                        {editMode ? (
                                            <input
                                                type="number"
                                                className="editable-field"
                                                value={editableData.items[chainIndex][0].duration}
                                                onChange={(e) => handleDurationChange(chainIndex, 0, e.target.value)}
                                                min="0"
                                                step="0.1"
                                            />
                                        ) : (
                                            <span>{editableData.items[chainIndex][0].duration}</span>
                                        )}
                                    </div>

                                    <div className="entity-column rate-amount">
                                        {editMode ? (
                                            <input
                                                type="number"
                                                className="editable-field"
                                                value={editableData.items[chainIndex][0].rate_amount}
                                                onChange={(e) => handleRateAmountChange(chainIndex, 0, e.target.value)}
                                                min="0"
                                                step="0.01"
                                            />
                                        ) : (
                                            <span>{editableData.items[chainIndex][0].rate_amount.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <div className="entity-column currency">
                                        {mainEntity.project?.currency || 'USD'}
                                    </div>

                                    <div className="entity-column total">
                                        {formatCurrency(
                                            calculateLineTotal(editableData.items[chainIndex][0]),
                                            mainEntity.project?.currency || 'USD'
                                        )}
                                    </div>
                                </div>

                                {/* ✅ ISSUE 3 FIX: Enhanced Expenses & Allowance Section with Close Button */}
                                <div className="expense-section-wrapper">
                                    <button
                                        className="expense-toggle-btn"
                                        onClick={() => toggleExpenseSection(chainIndex)}
                                        disabled={false}
                                        aria-expanded={expandedEntities[chainIndex] ? "true" : "false"}
                                    >
                                        <span className={`chevron ${expandedEntities[chainIndex] ? 'open' : ''}`}>▼</span>
                                        <span className="expense-section-title">Expenses & Allowance</span>
                                        {editableData.items[chainIndex][0].expenses && editableData.items[chainIndex][0].expenses.length > 0 && (
                                            <>
                                                <span className="expense-badge">{editableData.items[chainIndex][0].expenses.length} expense(s)</span>
                                                <span className="total-expenses-badge">Total: ${calculateTotalExpenses(chainIndex)}</span>
                                            </>
                                        )}
                                        {/* ✅ ISSUE 3 FIX: Close button (X) appears when section is expanded */}
                                        {expandedEntities[chainIndex] && (
                                            <button
                                                className="expense-close-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpenseSection(chainIndex);
                                                }}
                                                title="Close expenses section"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </button>

                                    {expandedEntities[chainIndex] && (
                                        <div className="expense-section-content">
                                            {editMode ? (
                                                <div className="expense-edit-container-new">
                                                    {/* Dropdown with Multi-select and Amount Input */}
                                                    <div className="expense-dropdown-section">
                                                        <div className="dropdown-container">
                                                            <button
                                                                className="dropdown-toggle-btn"
                                                                onClick={() => toggleDropdown(chainIndex)}
                                                            >
                                                                Add Expenses ▼
                                                            </button>

                                                            {dropdownOpen[chainIndex] && (
                                                                <div className="dropdown-menu">
                                                                    {expenseTypes.map((type) => (
                                                                        <div key={type} className="dropdown-item-group">
                                                                            <div className="dropdown-item-header">
                                                                                <label className="dropdown-item">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={editableData.items[chainIndex][0].expenses?.some(e => e.type === type) || false}
                                                                                        onChange={(e) => {
                                                                                            if (e.target.checked) {
                                                                                                addExpense(chainIndex, type);
                                                                                            } else {
                                                                                                removeExpense(chainIndex, type);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <span>{type}</span>
                                                                                </label>
                                                                            </div>

                                                                            {editableData.items[chainIndex][0].expenses?.some(e => e.type === type) && (
                                                                                <div className="dropdown-inline-section">
                                                                                    <div className="dropdown-amount-input-group">
                                                                                        <input
                                                                                            type="number"
                                                                                            className="dropdown-amount-input"
                                                                                            value={editableData.items[chainIndex][0].expenses?.find(e => e.type === type)?.amount || 0}
                                                                                            onChange={(e) => {
                                                                                                const newItems = [...editableData.items];
                                                                                                const expenseIndex = newItems[chainIndex][0].expenses.findIndex(ex => ex.type === type);
                                                                                                if (expenseIndex !== -1) {
                                                                                                    newItems[chainIndex][0].expenses[expenseIndex].amount = parseInt(e.target.value) || 0;
                                                                                                    setEditableData({
                                                                                                        ...editableData,
                                                                                                        items: newItems
                                                                                                    });
                                                                                                }
                                                                                            }}
                                                                                            placeholder="Enter Amount"
                                                                                            min="0"
                                                                                        />
                                                                                    </div>

                                                                                    <div className="dropdown-description-input-group">
                                                                                        <textarea
                                                                                            className="dropdown-description-input"
                                                                                            value={editableData.items[chainIndex][0].expenses?.find(e => e.type === type)?.description || ''}
                                                                                            onChange={(e) => handleExpenseDescriptionChange(chainIndex, type, e.target.value)}
                                                                                            placeholder="Enter description"
                                                                                            rows="1"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Selected Expense Chips */}
                                                    {editableData.items[chainIndex][0].expenses?.length > 0 && (
                                                        <div className="selected-expenses-chips">
                                                            {editableData.items[chainIndex][0].expenses?.map((expense) => (
                                                                <div key={expense.type} className="expense-chip">
                                                                    <span>{expense.type}</span>
                                                                    <button
                                                                        className="chip-remove-btn"
                                                                        onClick={() => removeExpense(chainIndex, expense.type)}
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                // Read-only mode
                                                <div className="expense-view-container">
                                                    {editableData.items[chainIndex][0].expenses?.map((expense, idx) => (
                                                        <div key={idx} className="expense-item-view">
                                                            <div className="expense-type-badge">{expense.type}</div>
                                                            <div className="expense-amount-view">${expense.amount || 0}</div>
                                                            <div className="expense-description-view">{expense.description || 'No description'}</div>
                                                        </div>
                                                    ))}
                                                    {(!editableData.items[chainIndex][0].expenses || editableData.items[chainIndex][0].expenses.length === 0) && (
                                                        <p className="no-expenses-text">Click on Edit button to add Expenses</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total Section */}
                <div className="total-section">
                    <div className="total-breakdown">
                        <div className="total-row breakdown-row">
                            <span className="breakdown-label">Subtotal:</span>
                            <span className="breakdown-value">
                                {formatCurrency(subtotalAmount, invoiceData.company.project?.currency || 'INR')}
                            </span>
                        </div>
                        <div className="total-row breakdown-row">
                            <span className="breakdown-label">Tax (10%):</span>
                            <span className="breakdown-value">
                                {formatCurrency(taxAmount, invoiceData.company.project?.currency || 'INR')}
                            </span>
                        </div>
                        <div className="total-row final-total-row">
                            <span className="total-label">Total Amount:</span>
                            <span className="total-amount">
                                {formatCurrency(totalAmount, invoiceData.company.project?.currency || 'INR')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="invoice-footer">
                    <p className="footer-text">Thank you for your business!</p>
                    <p className="footer-note">
                        This is a computer-generated invoice and does not require a signature.
                    </p>
                </div>
            </div>
        </div>
    );
}