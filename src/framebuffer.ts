import JSZip from 'jszip';

export type Color3 = [number, number, number];

export interface ICoord2D {
    x: number,
    y: number
}

export default class Framebuffer {
    private canvas!: HTMLCanvasElement;
    private ctx
    private buffer
    private color: Color3
    private saveLink!: HTMLAnchorElement
    private saveButton!: HTMLButtonElement
    private logField!: HTMLUListElement

    constructor(width = 100, height = 100) {

        // Remove stored images
        for (var key in sessionStorage) {
            if (key.indexOf("render.") === 0) {
                sessionStorage.removeItem(key);
            }
        }

        this.color = [0, 0, 0]
        const appEl = document.getElementById("app");
        if(!appEl) {
            console.warn("No app element found!");
            return;
        }
        appEl.style.display = "flex";
        appEl.style.height = "100vh";
        appEl.style.width = "100vw";
        appEl.style.flexDirection = "column";
        appEl.style.justifyContent = "center";
        appEl.style.alignItems = "center";

        this.canvas = document.createElement("canvas");
        this.canvas.id = "framebuffer";
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.borderWidth = "2px"

        const header = document.createElement("h2");
        header.innerText = "framebuffer: " + width + "x" + height;
        appEl.appendChild(header);
        appEl.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        if (!this.ctx) {
            console.warn("No canvas 2d context!")
            return
        }

        // Setup save link
        this.saveLink = document.createElement("a");
        this.saveLink.id = "save";

        this.saveLink.style.display = "none";
        appEl.appendChild(this.saveLink);

        // Save button
        this.saveButton = document.createElement("button");
        this.saveButton.innerText = "Download Frames";
        appEl.appendChild(this.saveButton);

        this.saveButton.addEventListener("click", () => this.download())

        // Log 
        this.logField = document.createElement("ul");
        this.logField.id = "log";
        appEl.appendChild(this.logField);

        // Get pixel data
        this.buffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    }

    
    draw(x: number, y: number, color: Color3 = [80, 80, 80], parameters?: {}): void {

        const defaults = {
        }

        const params = { ...defaults, ...parameters }
        this.color = color;

        if (!this.buffer) return;

        // The first (red) component for this pixel
        var offset = 4 * x + (this.buffer.width * 4) * y;

        const redIndex = offset;
        const greenIndex = redIndex + 1;
        const blueIndex = greenIndex + 1;
        const alphaIndex = blueIndex + 1;

        this.buffer.data[redIndex] = this.color[0];
        this.buffer.data[greenIndex] = this.color[1];
        this.buffer.data[blueIndex] = this.color[2];
        this.buffer.data[alphaIndex] = 255;
    }


    update() {
        if (!this.ctx) return;

        this.ctx.putImageData(this.buffer!, 0, 0);
    }

    save(name: string) {
        sessionStorage.setItem("render." + name, this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    }

    // download() {
    //     for (var key in sessionStorage) {
    //         if (key.indexOf("render.") === 0) {
    //             sessionStorage.getItem(key)
    //             console.info("Downloading", key)
    //             this.saveLink.setAttribute('download', key + '.png');
    //             this.saveLink.setAttribute('href', sessionStorage[key]);
    //             this.saveLink.click();
    //         }
    //     }
    // }

    download() {
        const zip = new JSZip();
    
        // Fetch the header text, trim any leading or trailing spaces, and use it to name the ZIP file
        const headerElement = document.getElementById("header");
        const headerText = headerElement ? headerElement.textContent!.trim() : "GDV";
        
        
        console.log("headerText", headerText);
        for (var key in sessionStorage) {
            if (key.startsWith("render.")) {
                const dataURL = sessionStorage.getItem(key);
                if (dataURL) {
                    const blob = this.dataURLtoBlob(dataURL);
                    zip.file(key.replace('render.', '') + '.png', blob, {binary: true});
                }
            }
        }
    
        zip.generateAsync({type: "blob"}).then((content) => {
            this.saveLink.href = URL.createObjectURL(content);
            this.saveLink.setAttribute('download', headerText + '.zip');
            this.saveLink.click();
            URL.revokeObjectURL(this.saveLink.href); // Clean up URL object after the download
        });
    }

    dataURLtoBlob(dataURL: string): Blob {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }

    log(content: string) {
        this.logField.innerText = content;
    }

    clear() {
        this.ctx!.reset();
        this.buffer = this.ctx!.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.update();
    }
}