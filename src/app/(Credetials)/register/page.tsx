'use client'
import React, { useState } from "react";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    roll?: string;
    department?: string;
    batch?: string;
    idNumber?: string;
    position?: string;
    password: string;
    confirmPassword: string;
    profilePicture: File | null;
  }>({
    name: "",
    email: "",
    phone: "",
    roll: "",
    department: "",
    batch: "",
    idNumber: "",
    position: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [isTeacher, setIsTeacher] = useState(false); // State to toggle form type
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";

    if (isTeacher) {
      if (!formData.idNumber) newErrors.idNumber = "ID Number is required";
      if (!formData.position) newErrors.position = "Position is required";
    } else {
      if (!formData.roll) newErrors.roll = "Roll number is required";
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.batch) newErrors.batch = "Batch is required";
    }

    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log(formData);
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="flex flex-col max-w-lg p-6 rounded-md sm:p-10 dark:bg-gray-50 dark:text-gray-800 mx-auto my-10">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-4xl font-bold">Register</h1>
        <p className="text-sm dark:text-gray-600 mb-6">Create your account</p>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => setIsTeacher(false)}
            className={`px-4 py-2 font-semibold rounded-md ${
              !isTeacher ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            As a Student
          </button>
          <button
            type="button"
            onClick={() => setIsTeacher(true)}
            className={`px-4 py-2 font-semibold rounded-md ${
              isTeacher ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            As a Teacher
          </button>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0123456789"
            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
          />
          {errors.phone && <span className="text-red-500">{errors.phone}</span>}
        </div>

        {/* Conditional Fields */}
        {isTeacher ? (
          <>
            {/* ID Number */}
            <div>
              <label htmlFor="idNumber" className="block mb-2 text-sm">ID Number</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber || ""}
                onChange={handleChange}
                placeholder="123456"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
              {errors.idNumber && <span className="text-red-500">{errors.idNumber}</span>}
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block mb-2 text-sm">Position</label>
              <select
                name="position"
                value={formData.position || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              >
                <option value="">Select Position</option>
                <option value="Principal">Principal</option>
                <option value="Vice Principal">Vice Principal</option>
                <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                <option value="Senior Instructor">Senior Instructor</option>
                <option value="Instructor">Instructor</option>
                <option value="Junior Instructor">Junior Instructor</option>
                <option value="Workshop Instructor">Workshop Instructor</option>
                <option value="Lab Technician">Lab Technician</option>
              </select>
              {errors.position && <span className="text-red-500">{errors.position}</span>}
            </div>
          </>
        ) : (
          <>
            {/* Roll Number */}
            <div>
              <label htmlFor="roll" className="block mb-2 text-sm">Roll Number</label>
              <input
                type="text"
                name="roll"
                value={formData.roll || ""}
                onChange={handleChange}
                placeholder="511189"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
              {errors.roll && <span className="text-red-500">{errors.roll}</span>}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block mb-2 text-sm">Department</label>
              <select
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              >
                <option value="">Select Department</option>
                <option value="Civil Technology">Civil Technology</option>
                <option value="Computer Technology">Computer Technology</option>
                <option value="Electrical Technology">Electrical Technology</option>
                <option value="Electronics Technology">Electronics Technology</option>
                <option value="Mechanical Technology">Mechanical Technology</option>
                <option value="AIDT Technology">AIDT Technology</option>
                <option value="Construction Technology">Construction Technology</option>
              </select>
              {errors.department && <span className="text-red-500">{errors.department}</span>}
            </div>

            {/* Batch */}
            <div>
              <label htmlFor="batch" className="block mb-2 text-sm">Batch</label>
              <input
                type="text"
                name="batch"
                value={formData.batch || ""}
                onChange={handleChange}
                placeholder="2024"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
              {errors.batch && <span className="text-red-500">{errors.batch}</span>}
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm">Password</label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="******"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500"
            >
              {passwordVisible ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {errors.password && <span className="text-red-500">{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm">Confirm Password</label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="******"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500"
            >
              {confirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Profile Picture */}
        <div>
          <label htmlFor="profilePicture" className="block mb-2 text-sm">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
