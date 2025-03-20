document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const role = document.querySelector('input[name="role"]:checked')?.value;

            if (!role) {
                alert("❌ Please select a role!");
                return;
            }

            let users = JSON.parse(localStorage.getItem("users")) || [];

            let user = users.find(u => u.username === username && u.role === role);

            if (user) {
                if (user.password === password) {
                    alert(`✅ ${role === "user" ? "User" : "Event Manager"} login successful!`);

                    // Store session
                    localStorage.setItem("loggedInUser", JSON.stringify(user));

                    // Redirect based on role
                    window.location.assign(role === "manager" ? "event-management.html" : "index.html");
                } else {
                    alert("❌ Incorrect password.");
                }
            } else {
                // Register new user
                const newUser = { username, password, role };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));

                alert("✅ New user registered! Logging in...");

                localStorage.setItem("loggedInUser", JSON.stringify(newUser));

                // Redirect based on role
                window.location.assign(role === "manager" ? "event-management.html" : "index.html");
            }
        });
    } else {
        console.error("❌ Login form not found!");
    }
});
