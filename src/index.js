import { transGraphToNodesLinks, resultToLinks } from "./utils";
import { render } from "./render";
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
  8: [6, 7]
}; // 0,2,5,7,8

const paths2 = {
  0: [1, 2],
  1: [0, 2, 4],
  2: [0, 1, 3, 4],
  3: [2],
  4: [1, 2]
}; // 0,2,3

const paths1 = {
  0: [1, 2],
  1: [3],
  2: [],
  3: []
}; // 0,1,3

const handle = (start, end, map, links) => {
  const nodeLinks = transGraphToNodesLinks(map);
  console.log(JSON.stringify(nodeLinks));

  const highlightedLinks = links || [];
  render("#svg", nodeLinks[0], nodeLinks[1], highlightedLinks);
};

// const result = solution(start, end, map);
// console.log("result", result);
const links = []; // = resultToLinks(result);
// console.log("links", links);

// handle(0, 3, paths1);
// handle(0, 3, paths2);
handle(0, 8, paths3, links);

// console.log("paths1", solution(0, 3, paths1)); // 0,1,3
// console.log("paths2", solution(0, 3, paths2)); // 0,2,3
// console.log(visual);
// console.log("paths3", solution(0, 8, paths3)); // 0,2,5,7,8
