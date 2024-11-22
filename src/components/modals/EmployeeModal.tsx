import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Employee } from "@/app/employees/page";

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
  existingUsernames: string[];
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
  setSelectedEmployeeType,
  existingUsernames,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    birth_date: "",
    email_address: "",
    contact_number: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      // Clear the errors when the modal opens
      setErrors({});
    } else {
      // Clear the form data when the modal closes
      setFormData({
        first_name: "",
        last_name: "",
        address: "",
        birth_date: "",
        email_address: "",
        contact_number: "",
        username: "",
        password: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingEmployee && currentEmployee) {
      setFormData({
        first_name: currentEmployee.first_name || "",
        last_name: currentEmployee.last_name || "",
        address: currentEmployee.address || "",
        birth_date: currentEmployee.birth_date?.toString().split("T")[0] || "",
        email_address: currentEmployee.email_address || "",
        contact_number: currentEmployee.contact_number || "",
        username: currentEmployee.username || "",
        password: "",
      });
      setSelectedRole(currentEmployee.role_name || "");
      setSelectedEmployeeType(currentEmployee.employee_type || "");
    }
  }, [
    currentEmployee,
    editingEmployee,
    setSelectedRole,
    setSelectedEmployeeType,
  ]);

  const validate = () => {
    let isValid = true;
    let errors: any = {};

    // Validate address
    if (!formData.address) {
      errors.address = "Address is required";
      isValid = false;
    }

    // Validate birth_date
    if (!formData.birth_date) {
      errors.birth_date = "Birth Date is required";
      isValid = false;
    }

    // Validate contact_number
    if (!/^(\d{11})$/.test(formData.contact_number)) {
      errors.contact_number = "Contact Number must be 11 digits";
      isValid = false;
    }

    // Validate email_address
    if (
      formData.email_address &&
      formData.email_address !== "N/A" &&
      !/\S+@\S+\.\S+/.test(formData.email_address)
    ) {
      errors.email_address = "Invalid Email Address";
      isValid = false;
    }

    // Validate role and employee_type
    if (!selectedRole) {
      errors.role_id = "Role is required";
      isValid = false;
    }

    if (!selectedEmployeeType) {
      errors.employee_type = "Employee Type is required";
      isValid = false;
    }

    if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!/^[a-zA-Z]+$/.test(formData.username)) {
      errors.username = "Username must contain only alphabetic characters";
      isValid = false;
    }

    if (currentEmployee && formData.username === currentEmployee.username) {
      // Do nothing, as the username is the same as the current employee's username
    } else if (existingUsernames.includes(formData.username)) {
      errors.username = "Username already taken";
      isValid = false;
    }

  // Password validation
  if (!editingEmployee) {
    // For new employees, password is required
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
      if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
        isValid = false;
      }
    }
  } else {
    // For editing employees, validate only if a new password is provided
    if (formData.password && formData.password.trim() !== "") {
      if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
        isValid = false;
      }
    }
  }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 pt-15 box-border rounded-lg shadow-lg">
        <h2 className="text-[#575757] font-bold mb-4 text-xl">
          {editingEmployee ? "Edit Employee" : "Add Employee"}
        </h2>

        <form
          className="flex flex-col gap-1 text-[#575757]"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              First Name
            </label>
            <input
              className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs"
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Last Name
            </label>
            <input
              className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs"
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs">{errors.last_name}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Address
            </label>
            <input
              className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs"
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Birth Date
            </label>
            <input
              className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs"
              type="date"
              id="birth_date"
              name="birth_date"
              placeholder="Birth Date"
              value={formData.birth_date}
              onChange={handleChange}
            />
            {errors.birth_date && (
              <p className="text-red-500 text-xs">{errors.birth_date}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Email Address
            </label>
            <input
              className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs"
              type="text"
              id="email_address"
              name="email_address"
              placeholder="Email Address (N/A if none)"
              value={formData.email_address}
              onChange={handleChange}
            />
            {errors.email_address && (
              <p className="text-red-500 text-xs">{errors.email_address}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Contact Number
            </label>
            <input
              className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs"
              type="text"
              id="contact_number"
              name="contact_number"
              placeholder="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
            />
            {errors.contact_number && (
              <p className="text-red-500 text-xs">{errors.contact_number}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Role
            </label>
            <select
              id="role_id"
              name="role_id"
              className="w-full p-2 border border-[#ACACAC] rounded-lg text-[#575757] text-xs"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="" disabled>
                Select Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role_id && (
              <p className="text-red-500 text-xs">{errors.role_id}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Employee Type
            </label>
            <select
              id="employee_type"
              name="employee_type"
              className="w-full p-2 border border-[#ACACAC] rounded-lg text-[#575757] text-xs"
              value={selectedEmployeeType}
              onChange={(e) => setSelectedEmployeeType(e.target.value)}
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
            </select>
            {errors.employee_type && (
              <p className="text-red-500 text-xs">{errors.employee_type}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              Username
            </label>
            <input
              className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs"
              placeholder="Username"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-[#575757] mr-[170px]">
              {editingEmployee ? "Reset Password" : "Password"}
            </label>
            <div className="relative w-full overflow-hidden">
              <input
                className="w-full p-2 border border-[#ACACAC] rounded-md text-[#575757] text-xs pr-10"
                placeholder={
                  editingEmployee
                    ? "Leave empty to keep the current password"
                    : "Password"
                }
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-0 px-2 py-1 text-sm text-[#575757] bg-white rounded-r-md flex items-center justify-center"
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye}
                  className="text-sm"
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-3 w-full">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-[#575757] text-sm bg-[#FCB6D7] hover:bg-[#FA85BC] "
            >
              {editingEmployee ? "Save Employee" : "Add Employee"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-[#575757] text-sm bg-[#FCB6D7] hover:bg-[#FA85BC] "
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
