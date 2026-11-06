"use strict";

/* ============================================================
   Anonymous Feedback and Issue Dashboard  (ITM 1131, Group 12)
   Browser-side only. Sample data + localStorage.
   ============================================================ */

const STORAGE_KEY = "itm1131_group12_feedback";

const CATEGORIES = ["Academics", "Facilities", "ICT and Wi-Fi", "Library", "Hostels and Welfare", "Administration"];
const AUDIENCES = ["Student", "Lecturer", "Administrative staff", "Library staff"];
const STATUSES = ["Open", "Under review", "Resolved"];

const SAMPLE_FEEDBACK = [
  { id: 1,  category: "ICT and Wi-Fi",       audience: "Student",              status: "Open",         rating: 2,    date: "2026-10-18", message: "Wi-Fi in the main lecture hall drops every few minutes during online quizzes." },
  { id: 2,  category: "Library",             audience: "Student",              status: "Under review", rating: 3,    date: "2026-10-15", message: "Please extend library opening hours during the examination period." },
  { id: 3,  category: "Facilities",          audience: "Lecturer",             status: "Resolved",     rating: 4,    date: "2026-10-10", message: "The projector in Room B2 was repaired quickly, thank you to the maintenance team." },
  { id: 4,  category: "Academics",           audience: "Student",              status: "Open",         rating: 3,    date: "2026-10-17", message: "Course outlines should be shared in the first week so we can plan our reading." },
  { id: 5,  category: "Hostels and Welfare", audience: "Student",              status: "Under review", rating: 2,    date: "2026-10-12", message: "Water supply in the hostel is unreliable in the evenings." },
  { id: 6,  category: "Administration",      audience: "Administrative staff", status: "Resolved",     rating: 5,    date: "2026-10-05", message: "The new online registration queue system has reduced waiting time a lot." },
  { id: 7,  category: "ICT and Wi-Fi",       audience: "Lecturer",             status: "Under review", rating: 3,    date: "2026-10-14", message: "Computer lab machines need updated software for the programming practicals." },
  { id: 8,  category: "Library",             audience: "Library staff",        status: "Open",         rating: null, date: "2026-10-19", message: "We need more copies of the first-year Information Systems textbooks." },
  { id: 9,  category: "Facilities",          audience: "Student",              status: "Open",         rating: 1,    date: "2026-10-20", message: "Some toilets near the science block have been locked for two weeks." },
  { id: 10, category: "Academics",           audience: "Lecturer",             status: "Resolved",     rating: 4,    date: "2026-10-02", message: "The timetable clash for Web Development and Databases was fixed fast." }
];

/* ---------- State ---------- */
let feedbackList = loadFeedback();

/* ---------- Storage helpers ---------- */
function loadFeedback() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) { /* storage unavailable: fall back to sample data */ }
  return SAMPLE_FEEDBACK.map(function (item) { return Object.assign({}, item); });
}

function saveFeedback() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackList)); }
  catch (err) { /* ignore: data stays in memory for this session */ }
}

/* ---------- DOM shortcuts ---------- */
const $ = function (id) { return document.getElementById(id); };

/* Escape text before inserting into HTML (prevents script injection) */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function statusClass(status) {
  if (status === "Open") return "status-open";
  if (status === "Under review") return "status-review";
  return "status-resolved";
}

function starsFor(rating) {
  if (!rating) return "No rating";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ============================================================
   FUNCTION 1: filterAndSortFeedback  (search / filter / sort)
   ============================================================ */
function filterAndSortFeedback() {
  const term = $("search").value.trim().toLowerCase();
  const category = $("filter-category").value;
  const audience = $("filter-audience").value;
  const status = $("filter-status").value;
  const sortBy = $("sort-by").value;

  const results = feedbackList.filter(function (item) {
    const matchesText = term === "" ||
      item.message.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term);
    const matchesCategory = category === "all" || item.category === category;
    const matchesAudience = audience === "all" || item.audience === audience;
    const matchesStatus = status === "all" || item.status === status;
    return matchesText && matchesCategory && matchesAudience && matchesStatus;
  });

  results.sort(function (a, b) {
    if (sortBy === "oldest") return a.date.localeCompare(b.date) || a.id - b.id;
    if (sortBy === "rating-high") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "rating-low") return (a.rating || 6) - (b.rating || 6);
    return b.date.localeCompare(a.date) || b.id - a.id; // newest
  });

  return results;
}

/* ============================================================
   FUNCTION 2: calculateSummary  (calculation / status summary)
   ============================================================ */
