import {Vector2} from "./modules/Vector2.js"
import {MazeManager} from "./modules/MazeManager.js"
import { ImageHandler } from "./modules/ImageHandler.js";

window.onload = main;


function main() {

    initialize();


    var canvasDim = new Vector2(192, 192);
    var mazeDim = new Vector2(48, 48);
    
    var ctx = document.getElementById("cnvs").getContext("2d");
    ctx.canvas.width = canvasDim.x;
    ctx.canvas.height = canvasDim.y;
    
    var image = document.querySelector("img");
    
    ctx.drawImage(image, 0, 0, canvasDim.x, canvasDim.y);
    var imgData = ctx.getImageData(0, 0, canvasDim.x, canvasDim.y);
    
    
    var factor = canvasDim.x / mazeDim.x;
    
    var kernelGauss = [
        1/16,2/16,1/16,
        2/16,4/16,2/16,
        1/16,2/16,1/16
    ];
    var kernelRidge = [
        0,-1,0,
        -1,4,-1,
        0,-1,0
    ];
    
    
    // imgData = ImageHandler.turnGrayscale(imgData);
    // imgData = ImageHandler.convolve(imgData, kernelRidge);
    
    ctx.putImageData(imgData, 0, 0);
    
    var mask = ImageHandler.getImageMask(ImageHandler.getImageData(ctx.canvas, mazeDim), 5);
    // var mask = ImageHandler.getInvertedImageMask(ImageHandler.getImageData(ctx.canvas, mazeDim), 5);
    console.log(mask);
    
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
    
    
    
    var mazeManager = new MazeManager(mazeDim, mask);
    mazeManager.generate();
    var maze = mazeManager.maze;
    
    ctx.clearRect(0, 0, canvasDim.x, canvasDim.y);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(factor*maze[0].x, factor*maze[0].y);
    for (let i = 1; i < maze.length; i++) {
        
        ctx.lineTo(factor*maze[i].x, factor*maze[i].y);
        ctx.stroke();
    }

}










function initialize() {
    
    // adding a swap method to Array prototype for ease
    Array.prototype.swap = function(i, j) {
        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }


}













