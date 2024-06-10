/**
 * Project explanation: Vorlesung GDV 14.05.2024
 * Project task: Ray tracing 3
 */
import { ILight, Matrix4, Vec3, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rasterToScreenSpace, rayEquationCalc, rotX, rotY, vecMultiplyScalar, vecNormalize, getClosestSphereAndIntersection, ISphere, lightingWithShadows } from "../../_helper";
import Framebuffer, { Color3 } from "../../framebuffer";
import spheres from "../../bird.json" 

// Lights
const lights: ILight[] = [
    {
        intensity: 1.3,
        position: [-1, 10, 8]
    },
    {
        intensity: 1.3,
        position: [15, 8, -20]
    },
    //{
    //    intensity: .8,
    //    position: [15, 15, 20]
    //},
]

const width = 400
const height = 400
const framebuffer = new Framebuffer(width, height);
const imagePlaneDist = -1

const tNear = 1;
const tFar = 1000;


const o: Vec3 = [0, 0, 0]

// Transformation matrices for camera offset
// move along Z
const camT: Matrix4 = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 2, 8, 1
]

// Create a 3x3 rotation matrix and convert it to 4x4
const camRx = matrix3ToMatrix4(rotX(-25));

// Combine matrices as initial transform
const camInitialTransform = matrix4Product(camT, camRx);


// Transform bird from Blender orientation 
const birdRotation = matrix3ToMatrix4(rotX(-90));
for (let i = 0; i < spheres.length; i++) {
    spheres[i].center = multVec3Matrix4(spheres[i].center as Vec3, birdRotation);
}

// A massive floor sphere
// ------
// TODO: ask, why is the floor is not being stated within the script
// BE CAREFUL, I SAW THESE CODE FROM THE SOLUTIONS SCRIPTS!
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
// ------

// Initialise a frame counter for the framebuffer.save() string
let currentFrame = 0

const step = .15;

// Step from 0 to 1
for (let i = 0; i <= 1; i += step) {
    framebuffer.clear()

    // Create rotation matrix in each frame
    const camRot = matrix3ToMatrix4(rotY(360 * i));
    // Combine transformations: initial transform then rotate
    const combinedCameraTransform = matrix4Product(camInitialTransform, camRot)


    // Loop over framebuffer pixels
    for (let x = 0; x <= width; x++) {
        for (let y = 0; y <= height; y++) {

            // Convert to screen space
            const v = rasterToScreenSpace(x, y, width, height, imagePlaneDist);
            const vTransformed = multVec3Matrix4(v, combinedCameraTransform) as unknown as Vec3;
            const oTransformed = multVec3Matrix4(o, combinedCameraTransform) as unknown as Vec3;


            // Trace a ray
            let { closestSphere, closestIntersection } = getClosestSphereAndIntersection(vTransformed, oTransformed,tNear, tFar, spheres as ISphere[]);
            
            
            if (!closestSphere) {
                // Draw background color
                framebuffer.draw(x, y, [30, 0, 0]);
            } else {
                
                const surfPosition : Vec3 = rayEquationCalc(
                                            vTransformed, 
                                            oTransformed, 
                                            closestIntersection);
                const cp = surfPosition.map((val, i) => val - closestSphere.center[i])
                const surfNormal: Vec3 = vecNormalize(cp as Vec3)
                const clighting = lightingWithShadows(surfPosition, surfNormal, lights, spheres as ISphere[]);
                
                const finalColor = vecMultiplyScalar(
                    clighting,
                    closestSphere.color as Vec3);
    
                framebuffer.draw(x, y, finalColor as Color3);
            }

        }

    }
    framebuffer.update();
    framebuffer.save("spheres." + ++currentFrame);

}