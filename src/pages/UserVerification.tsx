import React from "react";

type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
  experience?: number;
  phone?: string;
  address?: string;
};

type DocumentStats = {
  educationVerified: number;
  educationTotal: number;
  experienceVerified: number;
  experienceTotal: number;
  certificateVerified: number;
  certificateTotal: number;
};

const user: UserProfile = {
  name: "Ajeet Kumar",
  email: "ajeet@example.com",
  avatar: "https://i.pravatar.cc/150?img=12",
  linkedIn: "https://linkedin.com/in/ajeet",
  github: "https://github.com/ajeet",
  summary: "Full-stack developer with strong experience in React and Node.js.",
  experience: 3,
  phone: "+91 9876543210",
};

const documents: DocumentStats = {
  educationVerified: 2,
  educationTotal: 3,
  experienceVerified: 1,
  experienceTotal: 2,
  certificateVerified: 4,
  certificateTotal: 5,
};

const VerificationPage: React.FC = () => {
  const totalVerified =
    documents.educationVerified +
    documents.experienceVerified +
    documents.certificateVerified;
  const totalDocuments =
    documents.educationTotal +
    documents.experienceTotal +
    documents.certificateTotal;
  const overallPercentage = totalDocuments
    ? Math.round((totalVerified / totalDocuments) * 100)
    : 0;

  const StatCard = ({
    title,
    verified,
    total,
    icon,
  }: {
    title: string;
    verified: number;
    total: number;
    icon: string;
  }) => {
    const percentage = total ? (verified / total) * 100 : 0;

    return (
      <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold" style={{ color: "#03257e" }}>
              {verified}
              <span className="text-lg text-gray-400">/{total}</span>
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: "#f0f9f9" }}
          >
            {icon}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: "#006666",
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{Math.round(percentage)}% verified</p>
      </div>
    );
  };

  const InfoItem = ({ label, value, link }: { label: string; value: string; link?: boolean }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 min-w-[100px]">{label}:</span>
        {link ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
            style={{ color: "#006666" }}
          >
            {value}
          </a>
        ) : (
          <span className="text-sm font-medium text-gray-800">{value}</span>
        )}
      </div>
    );
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#03257e" }}>
            Verification Summary
          </h1>
          <p className="text-gray-600">Overview of document verification status</p>
        </div>

        {/* Overall Stats Banner */}
        <div
          className="rounded-2xl p-8 text-white shadow-lg"
          style={{
            background: "linear-gradient(135deg, #03257e 0%, #006666 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Overall Verification Progress</p>
              <p className="text-5xl font-bold">
                {totalVerified}
                <span className="text-2xl opacity-80">/{totalDocuments}</span>
              </p>
              <p className="text-white/80 text-sm mt-2">Documents verified</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold">{overallPercentage}%</div>
              <p className="text-white/80 text-sm mt-2">Complete</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 mb-4"
                    style={{ borderColor: "#006666" }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4"
                    style={{ backgroundColor: "#006666" }}
                  >
                    {getInitial(user.name)}
                  </div>
                )}
                <h2 className="text-xl font-bold mb-1" style={{ color: "#03257e" }}>
                  {user.name}
                </h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <InfoItem label="Phone" value={user.phone || ""} />
                <InfoItem label="Experience" value={user.experience ? `${user.experience} years` : ""} />
                <InfoItem label="LinkedIn" value={user.linkedIn || ""} link />
                <InfoItem label="GitHub" value={user.github || ""} link />
              </div>

              {user.summary && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">ABOUT</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{user.summary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Verification Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: "#03257e" }}>
                Document Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Education"
                  verified={documents.educationVerified}
                  total={documents.educationTotal}
                  icon="🎓"
                />
                <StatCard
                  title="Experience"
                  verified={documents.experienceVerified}
                  total={documents.experienceTotal}
                  icon="💼"
                />
                <StatCard
                  title="Certificates"
                  verified={documents.certificateVerified}
                  total={documents.certificateTotal}
                  icon="🏆"
                />
              </div>
            </div>

            {/* Verification Timeline/Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#03257e" }}>
                Verification Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: "#006666" }}
                    >
                      {documents.educationVerified}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Educational Documents</p>
                      <p className="text-sm text-gray-500">
                        {documents.educationTotal - documents.educationVerified} pending
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: "#006666" }}>
                      {Math.round(
                        (documents.educationVerified / documents.educationTotal) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: "#006666" }}
                    >
                      {documents.experienceVerified}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Experience Documents</p>
                      <p className="text-sm text-gray-500">
                        {documents.experienceTotal - documents.experienceVerified} pending
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: "#006666" }}>
                      {Math.round(
                        (documents.experienceVerified / documents.experienceTotal) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: "#006666" }}
                    >
                      {documents.certificateVerified}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Awards & Certificates</p>
                      <p className="text-sm text-gray-500">
                        {documents.certificateTotal - documents.certificateVerified} pending
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: "#006666" }}>
                      {Math.round(
                        (documents.certificateVerified / documents.certificateTotal) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;