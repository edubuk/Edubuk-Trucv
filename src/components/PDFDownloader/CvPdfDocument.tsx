

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
  Svg,
  Circle,
  Path
} from "@react-pdf/renderer";
import type { ICvData } from "@/CvBuilder/CvBuilder";
import type {
  TypeAward,
  TypeEducation,
  TypeExperience,
  TypeProject,
  TypeSkill,
} from "@/CvBuilder/cvSchema";


// ─── Brand Colors ─────────────────────────────────────────────────────────────
const NAVY = "#03257e";
const TEAL = "#006666";
const ORANGE = "#FB980E";
const WHITE = "#ffffff";
const GRAY = "#6B7280";
const DARK = "#1F2937";
const GRAY_600 = "#4B5563";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (d?: string): string => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime()) || date.getFullYear() === 1970) return "Present";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const fmtDuration = (from?: string, to?: string): string => {
  const f = fmt(from);
  const t = to ? fmt(to) : "Present";
  return f ? `${f} - ${t}` : "";
};

const getStatus = (status: string) => {
  switch (status) {
    case "verified":
      return { label: "Verified", color: "#065f46", bg: "#d1fae5" };
    case "selfAttested":
      return { label: "Self Attested", color: "#1e40af", bg: "#dbeafe" };
    case "pending":
      return { label: "Self Attested", color: "#1e40af", bg: "#dbeafe" };
    case "rejected":
      return { label: "Self Attested", color: "#1e40af", bg: "#dbeafe" };
    default:
      return { label: "Self Attested", color: "#1e40af", bg: "#dbeafe" };
  }
};

