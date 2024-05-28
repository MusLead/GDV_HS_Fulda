import Playground from "../../playground.ts";
import { rotX, rotY, rotZ, multVecMatrix } from '../../_helper.ts'

//TODO: check if the rotation is correct!

const pg = new Playground();

pg.gridXZ();

const vec1 = [1, 0, 0];
pg.unitCircleXY();
pg.unitCircleXZ();

const rotateMatrixX = rotX(45);
const vec1RotX = multVecMatrix(vec1, rotateMatrixX);

pg.visVector(vec1, { color: "blue", label: "V1", showArrow: true});
pg.visVector(vec1RotX, { color: "green", label: "V1 RotX" });

const rotateMatrixY = rotY(45);
const vec1RotY = multVecMatrix(vec1, rotateMatrixY);

pg.visVector(vec1RotY, { color: "red", label: "V1 RotY" });

const rotateMatrixZ = rotZ(110);
const vec1RotZ = multVecMatrix(vec1, rotateMatrixZ);

pg.visVector(vec1RotZ, { color: "purple", label: "V1 RotZ" });