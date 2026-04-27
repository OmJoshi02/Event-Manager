const API = "";

let selectedEvent = null;


async function loadUser() {
  try {
    const res = await fetch("/auth/user", {
      credentials: "include"
    });

    // ❌ DO NOT redirect on 401
    if (!res.ok) {
      console.log("Session not ready yet");
      return;
    }

    const user = await res.json();

    if (user) {
      document.getElementById("username").innerText =
        "👋 " + user.name;
    }

  } catch (err) {
    console.log("Auth check failed:", err);
  }
}


async function loadEvents() {
  try {
    const res = await fetch(`${API}/events`, {
      credentials: "include"
    });

    const events = await res.json();

    const container = document.getElementById("events");
    container.innerHTML = "";

    events.forEach(event => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${event.title}</h3>
        <p>Date: ${event.date}</p>
        <p>Seats: ${event.availableSeats}</p>
        <button onclick="openModal('${event._id}')">Enroll</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading events:", err);
  }
}

// Modal
function openModal(id) {
  selectedEvent = id;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("seats").value = 1;
}

// 🚀 Submit booking
async function submitBooking() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const seats = parseInt(document.getElementById("seats").value);

  if (!name || !email) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        eventId: selectedEvent,
        seats,
        name,
        email
      })
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert("Session expired. Please login again.");
      window.location.href = "/";
      return;
    }

    if (!res.ok) {
      alert(data.message || "Error occurred");
      return;
    }

    alert(data.message);

    closeModal();
    loadEvents();
    loadBookings();

  } catch (err) {
    console.error("Booking error:", err);
    alert("Something went wrong");
  }
}

// 🚀 Load bookings
async function loadBookings() {
  try {
    const res = await fetch(`${API}/bookings/my`, {
      credentials: "include"
    });

    const bookings = await res.json();

    const container = document.getElementById("bookings");
    container.innerHTML = "";

    bookings.forEach(b => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <p>Name : <strong>${b.name}</strong></p>
        <p>Email : ${b.email}</p>
        <p>Seats: ${b.seats}</p>
        <button class="cancel" onclick="cancelBooking('${b._id}')">Cancel</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}

// 🚀 Cancel booking
async function cancelBooking(id) {
  try {
    const res = await fetch(`${API}/bookings/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();
    alert(data.message);

    loadEvents();
    loadBookings();

  } catch (err) {
    console.error("Cancel error:", err);
  }
}

// 🚀 Init
loadUser();
loadEvents();
loadBookings();