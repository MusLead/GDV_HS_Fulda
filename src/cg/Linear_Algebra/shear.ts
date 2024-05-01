import Playground from "../../playground.ts";
import { multVecMatrix } from "../../_helper.ts";

const pg = new Playground();

pg.gridXZ();
const data = [
    [0, 0, 0], 
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
]

//TODO: write the formel for the shear matrix with .md (latex) or similar
// with matjax? https://www.mathjax.org
// TODO: check if evrythign is correct, because the matrix structure might be different from the formula
const shear = [
    1, 0, 0,
    0, 1, 0.75,
    0, 0, 1
]

// Apply the shear transformation to all data points
const shearedPoints = data.map(point => multVecMatrix(point, shear));

for (let p of shearedPoints) {
    pg.visPoint(p, { color: "purple", pscale:.05, label: `(${p[0]},${p[1]},${p[2]})` });
}

pg.visVector([shear[0], shear[1], shear[2]], { color: "red" });
pg.visVector([shear[3], shear[4], shear[5]], { color: "green" })
pg.visVector([shear[6], shear[7], shear[8]], { color: "blue" })