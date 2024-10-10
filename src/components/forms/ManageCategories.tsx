import React, { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import styles from '../styles/Modal.module.css';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ManageCategoriesProps {
  categories: Category[];
  addCategory: (category: Category) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;
}

const ManageCategories: React.FC<ManageCategoriesProps> = ({
  categories = [],
  addCategory,
  editCategory,
  deleteCategory,
}) => {
  const initialFormData = {
    id: 0,
    name: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [action, setAction] = useState<'add' | 'edit' | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Check for duplicate category name
  const isCategoryNameDuplicate = (name: string) => {
    return categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== editingCategoryId // Ignore current category when editing
    );
  };

  const validateForm = (): boolean => {
    let formIsValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
      formIsValid = false;
    } else if (isCategoryNameDuplicate(formData.name)) {
      setErrorMessage('Category name already exists');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 2000);
      formIsValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addCategory(formData);
      setFormData(initialFormData);
      setAction(null);
      setErrors({});
    }
  };

  const handleEditCategory = (category: Category) => {
    setFormData({ id: category.id, name: category.name, description: category.description });
    setEditingCategoryId(category.id);
    setAction('edit');
    setErrors({});
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      editCategory(formData);
      setFormData(initialFormData);
      setEditingCategoryId(null);
      setAction(null);
      setErrors({});
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete !== null) {
      deleteCategory(categoryToDelete);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
    setShowDeleteModal(false);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingCategoryId(null);
    setAction(null);
    setErrors({});
  };

  return (
    <div className={`${styles.modalContent} ${styles.modalContentBig}`}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>Manage Product Categories</h2>

        {action && (
          <form
            className={styles.modalForm}
            onSubmit={action === 'add' ? handleAddCategory : handleSaveEditCategory}
          >
            <input
              type="text"
              placeholder={errors.name || 'Category Name'}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              className={`${styles.modalInput} ${errors.name ? styles.inputError : ''}`}
            />

            <input
              type="text"
              placeholder={errors.description || 'Category Description'}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: '' });
              }}
              className={`${styles.modalInput} ${errors.description ? styles.inputError : ''}`}
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
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <Edit
                    onClick={() => handleEditCategory(category)}
                    className={styles.modalEditIcon}
                  />
                  <Delete
                    onClick={() => handleDeleteCategory(category.id)}
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
              setEditingCategoryId(null);
              setAction('add');
              setErrors({});
            }}
          >
            Add Category
          </button>
        </div>
      </div>

      {showErrorModal && (
        <div className={styles.errorModal}>
          <p>{errorMessage}</p>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.deleteModal}>
          <p>Are you sure you want to delete this category?</p>
          <div className={styles.modalMediumButtonContainer}>
            <button onClick={confirmDeleteCategory} className={styles.modalMediumButton}>
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

export default ManageCategories;
