// src/app/employees/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    contact_number: string;
    employee_type: string;
    role_name: string;
    username: string;
    password: string;
    is_archive: number | boolean;
}

interface Role {
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

    const activeEmployees = employees.filter(employee => employee.is_archive === 0 || employee.is_archive === false);
    const inactiveEmployees = employees.filter(employee => employee.is_archive === 1 || employee.is_archive === true);

    return (
        <div className='container m-4'>
            <h1 className='text-2xl mb-4 font-bold'>Employees</h1>
            <div className='input-form'>
                <form onSubmit={editingEmployee ? saveEmployee : addEmployee}>
                    <div>
                        <label htmlFor='first_name'>First Name: </label>
                        <input type='text' id='first_name' name='first_name' className='text-black' defaultValue={currentEmployee?.first_name || ''}/>
                        <label htmlFor='last_name'>Last Name: </label>
                        <input type='text' id='last_name' name='last_name' className='text-black' defaultValue={currentEmployee?.last_name || ''}/>
                        <label htmlFor='email_address'>E-mail: </label>
                        <input type='email' id='email_address' name='email_address' className='text-black'defaultValue={currentEmployee?.email_address || ''}/>
                        <label htmlFor='contact_number'>Contact Number: </label>
                        <input type='text' id='contact_number' name='contact_number' className='text-black' defaultValue={currentEmployee?.contact_number || ''}/>
                    </div>
                    <div className='mt-4'>
                        <label htmlFor='role_id'>Role: </label>
                        <select 
                            id='role_id' 
                            name='role_id' 
                            className='text-black' 
                            value={selectedRole} 
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value='' disabled>Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <label htmlFor='employee_type'>Employee Type: </label>
                        <select 
                            id='employee_type' 
                            name='employee_type' 
                            className='text-black' 
                            value={selectedEmployeeType} 
                            onChange={(e) => setSelectedEmployeeType(e.target.value)}
                        >
                            <option value='' disabled>Select Type</option>
                            <option value='Full-Time'>Full-Time</option>
                            <option value='Part-Time'>Part-Time</option>
                        </select>

                        <label htmlFor='username'>Username: </label>
                        <input type='text' id='username' name='username' className='text-black' defaultValue={currentEmployee?.username || ''}/>
                        <label htmlFor='password'>Password: </label>
                        <input type='password' id='password' name='password' className='text-black' defaultValue={currentEmployee?.password || ''}/>
                            
                        <button type='submit' className='px-2 mx-2 border border-white'>{editingEmployee ? 'Save Employee' : 'Add Employee'}</button>
                    </div>
                </form>
            </div>
            <div className='employee-toggle-view'>
                <button className='px-2 mx-1 mt-2 border border-white' onClick={() => setListView('active')}>Active</button>
                <button className='px-2 mx-1 mt-2 border border-white' onClick={() => setListView('inactive')}>Inactive</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-center">Name</th>
                            <th className="px-4 py-2 text-center">E-mail</th>
                            <th className="px-4 py-2 text-center">Contact Number</th>
                            <th className="px-4 py-2 text-center">Role</th>
                            <th className="px-4 py-2 text-center">Employee Type</th>
                            <th className="px-4 py-2 text-center">Username</th>
                            <th className="px-4 py-2 text-center">Password</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(listView === 'active' ? activeEmployees : inactiveEmployees).map((employee) => (
                            <tr key={employee.id} >
                                <td className='px-4'>{employee.last_name + ', ' + employee.first_name}</td>
                                <td className='px-4'>{employee.email_address}</td>
                                <td className='px-4'>{employee.contact_number}</td>
                                <td className='px-4'>{employee.role_name}</td>
                                <td className='px-4'>{employee.employee_type}</td>
                                <td className='px-4'>{employee.username}</td>
                                <td className='px-4'>{employee.password}</td>
                                <td>
                                    {listView === 'active' ? (
                                        <>
                                            <button onClick={() => editEmployee(employee.id)} className='px-2'>Edit</button>
                                            <button onClick={() => archiveEmployee(employee.id)} className='px-2'>Archive</button>
                                        </>
                                    ) : (
                                        <button onClick={() => unarchiveEmployee(employee.id)}>Unarchive</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
