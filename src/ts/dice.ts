/// <reference path="./scene-node.ts" />

class Dice extends SceneNode {
  public values: number[];
  public onClick: () => void;
  public parent: ActionSlot | DiceTray;
  public roll(): void {

  }
  public draw(): void {

  }
}

class DiceTray extends SceneNode {
  public onDrop: () => void;
}

class ActionSlot extends SceneNode {
  public parent: ActionCard;
  public onDrop: () => void;
}

class ActionCard extends SceneNode {
  public onDrop: () => void;
}