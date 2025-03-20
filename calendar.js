document.addEventListener("DOMContentLoaded", async function () {
    console.log("📅 Calendar Page Loaded!");

    try {
        // Fetch event data
        const [liveResponse, upcomingResponse, completedResponse] = await Promise.all([
            fetch("./events.json"),
            fetch("./upcoming-events.json"),
            fetch("./completed-events.json")
        ]);

        if (!liveResponse.ok || !upcomingResponse.ok || !completedResponse.ok) {
            throw new Error("Failed to load event data");
        }

        const liveData = await liveResponse.json();
        const upcomingData = await upcomingResponse.json();
        const completedData = await completedResponse.json();

        console.log("Live Events:", liveData);
        console.log("Upcoming Events:", upcomingData);
        console.log("Completed Events:", completedData);

        // Categorize events
        const liveEvents = liveData.live.map(event => ({ ...event, color: "blue" }));
        const upcomingEvents = upcomingData.upcoming.map(event => ({ ...event, color: "green" }));
        const completedEvents = completedData.completed.map(event => ({ ...event, color: "red" }));

        // Store all events for searching
        let allEvents = [...liveEvents, ...upcomingEvents, ...completedEvents];

        // Populate UI Lists
        function populateEventList(events, listId) {
            const eventList = document.getElementById(listId);
            if (eventList) {
                eventList.innerHTML = events.map(event => `
                    <li class="event-item">
                        <strong>${event.name}</strong> - ${event.date}
                    </li>
                `).join("");
            }
        }

        populateEventList(liveEvents, "live-events");
        populateEventList(upcomingEvents, "upcoming-events");
        populateEventList(completedEvents, "completed-events");

        // Search Bar Functionality
        const searchBar = document.querySelector(".search-bar");
        searchBar.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll(".event-item").forEach(item => {
                const eventName = item.textContent.toLowerCase();
                item.style.display = eventName.includes(query) ? "block" : "none";
            });
        });

    } catch (error) {
        console.error("❌ Error loading calendar:", error);
    }
});
function populateEventList(events, listId) {
    const eventList = document.getElementById(listId);
    if (eventList) {
        eventList.innerHTML = events.map(event => `
            <li>
                <a href="event-template.html?event=${encodeURIComponent(event.name)}">${event.name}</a> - ${event.date}
            </li>
        `).join("");
    }
}
function initializeCalendar(events) {
    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) {
        console.error("❌ Calendar element not found!");
        return;
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: events.map(event => ({
            title: event.name,
            start: formatDate(event.date),
            url: `event-template.html?event=${encodeURIComponent(event.name)}`, // ✅ Ensure encoding
        })),
        eventClick: function(info) {
            info.jsEvent.preventDefault();
            window.location.href = info.event.url;
        }
    });

    calendar.render();
}