function calculateSummary(list) {
  const summary = { total: list.length, open: 0, review: 0, resolved: 0, average: null, byCategory: {} };
  let ratingSum = 0;
  let ratingCount = 0;

  CATEGORIES.forEach(function (c) {
    summary.byCategory[c] = { total: 0, open: 0, sum: 0, count: 0 };
  });

  list.forEach(function (item) {
    if (item.status === "Open") summary.open++;
    else if (item.status === "Under review") summary.review++;
    else if (item.status === "Resolved") summary.resolved++;

    if (typeof item.rating === "number") { ratingSum += item.rating; ratingCount++; }

    const bucket = summary.byCategory[item.category];
    if (bucket) {
      bucket.total++;
      if (item.status === "Open") bucket.open++;
      if (typeof item.rating === "number") { bucket.sum += item.rating; bucket.count++; }
    }
  });

  summary.average = ratingCount ? ratingSum / ratingCount : null;
  return summary;
}

/* ============================================================
   FUNCTION 3: addFeedback  (user action: submit)
   ============================================================ */
function addFeedback(data) {
  const nextId = feedbackList.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1;
  const entry = {
    id: nextId,
    category: data.category,
    audience: data.audience,
    status: "Open",
    rating: data.rating,
    date: new Date().toISOString().slice(0, 10),
    message: data.message
  };
  feedbackList.push(entry);
  saveFeedback();
  return entry;
}

/* ============================================================
   FUNCTION 4: updateStatus  (user action: update an item)
   ============================================================ */
function updateStatus(id, newStatus) {
  const item = feedbackList.find(function (f) { return f.id === id; });
  if (!item || STATUSES.indexOf(newStatus) === -1) return false;
  item.status = newStatus;
  saveFeedback();
  return true;
}

/* ============================================================
   FUNCTION 5: containsPersonalInfo  (privacy check)
   ============================================================ */
function containsPersonalInfo(text) {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phone = /(\+?\d[\d\s-]{8,}\d)/;
  const regNo = /\b\d{2,4}\/[A-Z]{2,5}\/\d{2,6}\b/i;
  return email.test(text) || phone.test(text) || regNo.test(text);
}

/* ---------- Rendering ---------- */
function renderSummary() {
  const s = calculateSummary(feedbackList);
  const avg = s.average === null ? "N/A" : s.average.toFixed(1) + " / 5";

  $("summary-cards").innerHTML =
    '<div class="stat stat-total"><p class="stat-value">' + s.total + '</p><p class="stat-label">Total feedback</p></div>' +
    '<div class="stat stat-rating"><p class="stat-value">' + avg + '</p><p class="stat-label">Average rating</p></div>' +
    '<div class="stat stat-open"><p class="stat-value">' + s.open + '</p><p class="stat-label">Open issues</p></div>' +
    '<div class="stat stat-review"><p class="stat-value">' + s.review + '</p><p class="stat-label">Under review</p></div>' +
    '<div class="stat stat-resolved"><p class="stat-value">' + s.resolved + '</p><p class="stat-label">Resolved</p></div>';

  const rows = CATEGORIES.map(function (c) {
    const b = s.byCategory[c];
    const catAvg = b.count ? (b.sum / b.count).toFixed(1) : "N/A";
    return "<tr><th scope=\"row\">" + escapeHtml(c) + "</th><td>" + b.total + "</td><td>" + b.open + "</td><td>" + catAvg + "</td></tr>";
  }).join("");
  document.querySelector("#category-table tbody").innerHTML = rows;
}

function renderList() {
  const results = filterAndSortFeedback();
  const staff = $("staff-mode").checked;
  const container = $("feedback-list");

  $("result-count").textContent = "Showing " + results.length + " of " + feedbackList.length + " feedback items";
  $("empty-state").hidden = results.length !== 0;

  container.innerHTML = results.map(function (item) {
    let actions = "";
    if (staff) {
      const options = STATUSES.map(function (st) {
        return '<option value="' + st + '"' + (st === item.status ? " selected" : "") + ">" + st + "</option>";
      }).join("");
      actions = '<div class="card-actions">' +
        '<label for="status-' + item.id + '" class="sr-only">Change status for feedback ' + item.id + '</label>' +
        '<select id="status-' + item.id + '" data-id="' + item.id + '" class="status-select">' + options + '</select>' +
        '</div>';
    }

    return '<article class="card" aria-label="Feedback ' + item.id + '">' +
      '<div class="card-top">' +
        '<span class="tag">' + escapeHtml(item.category) + '</span>' +
        '<span class="tag ' + statusClass(item.status) + '">' + escapeHtml(item.status) + '</span>' +
      '</div>' +
      '<p class="card-message">' + escapeHtml(item.message) + '</p>' +
      '<div class="card-meta">' +
        '<span>' + escapeHtml(item.audience) + ' &middot; ' + formatDate(item.date) + '</span>' +
        '<span class="stars" aria-label="Rating: ' + (item.rating ? item.rating + ' out of 5' : 'none') + '">' + starsFor(item.rating) + '</span>' +
      '</div>' + actions +
    '</article>';
  }).join("");
}

