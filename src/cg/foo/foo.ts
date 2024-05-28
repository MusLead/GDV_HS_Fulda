import Framebuffer, { Color3 } from "../../framebuffer";
import { Vec3, ISphere, rasterToScreen, raySphereIntersect, Matrix4, multVec3Matrix4_transpose } from '../../_helper'


const width = 600
const height = 600
const framebuffer = new Framebuffer(width, height);
const imagePlaneDist = -1

const tNear = 1;
const tFar = 1000;

const spheres : ISphere[] = [
    {
        "center": [-2.5, 0, 0], // <--- Provide valid values for the center property
        "radius": 1, // <--- Provide a valid value for the radius property
        "color": [128, 0, 0] // <--- Provide a valid value for the color property
    },
    {
        "center": [0, 0, 0], // <--- Provide valid values for the center property
        "radius": 1, // <--- Provide a valid value for the radius property
        "color": [0, 128, 0] // <--- Provide a valid value for the color property
    },
    {
        "center": [2.5, 0, 0], // <--- Provide valid values for the center property
        "radius": 1, // <--- Provide a valid value for the radius property
        "color": [0, 0, 128] // <--- Provide a valid value for the color property
    }
]

// Camera Translation along Z-axis
const camT: Matrix4 = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 2,
    0, 0, 2, 1
];

const o: Vec3 = [0, 0, 0]//<--- the camera/viewer origin

const combinedCameraTransform = camT;

// Loop over framebuffer pixels
for (let x = 0; x <= width; x++) {
    for (let y = 0; y <= height; y++) {

        const v = rasterToScreen(x,y,width,height,imagePlaneDist) // <--- convert raster to screen space 
        
        // Apply combined camera transformation
        const vTransformed = multVec3Matrix4_transpose(v, combinedCameraTransform);
        const oTransformed = multVec3Matrix4_transpose(o, combinedCameraTransform);

        let closestSphere = null;
        let closestIntersection = 9999;

        for (let i = 0; i < spheres.length; i++) {

            const [t1, t2] = raySphereIntersect(vTransformed,oTransformed,spheres[i])// <--- Calculate intersections
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
            framebuffer.draw(x,y,[0,0,0]) // <--- Draw a background color
        } else {
            framebuffer.draw(x,y,closestSphere.color as Color3) // <--- Draw color of closest sphere
        }

    }

}
framebuffer.update();
framebuffer.save("spheres.");