/**
 * Project explanation: Vorlesung GDV 07.05.2024
 * Project task: Ray tracing 1
 * 
 * Explanation of the project, see rayEquation.ts
 * 
 * TODO: what would come in the Klausur?
 */

import Playground from "../../playground";
import { vecMultiplyScalar, vecDotProduct, Vec3 } from "../../_helper";

const pg = new Playground();

const sphere = {
    center: [0, -.15, -3],
    radius: 0.5
}
pg.visCamera(-1);
pg.gridXZ()

// TODO: change the o, coordinate see what happen!
// some unusual things might happen
const o = [0, 0, 0]
const co = o.map((val, i) => val - sphere.center[i])

const step = 1 / 50

for (let yCoord = -1; yCoord <= 1; yCoord +=  step) {

    for (let xCoord = -1; xCoord <= 1; xCoord +=  step) {

        const v: Vec3 = [xCoord, yCoord, -1]
        
        const ov = v.map((val, i) => val - o[i])

        pg.visVector(ov,{placeAt:o}) // ray

        const a = vecDotProduct(ov, ov)
        const b = vecDotProduct(co, ov) * 2
        const c = vecDotProduct(co, co) - Math.pow(sphere.radius, 2) // why it is squared like this? not rQuadrat?

        const discriminant = b * b - 4 * a * c

        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a)
        
        if (t1) { // all values are positive
            // if t2 is positive, then it means the point might not be shown on the screen
            const p = vecMultiplyScalar(t1, ov as Vec3)
            pg.visPoint(p,{color:"red"});
        } 

        if (t2) { // all values are positive
            // it means the point might be shown on the screen
            const p = vecMultiplyScalar(t2, ov as Vec3) 
            pg.visPoint(p,{color:"blue"});
        } 

    }
}