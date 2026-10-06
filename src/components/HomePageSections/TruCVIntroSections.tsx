import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import truCvLogo from "../../assets/truCV2.png";
import {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  BriefcaseBusiness,
  Check,
  Clock3,
  FileBadge2,
  Fingerprint,
  GraduationCap,
  Link2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const verificationSteps = [
  {
    title: "Credential submitted",
    detail: "Add a qualification or certificate.",
    status: "Your credential enters the verification journey.",
    Icon: FileBadge2,
  },
  {
    title: "Issuer confirmed",
    detail: "Details are checked with the issuer.",
    status: "The registered issuer confirms the submitted record.",
    Icon: BadgeCheck,
  },
  {
    title: "Digital fingerprint",
    detail: "A unique verification reference is created.",
    status: "A tamper-evident fingerprint is generated.",
    Icon: Fingerprint,
  },
  {
    title: "Blockchain record",
    detail: "The verification record is secured.",
    status: "The verified result is recorded onchain.",
    Icon: Blocks,
  },
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const TruCVIntroSections = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const verificationRef = useRef<HTMLDivElement>(null);
  const isVerificationInView = useInView(verificationRef, { amount: 0.22 });

  useEffect(() => {
    if (!isVerificationInView) return;

    const timers: number[] = [];
    const play = () => {
      setActiveStep(0);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActiveStep(4);
        return;
      }
      [1, 2, 3, 4].forEach((step, index) => {
        timers.push(window.setTimeout(() => setActiveStep(step), 350 + index * 1500));
      });
      timers.push(window.setTimeout(play, 7600));
    };

    play();
    return () => timers.forEach(window.clearTimeout);
  }, [animationKey, isVerificationInView]);

  const replayVerification = () => {
    setActiveStep(0);
    setAnimationKey((key) => key + 1);
  };

  return (
    <>

<section className="relative w-full overflow-hidden bg-white font-body text-[#15213d]">
  <div
    className="pointer-events-none absolute inset-0 opacity-45
      [background-image:linear-gradient(rgba(3,37,126,.045)_1px,transparent_1px),
      linear-gradient(90deg,rgba(3,37,126,.045)_1px,transparent_1px)]
      [background-size:48px_48px]
      [mask-image:linear-gradient(to_bottom,#000,transparent_88%)]"
  />

  <div
    className="relative mx-auto grid w-[calc(100%-32px)] max-w-[1240px]
      items-start gap-12 py-14
      sm:w-[calc(100%-56px)] sm:py-16
      lg:min-h-[650px] lg:grid-cols-[1.04fr_1fr]
      lg:items-center lg:gap-9 lg:py-20
      xl:min-h-[700px]"
  >
    {/* Left Content */}
    <motion.div
      initial={{ opacity: 0, x: -38 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-10 text-center lg:text-left"
    >
      <div
        className="mb-6 inline-flex items-center gap-2
          font-heading text-[10px] font-bold uppercase
          tracking-[1.35px] text-[#007b75]
          sm:text-xs sm:tracking-[1.8px]"
      >
        <span className="grid size-[22px] place-items-center rounded-full bg-[#e5f4ef]">
          <Check size={13} strokeWidth={3} />
        </span>

        Your next chapter starts with trust
      </div>

<h1
  className="font-heading text-[44px] font-extrabold
    leading-[1.08] tracking-[-2.8px] text-[#03257e]
    sm:text-[58px] sm:tracking-[-3.5px]
    xl:text-[72px]"
>
  Your achievements.
  <br />
  Your story.
  <br />

  <span className="relative inline-block text-[#007b75]">
    Verified.

    <motion.span
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.55 }}
      className="absolute -bottom-2 left-0 h-1.5 w-full
        origin-left -rotate-2 rounded-full bg-[#f77718]"
    />
  </span>
</h1>

<span
  className="absolute -bottom-3 text-[8px]
    font-medium tracking-[2.5px] text-[#9aa3b3]"
>
  YOUR POTENTIAL. WITH PROOF.
</span>

      <p
        className="mx-auto my-8 max-w-[470px]
          text-base leading-[1.8] text-[#657086]
          sm:text-[17px] lg:mx-0"
      >
        Your education and experience deserve more than a line on a résumé.
        Turn them into credentials people can verify.
      </p>

      <div
        className="flex flex-col items-center gap-5
          sm:flex-row sm:justify-center lg:justify-start"
      >
        <div className="w-full max-w-[270px] text-left sm:w-auto">
          <span
            className="mb-2 flex items-center gap-1.5
              font-heading text-[9px] font-bold uppercase
              tracking-[1.3px] text-[#007b75]"
          >
            <Sparkles size={12} />
            Make your next move.
          </span>

          <Link
            to="/create-cv"
            className="group flex min-h-[62px] items-center gap-3
              rounded-lg bg-[#03257e] px-4 text-white
              shadow-[0_14px_35px_rgba(3,37,126,.18)]
              transition duration-300
              hover:-translate-y-1 hover:bg-[#0759dc]
              hover:shadow-[0_18px_40px_rgba(3,37,126,.25)]"
          >
            <span
              className="grid size-9 shrink-0 place-items-center
                rounded-md bg-white/10"
            >
              <FileBadge2 size={20} />
            </span>

            <span className="flex-1 font-heading text-sm font-bold">
              Create Your TruCV
            </span>

            <ArrowUpRight
              size={18}
              className="transition-transform
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <a
          href="#verification-demo"
          className="inline-flex items-center gap-3
            font-heading text-sm font-bold text-[#15213d]
            transition-colors hover:text-[#03257e]"
        >
          Watch verification

          <span
            className="grid size-9 place-items-center
              rounded-full border border-slate-300 text-[#03257e]"
          >
            <Play size={13} fill="currentColor" />
          </span>
        </a>
      </div>

      <div
        className="mt-7 flex items-center justify-center gap-3
          text-xs text-[#657086] lg:justify-start"
      >
        <span>Blockchain-backed</span>
        <i className="size-1 rounded-full bg-[#f77718]" />
        <span>DigiLocker integrated</span>
      </div>
    </motion.div>

    {/* Right Visual */}
    <motion.div
      initial={{ opacity: 0, scale: 0.92, x: 34 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex min-h-[500px] items-center justify-center
        [perspective:1200px]
        sm:min-h-[560px]
        lg:min-h-[520px]"
      aria-label="Illustrative preview of a verified CV"
    >
      {/* Decorative Rings */}
      <div
        className="absolute size-[min(500px,100%)]
          -rotate-[25deg] rounded-full border border-[#d9e7f2]"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 52,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute size-[min(420px,88%)]
          rounded-full border border-dashed border-[#cbdce9]"
      >
        <span
          className="absolute right-20 top-3 size-5
            rounded-full border-[6px]
            border-[#e5f5f3] bg-[#007b75]"
        />
      </motion.div>

      {/* CV Card */}
      <motion.article
        animate={{
          y: [0, -12, 0],
          rotate: [-4, -2.8, -4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-[2] w-[315px] max-w-[78vw]
          overflow-hidden rounded-2xl border border-[#e0e6f0]
          bg-white
          shadow-[0_30px_70px_rgba(7,53,117,.14),8px_8px_0_rgba(231,238,248,.55)]
          sm:w-[355px]"
      >
        <motion.span
          animate={{ top: ["0%", "100%"] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut",
          }}
          className="absolute inset-x-0 z-10 h-0.5
            bg-gradient-to-r from-transparent
            via-[#00bba5] to-transparent
            shadow-[0_-10px_25px_rgba(3,191,170,.25)]"
        />

        <div className="p-5 sm:p-6">
          {/* CV Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/latest_edubuk_logo.png"
                alt="Edubuk"
                className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              />

              <span className="h-8 w-px bg-slate-200" />

              <img
                src={truCvLogo}
                alt="TruCV"
                className="h-8 w-[76px] object-contain sm:w-[84px]"
              />
            </div>

            <span
              className="text-right text-[7px] font-bold
                tracking-[1px] text-slate-400"
            >
              VERIFIED
              <br />
              PROFILE
            </span>
          </div>

          {/* Profile */}
          <div className="mt-6 flex items-center gap-3">
            <div
              className="grid size-12 place-items-center
                rounded-full bg-[#e9eefb]
                font-heading text-sm font-bold text-[#03257e]"
            >
              AS
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-[#15213d]">
                Aarav Sharma
              </h3>

              <p className="text-[10px] text-[#657086]">
                Product Engineer · Bengaluru
              </p>

              <span
                className="mt-1 inline-flex items-center gap-1
                  rounded bg-[#e9f7f1] px-2 py-1
                  text-[9px] font-bold text-[#007b75]"
              >
                <BadgeCheck size={12} />
                Identity verified
              </span>
            </div>
          </div>

          <div className="my-5 h-px bg-[#e1e6ed]" />

          {/* Credentials */}
          <div className="space-y-1">
            {[
              {
                Icon: GraduationCap,
                title: "B.Tech · Computer Science",
                meta: "Issuer verified · 2022",
                tone: "bg-[#edf2fe] text-[#03257e]",
              },
              {
                Icon: BriefcaseBusiness,
                title: "Product Engineer",
                meta: "Experience verified · 2024",
                tone: "bg-[#e4f6f1] text-[#007b75]",
              },
              {
                Icon: ShieldCheck,
                title: "Blockchain Fundamentals",
                meta: "Skill credential · Onchain",
                tone: "bg-[#fff1df] text-[#c75608]",
              },
            ].map(({ Icon, title, meta, tone }) => (
              <div
                key={title}
                className="flex items-center gap-3
                  border-b border-slate-100 py-3"
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center
                    rounded-lg ${tone}`}
                >
                  <Icon size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <strong
                    className="block truncate text-xs text-[#15213d]"
                  >
                    {title}
                  </strong>

                  <small className="text-[9px] text-[#657086]">
                    {meta}
                  </small>
                </span>

                <span
                  className="grid size-[18px] place-items-center
                    rounded-full bg-[#e9f8f2] text-[#007b75]"
                >
                  <Check size={11} strokeWidth={3} />
                </span>
              </div>
            ))}
          </div>

          {/* Credential Footer */}
          <div
            className="mt-4 flex items-center justify-between
              text-[8px] font-semibold text-[#657086]"
          >
            <span>Credential ID · 0x71...9AF2</span>

            <Blocks size={17} className="text-[#03257e]" />
          </div>
        </div>
      </motion.article>

      {/* Trust Badge */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-10 z-[3]
          hidden items-center gap-3 rounded-xl
          border border-[#e1e6ed] bg-white px-4 py-3
          text-xs font-bold
          shadow-[0_14px_35px_rgba(25,35,66,.1)]
          sm:flex"
      >
        <span
          className="grid size-9 place-items-center
            rounded-full bg-[#e7f8f1] text-[#007b75]"
        >
          <ShieldCheck size={18} />
        </span>

        <span>
          Built on trust
          <small className="mt-0.5 block font-normal text-[#657086]">
            Secured on blockchain
          </small>
        </span>
      </motion.div>

      {/* Opportunity Badge */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-0 z-[3]
          hidden items-center gap-3 rounded-xl
          border border-[#e1e6ed] bg-white px-4 py-3
          text-xs font-bold
          shadow-[0_14px_35px_rgba(25,35,66,.1)]
          sm:flex"
      >
        <span
          className="grid size-9 place-items-center
            rounded-full bg-[#fff0e4] text-[#f77718]"
        >
          <ArrowUpRight size={18} />
        </span>

        <span>
          Ready for your next opportunity
          <small className="mt-0.5 block font-normal text-[#657086]">
            Share your story with confidence
          </small>
        </span>
      </motion.div>

      <span
        className="absolute -bottom-1 text-[9px]
          font-bold tracking-[2px] text-[#657086]"
      >
        YOUR POTENTIAL. WITH PROOF.
      </span>
    </motion.div>
  </div>
</section>

      <div className="w-full border-y border-[#e1e6ed] bg-[#f6f8fb] font-body">
        <div className="mx-auto grid min-h-[104px] w-[calc(100%-32px)] max-w-[1240px] grid-cols-2 items-center gap-x-6 gap-y-4 py-6 text-xs text-[#4c5971] sm:w-[calc(100%-56px)] md:grid-cols-[1.3fr_auto_1fr_auto_1fr_auto_1fr] md:text-sm">
          <span className="col-span-2 md:col-span-1">Built for a world<br /><strong className="font-heading font-bold text-[#15213d]">that values authenticity.</strong></span>
          <Sparkles className="hidden text-[#007b75] md:block" size={20} />
          <span>Academic credentials</span><Sparkles className="hidden text-[#007b75] md:block" size={20} />
          <span>Professional experience</span><Sparkles className="hidden text-[#007b75] md:block" size={20} />
          <span>Verified achievements</span>
        </div>
      </div>

      <section id="verification-demo" className="w-full bg-white py-20 font-body text-[#15213d] sm:py-28">
        <motion.div ref={verificationRef} {...reveal} transition={{ duration: 0.65 }} className="mx-auto w-[calc(100%-28px)] max-w-[1240px] overflow-hidden rounded-3xl border-2 border-[#c5dceb] bg-gradient-to-br from-[#eff8ff] to-[#eaf8f3] shadow-[0_26px_75px_rgba(3,37,126,.1)] sm:w-[calc(100%-56px)]">
          <div className="flex flex-col gap-6 border-b border-[#dfe6ef] bg-white px-5 py-7 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
            <div><p className="mb-3 font-heading text-[10px] font-bold tracking-[1.8px] text-[#007b75]">THE VERIFICATION JOURNEY</p><h2 className="font-heading text-3xl font-extrabold tracking-[-1.5px] text-[#15213d] sm:text-4xl">Watch a credential become verifiable.</h2><p className="mt-3 max-w-[610px] text-sm leading-relaxed text-[#657086] sm:text-base">Follow the proof from your TruCV to issuer confirmation and a blockchain record.</p></div>
            <button type="button" onClick={replayVerification} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#d9e1eb] bg-white px-4 font-heading text-xs font-bold text-[#03257e] transition hover:border-[#03257e] hover:bg-[#f3f6fc]"><RotateCcw size={15} />Replay animation</button>
          </div>

          <div key={animationKey} className="relative grid grid-cols-1 gap-5 px-5 py-9 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:px-10 lg:py-12">
            <div className="absolute left-[88px] right-[calc(25%-40px)] top-[90px] hidden h-[3px] bg-[#dbe6ee] lg:block" aria-hidden="true">
              <motion.span className="block h-full origin-left bg-gradient-to-r from-[#f77718] to-[#007b75]" animate={{ scaleX: [0, 0.17, 0.5, 0.83, 1][activeStep] }} transition={{ duration: 0.72, ease: "easeOut" }} />
              <motion.span
                className="pointer-events-none absolute top-1/2 z-[4] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[10px] text-white shadow-[0_5px_18px_rgba(247,119,24,.4)]"
                animate={{ left: ["0%", "0%", "33.333%", "66.667%", "100%"][activeStep], opacity: activeStep === 0 ? 0 : 1, backgroundColor: activeStep === 4 ? "#007b75" : "#f77718" }}
                transition={{ duration: activeStep === 0 ? 0.2 : 1, ease: [0.2, 0.7, 0.2, 1] }}
              ><FileBadge2 size={18} /></motion.span>
            </div>
            {verificationSteps.map(({ title, detail, Icon }, index) => {
              const isActive = activeStep === index + 1;
              const isComplete = index < activeStep - 1 || (activeStep === 4 && index === 3);
              return (
                <motion.article key={title} animate={{ y: isActive ? -6 : 0, borderColor: isActive ? "rgba(0,123,117,.5)" : "rgba(225,230,237,1)", boxShadow: isActive ? "0 20px 45px rgba(3,37,126,.12)" : "0 8px 24px rgba(3,37,126,.04)" }} transition={{ duration: 0.4 }} className="relative z-[2] flex min-h-[230px] flex-col rounded-2xl border bg-white p-5 sm:p-6">
                  <div className="mb-8 flex items-center justify-between"><motion.span animate={{ scale: isActive ? [1, 1.12, 1] : 1 }} transition={{ duration: 1, repeat: isActive ? Infinity : 0 }} className={`grid size-12 place-items-center rounded-xl ${isActive || isComplete ? "bg-[#03257e] text-white" : "bg-[#edf2fe] text-[#03257e]"}`}><Icon size={22} /></motion.span><span className="font-heading text-[10px] font-bold tracking-[1.2px] text-slate-400">0{index + 1}</span></div>
                  <h3 className="font-heading text-lg font-bold text-[#15213d]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#657086]">{detail}</p>
                  <div className={`mt-auto flex items-center gap-2 pt-5 text-[10px] font-bold uppercase tracking-[1px] ${isActive || isComplete ? "text-[#007b75]" : "text-slate-400"}`}>{isComplete ? <Check size={14} /> : isActive ? <span className="size-2 animate-pulse rounded-full bg-[#f77718]" /> : <Clock3 size={14} />}{isComplete ? "Complete" : isActive ? "Processing" : "Waiting"}</div>
                </motion.article>
              );
            })}
          </div>

          <div className="mx-5 mb-5 flex items-start gap-4 rounded-2xl bg-[#03257e] px-5 py-4 text-white sm:mx-8 sm:mb-8 sm:items-center lg:mx-10 lg:mb-10">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-[#82e0d4]"><BadgeCheck size={20} /></span>
            <div><strong className="font-heading text-sm">{activeStep === 0 ? "Ready to follow the journey" : verificationSteps[activeStep - 1].title}</strong><p className="mt-1 text-xs leading-relaxed text-blue-100">{activeStep === 0 ? "The illustration starts when this section comes into view." : verificationSteps[activeStep - 1].status}</p></div>
          </div>
          <p className="px-6 pb-7 text-center text-[10px] leading-relaxed text-slate-400">Illustrative animation. It does not submit a credential or perform a live blockchain transaction.</p>
        </motion.div>
      </section>

      <section id="why-trucv" className="w-full bg-white py-20 font-body text-[#15213d] sm:py-28">
        <div className="mx-auto w-[calc(100%-28px)] max-w-[1240px] sm:w-[calc(100%-56px)]">
          <motion.div {...reveal} transition={{ duration: 0.65 }} className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div><p className="mb-4 font-heading text-[10px] font-bold tracking-[1.8px] text-[#007b75]">01 / THE TRUST ADVANTAGE</p><h2 className="font-heading text-4xl font-extrabold leading-[1.14] tracking-[-2px] text-[#15213d] sm:text-5xl">A great CV tells a story.<br /><span className="text-[#007b75]">TruCV backs it up.</span></h2></div>
            <p className="max-w-[380px] text-sm leading-[1.8] text-[#657086] sm:text-base">From your first qualification to your next career milestone, keep the proof behind your progress in one place.</p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:grid-rows-2">
            <motion.article {...reveal} transition={{ duration: 0.6 }} className="rounded-2xl bg-[#03257e] p-7 text-white shadow-[0_20px_55px_rgba(3,37,126,.18)] md:row-span-2 sm:p-8">
              <span className="font-heading text-xs text-blue-200">01</span>
              <div className="my-7 grid gap-2">
                {["Credential received", "Issuer verification", "Blockchain record"].map((item, index) => <motion.div key={item} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + index * 0.13 }} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[.05] px-4 py-3 text-xs text-blue-50"><span>{item}</span><Check size={15} className="text-[#69e2c6]" /></motion.div>)}
              </div>
              <h3 className="font-heading text-3xl font-extrabold leading-tight">More proof.<br />Less uncertainty.</h3><p className="mt-4 text-sm leading-[1.8] text-blue-100">Verified records help employers assess your qualifications with greater confidence.</p>
              <a href="https://www.edubuktrucv.com/verify" className="mt-7 inline-flex items-center gap-2 font-heading text-sm font-bold">Explore verification <ArrowUpRight size={16} /></a>
            </motion.article>

            <motion.article {...reveal} transition={{ duration: 0.6, delay: 0.08 }} className="group rounded-2xl border border-[#e8edf4] bg-[#f5f8fc] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(3,37,126,.08)]">
              <span className="mb-8 grid size-12 place-items-center rounded-xl bg-white text-[#0759dc] shadow-sm"><ArrowUpRight size={24} /></span><h3 className="font-heading text-2xl font-bold tracking-[-.7px]">Made to move with you</h3><p className="mt-3 text-sm leading-[1.75] text-[#657086]">Share one digital CV across roles, institutions, and borders.</p><span className="mt-7 block text-[9px] font-bold tracking-[1.4px] text-[#007b75]">SHAREABLE BY DESIGN</span>
            </motion.article>

            <motion.article {...reveal} transition={{ duration: 0.6, delay: 0.14 }} className="group rounded-2xl border border-[#ffeddb] bg-[#fff5eb] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(247,119,24,.09)]">
              <span className="mb-8 grid size-12 place-items-center rounded-xl bg-white text-[#f77718] shadow-sm"><FileBadge2 size={24} /></span><h3 className="font-heading text-2xl font-bold tracking-[-.7px]">Your credentials,<br />connected.</h3><p className="mt-3 text-sm leading-[1.75] text-[#657086]">Bring education, experience, skills, and certificates into one professional profile.</p><span className="mt-7 block text-[9px] font-bold tracking-[1.4px] text-[#a74e14]">ONE PLACE FOR YOUR PROGRESS</span>
            </motion.article>

            <motion.article {...reveal} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col items-start gap-5 rounded-2xl border border-[#dceee8] bg-[#eef8f5] p-7 sm:flex-row sm:items-center lg:col-span-2">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-[#007b75] shadow-sm"><Clock3 size={24} /></span><div><h3 className="font-heading text-xl font-bold">A clearer path to hiring</h3><p className="mt-1 text-sm leading-[1.75] text-[#657086]">Give recruiters access to verifiable information and reduce repeated document checks.</p></div><Link2 className="ml-auto hidden text-[#007b75] sm:block" size={22} />
            </motion.article>
          </div>
        </div>
      </section>
    </>
  );
};

export default TruCVIntroSections;
