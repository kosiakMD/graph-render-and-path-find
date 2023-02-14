import * as d3 from "d3";

export const renderAllGraphs = (selector, allData) => {
  const svg = d3.select(selector);
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const steps = allData.length + 1;
  // console.log("steps", steps);
  const stepH = height / steps;
  // console.log("stepH", stepH);
  const stepW = width / steps;
  // console.log("stepW", stepW);
  // console.log(Math.random() * (stepH * 2));

  allData.forEach((graphData, i) => {
    const g = svg
      .append("g")
      .attr("transform", `translate(${stepW * (i + 1)}, ${stepH * (i + 1)})`);
    renderGraph(g, ...graphData);
  });
};

export function renderGraph(selector, nodes, links, highlightedLinks) {
  // Create the svg element
  let svg;
  let cntr = [];
  if (typeof selector === "string") {
    svg = d3.select(selector);
    var width = +svg.attr("width");
    var height = +svg.attr("height");
    cntr = [width / 2, height / 2];
  } else {
    svg = selector;
    cntr = [0, 0];
  }
  // Create a new force simulation
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
    // .force("radial", d3.forceRadial(500, width / 2, height / 2))
    // .force("charge", d3.forceManyBody().strength(-1000))
    // .force("center", d3.forceCenter(width / 2, height / 2));
    // .force("radial", d3.forceRadial(500, width / 2, height / 2))
    .force("charge", d3.forceManyBody().strength(-2000).distanceMin(20))
    // .force("charge", d3.forceManyBody())
    // .force("radial", d3.forceRadial(200, width / 2, height / 2).strength(10))
    .force("collide", d3.forceCollide().radius(30))
    .force("center", d3.forceCenter(...cntr));
  // .force("x", d3.forceX().strength(-0.1))
  // .force("y", d3.forceY().strength(-0.1));
  // .force(
  //   "collision",
  //   d3.forceCollide().radius(function (d) {
  //     return d.radius;
  //   })
  // );

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

  const arrowhead = d3.select("#arrowhead");
  // console.log("arrowhead", arrowhead.node());
  const arrow = arrowhead
    .clone(true)
    .attr("id", "arrow")
    .attr("refX", "3%")
    .style("fill", "red");
  // console.log("arrow", arrow.node());

  const checkSelected = (d) => {
    return (
      highlightedLinks &&
      highlightedLinks.find((x) => x.source === d.source.id) &&
      highlightedLinks.find((x) => x.target === d.target.id)
    );
  };
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

  var way = svg
    .append("g")
    .attr("class", "way")
    // if (highlightedLinks.length) {
    // way
    .selectAll("line")
    .data(highlightedLinks)
    .enter()
    .append("line")
    .style("stroke", "red")
    .style("stroke-width", "1px")
    .attr("marker-end", "url(#arrow)");
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

  // console.log("nodes", nodes);
  // console.log("links", links);
  // console.log("highlightedLinks", highlightedLinks);
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
        way
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
