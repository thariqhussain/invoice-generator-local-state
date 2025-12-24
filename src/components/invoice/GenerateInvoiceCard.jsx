import './Invoice.css';

export default function GenerateInvoiceCard({ 
    templates, 
    selectedTemplate, 
    onTemplateChange, 
    onGenerate,
    isGenerating 
}) {
    return (
        <div className="invoice-section-card" style={{height: "60%"}}>
            <h2 className="invoice-section-title">Generate Invoice</h2>
            
            <div className="generate-form">
                <div className="form-group">
                    <label htmlFor="template-select" className="form-label">
                        Select Template
                    </label>
                    <select
                        id="template-select"
                        className="template-select"
                        value={selectedTemplate}
                        onChange={(e) => onTemplateChange(e.target.value)}
                        disabled={isGenerating}
                    >
                        <option value="">-- Choose a template --</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedTemplate && (
                    <div style={{ 
                        padding: '15px', 
                        background: '#f0f4ff', 
                        borderRadius: '8px',
                        border: '1px solid #bfdbfe'
                    }}>
                        <p style={{ 
                            fontSize: '0.9rem', 
                            color: '#1e40af', 
                            margin: 0,
                            fontWeight: 500
                        }}>
                            âœ“ Template selected successfully
                        </p>
                        <p style={{ 
                            fontSize: '0.85rem', 
                            color: '#64748b', 
                            margin: '5px 0 0 0' 
                        }}>
                            {templates.find(t => t.id === parseInt(selectedTemplate))?.description || 
                             'Ready to generate invoice'}
                        </p>
                    </div>
                )}

                <button
                    className="generate-btn"
                    onClick={onGenerate}
                    disabled={!selectedTemplate || isGenerating}
                >
                    {isGenerating ? (
                        <>â³ Generating...</>
                    ) : (
                        <>ðŸ“‹ Generate Invoice</>
                    )}
                </button>

                {templates.length === 0 && (
                    <div style={{ 
                        padding: '15px', 
                        background: '#fef3c7', 
                        borderRadius: '8px',
                        border: '1px solid #fde68a',
                        marginTop: '10px'
                    }}>
                        <p style={{ 
                            fontSize: '0.9rem', 
                            color: '#92400e', 
                            margin: 0 
                        }}>
                            No templates available. Please create a template first.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}