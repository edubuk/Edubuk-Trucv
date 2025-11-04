import React, { useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom"
import loginImg from "../assets/login.avif"
import { API_BASE_URL } from "@/main";
import toast from "react-hot-toast";
import { ArrowLeftSquare } from "lucide-react";
// interface UserLoginData {
//     name: string;
//     email: string;
//     picture: string;
//     exp: number;
// }

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

    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (!form.email || form.email.indexOf("@") === -1 || form.email.indexOf(".") === -1) e.email = "Valid email is required";
        if (form.password.length < 8) e.password = "Password must be at least 8 characters";
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value } as FormState));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const eObj = validate();
        setErrors(eObj);
        if (Object.keys(eObj).length > 0) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/user/login`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ email: form.email, password: form.password }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await res.json()
            if (data && data.success) {
                toast.success(data.message)
                window.location.href = "/"
            } else {
                toast.error(data.message)
            }

        } catch (err) {
            toast.error("Something went wrong. Try again.")
        } finally {
            setLoading(false);
        }
    };


    // const handleGoogleLogin = (credentialResponse: any) => {
    //     setLoading(true);
    //     const userData: UserLoginData = jwtDecode(credentialResponse.credential);
    //     localStorage.setItem('userName', userData.name.split("")[0]);
    //     localStorage.setItem('userMailId', userData.email);
    //     localStorage.setItem('userImage', userData.picture);
    //     localStorage.setItem('googleIdToken', credentialResponse.credential);
    //     localStorage.setItem('tokenExpiry', userData.exp.toString());
    //     window.location.href = '/';
    // };

    return (
        <div className="h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="max-w-8xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left - illustration / marketing */}
                <div className="hidden md:flex flex-col gap-6 p-8 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="mb-6 text-black flex items-center gap-2 hover:text-[#03257e]"> <ArrowLeftSquare />Back To Home</Link>
                    </div>
                    <h3 className="text-2xl text-center font-semibold text-[#03257e]">Welcome to <span className="bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666] text-transparent bg-clip-text">Edubuk</span></h3>
                    <div
                        className="w-full flex justify-center mb-8 md:mb-0"
                        data-aos="fade-down"
                    >
                        <div>
                            <img src={loginImg} className="w-full h-full" alt="login-img" data-aos="zoom-in"/>
                        </div>
                    </div>
                </div>

                {/* Right - form card */}
                <div className="p-8 bg-white rounded-2xl w-full" data-aos="fade-left">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-[#03257e]">Create an account</h2>
                            {/* <p className="text-sm text-slate-500 mt-1">Sign up quickly or continue with Google</p> */}
                        </div>
                        <div className="text-sm text-slate-400">New User? <Link to="/register" className="font-medium text-[#03257e] font-semibold hover:underline">Register Here</Link></div>
                    </div>

                    {/* Social / Google button - replace with <GoogleLogin /> if using the package */}
                    {/* <div className="mb-4">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
                            style={{ borderColor: "rgba(3,37,126,0.08)" }}
                            onClick={() => alert('Hook this up to your Google auth (e.g. @react-oauth/google)')}
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={
                                    ((error: any) => {
                                        console.log("Login Failed", error);
                                    }) as () => void
                                }
                                useOneTap
                                promptMomentNotification={(notification) =>
                                    console.log("Prompt moment notification:", notification)
                                }
                            />
                        </button>
                    </div> */}

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-slate-400">sign in with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`mt-2 block w-full rounded-lg border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-200 focus:ring-red-300' : 'border-slate-200 focus:ring-[#03257e]'}`}
                                    placeholder="you@example.com"
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Password</span>
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`mt-2 block w-full rounded-lg border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-200 focus:ring-red-300' : 'border-slate-200 focus:ring-[#03257e]'}`}
                                    placeholder="At least 8 characters"
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </label>
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full py-3 rounded-lg font-semibold text-white shadow hover:shadow-md focus:outline-none"
                                style={{ backgroundColor: loading ? '#8aa0d6' : '#03257e' }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <p className="text-center ">Forget Password? <Link to="/password-reset" className="underline text-[#f14419]">Reset Here </Link></p>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
