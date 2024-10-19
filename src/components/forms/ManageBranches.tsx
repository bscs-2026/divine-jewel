import React, { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import styles from '../styles/Modal.module.css';

interface Branch {
    id: number;
    name: string;
    address_line: string;
}

interface ManageBranchesProps {
    branches: Branch[];
    addBranch: (branch: Branch) => void;
    editBranch: (branch: Branch) => void;
    deleteBranch: (id: number) => void;
}

const ManageBranches: React.FC<ManageBranchesProps> = ({
    branches = [],
    addBranch,
    editBranch,
    deleteBranch,
}) => {
    const initialFormData = {
        id: 0,
        name: '',
        address_line: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
    const [action, setAction] = useState<'add' | 'edit' | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

    // Check for duplicate branch name
    const isDuplicateBranchName = (name: string): boolean => {
        return branches.some(
            (branch) =>
                branch.name.toLowerCase() === name.toLowerCase() &&
                branch.id !== editingBranchId // Ignore current branch when editing
        );
    };

    // Validate form fields
    const validateForm = (): boolean => {
        let formIsValid = true;
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Branch name is required';
            formIsValid = false;
        } else if (isDuplicateBranchName(formData.name)) {
            const duplicateName = formData.name; // Capture the user's input
            newErrors.name = `'${duplicateName}' already exists`;
            setFormData({ ...formData, name: '' }); // Clear the name input field like in ManageCategories
            formIsValid = false;
        }

        if (!formData.address_line.trim()) {
            newErrors.address_line = 'Branch address is required';
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const handleAddBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            addBranch(formData);
            setFormData(initialFormData);
            setAction(null);
            setErrors({}); // Clear errors after adding
        }
    };

    const handleEditBranch = (branch: Branch) => {
        setFormData({ id: branch.id, name: branch.name, address_line: branch.address_line });
        setEditingBranchId(branch.id);
        setAction('edit');
        setErrors({}); // Clear errors when editing
    };

    const handleSaveEditBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            editBranch(formData);
            setFormData(initialFormData);
            setEditingBranchId(null);
            setAction(null);
            setErrors({}); // Clear errors after editing
        }
    };

    const handleDeleteBranch = (id: number) => {
        setBranchToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteBranch = () => {
        if (branchToDelete !== null) {
            deleteBranch(branchToDelete);
            setShowDeleteModal(false);
            setBranchToDelete(null);
        }
    };

    const cancelDelete = () => {
        setBranchToDelete(null);
        setShowDeleteModal(false);
    };

    const handleCancelEdit = () => {
        setFormData(initialFormData);
        setEditingBranchId(null);
        setAction(null);
        setErrors({}); // Clear errors when canceling
    };

    return (
        <div className={`${styles.modalContent} ${styles.modalContentBig}`}>
            <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>Manage Store Branches</h2>

                {action && (
                    <form
                        className={styles.modalForm}
                        onSubmit={action === 'add' ? handleAddBranch : handleSaveEditBranch}
                    >
                        <input
                            type="text"
                            placeholder={errors.name || 'Branch Name'}
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                setErrors({ ...errors, name: '' });
                            }}
                            className={`${styles.modalInput} ${errors.name ? styles.inputError : ''}`}
                        />

                        <input
                            type="text"
                            placeholder={errors.address_line || 'Branch Address'}
                            value={formData.address_line}
                            onChange={(e) => {
                                setFormData({ ...formData, address_line: e.target.value });
                                setErrors({ ...errors, address_line: '' });
                            }}
                            className={`${styles.modalInput} ${errors.address_line ? styles.inputError : ''
                                }`}
                        />

                        <div className={styles.modalMediumButtonContainer}>
                            <button
                                type="button"
                                className={styles.modalMediumButton}
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={styles.modalMediumButton}>
                                {action === 'add' ? 'Add' : 'Save'}
                            </button>
                        </div>
                    </form>
                )}

                <table className={styles.modalTable}>
                    <thead>
                        <tr>
                            <th>Branch Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map((branch) => (
                            <tr key={branch.id}>
                                <td>{branch.name}</td>
                                <td>{branch.address_line}</td>
                                <td>
                                    <Edit
                                        onClick={() => handleEditBranch(branch)}
                                        className={styles.modalEditIcon}
                                    />
                                    <Delete
                                        onClick={() => handleDeleteBranch(branch.id)}
                                        className={styles.modalDeleteIcon}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.modalMediumButtonContainer}>
                    <button
                        className={styles.modalMediumButton}
                        onClick={() => {
                            setFormData(initialFormData);
                            setEditingBranchId(null);
                            setAction('add');
                            setErrors({}); // Clear errors when starting to add
                        }}
                    >
                        Add Branch
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className={styles.deleteModal}>
                    <p>Are you sure you want to delete this branch?</p>
                    <div className={styles.modalMediumButtonContainer}>
                        <button onClick={confirmDeleteBranch} className={styles.modalMediumButton}>
                            Confirm
                        </button>
                        <button onClick={cancelDelete} className={styles.modalMediumButton}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBranches;
