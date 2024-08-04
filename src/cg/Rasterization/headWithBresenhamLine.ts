import { Matrix4, Vec3, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rotX, rotY, drawLineBresenham } from "../../_helper";
import Framebuffer from "../../framebuffer";
import objRaw from '../../head.obj?raw';
import { loadGeoFromOBJ } from "../../loader";


const {vertices, faces} = loadGeoFromOBJ(objRaw);


function screenToRasterspace(v: Vec3, width: number, height: number) {
    // to NDC
    const ndcX = (v[0] + 1) / 2
    const ndcY = (1 - v[1]) / 2

    // to raster
    const rasterX = ndcX * width;
    const rasterY = ndcY * height;
    return [
        Math.round(rasterX), Math.round(rasterY)]

}

const dist = -1

const width = 512;
const height = 512;
const fb = new Framebuffer(width, height);


const scale = 3
const translate: Matrix4 = [
    scale, 0, 0, 0,
    0, scale, 0, 0,
    0, 0, scale, 0,
    0, -.3, -4, 1
]

function perspectiveDivide(p: Vec3, dist: number): Vec3 {
    return [
        dist * p[0] / p[2],
        dist * p[1] / p[2],
        dist
    ]
}

let currentFrame = 0

for (let i = 0; i <= 1; i += .01) {
    fb.clear()

    const rotate1 = matrix3ToMatrix4(rotX(90))
    const rotate2 = matrix3ToMatrix4(rotY(360 * i))
    const rotations = matrix4Product(rotate1, rotate2);
    const transform = matrix4Product(rotations, translate)



    const fvProjected = []
    for (let f of faces) {
        
        const fv = [
            vertices[Number(f[0][0]) - 1],
            vertices[Number(f[1][0]) - 1],
            vertices[Number(f[2][0]) - 1],
        ]
        console.log(fv)
        
        fvProjected.length = 0;

        for (let v of fv) {
            // apply transformation perspectiveDivide toRaster
            const vp = screenToRasterspace(
                perspectiveDivide(
                    multVec3Matrix4(v.map(Number) as Vec3, transform).slice(0, 3) as Vec3,
                    dist
                ), width, height
            )

            fvProjected.push(vp);

        }
        
        drawLineBresenham(fvProjected[0], fvProjected[1], fb);
        drawLineBresenham(fvProjected[1], fvProjected[2], fb);
        drawLineBresenham(fvProjected[2], fvProjected[0], fb);

    }

    fb.update();
    fb.save("frame." + ++currentFrame)
}