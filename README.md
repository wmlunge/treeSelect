**先讲一下老版本两年带来的意想不到的苦果。**
本身该组件名字叫做MultipleTreeSelect，工作几年的开发不管后台前台基本都会有需要做**树形控件**的场景。要知道在老岁月里，大部分公司还用的是jQuery,那时候不像现在各种ui框架盛行，一个合适的开箱即用的下拉树形插件并不多见。有的基本上都是各种博客教你如何去实现一个。往往搞一个这东西，总要搞一大堆冗余代码。而且每次要用的时候都是如此；所以当时自己就动手封装了一个满足**特定需求**的MultipleTreeSelect；完事后基本上在传统js环境下还是能适应一些场景的，在那时候给本人省了很多时间；

后来开源平台火起来了，整理知识的时候把这个组件存到了gitee上面，不知道过了多久，也是无心插柳竟然被某些小伙伴传到了一些资源网站上，然后就开始有较多的人用这个插件了；插件的各种弊端也就暴露出来了，最近无意间翻看的时候，发现好多人问一些问题；心想这下**坏事了**，给一些小伙伴带来不少困扰，浪费了他们不少时间研究，插件缺少一些高频需要的常见功能；

其实这个组件老版本在早些年的传统行业，交互都是刷新整个页面来渲染的时候，能支撑的住一些场景；但是在现代前端流行ajax异步渲染，单页应用等技术的背景下，很多功能都行不通；


意识到问题之后，我从一些资源网站的评价和小伙伴的私信和邮件中抽取一些迫切需要的功能对组件进行重构升级；也吸取了一些意见；提供了几个开箱即用的api；同时直接把组件名字也修改成了treeSelect;这也是为什么直接是2.0的原因。

下面直接把readme分享给大家；希望对您有用，能帮助你。

如果有疑问或者建议可以给我留言；
 

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
![demo](https://user-gold-cdn.xitu.io/2019/12/28/16f4cfb0a596db62?w=323&h=317&f=png&s=13324)
#### 单选选示例图片
![demo](https://user-gold-cdn.xitu.io/2019/12/28/16f4cfb0a7f11f77?w=322&h=415&f=png&s=17136)
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
              filter:true/* 是否开启过滤 默认true*/
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


TreeSelect 开发者网站:http://www.qqxh.net

