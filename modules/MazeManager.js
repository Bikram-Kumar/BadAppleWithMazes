import {Vector2} from "./Vector2.js";

export class MazeManager {

    dimension;  // Vector2
    mask;  // array of booleans indicating whether the nodes are traversable
    maze;
    

    constructor (dimension) {
        this.dimension = dimension;
    }

    set mask (newMask) {
        this.mask = newMask;
    }

    getFirstUnvisitedIndex(visited) {
        for (let i = 0; i < visited.length; i++) {
            if (this.mask[i] && !visited[i]) return i;
        }
        return null;
    }



    generate () {

        this.maze = [];
        var size = this.size;
        var visited = new Array(size);
        var index = this.getFirstUnvisitedIndex(visited);

        if (index == null) return null;

        var stack = [index], neigh, node, index_n, neigh_flag;

        while (true) {
            index = stack.pop();

            if (!visited[index]) {
                visited[index] = true;
            }

            node = this.indexToNode(index);

            this.maze.push(node);

            neigh = this.getNeighbors(node);

            MazeManager.randomizeNeighborsArray(neigh);
            neigh_flag = false;
            for (let n of neigh) {
                // console.log(n);
                if ((n != null)) {
                    index_n = this.getIndexOf(n);
                    if (visited[index_n]) continue;
                    stack.push(index);
                    stack.push(index_n);
                    neigh_flag = true;
                    break;
                }
            }

            if (!neigh_flag && stack.length == 0) {
                index = this.getFirstUnvisitedIndex(visited);
                if (index == null) return true;
                stack.push(index);
            }

        }

    }






    // returns `Vector2` node if (x,y) is in maze, else `null`
    maskPass(x, y) {
        if (this.mask[this.coordIndex(x,y)]) {
            return new Vector2(x, y);
        }
        return null;
    }
    
    
    getNeighbors(vec) {
        var arr = [null, null, null, null];
        if (vec.x > 0) {
            arr[0] = this.maskPass(vec.x-1, vec.y);
        }
        if (vec.y > 0) {
            arr[1] = this.maskPass(vec.x, vec.y-1);
        }
        if (vec.x < (this.dimension.x - 1)) {
            arr[2] = this.maskPass(vec.x+1, vec.y);
        }
        if (vec.y < (this.dimension.y - 1)) {
            arr[3] = this.maskPass(vec.x, vec.y+1);
        }
        return arr;
    }

    // randomize array by swapping random elements 2 times
    static randomizeNeighborsArray(arr) {
        var rands = [];
        for (let i = 0; i < 4; i++) {
            rands[i] = Math.floor(Math.random() * 4);
        }
        arr.swap(rands[0], rands[1]);
        arr.swap(rands[2], rands[3]);
    }


    // returns a unique index to assign to the node in graph
    getIndexOf(node) {

        return (node.x + (node.y * this.dimension.x));

    }
    
    // `getIndexOf(node)` equivalent for raw coordinates
    coordIndex(x, y) {

        return (x + (y * this.dimension.x));
    }



    // reverse of `getIndexOf(node)`
    indexToNode(index) {

        return new Vector2(index % this.dimension.x, Math.floor(index / this.dimension.x));

    }
    
    get size(){
        return (this.dimension.x * this.dimension.y);
    }

}