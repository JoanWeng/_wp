function uniqueSorted(arr)
{
    const uniqueArr = Array.from(new Set(arr));
    // 使用 Set 去重複，並將結果轉回陣列
    return uniqueArr.sort((a, b) => a - b);
}

console.log(uniqueSorted([5, 3, 8, 3, 1, 5, 8]));