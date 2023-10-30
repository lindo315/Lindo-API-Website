async function fetchDataAndProcess() {
  try {
    // Calculate the current date and the date five days from now
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 5);

    // Format the dates in yyyy-MM-dd?
    const startDateString = currentDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
    
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    // Access and process the classType, beginTime, peakTime, and 'ndTime data
    data.forEach(item => {
      const flareClassType = item.classType;
      const beginTime = item.beginTime;
      const peakTime = item.peakTime;
      const endTime = item.endTime;

      console.log(`Class Type: ${flareClassType}`);
      console.log(`Begin Time: ${beginTime}`);
      console.log(`Peak Time: ${peakTime}`);
      console.log(`End Time: ${endTime}`);

      // Pie chart for 'classType'
      createPieChart(data);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function createPieChart(data) {
  // Main classes (X, M, C, B, A)
  const mainClasses = ['X', 'M', 'C', 'B', 'A'];

  // Object to store the counts for each main class
  const mainClassCounts = {};

  // Initialize counts to zero for each main class
  mainClasses.forEach(mainClass => {
    mainClassCounts[mainClass] = 0;
  });

  // Aggregate counts for each main class
  data.forEach(item => {
    const classType = item.classType.charAt(0); // Get the first main class?
    if (mainClasses.includes(classType)) {
      mainClassCounts[classType]++;
    }
  });

  // Calculate the total count of all main classes
  const totalCount = mainClasses.reduce((total, mainClass) => total + mainClassCounts[mainClass], 0);

  // Calculate the percentage for each main class
  const pieData = mainClasses
    .map(mainClass => ({
      mainClass,
      count: mainClassCounts[mainClass],
      percentage: (mainClassCounts[mainClass] / totalCount) * 100
    }))
    .filter(item => item.count > 0); // Rid away classes with 0% occurrence

  //Pie chart dimensions
  const width = 600;
  const height = 600;
  const radius = Math.min(width, height) / 2;

  //Colors for main classes
  const colorScale = d3
    .scaleOrdinal()
    .domain(pieData.map(d => d.mainClass))
    .range(['#ff6600', 'orange', 'yellow', 'green', 'blue']);

  //Pie layout
  const pie = d3.pie().value(d => d.count);

  //SVG element for pie chart
  const svg = d3
    .select('#pie-chart')
    .html('') // Clear any existing content
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  //Pie chart slices
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = svg.selectAll('arc').data(pie(pieData)).enter().append('g');

  arcs
    .append('path')
    .attr('d', arc)
    .attr('fill', d => colorScale(d.data.mainClass)); // Use the custom color scale

  //Text labels with percentage
  arcs
    .append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('text-anchor', 'middle')
    .classed('pie-chart-text', true) // Apply the CSS class
    .text(d => `${d.data.mainClass} (${d.data.percentage.toFixed(2)}%)`);
}

fetchDataAndProcess();


var prevScroll = window.pageYOffset;