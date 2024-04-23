
import { rayEquationCalc } from "../../_helper.ts";
import Playground from "../../playground.ts";

const pg = new Playground();

const point = [0.5, 0.6, -3];
const distImagePlane = -1;

// FIXME: how could we visualize the rayEquation correctly??
// Creates a basic camera visualization
pg.visCamera(distImagePlane);

pg.visVector(point, { color: "pink", label: "P", triangles: true })

let pProjected = rayEquationCalc(point, [0,0,-1], distImagePlane);
pg.visVector(pProjected, { color: "blue", label: "P'", triangles: true })
