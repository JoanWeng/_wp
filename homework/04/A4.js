function deepMerge(obj1, obj2)
{
    for (let key in obj2)
    {
        // 如果 obj2[key] 是物件且 obj1[key] 也是物件，則進行遞迴合併
        if (typeof obj2[key] === 'object' && obj2[key] !== null && typeof obj1[key] === 'object' && obj1[key] !== null)
            obj1[key] = deepMerge(obj1[key], obj2[key]);
        else
            obj1[key] = obj2[key];
        // 否則，直接將 obj2[key] 的值賦給 obj1[key]
    }
      return obj1;
}

const obj1 = { a: 1, b: { x: 2, y: 3 } };
const obj2 = { b: { y: 5, z: 6 }, c: 7 };
console.log(deepMerge(obj1, obj2));