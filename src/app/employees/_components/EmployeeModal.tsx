import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Employee } from '../page';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    currentEmployee: Employee | null;
    editingEmployee: boolean;
    roles: { id: number; name: string }[];
    selectedRole: string;
    setSelectedRole: (role: string) => void;
    selectedEmployeeType: string;
    setSelectedEmployeeType: (type: string) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ 
    isOpen,
    onClose,
    onSubmit,
    currentEmployee,
    editingEmployee,
    roles,
    selectedRole,
    setSelectedRole,
    selectedEmployeeType,
    setSelectedEmployeeType
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-[#FFE7EF] p-6 pt-15 box-border rounded-lg shadow-lg w-1/3">
                <h2 className="text-[#575757] font-bold mb-4 text-xl">
                    {editingEmployee ? 'Edit Employee' : 'Add Employee'}
                </h2>

                <form className="flex flex-col gap-3 text-[#575757]" onSubmit={onSubmit}>
                    <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs"
                        type='text'
                        id='first_name'
                        name='first_name'
                        placeholder='First Name'
                        defaultValue={currentEmployee?.first_name || ''} 
                    />

                    <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs"
                        type='text'
                        id='last_name'
                        name='last_name'
                        placeholder='Last Name'
                        defaultValue={currentEmployee?.last_name || ''} 
                    />

                    <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs"
                        type='text'
                        id='address'
                        name='address'
                        placeholder='Address'
                        defaultValue={currentEmployee?.address || ''} 
                    />

                    <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs"
                        type='date'
                        id='birth_date'
                        name='birth_date'
                        placeholder='Birth Date'
                        defaultValue={editingEmployee ? (currentEmployee?.birth_date?.toString().split('T')[0] || '') : ''}
                    />

                    <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs"
                        type='email'
                        id='email_address'
                        name='email_address'
                        placeholder='Email Address'
                        defaultValue={currentEmployee?.email_address || ''} 
                    />

                    <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs"
                        type='text'
                        id='contact_number'
                        name='contact_number'
                        placeholder='Contact Number'
                        defaultValue={currentEmployee?.contact_number || ''} 
                    />

                    <select
                        id='role_id'
                        name='role_id'
                        className="w-full p-2 border border-[#FFE7EF] rounded-lg text-[#575757] text-xs"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value='' disabled>Select Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>

                    <select
                        id='employee_type'
                        name='employee_type'
                        className="w-full p-2 border border-[#FFE7EF] rounded-lg text-[#575757] text-xs"
                        value={selectedEmployeeType}
                        onChange={(e) => setSelectedEmployeeType(e.target.value)}
                    >
                        <option value='' disabled>Select Type</option>
                        <option value='Full-Time'>Full-Time</option>
                        <option value='Part-Time'>Part-Time</option>
                    </select>

                    <input
                        className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs"
                        placeholder='Username'
                        type='text'
                        id='username'
                        name='username'
                        defaultValue={currentEmployee?.username || ''} 
                    />

                    <div className="relative w-full overflow-hidden">
                        <input
                            className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs pr-10"
                            placeholder='Password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            id='password'
                            name='password'
                            defaultValue={currentEmployee?.password || ''} 
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 px-2 py-1 text-sm text-[#575757] bg-white rounded-r-md flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} className="text-sm" />
                        </button>
                    </div>

                    <button
                        type='submit'
                        className="px-2 py-1 rounded-full text-[#575757] text-xs bg-[#FCB6D7]"
                    >
                        {editingEmployee ? 'Save Employee' : 'Add Employee'}
                    </button>
                    <button
                        className="px-2 py-1 rounded-full text-[#575757] text-xs bg-[#FCB6D7]"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EmployeeModal;
