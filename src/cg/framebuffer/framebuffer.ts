import Framebuffer from "../../framebuffer";
import { ndcToScreenVec, rasterToNDC  } from '../../_helper.ts'

const width = 100;
const height = 100;
const x = 4;
const y = 5;
const framebuffer = new Framebuffer(width, height);
framebuffer.draw(x, y, [255, 255, 255]); 
//FIXME: why do not I see the point?
const vecScreen = ndcToScreenVec(rasterToNDC(x, y, width, height));
framebuffer.log(vecScreen.toString());
framebuffer.update;