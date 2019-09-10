/// <reference path="./audio.ts" />
/// <reference path="./action.ts" />
/// <reference path="./util.ts" />
/// <reference path="./game-state.ts" />
/// <reference path="./scenes/game-scene.ts" />

// Empty Encounter Actions
function restAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot._total > 0;
    });

  const action: ActionCard = new ActionCard(
    "rest",
    "heal 10% hp",
    "any dice, 1 food",
    0xFF1A8944,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      let result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      result = result && gameState._food > 0 && gameState._hp < gameState._maxHp;
      return result;
    },
    () => {
      gameState._food--;
      heal(~~(gameState._maxHp * 0.10));
      healSound();
      action._destroy();
    });
  action._add(slot);
  return action;
}

function forageAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "min 2",
    (): boolean => {
      return slot._total > 1;
    });

  const action: ActionCard = new ActionCard(
    "forage",
    "gather food equal to half the dice value, rounded down",
    "min 2",
    0xFF1A8944,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._food += ~~(action._total / 2);
      getSound();
      action._destroy();
    });
  action._add(slot);
  return action;
}

// Camp Encounter Actions
function eatAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot._total > 0;
    });

  const action: ActionCard = new ActionCard(
    "eat",
    "gain max hp equal to half a dice value, rounded up",
    "any dice, 2 food",
    0xFF1A8944,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      let result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      result = result && gameState._food >= 2;
      return result;
    },
    () => {
      gameState._food -= 2;
      gameState._hp += Math.ceil(action._total / 2);
      gameState._maxHp += Math.ceil(action._total / 2);
      healSound();
      action._destroy();
    });
  action._add(slot);
  return action;
}

function sleepAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot._total > 0;
    });

  const action: ActionCard = new ActionCard(
    "sleep",
    "heal for dice value + 10% hp",
    "any dice",
    0xFF1A8944,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      let result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      result = result && gameState._hp < gameState._maxHp;
      return result;
    },
    () => {
      heal(Math.ceil(action._total + ~~(gameState._maxHp * 0.10)));
      healSound();
      action._destroy();
    });
  action._add(slot);
  return action;
}

function harvestAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot._total > 0;
    });

  const action: ActionCard = new ActionCard(
    "harvest",
    "gather food equal to the dice value",
    "any",
    0xFF1A8944,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._food += ~~(action._total / 2);
      getSound();
      action._destroy();
    });
  action._add(slot);
  return action;
}

// Default Fight Actions
function attackAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot._total > 0;
    });

  const action: ActionCard = new ActionCard(
    "attack",
    "attack for dice value",
    "any dice",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._encounter._enemy._hp -= action._total;
      dmgSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}

function defendAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot._total > 0;
    });

  const action: ActionCard = new ActionCard(
    "defend",
    "gain defense for half of a dice value, rounded up",
    "any dice",
    0xFF845700,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._def += Math.ceil(action._total / 2);
      defSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}

// Loot Actions
// Loot - any 1 dice, Take the Item
function lootAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot._total > 0;
    });

  const item: Item = gameState._lootDeck.pop();

  const action: ActionCard = new ActionCard(
    "loot",
    `obtain a [${item._name}] to use for the rest of this adventure`,
    "any dice",
    0xFF32AAEB,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._inventory.push(item);
      addItem(item);
      getSound();
      action._destroy();
    });
  action._add(slot);

  return action;
}

