/// <reference path="./assets.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./events.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./mouse.ts" />
/// <reference path="./stats.ts" />
/// <reference path="./v2.ts" />

const cursor: V2 = { x: 400, y: 225 };

window.addEventListener("load", async (): Promise<any> => {
  let then: number = 0;
  function tick(now: number): void {
    const delta: number = now - then;
    then = now;

    gl.cls();
    drawText("js13k 2019", 5, 5, Align.LEFT, 3);
    drawText("theme: back", 5, 25, Align.LEFT, 2);
    drawText("(c) 2019 david brad", 5, 440, Align.LEFT, 1);

    drawTexture("cursor", cursor.x, cursor.y);
    if (process.env.NODE_ENV === "development") {
      stats.tick(now, delta);
    }
    if (mouse.inputDisabled) {
      gl.col(0xAA222222);
      drawTexture("solid", 0, 0, 800, 450);
      gl.col(0xFFFFFFFF);
      drawText("click to focus game", 400, 225, Align.CENTER, 4);
    }
    gl.flush();
    requestAnimationFrame(tick);
  }

  const stage: HTMLDivElement = document.querySelector("#stage");
  const canvas: HTMLCanvasElement = document.querySelector("canvas");

  canvas.width = 800;
  canvas.height = 450;

  window.addEventListener(
    "resize",
    (): void => {
      const scaleX: number = window.innerWidth / canvas.width;
      const scaleY: number = window.innerHeight / canvas.height;
      let scaleToFit: number = Math.min(scaleX, scaleY) | 0;
      scaleToFit = scaleToFit <= 0 ? 1 : scaleToFit;
      const size: number[] = [canvas.width * scaleToFit, canvas.height * scaleToFit];
      const offset: number[] = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
      const rule: string = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scaleToFit + ")";
      stage.style.transform = rule;
      stage.style.webkitTransform = rule;
    }
  );

  if (process.env.NODE_ENV === "development") {
    stats.init();
  }

  gl.init(canvas);
  mouse.initialize(canvas);
  await load("sheet.json");

  subscribe("mousemove", "game", (pos: V2) => {
    V2.set(cursor, pos);
  });

  requestAnimationFrame(tick);
  window.dispatchEvent(new Event("resize"));
});
