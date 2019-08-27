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

class EncounterMap extends SceneNode {
  public playerNode: EncounterNode;
  constructor() {
    super();
    this.relPos.x = 0;
    this.relPos.y = 350;
    this.size.x = 800;
    this.size.y = 100;
    this.add(
      new Sprite(
        [
          { textureName: "g_0", duration: 250 },
          { textureName: "g_1", duration: 250 }
        ],
        { x: 32, y: 26 }));
  }
  public destroy(): void { }

  public update(delta: number): void {
    let currentNode: EncounterNode = this.playerNode;
    const drawPos: V2 = { x: 32, y: 42 };
    while (currentNode !== null) {
      currentNode.relPos = V2.copy(drawPos);
      drawPos.x += 32;
      currentNode = currentNode.next;
    }
    super.update(delta);
  }

  public draw(delta: number): void {
    gl.col(0xFF000000);
    drawTexture("solid", this.absPos.x, this.absPos.y, 800, 100);
    gl.col(0Xffffffff);
    super.draw(delta);
  }
}

class EncounterNode extends SceneNode {
  public next: EncounterNode = null;
  public previous: EncounterNode = null;
  constructor() {
    super();
  }
  public destroy(): void { }

  public draw(delta: number): void {
    if (this.next) {
      gl.col(0xFFFFFFFF);
      const origin: V2 = V2.add(this.absPos, { x: 8, y: 8 });
      drawLine(origin, V2.add(origin, { x: 32, y: 0 }));
    }
    gl.col(0xFF8888ff);
    drawTexture("node", this.absPos.x, this.absPos.y);
    gl.col(0xFFFFFFFF);
  }
}
