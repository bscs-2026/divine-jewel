// src/app/employees/page.tsx
'use client';

import { Suspense, useEffect, useState, FormEvent } from 'react';
import MainLayout from '@/components/MainLayout';
import EmployeeModal from './_components/EmployeeModal';
import InformationModal from './_components/InformationModal';
import EmployeeTable from './_components/EmployeeTable';


export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    address: string;
    email_address: string;
    birth_date: Date;
    contact_number: string;
    employee_type: string;
    role_name: string;
    username: string;
    password: string;
    is_archive: number | boolean;
}

export interface Role {
    id: number;
    name: string;
    description: string;
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>('');
    const [listView, setListView] = useState<'active' | 'inactive'>('active');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isInformationModalOpen, setIsInformationModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchEmployees();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (currentEmployee) {
            setSelectedRole(getRoleIdFromName(currentEmployee.role_name));
            setSelectedEmployeeType(currentEmployee.employee_type);
        }
    }, [currentEmployee]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/employees');
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            setEmployees(data.Employees);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch('/api/employees/roles');
            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
            const data = await response.json();
            setRoles(data.roles);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const addEmployee = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Form Data:', data);

        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            form.reset();
            setSelectedRole('');
            setSelectedEmployeeType('');
            setIsModalOpen(false);
            fetchEmployees();
        } catch (error: any) {
            setError(error.message);
            console.error('An error occurred while adding employee:', error);
        }
    };

    const editEmployee = (id: number) => {
        const employee = employees.find((employee) => employee.id === id);
        if (employee) {
            setCurrentEmployee(employee);
            setEditingEmployee(true);
            setIsModalOpen(true);
            console.log(employee);
        }

    };

    const getRoleIdFromName = (roleName: string) => {
        const role = roles.find((role) => role.name === roleName);
        return role ? role.id.toString() : '';
    };

    const saveEmployee = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/employees/${currentEmployee?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee');
            }

            fetchEmployees();
        } catch (error: any) {
            setError(error.message);
            console.error('An error occurred while updating employee:', error);
        } finally {
            setEditingEmployee(false);
            setCurrentEmployee(null);
            form.reset();
            setSelectedRole('');
            setSelectedEmployeeType('');
            setIsModalOpen(false);
        }
    };

    const archiveEmployee = async (id: number) => {
        const confirmArchive = confirm('Are you sure you want to archive this employee?');

        if (!confirmArchive) {
            return;
        }

        try {
            const response = await fetch(`/api/employees/${id}/archive`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_archive: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to archive employee');
            }
            await fetchEmployees();
        } catch (error: any) {
            setError(error.message);
            console.error('An error occurred while archiving employee:', error);
        }
    }

    const unarchiveEmployee = async (id: number) => {
        const confirmUnarchive = confirm('Are you sure you want to unarchive this employee?');

        if (!confirmUnarchive) {
            return;
        }

        try {
            const response = await fetch(`/api/employees/${id}/archive`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_archive: false }),
            });

            if (!response.ok) {
                throw new Error('Failed to unarchive employee');
            }
            await fetchEmployees();
        } catch (error: any) {
            setError(error.message);
            console.error('An error occurred while unarchiving employee:', error);
        }
    };

    const deleteEmployee = async (id: number) => {
        const confirmDelete = confirm('Are you sure you want to delete this employee?');

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }
            await fetchEmployees();
        } catch (error: any) {
            setError(error.message);
            console.error('An error occurred while deleting employee:', error);
        }
    };

    const handleAddEmployee = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEmployee(false);
        setCurrentEmployee(null);
        setSelectedRole('');
        setSelectedEmployeeType('');
        setIsModalOpen(false);
    };

    const handleInformationModalOpen = (employee: Employee) => {
        setCurrentEmployee(employee);
        setIsInformationModalOpen(true);
    }

    const handleInformationModalClose = () => {
        setIsInformationModalOpen(false);
    }

    const activeEmployees = employees.filter(employee => employee.is_archive === 0 || employee.is_archive === false);
    const inactiveEmployees = employees.filter(employee => employee.is_archive === 1 || employee.is_archive === true);

    return (
        <MainLayout defaultTitle='Employees'>
            <div className='m-4'>

                <div className="flex justify-start mb-5 p-5 text-[13px] border border-[#DDDDDD] bg-[#F9F9F9] rounded-lg shadow-md text-[#575757]">
                    <button
                        className={`px-2 py-1.5 rounded-full text-[#575757] text-[13px] bg-[${listView === 'active' ? '#FCB6D7' : '#F9F9F9'}]`}
                        onClick={() => setListView('active')}>Active
                    </button>
                    <button
                        className={`px-2 py-1.5 rounded-full text-[#575757] text-[13px] bg-[${listView === 'inactive' ? '#FCB6D7' : '#F9F9F9'}]`}
                        onClick={() => setListView('inactive')}>
                        Inactive
                    </button>
                    <button
                        className="ml-auto px-4 py-2 rounded-full text-[#575757] bg-[#FCB6D7] hover:bg-[#FFE7EF]"
                        onClick={handleAddEmployee}
                    >
                        Add Employee
                    </button>
                </div>

                <EmployeeModal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    onSubmit={editingEmployee ? saveEmployee : addEmployee}
                    currentEmployee={currentEmployee}
                    editingEmployee={editingEmployee}
                    roles={roles}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    selectedEmployeeType={selectedEmployeeType}
                    setSelectedEmployeeType={setSelectedEmployeeType}
                />

                <div className="bg-white p-4 rounded-lg shadow-[0_-0.5rem_1rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.15)] ">
                    
                    <EmployeeTable
                        employees={listView === 'active' ? activeEmployees : inactiveEmployees}
                        listView={listView}
                        handleInformationModalOpen={handleInformationModalOpen}
                        editEmployee={editEmployee}
                        archiveEmployee={archiveEmployee}
                        unarchiveEmployee={unarchiveEmployee}
                        deleteEmployee={deleteEmployee}
                    />

                    <InformationModal
                        isInfoModalOpen={isInformationModalOpen}
                        onInfoModalClose={handleInformationModalClose}
                        employee={currentEmployee}
                    />

                </div>
            </div>
        </MainLayout>
    );
};
