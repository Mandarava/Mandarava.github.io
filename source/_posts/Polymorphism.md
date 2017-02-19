---
title: Polymorphism
date: 2017-1-15 17:18:05
tags: [Java]
categories : Java
---

# 多态

对象的多态性是指在一般类中定义的属性或服务被特殊类继承之后，可以具有不同的数据类型或表现出不同的行为。 这使得同一个属性或服务在一般类及其各个特殊类中具有不同的语义。

### 动态绑定

弄清调用对象方法的执行过程十分重要。下面是调用过程的详细描述：

1、 编译器查看对象的声明类型和方法名。假设调用x.f(param), 且隐式参数x声明为C类型的对象。需要注意的是：有可能存在多个名为f，但参数类型不一样的方法。例如可能存在方法f(int)和f(String)。编译器会一一列举所有C类中名为f的方法和其超类中访问属性为public且名为f的方法（超类的私有方法不可访问）。

至此，编译器已经获得所有可能被调用的候选方法。

<!--more-->

2、 接下来，编译器将查看调用方法时所提供的参数类型。如果在所有名为f的方法中存在一个与提供的参数类型完全匹配的方法，就选择这个方法。这个过程被称为**重载解析(overloading resolution)**。 例如，对于调用x.f("Hello")来说，编译器会挑选f(String)，而不是f(int)。由于允许类型转换(int 可以转成double, Manager可以转换成Employee，等等)，所以这个过程可能很复杂。如果编译器没有找到与参数类型匹配的方法，或者发现经过类型转换后有多个方法与之匹配，就会报告一个错误。

至此，编译器已获得需要调用的方法名字和参数类型。

3、 如果是private方法、static方法、final方法或者构造器，那么编译器可以准确的知道应该调用哪个方法，我们将这种调用方式称为**静态绑定(static binding)**。与此对应的是，调用的方法依赖于隐式参数的实际类型，并且在运行时实现动态绑定。在我们列举的示例中，编译器采用动态绑定的方式生成一条调用f(String)的指令。

4、 当程序运行，并且采用动态绑定调用方法时，虚拟机一定调用与x所引用的对象的实际类型最适合的那个类的方法。 假设x的实际类型是D，它是C的子类，如果D类定了方法f(String)，就直接调用它；否则就在D类的超类中寻找f(String)方法，以此类推。

每次调用方法时都要进行搜索，时间开销相当大。 因此，虚拟机预先为每个类创建了一个方法表(method table)，其中列举出了所有**方法签名**和实际调用的方法。 这样一来，在真正调用方法的时候，虚拟机仅仅查找这个表就行了。 在前面的例子中，虚拟机搜索D类的方法表。以便寻找与调用f(String)相匹配的方法。这个方法既可能是D.f(String),也有可能是X.f(String)，这里的X是D的超类。这里需要提醒一点，如果调用super.f(param)，编译器将对隐式参数超类的方法表进行搜索。

现在，查看一下以下程序中调用e.getSalary()的详细过程。e声明为Employee类型。Employee类只有一个名叫getSalary的方法，这个方法没有参数。因此，在这里不必担心重载解析的问题。

由于getSalary不是private方法、static方法或final方法，所以将采用动态绑定。虚拟机为Employee和Manager两个类生成方法表。在Employee的方法表中，列出了这个类定义的所有方法：
```java
Employee:
    getName() -> Employee.getName()
    getSalary() -> Employee.getSalary()
    getHireDay() -> Employee.getHireDay()
    raiseSalary(double) -> Employee.raiseSalary(double)
```
实际上，上面列出的方法并不完整，稍后会看到Employee类有一个超类Object，Employee类从这个超类中还继承了许多方法，在此，我们略去了这些方法。

Manager方法表稍微有些不同。其中有三个方法是继承而来的，一个方法是重新定义的，还有一个方法是新增加的。
```java
Manager:
    getName() -> Employee.getName()
    getSalary() -> Manager.getSalary()
    getHireDay() -> Employee.getHireDay()
    raiseSalary(double) -> Employee.raiseSalary(double) 
    setBonus(double) -> Manager.setBonus(double)
```
在运行的时候，调用e.getSalary()的解析过程为：
* 首先，虚拟机提取e的实际类型的方法表。既可能是Employee、Manager的方法表，也可能是Employee类的其他子类的方法表。
* 接下来，虚拟机搜索定义getSalary签名的类。此时，虚拟机已经知道应该调用哪个方法。
* 最后，虚拟机调用方法。

动态绑定有一个非常重要的特性：无需对现存的代码进行修改，就可以对程序进行扩展。假设增加一个新类Executive，并且变量e有可能引用这个类的对象，我们不需要对包含调用e.getSalary()的代码进行重新编译。如果e恰好引用一个Executive类的对象，就会自动地调用Executive.getSalary（）方法。

多态存在的三个必要条件：
* 要有继承
* 要有重写
* 父类引用指向子类对象