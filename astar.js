function heuristic(a, b) {
  if (b.name === "Bucharest") {
    switch (a.name) {
      case "Arad":
        return 366;
      case "Bucharest":
        return 0;
      case "Craiova":
        return 160;
      case "Drobeta":
        return 242;
      case "Eforie":
        return 161;
      case "Fagaras":
        return 193;
      case "Giurgiu":
        return 77;
      case "Hirsova":
        return 151;
      case "Iasi":
        return 226;
      case "Lugoj":
        return 244;
      case "Mehadia":
        return 241;
      case "Neamt":
        return 234;
      case "Oradea":
        return 380;
      case "Pitesti":
        return 100;
      case "Rimnicu Vilcea":
        return 176;
      case "Sibiu":
        return 253;
      case "Timisoara":
        return 329;
      case "Urziceni":
        return 80;
      case "Vaslui":
        return 199;
      case "Zerind":
        return 374;
    }
  }
  return dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
}

class Astar {
  constructor() {
    this.pq = new MinHeap();
    this.currentNode = null;
    this.foundPath = false;
    this.startNode = null;
    this.endNode = null;
  }
  setStart(node) {
    this.startNode = node;
  }
  setEnd(node) {
    this.endNode = node;
    clearNodes();
    this.startNode.fCost = 0;
    this.startNode.gCost = 0;
    this.startNode.cost = this.startNode.gCostx;
    this.pq = new MinHeap();
    this.pq.add(this.startNode);
    this.foundPath = false;
  }
  update() {
    if (
      this.startNode !== null &&
      this.endNode !== null &&
      frameCount % 5 === 0
    ) {
      if (!this.pq.isEmpty() && !this.foundPath) {
        this.currentNode = this.pq.poll();
        if (this.currentNode.name === this.endNode.name) {
          this.foundPath = true;
          return;
        }
        this.currentNode.visited = true;
        for (let neighbor of this.currentNode.neighbors) {
          let neighborNode = getNode(neighbor.name);
          if (!neighborNode.visited) {
            let newGCost = this.currentNode.gCost + neighbor.edgeCost;
            if (newGCost < neighborNode.gCost) {
              neighborNode.parent = this.currentNode;
              neighborNode.gCost = newGCost;
            }
            neighborNode.cost =
              neighborNode.gCost + heuristic(neighborNode, this.endNode);
            neighborNode.fCost = this.currentNode.fCost + neighbor.edgeCost;
            this.pq.add(neighborNode);
          }
        }
      } else {
        this.foundPath = true;
        this.currentNode = null;
      }
    }
  }
  render() {
    let path = [];
    if (this.foundPath) {
      let temp = this.endNode;
      let cityNames = [];
      while (temp !== null) {
        path.push(temp);
        cityNames.push(temp.name);
        temp = temp.parent;
      }
      cityNames = cityNames.reverse();
      fill(0, 150);
      textSize(20);
      text(
        `Path from ${this.startNode.name} to ${
          this.endNode !== null ? this.endNode.name : ""
        }`,
        260,
        30
      );
      text(`Path: ${cityNames.join("->")}`, 260, 50);
      text(`Path Cost: ${this.endNode.fCost}`, 260, 70);
    } else {
      path = nodes;
      fill(0, 150);
      textSize(20);
      if (this.startNode === null) {
        text("Set start city", 280, 30);
      } else if (this.endNode === null) {
        text("Set end city", 280, 30);
      } else {
        text("Calculating Paths........", 280, 30);
      }
    }
    for (let node of path) {
      if (node.parent !== null) {
        let parent = node.parent;
        let dir = p5.Vector.sub(parent.pos, node.pos);
        dir.mult(0.5);
        dir.add(node.pos);
        stroke(255, 229, 37);
        strokeWeight(4);
        line(node.pos.x, node.pos.y, parent.pos.x, parent.pos.y);
        fill(0);
        noStroke();
        rect(dir.x, dir.y - 7, 30, 20);
        textSize(13);
        fill(255);
        text("" + node.fCost, dir.x + 3, dir.y + 5);
      }
    }
    if (this.currentNode !== null) {
      this.currentNode.renderCurrent();
    }
    if (this.startNode !== null) {
      drawCityName(this.startNode);
    }
    if (this.endNode !== null) {
      drawCityName(this.endNode);
    }
  }
}
