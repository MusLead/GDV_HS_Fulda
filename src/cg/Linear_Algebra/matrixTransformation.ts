import Playground from "../../playground.ts";
import { multVecMatrix, matrixProduct } from '../../_helper.ts'

const pg = new Playground();

pg.gridXZ();

const vec1 = [.5, .2, .3];
const matrixA = [
    1, 2, 3,
    .4, .5, .6,
    .7, .8, .9
];
const matrixB = [
    .9, .8, .7,
    .6, .5, .4,
    .3, .2, .1
];
const matrixC = [
    1, .2, -3,
    -3, .5, -.6,
    .7, -.8, .9
];

const vec1MatrixA = multVecMatrix(vec1, matrixA);
const vec1MatrixAB = multVecMatrix(vec1MatrixA, matrixB);
const vec1MatrixABC_1 = multVecMatrix(vec1MatrixAB, matrixC).map((v) => parseFloat(v.toFixed(2)));

pg.visVector(vec1, { color: "blue", label: "V1"});
pg.visVector(vec1MatrixABC_1, { color: "green", label: "(((V1 * A) * B) * C)" });

const mulMatrixAB = matrixProduct(matrixA, matrixB);
const mulMatrixABC = matrixProduct(mulMatrixAB, matrixC);
const vec1MatrixABC_2 = multVecMatrix(vec1, mulMatrixABC).map((v) => parseFloat(v.toFixed(2)));


pg.visVector(vec1MatrixABC_2, { color: "red", labelCenter: "V1 * ((A * B) * C)" });
const isSameResult = vec1MatrixABC_1.every((v, i) => v === vec1MatrixABC_2[i]);
if(isSameResult){
    console.log("Both results are the same");
}
else{
    console.log(vec1MatrixABC_1 + " !== " + vec1MatrixABC_2);
}