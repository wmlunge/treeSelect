(function ($) {
    var defaults = {
        zNodes: [],
        async: {
            enable: false,
            url: ""
        },
        callback: {
            onCheck: function (treeNode) {
                console.log(treeNode)
            }
        },
        chkStyle: "checkbox",
        radioType: "all",
        height: 'auto'
    }
    var DrawMultipleTree = function (target_element, options) {
        this.$el = $(target_element);
        var _this = this;

        var $options = function () {
            return $.extend({}, defaults, options, _this.$el.data());//合并业务数据
        }
        /*避免共用同一个配置时两边干扰*/
        this.options = this.cloneObj(new $options());
        this.init();
    }
    DrawMultipleTree.prototype = {
        constructor: DrawMultipleTree,
        init: function () {
            this.$el.checks = this.$el.attr("checks");
            this.buildingDOM();
            this.initTree()
            this.bindEvent()
        },
        /*获取选中的选项*/
        getChecks: function (type) {
            var zTreeObj = this.$zTreeObj,
                nodes = zTreeObj.getCheckedNodes(true),
                v = "",
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
        },
        genNonDuplicateID: function (randomLength) {
            return Number(Math.random().toString().substr(3, randomLength) + new Date().getTime()).toString(36)
        },
        bindEvent: function () {
            var dropdown_container = this.dropdown_container;
            this.$el.click(function (event) {
                event.stopPropagation();
                if (!dropdown_container.is(':visible')) {
                    dropdown_container.slideDown("fast");
                } else {
                    dropdown_container.animate({height: 'toggle', opacity: 'toggle'}, "fast");
                }
            });
            this.container.mouseleave(function () {

                if (dropdown_container.is(':visible')) {

                    dropdown_container.animate({height: 'toggle', opacity: 'toggle'}, "fast");
                }
            });
            /*解决鼠标快速移动不兼容问题*/
            this.dropdown_container.find("a").mouseleave(function (event) {
                event.stopPropagation();
            });
            this.dropdown_container.find("span").mouseleave(function (event) {
                event.stopPropagation();
            });
            this.searchTime = null;
            var _this = this;
            this.searchInput.keyup(function () {

                var keyWord = $(this).val();
                /*上一句已经执行了直接清理掉*/
                if (this.searchTime) {
                    clearTimeout(this.searchTime);
                }
                this.searchTime = setTimeout(function () {
                    console.log(keyWord);
                    var allNodes = _this.$zTreeObj.transformToArray(_this.$zTreeObj.getNodes());
                    _this.$zTreeObj.hideNodes(allNodes);    //当开始搜索时，先将所有节点隐藏
                    var nodeList = _this.$zTreeObj.getNodesByParamFuzzy('name', keyWord, 0);    //通过关键字模糊搜索
                    var arr = new Array();
                    for (var i = 0; i < nodeList.length; i++) {
                        arr = $.merge(arr, nodeList[i].getPath());    //找出所有符合要求的叶子节点的路径
                    }
                    _this.$zTreeObj.showNodes($.unique(arr));    //显示所有要求的节点及其路径节点
                    _this.$zTreeObj.expandAll(true);
                }, 500);

            });
        },
        buildingDOM: function () {
            this.ztreeid = this.genNonDuplicateID(3) + "_zTree";
            this.$el.css({display: 'block'});
            this.container = this.$el.wrap('<div class="mts-container" style="inline-block;position: relative;"/>').parent();
            this.searchInput = $('<input class="searchInput" type="text" style="margin-top: 4px;border-radius:3px;width: ' + this.getelementwidth(this.$el) + '">');
            this.tree_el = $('<ul id="' + this.ztreeid + '" class="ztree" style="padding:0 0;margin-top:0;border: none;border-radius: 5px;  height:' + this.options.height + '; width:' + this.getelementwidth(this.$el) + '; background-color: white"></ul>');
            this.dropdown_container = $('<div   class="menuContent" style="display:none;background-color: white; position: absolute;z-index:110004;border: solid 1px;border-radius: 5px;padding-bottom: 10px" ></div>');
            this.dropdown_container.append(this.searchInput);
            this.dropdown_container.append(this.tree_el);
            this.container.append(this.dropdown_container);
            return this.container;
        },
        getelementwidth: function (element) {
            return element.outerWidth() - 2;
        },
        initDeafaultCheckedStatus: function (nodes) {
            var defaultChecks = this.$el.checks;
            if (defaultChecks != "" && defaultChecks != undefined && defaultChecks != null) {
                var checks_array = defaultChecks.split(',');
                for (var i = 0; i < nodes.length; i++) {
                    for (var t = 0; t < checks_array.length; t++) {
                        if (("" + nodes[i].id) === checks_array[t]) {
                            nodes[i].checked = true
                        }
                    }
                }
                return nodes;
            }
        },
        initTree: function () {
            var _this = this;
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
                    onCheck: _this.onCheck.bind(_this),
                    onAsyncSuccess: _this.onAsyncSuccess.bind(_this),
                    onClick: function (e, treeId, treeNode, clickFlag) {
                        _this.$zTreeObj.checkNode(treeNode, !treeNode.checked, true);
                        _this.onCheck();
                    }
                },
                async: this.options.async
            };
            /*异步完成后设置初始选中的值*/
            setting.async.dataFilter = function (treeId, parentNode, responseData) {
                if (responseData) {
                    _this.initDeafaultCheckedStatus(responseData);
                }
                return responseData;
            };
            this.options.zNodes = _this.initDeafaultCheckedStatus(this.options.zNodes)
            this.$zTreeObj = $.fn.zTree.init(this.tree_el, setting, this.options.zNodes);
            this.onCheck();
            return this;
        },
        onCheck: function (e, treeId, treeNode) {
            this.m2v();
            this.options.callback.onCheck(this);
        },
        m2v: function () {
            var nodes = this.$zTreeObj.getCheckedNodes(true),
                text = "",
                codes = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                text += nodes[i].name + ",";
                codes += nodes[i].id + ",";
            }
            if (text.length > 0) {
                text = text.substring(0, text.length - 1);
            }
            if (codes.length > 0) {
                codes = codes.substring(0, codes.length - 1);
            }
            this.$el.val(text);
            this.$el.attr("codes", codes);
        },
        onAsyncSuccess: function (event, treeId, treeNode, msg) {
            this.m2v();
            this.tree_el.find("a").mouseleave(function (event) {
                event.stopPropagation();
            });
            this.tree_el.find("span").mouseleave(function (event) {
                event.stopPropagation();
            });
        },
        cloneObj: function (obj) {
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            for (var key in obj) {
                var val = obj[key];
                newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
            }
            return newObj;
        }
    }
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
