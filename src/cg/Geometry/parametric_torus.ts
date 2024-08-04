import Playground from "../../playground.ts";


const pg = new Playground()
pg.gridXZ()



// smaller the step, more circle will make the torus more smooth
const step = Math.PI * 0.05

const torusRad1 = .3;
const torusRad2 = .8;

var count = 0;

for (let phi = 0; phi <= 2 * Math.PI; phi += step) {
   for (let theta = 0; theta <= 2 * Math.PI; theta += step) {
       
       const x = (torusRad2 + torusRad1 * Math.cos(theta)) * Math.cos(phi);
       
       const y = (torusRad2 + torusRad1 * Math.cos(theta)) * Math.sin(phi);
       const z = torusRad1 * Math.sin(theta);

       count++;
       pg.visPoint([x, y, z])
   }
}

pg.visPoint([0, 0, 0], { label: `torus with dots: ${count}` })