const form = document.getElementById("loginForm");
const errorBox = document.getElementById("error");

// SIMPLE INTERNAL CREDENTIALS
const INTERNAL_EMAIL = "admin@saat";
const INTERNAL_PASSWORD = "123456";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === INTERNAL_EMAIL && password === INTERNAL_PASSWORD) {
    localStorage.setItem("saat_logged_in", "true");
    window.location.href = "dashboard.html";
  } else {
    errorBox.textContent = "Invalid credentials";
  }
});
