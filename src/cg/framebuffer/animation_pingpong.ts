import Framebuffer from "../../framebuffer";

const width = 100
const height = 100
const framebuffer = new Framebuffer(width, height);

let currentFrame = 0

// Step from 0 to 1
for (let i = 0; i <= 1; i += 0.02) {
    framebuffer.clear()
    
    // remap 0 1 to -1 1
    // if the i between 0 and 0.5, remapped will be minus
    const remapped = i * 2 - 1; 
    console.info("Remaped Value: " + remapped)

    // fit remapped i into actual values
    // and use absolute value from remapped    
    console.info("Absolute Value: " + Math.abs(remapped));
    const val = Math.round((height-1) * Math.abs(remapped));

    framebuffer.draw(50, val, [255, 0, 0])
    
    framebuffer.update();
    framebuffer.save("frame." + ++currentFrame)
}