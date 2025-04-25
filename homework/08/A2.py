def average(nums):
    if len(nums) == 0:  # 檢查列表是否為空,len(nums) 計算列表中數字的個數
        return 0.0  # 如果列表為空，返回 0.0
    return round(sum(nums) / len(nums), 1)  # 計算平均值並四捨五入到小數點一位

input_str = input("請輸入一組數字，以空格分隔：")
numbers = [int(num) for num in input_str.split()]
print("平均值是:", average(numbers))