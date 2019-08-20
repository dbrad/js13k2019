/// <reference path="./events.ts" />
/// <reference path="./v2.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./scene-node.ts" />

class Button extends SceneNode {
  public text: string;
  public enabled: boolean = true;
  public onClick: () => void;
  public colour: number = 0xFFFF4444;
  public colourNormal: number = 0xFFFF4444;
  public colourHover: number = 0xFFFF5555;
  public colourPressed: number = 0xFFFF1111;
  constructor(text: string, x: number, y: number, w: number, h: number, onClick: () => void, colourNormal: number, colourHover: number, colourPressed: number) {
    super();
    this.text = text;
    this.positon = { x, y };
    this.size = { x: w, y: h };
    this.onClick = onClick;
    this.colourNormal = colourNormal;
    this.colourHover = colourHover;
    this.colourPressed = colourPressed;

    subscribe("mousemove", `button_${this.id}`, (pos: V2, mousedown: boolean): void => {
      if (this.enabled && !mousedown) {
        if (pos.x >= this.positon.x && pos.x <= this.positon.x + this.size.x &&
          pos.y >= this.positon.y && pos.y <= this.positon.y + this.size.y) {
          this.colour = this.colourHover;
        }
        else {
          this.colour = this.colourNormal;
        }
      }
    });

    subscribe("mousedown", `button_${this.id}`, (pos: V2): void => {
      if (this.enabled) {
        if (pos.x >= this.positon.x && pos.x <= this.positon.x + this.size.x &&
          pos.y >= this.positon.y && pos.y <= this.positon.y + this.size.y) {
          this.colour = this.colourPressed;
        }
      }
    });

    subscribe("mouseup", `button_${this.id}`, (pos: V2): void => {
      if (this.enabled) {
        if (pos.x >= this.positon.x && pos.x <= this.positon.x + this.size.x &&
          pos.y >= this.positon.y && pos.y <= this.positon.y + this.size.y) {
          this.enabled = false;
          this.onClick();
          this.colour = this.colourHover;
          this.enabled = true;
        }
        else {
          this.colour = this.colourNormal;
        }
      }
    });
  }
  public destroy(): void {
    unsubscribe("mousemove", `button_${this.id}`);
    unsubscribe("mousedown", `button_${this.id}`);
    unsubscribe("mouseup", `button_${this.id}`);
  }

  public draw(delta: number): void {
    gl.col(this.colour);
    drawTexture("solid", this.positon.x, this.positon.y, this.size.x, this.size.y);
    gl.col(0XFFFFFFFF);
    drawText(this.text, this.positon.x + ~~(this.size.x / 2), this.positon.y - 2 + ~~(this.size.y / 2), Align.CENTER, 1);
    super.draw(delta);
  }
}