// ─── Stylesheet ───────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // ── Page ───────────────────────────────────────────────────────────────────
  page: {
    backgroundColor: WHITE,
    fontSize: 9,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    marginLeft:"25%",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  headerTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: NAVY,
    textAlign: "center",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  qrImg: {
    width: 58,
    height: 58,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  brandText: {
    fontSize: 8.5,
    color: TEAL,
  },
  brandBold: {
    fontSize: 9,
    fontWeight: 700,
    color: NAVY,
  },

  // ── Two-column body ────────────────────────────────────────────────────────
  body: {
    flexDirection: "row",
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
  },

  // ── Sidebar (left, teal) ───────────────────────────────────────────────────
  sidebar: {
    width: 162,
    backgroundColor: TEAL,
    paddingHorizontal: 11,
    paddingVertical: 14,
  },
  // Profile image: wrap in View for circular crop (borderRadius + overflow)
  imgCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: "hidden",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#449298",
    borderStyle: "solid",
    marginBottom: 8,
  },
  profileImg: {
    width: 74,
    height: 74,
  },
  profilePlaceholder: {
    width: 74,
    height: 74,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTxt: {
    fontSize: 30,
    color: "rgba(255,255,255,0.45)",
  },
  sideDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 10,
  },
  // Sidebar section header
  sideSectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sideSectionIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  sideSectionIconTxt: {
    fontSize: 10,
    color: WHITE,
    fontWeight: 700,
  },
  sideSectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: WHITE,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  // Education timeline
  eduTimeline: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: ORANGE,
    borderLeftStyle: "solid",
  },
  eduItem: {
    position: "relative",
    paddingLeft: 4,
    marginBottom: 12,
  },
  eduDot: {
    position: "absolute",
    left: -16,
    top: 3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: ORANGE,
  },
  eduLevel: {
    fontSize: 7.5,
    fontWeight: 700,
    color: WHITE,
    marginBottom: 2,
  },
  eduInstitution: {
    fontSize: 7,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 1,
  },
  eduDegree: {
    fontSize: 6.5,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 1,
  },
  eduGpa: {
    fontSize: 7,
    fontWeight: 700,
    color: ORANGE,
    marginBottom: 1,
  },
  eduDuration: {
    fontSize: 6.5,
    color: "rgba(255,255,255,0.6)",
    fontStyle: "italic",
    marginBottom: 3,
  },
  eduDocLink: {
    fontSize: 6.5,
    color: ORANGE,
    marginBottom: 2,
  },

  // ── Right content ──────────────────────────────────────────────────────────
  right: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  // Name + self-attest
  nameText: {
    fontSize: 21,
    color: "#333B4D",
    textAlign: "center",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 9,
  },
  badgeStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 9,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    backgroundColor: "#dbeafe",
    borderRadius: 8,
  },
  badgeTxt: {
    fontSize: 7,
    fontWeight: 700,
    color: "#1e40af",
  },

  // Personal details card
  personalCard: {
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 9,
  },
  personalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  personalItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingRight: 4,
  },
  personalIconBox: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    flexShrink: 0,
  },
  personalIconTxt: {
    fontSize: 8,
    color: WHITE,
    fontWeight: 700,
  },
  personalTxt: {
    fontSize: 7.5,
    color: WHITE,
  },
  personalLinkTxt: {
    fontSize: 7.5,
    color: WHITE,
    textDecoration: "underline",
    flex: 1,
  },
  checkTxt: {
    fontSize: 7,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 2,
  },

  // Summary
  summaryText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.55,
    marginBottom: 3,
  },
  summaryAttest: {
    fontSize: 7,
    fontWeight: 700,
    color: "#1e40af",
    marginBottom: 8,
  },

  // ── Section headers (right panel) ─────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: DARK,
    borderBottomStyle: "solid",
    paddingBottom: 3,
    marginBottom: 6,
    marginTop: 10,
  },
  sectionIconBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  sectionIconTxt: {
    fontSize: 9,
    color: WHITE,
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: DARK,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },

  // ── Skills ─────────────────────────────────────────────────────────────────
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "rgba(0,102,102,0.09)",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(0,102,102,0.28)",
    borderStyle: "solid",
    marginRight: 4,
    marginBottom: 4,
  },
  skillTxt: {
    fontSize: 7.5,
    fontWeight: 700,
    color: TEAL,
  },
  endorsedSep: {
    width: 0.5,
    height: 9,
    backgroundColor: "rgba(0,102,102,0.3)",
    marginHorizontal: 4,
  },
  endorsedTxt: {
    fontSize: 6.5,
    color: TEAL,
  },

  // ── Timeline (experience / projects / awards) ──────────────────────────────
  timeline: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: ORANGE,
    borderLeftStyle: "solid",
  },
  tlItem: {
    position: "relative",
    paddingLeft: 4,
    marginBottom: 11,
  },
  tlDot: {
    position: "absolute",
    left: -17,
    top: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  tlTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  tlTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: DARK,
    flex: 1,
    marginRight: 5,
  },
  tlDuration: {
    fontSize: 7,
    color: TEAL,
    fontStyle: "italic",
    flexShrink: 0,
  },
  tlSubtitle: {
    fontSize: 8,
    color: GRAY_600,
    textTransform: "capitalize",
    marginBottom: 2,
  },
  tlDocLink: {
    fontSize: 7,
    color: ORANGE,
    marginBottom: 2,
  },
  tlDescRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 1.5,
  },
  tlBulletDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: DARK,
    marginTop: 3.5,
    marginRight: 5,
    flexShrink: 0,
  },
  tlDescTxt: {
    fontSize: 7.5,
    color: GRAY_600,
    lineHeight: 1.45,
    flex: 1,
  },
  tlSkillsRow: {
    flexDirection: "row",
    marginTop: 3,
    flexWrap: "wrap",
  },
  tlSkillsLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    color: TEAL,
  },
  tlSkillsVal: {
    fontSize: 7.5,
    color: GRAY_600,
  },

  // ── Status badge ───────────────────────────────────────────────────────────
  statusBadge: {
    flexDirection:"row",
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  statusTxt: {
    fontSize: 6.5,
    fontWeight: 700,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    marginTop: 14,
    paddingTop: 7,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
  },
  footerTxt: {
    fontSize: 7,
    color: GRAY,
    textAlign: "center",
    marginBottom: 3,
  },
  footerLink: {
    fontSize: 7,
    color: NAVY,
    textAlign: "center",
    textDecoration: "underline",
  },
});

