/// <reference path="../button.ts" />
/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../sprite.ts" />

const mainMenuScene: Scene =
  new Scene(
    "MainMenu",
    () => {
      mainMenuScene.rootNode
        .add(new Button(
          "start game",
          SCREEN_WIDTH / 2 - 100,
          SCREEN_HEIGHT / 2 - 40,
          200,
          40,
          () => {
            SceneManager.push("GameSetup");
          }));
    },
    () => {
    },
    (delta: number) => { },
    (delta: number) => {
      //gl.col(0xFF000000);
      drawText("js13k 2019", 5, 5, Align.LEFT, 3);
      drawText("theme: back", 5, 25, Align.LEFT, 2);
      drawTexture("solid", 0, 40, 800, 1);
      drawTexture("solid", 0, 435, 800, 1);
      drawText(`(c) 2019 david brad`, 5, 440, Align.LEFT, 1);
    }
  );
