/// <reference path="./scene-node.ts" />
/// <reference path="./util.ts" />
/// <reference path="./events.ts" />

class Dice extends SceneNode {
  public values: number[] = [1, 2, 3, 4, 5, 6];
  public value: number = 1;
  private rolling: boolean = false;
  private rollStart: number = 0;
  private rollDuration: number = 0;
  private held: boolean = false;

  constructor() {
    super();
    this.size = { x: 32, y: 32 };
    subscribe("mousedown", `dice_${this.id}`, (pos: V2): void => {
      if (mouse.over.has(this.id)) {
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
            return;
          }
        }
        this.rel = { x: 100, y: 250 };
        this.scene.rootNode.add(this);
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
    drawTexture(`d_${this.value}`, this.abs.x, this.abs.y, 2, 2);
    super.draw(delta, now);
  }
}

class DiceTray extends SceneNode {
  public onDrop: () => void;
}
