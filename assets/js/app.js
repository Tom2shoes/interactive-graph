const svgWidth = 620;
const svgHeight = 400;

const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
};
const padding = 40;

const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

let svg = d3.select('#scatter')
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// Append an SVG group
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(healthData) {
    console.log(healthData);
    
    healthData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });
    
    let xScale = d3.scaleLinear()
    .domain([d3.min(healthData, d =>d.age-2), d3.max(healthData, d => d.age+1)])
    .range([padding, chartWidth - padding])

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.smokes)])
        .range([chartHeight - padding, padding])

    const bottomAxis = d3.axisBottom(xScale);
    const leftAxis = d3.axisLeft(yScale);

    let xAxis = svg.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight - padding})`)
        .call(bottomAxis);

    let yAxis = svg.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(${padding}, 0)`)
        .call(leftAxis);

    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.age))
        .attr("cy", d => yScale(d.smokes))
        .attr("r", 10)
        .attr("fill", "#4286f4");

    let circlesText = chartGroup.selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.age))
        .attr("y", d => yScale(d.smokes))
        .attr("fill", "white")
        .attr("font-size", "8px")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(0, 3)`)
        .text(d => d.abbr);

    let yAxisText = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 15)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .text("Smokes (%)");

    let xAxisText = chartGroup.append("text")             
        .attr("x", chartWidth / 2 )
        .attr("y", chartHeight - 15)
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .text("Average Age (Yrs)");
});


