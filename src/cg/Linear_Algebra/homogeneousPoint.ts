import Playground from "../../playground.ts";
import { Vec3, Matrix3, Matrix4, matrix3ToMatrix4, matrix4Product, multVec3Matrix4 } from '../../_helper.ts'

const pg = new Playground();

pg.gridXZ();

const m3: Matrix3 = [
    0,0,0,
    1,0,0,
    0,1,0
]

const m4: Matrix4 = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    .75,0,0,1
]

const m3to4 = matrix3ToMatrix4(m3);
const m4prod = matrix4Product(m3to4, m4);
const v: Vec3 = [1,2,3];
const v4 = multVec3Matrix4(v, m4prod);

pg.visVector(v, { color: "blue", label: "V" });
pg.visVector(v4, { color: "green", label: "V4" });

