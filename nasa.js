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

    createSVG();

    const data = await response.json();

    let margin = 100;
    let ringInterval = 50;
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
      .attr("stroke", "orange")
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible") // Show the tooltip on hover.
          .html("Begin Time: " + d.beginTime + ", Class Type: " + d.classType)
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden"); // Hide the tooltip when not hovering.
      });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataAndProcess();


