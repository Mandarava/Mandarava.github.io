### 守护线程

可以通过调用t.setDaemon(true)；

将线程转换为**守护线程(daemon thread)**。 守护线程的唯一用途是为其他线程提供服务。守护线程应该永远不去访问固有资源，如文件、数据库、因为它会在任何时候甚至在一个操作的中间发生中断

### 锁对象

用ReentrantLock保护代码块的基本结构如下：

```java
myLock.lock(); // a ReentrantLock object
try {
    critical section
} finally {
    myLock.unlock(); // make sure the lock is unlocked even if an exception is thrown
}
```

这一结构确保任何时刻只有一个线程进入临界区。一旦一个线程封锁了锁对象，其他任何线程都无法通过lock语句。当其他线程调用lock时，它们被阻塞，直到第一个线程释放锁对象。

锁是可重入的，因为线程可以重复地获得已经持有的锁。锁保持一个持有计数(hold count)来跟踪对lock方法的嵌套调用。线程在每一次调用lock都要调用unlock来释放锁。由于这一特性，被一个锁保护的代码可以调用另一个使用相同的锁的方法。

### 条件对象

通常，线程进入临界区，却发现在某一条件满足之后它才能执行。要使用一个条件对象来管理那些已经获得了一个锁但是却不能做有用工作的线程。由于历史原因，条件对象经常被称为**条件变量(condition variable)**

一个锁对象可以有一个或多个相关的条件对象。可以用newCondition方法获得一个条件对象。例如设置一个条件对象来表达“余额充足”条件。

```java
class Bank {
    private Condition sufficientFunds;
    ....
    public Bank () {
        sufficientFunds = bankLock.newCondition();
    }
}
```

如果发现余额不足，它调用

```java
sufficientFunds.await();
```

当另一个线程转账时，它应该调用

```java
sufficientFunds.signalAll():
```

通常，对await的调用应该在如下形式的循环体中，

```java
while(!(ok to proceed)) {
    condition.await();
}
```

### 同步阻塞

每一个Java对象有一个锁。线程可以通过调用同步方法获得锁。还有另一种机制可以获得锁，通过进入一个同步阻塞。当线程进入如下形式的阻塞：

```java
synchronized(obj) { // this is the syntax for a synchronized block
    cirtical section
}
```

于是它获得obj锁

有时会发现“特殊的”锁，例如：

```java
public class Bank {
    private double[] accounts;
    private Object lock = new Object();
    ...
    public void transffer(int from, int to, int amount) {
        synchronized (lock) { // an ad-hoc lock
        accounts[from] -= amout;
        accounts[to] += amount;
        }
    }
}
```

在此，lock对象被创建仅仅是用来使用每个Java对象持有的锁。

有时程序员使用一个对象的锁来实现额外的原子操作，实际上称为**客户端锁定(client-side locking)**。客户端锁定是非常脆弱的，通常不推荐使用。

### Volatile域

如果向一个变量写入值，而这个变量接下来可能会被另一个线程读取，或者，从一个变量读值，而这个变量可能是之前被另一个线程写入的，此时必须使用同步。
volatile关键字为实例域的同步访问提供了一种免锁机制。如果声明一个域为volatile，那么编译器和虚拟机就知道该域是可能被另一个线程并发更新的。

Volatile变量不能提供原子性。例如，方法

```
public void flipDone {
    done = !done // not atomic
}
```

### 原子性

AtomicInteger 类提供了方法incrementAndGet和decrementAndGet，它们分别以原子方式将一个整数自增或自减。可以安全地使用AtomicInteger作为共享计数器而无须同步。
另外这个包中还包含AtomicBoolean、AtomicLong和AtomicReference以及Boolean值、整数、log值和引用的原子数组。

### 读/写锁

下面是使用读写锁的必要步骤：

1）构造一个ReentrantReadWriteLock对象：

```java
private ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
```

2) 抽取读锁和写锁：

```java
private Lock readLock = rwl.readLock();
private Lock writeLock = rwl.writeLock();
```

3) 对所有的获取方法加读锁：

```java
public double getTotalBalance() {
    readLock.lock();
    try{
        ...
    } finally {
        readLock.unlock();
    }
}
```

4) 对所有的修改方法加写锁：

```java
public void transfer() {
    writeLock.lock();
    try {

    } finally {
        writeLock.unlock();       
    }
}
```

Lock readLock()

得到一个可以被多个读操作共用的读锁，但会排斥所有写操作。

Lock writeLock()

得到一个写锁，排斥所有其他的读操作和写操作。

### 阻塞队列

