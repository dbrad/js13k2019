/// <reference path="./consts.ts" />
/// <reference path="./assets.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./events.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./mouse.ts" />
/// <reference path="./stats.ts" />
/// <reference path="./v2.ts" />

const cursor: V2 = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 };

class SceneNode {
  private static idGen: number = 0;
  public id: number;
  public parent: SceneNode;
  public children: Map<number, SceneNode> = new Map();
  public positon: V2;
  public size: V2;

  constructor() {
    this.id = SceneNode.idGen++;
  }

  public addChild(node: SceneNode): void {
    this.children.set(node.id, node);
  }

  public removeChild(node: SceneNode): void {
    this.children.delete(node.id);
  }

  public destroy(): void {
    for (const [id, node] of this.children) {
      node.destroy();
    }
  }

  public update(delta: number): void {
    for (const [id, node] of this.children) {
      node.update(delta);
    }
  }

  public draw(delta: number): void {
    for (const [id, node] of this.children) {
      node.draw(delta);
    }
  }
}

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

class Dice extends SceneNode {
  public values: number[];
  public onClick: () => void;
  public parent: ActionSlot | DiceTray;
  public roll(): void {

  }
  public draw(): void {

  }
}

class DiceTray extends SceneNode {
  public onDrop: () => void;
}

class ActionSlot extends SceneNode {
  public parent: ActionCard;
  public onDrop: () => void;
}
class ActionCard extends SceneNode {
  public onDrop: () => void;
}

window.addEventListener("load", async (): Promise<any> => {
  const scene: SceneNode = new SceneNode();
  const button: Button = new Button(
    "start game", 
    SCREEN_WIDTH / 2 - 100, 
    SCREEN_HEIGHT / 2 - 20,
    200,
    40,
    () => {
      alert("No game here yet friend.");
    },
    0xFF444444,
    0xff666666,
    0xff222222);
  button.size = { x: 200, y: 40 };
  scene.addChild(button);

  let then: number = 0;
  function tick(now: number): void {
    const delta: number = now - then;
    then = now;

    scene.update(delta);

    gl.cls();
    drawText("js13k 2019", 5, 5, Align.LEFT, 3);
    drawText("theme: back", 5, 25, Align.LEFT, 2);
    drawText("(c) 2019 david brad", 5, 440, Align.LEFT, 1);

    scene.draw(delta);

    drawTexture("cursor", cursor.x, cursor.y);
    if (process.env.NODE_ENV === "development") {
      stats.tick(now, delta);
    }
    if (mouse.inputDisabled) {
      gl.col(0xAA222222);
      drawTexture("solid", 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      gl.col(0xFFFFFFFF);
      drawText("click to focus game", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, Align.CENTER, 4);
    }
    gl.flush();
    requestAnimationFrame(tick);
  }

  const stage: HTMLDivElement = document.querySelector("#stage");
  const canvas: HTMLCanvasElement = document.querySelector("canvas");

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  window.addEventListener(
    "resize",
    (): void => {
      const scaleX: number = window.innerWidth / canvas.width;
      const scaleY: number = window.innerHeight / canvas.height;
      let scaleToFit: number = Math.min(scaleX, scaleY) | 0;
      scaleToFit = scaleToFit <= 0 ? 1 : scaleToFit;
      const size: number[] = [canvas.width * scaleToFit, canvas.height * scaleToFit];
      const offset: number[] = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
      const rule: string = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scaleToFit + ")";
      stage.style.transform = rule;
      stage.style.webkitTransform = rule;
    }
  );

  if (process.env.NODE_ENV === "development") {
    stats.init();
  }

  gl.init(canvas);
  mouse.initialize(canvas);
  await load("sheet.json");

  subscribe("mousemove", "game", (pos: V2) => {
    V2.set(cursor, pos);
  });

  requestAnimationFrame(tick);
  window.dispatchEvent(new Event("resize"));
});
