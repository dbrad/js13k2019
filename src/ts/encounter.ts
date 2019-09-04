/// <reference path="./scene-node.ts" />
/// <reference path="./draw.ts" />
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
  public enemy: any;
  public onEnter: () => void = (): void => { };
  public onComplete: () => void = (): void => { };
  constructor() {
    super();
    this.rel = { x: 0, y: 0 };
    this.size = { x: 800, y: 350 };
  }
  public update(delta: number, now: number): void {
    let row: number = 0;
    let col: number = 0;
    for (const [id, child] of this.children) {
      if (child instanceof ActionCard) {
        if (row > 3) {
          row = 0;
          col++;
        }
        child.rel.x = 2 + (child.size.x + 4) * col;
        child.rel.y = 2 + row * (child.size.y + 4);
        row++;
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
    for(let t: number = 0; t < 100; t++) {
      this.add(new Sprite(
        [
          { textureName: `tree`, duration: 0 }
        ],
        { x: rand(0, 800), y: rand(0,25) })
      );
    }
    this.player = new Sprite(
      [
        { textureName: "g_0", duration: 250 },
        { textureName: "g_1", duration: 250 }
      ],
      { x: 0, y: 26 });
    this.add(this.player);
    for(let t: number = 0; t < 100; t++) {
      this.add(new Sprite(
        [
          { textureName: `tree`, duration: 0 }
        ],
        { x: rand(0, 800), y: rand(55,100) })
      );
    }
  }
  public destroy(): void { }

  public update(delta: number, now: number): void {
    let currentNode: EncounterNode = this.playerNode;
    const startingX: number = (SCREEN_WIDTH / 2) - (32 * ~~(gameState.mapLength / 2)) - (16 * (gameState.mapLength % 2));
    const drawPos: V2 = { x: startingX, y: 42 };
    while (currentNode !== null) {
      currentNode.rel = V2.copy(drawPos);
      drawPos.x += 32;
      currentNode = currentNode.next;
    }
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
  public encounter: Encounter;
  constructor() {
    super();
    this.size = { x: 16, y: 16 };
  }
  public destroy(): void { }

  public draw(delta: number, now: number): void {
    if (this.next) {
      gl.col(0xFFFFFFFF);
      const origin: V2 = V2.add(this.abs, { x: 8, y: 8 });
      drawLine(origin, V2.add(origin, { x: 32, y: 0 }));
    }
    gl.col(0xFF8888ff);
    drawTexture("node", this.abs.x, this.abs.y);
    gl.col(0xFFFFFFFF);
    super.draw(delta, now);
  }
}
