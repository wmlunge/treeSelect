# MultipleTreeSelect.js
MultipleTreeSelect
用于处理低侵入的树形选择框业务。基于ztree实现
依赖jaquey和ztree
使用方法为


1.首先传入一个配置


 var defaults = {
            textLabel: "选中的text内容将作为此表单项提交",
            zNodes: "简单树结构的数组格式参考index.html中"
       }
							
							
2. 然后给相应的元素在页面加载完成之后这样注册一下即可。后续会提供更多的api；推荐使用textarea来初始化
 $(document).ready(function () {
            $("#jsaontree").drawMultipleTree(defaults);
 });
联系邮箱35312@163.com
