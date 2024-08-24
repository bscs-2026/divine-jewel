import React, { useState } from 'react';
import styles from './styles/Form.module.css';
import styles2 from './styles/Button.module.css';

interface Branch {
    id: number;
    address_line: string;
}

interface ManageBranchesProps {
    branches: Branch[];
    addBranch: (branch: Branch) => void;
    editBranch: (branch: Branch) => void;
    deleteBranch: (id: number) => void;
}

const ManageBranches: React.FC<ManageBranchesProps> = ({
    branches,
    addBranch,
    editBranch,
    deleteBranch }) => {

    const initialFormData = {
        id: 0,
        address_line: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [action, setAction] = useState<'add' | 'edit' | 'delete' | null>(null);

    const handleAddBranch = () => {
        addBranch(formData);
        setFormData(initialFormData);
        setAction(null);
    };

    const handleEditBranch = () => {
        editBranch(formData);
        setFormData(initialFormData);
        setAction(null);
    };

    const handleDeleteBranch = (id: number) => {
        deleteBranch(id);
        setAction(null);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Store Branches</h2>
            {!action && (
                <form className={styles.form}>
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={() => setAction('add')}>Add Branch</button>
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={() => setAction('edit')}>Edit Branch</button>
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={() => setAction('delete')}>Delete Branch</button>
                </form>
            )}
            {action === 'add' && (
                <form className={styles.form}>
                    <h3>Add Branch</h3>
                    <input
                        type="text"
                        placeholder="Address Line"
                        value={formData.address_line}
                        onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                        className={styles.input}
                    />
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={handleAddBranch}>Add</button>
                    <button className={`${styles2.smallButton} ${styles2.cancelButton}`} onClick={() => setAction(null)}>Cancel</button>
                </form>
            )}
            {action === 'edit' && (
                <form className={styles.form}>
                    <h3>Edit Branch</h3>
                    <select
                        onChange={(e) => {
                            const selectedBranch = branches.find(branch => branch.id === Number(e.target.value));
                            if (selectedBranch) {
                                setFormData({ id: selectedBranch.id, address_line: selectedBranch.address_line });
                            }
                        }}
                        className={styles.select}
                        value={formData.id || ''}
                    >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.address_line}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="New Address Line"
                        value={formData.address_line}
                        onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                        className={styles.input}
                    />
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={handleEditBranch}>Submit</button>
                    <button className={`${styles2.smallButton} ${styles2.cancelButton}`} onClick={() => setAction(null)}>Cancel</button>
                </form>
            )}
            {action === 'delete' && (
                <form className={styles.form}>
                    <h3>Delete Branch</h3>
                    <select onChange={(e) => handleDeleteBranch(Number(e.target.value))}
                        className={styles.select}>
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.address_line}</option>
                        ))}
                    </select>
                    <button className={`${styles2.smallButton} ${styles2.cancelButton}`} onClick={() => setAction(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default ManageBranches;