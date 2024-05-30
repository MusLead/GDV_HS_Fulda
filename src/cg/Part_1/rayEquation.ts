
import { rayEquationCalc } from "../../_helper.ts";
import Playground from "../../playground.ts";

const pg = new Playground();

const point = [0.5, 0.6, 3];
const distImagePlane = -2;

// FIXME: how could we visualize the rayEquation correctly??
// Creates a basic camera visualization
pg.visCamera(distImagePlane);

pg.visVector(point.map(value => value * -1), { color: "purple", label: "P", triangles: true })

let pProjected = rayEquationCalc(point, [0,0,0], distImagePlane);
pg.visVector(pProjected, { color: "blue", label: "pProjected", triangles: true })
