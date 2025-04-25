def count_chars(s):
    char_count = {}  # 創建一個空字典來儲存字元及其出現次數
    for char in s:
        if char in char_count:
            char_count[char] += 1  # 如果字元已經在字典中，次數加 1
        else:
            char_count[char] = 1  # 如果字元不在字典中，將其加入並設置次數為 1
    return char_count

s = input("請輸入一個字串：")
result = count_chars(s)
print(result)