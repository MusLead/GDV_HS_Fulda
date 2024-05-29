import Framebuffer from "../../framebuffer";

const width = 100
const height = 100
const framebuffer = new Framebuffer(width, height);

let currentFrame = 0

// rgb pixel all offset

// Step from 0 to 1
for (let i = 0; i <= 1; i += 0.02) {
    framebuffer.clear()
    // let movedR = 0; //TODO: Optional if you have a time play with this
    // offsets (intial place wihtin the scope)
    const offsetR = ((i + 0)*2) % 1;
    const offsetG = ((i + 0.33)*4) % 1;
    const offsetB = (i + 0.66) % 1;

    // remap 0 1 to -1 1
    const remappedR = offsetR * 2 - 1; 
    const remappedG = offsetG * 2 - 1; 
    const remappedB = offsetB * 2 - 1; 

    const valR = Math.round((height-1) * Math.abs(remappedR));
    const valG = Math.round((height-1) * Math.abs(remappedG));
    const valB = Math.round((height-1) * Math.abs(remappedB));

    framebuffer.draw(25, valR, [255, 0, 0])
    framebuffer.draw(50, valG, [0, 255, 0])
    framebuffer.draw(75, valB, [0, 0, 255])
    
    framebuffer.update();
    framebuffer.save("frame." + ++currentFrame)
}