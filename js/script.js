"use strict";

(function () {
  const videoId = "JPBmzDKCl3o";
  const videoStartSeconds = 92;

  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  const modal = document.getElementById("videoModal");
  const watchButton = document.getElementById("watchVideoButton");
  const closeButton = document.getElementById("videoModalClose");
  const iframe = document.getElementById("videoFrame");

  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.querySelectorAll("#mobileMenu .nav-link");

  const architectureImage = document.getElementById("architectureImage");
  const architectureDetails = document.getElementById("architectureDetails");
  const navAnchorLinks = document.querySelectorAll('.nav-link[href^="#"]');

  let lastFocusedElement = null;
  let isModalOpen = false;

  function buildYoutubeSrc(autoplay) {
    let origin = window.location.origin;
    
    if (!origin || origin === "null" || origin === "" || window.location.protocol === "file:") {
      try {
        const url = new URL(window.location.href);
        origin = url.origin;
      } catch (e) {
        const hostname = window.location.hostname || "localhost";
        origin = window.location.protocol === "https:" 
          ? `https://${hostname}` 
          : `http://${hostname}`;
      }
      
      if (!origin || origin === "null" || origin.startsWith("file:")) {
        origin = window.location.protocol === "https:" ? "https://localhost" : "http://localhost";
      }
    }
    
    if (origin.startsWith("http://") && window.location.protocol !== "http:") {
      origin = origin.replace("http://", "https://");
    }
    
    const params = new URLSearchParams({
      rel: "0",
      start: String(videoStartSeconds || 0),
      modestbranding: "1",
      playsinline: "1",
      enablejsapi: "1",
      origin: origin,
    });

    if (autoplay) {
      params.set("autoplay", "1");
      params.set("mute", "1");
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  function loadYoutube(autoplay) {
    if (!iframe) return;
    
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    
    iframe.src = "";
    
    setTimeout(() => {
      iframe.src = buildYoutubeSrc(autoplay);
    }, 50);
  }

  function setHamburgerAccessibility() {
    if (!hamburger) return;
    hamburger.setAttribute("role", "button");
    hamburger.setAttribute("tabindex", "0");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-controls", "mobileMenu");
    hamburger.setAttribute("aria-label", "Toggle navigation menu");
  }

  function toggleMobileMenu() {
    if (!hamburger || !mobileMenu) return;

    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;

    hamburger.classList.toggle("active", nextState);
    hamburger.setAttribute("aria-expanded", String(nextState));
    mobileMenu.classList.toggle("active", nextState);

    const anchors = mobileMenu.querySelectorAll("a");
    anchors.forEach((link) => {
      if (!nextState) link.setAttribute("tabindex", "-1");
      else link.removeAttribute("tabindex");
    });
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("active");
    mobileMenu
      .querySelectorAll("a")
      .forEach((link) => link.setAttribute("tabindex", "-1"));
  }

  function trapFocus(event) {
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(focusableSelectors);
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function handleModalKeydown(event) {
    if (!isModalOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key === "Tab") {
      trapFocus(event);
    }
  }

  function openModal() {
    if (!modal || !iframe || !watchButton) return;

    lastFocusedElement = document.activeElement;
    loadYoutube(true);

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    isModalOpen = true;
    watchButton.setAttribute("aria-expanded", "true");

    const focusableElements = modal.querySelectorAll(focusableSelectors);
    if (focusableElements.length > 0) focusableElements[0].focus();

    document.addEventListener("keydown", handleModalKeydown);
  }

  function closeModal() {
    if (!modal || !iframe || !watchButton) return;

    iframe.src = "";
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    isModalOpen = false;
    watchButton.setAttribute("aria-expanded", "false");

    document.removeEventListener("keydown", handleModalKeydown);
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function initVideoModal() {
    if (!modal || !watchButton || !closeButton) return;

    if (iframe) {
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    watchButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);
  }

  function scrollToArchitectureDetails() {
    if (!architectureDetails) return;

    architectureDetails.scrollIntoView({ behavior: "smooth", block: "start" });
    architectureDetails.focus({ preventScroll: true });
  }

  function initArchitectureImage() {
    if (!architectureImage || !architectureDetails) return;

    const activateScroll = (event) => {
      if (event) event.preventDefault();
      scrollToArchitectureDetails();
    };

    architectureImage.addEventListener("click", activateScroll);
    architectureImage.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") activateScroll(event);
    });
  }

  function initScrollSpy() {
    if (typeof IntersectionObserver !== "function") return;

    const sectionMap = new Map();
    navAnchorLinks.forEach((link) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      const id = target.id;
      if (!sectionMap.has(id))
        sectionMap.set(id, { element: target, links: [] });
      sectionMap.get(id).links.push(link);
    });

    if (!sectionMap.size) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionData = sectionMap.get(entry.target.id);
          if (!sectionData || !sectionData.links.length) return;

          if (entry.isIntersecting) {
            navAnchorLinks.forEach((link) => link.classList.remove("active"));
            sectionData.links.forEach((link) => link.classList.add("active"));
          }
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    sectionMap.forEach((data) => observer.observe(data.element));
  }

  function initMobileNav() {
    setHamburgerAccessibility();

    if (hamburger) {
      hamburger.addEventListener("click", toggleMobileMenu);
      hamburger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleMobileMenu();
        }
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) closeMobileMenu();
    });

    closeMobileMenu();
  }

  initMobileNav();
  initVideoModal();
  initArchitectureImage();
  initScrollSpy();

  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.loadYoutube = loadYoutube;
})();
