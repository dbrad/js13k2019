/// <reference path="./interpolator.ts" />

let idGen: number = 0;

class SceneNode {
  public id: number;
  private SCENE: Scene;
  public get scene(): Scene {
    if (this.SCENE === null) {
      return this.parent.scene;
    }
    return this.SCENE;
  }
  public parent: SceneNode;
  public children: Map<number, SceneNode> = new Map();
  public rel: V2 = { x: 0, y: 0 };
  public anchor: V2 = { x: 0, y: 0 };
  public animation: (now: number) => boolean = null;
  public get abs(): V2 {
    return {
      x: this.anchor.x + (this.parent ? this.parent.abs.x + this.rel.x : this.rel.x),
      y: this.anchor.y + (this.parent ? this.parent.abs.y + this.rel.y : this.rel.y)
    };
  }
  public size: V2 = { x: 0, y: 0 };
  public enabled: boolean = true;
  public visible: boolean = true;

  constructor(scene: Scene = null) {
    this.id = idGen++;
    this.SCENE = scene;
  }

  public add(...nodes: SceneNode[]): void {
    for (const node of nodes) {
      if (node.parent) {
        node.parent.remove(node);
      }
      this.children.set(node.id, node);
      node.parent = this;
    }
  }

  public remove(node: SceneNode): void {
    node.parent = null;
    this.children.delete(node.id);
  }

  public destroy(): void {
    // Remove this from it's parent
    if (this.parent) {
      this.parent.remove(this);
    }

    // Destroy all chidlren
    if (this.children) {
      for (const [id, node] of this.children) {
        node.destroy();
      }
    }

    // Wipe internals
    this.id = null;
    this.parent = null;
    this.children = null;
    this.rel = null;
    this.size = null;
    this.enabled = false;
    this.visible = false;
  }

  public nodesAt(pt: V2): SceneNode[] {
    const result: SceneNode[] = [];
    if (this.rel && inside(pt, this.abs, this.size)) {
      result.push(this);
      for (const [id, child] of this.children) {
        result.push(...child.nodesAt(pt));
      }
    }
    return result;
  }
  public moveTo(dest: V2, duration: number = 0, callback: () => void = null, easingFn: EasingFn = (t: number) => t): void {
    const o: V2 = V2.copy(this.rel);
    const d: V2 = V2.copy(dest);
    if(o.x === d.x && o.y === d.y) {
      return;
    }
    if (duration === 0) {
      this.rel = V2.copy(dest);
      return;
    }
    const interp: IterableIterator<number> = Interpolator(duration, easingFn);
    this.animation = (now: number): boolean => {
      const i: IteratorResult<number> = interp.next(now);
      this.rel.x = o.x + Math.round((d.x - o.x) * i.value);
      this.rel.y = o.y + Math.round((d.y - o.y) * i.value);
      if (i.done) {
        this.rel.x = d.x;
        this.rel.y = d.y;
        if (callback) {
          window.setTimeout(callback,0);
        }
      }
      return i.done;
    };
  }

  public update(delta: number, now: number): void {
    if (this.animation) {
      if (this.animation(now)) {
        this.animation = null;
      }
    }
    if (this.enabled) {
      for (const [id, node] of this.children) {
        node.update(delta, now);
      }
    }
  }

  public draw(delta: number, now: number): void {
    if (this.visible && this.enabled) {
      for (const [id, node] of this.children) {
        node.draw(delta, now);
      }
      // @ifdef DEBUG
      if (mouse.over.has(this.id)) {
        gl.col(0xFF00FF00);
        drawTexture("solid", this.abs.x, this.abs.y, 1, this.size.y);
        drawTexture("solid", this.abs.x + this.size.x - 1, this.abs.y, 1, this.size.y);
        drawTexture("solid", this.abs.x, this.abs.y, this.size.x, 1);
        drawTexture("solid", this.abs.x, this.abs.y + this.size.y - 1, this.size.x, 1);
        gl.col(0xFFFFFFFF);
      }
      // @endif
    }
  }
}
