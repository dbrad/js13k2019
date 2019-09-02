/// <reference path="./events.ts" />
/// <reference path="./v2.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./scene-node.ts" />
/// <reference path="./debug.ts" />
/// <reference path="./zzfx.d.ts" />

class Button extends SceneNode {
  public text: string;
  public onClick: (self: Button) => void;
  private down: boolean = false;
  private hover: boolean = false;
  public colour: number;
  public colourNormal: number;
  public colourHover: number;
  public colourPressed: number;
  public shadow: number;
  constructor(
    text: string,
    x: number, y: number,
    w: number, h: number,
    onClick: (self: Button) => void,
    colourNormal: number = 0xFF3326be,
    colourHover: number = 0xFF3d2bd9,
    colourPressed: number = 0xFF271c8c,
    shadow: number = 0x99000000) {
    super();
    this.text = text;
    this.relPos = { x, y };
    this.size = { x: w, y: h };
    this.onClick = onClick;
    this.colour = colourNormal;
    this.colourNormal = colourNormal;
    this.colourHover = colourHover;
    this.colourPressed = colourPressed;
    this.shadow = shadow;

    subscribe("mousemove", `button_${this.id}`, (pos: V2, mousedown: boolean): void => {
      if (this.enabled && !mousedown && (!this.parent || this.parent.enabled)) {
        if (pos.x >= this.absPos.x && pos.x <= this.absPos.x + this.size.x &&
          pos.y >= this.absPos.y && pos.y <= this.absPos.y + this.size.y) {
          this.colour = this.colourHover;
          if (!this.hover) {
            zzfx(1, .02, 440, .05, .55, 0, 0, 0, .1);
          }
          this.hover = true;
        }
        else {
          this.colour = this.colourNormal;
          this.hover = false;
        }
      }
    });

    subscribe("mousedown", `button_${this.id}`, (pos: V2): void => {
      if (this.enabled && (!this.parent || this.parent.enabled)) {
        if (pos.x >= this.absPos.x && pos.x <= this.absPos.x + this.size.x &&
          pos.y >= this.absPos.y && pos.y <= this.absPos.y + this.size.y) {
          this.colour = this.colourPressed;
          this.relPos.x += 1;
          this.relPos.y += 1;
          if (!this.down) {
            zzfx(1, .02, 220, .05, .55, 0, 0, 0, .1); // ZzFX 0
          }
          this.down = true;
        }
      }
    });

    subscribe("mouseup", `button_${this.id}`, (pos: V2): void => {
      if (this.enabled && (!this.parent || this.parent.enabled)) {
        if (pos.x >= this.absPos.x && pos.x <= this.absPos.x + this.size.x &&
          pos.y >= this.absPos.y && pos.y <= this.absPos.y + this.size.y) {
          this.enabled = false;
          zzfx(1,.02,330,.05,.55,0,0,0,.1); // ZzFX 0
          this.onClick(this);
          this.colour = this.colourHover;
          this.enabled = true;
        }
        else {
          this.colour = this.colourNormal;
          if (this.down) {
            this.relPos.x -= 1;
            this.relPos.y -= 1;
            this.down = false;
          }
        }
      }
    });
  }
  public destroy(): void {
    unsubscribe("mousemove", `button_${this.id}`);
    unsubscribe("mousedown", `button_${this.id}`);
    unsubscribe("mouseup", `button_${this.id}`);
    super.destroy();
  }

  public draw(delta: number, now: number): void {
    if (this.visible) {
      // @ifdef DEBUG
      assert(!!(this.parent), this);
      // @endif
      if (!this.down) {
        gl.col(this.shadow);
        drawTexture("solid", this.absPos.x + 1, this.absPos.y + 1, this.size.x + 1, this.size.y + 1);
      }
      gl.col(this.colour);
      drawTexture("solid", this.absPos.x, this.absPos.y, this.size.x, this.size.y);
      gl.col(0XFFFFFFFF);
      drawText(this.text, this.absPos.x + ~~(this.size.x / 2), this.absPos.y - 2 + ~~(this.size.y / 2), { textAlign: Align.CENTER });
      super.draw(delta, now);
    }
  }
}
