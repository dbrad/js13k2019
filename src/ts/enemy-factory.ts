/// <reference path="./sprite.ts" />
/// <reference path="./enemy.ts" />

function snakeEnemy(): Enemy {
  const enemy: Enemy = new Enemy();
  enemy.maxHp = enemy.hp = rand(8, 10);
  enemy.add(new Sprite(
    [
      { textureName: "s_0", duration: 250 },
      { textureName: "s_1", duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy.size = { x: 80, y: 80 };
  enemy.turn = () => {
    gameState.hp -= rand(1, 2);
    const org: V2 = V2.copy(enemy.rel);
    enemy.moveTo(V2.add(enemy.rel, { x: -10, y: 0 }), 100, () => { zzfx(.1, .1, 440, .7, .4, 10, 2, 60, 0); enemy.moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}
