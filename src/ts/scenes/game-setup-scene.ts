/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../util.ts" />
/// <reference path="../button.ts" />
/// <reference path="../encounter.ts" />
/// <reference path="../game-state.ts" />

let gameDifficultyContainer: SceneNode;
let gameLengthContainer: SceneNode;

const gameSetupScene: Scene =
  new Scene(
    "GameSetup",
    () => {
      gameState.food = 0;
      gameState.hp = 0;
      gameState.difficulty = Difficulty.None;
      gameState.gameLength = GameLength.None;

      gameDifficultyContainer = new SceneNode();
      gameDifficultyContainer.rel.x = SCREEN_WIDTH / 2 - 100;
      gameDifficultyContainer.rel.y = SCREEN_HEIGHT / 2 - 65;
      gameDifficultyContainer.size.x = 200;
      gameDifficultyContainer.size.y = 70;

      gameLengthContainer = new SceneNode();
      gameLengthContainer.rel.x = SCREEN_WIDTH / 2 - 100;
      gameLengthContainer.rel.y = SCREEN_HEIGHT / 2 - 65;
      gameLengthContainer.size.x = 200;
      gameLengthContainer.size.y = 70;

      gameSetupScene.rootNode.add(gameDifficultyContainer);
      gameSetupScene.rootNode.add(gameLengthContainer);

      gameDifficultyContainer
        .add(new Button(
          "easy",
          0,
          0,
          200,
          20,
          () => {
            gameState.difficulty = Difficulty.Easy;
          }));

      gameDifficultyContainer
        .add(new Button(
          "medium",
          0,
          25,
          200,
          20,
          () => {
            gameState.difficulty = Difficulty.Medium;
          }));

      gameDifficultyContainer
        .add(new Button(
          "hard",
          0,
          50,
          200,
          20,
          () => {
            gameState.difficulty = Difficulty.Hard;
          }));

      gameLengthContainer.add(new Button(
        "short",
        0, 0,
        200, 20,
        () => {
          gameState.gameLength = GameLength.Short;
          generateLevel();
          SceneManager.pop();
          SceneManager.push("Game");
        }));

      gameLengthContainer.add(new Button(
        "medium",
        0, 25,
        200, 20,
        () => {
          gameState.gameLength = GameLength.Medium;
          generateLevel();
          SceneManager.pop();
          SceneManager.push("Game");
        }));

      gameLengthContainer.add(new Button(
        "long",
        0, 50,
        200, 20,
        () => {
          gameState.gameLength = GameLength.Long;
          generateLevel();
          SceneManager.pop();
          SceneManager.push("Game");
        }));
    },
    () => {
    },
    (delta: number) => {
      if (gameState.difficulty === Difficulty.None) {
        gameDifficultyContainer.enabled = true;
        gameDifficultyContainer.visible = true;
        gameLengthContainer.enabled = false;
        gameLengthContainer.visible = false;
      } else {
        gameDifficultyContainer.enabled = false;
        gameDifficultyContainer.visible = false;
        gameLengthContainer.enabled = true;
        gameLengthContainer.visible = true;
      }
    },
    (delta: number) => {
      if (gameState.difficulty === Difficulty.None) {

      } else {

      }
    }
  );

function generateLevel(): void {
  gameState.map = new EncounterMap();
  const gameMap: EncounterNode[] = [];

  const firstNode: EncounterNode = new EncounterNode();
  gameState.map.playerNode = firstNode;
  gameMap.push(firstNode);

  gameMap.push(...generateEncounterNodeDeck(Difficulty.Easy, gameMap[gameMap.length - 1]));

  if (gameState.gameLength !== GameLength.Short) {
    gameMap.push(...generateEncounterNodeDeck(Difficulty.Easy, gameMap[gameMap.length - 1]));
  }

  if (gameState.difficulty === Difficulty.Easy) {
    gameMap.push(...generateEncounterNodeDeck(Difficulty.Easy, gameMap[gameMap.length - 1]));
  }

  // add camp
  // add medium enemy

  if (gameState.difficulty === Difficulty.Medium) {
    gameMap.push(...generateEncounterNodeDeck(Difficulty.Medium, gameMap[gameMap.length - 1]));
  }

  gameMap.push(...generateEncounterNodeDeck(Difficulty.Medium, gameMap[gameMap.length - 1]));

  if (gameState.gameLength !== GameLength.Short) {
    gameMap.push(...generateEncounterNodeDeck(Difficulty.Medium, gameMap[gameMap.length - 1]));
  }

  if (gameState.gameLength === GameLength.Long) {
    gameMap.push(...generateEncounterNodeDeck(Difficulty.Medium, gameMap[gameMap.length - 1]));
  }

  // add camp
  // add hard enemy

  if (gameState.difficulty === Difficulty.Hard) {
    gameMap.push(...generateEncounterNodeDeck(Difficulty.Hard, gameMap[gameMap.length - 1]));
  }

  if (gameState.gameLength === GameLength.Long) {
    gameMap.push(...generateEncounterNodeDeck(Difficulty.Hard, gameMap[gameMap.length - 1]));
  }

  gameMap.push(...generateEncounterNodeDeck(Difficulty.Hard, gameMap[gameMap.length - 1]));

  const bossNode: EncounterNode = new EncounterNode();
  gameMap[gameMap.length - 1].next = bossNode;
  bossNode.previous = gameMap[gameMap.length - 1];
  gameMap.push(bossNode);

  gameState.mapLength = gameMap.length;
  gameState.map.add(...gameMap);
}

function generateEncounterNodeDeck(difficulty: Difficulty, connectingNode: EncounterNode): EncounterNode[] {
  const nodes: EncounterNode[] = [];
  switch (difficulty) {
    case Difficulty.Hard:
      nodes.push(new EncounterNode());
      nodes.push(new EncounterNode());

      break;

    case Difficulty.Medium:
      nodes.push(new EncounterNode());
      nodes.push(new EncounterNode());

      break;

    case Difficulty.Easy:
    default:
      nodes.push(new EncounterNode());
      nodes.push(new EncounterNode());

      break;
  }

  const deck: EncounterNode[] = shuffle(nodes);
  for (let i: number = 0; i < deck.length; i++) {
    if (i !== deck.length - 1) {
      deck[i].next = deck[i + 1];
    }
    if (i !== 0) {
      deck[i].previous = deck[i - 1];
    } else {
      connectingNode.next = deck[i];
      deck[i].previous = connectingNode;
    }
  }
  return deck;
}
