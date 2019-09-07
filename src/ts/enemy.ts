/// <reference path="./scene-node.ts" />
/// <reference path="./interpolator.ts" />

class Enemy extends SceneNode {
  public get isDead(): boolean {
    return this.hp <= 0;
  }
  public maxHp: number = 0;
  public hp: number = 0;
  public turn: () => void;

  public draw(delta: number, now: number): void {
    drawText(`${this.hp <= 0 ? 0 : this.hp}/${this.maxHp}`, this.abs.x + 40, this.abs.y + 85, { textAlign: Align.CENTER, scale: 2 });
    super.draw(delta, now);
  }
}
