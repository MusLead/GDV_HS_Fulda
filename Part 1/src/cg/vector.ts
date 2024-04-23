import Playground from "../playground.ts";

const pg = new Playground();

pg.gridXZ();
const point = [1, 1, 1];

pg.visVector(point.map(c => c * -1), { color: "blue", label: "P", placeAt: [1,1,1] })
// Do not forget! placeAt is the position of the origin of the vector

