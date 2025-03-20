document.addEventListener("DOMContentLoaded", async () => {
    console.log("📅 EventPulse Loaded!");

    try {
        // Initialize Map
        const map = L.map("map").setView([17.5403, 78.3844], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        console.log("🗺️ Map initialized successfully!");

        // Fetch Live Events from `events.json`
        const eventResponse = await fetch("./events.json");
        if (!eventResponse.ok) {
            throw new Error("❌ Failed to load event data");
        }
        const eventData = await eventResponse.json();
        console.log("📡 Live Events Loaded:", eventData);

        // Load Pinned Events from Local Storage
        let pinnedEvents = JSON.parse(localStorage.getItem("pinnedEvents")) || [];
        console.log("📍 Pinned Events (LocalStorage):", pinnedEvents);

        function addMarker(lat, lng, name, link, color) {
            if (lat === undefined || lng === undefined) {
                console.warn(`⚠️ Skipping event "${name}" because lat/lng is missing.`);
                return null;
            }

            let markerIcon = L.icon({
                iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            return L.marker([lat, lng], { icon: markerIcon })
                .addTo(map)
                .bindPopup(`<b>${name}</b><br><a href="${link}" target="_blank">View Event</a>`);
        }

        // Store all events for search & UI updates
        let allEvents = [...eventData.live];

        // Add Live Event Markers from `events.json`
        eventData.live.forEach(event => {
            let marker = addMarker(event.lat, event.lng, event.name, event.link, "blue");
            if (marker) {
                allEvents.push({ ...event, type: "live", marker });
            }
        });

        // Add Pinned Event Markers from `localStorage`
        pinnedEvents.forEach(event => {
            let marker = addMarker(event.lat, event.lng, event.name, event.link, "red");
            if (marker) {
                allEvents.push({ ...event, type: "pinned", marker });
            }
        });

        // ✅ Update Pinned Events List
        const pinnedList = document.getElementById("pinned-events");

        function updatePinnedList() {
            console.log("Updating UI for pinned events:", pinnedEvents);
            if (pinnedEvents.length === 0) {
                pinnedList.innerHTML = "<li>No pinned events.</li>";
            } else {
                pinnedList.innerHTML = pinnedEvents.map(event => `
                    <li class="event-item">
                        <a href="${event.link}" target="_blank">${event.name}</a>
                        <button onclick="togglePin('${event.name}')">${pinnedEvents.some(e => e.name === event.name) ? "📍 Unpin" : "📌 Pin"}</button>
                    </li>
                `).join("");
            }
        }

        updatePinnedList();

        // ✅ Toggle Pin Function
        window.togglePin = function (eventName) {
            const index = pinnedEvents.findIndex(event => event.name === eventName);

            if (index === -1) {
                let eventToPin = allEvents.find(event => event.name === eventName);
                if (eventToPin) {
                    pinnedEvents.push(eventToPin);
                    alert(`📌 ${eventName} pinned!`);
                }
            } else {
                pinnedEvents.splice(index, 1);
                alert(`📍 ${eventName} unpinned!`);
            }

            localStorage.setItem("pinnedEvents", JSON.stringify(pinnedEvents));
            updatePinnedList();
        };

        // ✅ Search Functionality
        const searchBar = document.querySelector(".search-bar");

        if (searchBar) {
            searchBar.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase();

                allEvents.forEach(event => {
                    if (event.name.toLowerCase().includes(query)) {
                        event.marker?.addTo(map); // Show marker if it matches search
                    } else {
                        event.marker && map.removeLayer(event.marker); // Hide marker if it doesn't match
                    }
                });

                // Filter event list in UI
                const eventItems = document.querySelectorAll(".event-item");
                eventItems.forEach(item => {
                    const eventName = item.textContent.toLowerCase();
                    item.style.display = eventName.includes(query) ? "block" : "none";
                });
            });
        }

    } catch (error) {
        console.error("❌ Error loading map:", error);
    }
});

// ✅ Populate Event List Function
function populateEventList(events, listId) {
    const eventList = document.getElementById(listId);
    if (eventList) {
        eventList.innerHTML = events.map(event => `
            <li class="event-item">
                <a href="event-template.html?event=${encodeURIComponent(event.name)}">${event.name}</a>
            </li>
        `).join("");
    }
}
