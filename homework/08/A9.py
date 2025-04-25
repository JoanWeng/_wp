def most_common(nums):
    # 使用字典來儲存數字及其出現次數
    count_dict = {}
    
    # 計算每個數字出現的次數
    for num in nums:
        if num in count_dict:
            count_dict[num] += 1
        else:
            count_dict[num] = 1

    # 找到出現次數最多的數字
    most_common_num = max(count_dict, key=count_dict.get)
    return most_common_num

# 範例使用
nums = [1, 3, 2, 3, 4, 3, 5, 6, 3]
result = most_common(nums)
print("最常見的數字是:", result)
