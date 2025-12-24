// Template.jsx
import { useState, useEffect } from 'react';
import Button from '../../reusables/Button'; 
import TemplateCard from './TemplateCard'; 
import CreateTemplateDialog from './CreateTemplateDialog'; 
import DeleteTemplateDialog from './DeleteTemplateDialog';
import mermaid from 'mermaid';
import { templateCRUD } from '../../services/crudService';
import './Template.css'


export default function Template() {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'tree'
    const [selectedTemplateForTree, setSelectedTemplateForTree] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [templates, setTemplates] = useState([]); 
    const [templateToEdit, setTemplateToEdit] = useState(null); 
    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    const [templateToDeleteId, setTemplateToDeleteId] = useState(null);

    // New states for API integration
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [mermaidDiagram, setMermaidDiagram] = useState('');
    const [mermaidLoading, setMermaidLoading] = useState(false);
    const [mermaidRendered, setMermaidRendered] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setIsLoading(true);
        setError(null);

        const result = await templateCRUD.getAll();

        if(result.success) {
            // Transform API response: convert snake_case to camelCase
            const transformedTemplates = result.data.map(template => ({
                ...template,
                projects: template.projects ? template.projects.map(project => ({
                    ...project,
                    givenBy: project.given_by,      // Convert given_by → givenBy
                    takenBy: project.taken_by,      // Convert taken_by → takenBy
                    rateAmount: project.rate_amount, // Convert rate_amount → rateAmount
                    rateMode: project.rate_mode      // Convert rate_mode → rateMode
                })) : []
            }));
            setTemplates(transformedTemplates)
        } else {
            setError(result.message)
        };

        setIsLoading(false)
    };

    // Initialize Mermaid with custom theme
    useEffect(() => {
        mermaid.initialize({ 
            startOnLoad: true, 
            theme: 'base',
            securityLevel: 'loose',
            themeVariables: {
                // Primary colors - Main nodes
                'primaryColor': '#3b82f6',
                'primaryTextColor': '#ffffff',
                'primaryBorderColor': '#1e40af',
                'primaryStrokeColor': '#1e40af',

                // Secondary colors - Connection lines
                'lineColor': '#0284c7',
                'secondaryColor': '#06b6d4',
                'secondaryBorderColor': '#0891b2',
                'secondaryTextColor': '#ffffff',
                'secondaryStrokeColor': '#0891b2',

                // Tertiary colors - Accent
                'tertiaryColor': '#10b981',
                'tertiaryBorderColor': '#059669',
                'tertiaryTextColor': '#ffffff',

                // Font styling
                'fontFamily': '"Segoe UI", "Trebuchet MS", Arial, sans-serif',
                'fontSize': '15px',
                'fontSizeLarge': '17px',
                'fontSizeSmall': '13px',

                // Node styling
                'nodeSpacing': '80',
                'rankSpacing': '120',
                'curve': 'cardinal',

                // Edge styling
                'edgeLabelBackground': {
                    'color': '#ffffff',
                    'opacity': '1'
                },

                // Arrow/Link styling
                'arrowMarkerAbsolute': true,
            },
            flowchart: {
                htmlLabels: true,
                curve: 'cardinal',
                useMaxWidth: false,
                diagramMarginX: 50,
                diagramMarginY: 50,
                nodeSpacing: 100,
                rankSpacing: 150,
            },
        });
    }, []);

    const handleCreateTemplate = async (newTemplate) => {
        setIsSubmitting(true);
        setError(null);

        const result = await templateCRUD.create(newTemplate);

        if (result.success) {
            setTemplates(prevTemplates => [...prevTemplates, result.data]);
            setSuccessMessage('Template created successfully!');
            setIsDialogOpen(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.message || 'Failed to create template');
        }

        setIsSubmitting(false);
    };

    const handleEditTemplate = (updatedTemplate) => {
        setTemplates(prevTemplates => 
            prevTemplates.map(template => 
                template.id === updatedTemplate.id ? updatedTemplate : template
            )
        );
        setTemplateToEdit(null);
        setIsDialogOpen(false);
    };

    const openDeleteDialog = (templateId) => {
        setTemplateToDeleteId(templateId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setTemplateToDeleteId(null);
    };

    const confirmDeleteTemplate = () => {
        if (templateToDeleteId) {
            setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== templateToDeleteId));
        }
        closeDeleteDialog();
    };

    const openEditDialog = (template) => {
        setTemplateToEdit(template);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setTemplateToEdit(null); 
        setIsDialogOpen(false);
    };

    const handleTreeViewClick = async (template) => {
        setSelectedTemplateForTree(template);
        setViewMode('tree');
        setMermaidRendered(false);
        await fetchMermaidDiagram(template);
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedTemplateForTree(null);
        setMermaidDiagram('');
        setMermaidRendered(false);
    };

    const fetchMermaidDiagram = async (template) => {
        setMermaidLoading(true);
        const result = await templateCRUD.getMermaidDiagram(template.id);
        
        if (result.success) {
            setMermaidDiagram(result.data);
        } else {
            setMermaidDiagram('graph TD\n    A["Error loading diagram"]');
        }
        setMermaidLoading(false);
    };

    // Render mermaid diagram with proper loading state
    useEffect(() => {
        if (viewMode === 'tree' && selectedTemplateForTree && mermaidDiagram && !mermaidLoading) {
            setTimeout(() => {
                mermaid.run().then(() => {
                    setMermaidRendered(true);
                }).catch((err) => {
                    console.error('Mermaid rendering error:', err);
                    setMermaidRendered(true); // Show content even if error
                });
            }, 100);
        }
    }, [viewMode, selectedTemplateForTree, mermaidDiagram, mermaidLoading]);

    return (
        <div className="templates-page">
            {/* UPDATED: Dynamic Header with conditional button */}
            <div className="templates-header">
                <h1>Templates</h1>
                <div className="view-controls">
                    {viewMode === 'list' ? (
                        <Button 
                            className='add-template' 
                            onClick={() => { setTemplateToEdit(null); setIsDialogOpen(true); }}
                        >
                            Add Template
                        </Button>
                    ) : (
                        <Button 
                            className='back-to-list-btn' 
                            onClick={handleBackToList}
                        >
                            ← Back to List
                        </Button>
                    )}
                </div>
            </div>

            {/* Show loading state */}
            {isLoading && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '16px', color: '#666' }}>
                    <p>⏳ Loading templates...</p>
                </div>
            )}

            {/* Show error state */}
            {error && (
                <div style={{ padding: '5px', color: '#d32f2f', textAlign: 'center', backgroundColor: 'black', borderRadius: '4px', margin: '10px' }}>
                    <p>❌ Error: {error}</p>
                </div>
            )}

            {/* Show templates only when not loading and no error */}
            {!isLoading && !error && viewMode === 'list' && (
                <>
                    <div className="templates-list">
                        {templates.map((template) => (
                            <TemplateCard 
                                key={template.id} 
                                template={template} 
                                onEdit={() => openEditDialog(template)}
                                onDelete={() => openDeleteDialog(template.id)}
                                onTreeView={() => handleTreeViewClick(template)}
                            />
                        ))}

                        {templates.length === 0 && (
                            <p className="no-entities-message">
                                No templates added yet. Click 'Add Template' to get started!
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* Tree view with spinner before mermaid renders */}
            {viewMode === 'tree' && selectedTemplateForTree && (
                <>
                    {(mermaidLoading || !mermaidRendered) && (
                        <div className="mermaid-loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading diagram...</p>
                        </div>
                    )}

                    <div className={`mermaid-container ${mermaidRendered ? 'visible' : 'hidden'}`}>
                        <div className="tree-header-overlay">
                            <h2>Tree View: {selectedTemplateForTree.name}</h2>
                        </div>
                        <pre className="mermaid">
                            {`\n${mermaidDiagram}\n`}
                        </pre>
                    </div>
                </>
            )}

           <CreateTemplateDialog 
                isOpen={isDialogOpen}
                onClose={closeDialog}
                templateToEdit={templateToEdit}
                onSubmit={templateToEdit ? handleEditTemplate : handleCreateTemplate}
                isSubmitting={isSubmitting}
            />
            
            <DeleteTemplateDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDeleteTemplate}
            />
        </div>
    );
}