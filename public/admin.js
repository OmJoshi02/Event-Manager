// 🔐 Check admin
async function checkAdmin() {
  const res = await fetch("/auth/user", {
    credentials: "include"
  });

  const user = await res.json();

  if (!user || user.email !== "omcjoshi@gmail.com") {
    alert("Not authorized ❌");
    window.location.href = "/dashboard.html";
  }
}

checkAdmin();

// ➕ Create event
window.handleCreateEvent = async function () {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const seats = document.getElementById("seats").value;

  const res = await fetch("/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title,
      date,
      totalSeats: seats
    })
  });

  const data = await res.json();

  alert("Event created ✅");
};