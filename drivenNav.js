document.addEventListener("DOMContentLoaded", function () {
  const homeButton = document.getElementById("homeButton");

  homeButton.addEventListener("click", function () {
    // Redirect to the "home" script (replace 'home.html' with the actual script name).
    window.location.href = 'index.html#sources';
  });
});