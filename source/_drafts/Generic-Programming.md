### 定义简单泛型类

在Java类库中，使用变量E表示集合的元素类型，K和V分别表示表的关键字与值的类型。T（需要时还可以用临近的字母U和S）表示“任意类型”。

### 约束与局限性

#### 不能用基本类型实例化类型参数

```java
Pair<double> //error
Pair<Double> //true
```

#### 运行时类型检查只适用于原始类型

```java
Pair<String> stringPair = ...;
Pair<Employee> employee = ...;
if(stringPair.getClass() == employee.getClass()) // they are equal
```
两次调用getClass都将返回Pair.class

#### 不能创建参数化类型的数组

    Pair<String>[] table = new Pair<String>[10];  // error

#### 不能实例化类型变量
```java
public Pair() { first = new T(); second = new T();} //ERROR
```

#### 泛型类的静态上下文中类型变量无效

```java
private static T sinleInstance; //ERROR
```

### 通配符类型

直观地讲，带有**超类型限定**符的通配符可以向泛型对象**写入**，带有**子类型限定**的通配符可以从泛型对象**读取**。