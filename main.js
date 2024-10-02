import {Vector2} from "./modules/Vector2.js"
import {MazeManager} from "./modules/MazeManager.js"
import { ImageHandler } from "./modules/ImageHandler.js";
import { BadApplePlayer } from "./modules/BadApplePlayer.js";

window.onload = main;


function main() {

    initialize();

    // var canvasDim = new Vector2(480, 360); // 480x360
    var canvasDim = new Vector2(480, 360); // 480x360
    var factor = 4;
    var mazeDim = new Vector2(canvasDim.x/factor, canvasDim.y/factor);
    
    var ctx = document.getElementById("cnvs").getContext("2d", {willReadFrequently : true});
    ctx.canvas.width = canvasDim.x;
    ctx.canvas.height = canvasDim.y;
    
    var image = document.querySelector("img");
    
    ctx.drawImage(image, 0, 0, canvasDim.x, canvasDim.y);
    var imgData = ctx.getImageData(0, 0, canvasDim.x, canvasDim.y);
    
    
    
    ctx.putImageData(imgData, 0, 0);
    
    var mask = ImageHandler.getImageMask(ImageHandler.getImageData(ctx.canvas, mazeDim), 5);
    // var mask = ImageHandler.getInvertedImageMask(ImageHandler.getImageData(ctx.canvas, mazeDim), 5);
    // console.log(mask);
    
    for (let i = 0; i < mask.length; i++) {
        if (mask[i]) {
            ctx.fillStyle = "#ffffff";
        } else {
            ctx.fillStyle = "#000000";
        }
        let x = (i % mazeDim.x) * factor;
        let y = Math.floor(i / mazeDim.x) * factor;
        ctx.fillRect(x, y, factor, factor);
    }
    
    
    
    var mazeManager = new MazeManager(mazeDim);
    mazeManager.mask = mask;
    mazeManager.generate();
    var maze = mazeManager.maze;
    
    ctx.clearRect(0, 0, canvasDim.x, canvasDim.y);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = factor/2;
    var offset = ctx.lineWidth / 2;
    ctx.beginPath();
    ctx.moveTo(factor*maze[0].x, factor*maze[0].y);
    for (let i = 1; i < mazeManager.maze.length; i++) {
            
        if (Vector2.getManhattanDist(mazeManager.maze[i-1], mazeManager.maze[i]) > 1) {
    
            ctx.moveTo(factor*mazeManager.maze[i].x + offset, factor*mazeManager.maze[i].y + offset);
            continue;
        }
        ctx.lineTo(factor*mazeManager.maze[i].x + offset, factor*mazeManager.maze[i].y + offset);
        
    }
    ctx.stroke();



    ctx.canvas.addEventListener("click", () => {
        
        var vid = document.getElementById("bad-apple-vid");

        var player = new BadApplePlayer(ctx, vid, canvasDim, mazeDim);
        player.play();
    }, {once : true});

}









function initialize() {
    
    // adding a swap method to Array prototype for ease
    Array.prototype.swap = function(i, j) {
        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }


}













