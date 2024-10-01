export class ImageHandler {

    static ctx = undefined;


    static getImageData(image, size) {
        if (this.ctx == undefined) {
            this.ctx = document.createElement("canvas").getContext("2d", {willReadFrequently:true});
        }

        this.ctx.canvas.width = size.x;
        this.ctx.canvas.height = size.y;

        this.ctx.drawImage(image, 0, 0, size.x, size.y);
        return (this.ctx.getImageData(0, 0, size.x, size.y));
        
    }
    

    
    // returns an array of boolean values denoting if RED channel has value greater than threshold 
    static getImageMask(imageData, threshold = 127) {
       
        var mask = new Array(imageData.data.length / 4);
    
        for (let i = 0; i < mask.length; i++) {
            mask[i] = (imageData.data[4*i] > threshold);
        }

        return mask;
    
    }
    
    
    // returns an array of boolean values denoting if RED channel has value less than or equal to threshold 
    static getInvertedImageMask(imageData, threshold = 127) {
       
        var mask = new Array(imageData.data.length / 4);
    
        for (let i = 0; i < mask.length; i++) {
            mask[i] = (imageData.data[4*i] <= threshold);
        }

        return mask;
    
    }


}