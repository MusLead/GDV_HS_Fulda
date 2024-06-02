/** 
 * Project explanation: none
 * Project task: Part_1
 * 
 * 30.05.2024
 * If I understand clearly, this fucntion only shoot a vector 
 * as a ray from the origin. it does not tell how the t_distance should be
 * it only shoots a ray from the origin to some point. 
 * 
 * For more intuitive and graphical explanation,
 * please see the rayTracing1.ts
 * 
 * comparisson with variables in rayTracing1.ts:
 * - rayVector is being represented by the ov vector.
 * - travelDistance is being represented by the t1 and t2 values.
 *   they are being calculated by the formula.
 * - p is the point where (in the rayTracing1) the ray hits the sphere.
 *   you could see that t1 is being multiplied with v vecMultiplyScalar(t1, v)
 * - origin is being represented by the o point.
 * - rayPoints are being represented as points (v) within the camera plane.
 *   x and y are being looped from -1 to 1 with a defined step
 * 
 * TODO: why though this happen? why could not the ray go through the rayPoint?
 * Remember that rayVector does not always go through the rayPoint.
 * if the origin is not 0,0,0, then the rayVector will not go through the rayPoint.
 */

import Playground from "../../playground.ts";
import { rayEquationCalc } from "../../_helper.ts";

const pg = new Playground();

const imagePlaneDist = -1

//TODO: change the origin and see what happens
// the rayVector will not go through the rayPoint
// but why? 
const origin = [0,0,0];
const travelDistance = 2;
const rayPoint = [0, 0.5, imagePlaneDist]; 

pg.gridXZ();
pg.visCamera(imagePlaneDist)

// Any point P' on the ray:
// P = origin + travelDistance(ray-origin)
const originToRay = rayPoint.map((value, index) => value - origin[index]);  // ray-origin
// const pd = vecAdd(origin, vecMultiplyScalar(travelDistance, originToRay));
const pd = rayEquationCalc(rayPoint, origin, travelDistance);

pg.visPoint(origin, {  label: "O",color:"orange" })
pg.visPoint(rayPoint, { label:"rayPoint", color:"gray", placeAt:origin  })
pg.visVector(originToRay, { labelCenter:"rayVector", color:"dodgerblue", placeAt:origin})
pg.visPoint(pd, {label:"P",color:"red"})