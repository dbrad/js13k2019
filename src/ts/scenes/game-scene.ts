/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../button.ts" />
/// <reference path="../sprite.ts" />
/// <reference path="../dice.ts" />
/// <reference path="../encounter-factory.ts" />
/// <reference path="../scene-node.ts" />

enum Phase {
  Begin,
  Rolling,
  Player,
  Enemy,
  Restock,
  Victory,
  GameOver
}

let fwdBtn: Button;
let endBtn: Button;
let phase: Phase = Phase.Begin;
const gameScene: Scene =
  new Scene(
    "Game",
    () => {
      const root: SceneNode = gameScene.rootNode;

      root.add(gameState.tray);
      gameState.tray.rel = { x: 80, y: 280 };

      root.add(
        new Sprite(
          [
            { textureName: "g_0", duration: 250 },
            { textureName: "g_1", duration: 250 }
          ],
          { x: 0, y: 350 - (16 * 5) },
          { x: 5, y: 5 }));

      fwdBtn = new Button(
        "forward!",
        root.size.x - 120, root.size.y - 150,
        100, 30,
        (self: Button): void => {
          if (gameState.encounter) {
            gameScene.rootNode.remove(gameState.encounter);
          }
          gameState.map.playerNode = gameState.map.playerNode.next;
          gameState.encounter = gameState.map.playerNode.encounter;
          gameScene.rootNode.add(gameState.encounter);
          phase = Phase.Begin;
          if (gameState.food > 0) {
            gameState.food--; // TODO: minus food animation?
          } else {
            gameState.hp--; // TODO: Damage func with sound / animation?
            if (gameState.hp <= 0) {
              phase = Phase.GameOver;
            }
          }
          self.enabled = self.visible = false;
          endBtn.enabled = endBtn.visible = false;
        });
      root.add(fwdBtn);

      endBtn = new Button(
        "end turn",
        root.size.x - 120, root.size.y - 150,
        100, 30,
        (self: Button): void => {
          if (phase === Phase.Player) {
            phase = Phase.Enemy;
          }
          self.enabled = self.visible = false;
        });
      root.add(endBtn);

      root.add(gameState.map);
    },
    () => {
    },
    (delta: number, now: number) => {
      if ((!gameState.encounter) && gameState.map.playerNode.next) {
        fwdBtn.enabled = true;
        fwdBtn.visible = true;
        endBtn.enabled = false;
        endBtn.visible = false;
      } else {
        if (phase === Phase.GameOver) {
          // TODO: Gameover sequence
        } else if (phase === Phase.Begin) {
          // Get inventory actions inventory.getAction(combat)
          // add to encounter
          phase = Phase.Rolling;
        } else if (phase === Phase.Rolling) {
          gameState.tray.restock(now);
          phase = Phase.Player;
          endBtn.enabled = true;
          endBtn.visible = true;
        } else if (phase === Phase.Restock) {
          for (const [id, child] of gameState.encounter.children) {
            if (child instanceof ActionCard) {
              child.reset();
            }
          }
          phase = Phase.Rolling;
        }
        switch (gameState.encounter.type) {
          case EncounterType.Boss:
          case EncounterType.Fight:
            if (phase === Phase.Player) {
              if (gameState.encounter.enemy && gameState.encounter.enemy.isDead) {
                endBtn.enabled = false;
                endBtn.visible = false;
                fwdBtn.enabled = true;
                fwdBtn.visible = true;
              }
            } else if (phase === Phase.Enemy) {
              if (gameState.encounter.enemy) {
                gameState.encounter.enemy.turn();
              }
              if (gameState.hp <= 0) {
                phase = Phase.GameOver;
              } else {
                phase = Phase.Restock;
              }
            }
            break;
          case EncounterType.Camp:
            break;
          case EncounterType.Loot:
            break;
          case EncounterType.Empty:
          default:
            if (gameState.map.playerNode.next) {
              fwdBtn.enabled = true;
              fwdBtn.visible = true;
              endBtn.enabled = false;
              endBtn.visible = false;
            } else {
              fwdBtn.enabled = false;
              fwdBtn.visible = false;
            }
            break;
        }
      }
    },
    (delta: number) => {
      const root: SceneNode = gameScene.rootNode;
      drawText(`Food ${gameState.food}`, root.size.x - 70, root.size.y - 112, { textAlign: Align.CENTER });
      drawText(`HP ${gameState.hp}/${gameState.maxHp}`, 80, 330, { scale: 2 });
    }
  );
