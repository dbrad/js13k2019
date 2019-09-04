let idGen: number = 0;

class SceneNode {
  public id: number;
  private SCENE: Scene;
  public get scene(): Scene {
    if(this.SCENE === null) {
      return this.parent.scene;
    }
    return this.SCENE;
  }
  public parent: SceneNode;
  public children: Map<number, SceneNode> = new Map();
  public rel: V2 = { x: 0, y: 0 };
  public anchor: V2 = { x: 0, y: 0 };
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
      if(node.parent) {
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

  public update(delta: number, now: number): void {
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
