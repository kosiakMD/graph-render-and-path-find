import * as d3 from "d3";

// const width = 700;
// const height = 500;

export async function render(selector, nodes, links, highlightedLinks) {
  // Create a new force simulation
  // const simulation = d3
  //   .forceSimulation()
  //   .force(
  //     "link",
  //     d3.forceLink().id((d) => d.id)
  //   )
  //   .force("charge", d3.forceManyBody())
  //   .force("center", d3.forceCenter());

  // Create the svg element
  // var svg = d3.select(selector);
  var svg = d3.select(selector),
    width = +svg.attr("width"),
    height = +svg.attr("height");
  console.log("width", width);
  console.log("height", height);

  var simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force(
      "path",
      d3.forceLink(highlightedLinks).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-3000))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Define the arrow marker
  // svg
  //   .append("defs")
  //   .append("arrowhead")
  //   .attr("id", "arrow")
  //   .attr("viewBox", "0 -5 10 10")
  //   .attr("refX", 20)
  //   .attr("refY", 0)
  //   .attr("markerWidth", 20)
  //   .attr("markerHeight", 20)
  //   .attr("orient", "auto")
  //   .append("path")
  //   .attr("d", "M0,-5L10,0L0,5");
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", 2)
    .attr("markerWidth", 20)
    .attr("markerHeight", 20)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 4 L6,2 Z")
    .attr("class", "marker");

  const checkSelected = (d) => {
    return (
      highlightedLinks &&
      highlightedLinks.find((x) => x.source === d.source.id) &&
      highlightedLinks.find((x) => x.target === d.target.id)
    );
  };

  // var link = svg
  //   .append("g")
  //   .attr("class", "links")
  //   .selectAll("line")
  //   .data(links)
  //   .enter()
  //   .append("line")
  //   .attr("stroke-width", 2);
  // Add the links to the simulation
  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("marker-end", "url(#arrowhead)");
  // .style("stroke", (d) => (checkSelected(d) ? "red" : "black"))
  // .style("stroke-width", (d) => (checkSelected(d) ? "2px" : "1px"));

  var path = svg
    .append("g")
    .attr("class", "path")
    // if (highlightedLinks.length) {
    // path
    .selectAll("line")
    .data(highlightedLinks)
    .enter()
    .append("line")
    .style("stroke", "red")
    .style("stroke-width", "1.5px")
    .attr("marker-end", "url(#arrowhead)");
  // }

  // Add the nodes to the simulation
  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .attr("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", "1px");
  // .call(
  //   d3.drag()
  //     .on("start", dragstart)
  //     .on("drag", drag)
  //     .on("end", dragend)
  // );

  const label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((d) => d.id)
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle");

  // node.append("title").text((d) => d.id);

  console.log("nodes", nodes);
  console.log("links", links);
  console.log("highlightedLinks", highlightedLinks);
  // Start the simulation
  // simulation.nodes(nodes).on("tick", ticked);
  // simulation.force("link").links(links);

  simulation.on("tick", ticked);

  function ticked() {
    try {
      link
        .attr("x1", (d) => d.source.x - 0)
        .attr("y1", (d) => d.source.y - 0)
        .attr("x2", (d) => d.target.x - 0)
        .attr("y2", (d) => d.target.y - 0);

      if (highlightedLinks.length) {
        path
          .attr("x1", (d) => d.source.x - 0)
          .attr("y1", (d) => d.source.y - 0)
          .attr("x2", (d) => d.target.x - 0)
          .attr("y2", (d) => d.target.y - 0);
      }

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
      // text.attr("x", d => d.
      // return;
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
