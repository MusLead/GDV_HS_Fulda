/**
 * Project explanation: Vorlesung GDV 07.05.2024
 * Project task: Ray tracing 2
 */
import Framebuffer, { Color3 } from "../../framebuffer";
import { Vec3, ISphere, rasterToScreenSpace, raySphereIntersect } from '../../_helper'


const width = 600
const height = 600
const framebuffer = new Framebuffer(width, height);
const imagePlaneDist = -1

const tNear = 1;
const tFar = 1000;

const spheres : ISphere[] = [
    {
        "center": [-2.5, 0, -5],
        "radius": 1, 
        "color": [128, 0, 0] 
    },
    {
        "center": [0, 0, -5], 
        "radius": 1, 
        "color": [0, 128, 0] 
    },
    {
        "center": [2.5, 0, -5], 
        "radius": 1, 
        "color": [0, 0, 128] 
    }

]

const o: Vec3 = [0, 0, 0]//<--- the camera/viewer origin

// Loop over framebuffer pixels
for (let x = 0; x <= width; x++) {
    for (let y = 0; y <= height; y++) {

        const v = rasterToScreenSpace(x,y,width,height,imagePlaneDist) // <--- convert raster to screen space 
        

        let closestSphere = null;
        let closestIntersection = 9999;

        for (let i = 0; i < spheres.length; i++) {

            const [t1, t2] = raySphereIntersect(v,o,spheres[i])// <--- Calculate intersections
            // console.log(t1, t2)
            if (t1 < closestIntersection && tNear < t1 && t1 < tFar) {
                closestIntersection = t1;
                closestSphere = spheres[i]
                console.log(closestSphere)
            }

            if (t2 < closestIntersection && tNear < t2 && t2 < tFar) {
                closestIntersection = t2;
                closestSphere = spheres[i];
                console.log(closestSphere)
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