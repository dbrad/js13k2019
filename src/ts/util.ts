function shuffle<T>(array: T[]): T[] {
  let currentIndex: number = array.length, temporaryValue: T, randomIndex: number;
  const arr: T[] = array.slice();
  while (0 !== currentIndex) {
    randomIndex = ~~(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sum(...values: number[]): number {
  let result: number = 0;
  for (const value of values) {
    result += value;
  }
  return result;
}

function inside(pt: V2, topleft: V2, size: V2): boolean {
  return (pt.x > topleft.x && pt.x <= topleft.x + size.x && pt.y > topleft.y && pt.y <= topleft.y + size.y);
}
