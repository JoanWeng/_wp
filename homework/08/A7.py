def dict_to_string(d):
    # 使用列表推導式將每個鍵值對轉換為 'key=value' 格式，然後用逗號分隔
    return ', '.join(f"{key}={value}" for key, value in d.items())

# 範例使用
d = {'a': 1, 'b': 2, 'c': 3}
result = dict_to_string(d)
print(result)