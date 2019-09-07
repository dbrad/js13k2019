/// <reference path="./scene-node.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./interpolator.ts" />

class ActionSlot extends SceneNode {
  public parent: ActionCard;
  public condition: () => boolean;
  public text: string = "";
  constructor(text: string, condition: () => boolean) {
    super();
    this.text = text;
    this.condition = condition;
    this.size = { x: 32, y: 32 };
  }

  public total(): number {
    const values: number[] = Array.from(this.children, ([id, die]) => (die as Dice).value);
    return sum(...values);
  }

  public onDrop(): boolean {
    if (this.condition && this.condition()) {
      this.parent.onDrop();
      return true;
    }
    return false;
  }

  public update(delta: number, now: number): void {

  }

  public draw(delta: number, now: number): void {
    gl.col(0Xffffffff);
    drawTexture("d_s", this.abs.x, this.abs.y, 2, 2);
    drawText(this.text, this.abs.x + 17, this.abs.y + 34, { textAlign: Align.CENTER, colour: 0Xffcccccc });
    super.draw(delta, now);
  }
}

class ActionCard extends SceneNode {
  public name: string = "";
  public cost: string = "";
  public desc: string = "";
  public colour: number = 0xFF000000;
  private slots: number = 0;
  public condition: () => boolean;
  public onComplete: () => void;

  constructor(name: string, desc: string, cost: string, colour: number, condition: () => boolean, onComplete: () => void) {
    super();
    this.name = name;
    this.desc = desc;
    this.cost = cost;
    this.colour = colour;
    this.condition = condition;
    this.onComplete = onComplete;
    this.size = { x: 235, y: 64 };
  }

  public add(...nodes: SceneNode[]): void {
    for (const node of nodes) {
      if (node instanceof ActionSlot) {
        this.slots++;
        node.rel = { x: this.size.x - (this.slots * 37), y: 16 };
      }
    }
    super.add(...nodes);
  }

  public total(): number {
    const values: number[] = Array.from(this.children, ([id, s]) => (s as ActionSlot).total());
    return sum(...values);
  }

  public onDrop(): void {
    if (this.condition && this.condition()) {
      this.onComplete();
    }
  }
  public reset(): void {
    const slots: ActionSlot[] = Array.from(this.children, ([id, s]) => (s as ActionSlot));
    for (const slot of slots) {
      for (const [id, child] of slot.children) {
        child.destroy();
      }
    }
    this.enabled = true;
  }
  public hide(reset: boolean): void {
    this.moveTo({ x: -250, y: this.rel.y }, 250, () => { this.enabled = false; if (reset) { this.reset(); } }, easeInBack);
  }
  public destroy(): void {
    this.moveTo({ x: -250, y: this.rel.y }, 250, () => { super.destroy(); }, easeInBack);
  }
  public update(delta: number, now: number): void {
    super.update(delta, now);
  }
  public draw(delta: number, now: number): void {
    // Shadow
    gl.col(0x99000000);
    drawTexture("solid", this.abs.x + 1, this.abs.y + 1, this.size.x, this.size.y);

    // Box
    gl.col(this.colour);
    drawTexture("solid", this.abs.x, this.abs.y, this.size.x, this.size.y);

    // Body
    gl.col(0Xffffffff);
    drawText(this.name, this.abs.x + 5, this.abs.y + 3, { scale: 2 });
    drawTexture("solid", this.abs.x + 5, this.abs.y + 14, this.size.x - 10, 1);
    drawText(`cost: ${this.cost}`, this.abs.x + 5, this.abs.y + 16);
    drawText(this.desc, this.abs.x + 5, this.abs.y + 22, { wrap: 160 });
    super.draw(delta, now);
  }
}
