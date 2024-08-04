import { Matrix4, Vec3, matrix3ToMatrix4, matrix4Invert, matrix4Product, matrix4Transpose, multVec3Matrix4, rotX, rotY, rotZ, vecAdd, vecCrossProduct, vecDotProduct, vecMultiplyScalar, vecNormalize, vecSubtract, screenToRasterspace, bbox, determinantFromPoints } from "../../_helper";
import Framebuffer from "../../framebuffer";
import objRaw from '../../head.obj?raw';
import { loadGeoFromOBJ } from "../../loader";

/**
 * sum the normals of all faces that use the vertex and then normalize the result. 
 * @param faces 
 * @param vertices 
 * @param faceNormals 
 */
function generateFaceNormals(faces: number[][][], vertices: Vec3[], faceNormals: Vec3[]) {

    for (let faceIndex = 0; faceIndex < faces.length; faceIndex++) {
        const faceData = faces[faceIndex];

        const vertexIndexA = faceData[0][0] - 1;
        const vertexIndexB = faceData[1][0] - 1;
        const vertexIndexC = faceData[2][0] - 1;

        // calculate face normal
        const edge1 = vecSubtract(vertices[vertexIndexB], vertices[vertexIndexA])
        const edge2 = vecSubtract(vertices[vertexIndexC], vertices[vertexIndexA])
        const faceNormal = vecNormalize(vecCrossProduct(edge1, edge2) as Vec3)

        // collect face normals
        faceNormals.push(faceNormal)
    }
}

/**
 * we need a list for each vertex that contains the indices of the faces using that vertex.
 * @param faces 
 * @param vertexToFaceMapping 
 */
function generateVertexToFaceMapping(faces: number[][][], vertexToFaceMapping: number[][]) {
    for (let faceIndex = 0; faceIndex < faces.length; faceIndex++) {

        const faceData = faces[faceIndex];

        for (let faceDataIndex = 0; faceDataIndex < faceData.length; faceDataIndex++) {
            const element = faceData[faceDataIndex];
            // v / vt / vn
            // we take only the vertex index (v)
            const vertexIndex = element[0] - 1;
            vertexToFaceMapping[vertexIndex].push(faceIndex);
        }
    }
}

/**
 * Step 1: Generate face normals
 * Smoothing the normals across the entire geometry can be done once and must be done before any transformations are applied to the model.
 * To obtain the smoothed normal for a vertex, sum the normals of all faces that use the vertex and then normalize the result. 
 * For this to work, we need a list for each vertex that contains the indices of the faces using that vertex.
 * @param faces 
 * @param vertices 
 * @param faceNormals 
 * @param vertexToFaceMapping 
 */
function smoothNormals(faces: string[][][], vertices: Vec3[], faceNormals: Vec3[], vertexToFaceMapping: any[]) {
    
    const facesNumber = faces.map(f => f.map(v => v.map(Number) as Vec3))

    generateFaceNormals(facesNumber, vertices, faceNormals);
    generateVertexToFaceMapping(facesNumber, vertexToFaceMapping);

    // average normals

    // for each vertex:
    for (let vIndex = 0; vIndex < vertices.length; vIndex++) {
        //      get all normals from faces using vertex
        const faceIndeces = vertexToFaceMapping[vIndex]

        //      add, normalize
        let result: Vec3= [0, 0, 0]
        for (let ind = 0; ind < faceIndeces.length; ind++) {
            const normal = faceNormals[faceIndeces[ind]];
            result = vecAdd(result, normal)
        }

        vertexNormals[vIndex] = vecNormalize(result)
    }
}



function perspectiveDivide(p: Vec3, dist: number): Vec3 {
    return [
        dist * p[0] / p[2],
        dist * p[1] / p[2],
        dist
    ]
}


