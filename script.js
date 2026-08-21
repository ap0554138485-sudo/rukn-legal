const modal = document.getElementById("serviceModal");
const stepService = document.getElementById("stepService");
const stepRegion = document.getElementById("stepRegion");
const menuButton = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

let selectedService = "";
let selectedRegion = "";
let lastFocusedElement = null;

function updateSelectedRegionNotice() {
  document.querySelectorAll("[data-selected-region]").forEach((notice) => {
    notice.hidden = !selectedRegion;
    if (!selectedRegion) return;

    const isEnglish = document.documentElement.lang === "en";
    notice.textContent = isEnglish
      ? `Selected location: ${selectedRegion}. Now choose the required service.`
      : `الموقع المختار: ${selectedRegion} — اختر الآن الخدمة المطلوبة.`;
  });
}

function getInteractionLocation(element) {
  if (element.closest(".whatsapp-float")) return "floating_button";
  if (element.closest(".topbar")) return "topbar";
  if (element.closest("header")) return "header";
  if (element.closest(".hero")) return "hero";
  if (element.closest(".contact-section, #contact")) return "contact_section";
  if (element.closest("footer")) return "footer";
  if (element.closest("#serviceModal")) return "service_modal";
  return "page";
}

function trackEvent(eventName, parameters = {}) {
  const eventParameters = {
    page_language: document.documentElement.lang || "ar",
    page_path: window.location.pathname,
    transport_type: "beacon",
    ...parameters,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParameters);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...eventParameters });
}

function trackLead(contactMethod, parameters = {}) {
  trackEvent("generate_lead", {
    contact_method: contactMethod,
    ...parameters,
  });
}

function showServiceStep() {
  if (!stepService || !stepRegion) return;
  stepService.hidden = false;
  stepRegion.hidden = true;
}

function showRegionStep() {
  if (!stepService || !stepRegion) return;
  stepService.hidden = true;
  stepRegion.hidden = false;
  stepRegion.scrollTop = 0;
}

function openModal(service = "", trigger = null, region = "") {
  if (!modal) return;

  lastFocusedElement = trigger || document.activeElement;
  selectedService = service;
  selectedRegion = region;
  updateSelectedRegionNotice();
  service ? showRegionStep() : showServiceStep();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  window.setTimeout(() => modal.querySelector(".modal-close")?.focus(), 50);
}

function submitRequest(region) {
  const isEnglish = document.documentElement.lang === "en";
  const message = isEnglish
    ? `Hello, I would like to request ${selectedService || "a legal service"} in ${region}. Please share the next steps.`
    : `مرحبًا، أرغب بطلب ${selectedService || "خدمة قانونية"} في ${region}. أرجو تزويدي بالخطوات والمتطلبات.`;

  trackLead("whatsapp", {
    contact_location: "service_modal",
    service_name: selectedService || "unspecified",
    service_region: region || "unspecified",
  });

  const contactUrl = `https://wa.me/966506142113?text=${encodeURIComponent(message)}`;
  const contactWindow = window.open(contactUrl, "_blank", "noopener,noreferrer");
  if (contactWindow) contactWindow.opener = null;
  closeModal();
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}

function closeMenu() {
  if (!nav || !menuButton) return;
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

document.querySelectorAll("[data-open-service]").forEach((button) => {
  button.addEventListener("click", () => {
    trackEvent("service_request_start", {
      contact_location: getInteractionLocation(button),
    });
    openModal("", button);
  });
});

document.querySelectorAll("[data-start-region]").forEach((button) => {
  button.addEventListener("click", () => {
    const region = button.dataset.startRegion || "";
    trackEvent("region_selected", {
      contact_location: "regions_section",
      service_region: region || "unspecified",
    });
    openModal("", button, region);
  });
});

document.querySelectorAll(".service-card").forEach((button) => {
  button.addEventListener("click", () => {
    const serviceName = button.dataset.service || "unspecified";
    trackEvent("service_request_start", {
      contact_location: "services_section",
      service_name: serviceName,
    });
    openModal(button.dataset.service || "", button);
  });
});

document.querySelectorAll("[data-modal-service]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedService = button.dataset.modalService || "";
    trackEvent("service_selected", {
      contact_location: "service_modal",
      service_name: selectedService || "unspecified",
    });
    if (selectedRegion) {
      submitRequest(selectedRegion);
      return;
    }

    showRegionStep();
  });
});

document.querySelectorAll("[data-region]").forEach((button) => {
  button.addEventListener("click", () => {
    const region = button.dataset.region || "";
    submitRequest(region);
  });
});

document.addEventListener("click", (event) => {
  const eventTarget = typeof event.target?.closest === "function" ? event.target : event.target?.parentElement;
  const link = eventTarget?.closest("a[href]");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  let contactMethod = "";

  if (href.startsWith("https://wa.me/") || href.startsWith("http://wa.me/")) {
    contactMethod = "whatsapp";
  } else if (href.startsWith("tel:")) {
    contactMethod = "phone";
  } else if (href.startsWith("mailto:")) {
    contactMethod = "email";
  }

  if (!contactMethod) return;

  trackLead(contactMethod, {
    contact_location: getInteractionLocation(link),
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.getElementById("backService")?.addEventListener("click", showServiceStep);

menuButton?.addEventListener("click", () => {
  if (!nav) return;
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("#nav a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("open")) return;
  if (!nav.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal?.classList.contains("open")) closeModal();
    closeMenu();
  }
});

document.getElementById("langBtn")?.addEventListener("click", () => {
  window.location.href = document.documentElement.lang === "en" ? "index.html" : "en.html";
});

const locationDirectorySearch = document.getElementById("locationDirectorySearch");
const locationDirectoryCount = document.getElementById("locationDirectoryCount");
const locationDirectoryEmpty = document.getElementById("locationDirectoryEmpty");

function normalizeArabicSearch(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "");
}

function filterLocationDirectory() {
  if (!locationDirectorySearch) return;

  const query = normalizeArabicSearch(locationDirectorySearch.value);
  let visibleCount = 0;

  document.querySelectorAll("[data-location-group]").forEach((group) => {
    const heading = normalizeArabicSearch(group.querySelector("h3")?.textContent);
    const showWholeGroup = Boolean(query && heading.includes(query));
    let groupVisibleCount = 0;

    group.querySelectorAll("[data-location-item]").forEach((item) => {
      const isVisible = !query || showWholeGroup || normalizeArabicSearch(item.textContent).includes(query);
      item.hidden = !isVisible;
      if (isVisible) groupVisibleCount += 1;
    });

    group.hidden = groupVisibleCount === 0;
    visibleCount += groupVisibleCount;
  });

  if (locationDirectoryCount) {
    const isPageDirectory = locationDirectorySearch.dataset.directoryType === "pages";
    locationDirectoryCount.textContent = isPageDirectory
      ? `${visibleCount} صفحة ظاهرة`
      : `${visibleCount} ${visibleCount === 1 ? "مركز ظاهر" : "مركزًا ظاهرًا"}`;
  }
  if (locationDirectoryEmpty) locationDirectoryEmpty.hidden = visibleCount !== 0;
}

locationDirectorySearch?.addEventListener("input", filterLocationDirectory);
