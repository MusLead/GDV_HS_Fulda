import Playground from "../../playground";

const pg = new Playground();
pg.gridXZ();
const v = [1, 2, -2];

pg.visVector(v, { color: "dodgerblue", label: "V" });

const alongX = [v[0], 0, 0];
const alongY = [0, v[1], 0];
const alongZ = [0, 0, v[2]];
pg.visVector(alongX, { color: 'red' });
pg.visVector(alongY, { color: 'green', placeAt: alongX });
pg.visVector(alongZ, { color: 'blue', placeAt: [alongX[0], alongY[1], 0] });