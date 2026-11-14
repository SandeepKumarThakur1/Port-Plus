
// ==========================================
// PORT PLUS — MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. MOBILE NAVIGATION
  // ==========================================

  // 1. Mobile navigation lives in scripts/nav.js

  // ==========================================
  // 2. CHECK GSAP
  // ==========================================

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP or ScrollTrigger is missing.");
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);


  // ==========================================
  // 3. LENIS SMOOTH SCROLL
  // ==========================================

  let lenis = null;

  if (window.Lenis) {

    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(time => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }


  // ==========================================
  // 4. HERO PARAGRAPH ANIMATION
  // ==========================================

  const heroNote = document.querySelector(".hero-note");

  if (heroNote) {

    gsap.fromTo(
      heroNote,

      {
        autoAlpha: 0,
        y: 28,
        filter: "blur(5px)"
      },

      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.6,
        ease: "power2.out",

        scrollTrigger: {
          trigger: heroNote,
          start: "top 88%",
          toggleActions: "play none play reverse"
        }
      }
    );

  }


  // ==========================================
  // 5. GENERAL SECTION REVEALS
  // ==========================================

  gsap.utils.toArray(
    ".section-heading, .insight-card, .step, .data-copy"
  ).forEach((element, index) => {

    gsap.from(element, {

      y: 30,
      autoAlpha: 0,

      duration: 0.9,

      delay: element.classList.contains("insight-card")
        ? (index % 2) * 0.08
        : 0,

      ease: "power3.out",

      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        once: true
      }

    });

  });


  // ==========================================
  // 6. VIDEO SCROLL ANIMATION
  // ==========================================

  const video = document.querySelector("#scrubVideo");
  const filmSection = document.querySelector(".film-section");
  const filmFrame = document.querySelector(".film-frame");
  const progressBar = document.querySelector(".film-progress span");

  if (video && filmSection && filmFrame) {

    let videoTimeline = null;
    let initialized = false;

    video.pause();

    // ------------------------------------------
    // INITIAL VIDEO POSITION
    // ------------------------------------------

    function setInitialVideoState() {

      const isMobile = window.innerWidth <= 768;

      gsap.set(filmFrame, {

        width: isMobile ? "75%" : "58%",
        height: isMobile ? "42vh" : "55vh",

        y: isMobile ? 65 : 100,

        rotationX: 8,
        scale: 0.92,

        borderRadius: 8,

        transformOrigin: "center center"

      });

    }


    // ------------------------------------------
    // INITIALIZE VIDEO TIMELINE
    // ------------------------------------------

    function initializeVideoAnimation() {

      if (
        initialized ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) return;

      initialized = true;

      video.pause();
      video.currentTime = 0;

      video.classList.add("is-ready");

      setInitialVideoState();

      // Video time controller.
      const playhead = {
        time: 0
      };

      const finalVideoTime = Math.max(
        0,
        video.duration - 0.05
      );

      // ------------------------------------------
      // MASTER SCROLL TIMELINE
      // ------------------------------------------

      videoTimeline = gsap.timeline({

        scrollTrigger: {

          trigger: filmSection,

          start: "top top",

          end: () => `+=${window.innerHeight * 3.5}`,

          scrub: 0.8,

          pin: filmSection,

          pinSpacing: true,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: self => {

            if (progressBar) {
              gsap.set(progressBar, {
                width: `${self.progress * 100}%`
              });
            }

          }

        }

      });


      // ------------------------------------------
      // ANIMATION 1:
      // SMALL VIDEO MOVES UPWARD
      // ------------------------------------------

      videoTimeline.to(filmFrame, {

        y: 0,
        rotationX: 0,
        scale: 1,

        duration: 0.7,

        ease: "power2.out"

      });


      // ------------------------------------------
      // ANIMATION 2:
      // VIDEO EXPANDS TO FULLSCREEN
      // ------------------------------------------

      videoTimeline.to(filmFrame, {

        width: "100%",
        height: "100vh",

        maxHeight: "none",
        minHeight: 0,

        borderRadius: 0,

        duration: 1.2,

        ease: "power3.inOut"

      });


      // ------------------------------------------
      // ANIMATION 3:
      // SCROLL-CONTROLLED VIDEO SCRUBBING
      // ------------------------------------------

      videoTimeline.to(playhead, {

        time: finalVideoTime,

        duration: 2,

        ease: "none",

        onUpdate: () => {

          if (video.readyState >= 2) {

            const difference = Math.abs(
              video.currentTime - playhead.time
            );

            if (difference > 0.025) {
              video.currentTime = playhead.time;
            }

          }

        }

      });


      // ------------------------------------------
      // REFRESH SCROLLTRIGGER
      // ------------------------------------------

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

    }


    // ------------------------------------------
    // VIDEO LOADING EVENTS
    // ------------------------------------------

    video.addEventListener(
      "loadedmetadata",
      initializeVideoAnimation,
      { once: true }
    );

    video.addEventListener(
      "loadeddata",
      () => {
        video.classList.add("is-ready");
      },
      { once: true }
    );

    video.addEventListener("error", () => {

      console.error("Unable to load Port Plus video.");

      filmFrame.classList.add("video-unavailable");

    });


    // Handle cached video metadata.
    if (video.readyState >= 1) {
      initializeVideoAnimation();
    }

  }


  // ==========================================
  // 7. SMOOTH ANCHOR NAVIGATION
  // ==========================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", event => {

      const href = anchor.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      if (lenis) {

        lenis.scrollTo(target, {
          offset: 0,
          duration: 1.2
        });

      } else {

        target.scrollIntoView({
          behavior: "smooth"
        });

      }

    });

  });


  // ==========================================
  // 8. RESPONSIVE SCROLL REFRESH
  // ==========================================

  let resizeTimer;

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      ScrollTrigger.refresh();

    }, 250);

  });


  // ==========================================
  // 9. INITIAL REFRESH
  // ==========================================

  window.addEventListener("load", () => {

    ScrollTrigger.refresh();

  });

});
