import { Vec3, vecSubtract, vecMultiplyScalar, vecAdd } from "../../_helper";
import Playground from "../../playground";


const pg = new Playground()
pg.gridXZ()

// Triangle
const tri: Array<Vec3> = [
    [.432, .13, .432],
    [1, .321, -.432],
    [1, .32, .54],
]

const p0 = tri[0]
const p1 = tri[1]
const p2 = tri[2]


const step = 0.03

for (let i = 0; i <= 1; i += step) {
    for (let j = 0; j <= 1-i; j += step) {

        const u = i
        const v = j
        const w = 1 - u - v

        const exp1 = vecMultiplyScalar(w, p0)
        const exp2 = vecMultiplyScalar(u, p1)
        const exp3 = vecMultiplyScalar(v, p2)


        const p = vecAdd(exp1, vecAdd(exp2, exp3))

        const r = Math.round(255 * w)
        const g = Math.round(255 * u)
        const b = Math.round(255 * v)

        pg.visPoint(p, { color: `rgb(${r},${g},${b})` })

    }
}


// Visualize
pg.visPoint(p0, { color: "rgb(255,0,0)", label: "0" })
pg.visPoint(p1, { color: "rgb(0,255,0)", label: "1" })
pg.visPoint(p2, { color: "rgb(0,0,255)", label: "2" })

pg.visVector(vecSubtract(p0, p1), { color: "lightgray", placeAt: p1, showCone: false })
pg.visVector(vecSubtract(p1, p2), { color: "lightgray", placeAt: p2, showCone: false })
pg.visVector(vecSubtract(p0, p2), { color: "lightgray", placeAt: p2, showCone: false })