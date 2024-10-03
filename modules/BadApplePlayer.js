import { ImageHandler } from "./ImageHandler.js";
import { MazeManager } from "./MazeManager.js";
import { Vector2 } from "./Vector2.js";

export class BadApplePlayer {
    ctx;
    vid;
    mazeManager;
    factor;
    offset; // factor / 2
    link;
    frameCount;
    buffer = [];
    threshold;
    
    constructor (ctx, vid, canvasDim, mazeDim) {
        this.ctx = ctx;
        this.vid = vid;
        this.mazeManager = new MazeManager(mazeDim);
        this.factor = canvasDim.x / mazeDim.x;
        this.offset = this.factor / 2;
        this.link = document.createElement('a');
        this.frameCount = 0;
    }
    
    play () {

        this.vid.volume = 0.1;
        this.vid.playbackRate = 1.0;
        
        this.ctx.fillStyle = "#000000";
        this.ctx.strokeStyle = "#00ff00";
        this.ctx.lineWidth = this.factor / 2;
        
        var self = this;
        
        
        this.vid.addEventListener("play", () => {
            function step() {
                self.drawFrame();
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
        
        
        
        // this.vid.addEventListener("ended", () => {
            //     self.downloadBlob();
            // });
            
            
            
        self.vid.play();
            
    }
        
    drawFrame() {

        // vary thresholds for including different effects
        if (this.vid.currentTime < 90) {
            this.threshold = 32;
        } else if (this.vid.currentTime < 140) {
            this.threshold = 100;
        } else if (this.vid.currentTime < 145) {
            this.threshold = 4;
        } else {
            this.threshold = 32;
        }

        this.ctx.drawImage(this.vid, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.mazeManager.mask  = ImageHandler.getImageMask(ImageHandler.getImageData(this.ctx.canvas, this.mazeManager.dimension), this.threshold);
        if (this.mazeManager.generate() === null) return;
        

        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.beginPath();

        this.ctx.moveTo(this.factor*this.mazeManager.maze[0].x + this.offset, this.factor*this.mazeManager.maze[0].y + this.offset);
        
        for (let i = 1; i < this.mazeManager.maze.length; i++) {
            
            if (Vector2.getManhattanDist(this.mazeManager.maze[i-1], this.mazeManager.maze[i]) > 1) {
        
                this.ctx.moveTo(this.factor*this.mazeManager.maze[i].x + this.offset, this.factor*this.mazeManager.maze[i].y + this.offset);
                continue;
            }
            this.ctx.lineTo(this.factor*this.mazeManager.maze[i].x + this.offset, this.factor*this.mazeManager.maze[i].y + this.offset);
            
        }
        this.ctx.stroke();
        // this.pushFrame();

    }


    // pushes encoded base64 image in buffer
    pushFrame() {
        this.buffer.push(this.ctx.canvas.toDataURL());        
    }


    // downloads all frames as base64 encoded text 
    downloadBlob() {
        var blob = new Blob(this.buffer, {type: "text/text"});
        var url = URL.createObjectURL(blob);
        this.link.download = "BadAppleMazesFrames.txt";
        this.link.href = url;
        this.link.click();
    }

    // downloads each frame as png
    // download() {
    //     this.link.download = this.frameCount + '.png';
    //     this.link.href = this.ctx.canvas.toDataURL();
    //     this.link.click();
    //     this.frameCount++;
    // }



};