let nodes = [];
let selectedNodeId = -1;
let nodesData = {};
let isDragging = false;
let fromNode = null;
let nodeNameToNode = {};
let renderingEdges = {};
let dijkstra = null;
let astar = null;
let currentState = "";
let font;
function preload() {
  nodesData = loadJSON("nodes.json");
  font = loadFont("Poppins-Regular.ttf");
}

function getNode(nodeName) {
  return nodeNameToNode[nodeName];
}

function setup() {
  createCanvas(1300, 700);
  for (let nodeName in nodesData) {
    const { x, y, neighbors } = nodesData[nodeName];
    let node = new Node(x, y, nodeName, neighbors);
    nodes.push(node);
    nodeNameToNode[nodeName] = node;
    renderingEdges[nodeName] = [];
    for (let { name: neighborName, edgeCost } of neighbors) {
      if (renderingEdges[neighborName] !== undefined) {
        continue;
      }
      renderingEdges[nodeName].push({ neighborName, edgeCost });
    }
  }
  document.getElementById("dijkstra").onclick = () => {
    if (currentState === "dijkstra") {
      currentState = "";
      document.getElementById("dijkstra").classList.remove("selected");
    } else {
      dijkstra = new Dijkstra();
      currentState = "dijkstra";
      document.getElementById("dijkstra").classList.add("selected");
      document.getElementById("a*").classList.remove("selected");
    }
    clearNodes();
  };
  document.getElementById("a*").onclick = () => {
    if (currentState === "a*") {
      currentState = "";
      document.getElementById("a*").classList.remove("selected");
    } else {
      astar = new Astar();
      currentState = "a*";
      document.getElementById("a*").classList.add("selected");
      document.getElementById("dijkstra").classList.remove("selected");
    }
    clearNodes();
  };
  document.getElementById("clear").onclick = () => {
    currentState = "";
    document.getElementById("dijkstra").classList.remove("selected");
    document.getElementById("a*").classList.remove("selected");
    clearNodes();
  };
  frameRate(60);
  textFont(font);
}

function draw() {
  background(255);
  drawEdges();
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (i == selectedNodeId) {
      node.show(true);
    } else {
      node.show();
    }
    node.onHover(mouseX, mouseY);
  }
  switch (currentState) {
    case "dijkstra": {
      if (dijkstra.isStartNodeSet) {
        dijkstra.render();
        dijkstra.update();
      } else {
        fill(0, 150);
        textSize(20);
        text("Select a start node to initiate the algorithm", 280, 30);
      }
      break;
    }
    case "a*": {
      astar.render();
      astar.update();
      break;
    }
    default: {
      fill(0, 150);
      textSize(20);
      text(
        "Click on one of the search algorithm to start the process.",
        280,
        30
      );
      break;
    }
  }
  drawHoveringNodes();
}

function clearNodes() {
  for (let node of nodes) {
    node.visited = false;
    node.cost = Infinity;
    node.gCost = Infinity;
    node.fCost = 0;
    node.parent = null;
  }
}

function drawEdges() {
  let opacity = currentState !== "" ? 50 : 255;
  for (let nodeName in renderingEdges) {
    let node = getNode(nodeName);
    for (let { neighborName, edgeCost } of renderingEdges[nodeName]) {
      let neighborNode = getNode(neighborName);
      stroke(0, opacity);
      strokeWeight(2);
      line(node.pos.x, node.pos.y, neighborNode.pos.x, neighborNode.pos.y);
      let dir = p5.Vector.sub(neighborNode.pos, node.pos);
      dir.mult(0.5);
      dir.add(node.pos);
      fill(255, 229, 37, opacity);
      noStroke();
      rect(dir.x, dir.y - 7, 20, 15);
      textSize(10);
      fill(0, opacity);
      text("" + edgeCost, dir.x + 3, dir.y + 5);
    }
  }
}

function drawHoveringNodes() {
  for (let node of nodes) {
    if (node.hovering) {
      drawCityName(node);
    }
  }
}

function drawCityName(node) {
  fill(255, 229, 37);
  noStroke();
  rect(node.pos.x - 50, node.pos.y - 15, 100, 30);
  fill(0);
  textSize(20);
  text(node.name, node.pos.x - 40, node.pos.y + 8);
}

function setNodeName(nodeName) {
  nodes[selectedNodeId].name = nodeName;
}

function keyPressed() {
  if (key === " ") {
    dijkstraSolve();
  }
}

function mouseReleased() {
  isDragging = false;
  if (fromNode !== null) {
    let targetNode = null;
    for (let node of nodes) {
      if (node.hovering) {
        targetNode = node;
      }
    }
    if (targetNode !== null) {
      graph[fromNode.name].push(targetNode);
    }
  }
  fromNode = null;
}

function getHoveringNode() {
  for (let node of nodes) {
    if (node.hovering) {
      return node;
    }
  }
  return null;
}

function mousePressed() {
  let hoveringNode = getHoveringNode();
  if (hoveringNode === null) {
    return;
  }
  if (currentState === "dijkstra") {
    if (!dijkstra.isStartNodeSet) {
      dijkstra.setStart(hoveringNode);
    } else if (dijkstra.foundPath) {
      dijkstra.setEnd(hoveringNode);
    }
  } else if (currentState === "a*") {
    if (astar.startNode === null) {
      astar.setStart(hoveringNode);
    } else if (astar.endNode === null) {
      astar.setEnd(hoveringNode);
    } else {
      astar.setEnd(hoveringNode);
    }
  }
}
