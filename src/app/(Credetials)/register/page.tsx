"use client";
import Link from "next/link";
import React, { useState } from "react";
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords
import { signIn } from "next-auth/react";
import { UserRegister } from "@/app/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {addData } from '../../features/user/userSlices';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<UserRegister>({
    name: "",
    email: "",
    phone: "",
    roll: "",
    department: "",
    batch: "",
    position: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    profilePictureUrl: "",
  });

  const [isTeacher, setIsTeacher] = useState(false); // State to toggle form type
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [uploading, setUploading] = useState(false); // State for image upload status
  const dispatch = useDispatch<AppDispatch>();
  //const { items, status, error } = useSelector((state: RootState) => state.data);

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

  const uploadImageToImgbb = async () => {
    if (!formData.profilePicture) return "";

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API; // Replace with your imgbb API key
    const formDataToUpload = new FormData();
    formDataToUpload.append("image", formData.profilePicture);

    try {
      setUploading(true);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formDataToUpload,
        }
      );

      const result = await response.json();
      setUploading(false);

      if (result.success) {
        return result.data.url;
      } else {
        alert("Image upload failed. Please try again.");
        return "";
      }
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validate();
    setErrors(validationErrors);

    // If no validation errors
    if (Object.keys(validationErrors).length === 0) {
      // Upload profile picture and get the URL
      const profilePictureUrl = await uploadImageToImgbb();

      // If the image URL is successfully retrieved
      if (profilePictureUrl) {
        // Hash the password before logging it (consider hashing on the server side for security reasons)
        const hashedPassword = await bcrypt.hash(formData.password, 10);

        // Update form data with the uploaded profile picture URL
        setFormData((prevData) => ({
          ...prevData,
          profilePictureUrl,
        }));

        // Create the form value without confirmPassword and profilePicture
        const { password, confirmPassword, profilePicture, ...formValue } = formData;

        // Ensure password and confirmPassword match before proceeding
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: "Passwords do not match" });
          return;
        }

        // Create the form value with hashedPassword and profilePictureUrl
        const formValueLink: UserRegister = {
          ...formValue,
          profilePictureUrl,
          hashedPassword,
        };

        dispatch(addData(formValueLink))
        setFormData({
          name: "",
          email: "",
          phone: "",
          roll: "",
          department: "",
          batch: "",
          position: "",
          password: "",
          confirmPassword: "",
          profilePicture: null,
          profilePictureUrl: "",
        })

        // try {
        //   const response = await fetch('http://localhost:3000/register/api', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formValueLink),
        //   });

        //   const result = await response.json();
        //   if (result.user.insertedId) {
        //     // Attempt to sign in the user after registration
        //     const loginResponse = await signIn('credentials', {
        //       redirect: false, // Prevent automatic redirect from NextAuth
        //       roll: formData.roll, // Adjust this based on your user object structure
        //       password: formData.password,
        //     });
  
        //     if (loginResponse?.ok) {
        //       alert('Success to Register');
        //     } else {
        //       console.error('Login failed');
        //     }
        //   }
        // } catch (error) {
        //   console.error('Error:', error);
        // }
      }
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
          <label htmlFor="name" className="block mb-2 text-sm">
            Name
          </label>
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
          <label htmlFor="email" className="block mb-2 text-sm">
            Email
          </label>
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
          <label htmlFor="phone" className="block mb-2 text-sm">
            Phone Number
          </label>
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

        {/* ID Number */}
        <div>
          <label htmlFor="idNumber" className="block mb-2 text-sm">
            {isTeacher ? 'ID Number': 'Roll Number'}
          </label>
          <input
            type="text"
            name="roll"
            value={formData.roll || ""}
            onChange={handleChange}
            placeholder="123456"
            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
          />
          {errors.roll && (
            <span className="text-red-500">{errors.roll}</span>
          )}
        </div>

        {/* Conditional Fields */}
        {isTeacher ? (
          <>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block mb-2 text-sm">
                Position
              </label>
              <select
                name="position"
                value={formData.position || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              >
                <option value="">Select Position</option>
                <option value="Principal">Principal</option>
                <option value="Vice_Principal">Vice Principal</option>
                <option value="Head_of_Department (HOD)">
                  Head of Department (HOD)
                </option>
                <option value="Senior_Instructor">Senior Instructor</option>
                <option value="Instructor">Instructor</option>
                <option value="Junior_Instructor">Junior Instructor</option>
                <option value="Workshop_Instructor">Workshop Instructor</option>
                <option value="Lab_Technician">Lab Technician</option>
              </select>
              {errors.position && (
                <span className="text-red-500">{errors.position}</span>
              )}
            </div>
          </>
        ) : (
          <>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block mb-2 text-sm">
                Department
              </label>
              <select
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              >
                <option value="">Select Department</option>
                <option value="Civil_Technology">Civil Technology</option>
                <option value="Computer_Technology">Computer Technology</option>
                <option value="Electrical_Technology">
                  Electrical Technology
                </option>
                <option value="Electronics_Technology">
                  Electronics Technology
                </option>
                <option value="Mechanical_Technology">
                  Mechanical Technology
                </option>
                <option value="AIDT_Technology">AIDT Technology</option>
                <option value="Construction_Technology">
                  Construction Technology
                </option>
              </select>
              {errors.department && (
                <span className="text-red-500">{errors.department}</span>
              )}
            </div>

            {/* Batch */}
            <div>
              <label htmlFor="batch" className="block mb-2 text-sm">
                Batch
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch || ""}
                onChange={handleChange}
                placeholder="2024"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
              {errors.batch && (
                <span className="text-red-500">{errors.batch}</span>
              )}
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm">
            Password
          </label>
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
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm">
            Confirm Password
          </label>
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
          <label htmlFor="profilePicture" className="block mb-2 text-sm">
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
          />
        </div>

        {uploading && <p>Uploading image...</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          Register
        </button>
        <Link
          href="/login"
          className="px-6 text-sm text-center dark:text-gray-600 cursor-pointer"
        >
          Have an account yet?{" "}
          <span className="hover:underline dark:text-violet-600">Sign in</span>.
        </Link>
      </form>
    </div>
  );
};

export default RegisterForm;
