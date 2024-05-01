import Playground from "../../playground";

const pg = new Playground();

// Visualize grids:
pg.gridXZ();
// pg.gridXY();
// pg.gridYZ();

// A vector is just an array:
const v = [1, 2, 3];

// Add optional parameters to the visualization:
pg.visVector(v.map(value => value - 1), { color: "dodgerblue", label: "Vector" });

// Visualize the same data as point:
pg.visPoint(v.map(value => value - .5), { pscale: .04 , label: "Point" });