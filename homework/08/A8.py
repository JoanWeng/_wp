def is_prime(n):
    if n <= 1:
        return False  # 1 或更小的數字不是質數
    for i in range(2, int(n**0.5) + 1):  # 只需檢查到平方根
        if n % i == 0:  # 如果能整除，則不是質數
            return False
    return True  # 若沒有找到整除的數字，則是質數

# 範例使用
n = int(input("請輸入一個數字："))
print(is_prime(n))  # 輸出 True 或 False
