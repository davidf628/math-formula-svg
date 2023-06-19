function setBackground(svg, width, height, color, border) {
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', color)
        .attr('stroke', border);
}