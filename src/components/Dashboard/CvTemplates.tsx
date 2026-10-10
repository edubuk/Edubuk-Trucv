import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { BadgeCheck, Download, FileSearch, Github, Link2, Linkedin, Mail, MapPin, Phone, Plus, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import truCvLogo from "@/assets/truCV2.png";
import { useCvData } from "@/hooks/useCvData";
import { useUserData } from "@/context/AuthContext";
import { CvSkeleton } from "@/components/SkeletonLoader/CvSkeleton";
import type { ICvData } from "@/CvBuilder/CvBuilder";
import type { TypeAward, TypeEducation, TypeExperience, TypeProject, TypeSkill } from "@/CvBuilder/cvSchema";
import "./cv-templates.css";

export type CleanTemplate = "classic" | "modern";

const printPageStyle = `
  @page { size: A4 portrait; margin: 0; }
  @media print {
    html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .clean-cv-sheet { width: 210mm !important; max-width: none !important; min-height: 297mm !important; margin: 0 !important; box-shadow: none !important; border: 0 !important; }
    .clean-cv-section, .clean-cv-entry { break-inside: avoid; page-break-inside: avoid; }
    .modern-cv-grid { display: grid !important; grid-template-columns: 66mm 1fr !important; min-height: 271mm !important; }
  }
`;

const CvTemplates = ({ template }: { template: CleanTemplate }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const { cvData, isCvLoading, searchFullCvData } = useCvData();
  const { user } = useUserData();
  const publicUrl = user?._id ? `https://edubuktrucv.com/cv/${user._id}` : "https://edubuktrucv.com";

  useEffect(() => {
    searchFullCvData();
  }, [searchFullCvData]);

  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      width: 180,
      margin: 1,
      color: { dark: "#03257e", light: "#ffffff" },
    }).then(setQrDataUrl).catch(() => setQrDataUrl(""));
  }, [publicUrl]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `TruCV-${cvData?.personal.fullName || "Resume"}-${template}`,
    pageStyle: printPageStyle,
    preserveAfterPrint: true,
    onPrintError: () => toast.error("Unable to open the print dialog. Please try again."),
  });

  if (isCvLoading) return <CvSkeleton />;

  if (!cvData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 text-center">
        <div className="grid size-20 place-items-center rounded-2xl bg-[#006666]/10"><FileSearch className="size-9 text-[#006666]" /></div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-800">No CV found</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Build your CV first, then return here to use the clean templates.</p>
        <Link to="/create-cv" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#006666] px-5 py-2.5 text-sm font-semibold text-white"><Plus size={16} />Build your CV</Link>
      </div>
    );
  }

  return (
    <div className="clean-cv-workspace">
      <div className="clean-cv-toolbar">
        <div>
          <strong>{template === "classic" ? "Clean Classic" : "Modern Professional"}</strong>
          <span>Use your device’s print dialog to save this template as a PDF.</span>
        </div>
        <button type="button" onClick={() => handlePrint()}><Download size={17} />Print / Save PDF</button>
      </div>
      <p className="clean-cv-mobile-hint">The preview adapts to your screen. The exported document remains A4.</p>
      <div className="clean-cv-preview">
        <div ref={contentRef} className={`clean-cv-sheet clean-cv-sheet--${template}`}>
          {template === "classic"
            ? <ClassicTemplate cvData={cvData} qrDataUrl={qrDataUrl} publicUrl={publicUrl} />
            : <ModernTemplate cvData={cvData} qrDataUrl={qrDataUrl} publicUrl={publicUrl} />}
        </div>
      </div>
    </div>
  );
};

type TemplateProps = { cvData: ICvData; qrDataUrl: string; publicUrl: string };

