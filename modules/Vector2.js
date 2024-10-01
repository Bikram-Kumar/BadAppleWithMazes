export class Vector2 {
    x;
    y;

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    static areEqual(vec1, vec2) {
        return ((vec1.x == vec2.x) && (vec1.y == vec2.y));
    }

    static getManhattanDist(vec1, vec2) {
        return (Math.abs(vec1.x-vec2.x) + Math.abs(vec1.y-vec2.y));
    }
}