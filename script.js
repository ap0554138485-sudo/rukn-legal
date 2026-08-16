const modal = document.getElementById("serviceModal");
const stepService = document.getElementById("stepService");
const stepRegion = document.getElementById("stepRegion");
const menuButton = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

let selectedService = "";
let lastFocusedElement = null;

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

function openModal(service = "", trigger = null) {
  if (!modal) return;

  lastFocusedElement = trigger || document.activeElement;
  selectedService = service;
  service ? showRegionStep() : showServiceStep();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  window.setTimeout(() => modal.querySelector(".modal-close")?.focus(), 50);
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
  button.addEventListener("click", () => openModal("", button));
});

document.querySelectorAll(".service-card").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.service || "", button));
});

document.querySelectorAll("[data-modal-service]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedService = button.dataset.modalService || "";
    showRegionStep();
  });
});

document.querySelectorAll("[data-region]").forEach((button) => {
  button.addEventListener("click", () => {
    const region = button.dataset.region || "";
    const isEnglish = document.documentElement.lang === "en";
    const message = isEnglish
      ? `Hello, I would like to request ${selectedService || "a legal service"} in ${region}. Please share the next steps.`
      : `مرحبًا، أرغب بطلب ${selectedService || "خدمة قانونية"} في منطقة ${region}. أرجو تزويدي بالخطوات والمتطلبات.`;
    const contactWindow = window.open(`https://wa.me/966506142113?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    if (contactWindow) contactWindow.opener = null;
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
