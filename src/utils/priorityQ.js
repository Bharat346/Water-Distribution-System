// MinPriorityQueue.js

class MinPriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    // Helper function to swap elements in the heap array
    swap(i, j) {
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
  
    // Helper function to get the parent index of a given index
    parent(index) {
      return Math.floor((index - 1) / 2);
    }
  
    // Helper function to get the left child index of a given index
    leftChild(index) {
      return 2 * index + 1;
    }
  
    // Helper function to get the right child index of a given index
    rightChild(index) {
      return 2 * index + 2;
    }
  
    // Function to enqueue an element with a given priority
    enqueue(element, priority) {
      const node = { element, priority };
      this.heap.push(node);
      this.bubbleUp();
    }
  
    // Function to bubble up the element to maintain min-heap property
    bubbleUp() {
      let index = this.heap.length - 1;
  
      while (index > 0) {
        let parentIndex = this.parent(index);
  
        if (this.heap[index].priority >= this.heap[parentIndex].priority) {
          break;
        }
  
        this.swap(index, parentIndex);
        index = parentIndex;
      }
    }
  
    // Function to dequeue the element with the highest priority (smallest priority value)
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
  
      const min = this.heap[0];
      const end = this.heap.pop();
  
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this.bubbleDown();
      }
  
      return min;
    }
  
    // Function to bubble down the element to maintain min-heap property
    bubbleDown() {
      let index = 0;
  
      while (true) {
        let leftIndex = this.leftChild(index);
        let rightIndex = this.rightChild(index);
        let smallest = index;
  
        if (
          leftIndex < this.heap.length &&
          this.heap[leftIndex].priority < this.heap[smallest].priority
        ) {
          smallest = leftIndex;
        }
  
        if (
          rightIndex < this.heap.length &&
          this.heap[rightIndex].priority < this.heap[smallest].priority
        ) {
          smallest = rightIndex;
        }
  
        if (smallest === index) {
          break;
        }
  
        this.swap(index, smallest);
        index = smallest;
      }
    }
  
    // Function to check if the priority queue is empty
    isEmpty() {
      return this.heap.length === 0;
    }
  }
  
  export default MinPriorityQueue;
  