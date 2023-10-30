let svg;
let tooltip;

function createSVG() {
  // Create a container div to center the SVG
  const container = d3.select('body')
    .append('div')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .style('height', '100vh'); // Ensure it takes up the entire viewport height

  // Append the SVG to the container
  svg = container
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%') // You can adjust the value as needed


  // Create a group to hold all the rings and dots
  const group = svg.append('g')
    .attr('transform', `translate(${svg.attr('width') / 2}, ${svg.attr('height') / 2})`); // Center it

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
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const svgBackgroundColor = 'linear-gradient(to bottom, #ffffff, #c0c0c0)';
    const borderColor = '1px solid #333';

    createSVG();

    svg.style('background', svgBackgroundColor);
    svg.style('border', borderColor);

    const data = await response.json();

    let margin = 20;
    let ringInterval = 20;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    data.sort((a, b) => new Date(a.beginTime) - new Date(b.beginTime));

    let flareRings = svg.selectAll('.flareRing')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'flareRing');

    flareRings
      .append('circle')
      .attr('r', (d, i) => margin + i * ringInterval)
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('stroke', (d, i) => {
        const interpolatedColor = d3.interpolateHsl('blue', 'green')(i / (data.length / 2));
        if (i > data.length / 2) {
          const transitionColor = d3.interpolateHsl('green', 'red')((i - data.length / 2) / (data.length / 2));
          return transitionColor;
        }
        return interpolatedColor;
      })
      .attr('stroke-width', '7')
      .attr('fill', 'none')
      .style('opacity', 0.8)
      .on('mouseover', function (event, d) {
        tooltip.style('visibility', 'visible')
          .html('Begin Time: ' + d.beginTime + ', Class Type: ' + d.classType)
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
      });

    // Add rotating dots within the rings
    flareRings.each(function (d, i) {
      const ring = d3.select(this);
      const numDots = 2;
      const dotRadius = 5;
      const angleIncrement = (2 * Math.PI) / numDots;

      for (let j = 0; j < numDots; j++) {
        const dotAngle = j * angleIncrement;
        const x = centerX + (margin + (i * ringInterval)) * Math.cos(dotAngle);
        const y = centerY + (margin + (i * ringInterval)) * Math.sin(dotAngle);

        ring.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', dotRadius)
          .attr('fill', 'yellow')
          .attr('transform', 'rotate(0 ' + centerX + ' ' + centerY + ')')
          .append('animateTransform')
          .attr('attributeName', 'transform')
          .attr('attributeType', 'XML')
          .attr('type', 'rotate')
          .attr('from', '0 ' + centerX + ' ' + centerY)
          .attr('to', '360 ' + centerX + ' ' + centerY)
          .attr('dur', '10s')
          .attr('repeatCount', 'indefinite');
      }
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

fetchDataAndProcess();



