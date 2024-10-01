export class ImageHandler {

    static ctx = undefined;


    static getImageData(image, size) {
        if (this.ctx == undefined) {
            this.ctx = document.createElement("canvas").getContext("2d");
        }

        this.ctx.canvas.width = size.x;
        this.ctx.canvas.height = size.y;

        this.ctx.drawImage(image, 0, 0, size.x, size.y);
        return (this.ctx.getImageData(0, 0, size.x, size.y));
        
    }
    

    
    static convolve (imageData, kernel, sumKernel) {
        var cdata = new ImageData(imageData.width, imageData.height);
        let sumR, sumG, sumB;

        for (let x = 1; x < imageData.width-1; x++) {
            for (let y = 1; y < imageData.height-1; y++) {
                sumR = 0; // cannot sum directly as ImageData.data is a clamping array
                sumG = 0;
                sumB = 0;

                for (let kx = 0; kx < 3; kx++) {
                    for (let ky = 0; ky < 3; ky++) {
                        sumR += kernel[(3 * ky) + kx] * imageData.data[4*((imageData.width * (y - ky + 1)) + (x - kx + 1))];
                        sumG += kernel[(3 * ky) + kx] * imageData.data[4*((imageData.width * (y - ky + 1)) + (x - kx + 1)) + 1];
                        sumB += kernel[(3 * ky) + kx] * imageData.data[4*((imageData.width * (y - ky + 1)) + (x - kx + 1)) + 2];
                    }
                }
                cdata.data[4*((imageData.width * (y)) + (x))] = sumR ;
                cdata.data[4*((imageData.width * (y)) + (x)) + 1] = sumG;
                cdata.data[4*((imageData.width * (y)) + (x)) + 2] = sumB;
                cdata.data[4*((imageData.width * (y)) + (x)) + 3] = 255;
                
            }
        }
        
        // filling in the border pixels 

        let last = cdata.data.length - 4;

        for (let i = 0; i < imageData.width; i++) {
            // top
            cdata.data[(4 * i)] = cdata.data[(4 * (imageData.width + i))];
            cdata.data[(4 * i) + 1] = cdata.data[(4 * (imageData.width + i)) + 1];
            cdata.data[(4 * i) + 2] = cdata.data[(4 * (imageData.width + i)) + 2];
            cdata.data[(4 * i) + 3] = 255;

            // bottom
            cdata.data[last - (4 * i)] = cdata.data[last - (4 * (imageData.width + i))];
            cdata.data[last - (4 * i) + 1] = cdata.data[last - (4 * (imageData.width + i)) + 1];
            cdata.data[last - (4 * i) + 2] = cdata.data[last - (4 * (imageData.width + i)) + 2];
            cdata.data[last - (4 * i) + 3] = 255;

            // left
            cdata.data[(4 * imageData.width * i)] = cdata.data[(4 * (imageData.width * i + 1))];
            cdata.data[(4 * imageData.width * i) + 1] = cdata.data[(4 * (imageData.width * i + 1)) + 1];
            cdata.data[(4 * imageData.width * i) + 2] = cdata.data[(4 * (imageData.width * i + 1)) + 2];
            cdata.data[(4 * imageData.width * i) + 3] = 255;

            // right
            cdata.data[last - (4 * imageData.width * i)] = cdata.data[last - (4 * (imageData.width * i + 1))];
            cdata.data[last - (4 * imageData.width * i) + 1] = cdata.data[last - (4 * (imageData.width * i + 1)) + 1];
            cdata.data[last - (4 * imageData.width * i) + 2] = cdata.data[last - (4 * (imageData.width * i + 1)) + 2];
            cdata.data[last - (4 * imageData.width * i) + 3] = 255;
        }

        return cdata;

    }


    static turnGrayscale(imageData) {
        var gdata = new ImageData(imageData.width, imageData.height);

        for (let i = 0; i < imageData.data.length; i+=4) {
            gdata.data[i] = 255 * this.linearToSrgb(
                (0.2126 * this.srgbToLinear(imageData.data[i] / 255)) +
                (0.7152 * this.srgbToLinear(imageData.data[i+1] / 255)) +
                (0.0722 * this.srgbToLinear(imageData.data[i+2] / 255))
            );

            gdata.data[i+1] = gdata.data[i];
            gdata.data[i+2] = gdata.data[i];
            gdata.data[i+3] = 255;
        }

        return gdata;

    }


    static invert(imageData) {
        var idata = new ImageData(imageData.width, imageData.height);

        for (let i = 0; i < imageData.data.length; i+=4) {
            idata.data[i] = 255 - imageData.data[i];
            idata.data[i+1] = 255 - imageData.data[i+1];
            idata.data[i+2] = 255 - imageData.data[i+2];
            
            idata.data[i+3] = 255;
        }
        
        return idata;

    }



    // turns image into 2bit black and white image and returns as `ImageData`
    static turn2Bit(imageData, threshold = 127) {
        var bdata = new ImageData(imageData.width, imageData.height);

        for (let i = 0; i < imageData.data.length; i+=4) {
            bdata.data[i] = (imageData.data[i] > threshold) ? 255 : 0;
            
            bdata.data[i+1] = bdata.data[i];
            bdata.data[i+2] = bdata.data[i];
            bdata.data[i+3] = 255;
        }
        
        return bdata;

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


    // channel in range 0-1
    static srgbToLinear(channel) {
        if (channel <= 0.04045) return (channel / 12.92);
        return Math.pow((channel + 0.055) / 1.055, 2.4);
    }
    


    
    
    // channel in range 0-1
    static linearToSrgb(channel) {
        if (channel <= 0.0031308) return (channel * 12.92);
        return ((1.055 * Math.pow(channel, 1/2.4)) - 0.055);
    }


}