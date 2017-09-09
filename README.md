# MultipleTreeSelect.js
用于处理低侵入的树形选择框业务。基于ztree实现
--------
依赖jquery和ztree
---------
使用方法为<br>
------
支持谷歌，ie8+
---
1.首先传入一个配置<br>
 var defaults = {<br>
            textLabel: "选中的text内容将作为此表单项提交",<br>
            zNodes: "简单树结构的数组格式参考index.html中"<br>
       }<br>
														
2. 然后给相应的元素在页面加载完成之后这样注册一下即可。后续会提供更多的api；推荐使用textarea来初始化<br>
 $(document).ready(function () {<br>
            $("#jsaontree").drawMultipleTree(defaults);<br>
 });<br>
联系邮箱35312@163.com
