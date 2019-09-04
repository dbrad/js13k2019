/// <reference path="encounter.ts" />
/// <reference path="action-factory.ts" />
/// <reference path="util.ts" />

function emptyEncounter(): Encounter {
  const encounter: Encounter = new Encounter();
  encounter.food = rand(1, 3);
  encounter.add(restAction());
  encounter.add(searchAction());
  return encounter;
}
function campEncounter(): void { }
function enemeyEncounter(): void { }
function lootEncounter(): void { }
function bossEncounter(): void { }
