(function ($) {
    var $target_element;
    var defaults = {
        textLabel: "",
        zNodes: []
    }

    var DrawMultipleTree = function (target_element, options) {
        this.$target_element = $(target_element);

        this.options = $.extend({}, defaults, options, this.$target_element.data());//合并业务数据
        this.init();
    }
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
            if (this.$target_element.nameLabel === undefined || this.$target_element.nameLabel === "") {
                throw ("you must set name label in bind element");
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
            if ("text" === type)
                return v;
            else
                return rv;
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
            tree_container.css({
                left: element_offset.left + "px",
                top: element_offset.top + outerHeight + "px"
            }).slideDown("fast");
        });
        /*同时给body绑定点击事件关闭树结构*/
        $(document).click(function () {
            tree_container.fadeOut("fast");
        });

    }
    var init_tree_container = function () {
        this.ztreeid = this.$target_element.nameLabel + "_zTree";
        this.tree_container = $('<div   class="menuContent" style="display:none; position: absolute;" >' +
            '<ul id="' + this.ztreeid + '" class="ztree" style="margin-top:0; width:' + (this.$target_element.width() - getScrollWidth()) + '; height: 300px;"></ul>' +
            '<input type="hidden" id="' + this.$target_element.nameLabel + 'id"   name="' + this.$target_element.nameLabel + '">' +
            '</div>').insertAfter(this.$target_element);
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
        var inner_val_name = this.$target_element.nameLabel + 'id';
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
            $("#" + inner_val_name).attr("value", rv);
          /*  console.log($("#" + inner_val_name).val())*/
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
                onCheck: ztreeOnCheck
            }
        };
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