const graph = {
  math: {
    arithmetic: [],
    algebra: ['arithmetic'],
    calculus: ['algebra']
  },
  coding: {
    variables: [],
    functions: ['variables'],
    async: ['functions']
  },
  debate: {
    claim: [],
    evidence: ['claim'],
    rebuttal: ['evidence']
  }
};

function getTrack(sessionType) {
  return graph[sessionType] || graph.coding;
}

module.exports = { graph, getTrack };
