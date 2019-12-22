
(function ($) {
    var $target_element;
    var defaults = {
        /*  textLabel: "",*/
        zNodes: [],
        async: {
            enable: false,
            url: ""
        },
        callback: {
            onCheck: function (treeNode) {

            }
        },
        chkStyle: "checkbox"
        , radioType: "all",
        height: 'auto'
    }

    var DrawMultipleTree = function (target_element, options) {
        this.$target_element = $(target_element);
        _self = this;

        var $options = function () {
            return $.extend({}, defaults, options, _self.$target_element.data());//合并业务数据
        }
        /*避免共用同一个配置时两边干扰*/
        this.options = cloneObj(new $options());
        this.init();
    }

    function GenNonDuplicateID(randomLength) {
        return Number(Math.random().toString().substr(3, randomLength) + new Date().getTime()).toString(36)
    }

    var cloneObj = function (obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
        }
        return newObj;
    };
    /**
     *
     * 成员和方法
     */
    DrawMultipleTree.prototype = {
        constructor: DrawMultipleTree,
        init: function () {
            var _self = this;
            this.targetOffset = this.$target_element.offset();
            this.$target_element.nameLabel = this.$target_element.attr("name");
            this.$target_element.idLabel = this.$target_element.attr("id");
            this.$target_element.checks = this.$target_element.attr("checks");
            this.$target_element.textLabel = this.$target_element.attr("textLabel");
            /*为了增加但页面应用的兼容性增加id属性*/
            if (this.$target_element.idLabel === undefined || this.$target_element.idLabel === "") {
                this.$target_element.idLabel = GenNonDuplicateID(3);
            }
            if (this.$target_element.nameLabel === undefined || this.$target_element.nameLabel === "") {
                this.$target_element.nameLabel = GenNonDuplicateID(3);
            }
            this.$target_element.attr("name", this.$target_element.textLabel === "" ? this.$target_element.nameLabel + "text" : this.$target_element.textLabel);
            /*默认以当前元素为选项容器*/
            /*初始化树容器*/
            this.init_tree_container = init_tree_container.call(this);
            this.init_ztree = init_ztree.call(this)
            /*给元素绑定点击事件*/
            bind_element_click_event.call(this)
            /*挂载树容器*/

        },
        /*获取选中的选项*/
        getChecks: function (type) {
            var zTreeObj = this.$zTreeObj
            nodes = zTreeObj.getCheckedNodes(true),
                v = "";
            rv = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ",";
                rv += nodes[i].id + ",";
            }
            if (v.length > 0) v = v.substring(0, v.length - 1);
            if (rv.length > 0) rv = rv.substring(0, rv.length - 1);

            if ("val" === type)
                return rv;
            if ("text" === type)
                return v;
        }
    }
    var bind_element_click_event = function () {
        var tree_container = this.tree_container;
        this.$target_element.click(function (event) {
            event.stopPropagation();
            if (!tree_container.is(':visible')) {
                tree_container.slideDown("fast");
            } else {
                tree_container.animate({height: 'toggle', opacity: 'toggle'}, "fast");
            }
        });
        this.all_container.mouseleave(function () {

            if (tree_container.is(':visible')) {

                tree_container.animate({height: 'toggle', opacity: 'toggle'}, "fast");
            }
        });
        /*解决鼠标快速移动不兼容问题*/
        this.tree_container.find("a").mouseleave(function (event) {
            event.stopPropagation();
        });
        this.tree_container.find("span").mouseleave(function (event) {
            event.stopPropagation();
        });
        this.searchTime=null;
       var _this=this;
        this.searchInput.keyup(function () {

                var keyWord= $(this).val();
                /*上一句已经执行了直接清理掉*/
                if (this.searchTime) {
                    clearTimeout(this.searchTime);
                }
                this.searchTime = setTimeout(function(){
                   console.log(keyWord);
                    var allNodes = _this.$zTreeObj.transformToArray(_this.$zTreeObj.getNodes());
                    _this.$zTreeObj.hideNodes(allNodes);    //当开始搜索时，先将所有节点隐藏
                    var nodeList = _this.$zTreeObj.getNodesByParamFuzzy('name', keyWord, 0);    //通过关键字模糊搜索
                    var arr = new Array();
                    for(var i=0; i<nodeList.length; i++){
                        arr = $.merge(arr,nodeList[i].getPath());    //找出所有符合要求的叶子节点的路径
                    }
                    _this.$zTreeObj.showNodes($.unique(arr));    //显示所有要求的节点及其路径节点
                    _this.$zTreeObj.expandAll(true);
                }, 500);

        });
    }
    /*绘制容器和样式*/
    var init_tree_container = function () {
        this.ztreeid = this.$target_element.idLabel + "_zTree";
        this.$target_element.css({display: 'block'});
        this.all_container = this.$target_element.wrap('<div class="mts-container" style="inline-block;position: relative;"/>').parent();
        this.tree_container =
            $('<div   class="menuContent" style="display:none;background-color: white; position: absolute;z-index:110004;border: solid 1px;border-radius: 5px;padding-bottom: 10px" >'
                +
                '<input class="searchInput" type="text" style="margin-top: 4px;border-radius:3px;width: ' + getelementwidth(this.$target_element) + '"><ul id="' + this.ztreeid + '" class="ztree" style="padding:0 0;margin-top:0;border: none;border-radius: 5px;  height:' + this.options.height + '; width:' + getelementwidth(this.$target_element) + '; background-color: white"></ul>' +
                '</div>').insertAfter(this.$target_element);
        this.checked_val_element = $('<input type="hidden" name="' +
            this.$target_element.nameLabel + '">').insertAfter(this.tree_container);
        this.searchInput = $(".searchInput");
        return this;
    }

    function getelementwidth(element) {

        return element.outerWidth() - 2;
    }

    var init_ztree = function () {
        var inner_$target_element = this.$target_element;
        var inner_$checked_val_element = this.checked_val_element;
        var inner_$checks = this.$target_element.checks;
        var callback_$oncheck = this.options.callback.onCheck;
        ztreeonAsyncSuccess = function (event, treeId, treeNode, msg) {
            zTreeObj.setting.callback.onCheck();
            $('#' + treeId).find("a").mouseleave(function (event) {
                event.stopPropagation();
            });
            $('#' + treeId).find("span").mouseleave(function (event) {
                event.stopPropagation();
            });
        };
        var initNodeCheckeState = function (checks, nodes) {
            if (checks != "" && checks != undefined && checks != null) {
                var checks_array = checks.split(',');
                for (var i = 0; i < nodes.length; i++) {
                    for (var t = 0; t < checks_array.length; t++) {
                        if (("" + nodes[i].id) === checks_array[t]) {
                            nodes[i].checked = true
                        }
                    }

                }
            }
            return nodes;
        }
        var ztreeOnCheck = function (e, treeId, treeNode) {

            nodes = zTreeObj.getCheckedNodes(true),
                v = "";
            rv = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ",";
                rv += nodes[i].id + ",";
            }
            if (v.length > 0) v = v.substring(0, v.length - 1);
            if (rv.length > 0) rv = rv.substring(0, rv.length - 1);
            inner_$target_element.val(v);
            inner_$checked_val_element.attr("value", rv);
            callback_$oncheck(nodes);
        }
        var setting = {
            check: {
                enable: true,
                chkboxType: {"Y": "", "N": ""},
                chkStyle: this.options.chkStyle,
                radioType: this.options.radioType
            },
            view: {
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: ztreeOnCheck,
                onAsyncSuccess: ztreeonAsyncSuccess,
                onClick: function (e, treeId, treeNode, clickFlag) {

                    zTreeObj.checkNode(treeNode, !treeNode.checked, true);
                    zTreeObj.setting.callback.onCheck();
                }
            },
            async: this.options.async

        };
        /*异步完成后设置初始选中的值*/
        setting.async.dataFilter = function (treeId, parentNode, responseData) {
            if (responseData) {
                initNodeCheckeState(inner_$checks, responseData);
            }
            return responseData;
        };
        this.options.zNodes = initNodeCheckeState(inner_$checks, this.options.zNodes)
        var zTreeObj = $.fn.zTree.init($("#" + this.ztreeid), setting, this.options.zNodes);
        zTreeObj.setting.callback.onCheck();
        this.$zTreeObj = zTreeObj;
        return this

    }

    var DrawNormalTree = function (target_element, options) {
        this.$target_element = $(target_element);
        this.$target_element.hide();
    }

    /**
     * 多选模式
     * @param options
     * @returns {*}
     */
    $.fn.drawMultipleTree = function (options) {
        var option = arguments[0], value
        args = arguments;
        this.each(function () {
            var $this = $(this);
            data = $this.data('drawMultipleTree')
            if (!data) {
                $.data(this, 'drawMultipleTree', new DrawMultipleTree(this, options));
            }
            if (typeof option === 'string') {

                value = data[option](args[1]);

            }

        });
        return typeof value !== 'undefined' ? value : this;
    };
})(jQuery)
