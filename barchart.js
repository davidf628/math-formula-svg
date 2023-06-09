
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

    // Set up the chart area - the part inside the axes
    let chart_area = svg
        .append('g')
        .attr('id', 'chart-area');

    // Get font metrics
    opt.chart_title.text_bounds = getTextBounds(opt.chart_title);
    opt.x_title.text_bounds = getTextBounds(opt.x_title);
    opt.y_title.text_bounds = getTextBounds(opt.y_title);

    // Create x scale
    let xScale = d3.scaleBand()
        .domain( data.map( (d, i) => opt.x_axis.visible ? d.label : i ) )
        .padding(opt.bar_padding);

    // Create y scale
    let yScale = d3.scaleLinear()
        .domain([
            opt.y_axis.manual_range ? opt.y_axis.scale.min : 0,
            opt.y_axis.manual_range ? opt.y_axis.scale.max : d3.max( data, d => d.value)]);

    // These add the x and y axes to the output, in order to figure out their 
    // dimensions we can't completely draw the axis until we know the 
    // placement of all the chart items
    opt = setup_xaxis(xScale, chart_area, opt);
    opt = setup_yaxis(yScale, chart_area, opt);

    // Calculate chart area dimensions
    opt = set_chart_dimensions(opt);

    chart_area
        .attr('transform', `translate(${opt.chart_area.bounds.left},${opt.chart_area.bounds.top})`);
    
    xScale
        .range([0, opt.chart_area.bounds.width]);

    yScale
        .range([opt.chart_area.bounds.height, 0]);

    draw_xaxis(xScale, opt);
    draw_yaxis(yScale, opt);

    // Add titles to the chart
    addSVGText(opt.chart_title, 'chart-title', 'horizontal');
    addSVGText(opt.x_title, 'x-axis-title', 'horizontal');
    addSVGText(opt.y_title, 'y-axis-title', 'vertical');


    // Create bars
    chart_area.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => { return xScale(opt.x_axis.visible ? d.label : i); })
        .attr("y", (d, i) => { return yScale(d.value); })
        .attr("width", (d) => { return xScale.bandwidth(); })
        .attr("height", (d) => { return opt.chart_area.bounds.height - yScale(d.value); })
        .attr("fill", opt.bar_color)
        .attr("stroke", "black");

}

