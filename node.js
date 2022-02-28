class Node {
  constructor(x, y, name, neighbors) {
    this.pos = createVector(x, y);
    this.name = name;
    this.r = 10;
    this.hovering = false;
    this.neighbors = neighbors;
    this.cost = Infinity;
    this.visited = false;
    this.parent = null;
    this.gCost = Infinity;
    this.fCost = 0;
  }
  canSelect(mx, my) {
    let d = dist(this.pos.x, this.pos.y, mx, my);
    return d < this.r;
  }
  onHover(mx, my) {
    if (this.canSelect(mx, my)) {
      this.hovering = true;
    } else {
      this.hovering = false;
    }
  }
  show() {
    if (currentState !== "" && dijkstra !== null && !this.visited) {
      fill(0, 75);
    } else {
      fill(0);
    }
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
  renderCurrent() {
    noStroke();
    fill(0, 150);
    ellipse(this.pos.x, this.pos.y, this.r * 4);
    fill(0, 100);
    ellipse(this.pos.x, this.pos.y, this.r * 3);
    fill(255, 229, 37);
    ellipse(this.pos.x, this.pos.y, this.r * 0.5);
  }
}
