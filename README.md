### jquery 树形下拉框插件


JasonMultipleTreeSelect.js是基于jquery和ztree开发的树形下拉选择框插件，支持ie8+,谷歌，火狐，360等浏览器

#### JasonMultipleTreeSelect.js有如下主要特点
- 体积小巧，大小只有4k
- 兼容到ie8以及各大主流浏览器
- 低侵入式使用
- 使用方便
- 继承了ztree高效渲染


**Jason 欢迎使用本插件: Jason**
#### 示例图片：
![image](https://github.com/PureCreek/MultipleTreeSelect.js/tree/master/src/demo/img/1.jpg)
#### 快速上手示例：

**1. 引入jquery,ztree,JasonMultipleTreeSelect等js和css文件**

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
    <script type="text/javascript" src="JasonMultipleTreeSelect.js"></script>

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
        /*配置项*/
        var defaults = {
            textLabel: "jasontext",
            zNodes: zNodes
        }
        /*注册下拉树方法也很简单*/
        $(document).ready(function () {
            $("textarea").drawMultipleTree(defaults);
        });
        //-->
    </script>
</head>

<body style= "width: 1080px ;margin: 0 auto" >
<br>
<!--在此元素上进行渲染下拉树-->
<textarea   style="width: 300px" checks="1,11,2,23"   type="text" readonly></textarea>

</body>
</html>

```

**2.异步加载实例**

```js
 
```

**3.配置文件详解**

```js
 
```

**4.api列表**

```js
 
```

 

**JasonMultipleTreeSelect 开发者网站：[http://www.qqxh.net](http://www.qqxh.com)**

