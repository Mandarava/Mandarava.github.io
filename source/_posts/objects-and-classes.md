---
title: Objects and Classes
date: 2017-1-2 17:18:05
tags: [Java]
categories : Java
---

## 1、 不要编写返回引用可变对象的访问器方法

　　在Employee类中就违反了这个设计原则，其中的getHireDay方法返回了一个Date类对象：

    class Employe {
        private Date hireDay;
        ...
        public Date getHireDay() {
            return hireDay;
        }
        ...
    }

<!--more-->
　　这样会破坏封装性！请看下面这段代码：

    Employee harry = ...;
    Date d = harry.getHireDay();
    double tenYearsInMilliSeconds = 10 * 365.25 * 24 *60 * 60 * 1000;
    d.setTime(d.getTime() - (long) tenYearsInMilliSeconds);

　　出错的原因很微妙。d和harry.hireDay引用同一个对象。对d调用更改器方法就可以自动得改变这个雇员对象的私有状态！
　　如果需要返回一个可变对象的引用，应该首先对它进行克隆（clone）。下面是修改后的代码：

    class Employee {
        ...
        public Date getHireDay() {
            return hireDay.clone();
        }
    }

## 2、 final实例域

　　可以将实例域定义为final。构建对象时必须初始化这样的域。也就是说，必须确保在没一个构造器执行之后，这个域的值被设置，并且在后面的操作中，不能够再对它进行修改。
　　final修饰符大都应用于基本(primitive)类型域，或不可变(immutable)类的域（如果类中的每个方法都不会改变其对象，这种类就是不可变的类）。对于可变的类，使用final修饰符可能会对读者造成混乱。  
例如：

    private final Date hiredate;

　　仅仅意味着存储在hiredate变量中的对象引用在对象构造之后不能被改变，而并不意味着hiredate对象是一个常量。任何方法都可以对hiredate引用的对象调用setTime更改器。

## 3、方法参数

　　首先回顾一下在程序设计语言中有关将参数传递给方法（或函数）的一些专业术语。 ***按值调用(call by value)***表示方法接收的是调用者提供的***值***。 而***按引用调用(call by reference)***表示方法接收的是调用者提供的***变量地址***。 一个方法可以 修改传递引用所对应的变量值, 而不能修改传递值调用所对应的变量值。 “按....调用(call by)”是一个标准的计算机科学术语，它用来描述各种程序设计语言中方法参数的传递方式（事实上， 以前还有*按名称调用(call by name)*， Algol程序设计语言是最古老的高级程序设计语言之一，它使用的就是这种参数传递方式。）

　　Java程序设计语言总是采用***按值调用***。也就是说， 方法得到的是所有参数值的一个拷贝， 特别是方法不能修改传递给它的任何参数变量的内容。  
　　例如，考虑下面的调用：

    double percent = 10;
    harry.raiseSalary(percent);

　　不必理踩这个方法的具体实现，在方法调用之后，percent的值还是10.
然而，方法参数共有两种类型：
* 基本数据类型（数字、布尔值）。
* 对象引用。 
 
　　读者已经看到，一个方法不可能修改一个基本数据类型的参数。而对象引用作为参数就不同了，可以很容易地利用下面这个方法将一个雇员的薪金提高的操作：

    public static void tripleSalary(Employee x) // works
    {
        x.raiseSalary(200);
    }

当调用

    harry = new Employee(...);
    tripleSalary(harry);
时，具体的执行过程为：  
1) x 被初始化为harry值的拷贝， 这里是一个对象的引用。  
2) raiseSalary方法应用于这个对象引用。 x和harry同时引用的那个Employee对象的薪金提高了200%。  
3) 方法结束后，参数变量x不再使用。 当然，对象变量harry继续引用那个薪金增至3倍的雇员对象。

　　实现一个改变对象参数状态的方法并不是一件难事。 理由很简单， 方法得到的是对象引用的拷贝， 对象引用及其他的拷贝同时引用同一个对象。  
　　有些程序员认为Java程序设计语言对对象采用的是引用调用， 实际上， 这种理解是不对的。 由于这种误解具有一定的普遍性， 所以下面给出一个反例来详细地阐述一下这个问题。
首先， 编写一个交换两个雇员对象的方法：

    public static void swap(Employee x, Employee y) {
        Employee temp = x;
        x = y;
        y = temp;
    }

　　如果Java程序设计语言对对象采用的是引用调用， 那么这个方法就应该能够实现交换数据的效果。

    Employee a = new Employee("Alice",...);
    Employee b = new Employee("Bob",...);
    swap(a, b);
    // does a now refer to Bob, b to Alice?
　　但是，方法并没有改变存储在变量a和b中的对象引用。swap方法的参数x和y被初始化为两个对象引用的拷贝，这个方法交换的是这两个拷贝。

    // x refers to Alice, y to Bob
    Employee temp = x;
    x = y;
    y = temp;
    // now x refers to Bob, y to Alice

　　最终，白费力气。 在方法结束时参数变量x和y被丢弃了。原来的变量a和b仍然引用这个方法调用之前所引用的对象。
　　这个过程说明：Java程序设计语言对对象采用的不是引用调用，实际上，*对象引用进行的是值传递*。

　　下面总结一下Java程序设计语言中方法参数的使用情况：
* 一个方法不能修改一个基本数据类型的参数（即数值型和布尔型）。
* 一个方法可以改变一个对象参数的状态。
* 一个方法不能让对象参数引用一个新的对象。

## 4、重载

　　Java允许重载任何方法，而不只是构造器方法。因此，要完整地描述一个方法，需要指出方法名以及参数类型。 这叫做方法的***签名（signature）***。 例如，String类有4个称为indexOf的公有方法。 它们的签名是
* indexOf(int)
* indexOf(int, int)
* indexOf(String)
* indexOf(String, int)

　　返回类型不是方法签名的一部分。 也就是说，不能有两个名字相同、参数类型也相同却返回不同类型值的方法。