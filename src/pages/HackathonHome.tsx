import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Check,
  FileCheck2,
  Fingerprint,
  Globe2,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import HackathonNavbar from "./HackathonNavbar";
import "./hackathon-home.css";

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

const features = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Tamper-proof credentials",
    copy: "Academic and professional records anchored on blockchain—permanent, trusted, and owned by you.",
    tone: "navy",
  },
  {
    icon: Zap,
    number: "02",
    title: "Verify in seconds",
    copy: "One shareable profile lets recruiters validate every claim instantly, without email chains or paperwork.",
    tone: "teal",
  },
  {
    icon: Fingerprint,
    number: "03",
    title: "Privacy by design",
    copy: "You decide what to share and with whom. Your identity remains portable, secure, and under your control.",
    tone: "orange",
  },
];

const steps = [
  { icon: UserCheck, title: "Build your profile", copy: "Add education, experience, skills, and proof in one guided flow." },
  { icon: FileCheck2, title: "Verify your claims", copy: "Connect DigiLocker or invite institutions to attest credentials." },
  { icon: Blocks, title: "Mint your TruCV", copy: "Create a permanent blockchain record with a unique verification link." },
  { icon: Globe2, title: "Share with confidence", copy: "Send one trusted profile anywhere. Verification happens instantly." },
];

