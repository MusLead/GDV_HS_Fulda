import { determinantFromPoints } from "../../_helper";
import Framebuffer from "../../framebuffer";

const width = 512;
const height = 512;
const fb = new Framebuffer(width, height);

// a triangle
const a = [20, 350]
const b = [250, 20]
const c = [400, 400]

// the area of the parallelogram form by two edges ab and ac
const detFace = determinantFromPoints(a, b, c);

// the area of the triangle is half of the parallelogram
const divByFaceArea = 1 / (detFace * 0.5)


for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        const p = [x, y]
        
        // Winding order: clockwise (a,b,c)
        // the area of the triangle formed by the point and two edges i.e ab and ap
        // that is the determinant of the parallelogram formed by the two edges
        const detEdge1 = determinantFromPoints(a, b, p)
        const detEdge2 = determinantFromPoints(b, c, p)
        const detEdge3 = determinantFromPoints(c, a, p)
        
        // check if point is inside triangle if all determinants are positive
        if (detEdge1 >= 0 && detEdge2 >= 0 && detEdge3 >= 0) {
            // determinants are divided by 2 to get the area of the triangle 
            // and divided by the area of the face to get 
            // the barycentric coordinates (weights)
            const w1 = (detEdge1 * 0.5) * divByFaceArea
            const w2 = (detEdge2 * 0.5) * divByFaceArea
            const w3 = 1 - w1 - w2

            fb.draw(p[0], p[1], [w1 * 255 , w2 * 255, w3 * 255])

        }
    }
}

fb.update()