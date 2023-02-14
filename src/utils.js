export function transGraphToNodesLinks(graph, index) {
  let nodes = [];
  let links = [];

  for (let id in graph) {
    nodes.push({ id: String(id), ...(index ? { group: index } : null) });

    let connections = graph[id];
    connections.forEach((connection) => {
      links.push({
        source: String(id),
        target: String(connection),
      });
    });
  }

  return [nodes, links];
}

export const resultToLinks = (result) => {
  const links = [];
  result.reduce((x1, x2, index) => {
    links.push({
      source: String(x1),
      target: String(x2),
      // index: index - 1
    });
    return x2;
  });
  return links;
};
