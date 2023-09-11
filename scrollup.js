var scrollUpButton = document.getElementById("scrollUpButton");

scrollUpButton.addEventListener("click", function() {
  // Code to scroll up goes here
});

scrollUpButton.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

window.onscroll = function() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollUpButton.style.display = "block";
  } else {
    scrollUpButton.style.display = "none";
  }
};