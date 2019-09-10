/// <reference path="./encounter.ts" />
/// <reference path="./action-factory.ts" />
/// <reference path="./enemy-factory.ts" />
/// <reference path="./util.ts" />
/// <reference path="./game-state.ts" />
/// <reference path="./scenes/game-scene.ts" />

function emptyEncounter(encounter: Encounter = new Encounter()): Encounter {
  encounter._empty();
  encounter._name = "clearing";
  encounter._type = EncounterType.Empty;
  encounter._add(restAction());
  encounter._add(forageAction());
  return encounter;
}

function campEncounter(): Encounter {
  const encounter: Encounter = new Encounter();
  encounter._name = "camp";
  encounter._type = EncounterType.Camp;
  encounter._add(eatAction());
  encounter._add(sleepAction());
  encounter._add(harvestAction());
  return encounter;
}

function enemyEncounter(difficulty: Dif, encounter: Encounter = new Encounter()): Encounter {
  encounter._type = EncounterType.Fight;
  encounter._name = "enemy";
  switch (difficulty) {
    case Dif.Easy:
      encounter._enemy = snakeEnemy();
      break;
    case Dif.Medium:
      encounter._enemy = boarEnemy();
      break;
    default:
      encounter._enemy = snakeEnemy();

  }
  encounter._add(encounter._enemy);
  encounter._enemy._rel = { x: encounter._size.x - 200, y: 270 };
  encounter._onComplete = () => {
    emptyEncounter(encounter);
  };
  encounter._add(attackAction());
  encounter._add(defendAction());
  return encounter;
}

function lootEncounter(encounter: Encounter = new Encounter()): Encounter {
  encounter._empty();
  encounter._name = "treasure";
  encounter._type = EncounterType.Loot;
  encounter._add(lootAction());
  encounter._add(trainAction());
  encounter._add(riskyAction());
  encounter._add(middlingAction());
  encounter._onComplete = () => {
  };
  return encounter;
}

function bossEncounter(difficulty: Dif): Encounter {
  const encounter: Encounter = enemyEncounter(difficulty);
  encounter._name = "boss fight";
  encounter._enemy._desc[0] = `${encounter._enemy._desc[0]} + ${encounter._enemy._desc[0]}`;
  encounter._type = EncounterType.Boss;
  encounter._enemy._name = `boss ${encounter._enemy._name}`;
  encounter._enemy._hp = encounter._enemy._maxHp = ~~(encounter._enemy._maxHp * 2);
  const dice: Dice = new Dice(encounter._enemy._dice[0]._values, 0xFFFFFFFF, 1);
  dice._used = true;
  dice._rel.x = -33;
  encounter._enemy._add(dice);
  encounter._onComplete = () => {
    phase = Phase.Begin;
    lootEncounter(encounter);
  };
  return encounter;
}
