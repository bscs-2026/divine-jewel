import React, { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

    const handleAddBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() === '' || formData.address_line.trim() === '') return;
        addBranch(formData);
        setFormData(initialFormData);
        setAction(null);
    };

    const handleEditBranch = (branch: Branch) => {
        setFormData({ id: branch.id, name: branch.name, address_line: branch.address_line });
        setEditingBranchId(branch.id);
        setAction('edit');
    };

    const handleSaveEditBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() === '' || formData.address_line.trim() === '') return;
        editBranch(formData);
        setFormData(initialFormData);
        setEditingBranchId(null);
        setAction(null);
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
    };

    return (
        <div className={`${styles.modalContent} ${styles.modalContentBig}`}>
            <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>Manage Store Branches</h2>

                {action && (
                    <form className={styles.modalForm} onSubmit={action === 'add' ? handleAddBranch : handleSaveEditBranch}>
                        <input
                            type="text"
                            placeholder="Branch Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles.modalInput}
                        />
                        <input
                            type="text"
                            placeholder="Branch Address"
                            value={formData.address_line}
                            onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                            className={styles.modalInput}
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
                        }}
                    >
                        Add Branch
                    </button>
                </div>

                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onClose={cancelDelete}
                    onConfirm={confirmDeleteBranch}
                />
            </div>
        </div>
    );
};

export default ManageBranches;