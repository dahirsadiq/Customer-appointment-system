
document.getElementById("appointmentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const desc = document.getElementById("desc").value.trim();
  //   form validation 
    if (!name || !email || !date || !time) {
      alert("Please fill all required fields!");
      return;
    }

    const apps = getAppointments();

    const newAppointment = {
      id: Date.now().toString(),
      name,
      // email,
      date,
      time,
      desc,
      status: "pending",
     
    };

    apps.push(newAppointment);
    saveAppointments(apps);

    displayUserAppointments(); // display Data to the DOM
    e.target.reset(); // clear form
  });


const getAppointments = () => {
    try {
      const data = JSON.parse(localStorage.getItem("appointments")) || [];
      return data;
    } catch (err) {
      console.error("Error reading appointments:", err);
      
    }
  };

  //  Save appointments to localStorage
  const saveAppointments = (appointments) => {
    try {
      localStorage.setItem("appointments", JSON.stringify(appointments));
    } catch (err) {
      console.error("Error saving appointments:", err);
    }
  };

  // display appointments to the page (DOM)
  function displayUserAppointments() {
    const list = document.getElementById("appointmentsList");
    if (!list) return;

    const apps = getAppointments();
    list.innerHTML = "";

   
    apps.forEach((a) => {
      const div = document.createElement("div");
      div.className = "appointment";
      div.innerHTML = `
        <h3>${a.name}</h3>
        <p><strong>Date:</strong> ${a.date}</p>
        <p><strong>Time:</strong> ${a.time}</p>
        <p><strong>Desc:</strong> ${a.desc}</p>
        <p>Status: <span class="status">${a.status}</span></p>
      `;
      list.appendChild(div);
    });
  }
  // call function display to the DOM
 // displayUserAppointments();