function refreshAll() {
  renderSummary();
  renderList();
}

/* ---------- Dropdown setup ---------- */
function fillSelect(selectEl, values, placeholder, allValue) {
  let html = '<option value="' + allValue + '">' + placeholder + "</option>";
  values.forEach(function (v) { html += '<option value="' + escapeHtml(v) + '">' + escapeHtml(v) + "</option>"; });
  selectEl.innerHTML = html;
}

function setupDropdowns() {
  fillSelect($("filter-category"), CATEGORIES, "All categories", "all");
  fillSelect($("filter-audience"), AUDIENCES, "All audiences", "all");
  fillSelect($("filter-status"), STATUSES, "All statuses", "all");
  fillSelect($("category"), CATEGORIES, "Choose a category", "");
  fillSelect($("audience"), AUDIENCES, "Choose your role", "");
}

/* ---------- Form validation and feedback ---------- */
function showFieldError(inputId, errorId, text) {
  const input = $(inputId);
  const err = $(errorId);
  if (text) {
    err.textContent = text;
    err.hidden = false;
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
  } else {
    err.hidden = true;
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
  }
}

function showFormMessage(type, text) {
  const box = $("form-message");
  box.textContent = text;
  box.className = "message " + type;
  box.hidden = false;
}

function validateForm() {
  let valid = true;
  let firstBad = null;

  function check(ok, inputId, errorId, text) {
    showFieldError(inputId, errorId, ok ? "" : text);
    if (!ok) { valid = false; if (!firstBad) firstBad = $(inputId); }
  }

  const message = $("message").value.trim();
  check($("category").value !== "", "category", "category-error", "Please choose a category.");
  check($("audience").value !== "", "audience", "audience-error", "Please choose who you are.");

  let messageError = "";
  if (message.length < 20) messageError = "Please write at least 20 characters.";
  else if (containsPersonalInfo(message)) messageError = "Remove emails, phone numbers or registration numbers to stay anonymous.";
  check(messageError === "", "message", "message-error", messageError);

  check($("confirm").checked, "confirm", "confirm-error", "Please confirm that your message has no personal information.");

  if (firstBad) firstBad.focus();
  return valid;
}

function handleSubmit(event) {
  event.preventDefault();
  $("form-message").hidden = true;

  if (!validateForm()) {
    showFormMessage("error", "Your feedback was not sent. Please fix the highlighted fields.");
    return;
  }

  const ratingInput = document.querySelector('input[name="rating"]:checked');
  addFeedback({
    category: $("category").value,
    audience: $("audience").value,
    message: $("message").value.trim(),
    rating: ratingInput ? Number(ratingInput.value) : null
  });

  event.target.reset();
  $("char-count").textContent = "0";
  refreshAll();
  showFormMessage("success", "Thank you! Your anonymous feedback was submitted and now appears on the board as Open.");
}

/* ---------- Events ---------- */
function setupEvents() {
  ["search", "filter-category", "filter-audience", "filter-status", "sort-by"].forEach(function (id) {
    $(id).addEventListener("input", renderList);
    $(id).addEventListener("change", renderList);
  });

  $("filter-form").addEventListener("submit", function (e) { e.preventDefault(); });

  $("reset-filters").addEventListener("click", function () {
    $("filter-form").reset();
    renderList();
  });

  $("staff-mode").addEventListener("change", renderList);

  $("feedback-list").addEventListener("change", function (e) {
    if (e.target.classList.contains("status-select")) {
      updateStatus(Number(e.target.dataset.id), e.target.value);
      refreshAll();
    }
  });

  $("feedback-form").addEventListener("submit", handleSubmit);

  $("message").addEventListener("input", function () {
    $("char-count").textContent = $("message").value.length;
  });

  $("clear-rating").addEventListener("click", function () {
    document.querySelectorAll('input[name="rating"]').forEach(function (r) { r.checked = false; });
  });
}

/* ---------- Start ---------- */
setupDropdowns();
setupEvents();
refreshAll();
