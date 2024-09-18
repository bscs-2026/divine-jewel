import React, { useState } from 'react';
import { format } from 'date-fns';
import { Employee } from '@/app/employees/page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface InformationModalProps {
    isInfoModalOpen: boolean;
    onInfoModalClose: () => void;
    employee: Employee | null;
}

const InformationModal: React.FC<InformationModalProps> = ({ isInfoModalOpen, onInfoModalClose, employee }) => {
    const [showPassword, setShowPassword] = useState(false);

    if (!isInfoModalOpen || !employee) return null;

    const handleClose = () => {
        setShowPassword(false);
        onInfoModalClose();
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return format(date, 'MMMM d, yyyy');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-[#575757] font-bold mb-4 text-xl">Employee Information</h2>
                <div className="flex flex-col gap-3 text-[#575757]">
                    <div>
                        <strong>First Name:</strong> {employee.first_name}
                    </div>
                    <div>
                        <strong>Last Name:</strong> {employee.last_name}
                    </div>
                    <div>
                        <strong>Birth Date:</strong> {employee?.birth_date ? formatDate(employee.birth_date.toString()) : 'N/A'}
                    </div>
                    <div>
                        <strong>Address:</strong> {employee.address}
                    </div>
                    <div>
                        <strong>Email Address:</strong> {employee.email_address || 'N/A'}
                    </div>
                    <div>
                        <strong>Contact Number:</strong> {employee.contact_number}
                    </div>
                    <div>
                        <strong>Role:</strong> {employee.role_name}
                    </div>
                    <div>
                        <strong>Employee Type:</strong> {employee.employee_type}
                    </div>
                    <div>
                        <strong>Username:</strong> {employee.username}
                    </div>
                    <div className="flex items-center justify-between">
                        <strong>Password:</strong>
                        <div className="flex items-center w-full ml-2">
                            <span className="flex-1">
                                {showPassword ? employee.password : '********'}
                            </span>
                            <button
                                className="ml-2 text-[#575757] hover:text-[#FCB6D7]"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    className="mt-4 px-4 py-2 rounded-full text-[#575757] bg-[#FCB6D7] hover:bg-[#FFE7EF]"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default InformationModal;
