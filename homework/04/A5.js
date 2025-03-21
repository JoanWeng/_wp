class Animal
{
    constructor(name)
    {
        this.name = name; // 定義 name 屬性
    }
    speak()
    {
        return `${this.name} makes a sound`; // 預設的 speak 方法
    }
}

class Dog extends Animal // 定義 Dog 類別，繼承自 Animal
{
    constructor(name)
    {
      super(name); // 呼叫父類別的建構子
    }
  
    speak()
    {
      return `Woof! I am ${this.name}`; // 覆寫 speak 方法
    }
}

const dog = new Dog("Buddy");
console.log(dog.speak());