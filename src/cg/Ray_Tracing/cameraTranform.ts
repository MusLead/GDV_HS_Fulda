import Framebuffer, { Color3 } from "../../framebuffer";
import { Vec3, Matrix4, Matrix3, rasterToScreenSpace, multVec3Matrix4_transpose, matrix3ToMatrix4, matrix4Product, rotX, raySphereIntersect, ISphere, rotY } from '../../_helper';

const width = 600;
const height = 600;
const framebuffer = new Framebuffer(width, height);
const imagePlaneDist = -1;

const tNear = 1;
const tFar = 1000;

const spheres : ISphere[] = [
    { "center": [-2.5, 0, 0], "radius": 1, "color": [128, 0, 0] },
    { "center": [0, 0, 0], "radius": 1, "color": [0, 128, 0] },
    { "center": [2.5, 0, 0], "radius": 1, "color": [0, 0, 128] }
];

const o: Vec3 = [0, 0, 0];

// Camera Translation along Z-axis
const camT: Matrix4 = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 6,
    0, 0, 0, 1
];

// Rotation matrix around X-axis
const camRx = matrix3ToMatrix4(rotX(0) as Matrix3); // 30 degrees rotation around X-axis

// Initial Camera Transformation
const camInitialTransform = matrix4Product(camT, camRx);

// const camInitialTransform = camT;

let currentFrame = 0;

for (let i = 0; i <= 1; i += 0.02) {
    framebuffer.clear();

    // Rotation around Y-axis based on frame number
    const camRot = matrix3ToMatrix4(rotY(360 * i) as Matrix3); // Rotate 360 degrees based on i

    // Combine the initial transform with the rotation
    const combinedCameraTransform = matrix4Product(camInitialTransform, camRot);

    // Loop over framebuffer pixels
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            // Convert raster coordinates to screen space
            const v = rasterToScreenSpace(x, y, width, height, imagePlaneDist);

            // Apply combined camera transformation
            //TODO: try to analyse how to rotate correctly with this approach!
            const vTransformed = multVec3Matrix4_transpose(v, combinedCameraTransform);
            const oTransformed = multVec3Matrix4_transpose(o, combinedCameraTransform);
            
            vTransformed.pop(); // Remove the homogeneous coordinate
            oTransformed.pop(); // Remove the homogeneous coordinate

            let closestSphere = null;
            let closestIntersection = 9999;

            for (let i = 0; i < spheres.length; i++) {

                const [t1, t2] = 
                    raySphereIntersect(
                        vTransformed as unknown as Vec3, 
                        oTransformed as unknown as Vec3,
                        spheres[i])// <--- Calculate intersections

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
                framebuffer.draw(x,y,[30,0,0]) // <--- Draw a background color
            } else {
                framebuffer.draw(x,y,closestSphere.color as Color3) // <--- Draw color of closest sphere
            }

            
        }
    }
    framebuffer.update();
    framebuffer.save("spheres." + (++currentFrame));
}
