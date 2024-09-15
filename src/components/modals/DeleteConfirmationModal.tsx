import React from 'react';
import styles from '../styles/Modal.module.css';

interface DeleteConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ show, onClose, onConfirm }) => (
    show ? (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContentConfirmation}>
                <p>Are you sure you want to delete this branch?</p>
                <div className={styles.modalMediumButtonContainer}>
                    <button className={styles.modalMediumButton} onClick={onClose}>Cancel</button>
                    <button className={styles.modalMediumButton} onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    ) : null
);

export default DeleteConfirmationModal;
