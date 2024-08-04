/**
 * TODO: learn about how the normals are calculated!
 * and the corelation between the normals and the light direction!
 */
import { screenToRasterspace, Matrix4, Vec3, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rotX, rotY, rotZ, vecAdd, vecCrossProduct, vecDotProduct, vecMultiplyScalar, vecNormalize, vecSubtract, fillTriangleOptimized } from "../../_helper";
import Framebuffer from "../../framebuffer";
import objRaw from '../../head.obj?raw';
import { loadGeoFromOBJ } from "../../loader";


function perspectiveDivide(p: Vec3, dist: number): Vec3 {
    return [
        dist * p[0] / p[2],
        dist * p[1] / p[2],
        dist
    ]
}

const dist = -1

const width = 512;
const height = 512;
const fb = new Framebuffer(width, height);


const scale = 1
const translate: Matrix4 = [
    scale, 0, 0, 0,
    0, scale, 0, 0,
    0, 0, scale, 0,
    0, -.2, -1.5, 1
]

const {vertices, faces} = loadGeoFromOBJ(objRaw)

let currentFrame = 0

const t0 = performance.now();

const lightPosition = [-1, 0, 0];

const rot1 = matrix3ToMatrix4(rotX(90))
const rot2 = matrix3ToMatrix4(rotY(0))
const rot3 = matrix3ToMatrix4(rotZ(0))
const initRot = matrix4Product(matrix4Product(rot1,rot2), rot3)



for (let i = 0; i <= 1; i += 0.01) {
    fb.clear()

    const rotate2 = matrix3ToMatrix4(rotY(360 * i))
    const rotations = matrix4Product(initRot, rotate2);
    const transform = matrix4Product(rotations, translate)


    const fvTransformed: Vec3[] = []
    const fvProjected: Vec3[] = []
    for (let f of faces) {
        const fv = [
            vertices[Number(f[0][0]) - 1],
            vertices[Number(f[1][0]) - 1],
            vertices[Number(f[2][0]) - 1],
        ]

        fvTransformed.length = 0;
        fvProjected.length = 0;

        for (let v of fv) {
            // apply transformation
            const vtransformed = multVec3Matrix4(v.map(Number) as Vec3, transform);
            fvTransformed.push(vtransformed.slice(0, 3) as Vec3);
            // perspectiveDivide
            // toRaster
            const vProjected = screenToRasterspace(
                perspectiveDivide(
                    vtransformed.slice(0, 3) as Vec3,
                    dist
                ), width, height
            )
            fvProjected.push(vProjected as Vec3);
        }

        // calculate simple lighting
        // normal, light direction
        const edge1 = vecSubtract(fvTransformed[1], fvTransformed[0]);
        const edge2 = vecSubtract(fvTransformed[2], fvTransformed[0]);

        const fNormal = vecCrossProduct(edge1, edge2) as Vec3

        // sum all the vertices and divide by 3 to get the face center
        let faceCenter = vecAdd(vecAdd(fvTransformed[0], fvTransformed[1]), fvTransformed[2])
        faceCenter = vecMultiplyScalar(0.33, faceCenter)
        // subtract the light position from the face center to get the light incident vector
        const lightIncident = vecSubtract(lightPosition as Vec3, faceCenter)

        // normalize the vectors
        const dot = vecDotProduct(vecNormalize(lightIncident), vecNormalize(fNormal));

        // fillTriangle(fvProjected, dot, width, height, fb)
        fillTriangleOptimized(fvProjected, dot, width, height, fb, true)
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