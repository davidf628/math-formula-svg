function setBackground(svg, width, height, color, border) {
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', color)
        .attr('stroke', border);
}

function getTextBounds(text) {

    let bounds = { x: 0, y: 0, width: 0, height: 0 }
    
    if (text.visible) {
        d3.select('svg')
            .append('text')
            .attr('id', 'temp-text')
            .style('font-family', text.font)
            .style('font-size', text.size)
            .style('font-weight', text.weight)
            .text(text.text);
        bounds = document.getElementById('temp-text').getBBox();
        document.getElementById('temp-text').remove();
    } 

    return bounds;
}

function addSVGText(text, elementId) {

    if (text.visible) {
        let object = d3.select('svg')
            .append('text')
            .attr('id', elementId)
            .style('font-family', text.font)
            .style('font-size', text.size)
            .style('font-weight', text.weight)
            .attr('fill', text.color)
            .attr('transform', `translate(${text.bounds.xmid},${text.bounds.ymid})`)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(text.text);
        return object;
    }
    return undefined;
}

function setup_xaxis(xScale, chart_area, opt) {

    if (opt.x_axis.visible) {

        const scale = d3.axisBottom(xScale);

        chart_area.append('g')
            .attr('id', 'x-axis')
            .call(scale);
        
        if (opt.x_axis.label_rotation != 0) {
            d3.selectAll('#x-axis text')
                .attr('transform', `rotate(${opt.x_axis.label_rotation})`)
                .attr('text-anchor', 'start');
        }
        opt.x_axis.bounds = document.getElementById('x-axis').getBBox();
    } else {
        opt.x_axis.bounds = { x: 0, y: 0, width: 0, height: opt.default_margin }
        opt.x_axis.grid = false;
    }
    return opt;
}

function setup_yaxis(yScale, chart_area, opt) {
    
    if (opt.y_axis.visible) {   

        const scale = opt.y_axis.manual_ticks 
            ? d3.axisLeft(yScale)
                .tickFormat(d3.format(opt.y_axis.tick_format))
                .tickValues(d3.range(opt.y_axis.scale.min, opt.y_axis.scale.max, opt.y_axis.scale.step))
            : d3.axisLeft(yScale)
                .tickFormat(d3.format(opt.y_axis.tick_format));

        chart_area.append('g')
            .attr('id', 'y-axis')
            .call(scale);

        opt.y_axis.bounds = document.getElementById('y-axis').getBBox();
    } else {
        opt.y_axis.bounds = { x: 0, y: 0, width: opt.default_margin, height: 0 };
        opt.y_axis.grid = false;
    }
    return opt;
}

function draw_xaxis(xScale, opt) {
    // Redraw the axes, now that we know the correct dimensions
    if (opt.x_axis.visible) {
        const scale = d3.axisBottom(xScale);
        d3.select('#x-axis')
            .attr('transform', `translate(0,${opt.chart_area.bounds.height})`)
            .call(scale);
    }

}

function draw_yaxis(yScale, opt) {
    if (opt.y_axis.visible) {

        const scale = opt.y_axis.manual_ticks 
            ? d3.axisLeft(yScale)
                .tickFormat(d3.format(opt.y_axis.tick_format))
                .tickValues(d3.range(opt.y_axis.scale.min, opt.y_axis.scale.max, opt.y_axis.scale.step))
            : d3.axisLeft(yScale)
                .tickFormat(d3.format(opt.y_axis.tick_format));

        d3.select('#y-axis')
            .call(scale);
    }

    // Draw y-axis grid lines, skip the first one
    if (opt.y_axis.grid) {  
        d3.selectAll('#y-axis .tick').filter( (d,i) => i != 0) 
            .append('line')
            .classed('grid-line', true)
            .attr('stroke', opt.x_axis.grid_color)
            .attr('x1', 1)
            .attr('y1', 0.5)
            .attr('x2', opt.chart_area.bounds.width)
            .attr('y2', 0.5)
    }
}

function set_chart_dimensions(opt) {

    opt.chart_area.top_margin = opt.chart_title.visible ? opt.chart_title.pad * 2 + opt.chart_title.text_bounds.height : opt.default_margin;
    opt.chart_area.bottom_margin = opt.x_title.visible ? opt.x_title.pad * 2 + opt.x_title.text_bounds.height + opt.x_axis.bounds.height : opt.x_axis.bounds.height + opt.default_margin;
    opt.chart_area.right_margin = opt.default_margin;
    opt.chart_area.left_margin = opt.y_title.visible ? opt.y_title.pad * 2 + opt.y_title.text_bounds.height + opt.y_axis.bounds.width : opt.y_axis.bounds.width + opt.default_margin;

    opt.chart_area.bounds.x = opt.chart_area.left_margin;
    opt.chart_area.bounds.y = opt.chart_area.top_margin;
    opt.chart_area.bounds.width = opt.width - opt.chart_area.left_margin - opt.chart_area.right_margin;
    opt.chart_area.bounds.height = opt.height - opt.chart_area.top_margin - opt.chart_area.bottom_margin;
    opt.chart_area.bounds = calculateBounds(opt.chart_area.bounds);

    opt.chart_title.bounds.x = 0;
    opt.chart_title.bounds.y = 0;
    opt.chart_title.bounds.width = opt.chart_area.bounds.right;
    opt.chart_title.bounds.height = opt.chart_area.bounds.top;
    opt.chart_title.bounds = calculateBounds(opt.chart_title.bounds);

    opt.x_title.bounds.x = opt.chart_area.bounds.left;
    opt.x_title.bounds.y = opt.chart_area.bounds.bottom + opt.x_axis.bounds.height;
    opt.x_title.bounds.width = opt.chart_area.bounds.width;
    opt.x_title.bounds.height = opt.chart_area.bottom_margin - opt.x_axis.bounds.height;
    opt.x_title.bounds = calculateBounds(opt.x_title.bounds);

    opt.y_title.bounds.x = 0;
    opt.y_title.bounds.y = opt.chart_area.bounds.top;
    opt.y_title.bounds.width = opt.chart_area.left_margin - opt.y_axis.bounds.width;
    opt.y_title.bounds.height = opt.chart_area.bounds.height;    
    opt.y_title.bounds = calculateBounds(opt.y_title.bounds);

    return opt;
}

function calculateBounds(bounds) {
    bounds.left = bounds.x;
    bounds.right = bounds.left + bounds.width; 
    bounds.top = bounds.y;
    bounds.bottom = bounds.top + bounds.height;   
    bounds.xmid = bounds.left + bounds.width / 2;
    bounds.ymid = bounds.top + bounds.height / 2;
    return bounds;
}