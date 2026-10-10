import { useEffect, useRef, useState } from "react";
import { useUserData } from "@/context/AuthContext";

type Cleanup = () => void;

const setupRefinedAnimations = (root: ShadowRoot): Cleanup => {
  const cleanups: Cleanup[] = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const reasonsGrid = root.querySelector<HTMLElement>(".reasons-grid");
  if (reasonsGrid && !reasonsGrid.querySelector(".reasons-route")) {
    const reasonCards = Array.from(
      reasonsGrid.querySelectorAll<HTMLElement>(".reason-card"),
    );
    reasonCards.forEach((card, index) => {
      card.style.setProperty("--step-delay", `${Math.round(index * (3400 / 6))}ms`);
      const icon = card.querySelector<HTMLElement>(".reason-icon");
      const label = card.querySelector<HTMLElement>(".reason-num");
      if (icon) {
        icon.classList.add("step-number");
        icon.textContent = String(index + 1);
      }
      if (label) label.textContent = `REASON ${index + 1}`;
      card.insertAdjacentHTML(
        "afterbegin",
        '<span class="reason-card-shine" aria-hidden="true"></span>',
      );
    });

    reasonsGrid.insertAdjacentHTML(
      "afterbegin",
      `<svg class="reasons-route" preserveAspectRatio="none" aria-hidden="true">
        <path class="reasons-route-shadow" pathLength="1" />
        <path class="reasons-route-base" pathLength="1" />
        <path class="reasons-route-energy" />
      </svg>`,
    );

    const route = reasonsGrid.querySelector<SVGSVGElement>(".reasons-route");
    const routePaths = Array.from(
      reasonsGrid.querySelectorAll<SVGPathElement>(".reasons-route path"),
    );
    const drawRoute = () => {
      if (!route || reasonCards.length < 2) return;
      const gridRect = reasonsGrid.getBoundingClientRect();
      const points = reasonCards.map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          x: rect.left - gridRect.left + rect.width / 2,
          y: rect.top - gridRect.top + rect.height / 2,
        };
      });
      let path = `M ${points[0].x} ${points[0].y}`;
      points.slice(1).forEach((point, index) => {
        const previous = points[index];
        const middleX = (previous.x + point.x) / 2;
        path += ` C ${middleX} ${previous.y},${middleX} ${point.y},${point.x} ${point.y}`;
      });
      route.setAttribute("viewBox", `0 0 ${gridRect.width} ${gridRect.height}`);
      routePaths.forEach((routePath) => routePath.setAttribute("d", path));
    };
    const resizeObserver = new ResizeObserver(drawRoute);
    resizeObserver.observe(reasonsGrid);
    reasonCards.forEach((card) => resizeObserver.observe(card));
    requestAnimationFrame(drawRoute);
    cleanups.push(() => resizeObserver.disconnect());

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      reasonsGrid.classList.add("is-route-visible");
    } else {
      const routeObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        reasonsGrid.classList.add("is-route-visible");
        routeObserver.disconnect();
      }, { threshold: 0.12 });
      routeObserver.observe(reasonsGrid);
      cleanups.push(() => routeObserver.disconnect());
    }
  }

  const revealItems = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    root.querySelector(".trucv-refined-root")?.classList.add("js-motion");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }), { threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
    cleanups.push(() => observer.disconnect());
  }

  const demo = root.querySelector<HTMLElement>("#verification-demo");
  const replay = root.querySelector<HTMLButtonElement>("#verify-replay");
  if (demo && replay) {
    const cards = Array.from(demo.querySelectorAll<HTMLElement>("[data-verify-card]"));
    const title = root.querySelector<HTMLElement>("#verify-status-title");
    const detail = root.querySelector<HTMLElement>("#verify-status-detail");
    const captions = [
      ["Ready to follow the journey", "The illustration starts when this section comes into view."],
      ["Credential submitted", "Your document is added to your TruCV for review."],
      ["Issuer confirmed", "The qualification details are checked with the issuing organisation."],
      ["Digital fingerprint created", "A unique reference represents the verified credential."],
      ["Verification record secured", "The record can support future checks when your TruCV is shared."],
    ];
    let timers: number[] = [];
    let visible = false;
    const show = (step: number) => {
      demo.dataset.step = String(step);
      cards.forEach((card, index) => {
        card.classList.toggle("is-active", index + 1 === step);
        card.classList.toggle("is-done", index + 1 < step || step === 4);
      });
      if (title) title.textContent = captions[step][0];
      if (detail) detail.textContent = captions[step][1];
    };
    const stop = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };
    const play = () => {
      stop();
      show(0);
      if (reducedMotion.matches) return show(4);
      [1, 2, 3, 4].forEach((step, index) => {
        timers.push(window.setTimeout(() => show(step), 350 + index * 1500));
      });
      timers.push(window.setTimeout(() => visible && play(), 7600));
    };
    replay.addEventListener("click", play);
    cleanups.push(() => replay.removeEventListener("click", play), stop);
    if (reducedMotion.matches) {
      show(4);
    } else {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (!visible) {
            visible = true;
            play();
          }
        } else {
          visible = false;
          stop();
        }
      }, { threshold: 0.22 });
      observer.observe(demo);
      cleanups.push(() => observer.disconnect());
    }
  }

  const cvWrap = root.querySelector<HTMLElement>(".hero-visual .cv-wrap");
  if (cvWrap) {
    const slides = Array.from(cvWrap.querySelectorAll<HTMLElement>("[data-cv-slide]"));
    const dots = Array.from(cvWrap.querySelectorAll<HTMLButtonElement>("[data-hero-page]"));
    const label = root.querySelector<HTMLElement>("#cv-page-label");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const labels = ["Profile", "Education", "Experience", "Achievements", "Others"];
    let current = 0;
    let timer: number | undefined;
    let visible = true;
    const show = (index: number) => {
      current = index;
      if (label) label.textContent = `Page ${index + 1} of 5 · ${labels[index]}`;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
        if (i === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      if (reducedMotion.matches || document.hidden) return;
      if (
        finePointer.matches &&
        (!visible || cvWrap.matches(":hover") || cvWrap.contains(root.activeElement))
      ) return;
      timer = window.setInterval(
        () => show((current + 1) % slides.length),
        finePointer.matches ? 3800 : 3000,
      );
    };
    const removeClicks = dots.map((dot, index) => {
      const handler = () => { show(index); start(); };
      dot.addEventListener("click", handler);
      return () => dot.removeEventListener("click", handler);
    });
    if (slides.length === 5 && dots.length === 5) {
      cvWrap.classList.add("js-carousel");
      show(0);
      start();
      const observer = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        start();
      }, { threshold: 0.15 });
      observer.observe(cvWrap);
      const pauseForPointer = () => finePointer.matches && stop();
      const resumeAfterFocus = () => window.setTimeout(start, 0);
      cvWrap.addEventListener("mouseenter", pauseForPointer);
      cvWrap.addEventListener("mouseleave", start);
      cvWrap.addEventListener("focusin", pauseForPointer);
      cvWrap.addEventListener("focusout", resumeAfterFocus);
      document.addEventListener("visibilitychange", start);
      reducedMotion.addEventListener("change", start);
      finePointer.addEventListener("change", start);
      cleanups.push(() => {
        observer.disconnect();
        cvWrap.removeEventListener("mouseenter", pauseForPointer);
        cvWrap.removeEventListener("mouseleave", start);
        cvWrap.removeEventListener("focusin", pauseForPointer);
        cvWrap.removeEventListener("focusout", resumeAfterFocus);
        document.removeEventListener("visibilitychange", start);
        reducedMotion.removeEventListener("change", start);
        finePointer.removeEventListener("change", start);
      });
    }
    cleanups.push(stop, ...removeClicks);
  }

  const counterItems = Array.from(root.querySelectorAll<HTMLElement>(".tc-reveal"));
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    counterItems.forEach((item) => item.classList.add("tc-visible"));
  } else {
    root.querySelector(".trucv-refined-root")?.classList.add("tc-motion");
    const animated = new WeakSet<Element>();
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("tc-visible");
      entry.target.querySelectorAll<HTMLElement>("[data-count]").forEach((item) => {
        if (animated.has(item)) return;
        animated.add(item);
        const target = Number(item.dataset.count);
        const startedAt = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / 1100, 1);
          item.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      observer.unobserve(entry.target);
    }), { threshold: 0.12 });
    counterItems.forEach((item) => observer.observe(item));
    cleanups.push(() => observer.disconnect());
  }

  const roadmap = root.querySelector<HTMLElement>(".trucv-roadmap");
  const track = roadmap?.querySelector<HTMLElement>(".roadmap-track");
  if (roadmap) {
    const stops = Array.from(roadmap.querySelectorAll<HTMLElement>(".roadmap-stop"));
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      roadmap.style.setProperty("--route-progress", "100%");
      stops.forEach((stop) => stop.classList.add("is-reached"));
    } else if (track) {
      roadmap.classList.add("roadmap-motion");
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-reached");
        observer.unobserve(entry.target);
      }), { threshold: 0.15 });
      stops.forEach((stop) => observer.observe(stop));
      let queued = false;
      const draw = () => {
        queued = false;
        const rect = track.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.7 - rect.top) / Math.max(rect.height, 1)));
        roadmap.style.setProperty("--route-progress", `${progress * 100}%`);
      };
      const schedule = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(draw);
      };
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      draw();
      cleanups.push(() => {
        observer.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      });
    }
  }

  return () => cleanups.forEach((cleanup) => cleanup());
};

