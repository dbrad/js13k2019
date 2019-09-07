/// <reference path="encounter.ts" />
/// <reference path="action-factory.ts" />
/// <reference path="enemy-factory.ts" />
/// <reference path="util.ts" />
/// <reference path="game-state.ts" />

function emptyEncounter(encounter: Encounter = new Encounter()): Encounter {
  encounter.empty();
  encounter.type = EncounterType.Empty;
  encounter.food = rand(1, 3);
  encounter.add(restAction());
  encounter.add(searchAction());
  return encounter;
}
function campEncounter(): void { }
function enemyEncounter(difficulty: Difficulty): Encounter {
  const encounter: Encounter = new Encounter();
  encounter.type = EncounterType.Fight;
  encounter.enemy = snakeEnemy();
  encounter.add(encounter.enemy);
  encounter.enemy.rel = { x: encounter.size.x - encounter.enemy.size.x, y: 0 };
  encounter.onComplete = () => {
    emptyEncounter(encounter);
  };
  encounter.add(attackAction());
  encounter.add(defendAction());
  return encounter;
}
function lootEncounter(): void { }
function bossEncounter(): void { }
