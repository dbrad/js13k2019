/// <reference path="./scene-node.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./draw.ts" />

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
    drawTexture("d_s", this.abs.x, this.abs.y, 2, 2);
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
    drawTexture("solid", this.abs.x + 1, this.abs.y + 1, this.size.x, this.size.y);
    gl.col(this.colour);
    drawTexture("solid", this.abs.x, this.abs.y, this.size.x, this.size.y);
    gl.col(0Xffffffff);
    drawText(this.name, this.abs.x + 5, this.abs.y + 5, { scale: 2 });
    drawText(this.cost, this.abs.x + 5, this.abs.y + 16);
    drawText(this.desc, this.abs.x + 5, this.abs.y + 22);
    super.draw(delta, now);
  }
}
