/// <reference path="./action.ts" />
/// <reference path="./util.ts" />
/// <reference path="./game-state.ts" />

function restAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot.total() > 0;
    });

  const action: ActionCard = new ActionCard(
    "rest",
    "heal 10% hp",
    "any dice, 1 food",
    0xFF1A8944,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action.children, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s.condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      if (gameState.food > 0) {
        gameState.food--;
        gameState.hp += ~~(gameState.maxHp * 0.10);
        action.destroy();
      }
    });
  action.add(slot);
  return action;
}

function searchAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot.total() > 0;
    });

  const action: ActionCard = new ActionCard(
    "search",
    "search for food",
    "any dice",
    0xFF1A8944,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action.children, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s.condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState.food += (action.parent as Encounter).food;
      (action.parent as Encounter).food = 0;
      action.destroy();
    });
  action.add(slot);
  return action;
}

function attackAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot.total() > 0;
    });

  const action: ActionCard = new ActionCard(
    "attack",
    "attack for dice value",
    "any dice",
    0xFF3326BE,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action.children, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s.condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState.encounter.enemy.hp -= action.total();
      action.hide(false);
    });
  action.add(slot);

  return action;
}

function defendAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot(
    "any",
    (): boolean => {
      return slot.total() > 0;
    });

  const action: ActionCard = new ActionCard(
    "defend",
    "gain defense for half of a dice value, rounded up",
    "any dice",
    0xFF845700,
    (): boolean => {
      const slots: ActionSlot[] = Array.from(action.children, ([id, s]) => (s as ActionSlot));
      const conditions: boolean[] = slots.map(s => s.condition());
      const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
      return result;
    },
    () => {
      gameState.def+= action.total();
      action.hide(false);
    });
  action.add(slot);

  return action;
}