const ClassicTemplate = ({ cvData, qrDataUrl, publicUrl }: TemplateProps) => {
  const { personal } = cvData;
  const educations = cvData.educations as TypeEducation[];
  const experiences = cvData.experiences as TypeExperience[];
  const skills = cvData.skills as TypeSkill[];
  const projects = cvData.projects as TypeProject[];
  const awards = cvData.awards as TypeAward[];

  return (
    <article className="classic-cv">
      <BrandHeader qrDataUrl={qrDataUrl} publicUrl={publicUrl} />
      <header className="classic-cv__header">
        <h1>{personal.fullName}</h1>
        {personal.profession && <p>{personal.profession}</p>}
        <ContactLine personal={personal} />
      </header>
      <main>
        {personal.summary && <ResumeSection title="Professional summary"><p className="clean-cv-copy">{personal.summary}</p></ResumeSection>}
        {!!experiences.length && <ResumeSection title="Experience">{experiences.map((item) => <ExperienceEntry key={item.id} item={item} />)}</ResumeSection>}
        {!!educations.length && <ResumeSection title="Education">{educations.map((item) => <EducationEntry key={item.id} item={item} />)}</ResumeSection>}
        {!!projects.length && <ResumeSection title="Projects">{projects.map((item) => <ProjectEntry key={item.id} item={item} />)}</ResumeSection>}
        {!!skills.length && <ResumeSection title="Skills"><div className="classic-cv__skills">{skills.map((item) => <SkillTag key={item.id} item={item} />)}</div></ResumeSection>}
        {!!awards.length && <ResumeSection title="Awards & certifications">{awards.map((item) => <AwardEntry key={item.id} item={item} />)}</ResumeSection>}
      </main>
    </article>
  );
};

const ModernTemplate = ({ cvData, qrDataUrl, publicUrl }: TemplateProps) => {
  const { personal } = cvData;
  const educations = cvData.educations as TypeEducation[];
  const experiences = cvData.experiences as TypeExperience[];
  const skills = cvData.skills as TypeSkill[];
  const projects = cvData.projects as TypeProject[];
  const awards = cvData.awards as TypeAward[];

  return (
    <article className="modern-cv">
      <BrandHeader qrDataUrl={qrDataUrl} publicUrl={publicUrl} />
      <div className="modern-cv-grid">
        <aside className="modern-cv__sidebar">
        {personal.imgUrl ? <img src={personal.imgUrl} alt="" className="modern-cv__photo" /> : <span className="modern-cv__monogram">{initials(personal.fullName)}</span>}
        <h1>{personal.fullName}</h1>
        {personal.profession && <p className="modern-cv__role">{personal.profession}</p>}
        <div className="modern-cv__contact"><ContactStack personal={personal} /></div>
          {!!skills.length && <div className="modern-cv__side-section"><h2>Skills</h2><div className="modern-cv__skills">{skills.map((item) => <SkillTag key={item.id} item={item} />)}</div></div>}
          {!!educations.length && <div className="modern-cv__side-section"><h2>Education</h2>{educations.map((item) => <EducationEntry key={item.id} item={item} compact />)}</div>}
        </aside>
        <main className="modern-cv__main">
          {personal.summary && <ResumeSection title="Profile"><p className="clean-cv-copy">{personal.summary}</p></ResumeSection>}
          {!!experiences.length && <ResumeSection title="Experience">{experiences.map((item) => <ExperienceEntry key={item.id} item={item} />)}</ResumeSection>}
          {!!projects.length && <ResumeSection title="Selected projects">{projects.map((item) => <ProjectEntry key={item.id} item={item} />)}</ResumeSection>}
          {!!awards.length && <ResumeSection title="Awards & certifications">{awards.map((item) => <AwardEntry key={item.id} item={item} />)}</ResumeSection>}
        </main>
      </div>
    </article>
  );
};

type Personal = ICvData["personal"];

const ContactLine = ({ personal }: { personal: Personal }) => (
  <div className="classic-cv__contact">
    {personal.email && <a href={`mailto:${personal.email}`}><Mail size={12} />{personal.email}</a>}
    {personal.phoneNumber && <span><Phone size={12} />{personal.phoneNumber}</span>}
    {personal.city && <span><MapPin size={12} />{personal.city}</span>}
    {personal.linkedInUrl && <a href={personal.linkedInUrl}><Linkedin size={12} />LinkedIn</a>}
    {personal.githubUrl && <a href={personal.githubUrl}><Github size={12} />GitHub</a>}
  </div>
);

const ContactStack = ({ personal }: { personal: Personal }) => (
  <>
    {personal.email && <a href={`mailto:${personal.email}`}><Mail size={13} /><span>{personal.email}</span></a>}
    {personal.phoneNumber && <span><Phone size={13} /><span>{personal.phoneNumber}</span></span>}
    {personal.city && <span><MapPin size={13} /><span>{personal.city}</span></span>}
    {personal.linkedInUrl && <a href={personal.linkedInUrl}><Linkedin size={13} /><span>LinkedIn</span></a>}
    {personal.githubUrl && <a href={personal.githubUrl}><Github size={13} /><span>GitHub</span></a>}
  </>
);

