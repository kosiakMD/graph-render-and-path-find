import { transGraphToNodesLinks, resultToLinks } from "./utils";
import { renderGraph, renderAllGraphs } from "./render";
import { solution } from "./styles/index";

const paths3 = {
  0: [1, 2],
  1: [0, 2, 3, 4],
  2: [0, 1, 4, 5],
  3: [1, 4, 6],
  4: [1, 2, 3, 5, 6, 7],
  5: [2, 4, 7],
  6: [3, 4, 7, 8],
  7: [4, 5, 6, 8],
  8: [6, 7],
}; // 0,2,5,7,8

const paths2 = {
  0: [1, 2],
  1: [2],
  2: [3, 4],
  3: [1],
  4: [],
}; // 0,2,3

const paths1 = {
  0: [1, 2],
  1: [3],
  2: [],
  3: [],
}; // 0,1,3

const handle = (start, end, map, solution, index) => {
  let links;
  if (solution && typeof solution === "function") {
    const result = solution(start, end, map);
    // console.log("result", result);
    links = resultToLinks(result);
  }
  // const links = [];
  // console.log("links", links);
  const nodeLinks = transGraphToNodesLinks(map, index);
  // console.log(JSON.stringify(nodeLinks));
  const highlightedLinks = links || [];
  return [nodeLinks[0], nodeLinks[1], highlightedLinks];
};

const renderOne = (...data) => {
  renderGraph("#svg", ...handle(...data));
};

const renderAll = (dataSet) => {
  const allData = dataSet.map((data, index) => handle(...data, index));

  // console.log('allData', allData);
  renderAllGraphs("#svg", allData);
};

// console.log("paths1", solution(0, 3, paths1)); // 0,1,3
// console.log("paths2", solution(0, 3, paths2)); // 0,2,3
// console.log("paths3", solution(0, 8, paths3)); // 0,2,5,7,8

// renderOne(0, 3, paths1, solution);
// renderOne(0, 3, paths2, solution);
renderOne(0, 8, paths3, solution);

// renderAll([
//   [0, 3, paths1, solution],
//   [0, 3, paths2, solution],
//   [0, 8, paths3, solution],
// ]);
