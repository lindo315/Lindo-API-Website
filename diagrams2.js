async function fetchDataAndProcess() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    console.log(data);

    // Process the data and create the Scatter plot
    createScatterPlot(data); // Call Scatter plot

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function for Scatter plot
function createScatterPlot(flaresData) {

  const margin = { top: 20, right: 20, bottom: 50, left: 60 }; // Adjusted bottom margin for axis labels
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const formattedData = flaresData.map(entry => {
    const beginTime = new Date(entry.beginTime);
  
    // Extract time of day as hours and minutes
    const beginHour = beginTime.getHours();
    const beginMinute = beginTime.getMinutes();
  
    // Extract date
    const date = beginTime.toISOString().split('T')[0]; // Get YYYY-MM-DD
  
    return {
      date,
      beginTime: beginHour + beginMinute / 60,
    };
  });

  const xScale = d3.scaleTime()
    .domain(d3.extent(formattedData, d => new Date(d.date)))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([height, 0]);

  const svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Circles for data points
  svg.selectAll("circle.begin")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("class", "begin")
    .attr("cx", d => xScale(new Date(d.date)))
    .attr("cy", d => yScale(d.beginTime))
    .attr("r", 3)
    

  // Labels for begin time
  svg.selectAll("text")
    .data(formattedData)
    .enter()
    .append("text")
    .attr("x", d => xScale(new Date(d.date)) + 10)
    .attr("y", d => yScale(d.beginTime))
    .append("tspan");

  // X-axis
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Y-axis
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Add axis labels
  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40) // Adjusted position for the x-axis label
    .style("text-anchor", "middle")
    .text("Dates");

  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40) // Adjusted position for the y-axis label
    .style("text-anchor", "middle")
    .text("Time (hours)");
}

//Calling
fetchDataAndProcess();
