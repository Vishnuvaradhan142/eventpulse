document.addEventListener("DOMContentLoaded", function () {
    console.log("⭐ Favorites Page Loaded!");

    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem("favoriteEvents")) || [];
        const favoritesList = document.getElementById("favorite-events");

        if (!favoritesList) {
            console.error("❌ Favorites list element not found!");
            return;
        }

        if (favorites.length === 0) {
            favoritesList.innerHTML = "<li>No favorite events yet.</li>";
        } else {
            favoritesList.innerHTML = favorites.map(event => `
                <li class="event-item">
                    <a href="event-template.html?event=${encodeURIComponent(event.name)}">${event.name}</a>
                    <button onclick="removeFromFavorites('${event.name}')">❌ Remove</button>
                </li>
            `).join("");
        }
    }

    window.removeFromFavorites = function (eventName) {
        let favorites = JSON.parse(localStorage.getItem("favoriteEvents")) || [];
        favorites = favorites.filter(event => event.name !== eventName);
        localStorage.setItem("favoriteEvents", JSON.stringify(favorites));
        loadFavorites();
    };

    loadFavorites();

    // ✅ Search Bar Functionality
    const searchBar = document.querySelector(".search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll(".event-item").forEach(item => {
                const eventName = item.textContent.toLowerCase();
                item.style.display = eventName.includes(query) ? "block" : "none";
            });
        });
    } else {
        console.error("❌ Search bar not found!");
    }
});