const ResumeSection = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="clean-cv-section"><h2>{title}</h2>{children}</section>;

const BrandHeader = ({ qrDataUrl, publicUrl }: { qrDataUrl: string; publicUrl: string }) => (
  <header className="clean-cv-brand">
    <div className="clean-cv-brand__logos">
      <img src="/latest_edubuk_logo.png" alt="Edubuk" className="clean-cv-brand__edubuk" />
      <i aria-hidden="true" />
      <img src={truCvLogo} alt="TruCV" className="clean-cv-brand__trucv" />
    </div>
    <a href={publicUrl} className="clean-cv-brand__verify" aria-label="Open this verified TruCV">
      <span><ShieldCheck size={14} /><strong>VERIFIABLE TRUCV</strong><small>Scan or tap to verify</small></span>
      {qrDataUrl && <img src={qrDataUrl} alt="QR code for this TruCV" />}
    </a>
  </header>
);

const ExperienceEntry = ({ item }: { item: TypeExperience }) => (
  <div className="clean-cv-entry">
    <div className="clean-cv-entry__head"><div><h3>{item.jobRole}</h3><strong>{item.companyName}</strong></div><time>{dateRange(item.duration)}</time></div>
    <VerificationMeta item={item} />
    {item.description && <p>{item.description}</p>}
    {item.skills && <small className="clean-cv-tech-stack">Tech: {item.skills}</small>}
  </div>
);

const EducationEntry = ({ item, compact = false }: { item: TypeEducation; compact?: boolean }) => (
  <div className={`clean-cv-entry ${compact ? "is-compact" : ""}`}>
    <div className="clean-cv-entry__head"><div><h3>{item.boardNameOrDegree}</h3><strong>{item.institutionName}</strong></div><time>{dateRange(item.duration)}</time></div>
    <VerificationMeta item={item} />
    {!compact && item.gpa && <small>Grade: {item.gpa}</small>}
  </div>
);

const ProjectEntry = ({ item }: { item: TypeProject }) => (
  <div className="clean-cv-entry clean-cv-entry--project">
    <div className="clean-cv-entry__head"><div><h3>{item.projectUrl ? <a href={item.projectUrl}>{item.projectName}</a> : item.projectName}</h3></div><time>{dateRange(item.duration)}</time></div>
    {item.description && <p>{item.description}</p>}
    {item.skills && <small className="clean-cv-tech-stack">Tech: {item.skills}</small>}
  </div>
);

const AwardEntry = ({ item }: { item: TypeAward }) => (
  <div className="clean-cv-entry clean-cv-entry--award">
    <div className="clean-cv-entry__head"><div><h3>{item.name}</h3><strong>{item.organisation}</strong></div><time>{dateRange(item.duration)}</time></div>
    <VerificationMeta item={item} />
    {item.description && <p>{item.description}</p>}
  </div>
);

type VerifiableItem = Pick<TypeEducation, "status" | "docUri" | "selfAttested">;

const VerificationMeta = ({ item }: { item: VerifiableItem }) => {
  const verified = item.status === "verified";
  const selfAttested = !verified && item.selfAttested;
  if (!verified && !selfAttested && !item.docUri) return null;

  return (
    <div className="clean-cv-verification">
      {verified && <span className="is-verified"><BadgeCheck size={12} />Verified</span>}
      {selfAttested && <span><ShieldCheck size={12} />Self-attested</span>}
      {item.docUri && <a href={item.docUri} aria-label="Open supporting document" title="Open supporting document"><Link2 size={12} /></a>}
    </div>
  );
};

const SkillTag = ({ item }: { item: TypeSkill }) => (
  <span>
    {item.skillName}
    {item.endoresBy && <small title={`Endorsed${item.endoresThrough ? ` via ${item.endoresThrough}` : ""}`}><BadgeCheck size={9} />Endorsed</small>}
  </span>
);

const formatMonthYear = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (date.getFullYear() === 1970) return "Present";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
};

const dateRange = (duration: { from: string; to: string }) => [formatMonthYear(duration.from), formatMonthYear(duration.to)].filter(Boolean).join(" – ");
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CV";

export default CvTemplates;
