/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../button.ts" />
/// <reference path="../sprite.ts" />
/// <reference path="../scene-node.ts" />

const gameScene: Scene =
  new Scene(
    "Game",
    () => {
      gameScene.rootNode.add(new Button(
        "back",
        SCREEN_WIDTH / 2 - 50,
        SCREEN_HEIGHT / 2 + 20,
        100,
        20,
        () => {
          SceneManager.pop();
        }));

      gameScene.rootNode.add(
        new Sprite(
          [
            { textureName: "g_0", duration: 250 },
            { textureName: "g_1", duration: 250 }
          ],
          { x: 0, y: 0 },
          { x: 5, y: 5 }));

      gameScene.rootNode.add(
        new Sprite(
          [
            { textureName: "s_0", duration: 250 },
            { textureName: "s_1", duration: 250 }
          ],
          { x: SCREEN_WIDTH - 80, y: 0 },
          { x: 5, y: 5 }));

      gameScene.rootNode.add(gameState.map);
    },
    () => {
    },
    (delta: number) => { },
    (delta: number) => {
      drawText("gameplay sold seperately", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 16, { textAlign: Align.CENTER, scale: 3 });
    }
  );
