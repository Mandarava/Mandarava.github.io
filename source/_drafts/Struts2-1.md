1、编码中文字符

URLEncoder.encode()

/employeeAdd.jsp?username=${username}

2、

    <package name = "test" namespace="/control/employee" extends = "struts-default">  
        <action name="redirectAction">  
            <result type="redirectAction">  
                // 在同一个包下 helloworld  
                // 不同包下  
                <param name="actionName">xxx</param>  
                <param name="namespace">/control/department</param>  
            </result>  
        </action>  
    </package>  
    
    <package name="other" namespace="/control/department"extends="struts-default">  
        <action name="xxx">  
            <result>/WEB-INF/page/hello.jsp</result>  
        </action>  
    </package>

构建出路径/control/department/sefsdf/21324/xxx   如果没有则一直往前找。

3、 为action属性注入值，需要迎合变化的场合

Action里面写好get、set， private String savepath;

    <action ….>  
        <param name="savepath">/images</param>  
        <result name="success">/WEB-INF/page/message.jsp</result>  
    </action> 

4、指定Struts2处理的请求后缀,原来都是默认使用.action后缀访问Action。

    <struts>  
        <constant name="struts.action.extension" value="action,do,go">  
    </struts>

5、上传文件的大小限制

    <constant name="struts.multipart.maxSize" value="10701096"> 

6、与struts1不同，struts2对用户的每一次请求都会创建一个Action，所以Struts2中的Action是线程安全的。

7、为应用指定多个配置文件

    <struts>  
        <include file="struts-user.xml"/>  
        <include file="stuts-order.xml"/>  
    </struts>  
通过这种方式可以将struts2的Action按模块添加在多个配置文件中。

8、动态方法调用和使用通配符定义action

    <action name="list_*" class="......" method="{1}">  
    </action> 

9、自定义类型转换器

    import com.opensymphony.xwork2.conversion.impl.DefaultTypeConverter;     
    public class DateTypeConverter extends DefaultTypeConverter {
       @Override  
       public Object convertValue(Map<String, Object> context, Object value, ClasstoType) {  
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");  
            try{  
                if(toType== Date.class){  //当字符串向Date类型转换时  
                    String[]params = (String[]) value;// request.getParameterValues()  
                    return dateFormat.parse(params[0]);  
                }else if(toType == String.class){//当Date转换成字符串时  
                    Datedate = (Date) value;  
                    return dateFormat.format(date);  
                }  
            }catch (ParseException e) {
                // do sth.
            }  
            return null;  
        }  
    }  

1) 将上面的类型转换器注册为**局部类型转换器**：

在Action类所在的包下放置ActionClassName-conversion.properties文件，ActionClassName是Action的类名，后面的-conversion.properties是固定写法。

在properties文件中的内容为：

*属性名称=类型转换器的全类名(包含包名)*

birthday=cn.test.type.converter.DateTypeConverter

2) 将上面的类型转换器注册为**全局类型转换器**：

在WEB-INF/classes下（src下面）放置xwork-conversion.properties文件。在properties文件中的内容为：

*待转换的类型=类型转换器的全类名*

Java.util.Date = cn.test.type.converter.DateTypeConverter

10、 文件上传
第一步：在WEB-INF/lib下加入commons-fileupload-1.2.1.jar、commons-io-1.3.2.jar。这两个文件可以从http://commons.apache.org下载

第二步：把form表的enctype设置为：”multipart/form-data”如下：

    <form enctype ="multipart/form-data" action="${pageContext.request.contextPath}/xxx.action" method="post">  
        <input type="file" name = "uploadImage">  
    </form>  

第三步：在Action类中添加以下属性，属性对应于表单中文件字段的名称：

    public class HelloWorldAction  {
       private File uploadImage; //得到上传的文件
       private String uploadImageContentType; //得到文件的类型
       private String uploadImageFileName;   //得到文件的名称
       //这里省略了属性的getter/setter方法  
    }

    public String execute() throws Exception{  
        String realpath = ServletActionContext.getServletContext().getRealPath("/images");  
        System.out.println(realpath);  
        if(image!=null){  
        File savefile = new File(new File(realpath), imageFileName);  
            if(!savefile.getParentFile().exists()) savefile.getParentFile().mkdirs();  
            FileUtils.copyFile(image, savefile);  
            ActionContext.getContext().put("message", "上传成功");  
        }  
        return "success";  
    }

多文件上传

    private File[] uploadImage; //得到上传的文件
    private String[] uploadImageContentType;//得到文件的类型
    private String[] uploadImageFileName;//得到文件的名称
    //get set  

    public String execute() throws Exception{  
        String realpath = ServletActionContext.getServletContext().getRealPath("/images");  
        System.out.println(realpath);  
        if(image!=null) {  
            File savedir = new File(realpath);  
            if(!savedir.exists()) savedir.mkdirs();  
            for(int i = 0 ; i<image.length ; i++){                 
                File savefile = new File(savedir, imageFileName[i]);  
                FileUtils.copyFile(image[i], savefile);  
            }  
            ActionContext.getContext().put("message", "上传成功");  
        }  
        return "success";  
    }  