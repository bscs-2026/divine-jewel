import React, { useState } from 'react';
import styles from '../styles/Form.module.css';
import styles2 from '../styles/Button.module.css';

interface Category {
    id: number;
    name: string;
    description: string;
}

interface CategoryFormProps {
    categories: Category[];
    addCategory: (category: Category) => void;
    editCategory: (category: Category) => void;
    deleteCategory: (id: number) => void;
}

const ManageCategories: React.FC<CategoryFormProps> = ({
    categories,
    addCategory,
    editCategory,
    deleteCategory }) => {

    const initialFormData = {
        id: 0,
        name: '',
        description: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [action, setAction] = useState<'add' | 'edit' | 'delete' | null>(null);

    const handleAddCategory = () => {
        addCategory(formData);
        setFormData(initialFormData);
        setAction(null);
    };

    const handleEditCategory = () => {
        editCategory(formData);
        setFormData(initialFormData);
        setAction(null);
    };

    const handleDeleteCategory = (id: number) => {
        deleteCategory(id);
        setAction(null);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Product Categories</h2>
            {!action && (
                <form className={styles.form}>
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={() => setAction('add')}>Add Category</button>
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={() => setAction('edit')}>Edit Category</button>
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={() => setAction('delete')}>Delete Category</button>
                </form>
            )}

            {action === 'add' && (
                <form className={styles.form}>
                    <h3>Add Category</h3>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Category Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={styles.input}
                    />
                    <button className={`${styles2.smallButton} ${styles2.addButton}`} onClick={handleAddCategory}>Add</button>
                    <button className={`${styles2.smallButton} ${styles2.cancelButton}`} onClick={() => setAction(null)}>Cancel</button>
                </form>
            )}
            {action === 'edit' && (
                <form className={styles.form}>
                    <h3>Edit Category</h3>
                    <select
                        onChange={(e) => {
                            const selectedCategory = categories.find(category => category.id === Number(e.target.value));
                            if (selectedCategory) {
                                setFormData({
                                    id: selectedCategory.id,
                                    name: selectedCategory.name,
                                    description: selectedCategory.description
                                });
                            }
                        }}
                        className={styles.select}
                        value={formData.id || ''}
                    >
                        <option value="">Select a Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Category Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={styles.input}
                    />
                    <button
                        className={`${styles2.smallButton} ${styles2.addButton}`}
                        onClick={handleEditCategory}>
                        save
                    </button>
                    <button className={`${styles2.smallButton} ${styles2.cancelButton}`} onClick={() => setAction(null)}>Cancel</button>

                </form>
            )}
            {action === 'delete' && (
                <form className={styles.form}>
                    <h3>Delete Category</h3>
                    <select
                        onChange={(e) => setFormData({ ...formData, id: Number(e.target.value) })}
                        value={formData.id || ''}
                        className={styles.select}
                    >
                        <option value="">Select a Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`${styles2.smallButton} ${styles2.deleteButton}`}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent form submission
                            if (formData.id) {
                                handleDeleteCategory(formData.id);
                            }
                        }}>
                        Delete
                    </button>
                    <button className={`${styles2.smallButton} ${styles2.cancelButton}`} onClick={() => setAction(null)}>Cancel</button>
                </form>
            )}

        </div>
    );

};
export default ManageCategories;