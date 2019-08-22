/// <reference path="./consts.ts" />
/// <reference path="./scene.ts" />

const gameScene: Scene =
  new Scene(
    "Game",
    () => { },
    () => { },
    (delta: number) => { },
    (delta: number) => {
      drawText("game", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 16, Align.CENTER, 3);
      drawTexture("solid", 0, 350, 800, 1);
    }
  );

gameScene.rootNode.addChild(new Button(
  "back",
  SCREEN_WIDTH / 2 - 50,
  SCREEN_HEIGHT / 2 + 20,
  100,
  20,
  () => {
    SceneManager.pop();
  },
  0xFF444444,
  0xff666666,
  0xff222222));

const guy: Sprite =
  new Sprite(
    [
      { textureName: "g_0", duration: 250 },
      { textureName: "g_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2 - 16, y: SCREEN_HEIGHT / 2 - 32 },
    { x: 1, y: 1 });

const snake: Sprite =
  new Sprite(
    [
      { textureName: "s_0", duration: 250 },
      { textureName: "s_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 - 32 },
    { x: 1, y: 1 });

gameScene.rootNode.addChild(guy);
gameScene.rootNode.addChild(snake);
