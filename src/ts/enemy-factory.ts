/// <reference path="./sprite.ts" />
/// <reference path="./enemy.ts" />

function snakeEnemy(): Enemy {
  const enemy: Enemy = new Enemy([1, 1, 1, 2, 2, 2]);
  enemy._name = "snake";
  enemy._desc.push("1-2 dmg");
  enemy._maxHp = enemy._hp = rand(8, 10);
  enemy._add(new Sprite(
    [
      { _tex: "s_0", _duration: 250 },
      { _tex: "s_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(.1, .1, 440, .7, .4, 10, 2, 60, 0); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}

function boarEnemy(): Enemy {
  const enemy: Enemy = new Enemy([1, 1, 2, 2, 3, 3]);
  enemy._name = "boar";
  enemy._desc.push("1-3 dmg");
  enemy._desc.push("+stun");
  enemy._maxHp = enemy._hp = rand(10, 15);
  enemy._add(new Sprite(
    [
      { _tex: "b_0", _duration: 250 },
      { _tex: "b_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    gameState._debuffs.push("stun");
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(1, .1, 2, .2, .1, 1.5, .4, 22, .62); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}

function wolfEnemy(): Enemy {
  const enemy: Enemy = new Enemy([1, 1, 2, 2, 3, 3]);
  enemy._name = "boar";
  enemy._desc.push("1-3 dmg");
  enemy._desc.push("+stun");
  enemy._maxHp = enemy._hp = rand(10, 15);
  enemy._add(new Sprite(
    [
      { _tex: "b_0", _duration: 250 },
      { _tex: "b_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    gameState._debuffs.push("stun");
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(1, .1, 2, .2, .1, 1.5, .4, 22, .62); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}

function bearEnemy(): Enemy {
  const enemy: Enemy = new Enemy([1, 1, 2, 2, 3, 3]);
  enemy._name = "boar";
  enemy._desc.push("1-3 dmg");
  enemy._desc.push("+stun");
  enemy._maxHp = enemy._hp = rand(10, 15);
  enemy._add(new Sprite(
    [
      { _tex: "b_0", _duration: 250 },
      { _tex: "b_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    gameState._debuffs.push("stun");
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(1, .1, 2, .2, .1, 1.5, .4, 22, .62); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}
