"use client";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
	name: string;
	email: string;
	phone: number;
	id: string;
  position: string;
  password: string;
	confirmPassword: string;
};
const page = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	  } = useForm<Inputs>();
	  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
    return (
        <div className="flex flex-col p-6 rounded-md sm:p-10 dark:bg-gray-50 dark:text-gray-800 mx-auto my-10 ">
	<div className="mb-8 text-center">
		<h1 className="my-3 text-4xl font-bold">WellCome</h1>
		<p className="text-sm dark:text-gray-600">Register for access your account</p>
	</div>
	<form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="md:flex gap-6">
            <div className="md:w-1/3">
				<label htmlFor="Name" className="block mb-2 text-sm">
				Name
				</label>
				<input
				type="text"
				placeholder="Full Name"
				{...register("name", { required: "name is required" })}
				className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
				/>
				{errors.name && <span>{errors.name.message}</span>}
			</div>
            <div className="md:w-1/3">
				<label htmlFor="email" className="block mb-2 text-sm">
				Email
				</label>
				<input
				type="email"
				placeholder="mdalamin212104@gmail.com"
				{...register("email", { required: "email is required" })}
				className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
				/>
				{errors.email && <span>{errors.email.message}</span>}
			</div>
            <div className="md:w-1/3">
				<label htmlFor="phone number" className="block mb-2 text-sm">
				Phone Number
				</label>
				<input
				type="tel"
				placeholder="mdalamin212104@gmail.com"
				{...register("phone", { required: "phone is required" })}
				className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
				/>
				{errors.phone && <span>{errors.phone.message}</span>}
			</div>
          </div>
		  <div className="md:flex gap-6">
		  <div className="md:w-1/2">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm">
                ID Number
              </label>
             
            </div>
            <input
              type="text"
              id="IdNumber"
              placeholder="11170"
              {...register("id", { required: "id is required" })}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            {errors.id && <span>{errors.id.message}</span>}
          </div>
		  <div className="md:w-1/2">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm">
                Position
              </label>
              
            </div>
            {/* <input
              type="password"
              id="password"
              placeholder="******"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            {errors.password && <span>{errors.password.message}</span>} */}
            <div className="dropdown dropdown-hover">
  <div tabIndex={0} role="button" className="btn m-1">Hover</div>
  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
          </div>

		  </div>
		  <div className="md:flex gap-6">
		  <div className="md:w-1/2">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
             
            </div>
            <input
              type="password"
              id="password"
              placeholder="******"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
		  <div className="md:w-1/2">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm">
                Conform Password
              </label>
              
            </div>
            <input
              type="password"
              id="password"
              placeholder="******"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

		  </div>

		  <input type="file" className="file-input file-input-bordered file-input-md w-full max-w-xs" />
          
        </div>
        <div className="space-y-2">
          <div className="text-right">
            <input
              className="mr-0 px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50 cursor-pointer"
              type="submit"
              value="Register"
            />
          </div>
          <Link
		  	href='/login'
            className="px-6 text-sm text-center dark:text-gray-600"
          >have an account yet?
            <span className="hover:underline dark:text-violet-600">Sign in</span>
            .
          </Link>
        </div>
      </form>
</div>
    );
};

export default page;