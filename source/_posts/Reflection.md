---
title: Reflection
date: 2017-01-03 23:27:56
tags: [Java]
categories : Java
---

## 反射

能够分析类能力的程序称为*反射*(reflective)。

### Class类
在程序运行期间，Java运行时系统始终为所有的对象维护一个被称为运行时的类型标识。 这个信息跟踪着每个对象所属的类。 虚拟机利用运行时类型信息选择相应的方法执行。
然而，可以通过专门的Java类访问这些信息。保存这些信息的类被称为Class，这个名字很容易让人混淆。 Object类中的getClass()方法将会返回一个Class类型的实例。
<!--more-->
```java
    Date d = new Date();
    Class c1 = d.getClass();
    String name = c1.getName(); // name is set to "java.util.Date"
```

还可以调用静态方法forName获得类名对应的Class对象。
```java
    String className = "java.util.Date";
    Class c1 = Class.forName(className);
```
如果类名保存在字符串中，并可在运行中改变，就可以使用这个方法。当然，这个方法只有在className是类名或接口名时才能够执行。否则，forName方法将抛出一个checked exception。

虚拟机每个类型管理一个Class对象。 因此，可以利用 == 运算符实现两个类对象比较的操作。 例如,
```java
    if(e.getClass() == Employee.class) ...
```
还有一个很有用的方法newInstance()，可以用来快速地创建一个类的实例。例如，
```java
    e.getClass().newInstance();
```
创建了一个与e具有相同类类型的实例。 newInstance()方法调用默认的构造器初始化新创建的对象。 如果这个类没有默认的构造器，就会抛出一个异常。
将forName与newInstance配合起来使用，可以根据存储在字符串中的类名创建一个对象。
```java
    String s = "java.util.Date";
    Object m = Class.forName(s).newInstance();
```
如果需要以这种方式向希望按名称创建的类的构造器提供参数，就不要使用上面那条语句，而必须使用Constructor类中的newInstance方法。

### 利用反射分析类的能力

下面的程序显示了如何打印一个类的全部信息的方法。
```java
public class ReflectionTest {
    public static void main(String[] args) {
        // read class name from command line args or user input
        String name;
        if (args.length > 0)
            name = args[0];
        else {
            Scanner in = new Scanner(System.in);
            System.out.println("Enter class name (e.g. java.util.Date): ");
            name = in.next();
         }
        try {
            // print class name and superclass name (if != Object)
            Class cl = Class.forName(name);
            Class supercl = cl.getSuperclass();
            String modifiers = Modifier.toString(cl.getModifiers());
            if (modifiers.length() > 0)
                System.out.print(modifiers + " ");
            System.out.print("class " + name);
            if (supercl != null && supercl != Object.class)
                System.out.print(" extends " + supercl.getName());
            System.out.print("\n{\n");
            printConstructors(cl);
            System.out.println();
            printMethods(cl);
            System.out.println();
            printFields(cl);
            System.out.println("}");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        System.exit(0);
    }

    /**
     * Prints all constructors of a class
     * 
     * @param cl
     *            a class
     */
    public static void printConstructors(Class cl) {
        Constructor[] constructors = cl.getDeclaredConstructors();
    
        for (Constructor c : constructors) {
            String name = c.getName();
            System.out.print("   ");
            String modifiers = Modifier.toString(c.getModifiers());
            if (modifiers.length() > 0)
                System.out.print(modifiers + " ");
            System.out.print(name + "(");
    
            // print parameter types
            Class[] paramTypes = c.getParameterTypes();
            for (int j = 0; j < paramTypes.length; j++) {
                if (j > 0)
                    System.out.print(", ");
                System.out.print(paramTypes[j].getName());
            }
            System.out.println(");");
        }
    }

    /**
     * Prints all methods of a class
     * 
     * @param cl
     *            a class
     */
    public static void printMethods(Class cl) {
        Method[] methods = cl.getDeclaredMethods();
    
        for (Method m : methods) {
            Class retType = m.getReturnType();
            String name = m.getName();
    
            System.out.print("   ");
            // print modifiers, return type and method name
            String modifiers = Modifier.toString(m.getModifiers());
            if (modifiers.length() > 0)
                System.out.print(modifiers + " ");
            System.out.print(retType.getName() + " " + name + "(");
    
            // print parameter types
            Class[] paramTypes = m.getParameterTypes();
            for (int j = 0; j < paramTypes.length; j++) {
                if (j > 0)
                    System.out.print(", ");
                System.out.print(paramTypes[j].getName());
            }
            System.out.println(");");
        }
    }

    /**
     * Prints all fields of a class
     * 
     * @param cl
     *            a class
     */
    public static void printFields(Class cl) {
        Field[] fields = cl.getDeclaredFields();
    
        for (Field f : fields) {
            Class type = f.getType();
            String name = f.getName();
            System.out.print("   ");
            String modifiers = Modifier.toString(f.getModifiers());
            if (modifiers.length() > 0)
                System.out.print(modifiers + " ");
            System.out.println(type.getName() + " " + name + ";");
        }
    }
}
```

