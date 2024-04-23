import Playground from "../playground.ts";

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

pg.visVector(multVecMatrixResult, { color: "yellow", label: "V * I" });

/**
 * Multiply a vector with a 3x3 matrix
 * @param v 3 Coordinates of a vector
 * @param m one dimensional array representing a 3x3 matrix with length 9
 * @returns the new vector
 */
function multVecMatrix(v: Array<number>, m: Array<number>){
    if(v.length !== 3 || m.length !== 9) throw new Error("Invalid input");
    return [
        v[0] * m[0] + v[1] * m[3] + v[2] * m[6],
        v[0] * m[1] + v[1] * m[4] + v[2] * m[7],
        v[0] * m[2] + v[1] * m[5] + v[2] * m[8]
    ]
    /*
    In the task above, we ended up using a matrix to transform our point. This matrix is called a transformation matrix.

    "Transformation" is just a word for function or formula - send data in, get an output.

    The transformation type is linear because: all lines remain lines, parallel lines remain parallel and the origin stays fixed in space.
    */
}