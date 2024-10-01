import { ImageHandler } from "./ImageHandler.js";
import { MazeManager } from "./MazeManager.js";

export class BadApplePlayer {
    ctx;
    vid;
    mazeManager;
    factor;
    
    constructor (ctx, vid, canvasDim, mazeDim) {
        this.ctx = ctx;
        this.vid = vid;
        this.mazeManager = new MazeManager(mazeDim);
        this.factor = canvasDim.x / mazeDim.x;
    }
    
    play () {
        console.log(this.vid);
        this.vid.volume = 0.1;
        this.vid.playbackRate = 1.0;
        this.vid.play();
        
        this.ctx.strokeStyle = "#00ff00";
        this.ctx.lineWidth = 1;

        var self = this;
        this.vid.addEventListener("play", () => {
            function step() {
                self.drawFrame();
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }
    
    drawFrame() {
        this.ctx.drawImage(this.vid, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.mazeManager.mask  = ImageHandler.getImageMask(ImageHandler.getImageData(this.ctx.canvas, this.mazeManager.dimension), 127);
        if (this.mazeManager.generate() === null) return;
        

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.beginPath();

        this.ctx.moveTo(this.factor*this.mazeManager.maze[0].x, this.factor*this.mazeManager.maze[0].y);

        for (let i = 1; i < this.mazeManager.maze.length; i++) {
            
            this.ctx.lineTo(this.factor*this.mazeManager.maze[i].x, this.factor*this.mazeManager.maze[i].y);
            this.ctx.stroke();
            
        }

    }



};