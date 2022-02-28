class MinHeap {
  constructor() {
    this.items = [];
    this.size = 0;
  }
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }
  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }
  getParentIndex(childIndex) {
    return floor((childIndex - 1) / 2);
  }
  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.size;
  }
  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.size;
  }
  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }
  leftChild(index) {
    return this.items[this.getLeftChildIndex(index)].cost;
  }
  rightChild(index) {
    return this.items[this.getRightChildIndex(index)].cost;
  }
  parent(index) {
    return this.items[this.getParentIndex(index)].cost;
  }
  swap(indexOne, indexTwo) {
    let temp = this.items[indexOne];
    this.items[indexOne] = this.items[indexTwo];
    this.items[indexTwo] = temp;
  }
  peek() {
    return this.items[0];
  }
  isEmpty() {
    return this.size === 0;
  }
  poll() {
    let item = this.items[0];
    this.items[0] = this.items[this.size - 1];
    this.size--;
    this.heapifyDown();
    return item;
  }

  add(item) {
    this.items[this.size] = item;
    this.size++;
    this.heapifyUp();
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.rightChild(index) < this.leftChild(index)
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.items[index].cost < this.items[smallerChildIndex].cost) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  heapifyUp() {
    let index = this.size - 1;
    while (this.hasParent(index) && this.parent(index) > this.items[index]) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }
}
