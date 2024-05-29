import Framebuffer from "../../framebuffer.ts";
import { ndcToScreenVec, rasterToNDC } from '../../_helper.ts'

const width = 100;
const height = 100;
const x = 50;
const y = 50;

const framebuffer = new Framebuffer(width, height);


for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
        framebuffer.draw(i, j, [255, 0, 0]); 
    }
}    

// Draw a green pixel at the center
// and change the coordinate raster space to screen space
framebuffer.draw(x, y, [0, 255, 0]); 
const vecScreen = ndcToScreenVec(rasterToNDC(x, y, width, height, -1)).map(value => value.toFixed(2));
framebuffer.log("Screen Space: " + vecScreen.toString());

framebuffer.update();


