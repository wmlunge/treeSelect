(function ($) {
    var $target_element;
    var defaults = {
        textLabel: "",
        zNodes: [],
        async: {
            enable: false,
            url: ""
        }

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
        return Number(Math.random().toString().substr(3, randomLength) +new Date().getTime()).toString(36)
    }

    var cloneObj = function (obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
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
            /*为了增加但页面应用的兼容性增加id属性*/
            if (this.$target_element.idLabel === undefined || this.$target_element.idLabel === "") {
                this.$target_element.idLabel = GenNonDuplicateID(3);
            }

            if (this.$target_element.nameLabel === undefined || this.$target_element.nameLabel === "") {
                this.$target_element.nameLabel = GenNonDuplicateID(3);
            }
            this.$target_element.attr("name", this.options.textLabel === "" ? this.$target_element.nameLabel + "text" : this.options.textLabel);
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

            return v;
        }
    }
    var bind_element_click_event = function () {
        var element_offset = this.$target_element.offset();
        var outerHeight = this.$target_element.outerHeight();
        var tree_container = this.tree_container.click(function (event) {
            event.stopPropagation();
        });

        this.$target_element.click(function (event) {
            event.stopPropagation();
            if(!tree_container.is(':visible')){
            tree_container.slideDown("fast");
            }else{
                tree_container.slideUp("fast");
            }
        });
        /*同时给body绑定点击事件关闭树结构*/
        $(document).click(function () {
            tree_container.slideUp("fast");
        });

    }
    /*绘制容器和样式*/
    var init_tree_container = function () {
        this.ztreeid = this.$target_element.idLabel + "_zTree";
         this.$target_element.css({display:'block'});
        this.all_container = this.$target_element.wrap('<div class="mts-container" style="inline-block"/>').parent();
        this.tree_container = $('<div   class="menuContent" style="display:none; position: absolute;" >' +
            '<ul id="' + this.ztreeid + '" class="ztree" style="margin-top:0; width:' + (this.$target_element.width() - getScrollWidth()) + '; height: 300px;background-color: white"></ul>' +
            '</div>').insertAfter(this.$target_element);
        this.checked_val_element = $('<input type="hidden" name="' +
            this.$target_element.nameLabel + '">').insertAfter(this.tree_container);
        return this;
    }

    function getScrollWidth() {
        var noScroll, scroll, oDiv = document.createElement("DIV");
        oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
        noScroll = document.body.appendChild(oDiv).clientWidth;
        oDiv.style.overflowY = "scroll";
        scroll = oDiv.clientWidth;
        document.body.removeChild(oDiv);
        return noScroll - scroll;
    }

    var init_ztree = function () {
        var inner_$target_element = this.$target_element;
        var inner_$checked_val_element = this.checked_val_element;
        var inner_$checks = this.$target_element.checks;
        ztreeonAsyncSuccess = function (event, treeId, treeNode, msg) {
            zTreeObj.setting.callback.onCheck();
        };
        var initNodeCheckeState = function (checks, nodes) {
            if (checks != "" && checks != undefined && checks != null) {
               var checks_array= checks.split(',');
                for (var i = 0; i < nodes.length; i++) {
                    for(var t = 0; t < checks_array.length; t++){
                        if ((""+nodes[i].id)===checks_array[t]) {
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

        }
        var setting = {
            check: {
                enable: true,
                chkboxType: {"Y": "", "N": ""}
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
                onAsyncSuccess: ztreeonAsyncSuccess
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
     * 单选模式
     * @param options
     * @returns {*}
     */
    $.fn.drawNormalTree = function (options) {

        return this.each(function () {
            if (!$.data(this, 'drawTree')) {
                $.data(this, 'drawTree', new DrawNormalTree(this, options));
            }
        });
    };
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
                /*if ($.inArray(option, allowedMethods) < 0) {
                    throw 'Unknown method: ' + option;
                }*/
                value = data[option](args[1]);

            }

        });
        return typeof value !== 'undefined' ? value : this;
    };
})(jQuery)