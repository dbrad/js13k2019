/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../button.ts" />
/// <reference path="../sprite.ts" />
/// <reference path="../dice.ts" />
/// <reference path="../encounter-factory.ts" />
/// <reference path="../scene-node.ts" />

const gameScene: Scene =
  new Scene(
    "Game",
    () => {
      const encounter: Encounter = emptyEncounter();
      gameScene.rootNode.add(encounter);

      encounter.add(
        new Sprite(
          [
            { textureName: "g_0", duration: 250 },
            { textureName: "g_1", duration: 250 }
          ],
          { x: 0, y: 350 - (16 * 5) },
          { x: 5, y: 5 }));

      encounter.add(
        new Sprite(
          [
            { textureName: "s_0", duration: 250 },
            { textureName: "s_1", duration: 250 }
          ],
          { x: SCREEN_WIDTH - 80, y: 0 },
          { x: 5, y: 5 },
          0XFFaaFFFF));

      const dice: Dice = new Dice();
      dice.rel = { x: 80, y: encounter.size.y - 48 };
      encounter.add(dice);

      const dice2: Dice = new Dice();
      dice2.rel = { x: 120, y: encounter.size.y - 48 };
      encounter.add(dice2);

      const dice3: Dice = new Dice();
      dice3.rel = { x: 160, y: encounter.size.y - 48 };
      encounter.add(dice3);

      gameScene.rootNode.add(gameState.map);
    },
    () => {
    },
    (delta: number) => {
    },
    (delta: number) => {
    }
  );
