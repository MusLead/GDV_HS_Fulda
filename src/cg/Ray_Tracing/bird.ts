/**
 * Project explanation: Vorlesung GDV 07.05.2024
 * Project task: Ray tracing 2
 *
 * 30.05.2024
 * Problem: The camera and the bird were in the same position 
 * (in the origin). Therefore the came ra could not take the picture of the bird.
 * 
 * camT is the transformation matrix for the camera offset.
 * it makes the camera move along the Z-axis. 
 * so that the camera can take a picture of the bird.
 * 
 * Nevertheless, the value of raySphereIntersect is NaN.
 * but the closestSphere is detected correctly.
 */

import Framebuffer, { Color3 } from "../../framebuffer";
import { Vec3, ISphere, rasterToScreenSpace, raySphereIntersect, Matrix4, multVec3Matrix4 } from '../../_helper'
import spheres from '../../bird.json'

const width = 600
const height = 600
const framebuffer = new Framebuffer(width, height);
const imagePlaneDist = -1

const tNear = 1;
const tFar = 1000;

const o: Vec3 = [0, 0, 0]//<--- the camera/viewer origin

// Transformation matrices for camera offset
// move along Z
const camT: Matrix4 = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 2, 8, 1
]

const combinedCameraTransform = camT

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
            // TODO: why is the t1, adn t2 NaN?
            // but the closestSphere is detected correctly?
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
framebuffer.save("spheres.");