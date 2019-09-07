/// <reference path="./dice.ts" />
/// <reference path="./encounter.ts" />

enum Difficulty {
  None,
  Easy,
  Medium,
  Hard
}

enum GameLength {
  None,
  Short,
  Medium,
  Long
}

type GameState = {
  food: number;
  maxHp: number;
  hp: number;
  def: number;
  diff: Difficulty;
  gameLength: GameLength;
  tray: DiceTray;
  map: EncounterMap;
  mapLength: number;
  encounter: Encounter;
};

const gameState: GameState = {
  food: 0,
  hp: 0,
  maxHp: 0,
  def: 0,
  diff: Difficulty.None,
  gameLength: GameLength.None,
  tray: null,
  map: null,
  mapLength: 0,
  encounter: null
};
