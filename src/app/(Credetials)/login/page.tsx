"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";


type Inputs = {
  roll: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const [passwordVisible, setPasswordVisible] = useState(false);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { roll, password } = data;
    try {
      const resp = await signIn("credentials", {
        roll,
        password,
        redirect: false,
      });

      if (resp?.status === 200) {
        // Get the 'from' query parameter or default to "/"
        const redirectTo = searchParams.get("from") || "/";
        router.push(redirectTo);
      } else {
        console.log("Login failed: ", resp?.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 dark:bg-gray-50 dark:text-gray-800 mx-auto my-10">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-4xl font-bold">Sign in</h1>
        <p className="text-sm dark:text-gray-600">
          Sign in to access your account
        </p>
      </div>

      <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="roll" className="block mb-2 text-sm">
              Roll/ID Number
            </label>
            <input
              type="text"
              id="roll"
              placeholder="511189"
              {...register("roll", { required: "Roll is required" })}
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
            {errors.roll && (
              <span className="text-red-500 text-sm">
                {errors.roll.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="******"
                {...register("password", { required: "Password is required" })}
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {passwordVisible ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <button
              type="submit"
              className="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
            >
              Sign in
            </button>
          </div>
          <Link
            href="/register"
            className="block text-center text-sm dark:text-gray-600"
          >
            Don’t have an account yet?{" "}
            <span className="hover:underline dark:text-violet-600">
              Sign up
            </span>
            .
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
