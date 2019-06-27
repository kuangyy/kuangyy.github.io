function GooFlow(bgDiv, property) {
//��ʼ������ͼ�Ķ���
    this.$id = bgDiv.attr("id");
    this.$bgDiv = bgDiv;//���ܵ�DIV
    this.$bgDiv.addClass("GooFlow");
    var width = (property.width || 800) - 2;
    var height = (property.height || 500) - 2;
    this.$bgDiv.css({width: width + "px", height: height + "px"});
    this.$tool = null;//��๤��������
    this.$head = null;//������ǩ����������ť
    this.$title = "newFlow_1";//����ͼ������
    this.$defaultTitleId = '2';
    this.$nodeRemark = {};//ÿһ�ֽ���ť��˵������,JSON��ʽ,keyΪ����,valueΪ�û��Զ�������˵��
    this.$nowType = "cursor";//��ǰҪ���ƵĶ�������
    this.$lineData = {};
    this.$lineCount = 0;
    this.$nodeData = {};
    this.$nodeCount = 0;
    this.$areaData = {};
    this.$areaCount = 0;
    this.$lineDom = {};
    this.$nodeDom = {};
    this.$areaDom = {};
    this.$max = property.initNum || 1;//����Ĭ��IDֵ����ʼSEQUENCE
    this.$focus = "";//��ǰ��ѡ���Ľ��/ת����ID,���ûѡ�л��߹����������,��Ϊ""
    this.$cursor = "default";//���ָ���ڹ������ڵ���ʽ
    this.$editable = false;//�������Ƿ�ɱ༭
    this.$deletedItem = {};//������ͼ�ı༭�����б�ɾ������Ԫ��ID����,Ԫ��IDΪKEY,Ԫ������(node,line.area)ΪVALUE
    var headHeight = 0;
    var tmp = "";
    if (property.haveHead) {
        tmp = "<div class="GooFlow_head"><label title="" + (property.initLabelText || "newFlow_1") + "">" + (property.initLabelText || "newFlow_1") + "</label>";
        for (var x = 0; x < property.headBtns.length; ++x) {
            tmp += "<a href="javascript:void(0)" class="GooFlow_head_btn" target="_blank" rel="noopener"><b class="ico_" + property.headBtns[x] + ""></b></a>"
        }
        tmp += "</div>";
        this.$head = $(tmp);
        this.$bgDiv.append(this.$head);
        headHeight = 24;
        //�����ǵ���������ť�����ʱ�������¼��Զ���(�麯��),��ʽΪfunction(),��Ϊ��ֱ����THIS����������,���ô��Σ��û��������ض���:
        this.onBtnNewClick = function () { //�½�
            var that = this;
            var title = prompt(ch('�����µ����ƣ�'), 'newFlow_' + this.$defaultTitleId++);
            if (title != null) {
                this.clearData();
                this.setTitle(title);
            }
        }
        this.onBtnOpenClick = function () {
            var that = this;
            //�򿪰�ť�Զ���
        }
        this.onBtnSaveClick = function () {
            var that = this;
            //��������ͼ��ť����
        }
        this.onFreshClick = function () {
            var that = this;
            //��������ͼ��ť����
        }
        if (property.headBtns)
            this.$head.on("click", {inthis: this}, function (e) {
                if (!e)e = window.event;
                var tar = e.target;
                if (tar.tagName == "DIV" || tar.tagName == "SPAN")    return;
                else if (tar.tagName == "a")    tar = tar.childNode[0];
                var This = e.data.inthis;
                //���嶥����������ť���¼�
                switch ($(tar).attr("class")) {
                    case "ico_new":
                        if (This.onBtnNewClick != null)    This.onBtnNewClick();
                        break;
                    case "ico_open":
                        if (This.onBtnOpenClick != null)    This.onBtnOpenClick();
                        break;
                    case "ico_save":
                        if (This.onBtnSaveClick != null)    This.onBtnSaveClick();
                        break;
                    case "ico_undo":
                        This.undo();
                        break;
                    case "ico_redo":
                        This.redo();
                        break;
                    case "ico_reload"    :
                        if (This.onFreshClick != null)    This.onFreshClick();
                        break;
                }
            });
    }
    var toolWidth = 0;
    if (property.haveTool) {
        this.$bgDiv.append("<div class="GooFlow_tool" " + (property.havehead ? "" : style="margin-top:3px" ")><div style="height:" + (height - headHeight - (property.haveHead ? 7 : 10)) + "px" class="GooFlow_tool_div"></div></div>");
        this.$tool = this.$bgDiv.find(".GooFlow_tool div");
        //δ�Ӵ��룺�����ͼ���߰�ť
        this.$tool.append("<a href="javascript:void(0)" type="cursor" class="GooFlow_tool_btndown" id="" + this.$id + "_btn_cursor" target="_blank" rel="noopener"><b class="ico_cursor"></b></a><a href="javascript:void(0)" type="direct" class="GooFlow_tool_btn" id="" + this.$id + "_btn_direct" target="_blank" rel="noopener"><b class="ico_direct"></b></a>");
        if (property.toolBtns && property.toolBtns.length > 0) {
            tmp = "<span>";
            for (var i = 0; i < property.toolBtns.length; ++i) {
                tmp += "<a href="javascript:void(0)" type="" + property.toolBtns[i] + "" id="" + this.$id + "_btn_" + property.toolBtns[i].split(" ")[0] + "" class="GooFlow_tool_btn" target="_blank" rel="noopener"><b class="ico_" + property.toolBtns[i] + ""></b></a>";//�����Զ��尴ť
            }
            this.$tool.append(tmp);
        }
        //�������򻮷ֿ򹤾߿��ذ�ť
        if (property.haveGroup)
            this.$tool.append("<span><a href="javascript:void(0)" type="group" class="GooFlow_tool_btn" id="" + this.$id + "_btn_group" target="_blank" rel="noopener"><b class="ico_group"></b></a>");
        toolWidth = 31;
        this.$nowType = "cursor";
        //�󶨸�����ť�ĵ���¼�
        this.$tool.on("click", {inthis: this}, function (e) {
            if (!e)e = window.event;
            var tar;
            switch (e.target.tagName) {
                case "SPAN":
                    return false;
                case "DIV":
                    return false;
                case "B":
                    tar = e.target.parentNode;
                    break;
                case "A":
                    tar = e.target;
            }
            ;
            var type = $(tar).attr("type");
            e.data.inthis.switchToolBtn(type);
            return false;
        });
        this.$editable = true;//ֻ�о��й�����ʱ�ɱ༭
    }
    width = width - toolWidth - 8;
    height = height - headHeight - (property.haveHead ? 5 : 8);
    this.$bgDiv.append("<div class="GooFlow_work" style="width:" + (width) + "px;height:" + (height) + "px;" + (property.haveHead ? "" : "margin-top:3px") + ""></div>");
    this.$workArea = $("<div class="GooFlow_work_inner" style="width:" + width * 3 + "px;height:" + height * 3 + "px"></div>")
        .attr({"unselectable": "on", "onselectstart": 'return false', "onselect": 'document.selection.empty()'});
    this.$bgDiv.children(".GooFlow_work").append(this.$workArea);
    this.$draw = null;//��ʸ������������
    this.initDraw("draw_" + this.$id, width, height);
    this.$group = null;
    if (property.haveGroup)
        this.initGroup(width, height);
    if (this.$editable) {
        this.$workArea.on("click", {inthis: this}, function (e) {
            if (!e)e = window.event;
            if (!e.data.inthis.$editable)return;
            var type = e.data.inthis.$nowType;
            if (type == "cursor") {
                var t = $(e.target);
                var n = t.prop("tagName");
                if (n == "svg" || (n == "DIV" && t.prop("class").indexOf("GooFlow_work") > -1) || n == "LABEL")e.data.inthis.blurItem();
                return;
            }
            else if (type == "direct" || type == "group") return;
            var X, Y;
            var ev = mousePosition(e), t = getElCoordinate(this);
            X = ev.x - t.left + this.parentNode.scrollLeft - 1;
            Y = ev.y - t.top + this.parentNode.scrollTop - 1;
            e.data.inthis.addNode(e.data.inthis.$id + "_node_" + e.data.inthis.$max, {
                name: "node_" + e.data.inthis.$max,
                left: X,
                top: Y,
                type: e.data.inthis.$nowType
            });
            e.data.inthis.$max++;
        });
        //����ʱ�õİ�
        this.$workArea.mousemove({inthis: this}, function (e) {
            if (e.data.inthis.$nowType != "direct")    return;
            var lineStart = $(this).data("lineStart");
            if (!lineStart)return;
            var ev = mousePosition(e), t = getElCoordinate(this);
            var X, Y;
            X = ev.x - t.left + this.parentNode.scrollLeft;
            Y = ev.y - t.top + this.parentNode.scrollTop;
            var line = document.getElementById("GooFlow_tmp_line");

            line.childNodes[0].setAttribute("d", "M " + lineStart.x + " " + lineStart.y + " L " + X + " " + Y);
            line.childNodes[1].setAttribute("d", "M " + lineStart.x + " " + lineStart.y + " L " + X + " " + Y);
            if (line.childNodes[1].getAttribute("marker-end") == "url(\"#arrow2\")")
                line.childNodes[1].setAttribute("marker-end", "url(#arrow3)");
            else    line.childNodes[1].setAttribute("marker-end", "url(#arrow2)");

        });
        this.$workArea.mouseup({inthis: this}, function (e) {
            if (e.data.inthis.$nowType != "direct")    return;
            $(this).css("cursor", "auto").removeData("lineStart");
            var tmp = document.getElementById("GooFlow_tmp_line");
            if (tmp)e.data.inthis.$draw.removeChild(tmp);
        });
        //Ϊ�˽������ӵ�һЩ����delegate��
        this.initWorkForNode();
        //�Խ������ƶ�����RESIZEʱ������ʾ�����ֲ�
        this.$ghost = $("<div class="rs_ghost GooFlow_item item_round"></div>").attr({
            "unselectable": "on",
            "onselectstart": 'return false',
            "onselect": 'document.selection.empty()'
        });
        this.$bgDiv.append(this.$ghost);
        this.$textArea = $("<textarea></textarea>");
        this.$bgDiv.append(this.$textArea);
        this.$lineMove = $("<div class="GooFlow_line_move" style="display:none"></div>");//��������ʱ���ƶ���
        this.$workArea.append(this.$lineMove);
        this.$lineMove.on("mousedown", {inthis: this}, function (e) {
            if (e.button == 2)return false;
            var lm = $(this);
            lm.css({"background-color": "#333"});
            var This = e.data.inthis;
            var ev = mousePosition(e), t = getElCoordinate(This.$workArea[0]);
            var X, Y;
            X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft;
            Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop;
            var p = This.$lineMove.position();
            var vX = X - p.left, vY = Y - p.top;
            var isMove = false;
            document.onmousemove = function (e) {
                if (!e)e = window.event;
                var ev = mousePosition(e);
                var ps = This.$lineMove.position();
                X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft;
                Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop;
                if (This.$lineMove.data("type") == "lr") {
                    X = X - vX;
                    if (X < 0)    X = 0;
                    else if (X > This.$workArea.width())
                        X = This.$workArea.width();
                    This.$lineMove.css({left: X + "px"});
                }
                else if (This.$lineMove.data("type") == "tb") {
                    Y = Y - vY;
                    if (Y < 0)    Y = 0;
                    else if (Y > This.$workArea.height())
                        Y = This.$workArea.height();
                    This.$lineMove.css({top: Y + "px"});
                }
                isMove = true;
            }
            document.onmouseup = function (e) {
                if (isMove) {
                    var p = This.$lineMove.position();
                    if (This.$lineMove.data("type") == "lr")
                        This.setLineM(This.$lineMove.data("tid"), p.left + 3);
                    else if (This.$lineMove.data("type") == "tb")
                        This.setLineM(This.$lineMove.data("tid"), p.top + 3);
                }
                This.$lineMove.css({"background-color": "transparent"});
                if (This.$focus == This.$lineMove.data("tid")) {
                    This.focusItem(This.$lineMove.data("tid"));
                }
                document.onmousemove = null;
                document.onmouseup = null;
            }
        });
        this.$lineOper = $("<div class="GooFlow_line_oper" style="display:none"><b class="b_l1"></b><b class="b_l2"></b><b class="b_l3"></b><b class="b_x"></b></div>");//ѡ����ʱ��ʾ�Ĳ�����
        this.$workArea.append(this.$lineOper);
        this.$lineOper.on("click", {inthis: this}, function (e) {
            if (!e)e = window.event;
            if (e.target.tagName != "B")    return;
            var This = e.data.inthis;
            var id = $(this).data("tid");
            switch ($(e.target).attr("class")) {
                case "b_x":
                    This.delLine(id);
                    this.style.display = "none";
                    break;
                case "b_l1":
                    This.setLineType(id, "lr");
                    break;
                case "b_l2":
                    This.setLineType(id, "tb");
                    break;
                case "b_l3":
                    This.setLineType(id, "sl");
                    break;
            }
        });

        //����󶨵����/��/������һЩ�����¼�,��Щ�¼���ֱ��ͨ��this���ʶ�����
        //������ĳ����Ԫ�����/��/����飩������ʱ�������ķ���������FALSE����ֹ�����¼��ķ���
        //��ʽfunction(id��type,json)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ������,��"node","line","area"����ȡֵ,json��addNode,addLine��addArea�����ĵڶ�������json.
        this.onItemAdd = null;
        //������ĳ����Ԫ�����/��/����飩��ɾ��ʱ�������ķ���������FALSE����ֹɾ���¼��ķ���
        //��ʽfunction(id��type)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ������,��"node","line","area"����ȡֵ
        this.onItemDel = null;
        //������ĳ����Ԫ�����/����飩���ƶ�ʱ�������ķ���������FALSE����ֹ�ƶ��¼��ķ���
        //��ʽfunction(id��type,left,top)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ������,��"node","area"����ȡֵ����line��֧���ƶ�,left���µ���߾����꣬top���µĶ��߾�����
        this.onItemMove = null;
        //������ĳ����Ԫ�����/��/����飩��������ʱ�������ķ���������FALSE����ֹ�������¼��ķ���
        //��ʽfunction(id,name,type)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ������,��"node","line","area"����ȡֵ,name���µ�����
        this.onItemRename = null;
        //������ĳ����Ԫ�����/�ߣ����ɲ�ѡ�б��ѡ��ʱ�������ķ���������FALSE����ֹѡ���¼��ķ���
        //��ʽfunction(id,type)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ������,��"node","line"����ȡֵ,"area"��֧�ֱ�ѡ��
        this.onItemFocus = null;
        //������ĳ����Ԫ�����/�ߣ�����ѡ�б�ɲ�ѡ��ʱ�������ķ���������FALSE����ֹȡ��ѡ���¼��ķ���
        //��ʽfunction(id��type)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ������,��"node","line"����ȡֵ,"area"��֧�ֱ�ȡ��ѡ��
        this.onItemBlur = null;
        //������ĳ����Ԫ�����/����飩���ض����С������ʱ�������ķ���������FALSE����ֹ�ض���С/�����¼��ķ���
        //��ʽfunction(id��type,width,height)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ������,��"node","line","area"����ȡֵ;width���µĿ���,height���µĸ߶�
        this.onItemResize = null;
        //���ƶ�ĳ�������жε�λ�ã������ķ���������FALSE����ֹ�ض���С/�����¼��ķ���
        //��ʽfunction(id��M)��id�ǵ�Ԫ��Ψһ��ʶID,M���жε���X(��Y)������
        this.onLineMove = null;
        //���任ĳ�������ߵ����ͣ������ķ���������FALSE����ֹ�ض���С/�����¼��ķ���
        //��ʽfunction(id��type)��id�ǵ�Ԫ��Ψһ��ʶID,type�������ߵ�������,"sl":ֱ��,"lr":�жο������ƶ�������,"tb":�жο������ƶ�������
        this.onLineSetType = null;
        //������ɫ��עĳ�����/ת����ʱ�����ķ���������FALSE����ֹ�ض���С/�����¼��ķ���
        //��ʽfunction(id��type��mark)��id�ǵ�Ԫ��Ψһ��ʶID,type�ǵ�Ԫ���ͣ�"node"���,"line"ת���ߣ���markΪ����ֵ,��ʾ��Ҫ��עTRUE����ȡ����עFALSE
        this.onItemMark = null;

        if (property.useOperStack && this.$editable) {//���Ҫʹ�ö�ջ��¼�������ṩ������/�������Ĺ���,ֻ�ڱ༭״̬����Ч
            this.$undoStack = [];
            this.$redoStack = [];
            this.$isUndo = 0;
            ///////////////�����ǹ��쳷������/���������ķ���
            //Ϊ�˽�ʡ������ڴ�ռ�,undo/redo�еĲ�������ջ,���ֻ�ɷ�40������;����40��ʱ,���Զ�ɾ����ɵ�һ������
            this.pushOper = function (funcName, paras) {
                var len = this.$undoStack.length;
                if (this.$isUndo == 1) {
                    this.$redoStack.push([funcName, paras]);
                    this.$isUndo = false;
                    if (this.$redoStack.length > 40)    this.$redoStack.shift();
                } else {
                    this.$undoStack.push([funcName, paras]);
                    if (this.$undoStack.length > 40)    this.$undoStack.shift();
                    if (this.$isUndo == 0) {
                        this.$redoStack.splice(0, this.$redoStack.length);
                    }
                    this.$isUndo = 0;
                }
            };
            //���ⲿ�ķ������뵽GooFlow��������������ջ��,�ڹ����undo/redo�����п��Խ��п��ƣ�һ�����ڶ�����ͼ����ĸ�����Ϣ���б༭��������/�������ƣ�
            //����funcΪҪִ�з�������,jsonParaΪ�ⲿ�������е�һ�����������JSON����,��JSON�����������Ҫ������Ϣ��
            //��ʾ:Ϊ�����ⲿ�����ܹ���UNDO/REDO,��Ҫ�ڱ�д��Щ�ⲿ����ʵ��ʱ,����Ը÷���ִ�к�Ч�����˵���һ��ִ�з�����pushExternalOper
            this.pushExternalOper = function (func, jsonPara) {
                this.pushOper("externalFunc", [func, jsonPara]);
            };
            //������һ������
            this.undo = function () {
                if (this.$undoStack.length == 0)    return;
                var tmp = this.$undoStack.pop();
                this.$isUndo = 1;
                if (tmp[0] == "externalFunc") {
                    tmp[1][0](tmp[1][1]);
                }
                else {
                    //���ε�����,���֧��6��.
                    switch (tmp[1].length) {
                        case 0:
                            this[tmp[0]]();
                            break;
                        case 1:
                            this[tmp[0]](tmp[1][0]);
                            break;
                        case 2:
                            this[tmp[0]](tmp[1][0], tmp[1][1]);
                            break;
                        case 3:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2]);
                            break;
                        case 4:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2], tmp[1][3]);
                            break;
                        case 5:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2], tmp[1][3], tmp[1][4]);
                            break;
                        case 6:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2], tmp[1][3], tmp[1][4], tmp[1][5]);
                            break;
                    }
                }
            };
            //�������һ�α������Ĳ���
            this.redo = function () {
                if (this.$redoStack.length == 0)    return;
                var tmp = this.$redoStack.pop();
                this.$isUndo = 2;
                if (tmp[0] == "externalFunc") {
                    tmp[1][0](tmp[1][1]);
                }
                else {
                    //���ε�����,���֧��6��.
                    switch (tmp[1].length) {
                        case 0:
                            this[tmp[0]]();
                            break;
                        case 1:
                            this[tmp[0]](tmp[1][0]);
                            break;
                        case 2:
                            this[tmp[0]](tmp[1][0], tmp[1][1]);
                            break;
                        case 3:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2]);
                            break;
                        case 4:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2], tmp[1][3]);
                            break;
                        case 5:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2], tmp[1][3], tmp[1][4]);
                            break;
                        case 6:
                            this[tmp[0]](tmp[1][0], tmp[1][1], tmp[1][2], tmp[1][3], tmp[1][4], tmp[1][5]);
                            break;
                    }
                }
            };
        }
        $(document).keydown({inthis: this}, function (e) {
            //�󶨼��̲���
            var This = e.data.inthis;
            if (This.$focus == "")return;
            switch (e.keyCode) {
                case 46://ɾ��
                    This.delNode(This.$focus, true);
                    This.delLine(This.$focus);
                    break;
            }
        });
    }
}
GooFlow.prototype = {
    getSvgMarker: function (id, color) {
        var m = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        m.setAttribute("id", id);
        m.setAttribute("viewBox", "0 0 6 6");
        m.setAttribute("refX", 5);
        m.setAttribute("refY", 3);
        m.setAttribute("markerUnits", "strokeWidth");
        m.setAttribute("markerWidth", 6);
        m.setAttribute("markerHeight", 6);
        m.setAttribute("orient", "auto");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 0 0 L 6 3 L 0 6 z");
        path.setAttribute("fill", color);
        path.setAttribute("stroke-width", 0);
        m.appendChild(path);
        return m;
    },
    initDraw: function (id, width, height) {
        var elem;

        this.$draw = document.createElementNS("http://www.w3.org/2000/svg", "svg");//�ɴ�������ָ�������ռ��Ԫ�ؽڵ�
        this.$workArea.prepend(this.$draw);
        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this.$draw.appendChild(defs);
        defs.appendChild(GooFlow.prototype.getSvgMarker("arrow1", "#15428B"));
        defs.appendChild(GooFlow.prototype.getSvgMarker("arrow2", "#ff3300"));
        defs.appendChild(GooFlow.prototype.getSvgMarker("arrow3", "#ff3300"));


        this.$draw.id = id;
        this.$draw.style.width = width * 3 + "px";
        this.$draw.style.height = +height * 3 + "px";
        //�����ߵĵ��ѡ���Լ�˫���༭�¼�
        var tmpClk = null;
        tmpClk = "g";
        if (this.$editable) {
            $(this.$draw).delegate(tmpClk, "click", {inthis: this}, function (e) {
                e.data.inthis.focusItem(this.id, true);
            });
            $(this.$draw).delegate(tmpClk, "dblclick", {inthis: this}, function (e) {
                var oldTxt, x, y, from, to;
                var This = e.data.inthis;

                oldTxt = this.childNodes[2].textContent;
                from = this.getAttribute("from").split(",");
                to = this.getAttribute("to").split(",");

                if (This.$lineData[this.id].type == "lr") {
                    from[0] = This.$lineData[this.id].M;
                    to[0] = from[0];
                }
                else if (This.$lineData[this.id].type == "tb") {
                    from[1] = This.$lineData[this.id].M;
                    to[1] = from[1];
                }
                x = (parseInt(from[0], 10) + parseInt(to[0], 10)) / 2 - 60;
                y = (parseInt(from[1], 10) + parseInt(to[1], 10)) / 2 - 12;
                var t = getElCoordinate(This.$workArea[0]);
                This.$textArea.val(oldTxt).css({
                    display: "block", width: 120, height: 14,
                    left: t.left + x - This.$workArea[0].parentNode.scrollLeft,
                    top: t.top + y - This.$workArea[0].parentNode.scrollTop
                }).data("id", This.$focus).focus();
                This.$workArea.parent().one("mousedown", function (e) {
                    if (e.button == 2)return false;
                    This.setName(This.$textArea.data("id"), This.$textArea.val(), "line");
                    This.$textArea.val("").removeData("id").hide();
                });
            });
        }
    },
    initGroup: function (width, height) {
        this.$group = $("<div class="GooFlow_work_group" style="width:" + width * 3 + "px;height:" + height * 3 + "px"></div>");//��ű������������
        this.$workArea.prepend(this.$group);
        if (!this.$editable)    return;
        //���򻮷ֿ���������¼���
        this.$group.on("mousedown", {inthis: this}, function (e) {//��RESIZE�����Լ��ƶ�����
            if (e.button == 2)return false;
            var This = e.data.inthis;
            if (This.$nowType != "group")    return;
            if (This.$textArea.css("display") == "block") {
                This.setName(This.$textArea.data("id"), This.$textArea.val(), "area");
                This.$textArea.val("").removeData("id").hide();
                return false;
            }
            ;
            if (!e)e = window.event;
            var cursor = $(e.target).css("cursor");
            var id = e.target.parentNode;
            switch (cursor) {
                case "nw-resize":
                    id = id.parentNode;
                    break;
                case "w-resize":
                    id = id.parentNode;
                    break;
                case "n-resize":
                    id = id.parentNode;
                    break;
                case "move":
                    break;
                default:
                    return;
            }
            id = id.id;
            var hack = 1;
            var ev = mousePosition(e), t = getElCoordinate(This.$workArea[0]);
            var X, Y;
            X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft;
            Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop;
            if (cursor != "move") {
                This.$ghost.css({
                    display: "block",
                    width: This.$areaData[id].width - 2 + "px",
                    height: This.$areaData[id].height - 2 + "px",
                    top: This.$areaData[id].top + t.top - This.$workArea[0].parentNode.scrollTop + hack + "px",
                    left: This.$areaData[id].left + t.left - This.$workArea[0].parentNode.scrollLeft + hack + "px",
                    cursor: cursor
                });
                var vX = (This.$areaData[id].left + This.$areaData[id].width) - X;
                var vY = (This.$areaData[id].top + This.$areaData[id].height) - Y;
            }
            else {
                var vX = X - This.$areaData[id].left;

                var vY = Y - This.$areaData[id].top;
            }
            var isMove = false;
            This.$ghost.css("cursor", cursor);
            document.onmousemove = function (e) {
                if (!e)e = window.event;
                var ev = mousePosition(e);
                if (cursor != "move") {
                    X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft - This.$areaData[id].left + vX;
                    Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop - This.$areaData[id].top + vY;
                    if (X < 200)    X = 200;
                    if (Y < 100)    Y = 100;
                    switch (cursor) {
                        case "nw-resize":
                            This.$ghost.css({width: X - 2 + "px", height: Y - 2 + "px"});
                            break;
                        case "w-resize":
                            This.$ghost.css({width: X - 2 + "px"});
                            break;
                        case "n-resize":
                            This.$ghost.css({height: Y - 2 + "px"});
                            break;
                    }
                }
                else {
                    if (This.$ghost.css("display") == "none") {
                        This.$ghost.css({
                            display: "block",
                            width: This.$areaData[id].width - 2 + "px",
                            height: This.$areaData[id].height - 2 + "px",
                            top: This.$areaData[id].top + t.top - This.$workArea[0].parentNode.scrollTop + hack + "px",
                            left: This.$areaData[id].left + t.left - This.$workArea[0].parentNode.scrollLeft + hack + "px",
                            cursor: cursor
                        });
                    }
                    X = ev.x - vX;
                    Y = ev.y - vY;
                    if (X < t.left - This.$workArea[0].parentNode.scrollLeft)
                        X = t.left - This.$workArea[0].parentNode.scrollLeft;
                    else if (X + This.$workArea[0].parentNode.scrollLeft + This.$areaData[id].width > t.left + This.$workArea.width())
                        X = t.left + This.$workArea.width() - This.$workArea[0].parentNode.scrollLeft - This.$areaData[id].width;
                    if (Y < t.top - This.$workArea[0].parentNode.scrollTop)
                        Y = t.top - This.$workArea[0].parentNode.scrollTop;
                    else if (Y + This.$workArea[0].parentNode.scrollTop + This.$areaData[id].height > t.top + This.$workArea.height())
                        Y = t.top + This.$workArea.height() - This.$workArea[0].parentNode.scrollTop - This.$areaData[id].height;
                    This.$ghost.css({left: X + hack + "px", top: Y + hack + "px"});
                }
                isMove = true;
            }
            document.onmouseup = function (e) {
                This.$ghost.empty().hide();
                document.onmousemove = null;
                document.onmouseup = null;
                if (!isMove)return;
                if (cursor != "move")
                    This.resizeArea(id, This.$ghost.outerWidth(), This.$ghost.outerHeight());
                else
                    This.moveArea(id, X + This.$workArea[0].parentNode.scrollLeft - t.left, Y + This.$workArea[0].parentNode.scrollTop - t.top);
                return false;
            }
        });
        //���޸�����˵������
        this.$group.on("dblclick", {inthis: this}, function (e) {
            var This = e.data.inthis;
            if (This.$nowType != "group")    return;
            if (!e)e = window.event;
            if (e.target.tagName != "LABEL")    return false;
            var oldTxt = e.target.innerHTML;
            var p = e.target.parentNode;
            var x = parseInt(p.style.left, 10) + 18, y = parseInt(p.style.top, 10) + 1;
            var t = getElCoordinate(This.$workArea[0]);
            This.$textArea.val(oldTxt).css({
                display: "block", width: 100, height: 14,
                left: t.left + x - This.$workArea[0].parentNode.scrollLeft,
                top: t.top + y - This.$workArea[0].parentNode.scrollTop
            }).data("id", p.id).focus();
            This.$workArea.parent().one("mousedown", function (e) {
                if (e.button == 2)return false;
                if (This.$textArea.css("display") == "block") {
                    This.setName(This.$textArea.data("id"), This.$textArea.val(), "area");
                    This.$textArea.val("").removeData("id").hide();
                }
            });
            return false;
        });
        //�󶨵���¼�
        this.$group.mouseup({inthis: this}, function (e) {

            var This = e.data.inthis;
            if (This.$nowType != "group")    return;
            if (!e)e = window.event;
            switch ($(e.target).attr("class")) {
                case "rs_close":
                    This.delArea(e.target.parentNode.parentNode.id);
                    return false;//ɾ���÷�������
                case "bg":
                    return;
            }
            switch (e.target.tagName) {
                case "LABEL":
                    return false;
                case "B"://�󶨱�ɫ����
                    var id = e.target.parentNode.id;
                    switch (This.$areaData[id].color) {
                        case "red":
                            This.setAreaColor(id, "yellow");
                            break;
                        case "yellow":
                            This.setAreaColor(id, "blue");
                            break;
                        case "blue":
                            This.setAreaColor(id, "green");
                            break;
                        case "green":
                            This.setAreaColor(id, "red");
                            break;
                    }
                    return false;
            }
            if (e.data.inthis.$ghost.css("display") == "none") {
                var X, Y;
                var ev = mousePosition(e), t = getElCoordinate(this);
                X = ev.x - t.left + this.parentNode.parentNode.scrollLeft - 1;
                Y = ev.y - t.top + this.parentNode.parentNode.scrollTop - 1;
                var color = ["red", "yellow", "blue", "green"];
                e.data.inthis.addArea(e.data.inthis.$id + "_area_" + e.data.inthis.$max, {
                    name: "area_" + e.data.inthis.$max,
                    left: X,
                    top: Y,
                    color: color[e.data.inthis.$max % 4],
                    width: 200,
                    height: 100
                });
                e.data.inthis.$max++;
                return false;
            }
        });
    },
    //ÿһ�����ͽ�㼰�䰴ť��˵������
    setNodeRemarks: function (remark) {
        this.$tool.children("a").each(function () {
            this.title = remark[$(this).attr("id").split("btn_")[1]];
        });
        this.$nodeRemark = remark;
    },

    //�л���߹�������ť,����TYPE��ʾ�л����������͵İ�ť
    switchToolBtn: function (type) {
        this.$tool.children("#" + this.$id + "_btn_" + this.$nowType.split(" ")[0]).attr("class", "GooFlow_tool_btn");
        if (this.$nowType == "group") {
            this.$workArea.prepend(this.$group);
            for (var key in this.$areaDom)    this.$areaDom[key].addClass("lock").children("div:eq(1)").css("display", "none");
        }
        this.$nowType = type;
        this.$tool.children("#" + this.$id + "_btn_" + type.split(" ")[0]).attr("class", "GooFlow_tool_btndown");
        if (this.$nowType == "group") {
            this.blurItem();
            this.$workArea.append(this.$group);
            for (var key in this.$areaDom)    this.$areaDom[key].removeClass("lock").children("div:eq(1)").css("display", "");
        }
        if (this.$textArea.css("display") == "none")    this.$textArea.removeData("id").val("").hide();
    },
    //����һ�����̽��,����Ϊһ��JSON,��id,name,top,left,width,height,type(�������)������
    addNode: function (id, json) {
        if (this.onItemAdd != null && !this.onItemAdd(id, "node", json))return;
        if (this.$undoStack && this.$editable) {
            this.pushOper("delNode", [id]);
        }
        var mark = json.mark ? " item_mark" : "";
        if (json.type.indexOf(" round") < 0) {
            if (!json.width || json.width < 26)json.width = 26;
            if (!json.height || json.height < 24)json.height = 24;
            if (!json.top || json.top < 0)json.top = 0;
            if (!json.left || json.left < 0)json.left = 0;
            var hack = 0;
            this.$nodeDom[id] = $("<div class="GooFlow_item item_round" + mark + "" id="" + id + "" style="top:" + json.top + "px;left:" + json.left + "px"><table cellspacing="1" style="width:" + (json.width - 2) + "px;height:" + (json.height - 2) + "px;"><tr><td class="ico"><b class="ico_" + json.type + ""></b></td><td class="span">" + json.name + "</td></tr></table><div style="display:none"><div class="rs_bottom"></div><div class="rs_right"></div><div class="rs_rb"></div><div class="rs_close"></div></div></div>");
            if (json.type.indexOf(" mix") > -1)    this.$nodeDom[id].addClass("item_mix");
        }
        else {
            json.width = 24;
            json.height = 24;
            this.$nodeDom[id] = $("<div class="GooFlow_item item_round" + mark + "" id="" + id + "" style="top:" + json.top + "px;left:" + json.left + "px"><table cellspacing="0"><tr><td class="ico"><b class="ico_" + json.type + ""></b></td></tr></table><div style="display:none"><div class="rs_close"></div></div><div class="span">" + json.name + "</div></div>");
        }

        this.$workArea.append(this.$nodeDom[id]);
        this.$nodeData[id] = json;
        ++this.$nodeCount;
        if (this.$editable) {
            this.$nodeData[id].alt = true;
            if (this.$deletedItem[id])    delete this.$deletedItem[id];//�ڻ���ɾ������ʱ,ȥ����Ԫ�ص�ɾ����¼
        }
    },
    initWorkForNode: function () {
        //�󶨵���¼�
        this.$workArea.delegate(".GooFlow_item", "click", {inthis: this}, function (e) {
            e.data.inthis.focusItem(this.id, true);
            $(this).removeClass("item_mark");
        });
        //��������ƶ��¼�
        this.$workArea.delegate(".ico", "mousedown", {inthis: this}, function (e) {
            if (!e)e = window.event;
            if (e.button == 2)return false;
            var This = e.data.inthis;
            if (This.$nowType == "direct")    return;
            var Dom = $(this).parents(".GooFlow_item");
            var id = Dom.attr("id");
            This.focusItem(id, true);
            var hack = 1;

            var ev = mousePosition(e), t = getElCoordinate(This.$workArea[0]);

            Dom.children('table').css('width', '22px').clone().prependTo(This.$ghost);
            var X, Y;
            X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft;
            Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop;
            var vX = X - This.$nodeData[id].left, vY = Y - This.$nodeData[id].top;
            var isMove = false;
            document.onmousemove = function (e) {
                if (!e)e = window.event;
                var ev = mousePosition(e);
                if (X == ev.x - vX && Y == ev.y - vY)    return false;
                X = ev.x - vX;
                Y = ev.y - vY;

                if (isMove && This.$ghost.css("display") == "none") {
                    This.$ghost.css({
                        display: "block",
                        width: This.$nodeData[id].width - 2 + "px",
                        height: This.$nodeData[id].height - 2 + "px",
                        top: This.$nodeData[id].top + t.top - This.$workArea[0].parentNode.scrollTop + hack + "px",
                        left: This.$nodeData[id].left + t.left - This.$workArea[0].parentNode.scrollLeft + hack + "px",
                        cursor: "move"
                    });
                }

                if (X < t.left - This.$workArea[0].parentNode.scrollLeft)
                    X = t.left - This.$workArea[0].parentNode.scrollLeft;
                else if (X + This.$workArea[0].parentNode.scrollLeft + This.$nodeData[id].width > t.left + This.$workArea.width())
                    X = t.left + This.$workArea.width() - This.$workArea[0].parentNode.scrollLeft - This.$nodeData[id].width;
                if (Y < t.top - This.$workArea[0].parentNode.scrollTop)
                    Y = t.top - This.$workArea[0].parentNode.scrollTop;
                else if (Y + This.$workArea[0].parentNode.scrollTop + This.$nodeData[id].height > t.top + This.$workArea.height())
                    Y = t.top + This.$workArea.height() - This.$workArea[0].parentNode.scrollTop - This.$nodeData[id].height;
                This.$ghost.css({left: X + hack + "px", top: Y + hack + "px"});
                isMove = true;
            }
            document.onmouseup = function (e) {
                if (isMove)This.moveNode(id, X + This.$workArea[0].parentNode.scrollLeft - t.left, Y + This.$workArea[0].parentNode.scrollTop - t.top);
                This.$ghost.empty().hide();
                document.onmousemove = null;
                document.onmouseup = null;
            }
        });
        if (!this.$editable)    return;
        //����긲��/�Ƴ��¼�
        this.$workArea.delegate(".GooFlow_item", "mouseenter", {inthis: this}, function (e) {
            if (e.data.inthis.$nowType != "direct")    return;
            $(this).addClass("item_mark");
        });
        this.$workArea.delegate(".GooFlow_item", "mouseleave", {inthis: this}, function (e) {
            if (e.data.inthis.$nowType != "direct")    return;
            $(this).removeClass("item_mark");
        });
        //������ʱȷ����ʼ��
        this.$workArea.delegate(".GooFlow_item", "mousedown", {inthis: this}, function (e) {
            if (e.button == 2)return false;
            var This = e.data.inthis;
            if (This.$nowType != "direct")    return;
            var ev = mousePosition(e), t = getElCoordinate(This.$workArea[0]);
            var X, Y;
            X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft;
            Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop;
            This.$workArea.data("lineStart", {"x": X, "y": Y, "id": this.id}).css("cursor", "crosshair");
            var line = GooFlow.prototype.drawLine("GooFlow_tmp_line", [X, Y], [X, Y], true, true);
            This.$draw.appendChild(line);
        });
        //������ʱȷ��������
        this.$workArea.delegate(".GooFlow_item", "mouseup", {inthis: this}, function (e) {
            var This = e.data.inthis;
            if (This.$nowType != "direct")    return;
            var lineStart = This.$workArea.data("lineStart");
            if (lineStart)    This.addLine(This.$id + "_line_" + This.$max, {
                from: lineStart.id,
                to: this.id,
                name: ""
            });
            This.$max++;
        });
        //��˫���༭�¼�
        this.$workArea.delegate(".GooFlow_item > .span", "dblclick", {inthis: this}, function (e) {
            var oldTxt = this.innerHTML;
            var This = e.data.inthis;
            var id = this.parentNode.id;
            var t = getElCoordinate(This.$workArea[0]);
            This.$textArea.val(oldTxt).css({
                display: "block", height: $(this).height(), width: 100,
                left: t.left + This.$nodeData[id].left - This.$workArea[0].parentNode.scrollLeft - 24,
                top: t.top + This.$nodeData[id].top - This.$workArea[0].parentNode.scrollTop + 26
            })
                .data("id", This.$focus).focus();
            This.$workArea.parent().one("mousedown", function (e) {
                if (e.button == 2)return false;
                This.setName(This.$textArea.data("id"), This.$textArea.val(), "node");
                This.$textArea.val("").removeData("id").hide();
            });
        });
        this.$workArea.delegate(".ico + td", "dblclick", {inthis: this}, function (e) {
            var oldTxt = this.innerHTML;
            var This = e.data.inthis;
            var id = $(this).parents(".GooFlow_item").attr("id");
            var t = getElCoordinate(This.$workArea[0]);
            This.$textArea.val(oldTxt).css({
                display: "block", width: $(this).width() + 24, height: $(this).height(),
                left: t.left - 10 + This.$nodeData[id].left - This.$workArea[0].parentNode.scrollLeft,
                top: t.top + 26 + This.$nodeData[id].top - This.$workArea[0].parentNode.scrollTop
            })
                .data("id", This.$focus).focus();
            This.$workArea.parent().one("mousedown", function (e) {
                if (e.button == 2)return false;
                This.setName(This.$textArea.data("id"), This.$textArea.val(), "node");
                This.$textArea.val("").removeData("id").hide();
            });
        });
        //�󶨽���ɾ������
        this.$workArea.delegate(".rs_close", "click", {inthis: this}, function (e) {
            if (!e)e = window.event;
            e.data.inthis.delNode(e.data.inthis.$focus);
            return false;
        });
        //�󶨽���RESIZE����
        this.$workArea.delegate(".GooFlow_area > div > div[class!=rs_close]", "mousedown", {inthis: this}, function (e) {
            if (!e)e = window.event;
            if (e.button == 2)return false;
            var cursor = $(this).css("cursor");
            if (cursor == "pointer") {
                return;
            }
            var This = e.data.inthis;
            var id = This.$focus;
            This.switchToolBtn("cursor");
            e.cancelBubble = true;
            e.stopPropagation();
            var hack = 1;

            var ev = mousePosition(e), t = getElCoordinate(This.$workArea[0]);

            This.$ghost.css({
                display: "block",
                width: This.$nodeData[id].width - 2 + "px",
                height: This.$nodeData[id].height - 2 + "px",
                top: This.$nodeData[id].top + t.top - This.$workArea[0].parentNode.scrollTop + hack + "px",
                left: This.$nodeData[id].left + t.left - This.$workArea[0].parentNode.scrollLeft + hack + "px",
                cursor: cursor
            });
            var X, Y;
            X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft;
            Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop;
            var vX = (This.$nodeData[id].left + This.$nodeData[id].width) - X;
            var vY = (This.$nodeData[id].top + This.$nodeData[id].height) - Y;
            var isMove = false;
            This.$ghost.css("cursor", cursor);
            document.onmousemove = function (e) {
                if (!e)e = window.event;
                var ev = mousePosition(e);
                X = ev.x - t.left + This.$workArea[0].parentNode.scrollLeft - This.$nodeData[id].left + vX;
                Y = ev.y - t.top + This.$workArea[0].parentNode.scrollTop - This.$nodeData[id].top + vY;
                if (X < 26)    X = 26;
                if (Y < 24)    Y = 24;
                isMove = true;
                switch (cursor) {
                    case "nw-resize":
                        This.$ghost.css({width: X - 2 + "px", height: Y - 2 + "px"});
                        break;
                    case "w-resize":
                        This.$ghost.css({width: X - 2 + "px"});
                        break;
                    case "n-resize":
                        This.$ghost.css({height: Y - 2 + "px"});
                        break;
                }
            }
            document.onmouseup = function (e) {
                This.$ghost.hide();
                if (!isMove)return;
                if (!e)e = window.event;
                This.resizeNode(id, This.$ghost.outerWidth(), This.$ghost.outerHeight());
                document.onmousemove = null;
                document.onmouseup = null;
            }
        });
    },
    //��ȡ���/����/�����������ϸ��Ϣ
    getItemInfo: function (id, type) {
        switch (type) {
            case "node":
                return this.$nodeData[id] || null;
            case "line":
                return this.$lineData[id] || null;
            case "area":
                return this.$areaData[id] || null;
        }
    },
    //ȡ�����н��/���߱�ѡ����״̬
    blurItem: function () {
        if (this.$focus != "") {
            var jq = $("#" + this.$focus);
            if (jq.prop("tagName") == "DIV") {
                if (this.onItemBlur != null && !this.onItemBlur(id, "node"))    return false;
                jq.removeClass("item_focus").children("div:eq(0)").css("display", "none");
            }
            else {
                if (this.onItemBlur != null && !this.onItemBlur(id, "line"))    return false;

                if (!this.$lineData[this.$focus].marked) {
                    jq[0].childNodes[1].setAttribute("stroke", "#5068AE");
                    jq[0].childNodes[1].setAttribute("marker-end", "url(#arrow1)");
                }

                this.$lineMove.hide().removeData("type").removeData("tid");
                if (this.$editable)    this.$lineOper.hide().removeData("tid");
            }
        }
        this.$focus = "";
        return true;
    },
    //ѡ��ĳ�����/ת���� bool:TRUE������Ҫ����ѡ���¼���FALSE�򲻴���ѡ���¼��������ڳ����ڲ����á�
    focusItem: function (id, bool) {
        var jq = $("#" + id);
        if (jq.length == 0)    return;
        if (!this.blurItem())    return;//��ִ��"ȡ��ѡ��",�������FLASE,��Ҳ����ֹѡ���¼���������.
        if (jq.prop("tagName") == "DIV") {
            if (bool && this.onItemFocus != null && !this.onItemFocus(id, "node"))    return;
            jq.addClass("item_focus");
            if (this.$editable)jq.children("div:eq(0)").css("display", "block");
            this.$workArea.append(jq);
        }
        else {//�����������
            if (this.onItemFocus != null && !this.onItemFocus(id, "line"))    return;

            jq[0].childNodes[1].setAttribute("stroke", "#ff3300");
            jq[0].childNodes[1].setAttribute("marker-end", "url(#arrow2)");


            if (!this.$editable)    return;
            var x, y, from, to;

            from = jq.attr("from").split(",");
            to = jq.attr("to").split(",");

            from[0] = parseInt(from[0], 10);
            from[1] = parseInt(from[1], 10);
            to[0] = parseInt(to[0], 10);
            to[1] = parseInt(to[1], 10);
            //var t=getElCoordinate(this.$workArea[0]);
            if (this.$lineData[id].type == "lr") {
                from[0] = this.$lineData[id].M;
                to[0] = from[0];

                this.$lineMove.css({
                    width: "5px", height: (to[1] - from[1]) * (to[1] > from[1] ? 1 : -1) + "px",
                    left: from[0] - 3 + "px",
                    top: (to[1] > from[1] ? from[1] : to[1]) + 1 + "px",
                    cursor: "e-resize", display: "block"
                }).data({"type": "lr", "tid": id});
            }
            else if (this.$lineData[id].type == "tb") {
                from[1] = this.$lineData[id].M;
                to[1] = from[1];
                this.$lineMove.css({
                    width: (to[0] - from[0]) * (to[0] > from[0] ? 1 : -1) + "px", height: "5px",
                    left: (to[0] > from[0] ? from[0] : to[0]) + 1 + "px",
                    top: from[1] - 3 + "px",
                    cursor: "s-resize", display: "block"
                }).data({"type": "tb", "tid": id});
            }
            x = (from[0] + to[0]) / 2 - 35;
            y = (from[1] + to[1]) / 2 + 6;
            this.$lineOper.css({display: "block", left: x + "px", top: y + "px"}).data("tid", id);
        }
        this.$focus = id;
        this.switchToolBtn("cursor");
    },
    //�ƶ���㵽һ���µ�λ��
    moveNode: function (id, left, top) {
        if (!this.$nodeData[id])    return;
        if (this.onItemMove != null && !this.onItemMove(id, "node", left, top))    return;
        if (this.$undoStack) {
            var paras = [id, this.$nodeData[id].left, this.$nodeData[id].top];
            this.pushOper("moveNode", paras);
        }
        if (left < 0)    left = 0;
        if (top < 0)    top = 0;
        $("#" + id).css({left: left + "px", top: top + "px"});
        this.$nodeData[id].left = left;
        this.$nodeData[id].top = top;
        //�ػ�ת����
        this.resetLines(id, this.$nodeData[id]);
        if (this.$editable) {
            this.$nodeData[id].alt = true;
        }
    },
    //���ý��/����/���������������Ϣ
    setName: function (id, name, type) {
        var oldName;
        if (type == "node") {//����ǽ��
            if (!this.$nodeData[id])    return;
            if (this.$nodeData[id].name == name)    return;
            if (this.onItemRename != null && !this.onItemRename(id, name, "node"))    return;
            oldName = this.$nodeData[id].name;
            this.$nodeData[id].name = name;
            if (this.$nodeData[id].type.indexOf("round") > 1) {
                this.$nodeDom[id].children(".span").text(name);
            }
            else {
                this.$nodeDom[id].find("td:eq(1)").text(name);
                var hack = 0;

                var width = this.$nodeDom[id].outerWidth();
                var height = this.$nodeDom[id].outerHeight();
                this.$nodeDom[id].children("table").css({width: width - 2 + "px", height: height - 2 + "px"});
                this.$nodeData[id].width = width;
                this.$nodeData[id].height = height;
            }
            if (this.$editable) {
                this.$nodeData[id].alt = true;
            }
            //�ػ�ת����
            this.resetLines(id, this.$nodeData[id]);
        }
        else if (type == "line") {//�������
            if (!this.$lineData[id])    return;
            if (this.$lineData[id].name == name)    return;
            if (this.onItemRename != null && !this.onItemRename(id, name, "line"))    return;
            oldName = this.$lineData[id].name;
            this.$lineData[id].name = name;

            this.$lineDom[id].childNodes[2].textContent = name;

            if (this.$editable) {
                this.$lineData[id].alt = true;
            }
        }
        else if (type == "area") {//����Ƿ�������
            if (!this.$areaData[id])    return;
            if (this.$areaData[id].name == name)    return;
            if (this.onItemRename != null && !this.onItemRename(id, name, "area"))    return;
            oldName = this.$areaData[id].name;
            this.$areaData[id].name = name;
            this.$areaDom[id].children("label").text(name);
            if (this.$editable) {
                this.$areaData[id].alt = true;
            }
        }
        if (this.$undoStack) {
            var paras = [id, oldName, type];
            this.pushOper("setName", paras);
        }
    },
    //���ý��ĳߴ�,��֧�ַǿ�ʼ/�������
    resizeNode: function (id, width, height) {
        if (!this.$nodeData[id])    return;
        if (this.onItemResize != null && !this.onItemResize(id, "node", width, height))    return;
        if (this.$nodeData[id].type == "start" || this.$nodeData[id].type == "end")return;
        if (this.$undoStack) {
            var paras = [id, this.$nodeData[id].width, this.$nodeData[id].height];
            this.pushOper("resizeNode", paras);
        }
        var hack = 0;

        this.$nodeDom[id].children("table").css({width: width - 2 + "px", height: height - 2 + "px"});
        width = this.$nodeDom[id].outerWidth() - hack;
        height = this.$nodeDom[id].outerHeight() - hack;
        this.$nodeDom[id].children("table").css({width: width - 2 + "px", height: height - 2 + "px"});
        this.$nodeData[id].width = width;
        this.$nodeData[id].height = height;
        if (this.$editable) {
            this.$nodeData[id].alt = true;
        }
        //�ػ�ת����
        this.resetLines(id, this.$nodeData[id]);
    },
    //ɾ�����
    delNode: function (id) {
        if (!this.$nodeData[id])    return;
        if (this.onItemDel != null && !this.onItemDel(id, "node"))    return;
        //��ɾ�����ܵ�����
        for (var k in this.$lineData) {
            if (this.$lineData[k].from == id || this.$lineData[k].to == id) {
                //this.$draw.removeChild(this.$lineDom[k]);
                //delete this.$lineData[k];
                //delete this.$lineDom[k];
                this.delLine(k);
            }
        }
        //��ɾ����㱾��
        if (this.$undoStack) {
            var paras = [id, this.$nodeData[id]];
            this.pushOper("addNode", paras);
        }
        delete this.$nodeData[id];
        this.$nodeDom[id].remove();
        delete this.$nodeDom[id];
        --this.$nodeCount;
        if (this.$focus == id)    this.$focus = "";

        if (this.$editable) {
            //�ڻ�����������ʱ,����ڵ�ID��this.$id+"_node_"��ͷ,���ʾΪ���α༭ʱ�¼���Ľڵ�,��Щ�ڵ��ɾ�����ü��뵽$deletedItem��
            if (id.indexOf(this.$id + "_node_") < 0)
                this.$deletedItem[id] = "node";
        }
    },
    //��������ͼ������
    setTitle: function (text) {
        this.$title = text;
        if (this.$head)    this.$head.children("label").attr("title", text).text(text);
    },
    //����һ������
    loadData: function (data) {
        var t = this.$editable;
        this.$editable = false;
        if (data.title)    this.setTitle(data.title);
        if (data.initNum)    this.$max = data.initNum;
        for (var i in data.nodes)
            this.addNode(i, data.nodes[i]);
        for (var j in data.lines)
            this.addLine(j, data.lines[j]);
        for (var k in data.areas)
            this.addArea(k, data.areas[k]);
        this.$editable = t;
        this.$deletedItem = {};
    },
    //��AJAX��ʽ��Զ�̶�ȡһ������
    //����paraΪJSON�ṹ����JQUERY��$.ajax()�����Ĵ���һ��
    loadDataAjax: function (para) {
        var This = this;
        $.ajax({
            type: para.type,
            url: para.url,
            dataType: "json",
            data: para.data,
            success: function (msg) {
                if (para.dataFilter)    para.dataFilter(msg, "json");
                This.loadData(msg);
                if (para.success)    para.success(msg);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (para.error)    para.error(textStatus, errorThrown);
            }
        })
    },
    //�ѻ��õ���������ͼ������һ��������(��ʵҲ����ֱ�ӷ���GooFlow�����$nodeData,$lineData,$areaData������JSON����)
    exportData: function () {
        var ret = {
            title: this.$title,
            nodes: this.$nodeData,
            lines: this.$lineData,
            areas: this.$areaData,
            initNum: this.$max
        };
        for (var k1 in ret.nodes) {
            if (!ret.nodes[k1].marked) {
                delete ret.nodes[k1]["marked"];
            }
        }
        for (var k2 in ret.lines) {
            if (!ret.lines[k2].marked) {
                delete ret.lines[k2]["marked"];
            }
        }
        return ret;
    },
    //ֻ�ѱ��α༭����ͼ�����˱��(������ɾ��)��Ԫ�ص�����һ��������,�Է����û�ÿ�α༭���������ͼ��ֻ��ȡ�����������
    exportAlter: function () {
        var ret = {nodes: {}, lines: {}, areas: {}};
        for (var k1 in this.$nodeData) {
            if (this.$nodeData[k1].alt) {
                ret.nodes[k1] = this.$nodeData[k1];
            }
        }
        for (var k2 in this.$lineData) {
            if (this.$lineData[k2].alt) {
                ret.lines[k2] = this.$lineData[k2];
            }
        }
        for (var k3 in this.$areaData) {
            if (this.$areaData[k3].alt) {
                ret.areas[k3] = this.$areaData[k3];
            }
        }
        ret.deletedItem = this.$deletedItem;
        return ret;
    },
    //���Ԫ�ص�ID,һ�����ڿ��ٱ����,����̨������Ԫ�ص�ID���µ�ҳ����;typeΪԪ������(�ڵ�,����,����)
    transNewId: function (oldId, newId, type) {
        var tmp;
        switch (type) {
            case "node":
                if (this.$nodeData[oldId]) {
                    tmp = this.$nodeData[oldId];
                    delete this.$nodeData[oldId];
                    this.$nodeData[newId] = tmp;
                }
                break;
            case "line":
                if (this.$lineData[oldId]) {
                    tmp = this.$lineData[oldId];
                    delete this.$lineData[oldId];
                    this.$lineData[newId] = tmp;
                }
                break;
            case "area":
                if (this.$areaData[oldId]) {
                    tmp = this.$areaData[oldId];
                    delete this.$areaData[oldId];
                    this.$areaData[newId] = tmp;
                }
                break;
        }
    },
    //��չ������������������
    clearData: function () {
        for (var key in this.$nodeData) {
            this.delNode(key);
        }
        for (var key in this.$lineData) {
            this.delLine(key);
        }
        for (var key in this.$areaData) {
            this.delArea(key);
        }
        this.$deletedItem = {};
    },
    //�����Լ�
    destrory: function () {
        this.$bgDiv.empty();
        this.$lineData = null;
        this.$nodeData = null;
        this.$lineDom = null;
        this.$nodeDom = null;
        this.$areaDom = null;
        this.$areaData = null;
        this.$nodeCount = 0;
        this.$areaCount = 0;
        this.$areaCount = 0;
        this.$deletedItem = {};
    },
///////////����Ϊ�йػ��ߵķ���
    //����һ����ͷ�ߣ��������ߵ�DOM
    drawLine: function (id, sp, ep, mark, dash) {
        var line;
        line = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var hi = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        if (id != "")    line.setAttribute("id", id);
        line.setAttribute("from", sp[0] + "," + sp[1]);
        line.setAttribute("to", ep[0] + "," + ep[1]);
        hi.setAttribute("visibility", "hidden");
        hi.setAttribute("stroke-width", 9);
        hi.setAttribute("fill", "none");
        hi.setAttribute("stroke", "white");
        hi.setAttribute("d", "M " + sp[0] + " " + sp[1] + " L " + ep[0] + " " + ep[1]);
        hi.setAttribute("pointer-events", "stroke");
        path.setAttribute("d", "M " + sp[0] + " " + sp[1] + " L " + ep[0] + " " + ep[1]);
        path.setAttribute("stroke-width", 1.4);
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("fill", "none");
        if (dash)    path.setAttribute("style", "stroke-dasharray:6,5");
        if (mark) {
            path.setAttribute("stroke", "#ff3300");
            path.setAttribute("marker-end", "url(#arrow2)");
        }
        else {
            path.setAttribute("stroke", "#5068AE");
            path.setAttribute("marker-end", "url(#arrow1)");
        }
        line.appendChild(hi);
        line.appendChild(path);
        line.style.cursor = "crosshair";
        if (id != "" && id != "GooFlow_tmp_line") {
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            //text.textContent=id;
            line.appendChild(text);
            var x = (ep[0] + sp[0]) / 2;
            var y = (ep[1] + sp[1]) / 2;
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("x", x);
            text.setAttribute("y", y);
            line.style.cursor = "pointer";
            text.style.cursor = "text";
        }

        return line;
    },
    //��һ��ֻ�������е������
    drawPoly: function (id, sp, m1, m2, ep, mark) {
        var poly, strPath;
        poly = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var hi = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        if (id != "")    poly.setAttribute("id", id);
        poly.setAttribute("from", sp[0] + "," + sp[1]);
        poly.setAttribute("to", ep[0] + "," + ep[1]);
        hi.setAttribute("visibility", "hidden");
        hi.setAttribute("stroke-width", 9);
        hi.setAttribute("fill", "none");
        hi.setAttribute("stroke", "white");
        strPath = "M " + sp[0] + " " + sp[1];
        if (m1[0] != sp[0] || m1[1] != sp[1])
            strPath += " L " + m1[0] + " " + m1[1];
        if (m2[0] != ep[0] || m2[1] != ep[1])
            strPath += " L " + m2[0] + " " + m2[1];
        strPath += " L " + ep[0] + " " + ep[1];
        hi.setAttribute("d", strPath);
        hi.setAttribute("pointer-events", "stroke");
        path.setAttribute("d", strPath);
        path.setAttribute("stroke-width", 1.4);
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("fill", "none");
        if (mark) {
            path.setAttribute("stroke", "#ff3300");
            path.setAttribute("marker-end", "url(#arrow2)");
        }
        else {
            path.setAttribute("stroke", "#5068AE");
            path.setAttribute("marker-end", "url(#arrow1)");
        }
        poly.appendChild(hi);
        poly.appendChild(path);
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //text.textContent=id;
        poly.appendChild(text);
        var x = (m2[0] + m1[0]) / 2;
        var y = (m2[1] + m1[1]) / 2;
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.style.cursor = "text";
        poly.style.cursor = "pointer";

        return poly;
    },
    //������������Ҫ��ֱ�ߵĻ������ߵĿ�ʼ����ͽ�������
    calcStartEnd: function (n1, n2) {
        var X_1, Y_1, X_2, Y_2;
        //X�жϣ�
        var x11 = n1.left, x12 = n1.left + n1.width, x21 = n2.left, x22 = n2.left + n2.width;
        //���2�ڽ��1���
        if (x11 >= x22) {
            X_1 = x11;
            X_2 = x22;
        }
        //���2�ڽ��1�ұ�
        else if (x12 <= x21) { x_1="x12;" x_2="x21;" } ���2�ڽ��1ˮƽ�����غ� else if (x11 <="x21" && x12>= x21 && x12 <= x22) { x_1="(x12" + x21) 2; x_2="X_1;" } else if (x11>= x21 && x12 <= x22) { x_1="(x11" + x12) 2; x_2="X_1;" } else if (x21>= x11 && x22 <= x12) { x_1="(x21" + x22) 2; x_2="X_1;" } else if (x11 <="x22" && x12>= x22) {
            X_1 = (x11 + x22) / 2;
            X_2 = X_1;
        }

        //Y�жϣ�
        var y11 = n1.top, y12 = n1.top + n1.height, y21 = n2.top, y22 = n2.top + n2.height;
        //���2�ڽ��1�ϱ�
        if (y11 >= y22) {
            Y_1 = y11;
            Y_2 = y22;
        }
        //���2�ڽ��1�±�
        else if (y12 <= y21) { y_1="y12;" y_2="y21;" } ���2�ڽ��1��ֱ�����غ� else if (y11 <="y21" && y12>= y21 && y12 <= y22) { y_1="(y12" + y21) 2; y_2="Y_1;" } else if (y11>= y21 && y12 <= y22) { y_1="(y11" + y12) 2; y_2="Y_1;" } else if (y21>= y11 && y22 <= y12) { y_1="(y21" + y22) 2; y_2="Y_1;" } else if (y11 <="y22" && y12>= y22) {
            Y_1 = (y11 + y22) / 2;
            Y_2 = Y_1;
        }
        return {"start": [X_1, Y_1], "end": [X_2, Y_2]};
    },
    //������������Ҫ�����ߵĻ������ߵ���������
    calcPolyPoints: function (n1, n2, type, M) {
        //��ʼ/����������������
        var SP = {x: n1.left + n1.width / 2, y: n1.top + n1.height / 2};
        var EP = {x: n2.left + n2.width / 2, y: n2.top + n2.height / 2};
        var sp = [], m1 = [], m2 = [], ep = [];
        //����������жο������ƶ�������,�����MΪ���ƶ��ж��ߵ�X����
        //���Լ�����ʼ��
        sp = [SP.x, SP.y];
        ep = [EP.x, EP.y];
        if (type == "lr") {
            //���Լ���2���е�
            m1 = [M, SP.y];
            m2 = [M, EP.y];
            //�پ�������޸Ŀ�ʼ����е�1
            if (m1[0] > n1.left && m1[0] < n1.left + n1.width) {
                m1[1] = (SP.y > EP.y ? n1.top : n1.top + n1.height);
                sp[0] = m1[0];
                sp[1] = m1[1];
            }
            else {
                sp[0] = (m1[0] < n1.left ? n1.left : n1.left + n1.width)
            }
            //�پ�������е�2�ͽ�����
            if (m2[0] > n2.left && m2[0] < n2.left + n2.width) {
                m2[1] = (SP.y > EP.y ? n2.top + n2.height : n2.top);
                ep[0] = m2[0];
                ep[1] = m2[1];
            }
            else {
                ep[0] = (m2[0] < n2.left ? n2.left : n2.left + n2.width)
            }
        }
        //����������жο������ƶ�������,�����MΪ���ƶ��ж��ߵ�Y����
        else if (type == "tb") {
            //���Լ���2���е�
            m1 = [SP.x, M];
            m2 = [EP.x, M];
            //�پ�������޸Ŀ�ʼ����е�1
            if (m1[1] > n1.top && m1[1] < n1.top + n1.height) {
                m1[0] = (SP.x > EP.x ? n1.left : n1.left + n1.width);
                sp[0] = m1[0];
                sp[1] = m1[1];
            }
            else {
                sp[1] = (m1[1] < n1.top ? n1.top : n1.top + n1.height)
            }
            //�پ�������е�2�ͽ�����
            if (m2[1] > n2.top && m2[1] < n2.top + n2.height) {
                m2[0] = (SP.x > EP.x ? n2.left + n2.width : n2.left);
                ep[0] = m2[0];
                ep[1] = m2[1];
            }
            else {
                ep[1] = (m2[1] < n2.top ? n2.top : n2.top + n2.height);
            }
        }
        return {start: sp, m1: m1, m2: m2, end: ep};
    },
    //��ʼ�������жε�X/Y����,mType='rb'ʱΪX����,mType='tb'ʱΪY����
    getMValue: function (n1, n2, mType) {
        if (mType == "lr") {
            return (n1.left + n1.width / 2 + n2.left + n2.width / 2) / 2;
        }
        else if (mType == "tb") {
            return (n1.top + n1.height / 2 + n2.top + n2.height / 2) / 2;
        }
    },
    //����һ����
    addLine: function (id, json) {
        if (this.onItemAdd != null && !this.onItemAdd(id, "line", json))return;
        if (this.$undoStack && this.$editable) {
            this.pushOper("delLine", [id]);
        }
        var n1 = null, n2 = null;//��ȡ��ʼ/������������
        if (json.from == json.to)    return;
        //���������ڵ�䲻����һ������ͬ�������
        for (var k in this.$lineData) {
            if ((json.from == this.$lineData[k].from && json.to == this.$lineData[k].to))
                return;
        }
        var n1 = this.$nodeData[json.from], n2 = this.$nodeData[json.to];//��ȡ��ʼ/������������
        if (!n1 || !n2)    return;
        var res;
        if (json.type && json.type != "sl")
            res = GooFlow.prototype.calcPolyPoints(n1, n2, json.type, json.M);
        else
            res = GooFlow.prototype.calcStartEnd(n1, n2);
        if (!res)    return;
        this.$lineData[id] = {};
        if (json.type) {
            this.$lineData[id].type = json.type;
            this.$lineData[id].M = json.M;
        }
        else    this.$lineData[id].type = "sl";//Ĭ��Ϊֱ��
        this.$lineData[id].from = json.from;
        this.$lineData[id].to = json.to;
        this.$lineData[id].name = json.name;
        if (json.mark)    this.$lineData[id].marked = json.mark;
        else    this.$lineData[id].marked = false;

        if (this.$lineData[id].type == "sl")
            this.$lineDom[id] = GooFlow.prototype.drawLine(id, res.start, res.end, json.mark);
        else
            this.$lineDom[id] = GooFlow.prototype.drawPoly(id, res.start, res.m1, res.m2, res.end, json.mark);
        this.$draw.appendChild(this.$lineDom[id]);
        this.$lineDom[id].childNodes[1].innerHTML = json.name;
        if (this.$lineData[id].type != "sl") {
            var Min = (res.start[0] > res.end[0] ? res.end[0] : res.start[0]);
            if (Min > res.m2[0])    Min = res.m2[0];
            if (Min > res.m1[0])    Min = res.m1[0];
            this.$lineDom[id].childNodes[1].style.left = (res.m2[0] + res.m1[0]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetWidth / 2 + 4;
            Min = (res.start[1] > res.end[1] ? res.end[1] : res.start[1]);
            if (Min > res.m2[1])    Min = res.m2[1];
            if (Min > res.m1[1])    Min = res.m1[1];
            this.$lineDom[id].childNodes[1].style.top = (res.m2[1] + res.m1[1]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetHeight / 2;
        } else
            this.$lineDom[id].childNodes[1].style.left =
                ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - this.$lineDom[id].childNodes[1].offsetWidth) / 2 + 4;
        ++this.$lineCount;
        if (this.$editable) {
            this.$lineData[id].alt = true;
            if (this.$deletedItem[id])    delete this.$deletedItem[id];//�ڻ���ɾ������ʱ,ȥ����Ԫ�ص�ɾ����¼
        }
    },
    //�ع���������ĳ�������ߵ���ʾ�����νṹΪ$nodeData�����һ����Ԫ�ṹ
    resetLines: function (id, node) {
        for (var i in this.$lineData) {
            var other = null;//��ȡ����/��ʼ��������
            var res;
            if (this.$lineData[i].from == id) {//�ҽ�����
                other = this.$nodeData[this.$lineData[i].to] || null;
                if (other == null)    continue;
                if (this.$lineData[i].type == "sl")
                    res = GooFlow.prototype.calcStartEnd(node, other);
                else
                    res = GooFlow.prototype.calcPolyPoints(node, other, this.$lineData[i].type, this.$lineData[i].M)
                if (!res)    break;
            }
            else if (this.$lineData[i].to == id) {//�ҿ�ʼ��
                other = this.$nodeData[this.$lineData[i].from] || null;
                if (other == null)    continue;
                if (this.$lineData[i].type == "sl")
                    res = GooFlow.prototype.calcStartEnd(other, node);
                else
                    res = GooFlow.prototype.calcPolyPoints(other, node, this.$lineData[i].type, this.$lineData[i].M);
                if (!res)    break;
            }
            if (other == null)    continue;
            this.$draw.removeChild(this.$lineDom[i]);
            if (this.$lineData[i].type == "sl") {
                this.$lineDom[i] = GooFlow.prototype.drawLine(i, res.start, res.end, this.$lineData[i].marked);
            }
            else {
                this.$lineDom[i] = GooFlow.prototype.drawPoly(i, res.start, res.m1, res.m2, res.end, this.$lineData[i].marked);
            }
            this.$draw.appendChild(this.$lineDom[i]);

            this.$lineDom[i].childNodes[1].innerHTML = this.$lineData[i].name;
            if (this.$lineData[i].type != "sl") {
                var Min = (res.start[0] > res.end[0] ? res.end[0] : res.start[0]);
                if (Min > res.m2[0])    Min = res.m2[0];
                if (Min > res.m1[0])    Min = res.m1[0];
                this.$lineDom[i].childNodes[1].style.left = (res.m2[0] + res.m1[0]) / 2 - Min - this.$lineDom[i].childNodes[1].offsetWidth / 2 + 4;
                Min = (res.start[1] > res.end[1] ? res.end[1] : res.start[1]);
                if (Min > res.m2[1])    Min = res.m2[1];
                if (Min > res.m1[1])    Min = res.m1[1];
                this.$lineDom[i].childNodes[1].style.top = (res.m2[1] + res.m1[1]) / 2 - Min - this.$lineDom[i].childNodes[1].offsetHeight / 2 - 4;
            } else
                this.$lineDom[i].childNodes[1].style.left =
                    ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - this.$lineDom[i].childNodes[1].offsetWidth) / 2 + 4;

        }
    },
    //�����������ߵ���ʽ newType= "sl":ֱ��, "lr":�жο������ƶ�������, "tb":�жο������ƶ�������
    setLineType: function (id, newType) {
        if (!newType || newType == null || newType == "" || newType == this.$lineData[id].type)    return false;
        if (this.onLineSetType != null && !this.onLineSetType(id, newType))    return;
        if (this.$undoStack) {
            var paras = [id, this.$lineData[id].type];
            this.pushOper("setLineType", paras);
            if (this.$lineData[id].type != "sl") {
                var para2 = [id, this.$lineData[id].M];
                this.pushOper("setLineM", para2);
            }
        }
        var from = this.$lineData[id].from;
        var to = this.$lineData[id].to;
        this.$lineData[id].type = newType;
        var res;
        //����Ǳ������
        if (newType != "sl") {
            var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].M);
            this.setLineM(id, this.getMValue(this.$nodeData[from], this.$nodeData[to], newType), true);
        }
        //����Ǳ��ֱ��
        else {
            delete this.$lineData[id].M;
            this.$lineMove.hide().removeData("type").removeData("tid");
            res = GooFlow.prototype.calcStartEnd(this.$nodeData[from], this.$nodeData[to]);
            if (!res)    return;
            this.$draw.removeChild(this.$lineDom[id]);
            this.$lineDom[id] = GooFlow.prototype.drawLine(id, res.start, res.end, this.$lineData[id].marked || this.$focus == id);
            this.$draw.appendChild(this.$lineDom[id]);
            this.$lineDom[id].childNodes[1].innerHTML = this.$lineData[id].name;
            this.$lineDom[id].childNodes[1].style.left =
                ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - this.$lineDom[id].childNodes[1].offsetWidth) / 2 + 4;


        }
        if (this.$focus == id) {
            this.focusItem(id);
        }
        if (this.$editable) {
            this.$lineData[id].alt = true;
        }
    },
    //���������жε�X����ֵ���������ƶ�ʱ����Y����ֵ���������ƶ�ʱ��
    setLineM: function (id, M, noStack) {
        if (!this.$lineData[id] || M < 0 || !this.$lineData[id].type || this.$lineData[id].type == "sl")    return false;
        if (this.onLineMove != null && !this.onLineMove(id, M))    return false;
        if (this.$undoStack && !noStack) {
            var paras = [id, this.$lineData[id].M];
            this.pushOper("setLineM", paras);
        }
        var from = this.$lineData[id].from;
        var to = this.$lineData[id].to;
        this.$lineData[id].M = M;
        var ps = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].M);
        this.$draw.removeChild(this.$lineDom[id]);
        this.$lineDom[id] = GooFlow.prototype.drawPoly(id, ps.start, ps.m1, ps.m2, ps.end, this.$lineData[id].marked || this.$focus == id);
        this.$draw.appendChild(this.$lineDom[id]);

        this.$lineDom[id].childNodes[1].innerHTML = this.$lineData[id].name;
        var Min = (ps.start[0] > ps.end[0] ? ps.end[0] : ps.start[0]);
        if (Min > ps.m2[0])    Min = ps.m2[0];
        if (Min > ps.m1[0])    Min = ps.m1[0];
        this.$lineDom[id].childNodes[1].style.left = (ps.m2[0] + ps.m1[0]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetWidth / 2 + 4;
        Min = (ps.start[1] > ps.end[1] ? ps.end[1] : ps.start[1]);
        if (Min > ps.m2[1])    Min = ps.m2[1];
        if (Min > ps.m1[1])    Min = ps.m1[1];
        this.$lineDom[id].childNodes[1].style.top = (ps.m2[1] + ps.m1[1]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetHeight / 2 - 4;
        if (this.$editable) {
            this.$lineData[id].alt = true;
        }
    },
    //ɾ��ת����
    delLine: function (id) {
        if (!this.$lineData[id])    return;
        if (this.onItemDel != null && !this.onItemDel(id, "node"))    return;
        if (this.$undoStack) {
            var paras = [id, this.$lineData[id]];
            this.pushOper("addLine", paras);
        }
        this.$draw.removeChild(this.$lineDom[id]);
        delete this.$lineData[id];
        delete this.$lineDom[id];
        if (this.$focus == id)    this.$focus = "";
        --this.$lineCount;
        if (this.$editable) {
            //�ڻ�����������ʱ,����ڵ�ID��this.$id+"_line_"��ͷ,���ʾΪ���α༭ʱ�¼���Ľڵ�,��Щ�ڵ��ɾ�����ü��뵽$deletedItem��
            if (id.indexOf(this.$id + "_line_") < 0)
                this.$deletedItem[id] = "line";
        }
        this.$lineOper.hide();
    },
    //����ɫ��ע/ȡ����עһ������ת���ߣ���������ʾ�ص�����̵Ľ��ȡ�
    //����һ���ڱ༭ģʽ������,�����ڴ����ģʽ�зǳ����õķ�����ʵ�������п����ڸ������̵Ľ��ȡ�
    markItem: function (id, type, mark) {
        if (type == "node") {
            if (!this.$nodeData[id])    return;
            if (this.onItemMark != null && !this.onItemMark(id, "node", mark))    return;
            this.$nodeData[id].marked = mark || false;
            if (mark)    this.$nodeDom[id].addClass("item_mark");
            else    this.$nodeDom[id].removeClass("item_mark");

        } else if (type == "line") {
            if (!this.$lineData[id])    return;
            if (this.onItemMark != null && !this.onItemMark(id, "line", mark))    return;
            this.$lineData[id].marked = mark || false;

            if (mark) {
                this.$nodeDom[id].childNodes[1].setAttribute("stroke", "#ff3300");
                this.$nodeDom[id].childNodes[1].setAttribute("marker-end", "url(#arrow2)");
            } else {
                this.$nodeDom[id].childNodes[1].setAttribute("stroke", "#5068AE");
                this.$nodeDom[id].childNodes[1].setAttribute("marker-end", "url(#arrow1)");
            }

        }
        if (this.$undoStatck) {
            var paras = [id, type, !mark];
            this.pushOper("markItem", paras);
        }
    },
    ////////////////////////����Ϊ�����������
    moveArea: function (id, left, top) {
        if (!this.$areaData[id])    return;
        if (this.onItemMove != null && !this.onItemMove(id, "area", left, top))    return;
        if (this.$undoStack) {
            var paras = [id, this.$areaData[id].left, this.$areaData[id].top];
            this.pushOper("moveNode", paras);
        }
        if (left < 0)    left = 0;
        if (top < 0)    top = 0;
        $("#" + id).css({left: left + "px", top: top + "px"});
        this.$areaData[id].left = left;
        this.$areaData[id].top = top;
        if (this.$editable) {
            this.$areaData[id].alt = true;
        }
    },
    //ɾ���������
    delArea: function (id) {
        if (!this.$areaData[id])    return;
        if (this.$undoStack) {
            var paras = [id, this.$areaData[id]];
            this.pushOper("addArea", paras);
        }
        if (this.onItemDel != null && !this.onItemDel(id, "node"))    return;
        delete this.$areaData[id];
        this.$areaDom[id].remove();
        delete this.$areaDom[id];
        --this.$areaCount;
        if (this.$editable) {
            //�ڻ�����������ʱ,����ڵ�ID��this.$id+"_area_"��ͷ,���ʾΪ���α༭ʱ�¼���Ľڵ�,��Щ�ڵ��ɾ�����ü��뵽$deletedItem��
            if (id.indexOf(this.$id + "_area_") < 0)
                this.$deletedItem[id] = "area";
        }
    },
    //��������������ɫ
    setAreaColor: function (id, color) {
        if (!this.$areaData[id])    return;
        if (this.$undoStack) {
            var paras = [id, this.$areaData[id].color];
            this.pushOper("setAreaColor", paras);
        }
        if (color == "red" || color == "yellow" || color == "blue" || color == "green") {
            this.$areaDom[id].removeClass("area_" + this.$areaData[id].color).addClass("area_" + color);
            this.$areaData[id].color = color;
        }
        if (this.$editable) {
            this.$areaData[id].alt = true;
        }
    },
    //��������ֿ�ĳߴ�
    resizeArea: function (id, width, height) {
        if (!this.$areaData[id])    return;
        if (this.onItemResize != null && !this.onItemResize(id, "area", width, height))    return;
        if (this.$undoStack) {
            var paras = [id, this.$areaData[id].width, this.$areaData[id].height];
            this.pushOper("resizeArea", paras);
        }
        var hack = 0;
        this.$areaDom[id].children(".bg").css({width: width - 2 + "px", height: height - 2 + "px"});
        width = this.$areaDom[id].outerWidth();
        height = this.$areaDom[id].outerHeight();
        this.$areaDom[id].children("bg").css({width: width - 2 + "px", height: height - 2 + "px"});
        this.$areaData[id].width = width;
        this.$areaData[id].height = height;
        if (this.$editable) {
            this.$areaData[id].alt = true;
        }
    },
    addArea: function (id, json) {
        if (this.onItemAdd != null && !this.onItemAdd(id, "area", json))return;
        if (this.$undoStack && this.$editable) {
            this.pushOper("delArea", [id]);
        }
        this.$areaDom[id] = $("<div id="" + id + "" class="GooFlow_area area_" + json.color + "" style="top:" + json.top + "px;left:" + json.left + "px"><div class="bg" style="width:" + (json.width - 2) + "px;height:" + (json.height - 2) + "px"></div>"
            + "<label>" + json.name + "</label><b></b><div><div class="rs_bottom"></div><div class="rs_right"></div><div class="rs_rb"></div><div class="rs_close"></div></div></div>");
        this.$areaData[id] = json;
        this.$group.append(this.$areaDom[id]);
        if (this.$nowType != "group")    this.$areaDom[id].children("div:eq(1)").css("display", "none");
        ++this.$areaCount;
        if (this.$editable) {
            this.$areaData[id].alt = true;
            if (this.$deletedItem[id])    delete this.$deletedItem[id];//�ڻ���ɾ������ʱ,ȥ����Ԫ�ص�ɾ����¼
        }
    },
    //�ع���������ͼ������Ŀ���
    reinitSize: function (width, height) {
        var w = (width || 800) - 2;
        var h = (height || 500) - 2;
        this.$bgDiv.css({height: h + "px", width: w + "px"});
        var headHeight = 0, hack = 10;
        if (this.$head != null) {
            headHeight = 24;
            hack = 7;
        }
        if (this.$tool != null) {
            this.$tool.css({height: h - headHeight - hack + "px"});
        }
        w -= 39;
        h = h - headHeight - (this.$head != null ? 5 : 8);
        this.$workArea.parent().css({height: h + "px", width: w + "px"});
        this.$workArea.css({height: h * 3 + "px", width: w * 3 + "px"});
        this.$draw.coordsize = w * 3 + "," + h * 3;
        this.$draw.style.width = w * 3 + "px";
        this.$draw.style.height = +h * 3 + "px";
        if (this.$group == null) {
            this.$group.css({height: h * 3 + "px", width: w * 3 + "px"});
        }
    }
}
//������Ĺ��캯��������JQUERY������
jQuery.extend({
    createGooFlow: function (bgDiv, property) {
        return new GooFlow(bgDiv, property);
    }
}); </=></=></=></=></=></=></=></=></span></span>