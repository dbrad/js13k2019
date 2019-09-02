let idGen: number = 0;

class SceneNode {
  public id: number;
  public parent: SceneNode;
  public children: Map<number, SceneNode> = new Map();
  public relPos: V2 = { x: 0, y: 0 };
  public get absPos(): V2 {
    return {
      x: this.parent ? this.parent.absPos.x + this.relPos.x : this.relPos.x,
      y: this.parent ? this.parent.absPos.y + this.relPos.y : this.relPos.y
    };
  }
  public size: V2 = { x: 0, y: 0 };
  public enabled: boolean = true;
  public visible: boolean = true;

  constructor() {
    this.id = idGen++;
  }

  public add(...nodes: SceneNode[]): void {
    for (const node of nodes) {
      this.children.set(node.id, node);
      node.parent = this;
    }
  }

  public remove(node: SceneNode): void {
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
    this.relPos = null;
    this.size = null;
    this.enabled = false;
    this.visible = false;
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
      gl.col(0xFF00FF00);
      drawTexture("solid", this.absPos.x, this.absPos.y, 1, this.size.y);
      drawTexture("solid", this.absPos.x + this.size.x - 1, this.absPos.y, 1, this.size.y);
      drawTexture("solid", this.absPos.x, this.absPos.y, this.size.x, 1);
      drawTexture("solid", this.absPos.x, this.absPos.y + this.size.y - 1, this.size.x, 1);
      gl.col(0xFFFFFFFF);
      // @endif
    }
  }
}
