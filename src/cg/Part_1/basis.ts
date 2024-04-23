import Playground from "../../playground.ts";
import { multVecMatrix } from '../../_helper.ts'

const pg = new Playground();

pg.gridXZ();

const initialVec = [1, 2, 0.3];

const iHat = [1, 0, 0];
const jHat = [0, 1, 0];
const kHat = [0, 0, 1];

const vecAlongIHat = [initialVec[0] * iHat[0], initialVec[0] * iHat[1], initialVec[0] * iHat[2]];
const vecAlongJHat = [initialVec[1] * jHat[0], initialVec[1] * jHat[1], initialVec[1] * jHat[2]];
const vecAlongKHat = [initialVec[2] * kHat[0], initialVec[2] * kHat[1], initialVec[2] * kHat[2]];

pg.visVector(vecAlongIHat, { color: "blue", label: "Vx" });
pg.visVector(vecAlongJHat, { color: "green", label: "Vy" });
pg.visVector(vecAlongKHat, { color: "purple", label: "Vz" });


const result = vecAlongIHat.map((c, i) => c + vecAlongJHat[i] + vecAlongKHat[i]);

pg.visVector(result, { color: "red", label: "V" });

const multVecMatrixResult = multVecMatrix(initialVec, [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);

pg.visVector(multVecMatrixResult, { color: "orange", label: "V * I" });