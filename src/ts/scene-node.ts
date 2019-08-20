let idGen: number = 0;

class SceneNode {
  public id: number;
  public parent: SceneNode;
  public children: Map<number, SceneNode> = new Map();
  public positon: V2;
  public size: V2;

  constructor() {
    this.id = idGen++;
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
