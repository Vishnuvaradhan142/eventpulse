document.addEventListener("DOMContentLoaded", () => {
    console.log("👤 Profile Page Loaded!");

    // Load Saved Profile Data
    if (localStorage.getItem("profileName")) {
        document.getElementById("name").value = localStorage.getItem("profileName");
    }
    if (localStorage.getItem("profileEmail")) {
        document.getElementById("email").value = localStorage.getItem("profileEmail");
    }
    if (localStorage.getItem("profileRole")) {
        document.getElementById("role").value = localStorage.getItem("profileRole");
    }
    if (localStorage.getItem("profileImage")) {
        document.getElementById("profileImage").src = localStorage.getItem("profileImage");
    }

    // Ensure Profile Image Loads Properly
    const profileImage = document.getElementById("profileImage");
    profileImage.onerror = function() {
        profileImage.src = "unknown.jpg"; // Set default image if missing
    };

    // Disable file input by default
    document.getElementById("uploadImage").disabled = true;

    // Handle Profile Picture Upload
    document.getElementById("uploadImage").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("profileImage").src = e.target.result;
                localStorage.setItem("profileImage", e.target.result); // Save image as base64
            };
            reader.readAsDataURL(file);
        }
    });
});

// Toggle Edit Mode
function toggleEdit() {
    let isEditing = document.getElementById("editBtn").innerText === "Edit";

    // Enable/disable input fields
    document.getElementById("name").disabled = !isEditing;
    document.getElementById("email").disabled = !isEditing;
    document.getElementById("role").disabled = !isEditing;
    document.getElementById("uploadImage").disabled = !isEditing;

    // Toggle edit mode styles
    document.querySelector(".profile-container").classList.toggle("edit-mode", isEditing);

    // Toggle button visibility
    document.getElementById("editBtn").style.display = isEditing ? "none" : "inline-block";
    document.getElementById("saveBtn").style.display = isEditing ? "inline-block" : "none";
}

// Save Profile
function saveProfile() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    // Validate inputs
    if (!name || !email || !role) {
        alert("Please fill in all fields.");
        return;
    }

    // Save data to localStorage
    localStorage.setItem("profileName", name);
    localStorage.setItem("profileEmail", email);
    localStorage.setItem("profileRole", role);

    // Notify user that data has been saved
    alert("Profile saved successfully!");

    // Reload the page to reflect changes
    window.location.reload();
}