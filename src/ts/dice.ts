/// <reference path="./scene-node.ts" />
/// <reference path="./util.ts" />
/// <reference path="./events.ts" />

type DiceDef = {
  values: number[];
  colour: number;
};

class Dice extends SceneNode {
  public values: number[];
  public colour: number;
  public value: number = 1;
  private rolling: boolean = false;
  private rollStart: number = 0;
  private rollDuration: number = 0;
  private held: boolean = false;
  private used: boolean = false;
  public locked: boolean = false;

  constructor(values: number[] = [1, 2, 3, 4, 5, 6], colour: number = 0xFFFFFFFF) {
    super();
    this.values = values;
    this.colour = colour;
    this.size = { x: 32, y: 32 };
    subscribe("mousedown", `dice_${this.id}`, (pos: V2): void => {
      if (!this.used && !this.locked &&
        mouse.over.has(this.id) && !this.rolling) {
        this.scene.cursor.add(this);
        this.rel = { x: -16, y: -16 };
        this.held = true;
      }
    });
    subscribe("mouseup", `dice_${this.id}`, (pos: V2): void => {
      if (this.held) {
        this.held = false;
        for (const [id, node] of mouse.over) {
          if (node instanceof ActionSlot && node.children.size === 0) {
            this.rel = { x: 0, y: 0 };
            node.add(this);
            if (node.onDrop()) {
              this.used = true;
              return;
            }
          }
        }
        gameState.tray.add(this);
      }
    });
  }
  public destroy(): void {
    unsubscribe("mousedown", `dice_${this.id}`);
    unsubscribe("mouseup", `dice_${this.id}`);
    super.destroy();
  }

  public update(delta: number, now: number): void {
    if (this.rolling) {
      this.roll(now);
    }
  }

  public roll(now: number): void {
    if (!this.rolling) {
      this.rolling = true;
      this.rollStart = now;
      this.rollDuration = rand(222, 1111);
    }
    if (this.rolling && now - this.rollStart >= this.rollDuration) {
      this.rolling = false;
      zzfx(1, .02, 330, .05, .55, 0, 0, 0, .1); // ZzFX 0
      return;
    }
    this.value = this.values[rand(0, 5)];
  }

  public draw(delta: number, now: number): void {
    gl.col(this.colour);
    drawTexture(`d_${this.value}`, this.abs.x, this.abs.y, 2, 2);
    gl.col(0xFFFFFFFF);
    if (this.locked) {
      drawTexture(`d_l`, this.abs.x, this.abs.y, 2, 2);
    }
    super.draw(delta, now);
  }
}

class DiceTray extends SceneNode {
  public dice: DiceDef[] = [];
  public onDrop: () => void;
  public constructor() {
    super();
    this.size.x = 40;
    this.size.y = 40;
  }
  public restock(now: number): void {
    this.children.clear();
    for (const def of this.dice) {
      const die: Dice = new Dice(def.values, def.colour);
      die.roll(now + 500);
      this.add(die);
    }
  }
  public update(delta: number, now: number): void {
    let xOff: number = 4;
    for (const [id, child] of this.children) {
      if (child instanceof Dice) {
        child.rel = { x: xOff, y: 4 };
        xOff += 36;
      }
    }
    this.size.x = this.dice.length * 36 + 4;
    super.update(delta, now);
  }
  public draw(delta: number, now: number): void {
    gl.col(0x77000000);
    drawTexture(`solid`, this.abs.x, this.abs.y, this.size.x, this.size.y);
    gl.col(0xFFFFFFFF);
    super.draw(delta, now);
  }
}