function setupBarChartInput(barchartopt) {

    // Chart Settings
    document.getElementById('barchart-width').value = barchartopt.width;
    document.getElementById('barchart-width').oninput = () => {
        barchartopt.width = document.getElementById('barchart-width').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-height').value = barchartopt.height;
    document.getElementById('barchart-height').oninput = () => {
        barchartopt.height = document.getElementById('barchart-height').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-background-color').value = barchartopt.background_color;
    document.getElementById('barchart-background-color').oninput = () => {
        barchartopt.background_color = document.getElementById('barchart-background-color').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-border-color').value = barchartopt.border_color;
    document.getElementById('barchart-border-color').oninput = () => {
        barchartopt.border_color = document.getElementById('barchart-border-color').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-bar-color').value = barchartopt.bar_color;
    document.getElementById('barchart-bar-color').oninput = () => {
        barchartopt.bar_color = document.getElementById('barchart-bar-color').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-bar-border-color').value = barchartopt.bar_border_color;
    document.getElementById('barchart-bar-border-color').oninput = () => {
        barchartopt.bar_border_color = document.getElementById('barchart-bar-border-color').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-bar-pad').value = barchartopt.bar_padding;
    document.getElementById('barchart-bar-pad').oninput = () => {
        barchartopt.bar_padding = document.getElementById('barchart-bar-pad').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-default-margin').value = barchartopt.default_margin;
    document.getElementById('barchart-default-margin').oninput = () => {
        barchartopt.default_margin = Number.parseInt(document.getElementById('barchart-default-margin').value);
        actionCreateBarChart();
    }


    // Chart title settings

    document.getElementById('barchart-charttitle-visible').checked = barchartopt.chart_title.visible;
    document.getElementById('barchart-charttitle-visible').onclick = () => {
        barchartopt.chart_title.visible = !barchartopt.chart_title.visible;
        actionCreateBarChart();
    }

    document.getElementById('barchart-charttitle-text').value = barchartopt.chart_title.text;
    document.getElementById('barchart-charttitle-text').oninput = () => {
        barchartopt.chart_title.text = document.getElementById('barchart-charttitle-text').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-charttitle-font').value = barchartopt.chart_title.font;
    document.getElementById('barchart-charttitle-font').oninput = () => {
        barchartopt.chart_title.font = document.getElementById('barchart-charttitle-font').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-charttitle-size').value = barchartopt.chart_title.size;
    document.getElementById('barchart-charttitle-size').oninput = () => {
        barchartopt.chart_title.size = document.getElementById('barchart-charttitle-size').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-charttitle-weight').value = barchartopt.chart_title.weight;
    document.getElementById('barchart-charttitle-weight').oninput = () => {
        barchartopt.chart_title.weight = document.getElementById('barchart-charttitle-weight').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-charttitle-color').value = barchartopt.chart_title.color;
    document.getElementById('barchart-charttitle-color').oninput = () => {
        barchartopt.chart_title.color = document.getElementById('barchart-charttitle-color').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-charttitle-pad').value = barchartopt.chart_title.pad;
    document.getElementById('barchart-charttitle-pad').oninput = () => {
        barchartopt.chart_title.pad = document.getElementById('barchart-charttitle-pad').value;
        actionCreateBarChart();
    }

    // Horizontal title settings
    
    document.getElementById('barchart-xtitle-visible').checked = barchartopt.x_title.visible;
    document.getElementById('barchart-xtitle-visible').onclick = () => {
        barchartopt.x_title.visible = !barchartopt.x_title.visible;
        actionCreateBarChart();
    }

    document.getElementById('barchart-xtitle-text').value = barchartopt.x_title.text;
    document.getElementById('barchart-xtitle-text').oninput = () => {
        barchartopt.x_title.text = document.getElementById('barchart-xtitle-text').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-xtitle-font').value = barchartopt.x_title.font;
    document.getElementById('barchart-xtitle-font').oninput = () => {
        barchartopt.x_title.font = document.getElementById('barchart-xtitle-font').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-xtitle-size').value = barchartopt.x_title.size;
    document.getElementById('barchart-xtitle-size').oninput = () => {
        barchartopt.x_title.size = document.getElementById('barchart-xtitle-size').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-xtitle-weight').value = barchartopt.x_title.weight;
    document.getElementById('barchart-xtitle-weight').oninput = () => {
        barchartopt.x_title.weight = document.getElementById('barchart-xtitle-weight').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-xtitle-color').value = barchartopt.x_title.color;
    document.getElementById('barchart-xtitle-color').oninput = () => {
        barchartopt.x_title.color = document.getElementById('barchart-xtitle-color').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-xtitle-pad').value = barchartopt.x_title.pad;
    document.getElementById('barchart-xtitle-pad').oninput = () => {
        barchartopt.x_title.pad = document.getElementById('barchart-xtitle-pad').value;
        actionCreateBarChart();
    }

    // Vertical title settings
        
    document.getElementById('barchart-ytitle-visible').checked = barchartopt.y_title.visible;
    document.getElementById('barchart-ytitle-visible').onclick = () => {
        barchartopt.y_title.visible = !barchartopt.y_title.visible;
        actionCreateBarChart();
    }

    document.getElementById('barchart-ytitle-text').value = barchartopt.y_title.text;
    document.getElementById('barchart-ytitle-text').oninput = () => {
        barchartopt.y_title.text = document.getElementById('barchart-ytitle-text').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-ytitle-font').value = barchartopt.y_title.font;
    document.getElementById('barchart-ytitle-font').oninput = () => {
        barchartopt.y_title.font = document.getElementById('barchart-ytitle-font').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-ytitle-size').value = barchartopt.y_title.size;
    document.getElementById('barchart-ytitle-size').oninput = () => {
        barchartopt.y_title.size = document.getElementById('barchart-ytitle-size').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-ytitle-weight').value = barchartopt.y_title.weight;
    document.getElementById('barchart-ytitle-weight').oninput = () => {
        barchartopt.y_title.weight = document.getElementById('barchart-ytitle-weight').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-ytitle-color').value = barchartopt.y_title.color;
    document.getElementById('barchart-ytitle-color').oninput = () => {
        barchartopt.y_title.color = document.getElementById('barchart-ytitle-color').value;
        actionCreateBarChart();
    }

    document.getElementById('barchart-ytitle-pad').value = barchartopt.y_title.pad;
    document.getElementById('barchart-ytitle-pad').oninput = () => {
        barchartopt.y_title.pad = document.getElementById('barchart-ytitle-pad').value;
        actionCreateBarChart();
    }
}