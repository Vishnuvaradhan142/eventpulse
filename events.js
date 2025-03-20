document.addEventListener("DOMContentLoaded", async function () {
    console.log("📅 Events Page Loaded!");

    try {
        // Fetch event data
        const [liveResponse, upcomingResponse, completedResponse] = await Promise.all([
            fetch("events.json"),
            fetch("upcoming-events.json"),
            fetch("completed-events.json")
        ]);

        if (!liveResponse.ok || !upcomingResponse.ok || !completedResponse.ok) {
            throw new Error("Failed to load event data");
        }

        const liveData = await liveResponse.json();
        let upcomingData = await upcomingResponse.json();
        const completedData = await completedResponse.json();

        console.log("Live Events:", liveData);
        console.log("Upcoming Events:", upcomingData);
        console.log("Completed Events:", completedData);

        // Load additional upcoming events from localStorage (added by organizers)
        let storedUpcomingEvents = JSON.parse(localStorage.getItem("upcomingEvents")) || [];
        console.log("Upcoming Events (from localStorage):", storedUpcomingEvents);

        // Merge & remove duplicate upcoming events
        const mergedUpcomingEvents = [...upcomingData.upcoming, ...storedUpcomingEvents];
        const uniqueUpcomingEvents = mergedUpcomingEvents.filter(
            (event, index, self) => index === self.findIndex(e => e.name === event.name)
        );

        // Store cleaned upcoming events back in localStorage
        localStorage.setItem("upcomingEvents", JSON.stringify(uniqueUpcomingEvents));

        // Load pinned & favorite events
        let pinnedEvents = JSON.parse(localStorage.getItem("pinnedEvents")) || [];
        let favoriteEvents = JSON.parse(localStorage.getItem("favoriteEvents")) || [];

        function populateEventList(events, listId) {
            const eventList = document.getElementById(listId);
            if (eventList) {
                eventList.innerHTML = events.map(event => {
                    const isPinned = pinnedEvents.some(e => e.name === event.name);
                    const isFavorited = favoriteEvents.some(e => e.name === event.name);

                    return `
                        <li class="event-item" style="display: flex; justify-content: space-between; align-items: center;">
                            <a href="event-template.html?event=${encodeURIComponent(event.name)}">${event.name}</a>
                            <div style="display: flex; gap: 10px;">
                                <button class="fav-btn" onclick="toggleFavorite('${event.name}')">
                                    ${isFavorited ? "❌ Unfavorite" : "⭐ Favorite"}
                                </button>
                                <button class="pin-btn" onclick="togglePin('${event.name}')">
                                    ${isPinned ? "📍 Unpin" : "📌 Pin"}
                                </button>
                            </div>
                        </li>
                    `;
                }).join("");
            }
        }

        // Populate event lists
        populateEventList(liveData.live, "live-events");
        populateEventList(uniqueUpcomingEvents, "upcoming-events");
        populateEventList(completedData.completed, "completed-events");

        // ✅ Function to toggle favorite status
        window.toggleFavorite = function (eventName) {
            const event = [...liveData.live, ...uniqueUpcomingEvents, ...completedData.completed].find(e => e.name === eventName);
            if (!event) return;

            const index = favoriteEvents.findIndex(e => e.name === event.name);
            if (index === -1) {
                favoriteEvents.push(event);
                alert(`⭐ ${event.name} added to favorites!`);
            } else {
                favoriteEvents.splice(index, 1);
                alert(`❌ ${event.name} removed from favorites!`);
            }

            localStorage.setItem("favoriteEvents", JSON.stringify(favoriteEvents));
            updatePinnedAndFavoriteLists();
        };

        // ✅ Function to toggle pin status
        window.togglePin = function (eventName) {
            const event = [...liveData.live, ...uniqueUpcomingEvents, ...completedData.completed].find(e => e.name === eventName);
            if (!event) return;

            const index = pinnedEvents.findIndex(e => e.name === event.name);
            if (index === -1) {
                pinnedEvents.push(event);
                alert(`📌 ${event.name} pinned!`);
            } else {
                pinnedEvents.splice(index, 1);
                alert(`📍 ${event.name} unpinned!`);
            }

            localStorage.setItem("pinnedEvents", JSON.stringify(pinnedEvents));
            updatePinnedAndFavoriteLists();
        };

        // ✅ Function to update pinned & favorite event lists
        function updatePinnedAndFavoriteLists() {
            const pinnedList = document.getElementById("pinned-events");
            const favoriteList = document.getElementById("favorites-list");

            if (pinnedList) {
                pinnedList.innerHTML = pinnedEvents.map(event => `
                    <li>
                        <a href="event-template.html?event=${encodeURIComponent(event.name)}">${event.name}</a>
                        <button onclick="togglePin('${event.name}')">📍 Unpin</button>
                    </li>
                `).join("");
            }

            if (favoriteList) {
                favoriteList.innerHTML = favoriteEvents.map(event => `
                    <li>
                        <a href="event-template.html?event=${encodeURIComponent(event.name)}">${event.name}</a>
                        <button onclick="toggleFavorite('${event.name}')">❌ Unfavorite</button>
                    </li>
                `).join("");
            }

            // ✅ Update all event lists with correct Pin/Fav buttons
            populateEventList(liveData.live, "live-events");
            populateEventList(uniqueUpcomingEvents, "upcoming-events");
            populateEventList(completedData.completed, "completed-events");
        }

        updatePinnedAndFavoriteLists();

    } catch (error) {
        console.error("❌ Error loading event data:", error);
    }
});
