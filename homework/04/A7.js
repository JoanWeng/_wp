class Vector {
  constructor(components) {
    this.components = components;
  }

  // 向量加法
  add(other) {
    const result = this.components.map((val, i) => val + other.components[i]);
    return new Vector(result);
  }

  // 向量減法
  sub(other) {
    const result = this.components.map((val, i) => val - other.components[i]);
    return new Vector(result);
  }

  // 向量內積
  dot(other) {
    return this.components.reduce((sum, val, i) => sum + val * other.components[i], 0);
  }

  // 顯示向量
  toString() {
    return `Vector(${this.components.join(', ')})`;
  }
}

// 測試範例
let a = new Vector([1, 2, 3]);
let b = new Vector([4, 5, 6]);

console.log(a.add(b).sub(b).dot(b)); // 輸出：32