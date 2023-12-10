document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');

  // Creating UI for adding events
  const eventInputForm = document.createElement('div');
  eventInputForm.innerHTML = `
      <input type="text" id="eventTitleInput" placeholder="Event Title">
      <input type="date" id="eventDateInput">
      <button id="addEventButton">Add Event</button>
  `;
  container.insertBefore(eventInputForm, container.firstChild);

  const calendar = document.getElementById('calendar');
  const monthEl = document.getElementById('month');
  const addEventButton = document.getElementById('addEventButton');
  const eventTitleInput = document.getElementById('eventTitleInput');
  const eventDateInput = document.getElementById('eventDateInput');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let events = {};
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  const loadEventsFromLocalStorage = () => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      events = JSON.parse(storedEvents);
    } else {
      events = {};
    }
    updateCalendar(currentMonth, currentYear, events);
  };

  const saveEventsToLocalStorage = () => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  };

  const drawBlankCalendar = () => {
    for (let i = 0; i < 35; i++) {
      const day = document.createElement('div');
      day.classList.add('day');

      const dayText = document.createElement('p');
      dayText.classList.add('day-text');
      dayText.innerText = days[i % 7];

      const dayNumber = document.createElement('p');
      dayNumber.classList.add('day-number');

      const eventName = document.createElement('small');
      eventName.classList.add('event-name');

      day.appendChild(dayText);
      day.appendChild(dayNumber);
      day.appendChild(eventName);
      calendar.appendChild(day);
    }
  };

  const editEvent = (date) => {
    const newTitle = prompt('Edit the event title:', events[date].title);
    if (newTitle !== null) {
      events[date] = { title: newTitle };
      saveEventsToLocalStorage();
      updateCalendar(currentMonth, currentYear, events);
    }
  };

  const deleteEvent = (date) => {
    if (confirm('Are you sure you want to delete this event?')) {
      delete events[date];
      saveEventsToLocalStorage();
      updateCalendar(currentMonth, currentYear, events);
    }
  };

  const updateCalendar = (month, year, events) => {
    calendar.innerHTML = ''; // Clear existing calendar
    drawBlankCalendar(); // Redraw the blank calendar

    const dayElements = document.querySelectorAll('.day');
    const theFirst = new Date(year, month, 1);
    const theFirstDayOfWeek = theFirst.getDay();
    const monthName = months[month];
    monthEl.innerText = `${monthName} ${year}`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let dayCounter = 1;
    for (let i = 0; i < dayElements.length; i++) {
      const day = dayElements[i];
      const dayNumber = day.querySelector('.day-number');
      const eventName = day.querySelector('.event-name');

      if (i >= theFirstDayOfWeek && dayCounter <= daysInMonth) {
        const thisDate = new Date(year, month, dayCounter).toDateString();

        dayNumber.innerText = dayCounter;
        if (events[thisDate]) {
          eventName.innerText = events[thisDate].title;
          eventName.style.cursor = 'pointer';
          eventName.onclick = () => editEvent(thisDate);

          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'X';
          deleteButton.onclick = () => deleteEvent(thisDate);
          day.appendChild(deleteButton);
        } else {
          eventName.innerText = '';
        }

        dayCounter++;
      } else {
        dayNumber.innerText = '';
        eventName.innerText = '';
      }
    }
  };

  const addEvent = () => {
    const eventTitle = eventTitleInput.value;
    const eventDate = new Date(eventDateInput.value);

    if (eventTitle && !isNaN(eventDate.getDate())) {
      events[eventDate.toDateString()] = { title: eventTitle };
      saveEventsToLocalStorage();
      updateCalendar(currentMonth, currentYear, events);
    }
  };

  addEventButton.addEventListener('click', addEvent);

  window.previousMonth = () => {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    updateCalendar(currentMonth, currentYear, events);
  };

  window.nextMonth = () => {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    updateCalendar(currentMonth, currentYear, events);
  };

  loadEventsFromLocalStorage();
});
