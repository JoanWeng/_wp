def print_stars(n):
    for i in range(1, n + 1):  # 從 1 到 n，每行打印 i 顆星
        print('*' * i)  # 輸出 i 顆星號

# 讓使用者輸入數字
n = int(input("請輸入一個數字："))

# 呼叫函數並打印結果
print_stars(n)