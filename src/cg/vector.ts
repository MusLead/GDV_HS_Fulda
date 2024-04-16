import Playground from "../playground.ts";

const pg = new Playground();

//FIXME: not yet finished, redeesign it!
pg.gridXZ();
const point = [-2, -0.6, 3];

pg.visVector(point, { color: "pink", label: "P", placeAt: [1,1,1] })

