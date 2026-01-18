// ===============================
// SAAT SIMPLE FIXED LOGIN
// ===============================

// FIXED CREDENTIALS
const FIXED_USERNAME = "admin";
const FIXED_PASSWORD = "admin123";

// ELEMENTS
const form = document.getElementById("loginForm");
const errorText = document.getElementById("error");

// SAFETY CHECK
if (!form) {
  console.error("Login form not found");
}

// SUBMIT HANDLER
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // VALIDATION
  if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
    // SAVE LOGIN STATE
    localStorage.setItem("saat_logged_in", "true");

    // REDIRECT TO DASHBOARD
    window.location.href = "frontend/dashboard.html";
  } else {
    errorText.textContent = "Invalid username or password";
  }
});
