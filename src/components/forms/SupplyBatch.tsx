import React, { useState, useEffect } from 'react';
import styles from '../styles/Modal.module.css';
import { formatDate } from '../../lib/dateTimeHelper';

interface SupplyBatch {
    id: number;
    batch_id: string;
    supply_date: string;
    supplier_id: number;
    supplier_name: string;
    material_name: string;
    quantity: number;
    unit_of_measure: string;
    price_per_unit: number;
    total_cost: number;
    status: 'Pending' | 'Delivered' | 'Cancelled';
}

interface SupplyBatchFormProps {
    batchId: string;
    onClose: () => void;
}

const SupplyBatchForm: React.FC<SupplyBatchFormProps> = ({ batchId, onClose }) => {
    const [supplyBatch, setSupplyBatch] = useState<SupplyBatch[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupplyBatch = async () => {
            try {
                console.log('Starting fetch request for batch ID:', batchId);

                const response = await fetch(`/api/supply/batch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ batch_id: batchId }),
                });

                if (!response.ok) {
                    console.error('Failed to fetch supply batch, status code:', response.status);
                    throw new Error('Failed to fetch supply batch');
                }

                const data = await response.json();
                if (data.supplies && data.supplies.length > 0) {
                    setSupplyBatch(data.supplies);
                } else {
                    console.log('No data returned for this batch ID');
                }
            } catch (error) {
                console.error('Error fetching supply batch:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplyBatch();
    }, [batchId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!supplyBatch || supplyBatch.length === 0) {
        return <div>No data found for this batch</div>;
    }

    // Extracting batch ID and supplier name from the first item (since it's the same for all materials)
    const { batch_id, supplier, supply_date } = supplyBatch[0];

    return (
        <div className={styles.modalContent}>
            <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>Supply Batch Details</h2>

                <div className={styles.batchIDContainer}>
                    <p><strong>Batch ID:</strong> {batch_id}</p>
                    <p><strong>Supplier:</strong> {supplier}</p>
                    <p><strong>Date:</strong> {formatDate(supply_date)}</p>
                </div>

                <table className={styles.modalTable}>
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Price/Unit</th>
                            <th>Total Cost</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplyBatch.map((batch) => (
                            <tr key={batch.id}>
                                <td>{batch.material_name}</td>
                                <td>{batch.quantity}</td>
                                <td>{batch.unit_of_measure}</td>
                                <td>{batch.price_per_unit}</td>
                                <td>{batch.total_cost}</td>
                                <td>{batch.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.modalMediumButtonContainer}>
                    <button onClick={onClose} className={styles.modalMediumButton}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupplyBatchForm;
