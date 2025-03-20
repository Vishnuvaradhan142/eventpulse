document.addEventListener("DOMContentLoaded", async function () {
    console.log("📊 Leaderboard Page Loaded!");

    try {
        const response = await fetch("./leaderboard.json");
        if (!response.ok) {
            throw new Error("Failed to load leaderboard data");
        }

        const data = await response.json();
        const allEvents = data.events;

        console.log("📡 Leaderboard Data Loaded:", allEvents);

        let currentSort = "rating"; // Default sorting by rating
        updateLeaderboard(allEvents, currentSort);

        // Function to update leaderboard
        function updateLeaderboard(events, sortBy) {
            const leaderboardTable = document.querySelector("#leaderboard tbody");

            // Sort events based on selected category
            events.sort((a, b) => (sortBy === "rating" ? b.rating - a.rating : b.visitors - a.visitors));

            // Populate leaderboard table
            leaderboardTable.innerHTML = events
                .map((event, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td><a href="${event.link}" target="_blank">${event.name}</a></td>
                        <td>${event.rating} ⭐</td>
                        <td>${event.visitors} 👥</td>
                    </tr>
                `)
                .join("");
        }

        // Function to change sorting method
        window.sortLeaderboard = function (sortBy) {
            currentSort = sortBy;
            updateLeaderboard(allEvents, sortBy);
        };

    } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
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
