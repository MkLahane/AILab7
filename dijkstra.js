class Dijkstra {
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
    this.pq = new MinHeap();
    this.startNode.cost = 0;
    this.pq.add(this.startNode);
    this.foundPath = false;
  }
  update() {
    if (
      this.startNode !== null &&
      this.endNode !== null &&
      frameCount % 20 === 0
    ) {
      if (!this.pq.isEmpty()) {
        this.currentNode = this.pq.poll();
        if (this.currentNode.name === this.endNode.name) {
          this.foundPath = true;
          return;
        }
        this.currentNode.visited = true;
        for (let neighbor of this.currentNode.neighbors) {
          let neighborNode = getNode(neighbor.name);
          if (!neighborNode.visited) {
            let newNeighborCost = this.currentNode.cost + neighbor.edgeCost;
            if (newNeighborCost < neighborNode.cost) {
              neighborNode.cost = newNeighborCost;
              neighborNode.parent = this.currentNode;
            }
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
          this.endNode !== null ? this.endNode.name : "(Click to set end node)"
        }`,
        260,
        30
      );
      if (this.endNode !== null) {
        text(`Path: ${cityNames.join("->")}`, 260, 50);
        text(`Path Cost: ${this.endNode.cost}`, 260, 70);
      }
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
        text("" + node.cost, dir.x + 3, dir.y + 5);
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