|方法|正常动作|特殊情况下的动作|
| :----- | :------- | :------ |
|add|添加一个元素|如果队列满，则抛出IllegalStateException异常|
|element|返回队列的头元素|如果队列空，则抛出NoSuchElementException|
|offer|添加一个元素并返回true|如果队列满，返回false|
|peek|返回队列的头元素|如果队列空，则返回null|
|poll|移出并返回队列的头元素|如果队列空，则返回null|
|put|添加一个元素|如果队列满，则阻塞|
|remove|移出并返回头元素|如果队列空，则抛出NoSuchElementException异常|
|take|移出并返回头元素|如果队列空，则阻塞|

阻塞队列方法分为以下3类，这取决于当队列满或空时它们的响应方式。如果将队列当作线程管理工具来使用，将要用到put和take方法。当试图向满的队列中添加或从空的队列中移出元素时，add、remove和element操作抛出异常。当然，在一个多线程程序中，队列会在任何时候空或满，因此，一定要使用offer、poll和peek方法作为替代。这些方法如果不能完成任务，只是给出一个错误提示而不会抛出异常。

poll和peek方法返回空来指示失败。因此，向这些队列中插入null值是非法的。

还有带超时的offer方法和poll方法的变体。例如，下面的调用：

```java
boolean success = q.offer(x, 100, TimeUnit.MILLISECONDS);
```

尝试在100毫秒的时间内在队列的尾部插入一个元素。如果成功返回true；否则，达到超时时，返回false。

### Callable与Future

Runnable封装一个异步任务，可以把它想象成为一个没有参数和返回值的异步方法。Callable与Runnable类似，但是有返回值。Callable接口是一个参数化的类型，只有一个方法call。

Future保存异步计算的结果。

Future接口具有下面的方法：

```java
public interface Future<V> {
    V get() throws ...;
    V get(long timeout, TimeUnit unit) throws ...;
    void cancel(boolean mayInterrupt);
    boolean isCancelled();
    boolean isDone();
}
```

第一个get方法的调用被阻塞。直到计算完成。如果在计算完成之前，第二个方法的调用超时，抛出一个TimeoutException 异常。如果运行该计算的线程被中断，两个方法都将抛出InterruptedException。如果计算已经完成，那么get方法立即返回。

如果计算还在进行，isDone方法返回false;如果完成了，则返回true。

FutureTask包装器是一种非常便利的机制，可将Callable转换成Future和Runnable，它同时实现二者的接口。 例如：

```java

Callable<Integer> myComputation = ...;
FutureTask<Integer> task = new FutureTask<Integer>(myComputation);
Thread t = new Thread(task); // it's a Runnable
t.start();
...
Integer result = task.get(); // it's a Future
```

使用线程池：

```java
ExecutorService pool = Executors.newCachedThreadPool();
CallableTask callable = new CallableTask();
Future<Integer> result = pool.submit(callable);
result.get();
pool.shutdown();
```

### 同步器

|类|它能做什么|何时使用|
| :----- | :------- | :------ |
|CyclicBarrier|允许线程等待直至其中预定数目的线程到达一个公共障栅(barrier)，然后可以选择执行一个处理障栅的动作|当大量的线程需要在它们的结果可用之前完成时|
|CountDownLatch|允许线程集等待直到计数器减为0|当一个或多个线程需要等待直到指定数目的事件发生|
|Exchanger|允许两个线程在要交换的对象准备好时交换对象|当两个线程工作在同一数据结构的两个实例上的时候，一个向实例添加数据而另一个从实例清除数据|
|Semaphore|允许线程集等待直到被允许继续运行为止|限制方法资源的线程总数。如果许可数是1，常常阻塞线程直到另一个线程给出许可为止|
|SynchronousQueue|允许一个线程把对象交给另一个线程|在没有显式同步的情况下，当两个线程准备好将一个对象从一个线程传递到另一个时|

#### 障栅

```java
CyclicBarrier barrier = new CyclicBarrier(nthreads);
```

每一个线程做一些工作，完成后在障栅上调用await;

```java
public void run() {
    doWork();
    barrier.await();
    ...
}
```

await 方法有一个可选的超时参数：

barrier.await(100, TimeUnit.MILLISECONDS);

如果任何一个在障栅上等待的线程离开了障栅，那么障栅就被破坏了。在这种情况下，所有其他线程的await方法抛出BrokenBarrierException异常。那些已经在等待的线程立即终止await的调用。

可以提供一个可选的障栅动作(barrier action)，当所有线程到达障栅的时候就会执行这一动作。

```java
Runnable barrierAction = ...;
CyclicBarrier barrier = new CyclicBarrier(nthreads, barrierAction);
```

该动作可以收集那些单个线程的运行结果。

障栅被称为是**循环**的(cyclic),因为可以在所有等待线程被释放后被重用。在这一点上，有别于CountDownLatch, CountDownLatch只能被使用一次。

#### 同步队列

同步队列是一种将生产者与消费者线程配对的机制。当一个线程调用SynchronousQueue的put方法时，它会阻塞直到另一个线程调用take方法为止，反之亦然。与Exchanger的情况不同，数据仅仅沿一个方向传递，从生产者到消费者。
