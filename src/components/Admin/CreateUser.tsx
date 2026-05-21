import React, { useState } from "react";
import { UserPlus, Mail, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";

// Types
interface CreateUserForm {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  password: string;
}

interface SendEmailForm {
  emailId: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const CreateUser: React.FC = () => {
  // Create User State
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    password: "",
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [createUserResponse, setCreateUserResponse] = useState<ApiResponse | null>(null);

  // Send Email State
  const [sendEmailForm, setSendEmailForm] = useState<SendEmailForm>({
    emailId: "",
    password: "",
  });
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [sendEmailLoading, setSendEmailLoading] = useState(false);
  const [sendEmailResponse, setSendEmailResponse] = useState<ApiResponse | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"create" | "send">("create");

  // Handle Create User Form Change
  const handleCreateUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateUserForm((prev) => ({ ...prev, [name]: value }));
    setCreateUserResponse(null);
  };

  // Handle Send Email Form Change
  const handleSendEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSendEmailForm((prev) => ({ ...prev, [name]: value }));
    setSendEmailResponse(null);
  };

  // Validate Email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate Phone Number
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  // Create User Submit
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!createUserForm.name.trim()) {
      setCreateUserResponse({ success: false, message: "Name is required" });
      return;
    }
    if (!isValidEmail(createUserForm.email)) {
      setCreateUserResponse({ success: false, message: "Please enter a valid email address" });
      return;
    }
    if (!isValidPhone(createUserForm.phoneNumber)) {
      setCreateUserResponse({ success: false, message: "Please enter a valid 10-digit phone number" });
      return;
    }
    if (createUserForm.password.length < 6) {
      setCreateUserResponse({ success: false, message: "Password must be at least 6 characters long" });
      return;
    }

    setCreateUserLoading(true);
    setCreateUserResponse(null);

    try {
      // Replace with your actual API call
      const response = await api.post("/admin/create-user",{
        data: createUserForm
      });

      if (response.data.success) {
        setCreateUserResponse({ success: true, message: "User created successfully!" });
        // Reset form
        setCreateUserForm({
          name: "",
          email: "",
          address: "",
          phoneNumber: "",
          password: "",
        });
      } else {
        setCreateUserResponse({ success: false, message: response.data.message || "Failed to create user" });
      }
    } catch (error: any) {
      setCreateUserResponse({ success: false, message: error.message||error });
    } finally {
      setCreateUserLoading(false);
    }
  };

  // Send Email Submit
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isValidEmail(sendEmailForm.emailId)) {
      setSendEmailResponse({ success: false, message: "Please enter a valid email address" });
      return;
    }
    if (!sendEmailForm.password.trim()) {
      setSendEmailResponse({ success: false, message: "Password is required" });
      return;
    }

    setSendEmailLoading(true);
    setSendEmailResponse(null);

    try {
      // Replace with your actual API call
      const response = await api.post("/admin/docUploadEmail",{
        data: sendEmailForm
      });

      if (response.data.success) {
        setSendEmailResponse({ success: true, message: "Email sent successfully!" });
        // Reset form
        setSendEmailForm({ emailId: "", password: "" });
      } else {
        setSendEmailResponse({ success: false, message: response.data.message || "Failed to send email" });
      }
    } catch (error: any) {
      setSendEmailResponse({ success: false, message:error.message });
    } finally {
      setSendEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#03257e] mb-3">User Management</h1>
          <p className="text-gray-600 text-lg">Create users and send credential emails</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
              activeTab === "create"
                ? "border-b-4 border-[#03257e] text-[#03257e]"
                : "text-gray-500 hover:text-[#03257e]"
            }`}
          >
            <UserPlus className="inline-block h-5 w-5 mr-2" />
            Create New User
          </button>
          <button
            onClick={() => setActiveTab("send")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
              activeTab === "send"
                ? "border-b-4 border-[#03257e] text-[#03257e]"
                : "text-gray-500 hover:text-[#03257e]"
            }`}
          >
            <Mail className="inline-block h-5 w-5 mr-2" />
            Send Email
          </button>
        </div>

        {/* Create User Form */}
        {activeTab === "create" && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#03257e] to-[#024a8f] rounded-xl flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#03257e]">Create New User</h2>
                <p className="text-sm text-gray-600">Fill in the details to create a new user account</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#03257e] mb-2">
                  Full Name <span className="text-[#f14419]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={createUserForm.name}
                  onChange={handleCreateUserChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#03257e] focus:ring-2 focus:ring-[#03257e]/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#03257e] mb-2">
                  Email Address <span className="text-[#f14419]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={createUserForm.email}
                  onChange={handleCreateUserChange}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#03257e] focus:ring-2 focus:ring-[#03257e]/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-[#03257e] mb-2">
                  Phone Number <span className="text-[#f14419]">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={createUserForm.phoneNumber}
                  onChange={handleCreateUserChange}
                  placeholder="1234567890"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#03257e] focus:ring-2 focus:ring-[#03257e]/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-[#03257e] mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={createUserForm.address}
                  onChange={handleCreateUserChange}
                  placeholder="Enter complete address"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#03257e] focus:ring-2 focus:ring-[#03257e]/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#03257e] mb-2">
                  Password <span className="text-[#f14419]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={createUserForm.password}
                    onChange={handleCreateUserChange}
                    placeholder="Enter secure password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#03257e] focus:ring-2 focus:ring-[#03257e]/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#03257e] transition-colors"
                  >
                    {showCreatePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              {/* Response Message */}
              {createUserResponse && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    createUserResponse.success
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-red-50 border-2 border-red-200"
                  }`}
                >
                  {createUserResponse.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      createUserResponse.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {createUserResponse.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createUserLoading}
                className="w-full bg-gradient-to-r from-[#006666] to-[#008888] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {createUserLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create User
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Send Email Form */}
        {activeTab === "send" && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#006666] to-[#008888] rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#03257e]">Send Login Credentials</h2>
                <p className="text-sm text-gray-600">Send welcome email with login credentials to user</p>
              </div>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-6">
              {/* Email ID */}
              <div>
                <label htmlFor="emailId" className="block text-sm font-semibold text-[#03257e] mb-2">
                  User Email Address <span className="text-[#f14419]">*</span>
                </label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={sendEmailForm.emailId}
                  onChange={handleSendEmailChange}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#006666] focus:ring-2 focus:ring-[#006666]/20 outline-none transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">The email address where credentials will be sent</p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="emailPassword" className="block text-sm font-semibold text-[#03257e] mb-2">
                  User Password <span className="text-[#f14419]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showEmailPassword ? "text" : "password"}
                    id="emailPassword"
                    name="password"
                    value={sendEmailForm.password}
                    onChange={handleSendEmailChange}
                    placeholder="Enter user's password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#006666] focus:ring-2 focus:ring-[#006666]/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#006666] transition-colors"
                  >
                    {showEmailPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">This password will be included in the email</p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-[#03257e]">
                  <span className="font-semibold">Note:</span> The welcome email will include login credentials and
                  a direct link to the user's document upload page.
                </p>
              </div>

              {/* Response Message */}
              {sendEmailResponse && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    sendEmailResponse.success
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-red-50 border-2 border-red-200"
                  }`}
                >
                  {sendEmailResponse.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      sendEmailResponse.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {sendEmailResponse.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sendEmailLoading}
                className="w-full bg-gradient-to-r from-[#006666] to-[#008888] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {sendEmailLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Send Email
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            TruCV User Management System • Powered by Edubuk
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;