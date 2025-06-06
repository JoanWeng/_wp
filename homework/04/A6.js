function filterArray(arr, predicate) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

// 測試範例
console.log(filterArray([1, 2, 3, 4, 5], n => n % 2 === 0)); 
// [2, 4]


console.log(filterArray([1, 2, 3, 4, 5], n => n % 2 === 0));
//console.log(filterArray([1, 2, 3, 4, 5], function(n) { return n % 2 === 0}));
/*
function isEven(n) { return n % 2 === 0}
console.log(filterArray([1, 2, 3, 4, 5], isEven));
*/