class Player {
    constructor(x, y,size, color) {
        this.size = size;
        this.y = y
        this.x = x      
        this.color = color
    }

    display() {

        push();
        noStroke();
        fill(this.color)
        square(this.x, this.y, this.size)
        pop();
    }
};