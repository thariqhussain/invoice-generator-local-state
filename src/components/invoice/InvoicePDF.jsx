import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import invoiceIcon from '../../assets/invoice.png'
import locationIcon from '../../assets/location.png'
import mailIcon from '../../assets/mail.png'
import phoneIcon from '../../assets/phone.png'

// Professional PDF Styles matching the screenshot
const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
    },
    // Header Section (Dark background)
    header: {
        backgroundColor: '#2d2d2d',
        padding: '20 20',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoSection: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 50,
        height: 50,
        backgroundColor: '#3d3d3d',
        borderRadius: 4,
        border: '2 solid #ffffff',
    },
    logoImage: {
        width: 50,
        height: 50,
        objectFit: 'contain',
    },
    logoText: {
        color: '#ffffff',
        fontSize: 25,
        fontWeight: 'bold',
        width: '140px',
        letterSpacing: 1,
    },
    invoiceDateBox: {
        backgroundColor: '#3d3d3d',
        width: '150px',
        padding: '15 20',
        borderRadius: 4,
        border: '2 solid grey',
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 2,
        marginBottom: 5,
    },
    invoiceNumber: {
        fontSize: 11,
        color: '#cccccc',
        marginBottom: 10,
    },
    dateLabel: {
        fontSize: 9,
        color: '#ffffff',
        marginBottom: 3,
    },
    dateValue: {
        fontSize: 10,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    // Parties Section
    partiesContainer: {
        backgroundColor: '#f5f5f5',
        padding: '30 40',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 30,
    },
    partyCard: {
        flex: 1,
    },
    partyTitle: {
        fontSize: 9,
        color: '#666666',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    partyName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 3,
    },
    partyRole: {
        fontSize: 9,
        color: '#666666',
        marginBottom: 10,
    },
    partyDetail: {
        fontSize: 9,
        color: '#333333',
        marginBottom: 3,
        flexDirection: 'row',
        gap: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
        minWidth: 12,
    },
    // Items Table
    tableContainer: {
        padding: '20 40',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#3d3d3d',
        padding: '10 10',
        marginBottom: '7px',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 7,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    entityBlock: {
        marginBottom: 8,
        borderRadius: '3px',
        overflow: 'hidden',
        border: '1px solid lightgrey'
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: '15 15',
        alignItems: 'flex-start',
        // border: '1px solid black'
    },
    // Column widths
    colDescription: {
        flex: 2,
    },
    colRateMode: {
        flex: 1,
        textAlign: 'center',
    },
    colDuration: {
        flex: 0.8,
        textAlign: 'center',
    },
    colRateAmount: {
        flex: 1,
        textAlign: 'right',
    },
    colCurrency: {
        flex: 0.8,
        textAlign: 'center',
    },
    colTotal: {
        flex: 1,
        textAlign: 'right',
    },
    // Item content
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    itemValue: {
        fontSize: 10,
        color: '#333333',
    },
    itemTotalValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    // Sub-entities - inline under main entity (ENHANCED)
    subEntityItem: {
        fontSize: 9,
        color: '#1a1a1a',
        marginTop: 3,
        lineHeight: 1.3,
    },
    // Expenses Section Header (inside each entity block)
    expenseHeaderRow: {
        backgroundColor: '#f5f5f5',
        padding: '8 15',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderTop: '1 solid #e0e0e0',
    },
    expensesHeaderTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#1a1a1a',
        borderBottom: 'none'
    },
    expensesCount: {
        fontSize: 8,
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '2 8',
        borderRadius: 3,
        fontWeight: 'bold',
    },
    expensesTotal: {
        fontSize: 9,
        fontWeight: 'bold',
        color: 'black',
        border: '1px solid black',
        padding: '3 8',
        borderRadius: 3,
    },
    // Expenses Section (inside each entity block)
    expensesSection: {
        backgroundColor: '#f9fafb',
        padding: '12 15',
        borderBottom: '1 solid #e0e0e0',
    },
    expenseItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
        alignItems: 'center',
    },
    expenseTypeBadge: {
        backgroundColor: '#3d3d3d',
        color: '#ffffff',
        padding: '5 10',
        borderRadius: 3,
        fontSize: 8,
        fontWeight: 'bold',
        minWidth: 50,
        textAlign: 'center',
    },
    expenseAmount: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#3d3d3d',
        minWidth: 40,
    },
    expenseDescription: {
        fontSize: 8,
        color: '#666666',
        flex: 1,
    },
    // Totals Section
    totalsContainer: {
        padding: '20 40',
        alignItems: 'flex-end',
    },
    totalsBox: {
        minWidth: 300,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '10 0',
        borderBottom: '1 solid #e0e0e0',
    },
    totalLabel: {
        fontSize: 10,
        color: '#666666',
    },
    totalValue: {
        fontSize: 10,
        color: '#333333',
        fontWeight: 'bold',
        textAlign: 'right',
        minWidth: 100,
    },
    taxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '8 0',
    },
    taxLabel: {
        fontSize: 10,
        color: '#666666',
    },
    taxValue: {
        fontSize: 10,
        color: '#333333',
        textAlign: 'right',
        minWidth: 100,
    },
    expensesRowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '8 0',
        borderBottom: '1 solid #e0e0e0',
    },
    discountValue: {
        color: '#e74c3c',
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#3d3d3d',
        padding: '15 20',
        marginTop: 10,
        borderRadius: 4,
    },
    grandTotalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    grandTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'right',
        minWidth: 120,
    },
    totalDueSection: {
        marginTop: 15,
        padding: '15 20',
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
    },
    totalDueLabel: {
        fontSize: 10,
        color: '#666666',
        marginBottom: 5,
    },
    totalDueAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    // Footer
    footer: {
        padding: '15 15',
        borderTop: '1 solid #e0e0e0',
        marginTop: 15
    },
    termsSection: {
        marginBottom: 17,
    },
    termsTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
        textAlign: 'center',
    },
    termsText: {
        fontSize: 9,
        color: '#666666',
        lineHeight: 1.5,
        textAlign: 'center'
    },
});

