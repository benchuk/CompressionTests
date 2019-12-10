var Jimp = require('jimp');
//const newImageFileName = './new.bmp'
const newImageFileName = './new2.bmp'
//Jimp.read('./2.bmp')
Jimp.read('./clouds_800-600.jpg')
  .then(image => {
    // Do stuff with the image.
    const BOX_W = 10
    const BOX_H = 10
    const newImage = new Uint8Array(image.bitmap.data.length);
    var counter = 0
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        // x, y is the position of this pixel on the image
        // idx is the position start position of this rgba tuple in the bitmap Buffer
        // this is the image

       // console.log("idx: " + idx)
        if(idx == image.bitmap.data.length-4)
        {
            console.log("DONE: " + counter)
            const ni = new Jimp({ data: newImage, width: image.bitmap.width, height: image.bitmap.height }, (err, image) => {
                // this image is 1280 x 768, pixels are loaded from the given buffer.
              });
            ni.write(newImageFileName);
        }

        // if(y < BOX_H)
        // {
        //     console.log("at start: skip row: " + y)
        //     return
        // }
        // if(x < BOX_W)
        // {
        //     console.log("at start: skip col: " + y)
        //     return
        // }

        // if(y >= image.bitmap.height - BOX_H)
        // {
        //     console.log("at end: skip row: " + y)
        //     return
        // }
        // if(x >= image.bitmap.width - BOX_W)
        // {
        //     console.log("at start: skip col: " + y)
        //     return
        // }

        if(y % BOX_H != 0)
        {
            return
        }

        if(x % BOX_W != 0)
        {
            return
        }
        //console.log("working on row: " + y + " till row: " + y+BOX_H + " and col: " + x + "till x: " +x+BOX_W)
        counter++;
        BYTE_SIZE = 4
        ROW_SIZE = 4 * image.bitmap.width

        var red = 0
        var green = 0
        var blue = 0//= this.bitmap.data[idx + 2];
        var alpha = 0//= this.bitmap.data[idx + 3];
        for (i = 0; i < BOX_H; i++) {
            for (j = 0; j < BOX_W; j++) {
                red += this.bitmap.data[idx + 0 - BYTE_SIZE*j - ROW_SIZE*i]
                green += this.bitmap.data[idx + 1 - BYTE_SIZE*j - ROW_SIZE*i]
                blue += this.bitmap.data[idx + 2 - BYTE_SIZE*j - ROW_SIZE*i]
                alpha += this.bitmap.data[idx + 3 - BYTE_SIZE*j - ROW_SIZE*i]
            }
        }
        red = red / (BOX_H * BOX_W)
        green = green / (BOX_H * BOX_W)
        blue = blue / (BOX_H * BOX_W)
        alpha = alpha / (BOX_H * BOX_W)
        
        
        for (i = 0; i < BOX_H; i++) {
            for (j = 0; j < BOX_W; j++) {
                newImage[idx + 0 - BYTE_SIZE*j - ROW_SIZE*i] = red
                newImage[idx + 1 - BYTE_SIZE*j - ROW_SIZE*i] = green
                newImage[idx + 2 - BYTE_SIZE*j - ROW_SIZE*i] = blue
                newImage[idx + 3 - BYTE_SIZE*j - ROW_SIZE*i] = alpha
            }
        }
       
        // rgba values run from 0 - 255
        // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
      });

  })
  .catch(err => {
    // Handle an exception.
  });
