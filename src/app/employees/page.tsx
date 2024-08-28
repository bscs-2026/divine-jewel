// src/app/employees/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import Layout from '../../components/PageLayout';

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
        <Layout defaultTitle='Employees' 
            rightSidebarContent={
                <div className="w-full bg-[#FFE7EF] p-6 pt-15 box-border">
                    <h2 className="text-[#575757] font-bold text-lg mt-4 mb-4" >{editingEmployee ? 'Edit Employee' : 'Add Employee'} </h2>
                <form className="flex flex-col gap-3 text-[#575757]" onSubmit={editingEmployee ? saveEmployee : addEmployee}>
                            <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs" type='text' id='first_name' name='first_name'  placeholder='First Name' defaultValue={currentEmployee?.first_name || ''}/>
                        
                            <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs" type='text' id='last_name' name='last_name'  placeholder='Last Name' defaultValue={currentEmployee?.last_name || ''}/>
                        
                        
                            <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs" type='email' id='email_address' name='email_address' placeholder='Email Address' defaultValue={currentEmployee?.email_address || ''}/>
                        
                        
                            <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs" type='text' id='contact_number' name='contact_number' placeholder='Contact Number' defaultValue={currentEmployee?.contact_number || ''}/>

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
                        <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs" placeholder='Username' type='text' id='username' name='username'  defaultValue={currentEmployee?.username || ''}/>
                        <input className="w-full p-2 border border-[#FFE7EF] rounded-md text-[#575757] text-xs" placeholder='Password' type='password' id='password' name='password' defaultValue={currentEmployee?.password || ''}/>
        
                        <button type='submit' className="px-2 py-1 rounded-full text-[#575757] text-xs bg-[#FCB6D7]">{editingEmployee ? 'Save Employee' : 'Add Employee'}</button>
                </form>
            </div>
                
            }
            >
            <div className='container m-4'>
                <div className='employee-toggle-view'>
                    <button className='px-2 mx-1 mt-2 border border-white' onClick={() => setListView('active')}>Active</button>
                    <button className='px-2 mx-1 mt-2 border border-white' onClick={() => setListView('inactive')}>Inactive</button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-[0_-0.5rem_1rem_rgba(0,0,0,0.1),0_0.5rem_1rem_rgba(0,0,0,0.15)] overflow-y-auto h-[700px] w-full max-w-[1024px]">
                    <table className='min-w-full'>
                        <thead>
                            <tr>
                                <th className="p-4 text-[#575757] font-bold text-[13px]">Name</th>
                                <th className="p-4 text-[#575757] font-bold text-[13px]">E-mail</th>
                                <th className="p-4 text-[#575757] font-bold text-[13px]">Contact Number</th>
                                <th className="p-4 text-[#575757] font-bold text-[13px]">Role</th>
                                <th className="p-4 text-[#575757] font-bold text-[13px]">Employee Type</th>
                                {/* <th className="p-4 text-[#575757] font-bold text-[13px]">Username</th>
                                <th className="p-4 text-[#575757] font-bold text-[13px]">Password</th> */}
                                <th className="p-4 text-[#575757] font-bold text-[13px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listView === 'active' ? activeEmployees : inactiveEmployees).map((employee) => (
                                <tr key={employee.id} >
                                    <td className="p-4 text-[#575757] text-xs">{employee.last_name + ', ' + employee.first_name}</td>
                                    <td className="p-4 text-[#575757] text-xs">{employee.email_address}</td>
                                    <td className="p-4 text-[#575757] text-xs">{employee.contact_number}</td>
                                    <td className="p-4 text-[#575757] text-xs">{employee.role_name}</td>
                                    <td className="p-4 text-[#575757] text-xs">{employee.employee_type}</td>
                                    {/* <td className="p-4 text-[#575757] text-xs">{employee.username}</td>
                                    <td className="p-4 text-[#575757] text-xs">{employee.password}</td> */}
                                    <td>
                                        {listView === 'active' ? (
                                            <>
                                                <button onClick={() => editEmployee(employee.id)} className="px-2 py-1 rounded-full text-[#575757] text-xs bg-[#FCE4EC]">Edit</button>
                                                <button onClick={() => archiveEmployee(employee.id)} className="px-2 py-[0.15rem] bg-[#D1D5DB] rounded-full text-[#575757] text-xs">Archive</button>
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
        </Layout>
    );
};
