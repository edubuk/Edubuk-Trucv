import React, { useState } from "react";
import { Link, useParams } from "react-router-dom"
import loginImg from "../assets/login.avif"
import { API_BASE_URL } from "@/main";
import toast from "react-hot-toast";
import { ArrowLeftSquare, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import api from "@/lib/api";
import Footer from "./Footer";
// interface UserLoginData {
//     name: string;
//     email: string;
//     picture: string;
//     exp: number;
// }

type FormState = {
    fullName: string;
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    agree: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>> & { form?: string };

export default function RegistrationPage(): JSX.Element {
    const [form, setForm] = useState<FormState>({
        fullName: "",
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        agree: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const {partnerName} = useParams();
    const partnerDisplayName = partnerName
    ? partnerName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email || form.email.indexOf("@") === -1 || form.email.indexOf(".") === -1) e.email = "Valid email is required";
        if (!form.otp.trim()) e.otp = "Otp is required";
        if (!form.address.trim()) e.address = "Address is required";
        if (form.password.length < 8) e.password = "Password must be at least 8 characters";
        if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
        // simple phone validation: only digits and plus allowed, length between 7 and 15
        const allowedPhoneChars = "0123456789+";
        const phoneOk = form.phone.length >= 7 && form.phone.length <= 15 && [...form.phone].every(c => allowedPhoneChars.indexOf(c) !== -1);
        if (!phoneOk) e.phone = "Enter a valid phone number";
        if (!form.agree) e.agree = "You must agree to the terms";
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
        const searchParams = new URLSearchParams(window.location.search);
       const ref = searchParams.get("ref")
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/user/register?ref=${ref}`, {
                method: "POST",
                body: JSON.stringify({ email: form.email, otp: form.otp, name: form.fullName, password: form.password, phoneNumber: form.phone, address: form.address }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            if (data && data.success) {
                toast.success(data.message)
                window.location.href = "/login"
            }else{
                toast.error(data.message);
            }
            console.log(data)
        } catch (err:any) {
            toast.error(err.message||err||"something went wrong")
        } finally {
            setLoading(false);
        }
    };

    const otpHandler = async () => {
        try {
            setOtpSent(true);
            if (!form.email) {
                toast.error("please enter you email id first");
            }
            const res = await api.post(`/user/generateOtp`, {
                email: form.email
            })
            const {data} = res
            console.log("otp res",data);
            if (data.status === "Succeeded") {
                toast.success(`${data.message} to entered email id`)
            }

            //setForm((prev)=>({...prev, otp:data.otp}))
        } catch (error:any) {
            if(error?.response.data.error.code === 11000){
                toast.error("otp already has been sent, Please wait for 5 minutes to resend it")
            }else{
                toast.error("Something went wrong. Try again.")
            }
        }
        finally {
            setOtpSent(false)
        }
    }

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
        <>
        <div className="h-auto flex items-center justify-center bg-white">
        <div className="max-w-8xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:px-2">
        {/* Left - illustration / marketing (desktop only) */}
        <div className="hidden md:flex flex-col gap-6 p-8 rounded-2xl">
            <div className="flex items-center gap-2">
                <Link to="/" className="mb-6 text-black flex items-center gap-2 hover:text-[#03257e]"> <ArrowLeftSquare />Back To Home</Link>
            </div>
            <img
                 src={"/latest_edubuk_logo.png"}
                 alt="Logo"
                className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 mx-auto"
            />
            <h3 className="-mt-7 text-2xl text-center font-semibold text-[#03257e]">Welcome to <span className="bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666] text-transparent bg-clip-text">Edubuk</span></h3>

            {partnerName && partnerName === "VEDA_IT" ? (
                <div
                    className="w-full flex justify-center mb-8 md:mb-0"
                    data-aos="fade-down"
                >
                    <div className="w-full max-w-sm">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white">
                            {/* Top accent bar echoing the brand gradient */}
                            <div className="h-2 bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666]" />

                            <div className="px-6 pt-8 pb-8 flex flex-col items-center text-center">
                                <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
                                    In Partnership With
                                </span>

                                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-[#03257e]/10 shadow-md mb-4 bg-white">
                                    <img
                                        src={`/partners/${partnerName}.jpeg`}
                                        alt={`${partnerDisplayName} logo`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = "/partners/default.jpeg";
                                        }}
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-[#03257e]">
                                    {partnerDisplayName}
                                </h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                                    You're creating your TruCV account through an exclusive
                                    partnership. Complete the form to get started.
                                </p>

                                <div className="w-10 h-[3px] rounded-full mt-5 bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666]" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="w-full flex justify-center mb-8 md:mb-0"
                    data-aos="fade-down"
                >
                    <div>
                        <img src={loginImg} className="w-full h-full" alt="login-img" loading="lazy" data-aos="zoom-in" />
                    </div>
                </div>
            )}
        </div>

        {/* Right - form card */}
        <div className="p-8 bg-white rounded-2xl w-full" data-aos="fade-left">
            <div className="flex items-center justify-between gap-2 mb-6 flex-col">
                <div className="flex justify-start items-center md:hidden gap-2 p-2 rounded-2xl mb-6">
                    <Link to="/" className="text-black flex items-center gap-2 hover:text-[#03257e]"> <ArrowLeftSquare /></Link>
                    <h3 className="text-2xl text-center font-semibold text-[#03257e]">Welcome to <span className="bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666] text-transparent bg-clip-text">Edubuk</span></h3>
                </div>

                {/* Partner card - mobile only, mirrors the desktop version above */}
                {partnerName && partnerName === "VEDA_IT" && (
                    <div className="w-full md:hidden mb-2" data-aos="fade-down">
                        <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white">
                            <div className="h-1.5 bg-gradient-to-r from-[#03257e] via-[#f14419] to-[#006666]" />
                            <div className="px-4 pt-5 pb-5 flex items-center gap-4">
                                <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden ring-2 ring-[#03257e]/10 shadow-sm bg-white">
                                    <img
                                        src={`/partners/${partnerName}.jpeg`}
                                        alt={`${partnerDisplayName} logo`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = "/partners/default.jpeg";
                                        }}
                                    />
                                </div>
                                <div className="text-left">
                                    <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                                        In Partnership With
                                    </span>
                                    <h3 className="text-base font-bold text-[#03257e] leading-tight">
                                        {partnerDisplayName}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-[#03257e]">
                        Create your Edubuk account
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Get started by verifying your email and completing your profile.
                    </p>

                    
                </div>
                <div className="text-slate-400">Already have an account? <Link to="/login" className="font-lg text-[#03257e] font-bold hover:underline">Log in</Link></div>
            </div>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400">
                        Or sign up using your email
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Full name*</span>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className={`mt-2 block w-full rounded-lg border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-200 focus:ring-red-300' : 'border-slate-200 focus:ring-[#03257e]'}`}
                                placeholder="Enter your full name"
                                aria-invalid={errors.fullName ? 'true' : 'false'}
                            />
                            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Address*</span>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className={`mt-2 block w-full rounded-lg border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.address ? 'border-red-200 focus:ring-red-300' : 'border-slate-200 focus:ring-[#03257e]'}`}
                                placeholder="Enter your current address"
                                aria-invalid={errors.address ? 'true' : 'false'}
                            />
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                        </label>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Email*</span>
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
                            <div className="flex justify-between items-center gap-2">
                                <div>
                                    <span className="text-sm font-medium text-slate-700">Email Verification (OTP)*</span>
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        name="otp"
                                        value={form.otp}
                                        onChange={handleChange}
                                        className="mt-2 w-full xl:block rounded-lg border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2"
                                    ></input>
                                </div>
                                <button
                                type="button"
                                    disabled={otpSent}
                                    className="mt-8 w-[170px] lg:w-[110px] flex items-center justify-center rounded-lg border px-2 py-3 placeholder-slate-400 text-white focus:outline-none focus:ring-2 bg-[#006666]"
                                    onClick={otpHandler}
                                    style={{ opacity: otpSent ? 0.7 : 1 }}
                                >{otpSent ? <Loader2 className="text-white animate-spin" /> : "Send OTP"}</button>
                            </div>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Password*</span>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`mt-2 block w-full rounded-lg border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-200 focus:ring-red-300' : 'border-slate-200 focus:ring-[#03257e]'}`}
                                placeholder="Minimum 8 characters"
                                aria-invalid={errors.password ? 'true' : 'false'}
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Confirm password*</span>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={`mt-2 block w-full rounded-lg border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-200 focus:ring-red-300' : 'border-slate-200 focus:ring-[#03257e]'}`}
                                placeholder="Re-enter password"
                                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                        </label>
                    </div>

                    <label className="block w-full">
                        <span className="text-sm font-medium text-slate-700">Phone*</span>

                        <PhoneInput
                            country="in"
                            value={form.phone}
                            onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                            placeholder="Phone Number"
                            containerClass={`mt-2 w-full rounded-lg border px-0 focus-within:ring-2 ${errors.phone
                                    ? 'border-red-200 focus-within:ring-red-300'
                                    : 'border-slate-200 focus-within:ring-[#03257e]'
                                }`}
                            inputClass="!w-full !bg-transparent !text-[#006666] !placeholder-slate-400 !pl-10 !py-6 !focus:outline-none !border-0 !shadow-none"
                            buttonClass="!border-0 !shadow-none"
                            dropdownClass="!text-black"
                            inputProps={{
                                name: 'phone',
                                required: true,
                                'aria-invalid': errors.phone ? 'true' : 'false',
                            }}
                        />

                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                    </label>


                    <label className="flex items-start gap-3 mt-1">
                        <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} className="mt-1" />
                        <div className="text-sm text-slate-600">
                            I agree to the <Link to="/terms-and-conditions" className="text-[#03257e] font-medium">Terms & Conditions</Link> and <Link to="/privacy-policy" className="text-[#03257e] font-medium">Privacy Policy</Link>.
                        </div>
                    </label>
                    {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

                    {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

                    <button
                        type="submit"
                        disabled={loading || !form.otp || !form.agree}
                        className="mt-2 w-full py-3 rounded-lg font-semibold text-white shadow hover:shadow-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: loading ? '#8aa0d6' : '#03257e' }}
                    >
                        {loading ? 'Creating account...' : 'Create my account'}
                    </button>

                    <div className="mt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
                        <span>By continuing you accept our</span>
                        <Link className="text-[#03257e] font-medium" to="/terms-and-conditions">Terms</Link>
                    </div>
                </div>
            </form>
        </div>
        </div>
        </div>

        <Footer/>
        </>
    );
}
