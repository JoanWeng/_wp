function countLetters(str)
{
    const letterCount = new Map();
  
    for (const char of str)
    {
        if (/[a-zA-Z]/.test(char)) // 檢查字元是否是字母（忽略大小寫）
        {
            const lowerChar = char.toLowerCase();
            // 將字母轉為小寫，統一處理大小寫

            if (letterCount.has(lowerChar))
                letterCount.set(lowerChar, letterCount.get(lowerChar) + 1);
            else
                letterCount.set(lowerChar, 1);
        }
    }
  
    return letterCount;
}

const userInput = prompt();
console.log(countLetters(userInput));