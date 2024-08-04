import Playground from "../../playground.ts";


const pg = new Playground()
pg.gridXZ()

// smaller the step, more dots will make the sphere more smooth
const step = Math.PI * 0.05

const radius = 1;

var count = 0;
for (let phi = 0; phi <= 2 * Math.PI; phi += step) {
    for (let theta = 0; theta <= 2 * Math.PI; theta += step) {
        const x = radius * Math.sin(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.cos(phi);
        const z = radius * Math.cos(theta);
        count++;
        pg.visPoint([x, y, z])
    }
}

pg.visPoint([0, 0, 0], { label: `sphere with dots: ${count}` })

