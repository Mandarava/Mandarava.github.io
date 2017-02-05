##### 双括号初始化(double brace initialization)

eg: 
```java
ArrayList<String> friends = new ArrayList<>();
favorites.add("Harry");
favorites.add("Tony");
invite(friends);
```

```java
invite (new ArrayList<String> {{add("Harry");add("Tony"); }})
```
注意这里的双括号。外层括号建立了ArrayList的一个匿名子类。内层括号则是一个对象构造块。

##### 静态内部类

有时候，使用内部类只是为了把一个类隐藏在另外一个类的内部，并不需要内部类引用外围类对象。为此，可以将内部类声明为static，以便取消产生的引用。当然，只有内部类可以声明为static。静态内部类的对象除了没有对生成它的外围类对象的引用特权外，与其他所有内部类完全一样。

在内不类不需要访问外围类对象的时候，应该使用静态内部类。

声明在接口中的内部类自动成为static和public类。