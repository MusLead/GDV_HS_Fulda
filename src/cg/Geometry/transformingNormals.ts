import { Vec3, Matrix3, Matrix4, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rotX, rotY, matrix4Invert, matrix4Transpose, vecSubtract, vecNormalize } from "../../_helper";
import Playground from "../../playground";



const pg = new Playground()
pg.gridXZ()

// Triangle and normal
const tri: Array<Vec3> = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 0, 1],
]

const normals: Array<Vec3> = [
    [0, 1, 0]
]


// Transformations
const t1: Matrix4 = [ // with a 3x3 identity matrix
    1, 0, 0, 0,
    0, 1, 0, 0,
    0.43, 0, 1, 0,
    0, 0.43, 0.67, 1,
]

const r1 = rotX(45);
const r2 = rotY(0);

const s1: Matrix3 = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]

// Combine
const rotations = matrix4Product(matrix3ToMatrix4(r1), matrix3ToMatrix4(r2));
const scales = matrix3ToMatrix4(s1);
const transform = matrix4Product(matrix4Product(t1, rotations), scales)


// Transform
const p0 = multVec3Matrix4(tri[0], transform).slice(0, 3) as Vec3;
const p1 = multVec3Matrix4(tri[1], transform).slice(0, 3) as Vec3;
const p2 = multVec3Matrix4(tri[2], transform).slice(0, 3) as Vec3;

// Multiply with transposed inverse matrix
const i = matrix4Transpose(matrix4Invert(transform));
const nt = multVec3Matrix4(normals[0], i).slice(0, 3) as Vec3;



// Visualize
pg.visPoint(p0, { color: "dodgerblue", label:"0" })
pg.visPoint(p1, { color: "dodgerblue", label:"1" })
pg.visPoint(p2, { color: "dodgerblue", label:"2" })

pg.visVector(vecSubtract(p0,p1),{color:"green", placeAt:p1, showCone:false})
pg.visVector(vecSubtract(p1,p2),{color:"green", placeAt:p2, showCone:false})
pg.visVector(vecSubtract(p0,p2),{color:"green", placeAt:p2, showCone:false})

const n = multVec3Matrix4(normals[0], transform).slice(0, 3) as Vec3;
pg.visVector(multVec3Matrix4(normals[0], transform),{color:"red"})


pg.visVector(vecNormalize(n) , {color:"red",placeAt:p0})
pg.visVector(vecNormalize(n) , {color:"red",placeAt:p1})
pg.visVector(vecNormalize(n) , {color:"red",placeAt:p2})

pg.visVector(vecNormalize(nt) , {color:"blue",placeAt:p0})
pg.visVector(vecNormalize(nt) , {color:"blue",placeAt:p1})
pg.visVector(vecNormalize(nt) , {color:"blue",placeAt:p2})