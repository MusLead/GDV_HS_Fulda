
import { perspDivide } from "../_helper.ts";
import Playground from "../playground.ts";

const pg = new Playground();

const point = [0.5, 0.6, -3];
const distImagePlane = -1;

// Creates a basic camera visualization
pg.visCamera(distImagePlane);

pg.visVector(point, { color: "pink", label: "P", triangles: true })

// DONE:16.04.2024
// Add your function "perspDivide".
// IMPORTANT: Our camera points along -Z.
// function perspDivide(p: Array<number>, dist: number) {
// ...


let pProjected = perspDivide(point, distImagePlane);
pg.visVector(pProjected, { color: "blue", label: "P'", triangles: true })

// Task: Visualize foreshortening: far away objects have a smaller projection than closer objects. Move our point (or create a new point) further away from the camera and project it.
let point2 = [0.5, 0.6, -5]
pg.visVector(point2, { color: "red", label: "P2", triangles: true })
let pProjected2 = perspDivide(point2, distImagePlane);
pg.visVector(pProjected2, { color: "green", label: "P2'", triangles: true })
// The range between P2' and P' is the foreshortening than if the object is closer to the camera the projection is bigger than if the object is far away from the camera
