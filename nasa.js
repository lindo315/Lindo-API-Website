let svg;
let tooltip; // Define the tooltip variable at the top-level scope.

function createSVG() {
  svg = d3.select('body')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight);

  // Initialize the tooltip element.
  tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('border', '1px solid #ccc')
    .style('padding', '5px')
    .style('border-radius', '5px')
    .style('pointer-events', 'none')
    .style('visibility', 'hidden'); // Initially hide the tooltip.
}

async function fetchDataAndProcess() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    // Styling parameters
    const svgBackgroundColor = 'linear-gradient(to bottom, #ffffff, #c0c0c0)';
    const borderColor = '1px solid #333';

    createSVG();

    // Apply styles to the SVG
    svg.style('background', svgBackgroundColor);
    svg.style('border', borderColor);

    const data = await response.json();

    let margin = 20;
    let ringInterval = 20;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    data.sort((a, b) => new Date(a.beginTime) - new Date(b.beginTime));

    let flareRings = svg.selectAll(".flareRing")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "flareRing")
      .attr("r", (d, i) => margin + i * ringInterval)
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("stroke", (d, i) => d3.interpolateRainbow(i / data.length)) // Vary the stroke color
      .attr("stroke-width", "7")
      .attr("fill", "none")
      .style("opacity", 0.8) // Adjust opacity for the rings
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible") // Show the tooltip on hover.
          .html("Begin Time: " + d.beginTime + ", Class Type: " + d.classType)
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden"); // Hide the tooltip when not hovering.
      });

      // Styling the tooltip
    tooltip.style("background-color", "rgba(255, 255, 255, 0.9)");
    tooltip.style("border", "1px solid #666");
    tooltip.style("border-radius", "5px");
    tooltip.style("padding", "10px");
    tooltip.style("font-family", "Arial, sans-serif")

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataAndProcess();


