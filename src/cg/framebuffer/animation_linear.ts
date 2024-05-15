import Framebuffer from "../../framebuffer";

const width = 100
const height = 100
const framebuffer = new Framebuffer(width, height);

let currentFrame = 0

// Step from 0 to 1
for (let i = 0; i <= 1; i += 0.035) {
    framebuffer.clear()
    
    // fit i into actual values
    const val = Math.round((height-1) * i);
    framebuffer.draw(50, val, [255, 0, 0])
    
    framebuffer.update();

    framebuffer.save("frame." + ++currentFrame)
}