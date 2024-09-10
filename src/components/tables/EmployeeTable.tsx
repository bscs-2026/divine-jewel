// components/EmployeeTable.tsx
import React from 'react';
import { format } from 'date-fns';
import { Employee } from '@/app/employees/page';

type EmployeeTableProps = {
    employees: Employee[];
    listView: string;
    handleInformationModalOpen: (employee: Employee) => void;
    editEmployee: (id: number) => void;
    archiveEmployee: (id: number) => void;
    unarchiveEmployee: (id: number) => void;
    deleteEmployee: (id: number) => void;
};

const EmployeeTable = ({
    employees,
    listView,
    handleInformationModalOpen,
    editEmployee,
    archiveEmployee,
    unarchiveEmployee,
    deleteEmployee
}: EmployeeTableProps) => {

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return format(date, 'MMMM d, yyyy');
    };

    return (
        <table className="w-full text-left text-black">
            <thead>
                <tr>
                    <th className="p-4 text-[#575757] font-bold text-[13px]">Name</th>
                    <th className="p-4 text-[#575757] font-bold text-[13px]">Birth Date</th>
                    <th className="p-4 text-[#575757] font-bold text-[13px]">Contact Number</th>
                    <th className="p-4 text-[#575757] font-bold text-[13px]">Role</th>
                    <th className="p-4 text-[#575757] font-bold text-[13px]">Employee Type</th>
                    <th className="p-4 text-[#575757] font-bold text-[13px]">Actions</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((employee) => (
                    <tr key={employee.id} className="w-full text-left text-black border-t border-gray-300">
                        <td className="p-4 text-[#575757] text-xs">{employee.last_name + ', ' + employee.first_name}</td>
                        <td className="p-4 text-[#575757] text-xs">{employee?.birth_date ? formatDate(employee.birth_date.toString()) : 'N/A'}</td>
                        <td className="p-4 text-[#575757] text-xs">{employee.contact_number}</td>
                        <td className="p-4 text-[#575757] text-xs">{employee.role_name}</td>
                        <td className="p-4 text-[#575757] text-xs">{employee.employee_type}</td>
                        <td className="p-4 text-[#575757] text-xs">
                            {listView === 'active' ? (
                                <>
                                    <button onClick={() => handleInformationModalOpen(employee)} className="mr-2 px-2 py-1 rounded-full text-[#575757] text-xs bg-[#FCE4EC]">More Info</button>
                                    <button onClick={() => editEmployee(employee.id)} className="px-2 py-1 rounded-full text-[#575757] text-xs bg-[#FCE4EC]">Edit</button>
                                    <button onClick={() => archiveEmployee(employee.id)} className="mx-2 px-2 py-[0.15rem] bg-[#D1D5DB] rounded-full text-[#575757] text-xs">Archive</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleInformationModalOpen(employee)} className="mr-2 px-2 py-1 rounded-full text-[#575757] text-xs bg-[#FCE4EC]">More Info</button>
                                    <button onClick={() => unarchiveEmployee(employee.id)} className="px-2 py-[0.15rem] bg-[#FCE4EC] rounded-full text-[#575757] text-xs">Unarchive</button>
                                    <button onClick={() => deleteEmployee(employee.id)} className=" mx-2 px-2 py-[0.15rem] bg-[#D1D5DB] rounded-full text-[#661a1a] text-xs">Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default EmployeeTable;