### 国际化

准备资源文件，资源文件的命名格式如下：放在src下

baseName_language_country.properties

baseName_language.properties

baseName.proerpties

其中baseName是资源文件的基本名，如：baseName_zh_CN.properties

当准备好资源文件后，我们可以在struts.xml中通过struts.custom.i18m.resources常量把资源文件定义为全局资源文件，如下：
```xml
<constant name="struts.custom.i18m.resources" value="baseName">  
```
后面我们就可以在页面或在action中访问国际化信息：

1) 在JSP页面中使用<s:text name=""/>标签输出国际化信息：
```xml
<s:text name="user"/>，name为资源文件中的key
```
2) 在Action类中，可以继承ActionSupport，使用getText()方法得到国际化信息，该方法的第一个参数用于指定资源文件中的key。

3) 在表单标签中，通过key属性指定资源文件中的key，如：
```xml
<s:textfield name="realname" key="user">
```
### 输出带占位符的国际化信息

资源文件中的内容如下：
welcome =  {0} ，欢迎来到{1}
在jsp页面中输出带占位符的国际化信息
```html
<s:text name="welcome">  
  <s:param>useradmin</s:param>  
  <s:param>here</s:param>  
</s:text> 
```
在Action类中获取带占位符的国际化信息，可以使用getText(String key, String[] args)或getText(String aTextName, List args)方法。

### 国际化——包范围资源文件

在Java的包下放置**package**_language_country.properties资源文件，package为固定写法，处于该包及子包下的action都可以访问该资源。当查找指定key的消息时，系统会先从package资源文件查找，找不到时才会从常量struts.custom.i18n.resources指定的资源文件中寻找。

### 国际化——Action范围资源文件

在Action类所在的路径，放置ActionClassName_language_country.properties资源文件，ActionClassName为action类的简单名称。

查找顺序先action范围再包范围再全局范围。

### 国际化——JSP中直接访问某个资源文件

使用<s:i18n>标签我们可以在类路径下直接从某个资源文件中获取国际化数据，而无需任何配置。
```html
<s:i18n name="BaseName">  
    <s:text name="welcome">  
</s:i18n>  
```
**BaseName**为类路径下资源文件的基本名。

如果要访问的资源文件在类路径的某个包下，可以这样访问：
```html
<s:i18n name="cn/test/action/package">  
    <s:text name="welcome">  
          <s:param>小张</s:param>  
    </s:text>  
</s:i18n>  
```

上面访问cn.test.action包下**package**范围的资源文件。

或者action：cn/test/action/**XxxAction**