例如输入: java.lang.Double  
程序将会输出：

```java
public final class java.lang.Double extends java.lang.Number
{
   public java.lang.Double(double);
   public java.lang.Double(java.lang.String);

   public boolean equals(java.lang.Object);
   public static java.lang.String toString(double);
   public java.lang.String toString();
   public int hashCode();
   public static int hashCode(double);
   public static double min(double, double);
   public static double max(double, double);
   public static native long doubleToRawLongBits(double);
   public static long doubleToLongBits(double);
   public static native double longBitsToDouble(long);
   public volatile int compareTo(java.lang.Object);
   public int compareTo(java.lang.Double);
   public byte byteValue();
   public short shortValue();
   public int intValue();
   public long longValue();
   public float floatValue();
   public double doubleValue();
   public static java.lang.Double valueOf(java.lang.String);
   public static java.lang.Double valueOf(double);
   public static java.lang.String toHexString(double);
   public static int compare(double, double);
   public static boolean isNaN(double);
   public boolean isNaN();
   public static boolean isFinite(double);
   public static boolean isInfinite(double);
   public boolean isInfinite();
   public static double sum(double, double);
   public static double parseDouble(java.lang.String);

   public static final double POSITIVE_INFINITY;
   public static final double NEGATIVE_INFINITY;
   public static final double NaN;
   public static final double MAX_VALUE;
   public static final double MIN_NORMAL;
   public static final double MIN_VALUE;
   public static final int MAX_EXPONENT;
   public static final int MIN_EXPONENT;
   public static final int SIZE;
   public static final int BYTES;
   public static final java.lang.Class TYPE;
   private final double value;
   private static final long serialVersionUID;
}
```

### 在运行时使用反射分析对象

下面是一个供所有类使用的toString方法。
```java
public class ObjectAnalyzer {
    private ArrayList<Object> visited = new ArrayList<>();

    /**
     * Converts an object to a string representation that lists all fields.
     * 
     * @param obj
     *            an object
     * @return a string with the object's class name and all field naand
     *         values
     */
    public String toString(Object obj) {
        if (obj == null)
            return "null";
        if (visited.contains(obj))
            return "...";
        visited.add(obj);
        Class cl = obj.getClass();
        if (cl == String.class)
            return (String) obj;
        if (cl.isArray()) {
            String r = cl.getComponentType() + "[]{";
            for (int i = 0; i < Array.getLength(obj); i++) {
                if (i > 0)
                    r += ",";
                Object val = Array.get(obj, i);
                if (cl.getComponentType().isPrimitive())
                    r += val;
                else
                    r += toString(val);
            }
            return r + "}";
        }
    
        String r = cl.getName();
        // inspect the fields of this class and all superclasses
        do {
            r += "[";
            Field[] fields = cl.getDeclaredFields();
            AccessibleObject.setAccessible(fields, true);
            // get the names and values of all fields
            for (Field f : fields) {
                if (!Modifier.isStatic(f.getModifiers())) {
                    if (!r.endsWith("["))
                        r += ",";
                    r += f.getName() + "=";
                    try {
                        Class t = f.getType();
                        Object val = f.get(obj);
                        if (t.isPrimitive())
                            r += val;
                        else
                            r += toString(val);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            r += "]";
            cl = cl.getSuperclass();
        } while (cl != null);
    
        return r;
    }
}
```