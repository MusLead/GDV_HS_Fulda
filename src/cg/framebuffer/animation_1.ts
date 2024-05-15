import Framebuffer from "../../framebuffer.ts";

const width = 100;
const height = 100;

const framebuffer = new Framebuffer(width, height);

for (let i = 0; i < width; i++) {
    framebuffer.clear();
    framebuffer.draw(i, 50, [255, 0, 0]); 
    framebuffer.update();
    framebuffer.save("animation" + i);
}

