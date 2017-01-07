### 自定义拦截器

```java
    package cn.test.interceptor;  
    
    public class PermissionInterceptor implements Interceptor {  
    
       publicvoid destroy() {  
       
       } 
    
       publicvoid init() { 
    
       }  
    
       public String intercept(ActionInvocation invocation) throws Exception {  
          Objectuser = ActionContext.getContext().getSession().get("user");
          // 如果user不为null,代表用户已经登录,允许执行action中的方法  
          if(user != null) {
            return invocation.invoke();   
          } 
          ActionContext.getContext().put("message","你没有权限执行该操作");  
          //最好为全局视图，许多地方都要使用
          return "message";   
       }  
    } 
```

登录：
```java
    request.getSession().setAttribute("user","useradmin");
```

退出：

```java
    request.getSession().removeAttribute("user");
```

struts.xml

```xml
    <package name="employee" namespace="/control/employee" extends="struts-default">  
        <interceptors>  
            <interceptor name="permission" class="cn.test.interceptor.PermissionInterceptor"/>  
                <interceptor-stack name="permissionStack">  
                            <interceptor-ref name="defaultStack"/>  
                            <interceptor-ref name="permission" />  
                </interceptor-stack>  
        </interceptors>  
        <global-results>  
            <result name="success">/WEB-INF/page/message.jsp</result>  
        </global-results>  
        <action name="list_*" class="cn.test.action.HelloWorldAction"method="{1}">  
            <interceptor-ref name="permissionStack" />  
        </action>  
    </package>  
```

因为struts2中如文件上传，数据验证，封装请求参数到action等功能都是由系统默认的defaultStack中的拦截器实现的，所以我们定义的拦截器需要引用系统默认的defaultStack，这样应用才可以使用struts2框架提供的众多功能。

如果希望包下的所有action都使用自定义的拦截器，可以通过<default-interceptor-ref  name="permissionStack"/>把拦截器定义为默认拦截器。 注意：每个包智能指定一个默认拦截器。 另外，一旦我们为该包中的某个action显式指定了某个拦截器，则默认拦截器不会起作用。

### 对Action中所有方法进行输入校验

```java
    public class PersonAction extends ActionSupport{  
       private String username;  
       private String mobile;  
       // get set  
      
       @Override  
       public void validate() {//会对action中的所有方法校验  
            if(this.username ==null || "".equals(this.username.trim())) {  
                this.addFieldError("username","用户名不能为空");  
            }  
            if(this.mobile == null || "".equals(this.mobile.trim())) {  
                this.addFieldError("mobile","手机号不能为空");  
            }else {  
                if(!Pattern.compile("^1[358]\\d{9}$").matcher(this.mobile).matches()){  
                    this.addFieldError("mobile","手机号格式不正确");  
                }  
            }  
       }  
    } 
```
验证失败后，请求转发至input视图：

```
    <result name="input">index.jsp</result>
```
在addUser.jsp页面中使用*<s:fielderror/>*显示失败信息。

对action指定方法进行校验

public voidvalidateXxx() {}   //校验action中方法名为Xxx的方法,其他同上

如果validate(){  }什么都不写还是会进入input视图，考虑是否为类型转换失败的原因

### 基于XML配置方式实现对action的所有方法进行校验

使用基于XML配置方式实现输入校验时，Action也需要继承ActionSupport，并且提供校验文件，校验文件和action类放在同一个包下，文件的取名格式为：

ActionClassName-**validation**.xml，其中ActionClassName为action的简单类名，-validation为固定写法。

```xml
    <?xml version="1.0"encoding="UTF-8"?>  
    <!DOCTYPE validators PUBLIC"-//OpenSymphony Group//XWork Validator 1.0.3//EN""http://www.opensymphony.com/xwork/xwork-validator-1.0.3.dtd">  
    <validators>  
        <field name="username">  
            <field-validator type="requiredstring">  
                <param name="trim">true</param>  
                <param name="maxlength">20</param>  
                <message>用户名不能为空!</message>  
            </field-validator>  
        </field>  
        
        <field name="mobile">  
            <field-validator type="requiredstring">  
                <message>手机号不能为空!</message>  
            </field-validator>  
            <field-validator type="regex">  
                <param name="expression"><![CDATA[^1[358]\d{9}$]]></param>  
                <message>手机号格式不正确!</message>  
            </field-validator>  
        </field>  
    </validators>  
```
<field>指定action中要校验的属性，<field-validator>指定校验器，上面指定的校验器*requiredstring*是由系统提供的，系统提供了能满足大部分验证要求的校验器，这些校验器的定义可以在xwork-2.x.jar中的com.opensymphony.xwork2.validator.validators下的default.xml中找到。

![CDATA[] 把里面的内容当作普通文本

### 基于XML配置方式实现对指定action方法进行校验

校验文件取名应为：ActionClassName-ActionName-validation.xml

    <action name="user_*" class="cn.test.action.UserAction" method="{1}"">  
    </action>  

userAction中有以下两个处理方法：

public String add() {}

public String update() {}

校验文件的取名应为：UserAction-user_add-validation/UserAction-user_update-validation

如果同时提供了全部的和指定的校验文件，系统按下面顺序寻找校验文件

1. ActionClassName-validation.xml

2. ActionClassName-ActionName-validation.xml

然后进行汇总，如有冲突则使用后面文件中的校验规则

当action继承了另一个action，父类的action的（全部和指定的）校验文件会先被搜索到。