function fillTriangle(vertices2d: any[], vertices3d: Vec3[], vertexNormals: Vec3[], depthBuffer: any[], lightPosition: number[]) {

    const [bboxmin, bboxmax] = bbox(vertices2d, width, height, fb, false);

    const a = vertices2d[0];
    const b = vertices2d[1];
    const c = vertices2d[2];

    const aZ = Math.abs(vertices3d[0][2]);
    const bZ = Math.abs(vertices3d[1][2]);
    const cZ = Math.abs(vertices3d[2][2]);

    const face = determinantFromPoints(a, c, b);
    const faceArea = 1 / (face * 0.5)

    for (let x = bboxmin[0]; x < bboxmax[0]; x++) {
        for (let y = bboxmin[1]; y < bboxmax[1]; y++) {
            const p = [x, y]
            // let inside = true;
            const apb = determinantFromPoints(a, p, b)
            const bpc = determinantFromPoints(b, p, c)
            const cpa = determinantFromPoints(c, p, a)

            if (apb >= 0 && bpc >= 0 && cpa >= 0) {
                //console.info(apb)
                const w3 = (apb * 0.5) * faceArea
                const w1 = (bpc * 0.5) * faceArea
                const w2 = 1 - w3 - w1

                const zInterp = aZ * w1 + bZ * w2 + cZ * w3
                const depthBufferIndex = x + width * y

                const currentZ = depthBuffer[depthBufferIndex];
                if (currentZ > zInterp) {

                    // Step 3 interpolate normal
                    const n1 = vecMultiplyScalar(w1, vertexNormals[0])
                    const n2 = vecMultiplyScalar(w2, vertexNormals[1])
                    const n3 = vecMultiplyScalar(w3, vertexNormals[2])

                    const normal = vecNormalize(vecAdd(vecAdd(n1, n2), n3));

                    depthBuffer[depthBufferIndex] = zInterp;

                    // interpolate Position
                    const p1 = vecMultiplyScalar(w1, vertices3d[0])
                    const p2 = vecMultiplyScalar(w2, vertices3d[1])
                    const p3 = vecMultiplyScalar(w3, vertices3d[2])
                    const positionOnFace = vecAdd(vecAdd(p1, p2), p3);
                
                    const lightIncident = vecSubtract(lightPosition as Vec3, vecMultiplyScalar(0.33, positionOnFace))
                    
                    // Last Step: calculate simple lighting with normal and light direction
                    const dot = vecDotProduct(vecNormalize(lightIncident), normal);
                    fb.draw(p[0], p[1], [dot * 180, dot * 180, dot * 180])

                }
            }
        }
    }
}


const dist = -1

const width = 512;
const height = 512;
const fb = new Framebuffer(width, height);


// Loading
const {vertices, faces} = loadGeoFromOBJ(objRaw);

const faceNormals: Vec3[] = []
const vertexToFaceMapping = new Array(vertices.length)
for (let index = 0; index < vertexToFaceMapping.length; index++) {
    vertexToFaceMapping[index] = []
}

const vertexNormals = new Array(vertices.length);
smoothNormals(faces, vertices.map(v => v.map(Number) as Vec3), faceNormals, vertexToFaceMapping);

let currentFrame = 0

const t0 = performance.now();

// Transformation
const scale = 2.5
const translate: Matrix4 = [
    scale, 0, 0, 0,
    0, scale, 0, 0,
    0, 0, scale, 0,
    0, -.3, -4, 1
]

const lightPosition = [-1, 0, 0];

const rot1 = matrix3ToMatrix4(rotX(90))
const rot2 = matrix3ToMatrix4(rotY(0))
const rot3 = matrix3ToMatrix4(rotZ(0))
const initRot = matrix4Product(matrix4Product(rot1, rot2), rot3)

const depthBuffer = new Array(width * height);
console.info(faces)

for (let i = 0; i <= 1; i += 0.01) {
    fb.clear();
    depthBuffer.fill(9999);

    const rotate2 = matrix3ToMatrix4(rotY(360 * i))
    const rotations = matrix4Product(initRot, rotate2);
    const transform = matrix4Product(rotations, translate)


    const fvTransformed = [];
    const fvNormalsTransformed = [];
    const fvProjected = [];

    for (let f of faces) {
        const fv = [
            vertices[Number(f[1][0]) - 1],
            vertices[Number(f[2][0]) - 1],
            vertices[Number(f[0][0]) - 1],
        ]

        const fvNormals = [
            vertexNormals[Number(f[1][0]) - 1],
            vertexNormals[Number(f[2][0]) - 1],
            vertexNormals[Number(f[0][0]) - 1],
        ]

        fvTransformed.length = 0;
        fvNormalsTransformed.length = 0;
        fvProjected.length = 0;

        for (let index = 0; index < fv.length; index++) {
            // apply transformation
            const vtransformed = multVec3Matrix4(fv[index].map(Number) as Vec3, transform).slice(0, 3) as Vec3; 
            fvTransformed.push(vtransformed);
            // perspectiveDivide
            // toRaster

            // Step 2: Transform normals
            const i = matrix4Transpose(matrix4Invert(transform));
            const vNormalTransformed = multVec3Matrix4(fvNormals[index], i).slice(0, 3) as Vec3;
            fvNormalsTransformed.push(vNormalTransformed);

            const vProjected = screenToRasterspace(
                perspectiveDivide(
                    vtransformed.slice(0, 3) as Vec3,
                    dist
                ), width, height
            )
            fvProjected.push(vProjected);
        }

        fillTriangle(fvProjected, fvTransformed, fvNormalsTransformed, depthBuffer, lightPosition)
    }


    fb.update();

    try {
        fb.save("frame." + ++currentFrame)
    } catch (error) {
        console.info("Could not save to localStorage")
    }
}

const t1 = performance.now();
console.log(`Rendering took ${t1 - t0} milliseconds.`);