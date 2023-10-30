async function fetchDataAndProcess1() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    console.log(data);

    // Process the data and create the Active graph
    createLinePlot(data, liveDataContent); // Call Active graph
    createLinePlot2(data); // Call Active graph
    createLinePlot3(data); // Call Active graph

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Create a reference to the live data element
const liveDataContent = document.getElementById("live-data-content");

// Create a fourth graph for events that occurred in the first 9 days, excluding the latest 18 days
function createLinePlot(flaresData, liveDataContent) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Sort the data by date in ascending order
  const sortedData = flaresData.sort((a, b) => new Date(a.beginTime) - new Date(b.beginTime));

  // Filter the data to include only events that occurred in the first 9 days, excluding the latest 18 days
  const nineDaysAgo = new Date();
  nineDaysAgo.setDate(nineDaysAgo.getDate() - 18);

  const filteredData = sortedData.filter((entry) => {
    const eventDate = new Date(entry.beginTime);
    return eventDate <= nineDaysAgo;
  });

  const xScale = d3.scaleTime()
    .domain(d3.extent(filteredData, (d) => new Date(d.beginTime)))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([height, 0]);

  const svg = d3.select("#active1-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Circles for data points in the fourth graph
  svg.selectAll("circle.begin")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("class", "begin")
    .attr("cx", (d) => xScale(new Date(d.beginTime)))
    .attr("cy", (d) => yScale(new Date(d.beginTime).getHours()))
    .attr("r", 4)
    .style("fill", "green")
    .attr("data-date", (d) => d.date)
    .attr("data-beginTime", (d) => d.beginTime)
    .on("mouseover", function (d) {
      if (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
    
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .style("fill", "orange");
    
        // Display data in the live data content
        liveDataContent.innerHTML = "Date: " + d.date;
    
        // Position and show the tooltip
        tooltip.html("Date: " + d.date)
          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 10) + "px")
          .style("opacity", 0.9);
      }
    })
    .on("mouseout", function () {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 4)
        .style("fill", "green");
    })
    .on("mouseout", function () {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);

      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 4)
        .style("fill", "red");
    });

  // Labels for begin time in the fourth graph
  svg.selectAll("text")
    .data(filteredData)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(new Date(d.beginTime)) + 10)
    .attr("y", (d) => yScale(new Date(d.beginTime).getHours()))
    .append("tspan");

  // X-axis in the fourth graph
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Y-axis in the fourth graph
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Add axis labels in the fourth graph
  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .style("text-anchor", "middle")
    .text("Dates");

  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .style("text-anchor", "middle")
    .text("Time (hours)");
}


// Create a second graph for events that occurred between 9 to 18 days ago
function createLinePlot2(flaresData) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Sort the data by date in descending order
  const sortedData = flaresData.sort((a, b) => new Date(b.beginTime) - new Date(a.beginTime));

  // Filter the data to include only events that occurred between 9 and 18 days ago
  const nineDaysAgo = new Date();
  nineDaysAgo.setDate(nineDaysAgo.getDate() - 9);

  const eighteenDaysAgo = new Date();
  eighteenDaysAgo.setDate(eighteenDaysAgo.getDate() - 18);

  const filteredData = sortedData.filter((entry) => {
    const eventDate = new Date(entry.beginTime);
    return eventDate >= eighteenDaysAgo && eventDate < nineDaysAgo;
  });

  const xScale = d3.scaleTime()
    .domain(d3.extent(filteredData, (d) => new Date(d.beginTime)))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([height, 0]);

  const svg = d3.select("#active2-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Circles for data points in the second graph
  svg.selectAll("circle.begin")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("class", "begin")
    .attr("cx", (d) => xScale(new Date(d.beginTime)))
    .attr("cy", (d) => yScale(new Date(d.beginTime).getHours()))
    .attr("r", 4)
    .style("fill", "green")
    .attr("data-date", (d) => d.date)
    .attr("data-beginTime", (d) => d.beginTime)
    .on("mouseover", function (d) {
      if (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .style("fill", "orange");

        // Display data in the live data content
        const liveDataContent = document.getElementById("live-data-content");
        liveDataContent.innerHTML = "Date: " + d.beginTime;
      }
    })
    .on("mouseout", function () {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);

      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 4)
        .style("fill", "green");
    });

  // Labels for begin time in the second graph
  svg.selectAll("text")
    .data(filteredData)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(new Date(d.beginTime)) + 10)
    .attr("y", (d) => yScale(new Date(d.beginTime).getHours()))
    .append("tspan");

  // X-axis in the second graph
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Y-axis in the second graph
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Add axis labels in the second graph
  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .style("text-anchor", "middle")
    .text("Dates");

  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .style("text-anchor", "middle")
    .text("Time (hours)");
}


// Function for Active graph
function createLinePlot3(flaresData) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Sort the data by date in descending order (most recent first).
  const sortedData = flaresData.sort((a, b) => new Date(b.beginTime) - new Date(a.beginTime));

  // Filter the data to include only the most recent 11 events within the last 9 days.
  const filteredData = sortedData.filter((entry, index) => {
    if (index < 11) {
      const eventDate = new Date(entry.beginTime);
      const nineDaysAgo = new Date();
      nineDaysAgo.setDate(nineDaysAgo.getDate() - 9);
      return eventDate >= nineDaysAgo;
    }
    return false;
  });

  const xScale = d3.scaleTime()
    .domain(d3.extent(filteredData, d => new Date(d.beginTime)))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([height, 0]);

  const svg = d3.select("#active3-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Circles for data points
  svg.selectAll("circle.begin")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("class", "begin")
    .attr("cx", d => xScale(new Date(d.beginTime)))
    .attr("cy", d => yScale(new Date(d.beginTime).getHours()))
    .attr("r", 4)
    .style("fill", "blue")
    .attr("data-date", d => d.date)
    .attr("data-beginTime", d => d.beginTime)
    .on("mouseover", function (d) {
      if (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .style("fill", "orange");

        // Display data in the live data content
        const liveDataContent = document.getElementById("live-data-content");
        liveDataContent.innerHTML = "Date: " + d.beginTime;
      }
    })
    .on("mouseout", function () {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);

      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 4)
        .style("fill", "blue");
    });

  // Labels for begin time
  svg.selectAll("text")
    .data(filteredData)
    .enter()
    .append("text")
    .attr("x", d => xScale(new Date(d.beginTime)) + 10)
    .attr("y", d => yScale(new Date(d.beginTime).getHours()))
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
    .attr("y", height + 40)
    .style("text-anchor", "middle")
    .text("Dates");

  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .style("text-anchor", "middle")
    .text("Time (hours)");
}

// Calling
fetchDataAndProcess1();