// ─── Reusable mini-components ────────────────────────────────────────────────

interface CircleCheckProps {
  hexCode: string;
}

const CircleCheck = ({ hexCode }: CircleCheckProps) => (
  <Svg width="8" height="8" viewBox="0 0 24 24">
    <Circle
      cx="12"
      cy="12"
      r="11"
      stroke={hexCode}
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M7.5 12.5L10.5 15.5L16.5 9.5"
      stroke={hexCode}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StatusBadge = ({
  status,
}: {
  status: string;
}) => {
  const { label, color, bg } = getStatus(status);
  return (
    <View style={[S.statusBadge, { backgroundColor: bg }, { gap: 2 }]}>
      <CircleCheck hexCode={color}/><Text style={[S.statusTxt, { color }]}>{label}</Text>
    </View>
  );
};

const SectionHeader = ({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) => (
  <View style={S.sectionHeader}>
    <View style={S.sectionIconBox}>
      <Text style={S.sectionIconTxt}>{icon}</Text>
    </View>
    <Text style={S.sectionTitle}>{title}</Text>
  </View>
);

interface TimelineItemProps {
  title: string;
  subtitle?: string;
  duration?: string;
  description?: string;
  skills?: string;
  docUri?: string;
  status: string;
  isEmailSend: boolean;
}

const TimelineItem = ({
  title,
  subtitle,
  duration,
  description,
  skills,
  docUri,
  status,
}: TimelineItemProps) => (
  <View style={S.tlItem} wrap={false}>
    {/* Timeline dot on border */}
    <View style={S.tlDot} />

    {/* Row 1: Title + Duration */}
    <View style={S.tlTopRow}>
      <Text style={S.tlTitle}>{title}</Text>
      {duration && <Text style={S.tlDuration}>{duration}</Text>}
    </View>

    {/* Row 2: Subtitle (company / organisation) */}
    {subtitle ? <Text style={S.tlSubtitle}>{subtitle}</Text> : null}

    {/* Row 3: Doc link */}
    {docUri ? (
      <Link src={docUri} style={S.tlDocLink}>
        View Document
      </Link>
    ) : null}

    {/* Row 4: Status badge */}
    <StatusBadge status={status}/>

    {/* Row 5: Description bullet points */}
    {description
      ? description
          .split(".")
          .filter((s) => s.trim().length > 0)
          .map((point, i) => (
            <View key={i} style={S.tlDescRow}>
              <View style={S.tlBulletDot} />
              <Text style={S.tlDescTxt}>{point.trim()}</Text>
            </View>
          ))
      : null}

    {/* Row 6: Skills used */}
    {skills ? (
      <View style={S.tlSkillsRow}>
        <Text style={S.tlSkillsLabel}>Skills: </Text>
        <Text style={S.tlSkillsVal}>{skills}</Text>
      </View>
    ) : null}
  </View>
);




// ─── Main PDF Document ───────────────────────────────────────────────────────

interface CvPdfDocumentProps {
  cvData: ICvData;
  /** Base64 data URL generated with: QRCode.toDataURL(url) */
  qrDataUrl: string;
  userId: string;
}

export const CvPdfDocument: React.FC<CvPdfDocumentProps> = ({
  cvData,
  qrDataUrl,
  userId,
}) => {
  const { personal, educations, experiences, skills, projects, awards } = cvData;
  const cvUrl = `https://edubuktrucv.com/cv/${userId}`;

  return (
    <Document
      title={`TruCV - ${personal.fullName}`}
      author="Edubuk TruCV"
      subject="Blockchain Verified Resume"
      creator="TruCV by Edubuk"
    >
      <Page size="A4" style={S.page}>

        {/* ──────────────────────── HEADER ──────────────────────── */}
        <View style={S.header}>
          <Text style={S.headerTitle}>
            Verified Curriculum Vitae (CV) on the Blockchain
          </Text>
          {qrDataUrl ? (
            <Image src={qrDataUrl} style={S.qrImg} />
          ) : null}
          <View style={S.brandRow}>
            <Text style={S.brandText}>TruCV powered by </Text>
            <Text style={S.brandBold}>Edubuk</Text>
          </View>
        </View>

        {/* ──────────────────── TWO-COLUMN BODY ─────────────────── */}
        <View style={S.body}>

          {/* ────────── LEFT SIDEBAR ────────── */}
          <View style={S.sidebar}>

            {/* Profile Image */}
            <View style={S.imgCircle}>
              {personal.imgUrl ? (
                <Image src={personal.imgUrl} style={S.profileImg} />
              ) : (
                <View style={S.profilePlaceholder}>
                  <Text style={S.placeholderTxt}>?</Text>
                </View>
              )}
            </View>

            <View style={S.sideDivider} />

            {/* Education section */}
            {educations.length > 0 && (
              <View>
                <View style={S.sideSectionRow}>
                  <View style={S.sideSectionIcon}>
                    <Text style={S.sideSectionIconTxt}>E</Text>
                  </View>
                  <Text style={S.sideSectionTitle}>Education</Text>
                </View>

                <View style={S.eduTimeline}>
                  {educations.map((edu: TypeEducation, i: number) => (
                    <View key={i} style={S.eduItem} wrap={false}>
                      <View style={S.eduDot} />
                      <Text style={S.eduLevel}>{edu.level}</Text>
                      <Text style={S.eduInstitution}>{edu.institutionName}</Text>
                      {edu.boardNameOrDegree ? (
                        <Text style={S.eduDegree}>{edu.boardNameOrDegree}</Text>
                      ) : null}
                      {edu.gpa ? (
                        <Text style={S.eduGpa}>
                          {Number(edu.gpa) > 10
                            ? `${edu.gpa}%`
                            : `GPA: ${edu.gpa}`}
                        </Text>
                      ) : null}
                      <Text style={S.eduDuration}>
                        {fmt(edu.duration?.from!)}
                        {edu.duration?.to
                          ? ` - ${fmt(edu.duration.to!)}`
                          : " - Present"}
                      </Text>
                      {edu.docUri ? (
                        <Link src={edu.docUri} style={S.eduDocLink}>
                          View Document
                        </Link>
                      ) : null}
                      <StatusBadge
                        status={edu.status}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* ────────── RIGHT CONTENT ────────── */}
          <View style={S.right}>

            {/* Full Name */}
            <Text style={S.nameText}>{personal.fullName}</Text>

            {/* Self-attest badge */}
            <View style={S.badgeRow}>
              <View style={S.badge}>
                <CircleCheck hexCode="#03257e"/>
                <Text style={S.badgeTxt}> Self Attested Profile</Text>
              </View>
            </View>

            {/* Personal Details Card */}
            <View style={S.personalCard}>
              <View style={S.personalGrid}>
                {personal.email ? (
                  <View style={S.personalItem}>
                    <View style={S.personalIconBox}>
                      <Text style={S.personalIconTxt}>@</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <Text style={S.personalTxt}>{personal.email}</Text>
                    <CircleCheck hexCode="#ffffff"/>
                    </View>
                  </View>
                ) : null}
                {personal.phoneNumber ? (
                  <View style={S.personalItem}>
                    <View style={S.personalIconBox}>
                      <Text style={S.personalIconTxt}>#</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <Text style={S.personalTxt}>{personal.phoneNumber}</Text>
                    <CircleCheck hexCode="#ffffff"/>
                    </View>
                  </View>
                ) : null}
                {personal.city ? (
                  <View style={S.personalItem}>
                    <View style={S.personalIconBox}>
                      <Text style={S.personalIconTxt}>L</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <Text style={S.personalTxt}>{personal.city}</Text>
                    <CircleCheck hexCode="#ffffff"/>
                    </View>
                  </View>
                ) : null}
                {personal.profession ? (
                  <View style={S.personalItem}>
                    <View style={S.personalIconBox}>
                      <Text style={S.personalIconTxt}>P</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <Text style={S.personalTxt}>{personal.profession}</Text>
                    <CircleCheck hexCode="#ffffff"/>
                    </View>
                  </View>
                ) : null}
                {personal.githubUrl ? (
                  <View style={S.personalItem}>
                    <View style={S.personalIconBox}>
                      <Text style={S.personalIconTxt}>G</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <Link src={personal.githubUrl} style={S.personalTxt}>Github</Link>
                    <CircleCheck hexCode="#ffffff"/>
                    </View>
                  </View>
                ) : null}
                {personal.linkedInUrl ? (
                  <View style={S.personalItem}>
                    <View style={S.personalIconBox}>
                      <Text style={S.personalIconTxt}>in</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4}}>
                    <Link src={personal.linkedInUrl} style={S.personalTxt}>LinkedIn</Link>
                    <CircleCheck hexCode="#ffffff"/>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Summary */}
            {personal.summary ? (
               
              <View style={{ marginBottom: 2, }}>
                <Text style={S.summaryText}>{personal.summary}</Text>
                <View style={S.badgeStart}>
                <View style={S.badge}>
                <CircleCheck hexCode="#03257e"/>
                <Text style={S.badgeTxt}> Self Attested Profile</Text>
              </View>
            </View>
              </View>
            ) : null}

            {/* ── Skills ── */}
            {skills.length > 0 && (
              <View>
                <SectionHeader icon="S" title="Skills" />
                <View style={S.skillsWrap}>
                  {skills.map((skill: TypeSkill) => (
                    <View key={skill.skillName} style={S.skillTag}>
                      <Text style={S.skillTxt}>{skill.skillName}</Text>
                      {skill.endoresBy ? (
                        <>
                          <View style={S.endorsedSep} />
                          <Text style={S.endorsedTxt}>
                            ✓{" "}
                            {skill.endoresBy.slice(0, 4)}...
                            {skill.endoresBy.slice(-4)}
                          </Text>
                        </>
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ── Work Experience ── */}
            {experiences.length > 0 && (
              <View>
                <SectionHeader icon="W" title="Work Experience" />
                <View style={S.timeline}>
                  {experiences.map((exp: TypeExperience, i: number) => (
                    <TimelineItem
                      key={i}
                      title={exp.jobRole}
                      subtitle={exp.companyName}
                      duration={fmtDuration(exp.duration.from, exp.duration.to)}
                      description={exp.description}
                      skills={exp.skills}
                      docUri={exp.docUri}
                      status={exp.status}
                      isEmailSend={exp.isEmailSend}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* ── Projects ── */}
            {projects.length > 0 && (
              <View>
                <SectionHeader icon="P" title="Projects" />
                <View style={S.timeline}>
                  {projects.map((project: TypeProject, i: number) => (
                    <TimelineItem
                      key={i}
                      title={project.projectName}
                      duration={fmtDuration(
                        project.duration.from,
                        project.duration.to
                      )}
                      description={project.description}
                      skills={project.skills}
                      docUri={project.projectUrl}
                      status="selfAttested"
                      isEmailSend={false}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* ── Achievements & Certifications ── */}
            {awards.length > 0 && (
              <View>
                <SectionHeader icon="A" title="Achievements & Certifications" />
                <View style={S.timeline}>
                  {awards.map((award: TypeAward, i: number) => (
                    <TimelineItem
                      key={i}
                      title={award.name}
                      subtitle={award.organisation}
                      duration={fmtDuration(
                        award.duration?.from,
                        award.duration?.to
                      )}
                      description={award.description}
                      docUri={award.docUri}
                      status={award.status}
                      isEmailSend={award.isEmailSend}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Footer */}
            <View style={S.footer}>
              <Text style={S.footerTxt}>
                This is the PDF version of a Digital TruCV Profile of the
                Candidate. For verification please visit:
              </Text>
              <Link src={cvUrl} style={S.footerLink}>
                {cvUrl}
              </Link>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
