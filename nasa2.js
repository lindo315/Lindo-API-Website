async function fetchDataAndProcess() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    // Define a custom color scale for class types
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(function (d) { return d.classType; }))
      .range(['#2ca02c', '#ff7f0e', '#d62728', '#9467bd', '#1f77b4', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']);

    // Set dimensions and margins of the graph
    var margin = { top: 50, right: 30, bottom: 80, left: 100 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
      .attr("width", "87%")
      .attr("height", "86%")
      .attr("fill", "#ADD8E6"); // cold blue

    // Build X scales and axis
    var x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(function (d) { return d.beginTime; }))
      .padding(0.05);

      // Define a custom tick format for the x-axis to display only the date
    const customTimeFormat = d3.timeFormat("%Y-%m-%d");

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text") // Rotate y-axis labels for better readability
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");


    // Define a custom sorting order for class types
    const customClassOrder = ["A", "B", "C", "M"]; // Update with your desired order

    // Sort the data based on the customClassOrder
    data.sort((a, b) => customClassOrder.indexOf(a.classType) - customClassOrder.indexOf(b.classType));

    // Build Y scales and axis
    var y = d3.scaleBand()
      .range([height, 0])
      .domain(data.map(function (d) { return d.classType; }))
      .padding(0.05)
      
    svg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text") // Rotate y-axis labels for better readability
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

    // Create a tooltip
    var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("padding", "5px");

    // Add the squares
    svg.selectAll()
      .data(data, function (d) { return d.beginTime + ':' + d.classType; })
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.beginTime); })
      .attr("y", function (d) { return y(d.classType); })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) { return colorScale(d.classType); }) // Set the square color based on class type
      .on("mouseover", function () { return tooltip.style("visibility", "visible"); })
      .on("mousemove", function (event, d) {
        return tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px")
          .text("Begin Time: " + d.beginTime + ", Class Type: " + d.classType);
      })
      .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });


      // Add title to the graph
      svg.append("text")
      .attr("x", 0)
      .attr("y", -30)
      .attr("text-anchor", "left")
      .style("font-size", "22px")
      .style("fill", "grey")
      .text("Solar Flare Classes Heatmap");

      // Add subtitle to the graph
      svg.append("text")
      .attr("x", 0)
      .attr("y", -10)
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .style("fill", "grey")
      .style("max-width", 400)
      .text("Solar flare classes organized by your custom order.");

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Call the function
fetchDataAndProcess();



