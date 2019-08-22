/// <reference path="./consts.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./assets.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./mouse.ts" />
/// <reference path="./stats.ts" />
/// <reference path="./scene.ts" />
/// <reference path="./main-menu-scene.ts" />
/// <reference path="./game-scene.ts" />

enum Difficulty {
  Easy,
  Medium,
  Hard
}

enum GameLength {
  Short,
  Medium,
  Long
}

type GameState = {
  food: number;
  hp: number;
  difficult: Difficulty;
  gameLength: GameLength;
};

SceneManager.register(mainMenuScene);
SceneManager.register(gameScene);
SceneManager.push(mainMenuScene.name);

window.addEventListener("load", async (): Promise<any> => {
  let then: number = 0;
  function tick(now: number): void {
    const delta: number = now - then;
    then = now;

    SceneManager.update(delta);

    gl.cls();
    SceneManager.draw(delta);

    if (process.env.NODE_ENV === "development") {
      stats.tick(now, delta);
    }

    // if we lose mouse focus, put up an overlay
    if (mouse.inputDisabled) {
      gl.col(0xAA222222);
      drawTexture("solid", 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      gl.col(0xFFFFFFFF);
      drawText("click to focus game", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, Align.CENTER, 4);
    }

    gl.flush();
    requestAnimationFrame(tick);
  }

  const stage: HTMLDivElement = document.querySelector("#stage");
  const canvas: HTMLCanvasElement = document.querySelector("canvas");

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

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

  requestAnimationFrame(tick);
  window.dispatchEvent(new Event("resize"));
});
