/// <reference path="./action.ts" />
/// <reference path="./util.ts" />
/// <reference path="./game-state.ts" />

function restAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot();
  slot.rel = { x: 235 - 48, y: 16 };
  slot.condition = (): boolean => {
    const values: number[] = Array.from(slot.children, ([id, die]) => (die as Dice).value);
    return sum(...values) > 0;
  };

  const action: ActionCard = new ActionCard();
  action.name = "rest";
  action.desc = "heal 10% hp";
  action.cost = "any dice + 1 food";
  action.colour = 0xFF1A8944;
  action.add(slot);
  action.condition = (): boolean => {
    const slots: ActionSlot[] = Array.from(action.children, ([id, s]) => (s as ActionSlot));
    const conditions: boolean[] = slots.map(s => s.condition());
    const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
    return result;
  };
  action.onComplete = () => {
    if (gameState.food > 0) {
      gameState.food--;
      gameState.hp += ~~(gameState.maxHp * 0.10);
      action.destroy();
    }
  };
  return action;
}

function searchAction(): ActionCard {
  const slot: ActionSlot = new ActionSlot();
  slot.rel = { x: 235 - 48, y: 16 };
  slot.condition = (): boolean => {
    const values: number[] = Array.from(slot.children, ([id, die]) => (die as Dice).value);
    return sum(...values) > 0;
  };

  const action: ActionCard = new ActionCard();
  action.name = "search";
  action.desc = "search for food";
  action.cost = "any dice";
  action.colour = 0xFF1a8944;
  action.add(slot);
  action.condition = (): boolean => {
    const slots: ActionSlot[] = Array.from(action.children, ([id, s]) => (s as ActionSlot));
    const conditions: boolean[] = slots.map(s => s.condition());
    const result: boolean = conditions.reduce((acc, value) => { return acc = acc && value; }, true);
    return result;
  };
  action.onComplete = () => {
    gameState.food += (action.parent as Encounter).food;
    (action.parent as Encounter).food = 0;
    action.destroy();
  };
  return action;
}
