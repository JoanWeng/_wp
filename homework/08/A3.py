def classify_even_odd(numbers):
    result = {"even": [], "odd": []}  # 創建字典來存儲偶數和奇數
    for num in numbers:
        if num % 2 == 0:
            result["even"].append(num)
        else:
            result["odd"].append(num)
    return result

input_str = input("請輸入一組數字，以空格分隔：")
numbers = [int(num) for num in input_str.split()]
result = classify_even_odd(numbers)
print(result)