export default function InvoicePDF({ invoiceData }) {
    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const calculateLineTotal = (item) => {
        const duration = item.duration || 1;
        const rateAmount = item.rate_amount || (item.project?.rate_amount || 0);
        return duration * rateAmount;
    };

    const calculateSubtotal = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((sum, chain) => {
            if (!Array.isArray(chain)) return sum;
            const chainTotal = chain.reduce((chainSum, item) => {
                return chainSum + calculateLineTotal(item);
            }, 0);
            return sum + chainTotal;
        }, 0);
    };

    // âœ… Calculate total expenses across all items
    const calculateTotalAllExpenses = () => {
        return invoiceData.invoice_items.reduce((total, chain) => {
            if (!Array.isArray(chain)) return total;
            const chainExpenses = chain[0].expenses?.reduce((sum, expense) => {
                return sum + (expense.amount || 0);
            }, 0) || 0;
            return total + chainExpenses;
        }, 0);
    };

    // âœ… Calculate entity expenses
    const calculateEntityExpenses = (entity) => {
        return entity.expenses?.reduce((sum, expense) => {
            return sum + (expense.amount || 0);
        }, 0) || 0;
    };

    const calculateTax = (subtotal, taxRate = 10) => {
        return (subtotal * taxRate) / 100;
    };

    const calculateTotalWithTax = (subtotal, tax) => {
        return subtotal + tax;
    };

    const calculateTotal = (items) => {
        const subtotal = calculateSubtotal(items);
        const tax = calculateTax(subtotal, 10);
        const totalExpenses = calculateTotalAllExpenses();
        return calculateTotalWithTax(subtotal, tax) + totalExpenses;
    };

    // Generate Invoice Number
    const generateInvoiceNumber = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const templateId = String(invoiceData.template_id || 1).padStart(3, '0');
        return `INV-${year}${month}-${templateId}`;
    };

    const subtotal = calculateSubtotal(invoiceData.invoice_items);
    const tax = calculateTax(subtotal, 10);
    const totalExpenses = calculateTotalAllExpenses();
    const total = calculateTotal(invoiceData.invoice_items);
    const currency = invoiceData.company?.project?.currency || 'USD';

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap>
                {/* Header Section */}
                <View style={styles.header}>
                    {/* Logo Section */}
                <View style={styles.logoSection}>
                    <Image 
                        src={invoiceIcon} 
                        style={styles.logoImage}
                    />
                    <Text style={styles.logoText}>Invoice Generator</Text>
                </View>

                    {/* Invoice Number & Dates Box */}
                    <View style={styles.invoiceDateBox}>
                        <Text style={styles.invoiceNumber}>{generateInvoiceNumber()}</Text>
                        <Text style={styles.dateLabel}>Invoice Date: {invoiceData.invoice_date}</Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.dateLabel}>Due Date: {invoiceData.due_date}</Text>
                        </View>
                    </View>
                </View>

                {/* Parties Information */}
                <View style={styles.partiesContainer}>
                    {/* Invoice To */}
                    <View style={styles.partyCard}>
                        <Text style={styles.partyTitle}>Invoice To</Text>
                        <Text style={styles.partyName}>{invoiceData.client?.name || 'N/A'}</Text>
                        <Text style={styles.partyRole}>
                            {invoiceData.client?.role}
                        </Text>
                        <View style={styles.partyDetail}>
                            <Text style={styles.detailLabel}>{<Image src={locationIcon} />}</Text>
                            <Text>{invoiceData.client?.address || 'N/A'}</Text>
                        </View>
                        <View style={styles.partyDetail}>
                            <Text style={styles.detailLabel}>{<Image src={mailIcon} />}</Text>
                            <Text>{invoiceData.client?.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.partyDetail}>
                            <Text style={styles.detailLabel}>{<Image src={phoneIcon} />}</Text>
                            <Text>{invoiceData.client?.mobile || 'N/A'}</Text>
                        </View>
                    </View>

                    {/* Invoice From */}
                    <View style={styles.partyCard}>
                        <Text style={styles.partyTitle}>Invoice From</Text>
                        <Text style={styles.partyName}>{invoiceData.company?.name || 'N/A'}</Text>
                        <Text style={styles.partyRole}>
                            {invoiceData.company?.role}
                        </Text>
                        <View style={styles.partyDetail}>
                            <Text style={styles.detailLabel}>{<Image src={locationIcon} />}</Text>
                            <Text>{invoiceData.company?.address || 'N/A'}</Text>
                        </View>
                        <View style={styles.partyDetail}>
                            <Text style={styles.detailLabel}>{<Image src={mailIcon} />}</Text>
                            <Text>{invoiceData.company?.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.partyDetail}>
                            <Text style={styles.detailLabel}>{<Image src={phoneIcon} />}</Text>
                            <Text>{invoiceData.company?.mobile || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.tableContainer}>
                    {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={styles.colDescription}>Item Descriptions</Text>
                    <Text style={styles.colRateMode}>Rate Mode</Text>
                    <Text style={styles.colDuration}>Duration</Text>
                    <Text style={styles.colRateAmount}>Rate Amount</Text>
                    <Text style={styles.colCurrency}>Currency</Text>
                    <Text style={styles.colTotal}>Total</Text>
                </View>

                    {/* Table Rows - Each entity as a block */}
                    {invoiceData.invoice_items.map((chain, chainIndex) => {
                        if (!Array.isArray(chain)) return null;
                        const mainEntity = chain[0];
                        
                        // âœ… NEW: Read show_project_hirearchy from invoiceData instead of hardcoded
                        const showHierarchy = invoiceData.show_project_hirearchy ?? true;
                        
                        // âœ… NEW: Only get sub-entities if showHierarchy is true
                        const subEntities = showHierarchy ? chain.slice(1, -2) : [];

                        const lineTotal = calculateLineTotal(mainEntity);
                        const entityExpenses = mainEntity.expenses && Array.isArray(mainEntity.expenses) 
                            ? mainEntity.expenses 
                            : [];
                        const entityExpensesTotal = calculateEntityExpenses(mainEntity);

                        return (
                            <View key={chainIndex} style={styles.entityBlock}>
                            
                                {/* Main Entity Row */}
                                <View style={styles.tableRow}>
                                    {/* Description Column */}
                                    <View style={styles.colDescription}>
                                        <Text style={styles.itemTitle}>
                                            {mainEntity.name}
                                        </Text>
                                        {/* âœ… NEW: Only show sub-entities if showHierarchy is true */}
                                        {showHierarchy && subEntities.length > 0 && 
                                            subEntities.map((entity, idx) => (
                                                <Text key={idx} style={styles.subEntityItem}>
                                                    {entity.name}, {entity.country || 'N/A'}
                                                </Text>
                                            ))
                                        }
                                    </View>

                                    {/* Rate Mode Column */}
                                    <Text style={[styles.colRateMode, styles.itemValue]}>
                                        {mainEntity.project?.rate_mode || 'N/A'}
                                    </Text>

                                    {/* Duration Column */}
                                    <Text style={[styles.colDuration, styles.itemValue]}>
                                        {mainEntity.duration || 0}
                                    </Text>

                                    {/* Rate Amount Column */}
                                    <Text style={[styles.colRateAmount, styles.itemValue]}>
                                        {(mainEntity.rate_amount || mainEntity.project?.rate_amount || 0).toFixed(2)}
                                    </Text>

                                    {/* Currency Column */}
                                    <Text style={[styles.colCurrency, styles.itemValue]}>
                                        {mainEntity.project?.currency || currency}
                                    </Text>

                                    {/* Total Column */}
                                    <Text style={[styles.colTotal, styles.itemTotalValue]}>
                                        {formatCurrency(lineTotal, currency)}
                                    </Text>
                                </View>

                                {/* Expenses section remains the same */}
                                {entityExpenses.length > 0 && (
                                    <View style={styles.expenseHeaderRow}>
                                        <Text style={styles.expensesHeaderTitle}> Expenses & Allowance</Text>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                            <Text style={styles.expensesTotal}>Total: {formatCurrency(entityExpensesTotal, currency)}</Text>
                                        </View>
                                    </View>
                                )}

                                {entityExpenses.length > 0 && (
                                    <View style={styles.expensesSection}>
                                        {entityExpenses.map((expense, idx) => (
                                            <View key={idx} style={styles.expenseItem}>
                                                <Text style={styles.expenseTypeBadge}>{expense.type}</Text>
                                                <Text style={styles.expenseAmount}>${expense.amount}</Text>
                                                <Text style={styles.expenseDescription}>
                                                    {expense.description || 'No description provided'}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* âœ… Totals Section */}
                <View style={styles.totalsContainer} wrap={false}>
                    <View style={styles.totalsBox}>
                        {/* Subtotal */}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal:</Text>
                            <Text style={styles.totalValue}>
                                {formatCurrency(subtotal, currency)}
                            </Text>
                        </View>

                        {/* Tax */}
                        <View style={styles.taxRow}>
                            <Text style={styles.taxLabel}>Tax (10%):</Text>
                            <Text style={styles.taxValue}>
                                {formatCurrency(tax, currency)}
                            </Text>
                        </View>

                        {/* âœ… Expenses & Allowance Total */}
                        <View style={styles.expensesRowTotal}>
                            <Text style={styles.taxLabel}>Expenses & Allowance:</Text>
                            <Text style={styles.taxValue}>
                                {formatCurrency(totalExpenses, currency)}
                            </Text>
                        </View>

                        {/* Grand Total */}
                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalLabel}>Total Amount:</Text>
                            <Text style={styles.grandTotalValue}>
                                {formatCurrency(total, currency)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} wrap={false}>
                    {/* Terms & Conditions */}
                    <View style={styles.termsSection}>
                        <Text style={styles.termsTitle}>Thank you for your business!</Text>
                        <Text style={styles.termsText}>
                            This is a computer-generated invoice and does not require a signature.
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}