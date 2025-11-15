
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
      email,
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
