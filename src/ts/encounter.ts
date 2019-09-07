/// <reference path="./scene-node.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./enemy.ts" />
/// <reference path="./dice.ts" />
/// <reference path="./sprite.ts" />
/// <reference path="./consts.ts" />
/// <reference path="./game-state.ts" />

enum EncounterType {
  Empty,
  Camp,
  Loot,
  Fight,
  Boss
}

class Encounter extends SceneNode {
  public type: EncounterType;
  public loot: any;
  public food: number;
  public enemy: Enemy;
  public isComplete: boolean = false;
  public onComplete: () => void = (): void => { };
  constructor() {
    super();
    this.rel = { x: 0, y: 0 };
    this.size = { x: 800, y: 350 };
  }
  public empty(): void {
    for (const [id, child] of this.children) {
      if (child instanceof ActionCard) {
        child.destroy();
      }
    }
    if (this.enemy) {
      this.remove(this.enemy);
      this.enemy = null;
    }
  }
  public update(delta: number, now: number): void {
    let actionCount: number = 0;
    let row: number = 0;
    let col: number = 0;
    for (const [id, child] of this.children) {
      if (child instanceof ActionCard) {
        actionCount++;
        if (row > 3) {
          row = 0;
          col++;
        }
        if (child.enabled && !child.animation) {
          child.moveTo({ x: 2 + (child.size.x + 4) * col, y: 2 + row * (child.size.y + 4) }, 250);
        }
        row++;
      }
    }
    if (!this.isComplete) {
      if ((actionCount === 0 && !this.enemy) ||
        (this.enemy && this.enemy.isDead)) {
        this.isComplete = true;
        this.onComplete();
      }
    }
    super.update(delta, now);
  }
  public draw(delta: number, now: number): void {
    super.draw(delta, now);
  }
}

class EncounterMap extends SceneNode {
  public playerNode: EncounterNode;
  public player: Sprite;
  constructor() {
    super();
    this.rel.x = 0;
    this.rel.y = 350;
    this.size.x = 800;
    this.size.y = 100;
    for (let x: number = 0; x < 100; x++) {
      for (let y: number = 0; y < 13; y++) {
        this.add(
          new Sprite(
            [
              { textureName: `gr_${rand(0, 3)}`, duration: 0 }
            ],
            { x: x * 8, y: y * 8 },
            { x: 1, y: 1 },
            0xFF33aa33)
        );
      }
    }
    for (let t: number = 0; t < 100; t++) {
      this.add(new Sprite(
        [
          { textureName: `tree`, duration: 0 }
        ],
        { x: rand(0, 800), y: rand(0, 25) })
      );
    }
    this.player = new Sprite(
      [
        { textureName: "g_0", duration: 250 },
        { textureName: "g_1", duration: 250 }
      ],
      { x: 0, y: 26 });
    this.add(this.player);
    for (let t: number = 0; t < 100; t++) {
      this.add(new Sprite(
        [
          { textureName: `tree`, duration: 0 }
        ],
        { x: rand(0, 800), y: rand(55, 100) })
      );
    }
  }
  public destroy(): void { }

  public update(delta: number, now: number): void {
    this.player.rel.x = this.playerNode.rel.x;
    super.update(delta, now);
  }

  public draw(delta: number, now: number): void {
    /*
    gl.col(0xFF2B3C49);
    drawTexture("solid", this.absPos.x, this.absPos.y, 800, 100);
    gl.col(0x33FFFFFF);
    drawTexture("solid", this.absPos.x, this.absPos.y, 800, 100);
    */
    super.draw(delta, now);
    gl.col(0Xffffffff);
    drawTexture("solid", this.abs.x, this.abs.y, 800, 1);
  }
}

class EncounterNode extends SceneNode {
  public next: EncounterNode = null;
  public previous: EncounterNode = null;
  public encounter: Encounter = null;
  constructor(encounter: Encounter = emptyEncounter()) {
    super();
    this.size = { x: 16, y: 16 };
    this.encounter = encounter;
  }
  public destroy(): void { }

  public draw(delta: number, now: number): void {
    if (this.next) {
      gl.col(0xFFFFFFFF);
      const origin: V2 = V2.add(this.abs, { x: 8, y: 8 });
      drawLine(origin, V2.add(origin, { x: 16, y: 0 }));
    }
    gl.col(0xFF8888ff);
    drawTexture("node", this.abs.x, this.abs.y);
    gl.col(0xFFFFFFFF);
    super.draw(delta, now);
  }
}
