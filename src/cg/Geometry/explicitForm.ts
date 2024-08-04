import Playground from "../../playground.ts";
const pg = new Playground()
pg.gridXZ()


const s = 1; // slope
const i = .5; // intersect y

pg.visPoint([0,i,0], {label: `origin (y:${i} x:0)`})
for(let x = 0; x<1; x=x+0.01){    
    const y = s*x + i // explicit form: y depends on x
    pg.visPoint([x,y,0])
}