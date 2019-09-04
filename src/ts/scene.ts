/// <reference path="./scene-node.ts" />
/// <reference path="./mouse.ts" />

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

class Scene {
  public name: string;
  public rootNode: SceneNode;
  public cursor: Sprite;
  private updateFn: (delta: number, now: number) => void;
  private drawFn: (delta: number, now: number) => void;
  private tranIn: () => void;
  private tranOut: () => void;

  constructor(
    name: string,
    transitionIn: () => void = null,
    transitionOut: () => void = null,
    update: (delta: number, now: number) => void = null,
    draw: (delta: number, now: number) => void = null) {
    this.name = name;
    this.tranIn = transitionIn;
    this.tranOut = transitionOut;
    this.updateFn = update;
    this.drawFn = draw;
  }

  public transitionIn(): void {
    this.rootNode = new SceneNode(this);
    this.rootNode.rel = { x: 0, y: 0 };
    this.rootNode.size = { x: SCREEN_WIDTH, y: SCREEN_HEIGHT };
    this.cursor = new Sprite(
      [
        { textureName: "cursor", duration: 0 }
      ],
      V2.copy(mouse.position));
    this.rootNode.add(this.cursor);

    if (this.tranIn) {
      this.tranIn();
    }
    subscribe("mousemove", this.name, (pos: V2) => {
      V2.set(this.cursor.rel, pos);
      mouse.over.clear();
      const nodes: SceneNode[] = this.rootNode.nodesAt(pos);
      for(let i: number = 0; i< nodes.length; i++) {
        mouse.over.set(nodes[i].id, nodes[i]);
      }
    });
    emit("mousemove", V2.copy(mouse.position), false);
  }

  public transitionOut(): void {
    if (this.tranOut) {
      this.tranOut();
    }
    this.rootNode.destroy();
    unsubscribe("mousemove", this.name);
    mouse.over.clear();
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
    this.cursor.draw(delta, now);
  }
}
