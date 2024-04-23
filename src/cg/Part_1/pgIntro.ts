import Playground from "../../playground";

const pg = new Playground();

// Visualize grids:
pg.gridXZ();
// pg.gridXY();
// pg.gridYZ();

// A vector is just an array:
const v = [1, 2, 3];

// Visualize a vector
pg.visVector(v);

// Add optional parameters to the visualization:
pg.visVector(v, { color: "dodgerblue", label: "V" });

// Visualize the same data as point:
pg.visPoint(v, { pscale: .04 });