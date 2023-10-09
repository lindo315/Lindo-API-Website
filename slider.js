document.addEventListener("DOMContentLoaded", function() {
  const slider = document.getElementById("graphSlider");

  function showGraph(selectedGraph) {
    // Your showGraph function code
    for (let i = 1; i <= 3; i++) {
      const graphContainer = document.getElementById(`graph${i}`);
      if (i == selectedGraph) {
        graphContainer.style.display = "block";
      } else {
        graphContainer.style.display = "none";
      }
    }
  }

  showGraph(slider.value);

  slider.addEventListener("input", () => {
    showGraph(slider.value);
  });
});

