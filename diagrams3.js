async function fetchDataAndProcess() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    // Sort the data by classType in ascending order (from lowest to highest intensity)
    data.sort((a, b) => {
      return a.classType.localeCompare(b.classType);
    });

    // Access and process the classType, beginTime, and peakTime data
    const formattedData = data.map(item => {
      return {
        classType: item.classType,
        date: new Date(item.beginTime),
      };
    });

    // Create a Set of unique class types
    const classTypesSet = new Set(formattedData.map(item => item.classType));
    const classTypes = Array.from(classTypesSet);

    // Define the dimensions of the chart
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(classTypes)
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([height, 0]);

    // Create a line generator
    const line = d3.line()
      .x(d => xScale(d.classType))
      .y(d => yScale(d.date));

    // Select the chart container
    const svg = d3.select("#line-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Append the path for the line chart
    svg.append("path")
      .data([formattedData])
      .attr("class", "line")
      .attr("d", line)
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);


    // Add tooltip
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    svg.selectAll("circle")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => xScale(d.classType))
    .attr("cy", d => yScale(d.date))
    .attr("r", 5)
    .attr("fill", "red")
    .on("mouseover", d => {
      if (d.date) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Date: ${d.date.toISOString().split('T')[0]}<br>Class: ${d.classType}`)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      }
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataAndProcess();
