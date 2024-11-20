// components/Employees.tsx
import React from 'react';
import { format } from 'date-fns';
import { Employee } from '@/app/employees/page';
import { ArrowUpward, ArrowDownward, Edit, Archive, Unarchive, InfoOutlined, Delete} from '@mui/icons-material';

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
                <tr >
                    <th className="p-4 text-[#575757] font-bold text-m">Name</th>
                    <th className="p-4 text-[#575757] font-bold text-m">Birth Date</th>
                    <th className="p-4 text-[#575757] font-bold text-m">Address</th>
                    <th className="p-4 text-[#575757] font-bold text-m">Contact Number</th>
                    <th className="p-4 text-[#575757] font-bold text-m">Role</th>
                    <th className="p-4 text-[#575757] font-bold text-m">Employee Type</th>
                    <th className="p-4 text-[#575757] font-bold text-m text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((employee) => (
                    <tr key={employee.id} className="cursor-pointer bg-white even:bg-[#f9f9f9] hover:bg-[#ffe7ef] border-t border-gray-300">
                        <td className="p-4 py-2 text-[#575757] text-xs">{employee.last_name + ', ' + employee.first_name}</td>
                        <td className="p-4 py-2 text-[#575757] text-xs">{employee?.birth_date ? formatDate(employee.birth_date.toString()) : 'N/A'}</td>
                        <td className="p-4 py-2 text-[#575757] text-xs">{employee.address}</td>
                        <td className="p-4 py-2 text-[#575757] text-xs">{employee.contact_number}</td>
                        <td className="p-4 py-2 text-[#575757] text-xs">{employee.role_name}</td>
                        <td className="p-4 py-2 text-[#575757] text-xs">{employee.employee_type}</td>
                        <td className="p-4 py-2 text-[#575757] text-xs text-right">
                            {listView === 'active' ? (
                                <>
                                    <InfoOutlined onClick={() => handleInformationModalOpen(employee)} style={{ cursor: 'pointer', color: '#575757', marginRight: '5px', fontSize: '1.5rem' }} />
                                    <Edit onClick={() => editEmployee(employee.id)} style={{ cursor: 'pointer', color: '#575757', marginRight: '5px', fontSize: '1.5rem' }} />
                                    <Archive onClick={() => archiveEmployee(employee.id)} style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: '1.5rem' }} />
                                </>
                            ) : (
                                <>
                                    <InfoOutlined onClick={() => handleInformationModalOpen(employee)} style={{ cursor: 'pointer', color: '#575757', marginRight: '5px', fontSize: '1.5rem' }} />
                                    <Unarchive onClick={() => unarchiveEmployee(employee.id)} style={{ cursor: 'pointer', color: '#28a745', fontSize: '1.5rem' }} />
                                    <Delete onClick={() => deleteEmployee(employee.id)} style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: '1.5rem', marginLeft: '5px' }} />
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