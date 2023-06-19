// Draws a bar chart using d3 based on the provided data and options
function createBarChart(data, opt) {
    // Erase the current drawing area
    d3.select('#barchart-preview').remove();
    d3.select('#barchart-svg').append('svg').attr('id', 'barchart-preview');

    let svg = d3.select('#barchart-preview')
        .attr('width', opt.width)
        .attr('height', opt.height);

    // Set background color
    setBackground(svg, opt.width, opt.height, opt.background_color, opt.border_color);
}
/*
// Set up SVG container
let svg = d3.select("body svg")
    .attr("width", opt.width)
    .attr("height", opt.height);

opt.bottom_margin = opt.show_x_labels ? opt.bottom_margin : 1;
opt.left_margin = opt.show_y_labels ? opt.left_margin : 1;

// Set up margin and dimensions
const width = svg.attr("width") - opt.left_margin - opt.right_margin;
const height = svg.attr("height") - opt.top_margin - opt.bottom_margin;

// Create x scale
let x = d3.scaleBand()
    .domain( data.map((d, i) => getLabel(d)) )
    .range([0, width])
    .padding(opt.padding);

// Create y scale
let y = d3.scaleLinear()
    .domain([0, d3.max(data, (d, i) => d.value)])
    .range([height, 0]);

if (opt.show_x_labels) {
    // Create x-axis
    svg.append("g")
        .attr('id', 'bottom-axis')
        .attr("transform", "translate(" + opt.left_margin + "," + (height + opt.top_margin) + ")")
        .call(d3.axisBottom(x));
    
    // Rotate titles
    let bottom_axis_text = d3.selectAll("#bottom-axis text")
    bottom_axis_text.attr('transform', 'rotate(45)').attr('text-anchor', 'start')
}

if (opt.show_y_labels) {
    // Create y-axis
    svg.append("g")
        .attr('id', 'left-axis')
        .attr("transform", "translate(" + opt.left_margin + "," + opt.top_margin + ")")
        .call(d3.axisLeft(y).tickValues(d3.range(0, 3, 1)).tickFormat((d,i) => `${Math.round(d)}`));
}

// Create bars
svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => { return opt.left_margin + x(getLabel(d)); })
    .attr("y", (d, i) => { return y(d.value) + opt.top_margin; })
    .attr("width", (d) => { return x.bandwidth(); })
    .attr("height", (d) => { return height - y(d.value); })
    .attr("fill", "steelblue")
    .attr("stroke", "black");

function getLabel(data) {
    return opt.show_x_labels ? data.label : data.index;
}
*/
