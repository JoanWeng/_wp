let scores={Alice:85, Bob:92, Charlie:78};
for (let person in scores)
    console.log(`${person} 的分數是 ${scores[person]}`);
/*
`` => 模板字串，可用於書寫多行字串
在模板字串中使用${}來插入變數、表達式或函數調用的結果
for(...in) 用於遍歷物件的屬性或陣列的索引
for(...of) 用於遍歷可迭代物件的每個值
*/