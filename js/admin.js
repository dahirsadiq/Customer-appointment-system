// ========================
// Admin Authentication
// ========================

// Handle signup/login toggle
let isSignUpMode = false;
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const toggleAuthLink = document.getElementById("toggleAuthLink");
const toggleAuthText = document.getElementById("toggleAuthText");

toggleAuthLink.addEventListener("click", (e) => {
  e.preventDefault();
  isSignUpMode = !isSignUpMode;

  if (isSignUpMode) {
    authTitle.textContent = "Admin Sign Up";
    authBtn.textContent = "Sign Up";
    toggleAuthText.textContent = "Already have an account?";
    toggleAuthLink.textContent = "Login";
  } else {
    authTitle.textContent = "Admin Login";
    authBtn.textContent = "Login";
    toggleAuthText.textContent = "Don’t have an account?";
    toggleAuthLink.textContent = "Sign up";
  }

  document.getElementById("loginError").innerText = "";
});

// Handle login/signup form submission
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("loginError");

  if (!username || !password) {
    errorEl.innerText = "Please fill in all fields.";
    return;
  }

  // Load admin accounts
  let admins = JSON.parse(localStorage.getItem("admins")) || [];

  if (isSignUpMode) {
    // Check if username already exists
    if (admins.some(a => a.username === username)) {
      errorEl.innerText = "Username already exists!";
      return;
    }
    admins.push({ username, password });
    localStorage.setItem("admins", JSON.stringify(admins));
    alert("Account created! Please login.");
    isSignUpMode = false;
    authTitle.textContent = "Admin Login";
    authBtn.textContent = "Login";
    toggleAuthText.textContent = "Don’t have an account?";
    toggleAuthLink.textContent = "Sign up";
    e.target.reset();
  } else {
    // Login
    const admin = admins.find(a => a.username === username && a.password === password);
    if (!admin) {
      errorEl.innerText = "Invalid credentials!";
      return;
    }

    localStorage.setItem("isAdmin", "true");
    showDashboard();
  }
});

// ========================
// Dashboard Functions
// ========================

function showDashboard() {
  document.getElementById("authSection").style.display = "none";
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

  document.querySelectorAll(".btn-approve").forEach(btn => btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approved")));
  document.querySelectorAll(".btn-reject").forEach(btn => btn.addEventListener("click", () => updateStatus(btn.dataset.id, "declined")));
  document.querySelectorAll(".btn-reschedule").forEach(btn => btn.addEventListener("click", () => rescheduleAppointment(btn.dataset.id)));
  document.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", () => deleteAppointment(btn.dataset.id)));
}

function updateStatus(id, status) {
  let apps = JSON.parse(localStorage.getItem("appointments")) || [];
  apps = apps.map(a => (a.id === id ? { ...a, status } : a));
  localStorage.setItem("appointments", JSON.stringify(apps));
  renderAdminAppointments();
}

function deleteAppointment(id) {
  let apps = JSON.parse(localStorage.getItem("appointments")) || [];
  apps = apps.filter(a => a.id !== id);
  localStorage.setItem("appointments", JSON.stringify(apps));
  renderAdminAppointments();
}

function rescheduleAppointment(id) {
  const newDate = prompt("Enter new date (YYYY-MM-DD):");
  const newTime = prompt("Enter new time (HH:MM):");

  if (!newDate || !newTime) return alert("Reschedule canceled.");

  let apps = JSON.parse(localStorage.getItem("appointments")) || [];
  apps = apps.map(a => (a.id === id ? { ...a, date: newDate, time: newTime, status: "rescheduled" } : a));
  localStorage.setItem("appointments", JSON.stringify(apps));
  renderAdminAppointments();
}

// ========================
// Logout 
// ========================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  location.reload();
});

window.onload = () => {
  if (localStorage.getItem("isAdmin") === "true") {
    showDashboard();
  }
};
