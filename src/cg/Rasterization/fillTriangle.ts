import {drawLineBresenham, determinantFromPoints } from "../../_helper";
import Framebuffer from "../../framebuffer";

/**
 * TODO: TRY TO LEARN WINDING ORDER CONCEPTS
 * 
 */


const width = 512;
const height = 512;
const fb = new Framebuffer(width, height);

// a triangle, switch a and c to view from back (backface culling)
// The coordinates below is in raster space! does not need `dist` or perspective divide
const a = [20, 350]
const b = [250, 20]
const c = [400, 400]

drawLineBresenham(a, b, fb)
drawLineBresenham(b, c, fb)
drawLineBresenham(c, a, fb)


for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        const p = [x, y]
        // check if point is inside triangle using barycentric coordinates
        // and determinant of edges. If all determinants are positive, the point is inside
        const detEdge1 = determinantFromPoints(a, b, p)
        const detEdge2 = determinantFromPoints(b, c, p)
        const detEdge3 = determinantFromPoints(c, a, p)
        if (detEdge1 >= 0 && detEdge2 >= 0 && detEdge3 >= 0) {
            fb.draw(p[0], p[1], [80, 80, 80])
        }
    }
}

fb.update()