const HackathonHome = () => {
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <main className="hack-page">
      <motion.div className="hack-progress" style={{ scaleX: progressScale }} />
      <HackathonNavbar />

      <section className="hack-hero">
        <div className="hack-hero__grid" aria-hidden="true" />
        <div className="hack-orb hack-orb--one" aria-hidden="true" />
        <div className="hack-orb hack-orb--two" aria-hidden="true" />

        <div className="hack-container hack-hero__content">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="hack-hero__copy"
          >
            <div className="hack-eyebrow">
              <span><Sparkles size={13} /></span>
              The trust layer for professional identity
            </div>
            <h1>Your career.<br />Verified <em>onchain.</em></h1>
            <p className="hack-hero__lead">
              Build a living, blockchain-verified CV that turns every credential into proof—and every application into trust.
            </p>
            <div className="hack-hero__buttons">
              <Link to="/create-cv" className="hack-btn hack-btn--primary">
                Create your TruCV <ArrowRight size={18} />
              </Link>
              <a href="https://edubuktrucv.com/browse-cvs" className="hack-btn hack-btn--ghost">
                Explore verified talent <ScanSearch size={18} />
              </a>
            </div>
            <div className="hack-proof-row">
              <div className="hack-avatars" aria-hidden="true">
                <span>AK</span><span>MS</span><span>RJ</span><span>+</span>
              </div>
              <div><strong>Trusted by ambitious talent</strong><small>One profile. Every opportunity.</small></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hack-hero__visual"
          >
            <div className="hack-chain-label hack-chain-label--top">
              <span className="hack-live-dot" /> Live on Polygon
            </div>
            <div className="hack-profile-card">
              <div className="hack-profile-card__top">
                <div className="hack-profile-card__avatar">AV</div>
                <div>
                  <small>VERIFIED PROFESSIONAL</small>
                  <h3>Aarav Verma</h3>
                  <p>Blockchain Engineer · Bengaluru</p>
                </div>
                <BadgeCheck className="hack-profile-card__badge" />
              </div>
              <div className="hack-profile-card__meta">
                <span><strong>08</strong> credentials</span>
                <span><strong>05</strong> skills</span>
                <span><strong>04</strong> years</span>
              </div>
              <div className="hack-profile-card__section">
                <div className="hack-profile-card__section-title"><span>Experience</span><small>2 VERIFIED</small></div>
                <div className="hack-timeline-row">
                  <span className="hack-company-icon">E</span>
                  <div><strong>Senior Blockchain Engineer</strong><small>Edubuk · 2023 — Present</small></div>
                  <Check size={14} />
                </div>
                <div className="hack-timeline-row">
                  <span className="hack-company-icon hack-company-icon--navy">N</span>
                  <div><strong>Web3 Developer</strong><small>Nexa Labs · 2021 — 2023</small></div>
                  <Check size={14} />
                </div>
              </div>
              <div className="hack-profile-card__section">
                <div className="hack-profile-card__section-title"><span>Credentials</span><small>ONCHAIN</small></div>
                <div className="hack-credential-row">
                  <LockKeyhole size={16} />
                  <span><strong>B.Tech · Computer Science</strong><small>Credential ID · 0x71...9AF2</small></span>
                  <BadgeCheck size={18} />
                </div>
              </div>
              <div className="hack-profile-card__footer">
                <Fingerprint size={18} />
                <span>Identity secured on blockchain</span>
                <span className="hack-verified-pill">VERIFIED</span>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
              className="hack-float-card hack-float-card--left"
            >
              <span><BadgeCheck size={18} /></span><div><small>Credential</small><strong>Verified ✓</strong></div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="hack-float-card hack-float-card--right"
            >
              <span><Blocks size={18} /></span><div><small>Block</small><strong>#18,492,031</strong></div>
            </motion.div>
          </motion.div>
        </div>

        <div className="hack-trust-strip">
          <div className="hack-container">
            <span>POWERED BY TRUSTED INFRASTRUCTURE</span>
            <div className="hack-trust-items">
              <strong>POLYGON</strong><i />
              <strong>DIGILOCKER</strong><i />
              <strong>IPFS</strong><i />
              <strong>ETHEREUM</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="why-trucv" className="hack-section hack-why">
        <div className="hack-container">
          <motion.div {...reveal} className="hack-section__intro">
            <span className="hack-kicker">WHY TRUCV</span>
            <h2>A CV people don’t just read.<br /><em>They can trust.</em></h2>
            <p>Traditional resumes are static claims. TruCV turns your professional story into cryptographic proof.</p>
          </motion.div>
          <div className="hack-feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className={`hack-feature-card hack-feature-card--${feature.tone}`}
                >
                  <div className="hack-feature-card__head"><span>{feature.number}</span><Icon /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                  <div className="hack-feature-card__line" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="hack-section hack-process">
        <div className="hack-container">
          <motion.div {...reveal} className="hack-section__intro hack-section__intro--left">
            <span className="hack-kicker">HOW IT WORKS</span>
            <h2>From claim to proof<br />in <em>four simple steps.</em></h2>
          </motion.div>
          <div className="hack-steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  className="hack-step"
                >
                  <span className="hack-step__number">0{index + 1}</span>
                  <div className="hack-step__icon"><Icon /></div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                  {index < steps.length - 1 && <span className="hack-step__connector" aria-hidden="true" />}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="use-cases" className="hack-section hack-ecosystem">
        <div className="hack-container hack-ecosystem__grid">
          <motion.div {...reveal} className="hack-ecosystem__copy">
            <span className="hack-kicker">BUILT FOR THE WHOLE ECOSYSTEM</span>
            <h2>Trust travels<br /><em>with the talent.</em></h2>
            <p>TruCV creates one shared truth for candidates, institutions, and employers—without locking anyone into another silo.</p>
            <ul>
              <li><Check /> <span><strong>For talent</strong> — own a portable professional identity.</span></li>
              <li><Check /> <span><strong>For employers</strong> — hire with verified information.</span></li>
              <li><Check /> <span><strong>For institutions</strong> — issue credentials at scale.</span></li>
            </ul>
          </motion.div>
          <motion.div {...reveal} className="hack-network" aria-label="TruCV trust network illustration">
            <div className="hack-network__ring hack-network__ring--outer" />
            <div className="hack-network__ring hack-network__ring--inner" />
            <div className="hack-network__node hack-network__node--top">University<small>ISSUER</small></div>
            <div className="hack-network__node hack-network__node--right">Employer<small>VERIFIER</small></div>
            <div className="hack-network__node hack-network__node--bottom">DigiLocker<small>SOURCE</small></div>
            <div className="hack-network__node hack-network__node--left">Candidate<small>OWNER</small></div>
            <div className="hack-network__core"><Fingerprint /><strong>TruCV</strong><small>TRUST LAYER</small></div>
          </motion.div>
        </div>
      </section>

      <section className="hack-cta">
        <div className="hack-cta__mesh" aria-hidden="true" />
        <motion.div {...reveal} className="hack-container hack-cta__inner">
          <span className="hack-kicker hack-kicker--light">YOUR PROOF STARTS HERE</span>
          <h2>Stop telling them.<br /><em>Start showing them.</em></h2>
          <p>Create a verifiable professional identity that opens doors before you even walk through them.</p>
          <Link to="/create-cv" className="hack-btn hack-btn--light">Build my TruCV <ArrowRight size={18} /></Link>
        </motion.div>
      </section>

      <footer className="hack-footer">
        <div className="hack-container hack-footer__inner">
          <div className="hack-brand hack-brand--footer">
            <span className="hack-brand__mark" aria-hidden="true"><span /><span /><span /></span>
            <span className="hack-brand__wordmark">Tru<span>CV</span></span>
          </div>
          <p>Verifiable credentials. Borderless opportunity.</p>
          <div><Link to="/privacy-policy">Privacy</Link><Link to="/terms-and-conditions">Terms</Link><Link to="/contact-us">Contact</Link></div>
          <small>© {new Date().getFullYear()} Edubuk TruCV</small>
        </div>
      </footer>
    </main>
  );
};

export default HackathonHome;
