def find_max(numbers): # 宣告函數
    return max(numbers)

# 讓使用者輸入數字，並將其轉換為一個列表
input_str = input("請輸入一組數字，以空格分隔：")
numbers = [int(num) for num in input_str.split()]

# 呼叫函數並輸出結果
print("最大值是:", find_max(numbers))
