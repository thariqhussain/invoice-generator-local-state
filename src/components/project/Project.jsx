import { useEffect, useState } from 'react';
import Button from '../../reusables/Button'; 
import ProjectCard from './ProjectCard'
import CreateProjectDialog from './CreateProjectDialog'
import DeleteProjectDialog from './DeleteProjectDialog';
import { projectCRUD } from '../../services/crudService';
import '../Entity.css'

export default function Project() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]); 
    const [projectToEdit, setProjectToEdit] = useState(null); 
    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    const [projectToDeleteId, setProjectToDeleteId] = useState(null); 

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);

        const result = await projectCRUD.getAll();

        if(result.success) {
            setProjects(result.data)
        } else {
            setError(result.message)
        };

        setIsLoading(false)
    };

    const handleCreateProject = async (newProject) => {
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        const result = await projectCRUD.create(newProject);

        if (result.success) {
            setProjects(prevProjects => [...prevProjects, result.data]);
            setSuccessMessage('Project created successfully!');
            setIsDialogOpen(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.message || 'Failed to create project');
        }

        setIsSubmitting(false);
    };

const handleEditProject = async (updatedProject) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Use the form data directly (it already has the correct field names)
    const result = await projectCRUD.update(updatedProject.id, updatedProject);

    if (result.success) {
        setProjects(prevProjects => 
            prevProjects.map(project => 
                project.id === updatedProject.id ? result.data : project
            )
        );
        setSuccessMessage('Project updated successfully!');
        setProjectToEdit(null);
        setIsDialogOpen(false);
        
        setTimeout(() => setSuccessMessage(null), 3000);
    } else {
        setError(result.message || 'Failed to update project');
    }

    setIsSubmitting(false);
};

    // --- Delete logic ---
    
    const openDeleteDialog = (projectId) => {
        setProjectToDeleteId(projectId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setProjectToDeleteId(null);
    };

    const confirmDeleteProject = async () => {
        if (!projectToDeleteId) {
            closeDeleteDialog();
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        const result = await projectCRUD.delete(projectToDeleteId);

        if (result.success) {
            setProjects(prevProjects => 
                prevProjects.filter(project => project.id !== projectToDeleteId)
            );
            setSuccessMessage('Project deleted successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.message || 'Failed to delete project');
        }

        setIsSubmitting(false);
        closeDeleteDialog();
    };

    const openEditDialog = (project) => {
        // Transform project data to match form structure
        const editData = {
            ...project,
            startDate: project.start_date,
            endDate: project.end_date,
            rateMode: project.rate_mode,
            rateAmount: project.rate_amount,
            givenById: project.given_by_id,
            givenByName: project.given_by,
            takenById: project.taken_by_id,
            takenByName: project.taken_by
        };
        
        setProjectToEdit(editData);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setProjectToEdit(null); 
        setIsDialogOpen(false);
    };

    return (
        <div className="entities-page">
            <div className="entities-header">
                <h1>Projects</h1>
                <Button 
                    onClick={() => { setProjectToEdit(null); setIsDialogOpen(true); disabled={isSubmitting}}}
                >
                    Create Project
                </Button>
            </div>

            {/* Error Message Display */}
            {error && (
                <div className="error-message" style={{
                    padding: '12px',
                    marginBottom: '16px',
                    backgroundColor: '#fee',
                    color: '#c33',
                    borderRadius: '4px',
                    border: '1px solid #fcc'
                }}>
                    {error}
                </div>
            )}

            {/* Success Message Display */}
            {successMessage && (
                <div className="success-message" style={{
                    color: '#3c3',
                }}>
                    {successMessage}
                </div>
            )}
            
            {/* Loading State */}
            {isLoading ? (
                <p className="loading-message">Loading projects...</p>
            ) : (
                <div className="entities-list">
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onEdit={() => openEditDialog(project)}
                            onDelete={() => openDeleteDialog(project.id)}
                            disabled={isSubmitting}
                        />
                    ))}

                    {projects.length === 0 && (
                        <p className="no-entities-message">
                            No projects added yet. Click 'Create Project' to get started!
                        </p>
                    )}
                </div>
            )}

            <CreateProjectDialog 
                isOpen={isDialogOpen}
                onClose={closeDialog}
                projectToEdit={projectToEdit} 
                onSubmit={projectToEdit ? handleEditProject : handleCreateProject} 
                isSubmitting={isSubmitting}
            />
            
            <DeleteProjectDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDeleteProject}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}