const TruCVIntroSections = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const { user } = useUserData();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const controller = new AbortController();
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    let disposeAnimations: Cleanup | undefined;

    fetch("/trucv-refined-sections.html", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load sections (${response.status})`);
        return response.text();
      })
      .then((markup) => {
        if (controller.signal.aborted) return;
        shadow.innerHTML = markup;
        shadow
          .querySelectorAll<HTMLAnchorElement>('a[href$="/create-cv"]')
          .forEach((createCvCta) => {
            createCvCta.setAttribute("href", "/create-cv");
          });
        const browseCta = shadow.querySelector<HTMLAnchorElement>(
          '.hero .actions a[href*="/browse-cvs"]',
        );
        if (browseCta) {
          if (user) {
            browseCta.remove();
          } else {
            browseCta.id = "hero-register-cta";
            browseCta.href = "/register/me";
            browseCta.setAttribute("aria-label", "Register for TruCV");
            browseCta.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Register</span>`;
          }
        }
        disposeAnimations = setupRefinedAnimations(shadow);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      });

    return () => {
      controller.abort();
      disposeAnimations?.();
    };
  }, [user]);

  if (loadError) {
    return <div className="w-full bg-white px-6 py-20 text-center text-sm text-slate-500">The homepage introduction could not be loaded. Please refresh the page.</div>;
  }

  return <div ref={hostRef} className="w-full" />;
};

export default TruCVIntroSections;
