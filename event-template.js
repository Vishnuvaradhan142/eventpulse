document.addEventListener("DOMContentLoaded", async () => {
    console.log("📅 Event Page Loaded!");

    const urlParams = new URLSearchParams(window.location.search);
    const eventName = decodeURIComponent(urlParams.get("event")).trim();

    if (!eventName) {
        console.error("❌ No event name found in URL!");
        document.getElementById("eventName").innerText = "Event Not Found";
        return;
    }

    try {
        console.log("🔍 Fetching event data...");
        const responses = await Promise.all([
            fetch("events.json").then(res => res.json()),
            fetch("completed-events.json").then(res => res.json()),
            fetch("upcoming-events.json").then(res => res.json()),
            fetch("pinned.json").then(res => res.json()),
            fetch("leaderboard.json").then(res => res.json())
        ]);

        const [eventsData, completedData, upcomingData, pinnedData, leaderboardData] = responses;

        const allEvents = [
            ...(eventsData.events || []),
            ...(eventsData.live || []),
            ...(completedData.completed || []),
            ...(upcomingData.upcoming || []),
            ...(pinnedData.pinned || []),
            ...(leaderboardData.events || []),
            ...(JSON.parse(localStorage.getItem("upcomingEvents")) || []) // ✅ Include organizer-added events
        ];

        console.log("✅ All Events Loaded:", allEvents);

        const event = allEvents.find(e => e.name.trim() === eventName);

        if (!event) {
            console.error("❌ Event not found:", eventName);
            document.getElementById("eventName").innerText = "Event Not Found";
            return;
        }

        console.log("🎯 Event found:", event);

        // ✅ Populate Event Details
        document.getElementById("eventName").innerText = event.name;
        document.getElementById("eventDate").innerText = event.date || "Date Not Available";
        document.getElementById("eventVenue").innerText = event.venue || "Venue Not Available";
        document.getElementById("eventOrganizer").innerText = event.organizer || "Unknown Organizer";
        document.getElementById("eventDescription").innerText = event.description || "No description provided.";

        // ✅ Register & Unregister Buttons
        const registerBtn = document.getElementById("registerBtn");
        const unregisterBtn = document.getElementById("unregisterBtn");

        let registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || [];

        function updateButtons() {
            if (registeredEvents.includes(event.name)) {
                registerBtn.style.display = "none";
                unregisterBtn.style.display = "inline-block";
            } else {
                registerBtn.style.display = "inline-block";
                unregisterBtn.style.display = "none";
            }
        }

        registerBtn.addEventListener("click", () => {
            if (!registeredEvents.includes(event.name)) {
                registeredEvents.push(event.name);
                localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
                alert(`🎉 Registered for ${event.name}`);
                updateButtons();
            }
        });

        unregisterBtn.addEventListener("click", () => {
            registeredEvents = registeredEvents.filter(e => e !== event.name);
            localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
            alert(`❌ Unregistered from ${event.name}`);
            updateButtons();
        });

        updateButtons();

        // ✅ Fix for "Go Back" button
        const goBackBtn = document.getElementById("goBackBtn");
        if (goBackBtn) {
            goBackBtn.addEventListener("click", () => {
                console.log("🔙 Go Back button clicked!");
                if (document.referrer && document.referrer !== window.location.href) {
                    console.log("🔄 Going back to:", document.referrer);
                    window.history.back();
                } else {
                    console.log("🏠 No referrer, redirecting to events.html");
                    window.location.href = "events.html";
                }
            });
        }

    } catch (error) {
        console.error("❌ Error loading event data:", error);
    }
});
