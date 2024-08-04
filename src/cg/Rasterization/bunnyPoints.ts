import Playground from "../../playground";
import geo from '../../geo.usda?raw';
import { loadGeoFromUSDA } from "../../loader";
import { Matrix4, Vec3, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rotY } from "../../_helper";


const pg = new Playground();
pg.gridXZ();
const dist = -1
pg.visCamera(-1);

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
    
    // perspective divide !!IMPORTANT!!
    const projected:Vec3 = [
        dist * pTransformed[0] / pTransformed[2],
        dist * pTransformed[1] / pTransformed[2],
        dist
    ]

    pg.visPoint(pTransformed, { color: "blue" });
    pg.visPoint(projected, { color: "red" });
    
    
}