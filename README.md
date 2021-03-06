### jquery 树形下拉框插件

TreeSelect,ztree开发的树形下拉选择框插件，支持ie8+,谷歌，火狐，360等浏览器<br>
现在升级2.0名字由原来的 _**MultipleTreeSelect改为TreeSelect.js**_ 
api更加丰富。结构更加清晰
#### TreeSelect有如下主要特点
- 兼容ie8以及各大主流浏览器
- 低侵入式使用
- 使用简单方便
- 继承了ztree高效渲染


**TreeSelect 欢迎使用本插件: TreeSelect**

#### 多选示例图片：
![输入图片说明](https://images.gitee.com/uploads/images/2020/0403/201104_3e421a7b_2042758.png "2.png")
#### 单选选示例图片
![输入图片说明](https://images.gitee.com/uploads/images/2020/0403/201119_302a8da7_2042758.png "3.png")
#### 快速上手示例

**1. 引入jquery,ztree,TreeSelect等js和css文件**

```html
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<html>
<head>
    <title>$Title$</title>
    <link type="text/css" rel="stylesheet" href="css/demo.css">
    <link type="text/css" rel="stylesheet" href="css/metroStyle/metroStyle.css">
    <script src="js/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="js/jquery.ztree.all.js"></script>
    <script type="text/javascript" src="treeSelect.2.0.js"></script>

    <script>


    </script>
    <script type="text/javascript">

        /*节点列表（这里演示的是非异步方式的实现）*/
        var zNodes = [
            {id: 1, pId: 0, name: "火之国",   open: true},
            {id: 11, pId: 1, name: "木叶忍者", open: true },
            {id: 111, pId: 11, name: "鸣人" },
            {id: 112, pId: 11, name: "佐助"},
            {id: 12, pId: 1, name: "木叶暗部" },
            {id: 121, pId: 12, name: "鼬"},
            {id: 122, pId: 12, name: "卡卡西"},
            {id: 2, pId: 0, name: "沙之国", open: true},
            {id: 21, pId: 2, name: "千代婆婆"},
            {id: 26, pId: 2, name: "我爱罗"} ,
            {id: 22, pId: 2, name: "沙之国忍者", open: true},
            {id: 221, pId: 22, name: "手鞠"},
            {id: 222, pId: 22, name: "勘九郎"},
            {id: 3, pId: 0, name: "水之国"},
            {id: 4, pId: 0, name: "土之国"}
        ]; 
        /*注册下拉树方法也很简单*/
        $(document).ready(function () {
            $("textarea").treeSelect({
            
            zNodes: zNodes
        });
        });
        //-->
    </script>
</head>

<body style= "width: 1080px ;margin: 0 auto" ><br>
<!--在此元素上进行渲染下拉树-->
<textarea   style="width: 300px" checks="1,11,2,23"  type="text" readonly></textarea>

</body>
</html>

```

**2.异步加载配置实例**

```js
 var options = {
             async: {
                 enable: true,
                 url: "http://qqxh.net"
             }
         }
```

**3.配置文件详解**
```js
 var options = {
             
             async: {
                 enable: true,
                 url: "异步加载url地址"
             },
             chkStyle: "radio",/*radio：单选模式(Radio mode)，checkbox：多选模式(checkbox mode)，默认为多选*/
             radioType : "all",/*all：整个树只能有一个选中，level：在每一级节点范围内当做一个分组*/
             height:433,/*容器高度默认200px*/
             callback:{
                 onCheck: function() {}/*选中事件的回调*/
             },
             direction: "auto",/* up向上,down向下,auto自动适应  默认auto*/
             filter:true,/* 是否开启过滤 默认true*/
             searchShowParent: true,/* 搜索是否展示父级默认false*/
             beforeSearchPromise: function (defer, treeSelectObj) {
                         /*模拟异步加载,正常场景为ajax请求成功后加载数据到treeSelectObj后再调用defer.resolve()*/
                         setTimeout(function () {
                             defer.resolve();
                         }, 500);
                     }
         }
```

**4.api列表**
- 获取选中文本
```js
  
 
var obj=$("#yourContentId").treeSelect(options);（如果这里jquery选择器获取到多个元素，那么这里返回的是TreeSelect对象列表）

    obj.text();
 

```
- 获取选中值
 
```js
 var obj=$("#yourContentId").treeSelect(options);

    obj.val();
```

- js给组件赋值
 
```js
 var obj=$("#yourContentId").treeSelect(options);

    obj.val([1,2,3,4,5,6,7]);
```

 - 默认选中值
 
方式1：

 通过给dom元素设置属性checks来进行设置，格式为:checks="1,2,3,4,5" 
 
 例如：
 

```
 <textarea   style="width: 300px;overflow:hidden;"  **checks** ="1,11,2,23"   type="text" readonly>
 </textarea>
```
 
方式2：

 通过optios配置实现配置项为：checks
 
 例如：
 

```
 $("#yourContentId").treeSelect({checks:[1,2,3],.....});
```
 - 销毁组件
 
方式1：

 通过destory方法进行销毁
 
 例如：
 

```
 var obj=$("#yourContentId").treeSelect(options);
    obj.destory();
```

### 注意事项:


检索功能只支持前端检索，也就是说想使用异步模式的话，需要一次把树节点加载完全然后检索才有意义。配合异步后台检索暂时不考虑实现。
如果节点数量特别多的话，建议第一批先加载前n层级的节点。然后用户使用搜索功能的话，再去加载第二部分节点。


TreeSelect 开发者网站:http://www.qqxh.net

