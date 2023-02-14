export function findShortestPath(
  graph,
  start,
  end,
  currentPath = [],
  shortestPath = null
) {
  currentPath.push(start);
  if (start === end) {
    if (!shortestPath || currentPath.length < shortestPath.length) {
      shortestPath = currentPath.slice();
    }
    return;
  }
  for (const node of graph[start]) {
    if (!currentPath.includes(node)) {
      findShortestPath(graph, node, end, currentPath, shortestPath);
    }
  }
  currentPath.pop();
  return shortestPath;
}

export function dijkstra(graph, source, target) {
  // Initialize the distances of all nodes to infinity
  const distances = Array(graph.nodes.length).fill(Infinity);

  // Set the distance of the source node to 0
  distances[source] = 0;

  // Create a priority queue to store nodes based on their distances
  const priorityQueue = new PriorityQueue((a, b) => a[1] - b[1]);
  priorityQueue.enqueue([source, 0]);

  // Create an array to store the previous node for each node
  const previous = Array(graph.nodes.length).fill(-1);

  // Keep track of processed nodes
  const processed = new Set();

  // While there are still nodes in the priority queue
  while (priorityQueue.size() > 0) {
    // Dequeue the node with the lowest distance
    const [current, distance] = priorityQueue.dequeue();

    // If the target node has been processed, break the loop
    if (current === target) break;

    // If the current node has already been processed, skip to the next node
    if (processed.has(current)) continue;
    processed.add(current);

    // Update the distances of all unprocessed neighbors of the current node
    graph.links
      .filter((link) => link.source === current)
      .forEach((link) => {
        const neighbor = link.target;
        if (!processed.has(neighbor)) {
          const newDistance = distance + link.value;
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = current;
            priorityQueue.enqueue([neighbor, newDistance]);
          }
        }
      });
  }

  // Build the shortest path by following the previous node for each node
  const path = [];
  let node = target;
  while (node !== -1) {
    path.unshift(node);
    node = previous[node];
  }

  // Return the shortest path and the distances
  return { path, distances };
}

// Example usage
const graph = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  links: [
    { source: 0, target: 1, value: 5 },
    { source: 0, target: 2, value: 2 },
    { source: 1, target: 3, value: 3 },
    { source: 2, target: 3, value: 1 },
    { source: 3, target: 4, value: 3 },
    { source: 4, target: 5, value: 4 },
  ],
};
// const { path, distances } = dijkstra(graph, 0, 5);
// console.log(`Shortest path: ${path}`);
// console.log(`Distances: ${distances}`);

export const solution = (start, end, map) => {
  const allPaths = [];
  const path = [];
  const rec = (startNode, endNode, path) => {
    path.push(startNode);
    // console.log(startNode, endNode, path);
    if (startNode === endNode) {
      allPaths.push([...path]);
    } else {
      // console.log("map", map);
      // console.log("startNode", startNode);
      const nodePaths = map[startNode];
      // console.log("nodePaths of", startNode, 'get', nodePaths);
      for (let i = 0; i < nodePaths.length; i++) {
        const tryNode = nodePaths[i];
        // console.log("tryNode", tryNode);
        if (!path.includes(tryNode)) {
          rec(tryNode, endNode, path);
        }
      }
    }
    path.pop(startNode);
  };
  rec(start, end, path);
  return allPaths.reduce((p1, p2) => (p1.length < p2.length ? p1 : p2));
};
