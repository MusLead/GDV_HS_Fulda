import Playground from "../../playground";
import { vecMultiplyScalar, vecDotProduct, Vec3 } from "../../_helper";
//TODO: check if evrythign is correct, because the formula might be complex to understand
// check again if t is correct!
// what would come in the Klausur?
const pg = new Playground();

const sphere = {
    center: [0, .5, -3],
    radius: 1.25
}
pg.visCamera(-1);
pg.gridXZ()

const o = [0, 0, 0]
const co = o.map((val, i) => val - sphere.center[i])

const step = 1 / 3

for (let yCoord = -1; yCoord <= 1; yCoord +=  step) {

    for (let xCoord = -1; xCoord <= 1; xCoord +=  step) {

        const v: Vec3 = [xCoord, yCoord, -1]
        
        const ov = v.map((val, i) => val - o[i])
                
        pg.visVector(ov)

        const a = vecDotProduct(ov, ov)
        const b = vecDotProduct(co, ov) * 2
        const c = vecDotProduct(co, co) - Math.pow(sphere.radius, 2) // why it is squared like this? not rQuadrat?

        const discriminant = b * b - 4 * a * c

        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a)
        
        if (t1) {
            pg.visPoint(vecMultiplyScalar(t1, v),{color:"red"});
        }

        if (t2) {
            pg.visPoint(vecMultiplyScalar(t2, v),{color:"blue"});
        }

    }
}