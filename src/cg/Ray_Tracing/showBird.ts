import { ISphere, Matrix4, Vec3, matrix3ToMatrix4, matrix4Product, multVec3Matrix4, rasterToScreenSpace, raySphereIntersect, rotX, rotY } from "../../_helper";
import Framebuffer, { Color3 } from "../../framebuffer";
import spheres from "../../bird.json" 

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


// Transform bird
const birdRotation = matrix3ToMatrix4(rotX(-90));
for (let i = 0; i < spheres.length; i++) {
    spheres[i].center = multVec3Matrix4(spheres[i].center as Vec3, birdRotation);
}

// Initialise a frame counter for the framebuffer.save() string
let currentFrame = 0

// Step from 0 to 1
for (let i = 0; i <= 1; i += .02) {
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
            const vTransformed = multVec3Matrix4(v, combinedCameraTransform);
            const oTransformed = multVec3Matrix4(o, combinedCameraTransform);


            // Trace a ray
            let closestSphere = null;
            let closestIntersection = 9999;

            for (let i = 0; i < spheres.length; i++) {

                const [t1, t2] = raySphereIntersect(
                    vTransformed as unknown as Vec3, 
                    oTransformed as unknown as Vec3,
                    spheres[i] as ISphere) // <--- Calculate intersections

                if (t1 < closestIntersection && tNear < t1 && t1 < tFar) {
                    closestIntersection = t1;
                    closestSphere = spheres[i]
                }

                if (t2 < closestIntersection && tNear < t2 && t2 < tFar) {
                    closestIntersection = t2;
                    closestSphere = spheres[i];
                }
            }
            if (!closestSphere) {
                // Draw background color
                framebuffer.draw(x, y, [30, 0, 0]);
            } else {
                framebuffer.draw(x, y, closestSphere.color as Color3);
            }

        }

    }
    framebuffer.update();
    framebuffer.save("spheres." + ++currentFrame);

}