// Train - any 2 dice, get a new normal Dice (123456)
function trainAction(): ActionCard {
  const slot1: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot1._total > 0;
    });

  const slot2: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot2._total > 0;
    });

  const item: Item = diceItem();

  const action: ActionCard = new ActionCard(
    "train",
    `add a [normal die] to your collection`,
    "any 2 dice",
    0xFF32AAEB,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._inventory.push(item);
      const dice: Dice = new Dice([1, 2, 3, 4, 5, 6]);
      dice._lock = true;
      gameState._tray._dice.push({ _values: [1, 2, 3, 4, 5, 6], _colour: 0XFFFFFFFF });
      addItem(item);
      getSound();
      action._destroy();
    });
  action._add(slot1);
  action._add(slot2);

  return action;
}
// Take a Risk - any 2 dice, get a risk reward dice (111666)
function riskyAction(): ActionCard {
  const slot1: ActionSlot = new ActionSlot(
    "1 or 6",
    (): boolean => {
      return slot1._total === 1 || slot1._total === 6;
    });

  const slot2: ActionSlot = new ActionSlot(
    "1 or 6",
    (): boolean => {
      return slot2._total === 1 || slot2._total === 6;
    });

  const item: Item = riskyDiceItem();

  const action: ActionCard = new ActionCard(
    "take a risk",
    `add a [risky die] to your collection`,
    "2 dice valued at 1 or 6",
    0xFF32AAEB,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._inventory.push(item);
      gameState._tray._dice.push({ _values: [1, 1, 1, 6, 6, 6], _colour: 0xFF8888FF });
      addItem(item);
      getSound();
      action._destroy();
    });
  action._add(slot1);
  action._add(slot2);

  return action;
}

// Meditate - any 2 dice, get a middle of the road (233445)
function middlingAction(): ActionCard {
  const slot1: ActionSlot = new ActionSlot(
    "3 or 4",
    (): boolean => {
      return slot1._total === 3 || slot1._total === 4;
    });

  const slot2: ActionSlot = new ActionSlot(
    "3 or 4",
    (): boolean => {
      return slot2._total === 3 || slot2._total === 4;
    });

  const item: Item = midDiceItem();

  const action: ActionCard = new ActionCard(
    "meditate",
    `add a [middling die] to your collection`,
    "2 dice valued at 3 or 4",
    0xFF32AAEB,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._inventory.push(item);
      gameState._tray._dice.push({ _values: [2, 3, 3, 4, 4, 5], _colour: 0xFFFF8888 });
      addItem(item);
      getSound();
      action._destroy();
    });
  action._add(slot1);
  action._add(slot2);

  return action;
}

// Item Actions
function daggerAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "max 3",
    (): boolean => {
      return slot._total <= 3;
    });

  const action: ActionCard = new ActionCard(
    "dagger",
    "attack for dice value + 1",
    "3 or lower",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._encounter._enemy._hp -= action._total + 1;
      dmgSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}

function swordAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "max 3",
    (): boolean => {
      return slot._total <= 3;
    });

  const action: ActionCard = new ActionCard(
    "dagger",
    "attack for dice value + 1",
    "3 or lower",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._encounter._enemy._hp -= action._total + 1;
      dmgSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}

function bucklerAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "max 3",
    (): boolean => {
      return slot._total <= 3;
    });

  const action: ActionCard = new ActionCard(
    "dagger",
    "attack for dice value + 1",
    "3 or lower",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._encounter._enemy._hp -= action._total + 1;
      defSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}

function shieldAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "max 3",
    (): boolean => {
      return slot._total <= 3;
    });

  const action: ActionCard = new ActionCard(
    "dagger",
    "attack for dice value + 1",
    "3 or lower",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._encounter._enemy._hp -= action._total + 1;
      defSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}

function bandageAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "max 3",
    (): boolean => {
      return slot._total <= 3;
    });

  const action: ActionCard = new ActionCard(
    "dagger",
    "attack for dice value + 1",
    "3 or lower",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._encounter._enemy._hp -= action._total + 1;
      healSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}

function firstAidAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "max 3",
    (): boolean => {
      return slot._total <= 3;
    });

  const action: ActionCard = new ActionCard(
    "dagger",
    "attack for dice value + 1",
    "3 or lower",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action._nodes, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s._condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState._encounter._enemy._hp -= action._total + 1;
      healSound();
      action._hide(false);
    });
  action._add(slot);

  return action;
}
