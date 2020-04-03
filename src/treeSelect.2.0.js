;(function ($) {
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
        direction: "auto",
        filter: true,
        slideModel: 'click',
        searchShowParent: false,
        beforeSearchPromise: function (defer, treeSelectObj) {
            /*模拟异步加载*/
            setTimeout(function () {
                defer.resolve();
            }, 100);
        }
    };
    var TreeSelect = function (el, options) {
        this.$el = $(el);
        var _this = this;
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (obj) {
                var _self = this
                    , args = arguments;
                return function () {
                    _self.apply(obj, Array.prototype.slice.call(args, 1));
                }
            }
        }
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
                ids = [];
                $(nodes).each(function (index, node) {
                    ids.push(node.id);
                });
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
            if (this.options.slideModel == 'click') {
                this.bindDrawerEventClick();
            } else {
                this.bindDrawerEventSlide();
            }
            if (this.options.filter) {
                this.bindSearch();
            }
        },
        bindSearch: function () {
            this.searchTime = null;
            var _this = this;
            this.clearbtn.click(function () {
                _this.searchInput.val('');
                _this.search_tree_el.hide();
                _this.tree_el.show();
                if (_this.$searchZTreeObj) {
                    _this.$searchZTreeObj.destroy();
                }
                _this.clearbtn.hide();
            });
            this.searchInput.keyup(function (event) {
                var keyWord = $(this).val().trim();
                if (keyWord === "") {
                    _this.clearbtn.hide();
                } else {
                    _this.clearbtn.show();
                }
                if (event.keyCode !== 13) {
                    return false;
                }
                if (_this.options.beforeSearchPromise) {
                    $.Deferred(function (defer) {
                        /*进行ajax请求并且加载完成数据后按照下面方式进行调用即可触发搜索*/
                        _this.options.beforeSearchPromise(defer, _this);
                    }).promise().then(function () {
                        _this.doSearch(keyWord);
                    });
                } else {
                    _this.doSearch(keyWord);
                }
            });
        },
        beforeSearchPromise: function () {
            return
        },
        doSearch: function (keyWord) {
            var _this = this;
            /*异步执行低频率执行解决性能问题*/
            if (_this.searchTime) {
                clearTimeout(_this.searchTime);
            }
            _this.searchTime = setTimeout(function () {
                if (keyWord === "") {
                    _this.search_tree_el.hide();
                    _this.tree_el.show();
                    if (_this.$searchZTreeObj) {
                        _this.$searchZTreeObj.destroy();
                    }
                    return;
                }
                _this.search_tree_el.show();
                _this.tree_el.hide();
                var nodeList = _this.$zTreeObj.getNodesByParamFuzzy('name', keyWord, null);//通过关键字模糊搜索
                var datas = [];
                datas = datas.concat(nodeList);
                if (_this.options.searchShowParent) {
                    $(nodeList).each(function (index, node) {
                        _this.loadParents(node, datas);
                    })
                }
                _this.initSearchTree(datas);
            }, 500);

        },
        loadParents: function (node, datas) {
            var parent = node.getParentNode();
            if (parent) {
                datas.unshift(parent);
                this.loadParents(parent, datas);
            } else {
                return;
            }
        },
        randomID: function (randomLength) {
            return Number(Math.random().toString().substr(3, randomLength) + new Date().getTime()).toString(36)
        },
        ifSlideUp: function () {
            var _this = this;
            if (_this.options.direction == 'auto') {
                var windowH = document.body.clientHeight;
                var elH = _this.$el.height();
                var el2top = _this.$el.offset().top;
                var scrollTop = $(document).scrollTop();
                var drowdownHeight = _this.dropdown_container.height();
                /*下拉框底部距离窗口底部的距离*/
                var topHeight = el2top - scrollTop;
                var hbottom = windowH - topHeight - (drowdownHeight + elH);
                /*容器到顶部的距离减去下拉框高度*/
                var htop = topHeight - drowdownHeight;
                if (hbottom < 10 && hbottom < htop) {
                    return true;
                } else {
                    return false;
                }
            } else if (_this.options.direction != 'up') {
                return false;
            } else {
                return true;
            }

        },
        bindDrawerEventSlide: function () {
            var dropdown_container = this.dropdown_container;
            /*计算抽屉方向*/
            var _this = this;
            this.$el.click(function (event) {
                if (_this.ifSlideUp()) {
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

        },
        bindDrawerEventClick: function () {
            var dropdown_container = this.dropdown_container;
            /*计算抽屉方向*/
            var _this = this;
            var onBodyMusedown = function (event) {
                if (!$(event.target).parents("#" + _this.id).length > 0) {
                    dropdown_container.fadeOut("fast");
                    $("body").unbind("mousedown", onBodyMusedown);
                }
            }
            this.$el.click(function () {
                if (_this.ifSlideUp()) {
                    dropdown_container.addClass("up")
                    dropdown_container.css("bottom", _this.$el.outerHeight());
                    dropdown_container.css("top", '');
                } else {
                    dropdown_container.css("bottom", '');
                    dropdown_container.css("top", _this.$el.outerHeight());
                }
                if (!dropdown_container.is(':visible')) {
                    dropdown_container.slideDown("fast");
                    $("body").bind("mousedown", onBodyMusedown);
                } else {
                    dropdown_container.fadeOut("fast");
                    $("body").unbind("mousedown", onBodyMusedown);
                }

            });
        },
        buildingDOM: function () {
            this.$el.css({display: 'block'});
            this.container = this.$el.wrap('<div class="mts-container"/>').parent();
            this.searchInput = $('<input class="searchInput" placeholder="按enter检索" type="text" style="width: ' + (this.$el.outerWidth() - 20) + 'px;">');
            this.clearbtn = $('<span href="javascript:void(0);" class="clear">×</span>')
            var height = this.options.height + (this.options.height == "auto" ? "" : "px");
            this.tree_el = $('<ul class="ztree" style="height:' + height + '; width:' + (this.$el.outerWidth() - 2) + 'px;"></ul>');
            this.search_tree_el = $('<ul class="ztree" style="height:' + height + '; width:' + (this.$el.outerWidth() - 2) + 'px;"></ul>');

            this.dropdown_container = $('<div  class="dropdown_container"  ></div>');
            if (this.options.filter) {
                this.dropdown_container.append(this.searchInput);
                this.dropdown_container.append(this.clearbtn);
            }
            this.dropdown_container.append(this.tree_el);
            this.dropdown_container.append(this.search_tree_el.hide());
            this.container.append(this.dropdown_container);
            this.id = this.randomID(3);
            this.dropdown_container.attr("id", this.id);
            this.tree_el.attr("id", this.randomID(3));
            this.search_tree_el.attr("id", this.randomID(3));
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
                    dblClickExpand: false,
                    showIcon: false
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
                    showIcon: false,
                    fontCss: function (treeId, treeNode) {
                        return {color: "#FFA200", "font-weight": "bold"};
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    },
                    key: {
                        children: "nodes"
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
                        _this.$searchZTreeObj.setting.callback.onCheck(e, treeId, treeNode);
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
            var checks = "";
            for (var i = 0, l = nodes.length; i < l; i++) {
                text += nodes[i].name + ",";
                checks += nodes[i].id + ",";
            }
            if (text.length > 0) {
                text = text.substring(0, text.length - 1);
            }
            if (checks.length > 0) {
                checks = checks.substring(0, checks.length - 1);
            }
            this.$el.attr("checks", checks);
            this.$el.val(text);
        },
        onAsyncSuccess: function (event, treeId, treeNode, msg) {
            this.m2v();
            this.tree_el.find("a").mouseleave(function () {
                event.stopPropagation();
            });
            this.tree_el.find("span").mouseleave(function () {
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
        },
        destory: function () {
            if (this.container) {
                $.data(this.$el[0], 'treeSelect', undefined);
                this.container.replaceWith(this.$el);
                this.container = null;
                this.$zTreeObj.destroy();
                if (this.$searchZTreeObj) {
                    this.$searchZTreeObj.destroy();
                }

            }
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
})(jQuery);
