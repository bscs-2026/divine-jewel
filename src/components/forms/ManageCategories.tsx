import React, { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Errors state

    // Check for duplicate category name
    const isCategoryNameDuplicate = (name: string) => {
        return categories.some(
            (category) =>
                category.name.toLowerCase() === name.toLowerCase() &&
                category.id !== editingCategoryId // Ignore current category when editing
        );
    };

    // Validate category name
    const validateCategoryName = (name: string) => {
        if (name.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, name: 'Category name is required.' }));
        } else if (isCategoryNameDuplicate(name)) {
            setErrors((prevErrors) => ({ ...prevErrors, name: 'Category name already exists.' }));
        } else {
            setErrors((prevErrors) => {
                const { name, ...rest } = prevErrors;
                return rest; // Remove name error if validation passes
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Perform validation when input changes
        if (name === 'name') {
            validateCategoryName(value);
        }
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        validateCategoryName(formData.name);

        if (Object.keys(errors).length > 0) return; // Prevent submission if there are validation errors

        addCategory(formData);
        setFormData(initialFormData);
        setAction(null);
        setErrors({}); // Clear errors after adding
    };

    const handleEditCategory = (category: Category) => {
        setFormData({ id: category.id, name: category.name, description: category.description });
        setEditingCategoryId(category.id);
        setAction('edit');
        setErrors({}); // Clear errors when editing
    };

    const handleSaveEditCategory = (e: React.FormEvent) => {
        e.preventDefault();
        validateCategoryName(formData.name);

        if (Object.keys(errors).length > 0) return; // Prevent submission if there are validation errors

        editCategory(formData);
        setFormData(initialFormData);
        setEditingCategoryId(null);
        setAction(null);
        setErrors({}); // Clear errors after editing
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
        setErrors({}); // Clear errors when canceling
    };

    return (
        <div className={`${styles.modalContent} ${styles.modalContentBig}`}>
            <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>Manage Product Categories</h2>

                {action && (
                    <form className={styles.modalForm} onSubmit={action === 'add' ? handleAddCategory : handleSaveEditCategory}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Category Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={styles.modalInput}
                        />
                        {errors.name && <p className={styles.modalErrorText}>{errors.name}</p>}

                        <input
                            type="text"
                            name="description"
                            placeholder="Category Description"
                            value={formData.description}
                            onChange={handleInputChange}
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
                            setErrors({}); // Clear errors when starting to add
                        }}
                    >
                        Add Category
                    </button>
                </div>

                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onClose={cancelDelete}
                    onConfirm={confirmDeleteCategory}
                />
            </div>
        </div>
    );
};

export default ManageCategories;
