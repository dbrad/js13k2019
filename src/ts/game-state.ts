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
  hp: number;
  difficulty: Difficulty;
  gameLength: GameLength;
  map: EncounterMap;
};

const gameState: GameState = {
  food: 0,
  hp: 0,
  difficulty: Difficulty.None,
  gameLength: GameLength.None,
  map: null
};
