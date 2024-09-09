import React, { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import modalStyles from '../styles/Modal.module.css';

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
  branches,
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
  const [action, setAction] = useState<'add' | 'edit' | 'delete' | null>(null);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === '' || formData.address_line.trim() === '') return;
    addBranch(formData);
    setFormData(initialFormData);
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
    deleteBranch(id);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingBranchId(null);
    setAction(null);
  };

  return (
    <div className={modalStyles.modalContent}>
      <div className={modalStyles.modalContentScrollable}>
        <h2 className={modalStyles.modalHeading}>Manage Store Branches</h2>

        {/* Add Branch Form */}
        {action === 'add' && (
          <form className={modalStyles.modalForm} onSubmit={handleAddBranch}>
            <input
              type="text"
              placeholder="Branch Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={modalStyles.modalInput}
            />
            <input
              type="text"
              placeholder="Branch Address"
              value={formData.address_line}
              onChange={(e) =>
                setFormData({ ...formData, address_line: e.target.value })
              }
              className={modalStyles.modalInput}
            />
            <div className={modalStyles.modalButtonContainer}>
              <button type="submit" className={modalStyles.modalButton}>
                Add
              </button>
              <button
                type="button"
                className={modalStyles.modalButton}
                onClick={() => setAction(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* List of Branches */}
        <table className={modalStyles.modalTable}>
          <thead>
            <tr>
              <th>Branch Name</th>
              <th>Branch Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td>
                  {editingBranchId === branch.id ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={modalStyles.modalInput}
                    />
                  ) : (
                    branch.name
                  )}
                </td>
                <td>
                  {editingBranchId === branch.id ? (
                    <input
                      type="text"
                      value={formData.address_line}
                      onChange={(e) =>
                        setFormData({ ...formData, address_line: e.target.value })
                      }
                      className={modalStyles.modalInput}
                    />
                  ) : (
                    branch.address_line
                  )}
                </td>
                <td>
                  {editingBranchId === branch.id ? (
                    <>
                      <button
                        className={modalStyles.modalButton}
                        onClick={handleSaveEditBranch}
                      >
                        Save
                      </button>
                      <button
                        className={modalStyles.modalButton}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Edit
                        onClick={() => handleEditBranch(branch)}
                        className={modalStyles.iconButton}
                        style={{ cursor: 'pointer', color: '#575757' }}
                      />
                      <Delete
                        onClick={() => handleDeleteBranch(branch.id)}
                        className={modalStyles.iconButton}
                        style={{ cursor: 'pointer', color: '#ff4d4f', marginLeft: '10px' }}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add New Branch Button */}
        <div className={modalStyles.modalButtonContainer}>
          <button
            className={modalStyles.modalButton}
            onClick={() => setAction('add')}
          >
            Add Branch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBranches;
