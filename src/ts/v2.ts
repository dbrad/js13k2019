export class V2 {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public copy(): V2 {
    return new V2(this.x, this.y);
  }

  public set(v2: V2): void {
    this.x = v2.x;
    this.y = v2.y;
  }

  public equals(v2: V2): boolean {
    return this.x === v2.x && this.y === v2.y;
  }

  public hash(): number {
    return (this.x * 7 + this.y * 3);
  }

  public static add(v1: V2, v2: V2): V2 {
    return new V2(v1.x + v2.x, v1.y + v2.y);
  }
}
