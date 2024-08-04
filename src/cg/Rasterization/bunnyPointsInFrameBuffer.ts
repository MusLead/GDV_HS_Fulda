import geo from '../../geo.usda?raw';
import { loadGeoFromUSDA } from "../../loader";
import { Matrix4, Vec3, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rotY, screenToRasterspace } from "../../_helper";
import Framebuffer from '../../framebuffer';

const dist = -1

const width = 500;
const height = 500;
const fb = new Framebuffer( width, height);


const scale = 1.5
const translate: Matrix4 = [
    scale, 0, 0, 0,
    0, scale, 0, 0,
    0, 0, scale, 0,
    0, -1, -3, 1
]

const rotate = matrix3ToMatrix4(rotY(50))

const transform = matrix4Product(rotate, translate)

const data = loadGeoFromUSDA(geo) as Vec3[];

for (let p of data) {
    const pTransformed = multVec3Matrix4(p, transform);
    // perspective divide
    const projected:Vec3 = [
        dist * pTransformed[0] / pTransformed[2],
        dist * pTransformed[1] / pTransformed[2],
        dist
    ]

    //!!IMPORTANT!!
    const screenSpace = screenToRasterspace(projected, width,height) 
    fb.draw(screenSpace[0], screenSpace[1])
    
}

fb.update()