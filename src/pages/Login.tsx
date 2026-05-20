import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import loginImg from "../assets/login.avif";
import toast from "react-hot-toast";
import { ArrowLeftSquare, EyeIcon, EyeOffIcon } from "lucide-react";
import api from "@/lib/api";

type FormState = {
    email: string;
    password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & { form?: string };

export default function LoginPage(): JSX.Element {
    const [form, setForm] = useState<FormState>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [searchParams] = useSearchParams();
    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (!form.email || !form.email.includes("@") || !form.email.includes(".")) {
            e.email = "Please enter a valid email address";
        }
        if (form.password.length < 8) {
            e.password = "Password must be at least 8 characters";
        }
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const eObj = validate();
        setErrors(eObj);
        const redirect = searchParams.get("redirect") || "/";
        if (Object.keys(eObj).length > 0) return;

        setLoading(true);
        try {
            const res = await api.post(`/user/login`, {
                email: form.email,
                password: form.password,
            });
            const data = await res.data;

            if (data?.success) {
                toast.success(data.message);
                window.location.href = redirect;
            } else {
                toast.error(data.message);
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen flex items-center justify-center bg-white px-2 md:px-4 py-3">
            <div className="max-w-8xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left Section */}
                <div className="hidden md:flex flex-col gap-6 p-8 rounded-2xl">
                    <Link
                        to="/"
                        className="mb-6 text-black flex items-center gap-2 hover:text-[#03257e]"
                    >
                        <ArrowLeftSquare />
                        Back to Home
                    </Link>

                    <h3 className="text-2xl text-center font-semibold text-[#03257e]">
                        Welcome to{" "}
                        <span className="bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666] text-transparent bg-clip-text">
                            Edubuk
                        </span>
                    </h3>

                    <div className="w-full flex justify-center">
                        <img
                            src={loginImg}
                            className="w-full h-full"
                            alt="Login illustration"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="p-4 bg-white rounded-2xl w-full">
                    <div className="flex flex-col mb-4">
                        <div className="flex items-center md:hidden gap-2 mb-6">
                            <Link
                                to="/"
                                className="text-black hover:text-[#03257e]"
                                title="Back to Home"
                            >
                                <ArrowLeftSquare />
                            </Link>
                            <h3 className="text-2xl font-semibold text-[#03257e]">
                                Welcome to{" "}
                                <span className="bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666] text-transparent bg-clip-text">
                                    Edubuk
                                </span>
                            </h3>
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-2xl font-bold text-[#03257e]">
                                Sign in to your account
                            </h2>
                            <p className="text-slate-400">
                                New here?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-[#03257e] hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-slate-400">
                                Sign in using your email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    Email Address*
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`mt-2 block w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                                        errors.email
                                            ? "border-red-200 focus:ring-red-300"
                                            : "border-slate-200 focus:ring-[#03257e]"
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </label>

                            <label className="relative block">
                                <span className="text-sm font-medium text-slate-700">
                                    Password*
                                </span>
                                <input
                                    name="password"
                                    type={seePassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    className={`mt-2 block w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                                        errors.password
                                            ? "border-red-200 focus:ring-red-300"
                                            : "border-slate-200 focus:ring-[#03257e]"
                                    }`}
                                />
                                <div
                                    onClick={() => setSeePassword(!seePassword)}
                                    className="absolute right-3 top-1/2 cursor-pointer"
                                >
                                    {seePassword ? <EyeIcon color={"#03257e"}/> : <EyeOffIcon color={"#03257e"} />}
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full py-3 rounded-lg font-semibold text-white shadow hover:shadow-md focus:outline-none"
                                style={{
                                    backgroundColor: loading ? "#8aa0d6" : "#03257e",
                                }}
                            >
                                {loading ? "Signing you in..." : "Sign In"}
                            </button>

                            <p className="text-center text-sm">
                                Forgot your password?{" "}
                                <Link
                                    to="/password-reset"
                                    className="underline text-[#f14419]"
                                >
                                    Reset it here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
