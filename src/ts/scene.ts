/// <reference path="./scene-node.ts" />

namespace SceneManager {
  const scenes: Map<string, Scene> = new Map();
  const stack: Scene[] = [];

  export function register(scene: Scene): void {
    scenes.set(scene.name, scene);
  }

  export function push(name: string): void {
    const newScene: Scene = scenes.get(name);
    if (stack.length > 0) {
      stack[stack.length - 1].transitionOut();
    }
    stack.push(newScene);
    stack[stack.length - 1].transitionIn();
  }

  export function pop(): void {
    stack[stack.length - 1].transitionOut();
    stack.pop();
    if (stack.length > 0) {
      stack[stack.length - 1].transitionIn();
    }
  }

  export function update(delta: number, now: number): void {
    stack[stack.length - 1].update(delta, now);
  }
  export function draw(delta: number, now: number): void {
    stack[stack.length - 1].draw(delta, now);
  }
}

const cursor: V2 = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 };

class Scene {
  public name: string;
  public rootNode: SceneNode = new SceneNode();
  private updateFn: (delta: number, now: number) => void;
  private drawFn: (delta: number, now: number) => void;
  private transitionInFn: () => void;
  private transitionOutFn: () => void;

  constructor(
    name: string,
    transitionIn: () => void = null,
    transitionOut: () => void = null,
    update: (delta: number, now: number) => void = null,
    draw: (delta: number, now: number) => void = null) {
    this.name = name;
    this.transitionInFn = transitionIn;
    this.transitionOutFn = transitionOut;
    this.updateFn = update;
    this.drawFn = draw;
  }

  public transitionIn(): void {
    this.rootNode = new SceneNode();
    this.rootNode.relPos = { x: 0, y: 0 };
    this.rootNode.size = { x: SCREEN_WIDTH, y: SCREEN_HEIGHT };
    if (this.transitionInFn) {
      this.transitionInFn();
    }
    subscribe("mousemove", this.name, (pos: V2) => {
      V2.set(cursor, pos);
    });
  }

  public transitionOut(): void {
    if (this.transitionOutFn) {
      this.transitionOutFn();
    }
    this.rootNode.destroy();
    unsubscribe("mousemove", this.name);
  }

  public update(delta: number, now: number): void {
    if (this.updateFn) {
      this.updateFn(delta, now);
    }
    this.rootNode.update(delta, now);
  }

  public draw(delta: number, now: number): void {
    if (this.drawFn) {
      this.drawFn(delta, now);
    }
    this.rootNode.draw(delta, now);
    drawTexture("cursor", cursor.x, cursor.y);
  }
}
