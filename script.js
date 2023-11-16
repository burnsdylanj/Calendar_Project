const day = document.createElement("div");
day.className = "day";
day.textContent = i;

document.addEventListener("DOMContentLoaded", function () {
    // Get the calendar element
    const calendar = document.getElementById("calendar"); 
 
 day.addEventListener("click", function () {
        const eventText = prompt("Enter event for " + i + ":", "");
        if (eventText !== null) {
          const eventTime = prompt("Enter event time for " + i + " (e.g., 2:00 PM):", "");
          if (eventTime !== null) {
            // Store the event
            storeEvent(i, eventText, eventTime);
            updateCalendar();
          }
        }
      });

      calendar.appendChild(day);
      
// Function to store an event for a specific date and time
function storeEvent(date, eventText, eventTime) {
  // In this example, we are using localStorage to store events
  // You can replace this with your preferred storage mechanism
  const events = JSON.parse(localStorage.getItem("events")) || {};
  events[date] = { text: eventText, time: eventTime };
  localStorage.setItem("events", JSON.stringify(events));
}

// Function to update the calendar with stored events
function updateCalendar() {
  const events = JSON.parse(localStorage.getItem("events")) || {};
  const days = document.querySelectorAll(".day");

  days.forEach((day, index) => {
    const date = index + 1;
    const event = events[date];

    if (event) {
      day.innerHTML = `${date}<br><span style="color: blue;">${event.text}<br>${event.time}</span>`;
    } else {
      day.innerHTML = date;
    }
  });
}

// Load events when the page is loaded
updateCalendar();

});