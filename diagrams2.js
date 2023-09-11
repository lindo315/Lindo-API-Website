// Function to fetch data and process it
async function fetchDataAndProcess() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    console.log(data);

    // Process the data and create the scatter plot
    createScatterPlot(data); // Call the function to create the scatter plot

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to create the scatter plot
function createScatterPlot(flaresData) {

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 900 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  const formattedData = flaresData.map(entry => {
    const beginTime = new Date(entry.beginTime);
    const peakTime = new Date(entry.peakTime);
    const endTime = new Date(entry.endTime);
  
    // Extract time of day as hours and minutes
    const beginHour = beginTime.getHours();
    const beginMinute = beginTime.getMinutes();
    const peakHour = peakTime.getHours();
    const peakMinute = peakTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
  
    // Extract date
    const date = beginTime.toISOString().split('T')[0]; // Get YYYY-MM-DD
  
    return {
      date,
      beginTime: beginHour + beginMinute / 60,
      peakTime: peakHour + peakMinute / 60,
      endTime: endHour + endMinute / 60,
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

  // Create circles for data points
  svg.selectAll("circle.begin")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("class", "begin")
    .attr("cx", d => xScale(new Date(d.date)))
    .attr("cy", d => yScale(d.beginTime))
    .attr("r", 3);

  svg.selectAll("circle.peak")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("class", "peak")
    .attr("cx", d => xScale(new Date(d.date)))
    .attr("cy", d => yScale(d.peakTime))
    .attr("r", 3);

  svg.selectAll("circle.end")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("class", "end")
    .attr("cx", d => xScale(new Date(d.date)))
    .attr("cy", d => yScale(d.endTime))
    .attr("r", 3);

  // Create labels for begin time, peak time, and end time
  svg.selectAll("text")
    .data(formattedData)
    .enter()
    .append("text")
    .attr("x", d => xScale(new Date(d.date)) + 10)
    .attr("y", d => yScale(d.beginTime))
    .text(d => `Begin: ${d.beginTime.toFixed(2)} (${d.date})`)
    .append("tspan")
    .attr("x", d => xScale(new Date(d.date)) + 10)
    .attr("y", d => yScale(d.peakTime) + 15)
    .text(d => `Peak: ${d.peakTime.toFixed(2)}`)
    .append("tspan")
    .attr("x", d => xScale(new Date(d.date)) + 10)
    .attr("y", d => yScale(d.endTime) + 30)
    .text(d => `End: ${d.endTime.toFixed(2)}`);

  // Create x-axis
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Create y-axis
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);
}

// Call the data fetching and processing function
fetchDataAndProcess();
