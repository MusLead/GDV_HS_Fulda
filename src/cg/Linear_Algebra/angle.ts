import Playground from "../../playground.ts";
import { vecDotProduct,vecLength,vecCrossProduct } from '../../_helper.ts'

const pg = new Playground();

pg.gridXZ();

const vec1 = [5, .2, 2.3];
const vec2 = [0, .3, 2.6];

//FIXME: THE GREY LINE IS NOT SHOWING UP THAT SHOWS THE AREA OF 2 CROSSPRODUCT
pg.visVector(vec1, { color: "blue", label: "V1", showCone: false, showArrow: true});
pg.visVector(vec2, { color: "green", label: "V2", showCone: false, showArrow: true});

const dotProduct = vecDotProduct(vec1, vec2);
const length1 = vecLength(vec1);
const length2 = vecLength(vec2);

const angleRadians = Math.acos(dotProduct / (length1 * length2));
const angle = angleRadians * (180 / Math.PI);

pg.visPoint([0,0,0], { color: "grey", label: angle.toFixed(2) + " degrees" });

const crossProduct = vecCrossProduct(vec1, vec2);
pg.visVector(crossProduct, { color: "red", label: "AxB" });

const crossProductReverse = vecCrossProduct(vec2, vec1);
pg.visVector(crossProductReverse, { color: "purple", label: "BxA" });
