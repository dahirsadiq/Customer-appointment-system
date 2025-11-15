
// this is for mobile nav code
 const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.querySelector(".navbar ul");

  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
  // this is for track status code
  
document.getElementById("trackForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("trackEmail").value.trim();
  const resultDiv = document.getElementById("trackResult");
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const userAppointments = appointments.filter(app => app.email === email);

  if (userAppointments.length === 0) {
    resultDiv.innerHTML = `<p style="color:red;">No appointments found for this email.</p>`;
    return;
  }

  let html = `
    <h3>Your Appointments:</h3>
    <table border="1" cellpadding="8" style="border-collapse:collapse; width:100%;">
      <tr>
        <th>Booking ID</th>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
      </tr>
  `;

  userAppointments.forEach(app => {
    let statusColor =
      app.status === "approved" ? "green" :
      app.status === "declined" ? "red" :
      app.status === "rescheduled" ? "orange" :
      "gray";

    html += `
      <tr>
        <td>${app.id}</td>
        <td>${app.date}</td>
        <td>${app.time}</td>
        <td style="color:${statusColor}; font-weight:bold;">${app.status}</td>
      </tr>
    `;
  });

  html += "</table>";
  resultDiv.innerHTML = html;
});


