/** 
 * check rayEquation.ts:
 * If I understand clearly, this fucntion only shoot a vector 
 * as a ray from the origin. it does not tell how the t_distance should be
 * it only shoots a ray from the origin to some point. 
*/

import Playground from "../../playground.ts";
import { rayEquationCalc } from "../../_helper.ts";

const pg = new Playground();

const origin = [0,0,0];
const travelDistance = 0.5;
const ray = [0.8, 0.5, 1];

pg.gridXZ();

// Any point P' on the ray:
// P = origin + travelDistance(ray-origin)
const originToRay = ray.map((value, index) => value - origin[index]);  // ray-origin
// const pd = vecAdd(origin, vecMultiplyScalar(travelDistance, originToRay));
const pd = rayEquationCalc(ray, origin, travelDistance);

pg.visPoint(origin, {  label: "O",color:"orange" })
pg.visPoint(ray, { label:"rayPoint", color:"dodgerblue", placeAt:origin  })
pg.visVector(originToRay, { label:"ray", color:"dodgerblue", placeAt:origin  })
pg.visPoint(pd, {label:"P",color:"red"})