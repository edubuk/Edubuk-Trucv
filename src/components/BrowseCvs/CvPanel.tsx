import {
  MapPin,
  Briefcase,
  GraduationCap,
  CircleUser,
  Link2,
  Mail,
  Phone,
  Linkedin,
  CheckCircle,
  FolderOpen,
  ExternalLink,

} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiHyperskill } from "react-icons/si";
import { GiAchievement } from "react-icons/gi";
import { BiSolidBriefcase } from "react-icons/bi";
import { ICvData } from "@/CvBuilder/CvBuilder";
import { TypeAward, TypeEducation, TypeExperience, TypeProject, TypeSkill } from "@/CvBuilder/cvSchema";
const NAVY   = "#03257e";
const TEAL   = "#006666";
const ORANGE = "orange";



//  Helpers Methods ─────────────────────────────────────────────────────────────────────────────

const fmtDate = (d?: string): string => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime()) || date.getFullYear() === 1970) return "Present";
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${date.getDate().toString().padStart(2,"0")} ${M[date.getMonth()]} ${date.getFullYear()}`;
};


const fmtRange = (from?: string, to?: string) =>
  `${fmtDate(from)}${to ? ` – ${fmtDate(to)}` : " – Present"}`;

const statusInfo = (status: string) => {
  switch (status) {
    case "verified":     return { label: "✓ Verified",      cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "selfAttested": return { label: "✓ Self Attested", cls: "bg-blue-50 text-[#03257e] border-[#03257e]/20" };
    case "pending":      return { label: "✓ Self Attested", cls: "bg-blue-50 text-[#03257e] border-blue-200" };
    case "rejected":     return { label: "✓ Self Attested", cls: "bg-blue-50 text-[#03257e] border-blue-200" };
    default:             return { label: "✓ Self Attested", cls: "bg-blue-50 text-[#03257e] border-blue-200" };
  }
};

const StatusBadge = ({ status }: { status: string }) => {
    const { label, cls } = statusInfo(status);
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
      {label}
    </span>
  );
};


const CvSectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 border-b pb-1.5 mb-3" style={{ borderColor: "#1F2937" }}>
    <span style={{ color: ORANGE }}>{icon}</span>
    <h3 className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#1F2937" }}>
      {title}
    </h3>
  </div>
);

const TimelineItem = ({
  title, subtitle, duration, description, skills, docUri, status
}: {
  title: string; subtitle?: string; duration?: string; description?: string;
  skills?: string; docUri?: string; status: string;
}) => (
  <div className="relative pl-4 pb-4 border-l-2 last:pb-0" style={{ borderColor:"orange" }}>
    {/* Dot */}
    <div
      className="absolute -left-[7px] top-1 w-3 h-3 rounded-full ring-2 ring-white"
      style={{ backgroundColor:"orange" }}
    />

    {/* Header row */}
    <div className="flex flex-wrap items-start justify-between gap-1 mb-1">
      <h4 className="text-sm font-bold leading-tight" style={{ color: "#1F2937" }}>{title}</h4>
      {duration && (
        <span className="text-[10px] font-medium italic flex-shrink-0" style={{ color: TEAL }}>
          {duration}
        </span>
      )}
    </div>

    {/* Subtitle + doc link */}
    <div className="flex items-center gap-2 mb-1">
      {subtitle && <p className="text-xs text-gray-500 capitalize">{subtitle}</p>}
      {docUri && (
        <a href={docUri} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-[10px] transition-opacity hover:opacity-70"
          style={{ color:"orange" }}>
          <Link2 size={10} /> Doc
        </a>
      )}
    </div>

    <StatusBadge status={status} />

    {/* Bullet points */}
    {description && (
      <ul className="mt-1.5 flex flex-col gap-1">
        {description.split(".").filter(s => s.trim()).map((pt, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500">
            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#374151" }} />
            <span className="leading-relaxed">{pt.trim()}</span>
          </li>
        ))}
      </ul>
    )}

    {skills && (
      <p className="text-[11px] mt-1.5">
        <span className="font-bold" style={{ color: TEAL }}>Skills: </span>
        <span className="text-gray-500">{skills}</span>
      </p>
    )}
  </div>
);


export const CvPanel: React.FC<{ cvData:ICvData; userId: string }> = ({ cvData, userId }) => {
  const { personal, educations, experiences, skills, projects, awards } = cvData;
  const cvUrl = `https://trucv-hackathon.edubuk.com/cv/${userId}`;

  return (
    <div className="h-full overflow-y-auto">
      {/* CV top bar */}
      <div className="sticky top-0 z-10 px-4 py-2.5 flex items-center justif-start gap-2 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <p className="text-[15px] font-semibold tracking-widest uppercase" style={{ color: TEAL }}>
          Verified Curriculum Vitae
        </p>
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[15px] font-semibold px-3 py-1 rounded-full transition-all hover:opacity-80"
          style={{ backgroundColor: `${NAVY}12`, color: NAVY }}
        >
          <ExternalLink size={16} /> Full View And Download
        </a>
      </div>

      {/* Two-column CV layout */}
      <div className="flex min-h-full">
        {/* ─── Left sidebar: Education ─── */}
        <div
          className="w-[190px] flex-shrink-0 px-4 py-5 flex flex-col gap-5"
          style={{ backgroundColor: TEAL, minHeight: "100%" }}
        >
          {/* Profile image */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: "#449298" }}
            >
              {personal.imgUrl
                ? <img src={personal.imgUrl} alt={personal.fullName} className="w-full h-full object-cover" />
                : <CircleUser className="w-full h-full text-white/50" />
              }
            </div>
          </div>

          <div className="w-full h-px" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />

          {/* Education */}
          {educations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: ORANGE }}>
                  <GraduationCap size={12} className="text-white" />
                </div>
                <h3 className="text-[9px] font-bold tracking-widest uppercase text-white">Education</h3>
              </div>

              <div className="pl-3 border-l-2 flex flex-col gap-4" style={{ borderColor: `${ORANGE}` }}>
                {educations.map((edu:TypeEducation, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: ORANGE }} />
                    <div className="flex items-center gap-1">
                      <p className="text-[11px] font-bold text-white leading-tight">{edu.level}</p>
                      {edu.docUri && (
                        <a href={edu.docUri} target="_blank" rel="noopener noreferrer">
                          <Link2 size={10} style={{ color: ORANGE }} />
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                      {edu.institutionName}
                    </p>
                    {edu.boardNameOrDegree && (
                      <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {edu.boardNameOrDegree}
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-[10px] font-bold mt-0.5" style={{ color: ORANGE }}>
                        {Number(edu.gpa) > 10 ? `${edu.gpa}%` : `GPA: ${edu.gpa}`}
                      </p>
                    )}
                    <p className="text-[9px] italic mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {fmtDate(edu.duration?.from)} – {edu.duration?.to ? fmtDate(edu.duration.to) : "Present"}
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={edu?.status as string} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Right content ─── */}
        <div className="flex-1 px-5 py-5 flex flex-col gap-4 overflow-hidden">
          {/* Name + badge */}
          <div className="text-center">
            <h2
              className="text-2xl font-light tracking-wide capitalize"
              style={{ color: "#333B4D" }}
            >
              {personal.fullName}
            </h2>
            <span className="inline-flex mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#03257e] border border-blue-100">
              ✓ Self Attested Profile
            </span>
          </div>

          {/* Personal info card */}
          <div className="rounded-xl p-3 grid grid-cols-2 gap-2" style={{ backgroundColor: TEAL }}>
            {personal.email && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Mail size={11} className="text-white" />
                </div>
                <span className="text-[10px] text-white truncate flex items-center gap-1">
                  {personal.email}
                  <CheckCircle className="w-3 h-3 text-white/60 flex-shrink-0" />
                </span>
              </div>
            )}
            {personal.phoneNumber && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Phone size={11} className="text-white" />
                </div>
                <span className="text-[10px] text-white flex items-center gap-1">
                  {personal.phoneNumber}
                  <CheckCircle className="w-3 h-3 text-white/60 flex-shrink-0" />
                </span>
              </div>
            )}
            {personal.city && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <MapPin size={11} className="text-white" />
                </div>
                <span className="text-[10px] text-white flex items-center gap-1">
                  {personal.city}
                  <CheckCircle className="w-3 h-3 text-white/60 flex-shrink-0" />
                </span>
              </div>
            )}
            {personal.profession && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={11} className="text-white" />
                </div>
                <span className="text-[10px] text-white capitalize flex items-center gap-1">
                  {personal.profession}
                  <CheckCircle className="w-3 h-3 text-white/60 flex-shrink-0" />
                </span>
              </div>
            )}
            {personal.githubUrl && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <FaGithub size={11} className="text-white" />
                </div>
                <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-white underline underline-offset-2 hover:text-orange-200 flex items-center gap-1 transition-colors">
                  GitHub <CheckCircle className="w-3 h-3 text-white/60 flex-shrink-0" />
                </a>
              </div>
            )}
            {personal.linkedInUrl && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Linkedin size={11} className="text-white" />
                </div>
                <a href={personal.linkedInUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-white underline underline-offset-2 hover:text-orange-200 flex items-center gap-1 transition-colors">
                  LinkedIn <CheckCircle className="w-3 h-3 text-white/60 flex-shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* Summary */}
          {personal.summary && (
            <div>
              <p className="text-xs leading-relaxed text-gray-600">{personal.summary}</p>
              <span className="inline-flex mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#03257e] border border-blue-100">✓ Self Attested</span>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <CvSectionHeader icon={<SiHyperskill size={14} />} title="Skills" />
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill:TypeSkill) => (
                  <div
                    key={skill.skillName}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-semibold"
                    style={{ backgroundColor: `${TEAL}10`, borderColor: `${TEAL}30`, color: TEAL }}
                  >
                    {skill.skillName}
                    {skill.endoresBy && (
                      <span className="flex items-center gap-0.5 pl-1 border-l ml-0.5 text-[9px]"
                        style={{ borderColor: `${TEAL}30` }}>
                        <CheckCircle className="w-2.5 h-2.5" />
                        {skill.endoresBy.slice(0, 4)}…{skill.endoresBy.slice(-4)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <CvSectionHeader icon={<BiSolidBriefcase size={15} />} title="Work Experience" />
              <div className="flex flex-col">
                {experiences.map((exp:TypeExperience, i) => (
                  <TimelineItem
                    key={i}
                    title={exp.jobRole}
                    subtitle={exp.companyName}
                    duration={fmtRange(exp.duration.from, exp.duration.to)}
                    description={exp.description}
                    skills={exp.skills}
                    docUri={exp.docUri}
                    status={exp?.status as string}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <CvSectionHeader icon={<FolderOpen size={14} />} title="Projects" />
              <div className="flex flex-col">
                {projects.map((project:TypeProject, i) => (
                  <TimelineItem
                    key={i}
                    title={project.projectName}
                    duration={fmtRange(project.duration.from, project.duration.to)}
                    description={project.description}
                    skills={project.skills}
                    docUri={project.projectUrl}
                    status="selfAttested"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <div>
              <CvSectionHeader icon={<GiAchievement size={15} />} title="Achievements & Certifications" />
              <div className="flex flex-col">
                {awards.map((award:TypeAward, i) => (
                  <TimelineItem
                    key={i}
                    title={award.name}
                    subtitle={award.organisation}
                    duration={award.duration ? fmtRange(award.duration.from, award.duration.to) : undefined}
                    description={award.description}
                    docUri={award.docUri}
                    status={award.status}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-2 pt-3 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400">
              Digital TruCV Profile · Verify at{" "}
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: NAVY }}
              >
                {cvUrl}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};