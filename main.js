var Jimp = require('jimp');
//const newImageFileName = './new.bmp'
const newImageFileName = './comp.bmp'
//Jimp.read('./2.bmp')
//Jimp.read('./clouds_800-600.jpg')
Jimp.read('./_2.jpg').then(image => {
    // Do stuff with the image.
   

    const MAX_RED_DIFF = 30
    const MAX_GREEN_DIFF = 30
    const MAX_BLUE_DIFF = 30
    
    
    //currentLineShape.Color,this.bitmap.data,idx
    function isSameColor2(colorA, colorB)
    {
        var redA = colorA.red
        var greenA = colorA.green
        var blueA = colorA.blue

        var redB = colorB.red
        var greenB = colorB.green
        var blueB = colorB.blue

        // if(Math.abs(redA - redB) >= MAX_RED_DIFF && Math.abs(greenA - greenB) >= MAX_GREEN_DIFF && Math.abs(blueA - blueB) >= MAX_BLUE_DIFF) 
        // {   
        //     return false;
        // }

        if(Math.abs(redA - redB) >= MAX_RED_DIFF) 
        {   
            return false;
        }
        if(Math.abs(greenA - greenB) >= MAX_GREEN_DIFF) 
        {
            return false;
        }
        if(Math.abs(blueA - blueB) >= MAX_BLUE_DIFF) 
        {
            return false;
        }
        return true   
    }
    function isSameColor(color,data,idx) {
        var redA = data[idx+0]
        var greenA = data[idx+1]
        var blueA = data[idx+2]

        var redB = color.red
        var greenB = color.green
        var blueB = color.blue

        // if(Math.abs(redA - redB) >= MAX_RED_DIFF && Math.abs(greenA - greenB) >= MAX_GREEN_DIFF && Math.abs(blueA - blueB) >= MAX_BLUE_DIFF) 
        // {   
        //     return false;
        // }
        if(Math.abs(redA - redB) >= MAX_RED_DIFF) {
            return false;
        }
        if(Math.abs(greenA - greenB) >= MAX_GREEN_DIFF) {
            return false;
        }
        if(Math.abs(blueA - blueB) >= MAX_BLUE_DIFF) {
            return false;
        }
        return true
    }
    const newImage = new Uint8Array(image.bitmap.data.length);

    // shape->
    // { 
    //   UL: {x:0,y:0},
    //   BR: {x:0,y:0},
    //   Color:{red:0,gree:0,blue:0}
    // }
    // Template: { 'UL': {'x':0,'y':0}, 'BR': {'x':0,'y':0}, 'Color':{'red':0,'green':0,'blue':0} }
    var shapes = []
    var currentLineShape = undefined
    var skipOnce = false
    var skipUntil = -1
    function findShapeAbove(x,y,currentShape)
    {
        for (var i = 0; i < shapes.length; i++) {
            var s = shapes[i]
            if((s.BR.y === currentShape.BR.y-1) && (s.UL.x == currentShape.UL.x && (currentShape.BR.x == s.BR.x || currentShape.BR.x == s.BR.x-1) ))
            {
                return s;
            }
        }
        return undefined
    }
   
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        // x, y is the position of this pixel on the image
        // idx is the position start position of this rgba tuple in the bitmap Buffer
        // this is the image

        if(x === image.bitmap.width-1 && y === image.bitmap.height-1)
        {
            console.log("DONE - found " + shapes.length + " shapes")
            const ni = new Jimp({ data: newImage, width: image.bitmap.width, height: image.bitmap.height }, (err, image) => {
                // this image is 1280 x 768, pixels are loaded from the given buffer.
              });
            ni.write(newImageFileName);
            return 
        }

        // if(x < skipUntil)
        // {
        //     //console.log("skipUntil")
        //     newImage[idx + 0] = currentLineShape.Color.red//this.bitmap.data[idx - 4 + 0]
        //     newImage[idx + 1] = currentLineShape.Color.green//this.bitmap.data[idx - 4 + 1]
        //     newImage[idx + 2] = currentLineShape.Color.blue//this.bitmap.data[idx - 4 + 2]
        //     newImage[idx + 3] = currentLineShape.Color.a//this.bitmap.data[idx - 4 + 3]
        //     return
        // }
        // if(skipUntil == x)
        // {
        //     skipUntil = -1
        //     //shapes.push(currentLineShape)// no need to push - we are after a merge of shapes
        //     currentLineShape = { 'UL': {'x':x,'y':y}, 'BR': {'x':x,'y':y}, 'Color':{'red':this.bitmap.data[idx + 0],'green':this.bitmap.data[idx + 1],'blue':this.bitmap.data[idx + 2],'a':this.bitmap.data[idx + 3]} }
        // }
        //console.log("Current: x: " + x + " y: " + y + " shapes count: " + shapes.length)
        // if(skipOnce)
        // {
        //     skipOnce = false
        //     currentLineShape = { 'UL': {'x':x,'y':y}, 'BR': {'x':x,'y':y}, 'Color':{'red':this.bitmap.data[idx + 0],'green':this.bitmap.data[idx + 1],'blue':this.bitmap.data[idx + 2],'a':this.bitmap.data[idx + 3]} }
        //     return //this happens after a merge with a shape that is bigger by one than the current row shape
        // }
        //this.bitmap.data[idx + 0 - BYTE_SIZE*j - ROW_SIZE*i]
       if(x === 0 || currentLineShape === undefined)//newLine
       {
            newImage[idx + 0] = this.bitmap.data[idx + 0]
            newImage[idx + 1] = this.bitmap.data[idx + 1]
            newImage[idx + 2] = this.bitmap.data[idx + 2]
            newImage[idx + 3] = this.bitmap.data[idx + 3]
            currentLineShape = { 'UL': {'x':x,'y':y}, 'BR': {'x':x,'y':y}, 'Color':{'red':this.bitmap.data[idx + 0],'green':this.bitmap.data[idx + 1],'blue':this.bitmap.data[idx + 2],'a':this.bitmap.data[idx + 3]} }
            return
       }
    //    newImage[idx + 0] = this.bitmap.data[idx + 0]
    //    newImage[idx + 1] = this.bitmap.data[idx + 1]
    //    newImage[idx + 2] = this.bitmap.data[idx + 2]
    //    newImage[idx + 3] = this.bitmap.data[idx + 3]
        if(x>=1)
        {
            if(isSameColor(currentLineShape.Color, this.bitmap.data,idx))//check if left same color
            {
                currentLineShape.BR.x = x
                newImage[idx + 0] = currentLineShape.Color.red//this.bitmap.data[idx - 4 + 0]
                newImage[idx + 1] = currentLineShape.Color.green//this.bitmap.data[idx - 4 + 1]
                newImage[idx + 2] = currentLineShape.Color.blue//this.bitmap.data[idx - 4 + 2]
                newImage[idx + 3] = currentLineShape.Color.a//this.bitmap.data[idx - 4 + 3]
                return
            }
            else{//shape on this row is ended
                //try merge this row with the shape in the row above.
                newImage[idx + 0] = this.bitmap.data[idx + 0]
                newImage[idx + 1] = this.bitmap.data[idx + 1]
                newImage[idx + 2] = this.bitmap.data[idx + 2]
                newImage[idx + 3] = this.bitmap.data[idx + 3]
                if(y==0)
                {
                    //first row - cannot merge - add row to shapes
                    shapes.push(currentLineShape)
                    //start new row shape
                    currentLineShape = { 'UL': {'x':x,'y':y}, 'BR': {'x':x,'y':y}, 'Color':{'red':this.bitmap.data[idx + 0],'green':this.bitmap.data[idx + 1],'blue':this.bitmap.data[idx + 2],'a':this.bitmap.data[idx + 3]} }
                    return
                }
                var s = findShapeAbove(x,y,currentLineShape)
                if(s!==undefined)
                {
                    if(/*(currentLineShape.BR.x === (s.BR.x - 1) || currentLineShape.BR.x === s.BR.x) && */isSameColor2(s.Color,currentLineShape.Color))
                    {
                        console.log("merge num of shapes: " + shapes.length)
                        // if(currentLineShape.BR.x === (s.BR.x - 1))//if expending the color by one pixel to create a rectangle
                        // {
                        //     console.log("merge++")
                        //     newImage[idx + 0] = currentLineShape.Color.red
                        //     newImage[idx + 1] = currentLineShape.Color.green
                        //     newImage[idx + 2] = currentLineShape.Color.blue
                        //     newImage[idx + 3] = currentLineShape.Color.a//
                        // }
                        //temp
                        
                        //end temp
                        //merge with upper shape
                        //s.BR.x = x//Math.max(currentLineShape.BR.x,x/*same as s.BR.x*/)
                        s.BR.x = Math.max(s.BR.x,currentLineShape.BR.x)
                        s.BR.y = y
                        //skipUntil = s.BR.x
                        //currentLineShape = s

                        newImage[idx + 0] = currentLineShape.Color.red
                        newImage[idx + 1] = currentLineShape.Color.green
                        newImage[idx + 2] = currentLineShape.Color.blue
                        newImage[idx + 3] = currentLineShape.Color.a//
                        currentLineShape = undefined
                        return
                    }
                }
                shapes.push(currentLineShape)
                currentLineShape = { 'UL': {'x':x,'y':y}, 'BR': {'x':x,'y':y}, 'Color':{'red':this.bitmap.data[idx + 0],'green':this.bitmap.data[idx + 1],'blue':this.bitmap.data[idx + 2],'a':this.bitmap.data[idx + 3]} }
                return
            }

        }
        else{ //first pixel in the row - copy color
            newImage[idx + 0] = this.bitmap.data[idx + 0]
            newImage[idx + 1] = this.bitmap.data[idx + 1]
            newImage[idx + 2] = this.bitmap.data[idx + 2]
            newImage[idx + 3] = this.bitmap.data[idx + 3]
            return
        }
      
        // if(x === image.bitmap.width-1 && y === image.bitmap.height-1)
        // {
        //     console.log("DONE - found " + shapes.length + " shapes")
        //     const ni = new Jimp({ data: newImage, width: image.bitmap.width, height: image.bitmap.height }, (err, image) => {
        //         // this image is 1280 x 768, pixels are loaded from the given buffer.
        //       });
        //     ni.write(newImageFileName);
        //     return 
        // }
      
  
      });

  })
  .catch(err => {
    // Handle an exception.
  });

//   function isSameColor(data, colorAOffset, colorBOffset) {
//     var redA = data[colorAOffset+0]
//     var greenA = data[colorAOffset+1]
//     var blueA = data[colorAOffset+2]

//     var redB = data[colorBOffset+0]
//     var greenB = data[colorBOffset+1]
//     var blueB = data[colorBOffset+2]

//     if(Math.abs(redA - redB) > MAX_RED_DIFF) return false;
//     if(Math.abs(greeA - greenB) > MAX_GREEN_DIFF) return false;
//     if(Math.abs(blueA - blueB) > MAX_BLUE_DIFF) return false;

//     return true
// }
