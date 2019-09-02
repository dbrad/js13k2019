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
