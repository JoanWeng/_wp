def summary(data):
    for student in data:
        name = student['name']
        scores = student['scores']
        total_score = sum(scores)  # 計算總分
        average_score = total_score / len(scores)  # 計算平均分數
        print(f"學生: {name} | 總分: {total_score} | 平均: {average_score:.2f}")

# 範例資料
students = [
    {'name': 'Alice', 'scores': [90, 80, 70]},
    {'name': 'Bob', 'scores': [100, 85, 95]}
]

# 呼叫函數
summary(students)
