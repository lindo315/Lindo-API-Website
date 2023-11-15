let svg;
let tooltip;

function createSVG() {
  // Create a container div to center the SVG
  const container = d3.select('body')
    .append('div')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .style('height', '100vh'); 

  // Append the SVG to the container
  svg = container
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%'); 

  tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('border', '1px solid #ccc')
    .style('padding', '5px')
    .style('border-radius', '5px')
    .style('pointer-events', 'none')
    .style('visibility', 'hidden');
}

async function fetchDataAndProcess() {
  try {
    // Fetch data from NASA API
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    createSVG();

    // Add the interactive circle
    const gradient = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'interactiveGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    gradient.append('stop')
      .attr('offset', '0%')
      .style('stop-color', 'red');

    gradient.append('stop')
      .attr('offset', '100%')
      .style('stop-color', 'orange');

    svg.selectAll('.interactiveCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'interactiveCircle')
      .attr('cx', (d, i) => i * 100 + 50) // Adjust the x position for visibility
      .attr('cy', '50%')
      .attr('r', '50%')
      .style('fill', 'url(#interactiveGradient)')
      .on('mouseover', function (event, d) {
        const { beginTime, classType } = d;

        tooltip.style('visibility', 'visible')
          .html('Begin Time: ' + beginTime + ', Class Type: ' + classType)
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
      });

    tooltip.style('background-color', 'rgba(255, 255, 255, 0.9)');
    tooltip.style('border', '1px solid #666');
    tooltip.style('border-radius', '5px');
    tooltip.style('padding', '10px');
    tooltip.style('font-family', 'Arial, sans-serif');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch data and process
fetchDataAndProcess();

// Add mousemove event to make the circle interactive
svg.on('mousemove', function (event) {
  const [x, y] = d3.pointer(event);
  updateGradient(x, y);
});
