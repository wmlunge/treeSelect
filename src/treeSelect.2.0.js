(function ($) {
    var defaults = {
        zNodes: [],
        async: {
            enable: false,
            url: ""
        },
        callback: {
            onCheck: function (treeNode) {
            }
        },
        checks: [],
        chkStyle: "checkbox",
        radioType: "all",
        height: 'auto',
        direction: "auto"
    }
    var TreeSelect = function (target_element, options) {
        this.$el = $(target_element);
        var _this = this;

        var $options = function () {
            return $.extend({}, defaults, options, _this.$el.data());//合并业务数据
        }
        /*避免共用同一个配置时两边干扰*/
        this.options = this.cloneObj(new $options());
        this.init();
    }
    TreeSelect.prototype = {
        constructor: TreeSelect,
        init: function () {
            var elChecks = this.$el.attr("checks");
            if (!this.options.checks) {
                this.options.checks = [];
            }
            if (elChecks != "" && elChecks != undefined && elChecks != null) {
                this.options.checks = $.merge(this.options.checks, elChecks.split(','));
            }
            this.buildingDOM();
            this.initTree();
            this.bindEvent();
        },
        val: function (ids) {
            var nodes = this.$zTreeObj.getCheckedNodes(true);
            if (!ids) {
                var ids = [];
                $(nodes).each(function (index, node) {
                    ids.push(node.id);
                })
                return ids;
            } else {
                /*赋值*/
                var _this = this;
                this.options.checks = ids;
                $(nodes).each(function (index, node) {
                    node.checked = false;
                    _this.$zTreeObj.updateNode(node);
                })
                $(ids).each(function (index, id) {
                    var node = _this.$zTreeObj.getNodeByParam("id", id);
                    node.checked = true;
                    _this.$zTreeObj.updateNode(node);
                });
                _this.m2v();
                return this;
            }

        },
        text: function () {
            var nodes = this.$zTreeObj.getCheckedNodes(true);
            var texts = [];
            $(nodes).each(function (index, node) {
                texts.push(node.name);
            })
            return texts;
        },
        bindEvent: function () {
            this.bindDrawerEvent();
            this.bindSearch();
        },
        bindSearch: function () {
            this.searchTime = null;
            var _this = this;
            this.searchInput.keyup(function (event) {
                if (event.keyCode !== 13) {
                    return false;
                }
                _this.$doload = false;
                var keyWord = $(this).val().trim();
                /*上一句已经执行了直接清理掉*/
                if (this.searchTime) {
                    clearTimeout(this.searchTime);
                }
                this.searchTime = setTimeout(function () {
                    if (keyWord === "") {
                        _this.search_tree_el.hide();
                        _this.tree_el.show();
                        _this.$searchZTreeObj.destroy();
                        return;
                    }
                    ;
                    _this.search_tree_el.show();
                    _this.tree_el.hide();
                    var nodeList = _this.$zTreeObj.getNodesByParamFuzzy('name', keyWord, 0);    //通过关键字模糊搜索
                    _this.$doload = true;
                    _this.lazyShowSearchNode(0, nodeList)

                }, 500);
            });
        },
        lazyShowSearchNode: function (index, nodeList) {
            var _this = this;
            var nodelength = nodeList.length;
            if (!this.$doload) {
                return;
            }
            if (index < nodelength) {
                var _list = nodeList.slice(index, index += 100);
                if (index === 100) {
                    this.initSearchTree(_list);
                    this.lazyShowSearchNode(index, nodeList);
                } else {
                    setTimeout(function () {
                        _this.$searchZTreeObj.addNodes(null, -1, _list);
                        _this.lazyShowSearchNode(index, nodeList);
                    }, 1000);
                }
            }
        },
        randomID: function (randomLength) {
            return Number(Math.random().toString().substr(3, randomLength) + new Date().getTime()).toString(36)
        },
        bindDrawerEvent: function () {
            var dropdown_container = this.dropdown_container;
            /*计算抽屉方向*/
            var _this = this;
            var ifUp = function () {
                if (_this.options.direction == 'auto') {
                    var windowH = $(window).height();
                    var elH = _this.$el.height();
                    var el2top = _this.container.offset().top
                    var scrollTop = $(document).scrollTop()
                    var drowdownHeight = dropdown_container.height();
                    /*下拉框底部距离窗口底部的巨鹿*/
                    var hbottom = windowH - ((el2top - scrollTop) + drowdownHeight + elH);
                    var htop = el2top - scrollTop - drowdownHeight;
                    if (hbottom < htop) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (_this.options.direction == 'up') {
                    return false;
                } else {
                    return true;
                }

            };

            this.$el.click(function (event) {
                if (ifUp()) {
                    dropdown_container.addClass("up")
                    dropdown_container.css("bottom", _this.$el.outerHeight());
                    dropdown_container.css("top", '');
                } else {
                    dropdown_container.css("bottom", '');
                    dropdown_container.css("top", _this.$el.outerHeight());
                }
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
        },
        buildingDOM: function () {
            this.$el.css({display: 'block'});
            this.container = this.$el.wrap('<div class="mts-container"/>').parent();
            this.searchInput = $('<input class="searchInput" placeholder="按enter检索" type="text" style="width: ' + (this.$el.outerWidth() - 20) + 'px;">');
            this.tree_el = $('<ul class="ztree" style="height:' + this.options.height + 'px; width:' + (this.$el.outerWidth() - 2) + 'px;"></ul>');
            this.search_tree_el = $('<ul class="ztree" style="height:' + this.options.height + 'px; width:' + (this.$el.outerWidth() - 2) + 'px;"></ul>');

            this.dropdown_container = $('<div   class="dropdown_container"  ></div>');
            this.dropdown_container.append(this.searchInput);
            this.dropdown_container.append(this.tree_el);
            this.dropdown_container.append(this.search_tree_el.hide());
            this.container.append(this.dropdown_container);
            this.tree_el.attr("id", this.randomID(3))
            this.search_tree_el.attr("id", this.randomID(3))
            return this.container;
        },
        initDeafaultCheckedStatus: function (nodes) {
            var _this = this;
            var needUpdateNodes = []
            if (this.options.checks && this.options.checks.length > 0) {
                $(nodes).each(function (index, node) {
                    var checkFlag = false;
                    $(_this.options.checks).each(function (i, id) {
                        if (id == node.id) {
                            checkFlag = true;
                            if (node.checked != true) {
                                node.checked = true;
                                needUpdateNodes.push(node);
                            }
                            return false;
                        }
                    });
                    if (!checkFlag) {
                        if (node.checked != false) {
                            node.checked = false;
                            needUpdateNodes.push(node)
                        }
                    }
                });
            }
            return needUpdateNodes;

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
            _this.initDeafaultCheckedStatus(this.options.zNodes);
            this.$zTreeObj = $.fn.zTree.init(this.tree_el, setting, this.options.zNodes);
            this.onCheck();
            return this;
        },
        initSearchTree: function (data) {
            var _this = this;
            var setting = {
                check: {
                    enable: true,
                    chkboxType: {"Y": "", "N": ""},
                    chkStyle: this.options.chkStyle,
                    radioType: this.options.radioType
                },
                view: {
                    dblClickExpand: false,
                    fontCss: function (treeId, treeNode) {
                        return {color: "#A60000", "font-weight": "bold"};
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: function (e, treeId, treeNode) {
                        var node = _this.$zTreeObj.getNodeByParam("id", treeNode.id);
                        _this.$zTreeObj.checkNode(node, treeNode.checked, true);
                        _this.onCheck();
                    },
                    onClick: function (e, treeId, treeNode, clickFlag) {
                        _this.$searchZTreeObj.checkNode(treeNode, !treeNode.checked, true);
                        _this.onCheck();
                    }
                }
            };
            this.$searchZTreeObj = $.fn.zTree.init(this.search_tree_el, setting, data);
        },
        onCheck: function (e, treeId, treeNode) {
            this.m2v();
            this.options.callback.onCheck(this);
        },
        m2v: function () {
            var nodes = this.$zTreeObj.getCheckedNodes(true);
            var text = "";
            var codes = "";
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
    $.fn.treeSelect = function (options) {
        var resultArr = [];
        this.each(function () {
            var $this = $(this);
            var treeSelectObj = $this.data('treeSelect');
            if (!treeSelectObj) {
                treeSelectObj = new TreeSelect(this, options);
                $.data(this, 'treeSelect', treeSelectObj);
            }
            resultArr.push(treeSelectObj);
        });
        return resultArr.length == 1 ? resultArr[0] : resultArr;
    };
})(jQuery)
