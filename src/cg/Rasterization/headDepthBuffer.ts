/**
 * IMPORTNAT, TRY TO UNDESTAND THE DEPTH BUFFER FILL TRIANGLE AGAIN!
 */
import { Matrix4, Vec3, fillTriangleDepthBuffer, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rotX, rotY, rotZ, screenToRasterspace, vecAdd, vecCrossProduct, vecDotProduct, vecMultiplyScalar, vecNormalize, vecSubtract } from "../../_helper";
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
const initRot = matrix4Product(matrix4Product(rot1, rot2), rot3)

const depthBuffer = new Array(width * height);

for (let i = 0; i <= 1; i += 0.01) {
    fb.clear();
    depthBuffer.fill(9999); // fill with large number for every pixel

    const rotate2 = matrix3ToMatrix4(rotY(360 * i))
    const rotations = matrix4Product(initRot, rotate2);
    const transform = matrix4Product(rotations, translate)


    const fvTransformed = []
    const fvProjected = []
    for (let f of faces) {
        const fv = [
            vertices[Number(f[1][0]) - 1],
            vertices[Number(f[2][0]) - 1],
            vertices[Number(f[0][0]) - 1],
        ]

        fvTransformed.length = 0;
        fvProjected.length = 0;

        for (let v of fv) {
            // apply transformation (3D)
            const vtransformed = multVec3Matrix4(v.map(Number) as Vec3, transform) as unknown as Vec3;
            fvTransformed.push(vtransformed);
            // perspectiveDivide to Raster Space (2D)
            const vProjected = screenToRasterspace(
                perspectiveDivide(
                    vtransformed,
                    dist
                ), width, height
            )
            fvProjected.push(vProjected);
        }
    
        // calculate simple lighting
        // normal, light direction
        const edge1 = vecSubtract(fvTransformed[1], fvTransformed[0]);
        const edge2 = vecSubtract(fvTransformed[2], fvTransformed[0]);

        const fNormal = vecCrossProduct(edge1, edge2) as Vec3

        let faceCenter = vecAdd(vecAdd(fvTransformed[0], fvTransformed[1]), fvTransformed[2])
        faceCenter = vecMultiplyScalar(0.33, faceCenter)
        const lightIncident = vecSubtract(lightPosition as Vec3, faceCenter)

        const dot = vecDotProduct(vecNormalize(lightIncident), vecNormalize(fNormal));

        fillTriangleDepthBuffer(fvProjected, fvTransformed, dot, depthBuffer, width, height, fb)
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