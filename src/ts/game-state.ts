/// <reference path="./dice.ts" />

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
  difficulty: Difficulty;
  gameLength: GameLength;
  map: EncounterMap;
  mapLength: number;
};

const gameState: GameState = {
  food: 0,
  hp: 0,
  maxHp: 0,
  difficulty: Difficulty.None,
  gameLength: GameLength.None,
  map: null,
  mapLength: 0
};
