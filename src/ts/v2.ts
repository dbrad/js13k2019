type V2 = {
  x: number;
  y: number;
};

namespace V2 {
  export function copy(v2: V2): V2 {
    return { x: v2.x, y: v2.y };
  }
  export function set(a: V2, b: V2): void {
    a.x = b.x;
    a.y = b.y;
  }
}
