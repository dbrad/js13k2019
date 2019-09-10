/// <reference path="./item.ts" />

function daggerItem(): Item {
  return new Item("dagger", ItemType.combat, daggerAction, "dag");
}

function swordItem(): Item {
  return new Item("sword", ItemType.combat, swordAction, "sw");
}

function bucklerItem(): Item {
  return new Item("buckler", ItemType.combat, bucklerAction, "buc");
}

function shieldItem(): Item {
  return new Item("shield", ItemType.combat, shieldAction, "sh");
}

function bandageItem(): Item {
  return new Item("bandage", ItemType.any, bandageAction, "heal");
}

function firstAidItem(): Item {
  return new Item("first aid kit", ItemType.any, daggerAction, "heal");
}

function diceItem(): Item {
  return new Item("normal die", ItemType.dice, null, "die");
}

function riskyDiceItem(): Item {
  return new Item("risky die", ItemType.dice, null, "die", 0xFF8888FF);
}

function midDiceItem(): Item {
  return new Item("middling die", ItemType.dice, null, "die", 0xFFFF8888);
}
