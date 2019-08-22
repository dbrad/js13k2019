/// <reference path="./button.ts" />
/// <reference path="./consts.ts" />
/// <reference path="./scene.ts" />
/// <reference path="./sprite.ts" />

const mainMenuScene: Scene =
  new Scene(
    "MainMenu",
    () => { },
    () => { },
    (delta: number) => { },
    (delta: number) => {
      drawText("js13k 2019", 5, 5, Align.LEFT, 3);
      drawText("theme: back", 5, 25, Align.LEFT, 2);
      drawTexture("solid", 0, 40, 800, 1);
      drawTexture("solid", 0, 435, 800, 1);
      drawText(`(c) 2019 david brad`, 5, 440, Align.LEFT, 1);
    }
  );

const button: Button = new Button(
  "start game",
  SCREEN_WIDTH / 2 - 100,
  SCREEN_HEIGHT / 2 - 40,
  200,
  40,
  () => {
    SceneManager.push("Game");
  },
  0xFF444444,
  0xff666666,
  0xff222222);

const guy1: Sprite =
  new Sprite(
    [
      { textureName: "g_0", duration: 250 },
      { textureName: "g_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2 - 117, y: SCREEN_HEIGHT / 2 - 16 },
    { x: 1, y: 1 });

const guy2: Sprite =
  new Sprite(
    [
      { textureName: "g_0", duration: 250 },
      { textureName: "g_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2 - (117 + 33), y: SCREEN_HEIGHT / 2 - 32 },
    { x: 2, y: 2 });

const guy3: Sprite =
  new Sprite(
    [
      { textureName: "g_0", duration: 250 },
      { textureName: "g_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2 - (117 + 33 + 49), y: SCREEN_HEIGHT / 2 - 48 },
    { x: 3, y: 3 });

const snake1: Sprite =
  new Sprite(
    [
      { textureName: "s_0", duration: 250 },
      { textureName: "s_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2 + 101, y: SCREEN_HEIGHT / 2 - 16 },
    { x: 1, y: 1 });

const snake2: Sprite =
  new Sprite(
    [
      { textureName: "s_0", duration: 250 },
      { textureName: "s_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2 + (101 + 17), y: SCREEN_HEIGHT / 2 - 32 },
    { x: 2, y: 2 });

const snake3: Sprite =
  new Sprite(
    [
      { textureName: "s_0", duration: 250 },
      { textureName: "s_1", duration: 250 }
    ],
    { x: SCREEN_WIDTH / 2 + (101 + 17 + 33), y: SCREEN_HEIGHT / 2 - 48 },
    { x: 3, y: 3 });

mainMenuScene.rootNode.addChild(button);
mainMenuScene.rootNode.addChild(guy1);
mainMenuScene.rootNode.addChild(guy2);
mainMenuScene.rootNode.addChild(guy3);
mainMenuScene.rootNode.addChild(snake1);
mainMenuScene.rootNode.addChild(snake2);
mainMenuScene.rootNode.addChild(snake3);
