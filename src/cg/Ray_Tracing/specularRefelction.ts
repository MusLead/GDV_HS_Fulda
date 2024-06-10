import { ILight, ISphere, Matrix4, Vec3, getClosestSphereAndIntersection, lightingWithShadowsSpec, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rasterToScreenSpace, rotX, rotY, vecMultiplyScalar, vecNormalize, vecSubtract } from "../../_helper";
import Framebuffer, { Color3 } from "../../framebuffer";
//import spheres from './bird.json'

const width = 600
const height = 600
const framebuffer = new Framebuffer(width, height);
const imagePlaneDist = -2

const tNear = 1;
const tFar = 1000;


const o: Vec3 = [0, 0, 0]

// Transformation matrices for the Camera
// move along Z
const camT: Matrix4 = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 2, 7.5, 1
]

// Create a 3x3 rotation matrix and convert it to 4x4
const camRx = matrix3ToMatrix4(rotX(-15));

// Camera rotate about origin
const camRy = matrix3ToMatrix4(rotY(45));

const combinedCameraTransform = matrix4Product(matrix4Product(camT, camRx), camRy)



// Transform bird from Blender orientation
//const birdRotation = matrix3ToMatrix4(rotX(-90));
//for (let i = 0; i < spheres.length; i++) {
//    spheres[i].center = multVec3Matrix4(spheres[i].center as Vec3, birdRotation);
//}



const spheres = [
    {
        "center": [
            0,2,0
        ],
        "radius":2,
        "color": [
            50,
            50,
            80
        ]
    },
]
// A massive floor sphere
spheres.push(
    {
        "center": [
            0,
            -500,
            0
        ],
        "radius": 500,
        "color": [
            80,
            80,
            80
        ]
    },

)

// Lights
const lights = [
    {
        intensity: 1.3,
        position: [-1, 10, 8]
    },
    {
        intensity: 2,
        position: [15, 8, -10]
    },
    //{
    //    intensity: .8,
    //    position: [15, 15, 20]
    //},
]



framebuffer.clear()

// Loop over framebuffer pixels
for (let x = 0; x <= width; x++) {
    for (let y = 0; y <= height; y++) {

        // Convert to screen space
        const v = rasterToScreenSpace(x, y, width, height, imagePlaneDist);
        const vTransformed = multVec3Matrix4(v, combinedCameraTransform);
        const oTransformed = multVec3Matrix4(o, combinedCameraTransform);


        const {closestSphere, closestIntersection} = getClosestSphereAndIntersection(vTransformed as unknown as Vec3, oTransformed as unknown as Vec3, tNear, tFar, spheres as ISphere[])

        if (!closestSphere) {
            // Draw background color
            framebuffer.draw(x, y, [30, 0, 0]);
        } else {
            // Calculate and apply lighting
            // Surface position using ray equation
            const surfPosition =
                oTransformed.map((e, i) => e + closestIntersection * (vTransformed[i] - e)) as Vec3;

            // Surface normal
            const surfNormal = vecNormalize(
                vecSubtract(
                    surfPosition, closestSphere.center
                )
            )
            
            // With shadow and Spec
            const clighting = lightingWithShadowsSpec(surfPosition as Vec3, 
                surfNormal as Vec3, 
                lights as Array<ILight>, 
                spheres as ISphere[], 
                vTransformed as unknown as Vec3, 
                1) // Specular power

            // Without shadow
            //const clighting = lighting(surfPosition as Vec3, surfNormal as Vec3, lights as Array<ILight>)


            const finalColor = vecMultiplyScalar(
                clighting,
                closestSphere.color as Vec3);

            framebuffer.draw(x, y, finalColor as Color3);
        }

    }

}
framebuffer.update();
framebuffer.save("bird");