# MultipleTreeSelect.js

用于处理低侵入的树形选择框业务。基于ztree实现;<br>
依赖jquery和ztree;<br>
支持谷歌，ie8+;<br>
一、非异步请求方式使用
-------
1.首先传入一个配置<br>
 var defaults = {<br>
            textLabel: "选中的text内容将作为此表单项提交",<br>
            zNodes: "简单树结构的数组格式参考index.html中"<br>
       }<br>
														
2. 然后给相应的元素在页面加载完成之后这样注册一下即可。后续会提供更多的api；推荐使用textarea来初始化<br>
 $(document).ready(function () {<br>
            $("#jsaontree").drawMultipleTree(defaults);<br>
 });
 # 二、异步请求方式实现
 -------
   var defaults = {<br>
            textLabel: "text内容",<br>
            async: {<br>
                    enable: true,<br>
                    url: "url"<br>
                }<br>
	    
        }<br>
联系邮箱35312@163.com
