"use client";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  roll: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 dark:bg-gray-50 dark:text-gray-800 mx-auto my-10 ">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-4xl font-bold">Sign in</h1>
        <p className="text-sm dark:text-gray-600">
          Sign in to access your account
        </p>
      </div>

      <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              Roll/ID Number
            </label>
            <input
              type="text"
              placeholder="511189"
              {...register("roll", { required: "Roll is required" })}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            {errors.roll && <span>{errors.roll.message}</span>}
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <a
                rel="noopener noreferrer"
                href="#"
                className="text-xs hover:underline dark:text-gray-600"
              >
                Forgot password?
              </a>
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
        <div className="space-y-2">
          <div>
            <input
              className="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
              type="submit"
              value="Sign in"
            />
          </div>
          <p
            onClick={() => {
              const modal = document.getElementById(
                "my_modal_5"
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
            className="px-6 text-sm text-center dark:text-gray-600 cursor-pointer"
          >
            Don`t have an account yet?
            <span className="hover:underline dark:text-violet-600">Sign up</span>
            .
          </p>
        </div>
      </form>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <h1>
            <Link href="/teacher">Register As a teacher</Link>
          </h1>
          <h1>
            <Link href="/student">Register As a student</Link>
          </h1>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default LoginPage;
