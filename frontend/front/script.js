const API_URL = "http://localhost:3000/api/events";
const STORAGE_KEY = "agenda-academica-events";

const form = document.querySelector("#eventForm");
const eventId = document.querySelector("#eventId");
const title = document.querySelector("#title");
const date = document.querySelector("#date");
const time = document.querySelector("#time");
const place = document.querySelector("#place");
const category = document.querySelector("#category");
const seats = document.querySelector("#seats");
const description = document.querySelector("#description");
const submitBtn = document.querySelector("#submitBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const eventsTable = document.querySelector("#eventsTable");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const apiStatus = document.querySelector("#apiStatus");
const totalEvents = document.querySelector("#totalEvents");
const totalSeats = document.querySelector("#totalSeats");
const nextEvent = document.querySelector("#nextEvent");
const toast = document.querySelector("#toast");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");

let events = [];
let usingApi = false;

const starterEvents = [
  {
    id: 1,
    title: "Palestra sobre Carreira em Tecnologia",
    date: "2026-06-18",
    time: "19:00",
    place: "Auditório Central",
    category: "Palestra",
    seats: 80,
    description: "Conversa com profissionais sobre mercado, currículo e primeiros projetos."
  },
  {
    id: 2,
    title: "Oficina de API com Express",
    date: "2026-06-20",
    time: "14:00",
    place: "Laboratório 02",
    category: "Oficina",
    seats: 35,
    description: "Atividade prática para criar rotas, testar requisições e retornar JSON."
  }
];

function getLocalEvents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(starterEvents));
  return starterEvents;
}

function saveLocalEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

async function requestApi(path = "", options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options
    });

    if (!response.ok) {
      throw new Error("Erro na API");
    }

    return response.status === 204 ? null : response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function loadEvents() {
  try {
    events = await requestApi();
    usingApi = true;
  } catch {
    events = getLocalEvents();
    usingApi = false;
  }

  apiStatus.textContent = usingApi ? "API conectada" : "Modo local";
  renderEvents();
}

function getFormData() {
  return {
    title: title.value.trim(),
    date: date.value,
    time: time.value,
    place: place.value.trim(),
    category: category.value,
    seats: Number(seats.value),
    description: description.value.trim()
  };
}

function resetForm() {
  form.reset();
  eventId.value = "";
  submitBtn.textContent = "Cadastrar evento";
  cancelBtn.hidden = true;
  title.focus();
}

async function createEvent(data) {
  if (usingApi) {
    const created = await requestApi("", {
      method: "POST",
      body: JSON.stringify(data)
    });
    events.push(created);
    return;
  }

  events.push({ ...data, id: Date.now() });
  saveLocalEvents();
}

async function updateEvent(id, data) {
  if (usingApi) {
    const updated = await requestApi(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
    events = events.map((event) => String(event.id) === String(id) ? updated : event);
    return;
  }

  events = events.map((event) => String(event.id) === String(id) ? { ...event, ...data } : event);
  saveLocalEvents();
}

async function deleteEvent(id) {
  const confirmed = confirm("Deseja remover este evento?");
  if (!confirmed) {
    return;
  }

  if (usingApi) {
    await requestApi(`/${id}`, { method: "DELETE" });
  }

  events = events.filter((event) => String(event.id) !== String(id));
  saveLocalEvents();
  renderEvents();
  showToast("Evento removido com sucesso.");
}

function editEvent(id) {
  const event = events.find((item) => String(item.id) === String(id));
  if (!event) {
    return;
  }

  eventId.value = event.id;
  title.value = event.title;
  date.value = event.date;
  time.value = event.time;
  place.value = event.place;
  category.value = event.category;
  seats.value = event.seats;
  description.value = event.description;
  submitBtn.textContent = "Salvar alterações";
  cancelBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function getFilteredEvents() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  return events.filter((event) => {
    const matchesSearch = [event.title, event.place, event.description]
      .join(" ")
      .toLowerCase()
      .includes(search);
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}

function renderStats() {
  totalEvents.textContent = events.length;
  totalSeats.textContent = events.reduce((sum, event) => sum + Number(event.seats || 0), 0);

  const upcoming = [...events]
    .filter((event) => event.date)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0];

  nextEvent.textContent = upcoming ? formatDate(upcoming.date).slice(0, 5) : "--";
}

function renderEvents() {
  const filteredEvents = getFilteredEvents();
  eventsTable.innerHTML = "";
  emptyState.hidden = filteredEvents.length > 0;

  filteredEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="event-name">
          <strong>${event.title}</strong>
          <span>${event.place}</span>
        </div>
      </td>
      <td class="date-cell">
        <strong>${formatDate(event.date)}</strong>
        <span>${event.time}</span>
      </td>
      <td><span class="tag">${event.category}</span></td>
      <td>${event.seats}</td>
      <td>
        <div class="row-actions">
          <button class="edit-btn" type="button" data-action="edit" data-id="${event.id}">Editar</button>
          <button class="delete-btn" type="button" data-action="delete" data-id="${event.id}">Remover</button>
        </div>
      </td>
    `;
    eventsTable.appendChild(row);
  });

  renderStats();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = getFormData();

  try {
    if (eventId.value) {
      await updateEvent(eventId.value, data);
      showToast("Evento atualizado com sucesso.");
    } else {
      await createEvent(data);
      showToast("Evento cadastrado com sucesso.");
    }

    resetForm();
    renderEvents();
  } catch {
    showToast("Não foi possível salvar. Confira a API.");
  }
});

eventsTable.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === "edit") {
    editEvent(id);
  }

  if (action === "delete") {
    deleteEvent(id);
  }
});

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderEvents);
categoryFilter.addEventListener("change", renderEvents);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("agenda-theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("agenda-theme") === "dark") {
  document.body.classList.add("dark");
  themeIcon.textContent = "☀️";
}

loadEvents();
