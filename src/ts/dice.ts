/// <reference path="./scene-node.ts" />
/// <reference path="./util.ts" />
/// <reference path="./events.ts" />

class Dice extends SceneNode {
  public values: number[] = [1, 2, 3, 4, 5, 6];
  public value: number = 1;
  private rolling: boolean = false;
  private rollStart: number = 0;
  private rollDuration: number = 0;
  public onClick: (self: Dice) => void;
  public parent: ActionSlot | DiceTray;
  public pickedUp: boolean;

  constructor() {
    super();
    this.size = { x: 32, y: 32 };
    subscribe("mouseup", `dice_${this.id}`, (pos: V2): void => {
      if (this.enabled && (!this.parent || this.parent.enabled)) {
        if (pos.x >= this.absPos.x && pos.x <= this.absPos.x + this.size.x &&
          pos.y >= this.absPos.y && pos.y <= this.absPos.y + this.size.y) {
          this.enabled = false;
          this.roll(performance.now());
          //this.onClick(this);
          this.enabled = true;
        }
      }
    });
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
    drawTexture(`d_${this.value}`, this.absPos.x, this.absPos.y, 2, 2);
    super.draw(delta, now);
  }
}

class DiceTray extends SceneNode {
  public onDrop: () => void;
}

class ActionSlot extends SceneNode {
  public parent: ActionCard;
  public condition: () => boolean;
  public onDrop: () => void;
  constructor() {
    super();
    this.size = { x: 32, y: 32 };
  }
  public update(delta: number, now: number): void {

  }
  public draw(delta: number, now: number): void {
    gl.col(0Xffffffff);
    drawTexture("d_s", this.absPos.x, this.absPos.y, 2, 2);
    gl.col(0Xffffffff);
    super.draw(delta, now);
  }
}

class ActionCard extends SceneNode {
  public name: string = "";
  public cost: string = "";
  public desc: string = "";
  public colour: number = 0xFF000000;
  public condition: () => boolean;
  public onComplete: () => void;

  constructor() {
    super();
    this.size = { x: 235, y: 64 };
  }

  public onDrop(): void {
    if (this.condition && this.condition()) {
      this.onComplete();
    }
  }
  public update(delta: number, now: number): void {

  }
  public draw(delta: number, now: number): void {
    gl.col(0x99000000);
    drawTexture("solid", this.absPos.x + 1, this.absPos.y + 1, this.size.x, this.size.y);
    gl.col(this.colour);
    drawTexture("solid", this.absPos.x, this.absPos.y, this.size.x, this.size.y);
    gl.col(0Xffffffff);
    drawText(this.name, this.absPos.x + 5, this.absPos.y + 5, { scale: 2 });
    drawText(this.cost, this.absPos.x + 5, this.absPos.y + 16);
    drawText(this.desc, this.absPos.x + 5, this.absPos.y + 22);
    super.draw(delta, now);
  }
}
