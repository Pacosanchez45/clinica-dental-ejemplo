const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const dialog = document.querySelector("[data-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogCopy = document.querySelector("[data-dialog-copy]");
const dialogBook = document.querySelector("[data-dialog-book]");
const teamDialog = document.querySelector("[data-team-dialog]");
const teamBook = document.querySelector("[data-team-book]");

const treatmentCopy = {
  "Implantes dentales":
    "Estudiamos tu caso con diagnóstico digital y te explicamos las opciones para recuperar función y estética con seguridad.",
  "Ortodoncia invisible":
    "Alineadores transparentes, planificación digital y revisiones claras para mover tus dientes de forma discreta.",
  "Estética dental":
    "Blanqueamiento, carillas y pequeñas mejoras para una sonrisa natural, luminosa y proporcionada.",
  Odontopediatría:
    "Visitas amables para niños, prevención y educación dental para que venir al dentista sea una experiencia fácil.",
  Periodoncia:
    "Cuidamos las encías con tratamientos de mantenimiento, limpieza profunda y seguimiento personalizado.",
  "Urgencia dental":
    "Si tienes dolor, fractura o inflamación, llámanos y buscamos el hueco más cercano disponible.",
};

function closeMenu() {
  nav.classList.remove("is-open");
  body.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  body.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeMenu();
});

document.querySelectorAll("[data-open-team]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeMenu();
    if (typeof teamDialog.showModal === "function") {
      teamDialog.showModal();
    } else {
      document.querySelector("#experiencia").scrollIntoView({ behavior: "smooth" });
    }
  });
});

document.querySelectorAll("[data-scroll-top]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    if (anchor.matches("[data-scroll-top]")) return;
    if (anchor.matches("[data-open-team]")) return;
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-open-treatment]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-treatment]");
    const treatment = card.dataset.treatment;
    dialogTitle.textContent = treatment;
    dialogCopy.textContent = treatmentCopy[treatment] || "Te contamos opciones y tiempos en una primera visita clara.";
    dialog.dataset.selectedTreatment = treatment;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      const treatmentSelect = form.elements.treatment;
      treatmentSelect.value = treatment;
      document.querySelector("#cita").scrollIntoView({ behavior: "smooth" });
    }
  });
});

dialogBook.addEventListener("click", () => {
  const treatment = dialog.dataset.selectedTreatment;
  if (treatment && form.elements.treatment) {
    form.elements.treatment.value = treatment;
  }
  dialog.close();
  document.querySelector("#cita").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form.elements.name.focus(), 400);
});

teamBook.addEventListener("click", (event) => {
  event.preventDefault();
  teamDialog.close();
  document.querySelector("#cita").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form.elements.name.focus(), 400);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.className = "form-status";

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const treatment = String(data.get("treatment") || "").trim();

  if (name.length < 2 || phone.length < 6 || !treatment) {
    formStatus.textContent = "Revisa nombre, teléfono y tratamiento.";
    formStatus.classList.add("is-error");
    return;
  }

  const request = {
    name,
    phone,
    treatment,
    createdAt: new Date().toISOString(),
  };

  const previous = JSON.parse(localStorage.getItem("sonrisaClaraRequests") || "[]");
  previous.push(request);
  localStorage.setItem("sonrisaClaraRequests", JSON.stringify(previous));

  const message = encodeURIComponent(
    `Hola, soy ${name}. Quiero pedir cita para ${treatment}. Mi teléfono es ${phone}.`
  );

  formStatus.innerHTML =
    'Solicitud preparada. <a href="https://wa.me/34952000000?text=' +
    message +
    '" target="_blank" rel="noreferrer">Enviar por WhatsApp</a>';
  formStatus.classList.add("is-success");
  form.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
