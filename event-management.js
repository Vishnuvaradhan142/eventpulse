document.addEventListener("DOMContentLoaded", () => { 
    console.log("🛠️ Event Management Page Loaded!");

    const loggedInOrganizer = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInOrganizer || loggedInOrganizer.role !== "manager") {
        alert("🚫 Access Denied: Only event organizers can access this page.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("organizerInfo").innerHTML = `<p>Welcome, <strong>${loggedInOrganizer.name}</strong>!</p>`;

    // ✅ Fix Logout Button
    setTimeout(() => {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                console.log("🔴 Logging out...");
                localStorage.removeItem("loggedInUser"); // Clear session
                window.location.href = "login.html"; // Redirect to login page
            });
        } else {
            console.error("❌ Logout button not found!");
        }
    }, 500); // ✅ Delay to ensure DOM is fully loaded

    let upcomingEvents = JSON.parse(localStorage.getItem("upcomingEvents")) || [];

    function displayMyEvents() {
        const myEvents = upcomingEvents.filter(event => event.organizer === loggedInOrganizer.username);
        const eventList = document.getElementById("myEvents");

        if (myEvents.length === 0) {
            eventList.innerHTML = "<li>No upcoming events found.</li>";
        } else {
            eventList.innerHTML = myEvents.map(event => `
                <li id="event-${event.name.replace(/\s+/g, '-')}">
                    <strong><a href="event-template.html?event=${encodeURIComponent(event.name)}" target="_blank">${event.name}</a></strong> - 
                    <span>${event.date}</span> - 
                    <span>${event.venue}</span>
                    <button onclick="editEvent('${event.name}')">Edit</button>
                    <button onclick="deleteEvent('${event.name}')">Delete</button>
                </li>
            `).join("");
        }
    }

    displayMyEvents();

    // ✅ Add Event with Description
    document.getElementById("addEventBtn").addEventListener("click", () => {
        const name = document.getElementById("eventName").value.trim();
        const date = document.getElementById("eventDate").value.trim();
        const venue = document.getElementById("eventVenue").value.trim();
        const description = document.getElementById("eventDescription").value.trim();

        if (!name || !date || !venue || !description) {
            alert("❌ Please fill in all fields.");
            return;
        }

        if (upcomingEvents.some(event => event.name === name)) {
            alert("❌ Event with this name already exists!");
            return;
        }

        const newEvent = {
            name,
            date,
            venue,
            description,  // ✅ Save Description
            link: `event-template.html?event=${encodeURIComponent(name)}`,
            organizer: loggedInOrganizer.username
        };

        upcomingEvents.push(newEvent);
        localStorage.setItem("upcomingEvents", JSON.stringify(upcomingEvents));

        alert("✅ Event added successfully!");
        displayMyEvents();

        // ✅ Clear input fields after adding event
        document.getElementById("eventName").value = "";
        document.getElementById("eventDate").value = "";
        document.getElementById("eventVenue").value = "";
        document.getElementById("eventDescription").value = "";
    });

    // ✅ Edit Event (Now includes description)
    window.editEvent = function (eventName) {
        const eventIndex = upcomingEvents.findIndex(event => event.name === eventName);
        if (eventIndex === -1) {
            alert("❌ Event not found!");
            return;
        }

        const newDate = prompt("Enter new date (DD-MM-YYYY):", upcomingEvents[eventIndex].date);
        const newVenue = prompt("Enter new venue:", upcomingEvents[eventIndex].venue);
        const newDescription = prompt("Enter new description:", upcomingEvents[eventIndex].description);

        if (newDate && newVenue && newDescription) {
            upcomingEvents[eventIndex].date = newDate;
            upcomingEvents[eventIndex].venue = newVenue;
            upcomingEvents[eventIndex].description = newDescription;
            localStorage.setItem("upcomingEvents", JSON.stringify(upcomingEvents));
            alert("✅ Event updated successfully!");
            displayMyEvents();
        } else {
            alert("❌ Update canceled. Fields cannot be empty.");
        }
    };

    // ✅ Delete Event
    window.deleteEvent = function (eventName) {
        if (confirm(`Are you sure you want to delete "${eventName}"?`)) {
            upcomingEvents = upcomingEvents.filter(event => event.name !== eventName);
            localStorage.setItem("upcomingEvents", JSON.stringify(upcomingEvents));
            displayMyEvents();
        }
    };
});
