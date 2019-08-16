namespace stats {
    let fpsTextNode: Text;
    let msTextNode: Text;
    let frames: number = 0;
    let fps: number = 60;
    let lastFps: number = 0;
    let ms: number = 1000 / fps;

    export function init(): void {
        const container: HTMLDivElement = document.createElement("div");
        container.style.position = "relative";
        document.body.prepend(container);

        const overlay: HTMLDivElement = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.left = "10px";
        overlay.style.top = "10px";
        overlay.style.fontFamily = "monospace";
        overlay.style.padding = "1em";
        overlay.style.color = "white";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        container.appendChild(overlay);

        const fpsDOM: HTMLDivElement = document.createElement("div");
        overlay.appendChild(fpsDOM);
        const msDOM: HTMLDivElement = document.createElement("div");
        overlay.appendChild(msDOM);

        fpsTextNode = window.document.createTextNode("");
        fpsDOM.appendChild(fpsTextNode);
        msTextNode = window.document.createTextNode("");
        msDOM.appendChild(msTextNode);
    }

    export function tick(now: number, delta: number): void {
        ms = 0.9 * delta + 0.1 * ms;
        if (now >= lastFps + 1000) {
            fps = 0.9 * frames * 1000 / (now - lastFps) + 0.1 * fps;

            fpsTextNode.nodeValue = (~~fps).toString();
            msTextNode.nodeValue = ms.toFixed(2);

            lastFps = now - (delta % 1000 / 60);
            frames = 0;
        }
        frames++;
    }
}
