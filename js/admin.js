const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// Login functionality
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem("isAdmin", "true");
    showDashboard();
  } else {
    document.getElementById("loginError").innerText = "Invalid credentials!";
  }
});

function showDashboard() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  renderAdminAppointments();
}

function renderAdminAppointments() {
  const tbody = document.getElementById("appointmentsBody");
  const apps = JSON.parse(localStorage.getItem("appointments")) || [];

  tbody.innerHTML = "";

  if (apps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No appointments yet.</td></tr>`;
    return;
  }

  apps.forEach((a) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.name}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>${a.email}</td>
      <td>${a.status || "pending"}</td>
      <td>
        <button class="btn btn-approve" data-id="${a.id}">Approve</button>
        <button class="btn btn-reject" data-id="${a.id}">Reject</button>
        <button class="btn btn-reschedule" data-id="${a.id}">Reschedule</button>
        <button class="btn btn-delete" data-id="${a.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Add button actions
  document.querySelectorAll(".btn-approve").forEach(btn => btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approved")));
  document.querySelectorAll(".btn-reject").forEach(btn => btn.addEventListener("click", () => updateStatus(btn.dataset.id, "declined")));
  document.querySelectorAll(".btn-reschedule").forEach(btn => btn.addEventListener("click", () => rescheduleAppointment(btn.dataset.id)));
  document.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", () => deleteAppointment(btn.dataset.id)));
}

function updateStatus(id, status) {
  let apps = JSON.parse(localStorage.getItem("appointments")) || [];
  apps = apps.map((a) => (a.id === id ? { ...a, status } : a));
  localStorage.setItem("appointments", JSON.stringify(apps));
  renderAdminAppointments();
}

function deleteAppointment(id) {
  let apps = JSON.parse(localStorage.getItem("appointments")) || [];
  apps = apps.filter((a) => a.id !== id);
  localStorage.setItem("appointments", JSON.stringify(apps));
  renderAdminAppointments();
}

function rescheduleAppointment(id) {
  const newDate = prompt("Enter new date (YYYY-MM-DD):");
  const newTime = prompt("Enter new time (HH:MM):");

  if (!newDate || !newTime) return alert("Reschedule canceled.");

  let apps = JSON.parse(localStorage.getItem("appointments")) || [];
  apps = apps.map((a) => (a.id === id ? { ...a, date: newDate, time: newTime, status: "rescheduled" } : a));
  localStorage.setItem("appointments", JSON.stringify(apps));
  renderAdminAppointments();
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  location.reload();
});

// On load
window.onload = () => {
  if (localStorage.getItem("isAdmin") === "true") {
    showDashboard();
  }
};
