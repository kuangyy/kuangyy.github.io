var regxUtil = {
    isEmail : function(val) {
        return (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val));
    },
    isMobile : function(val) {
        return (/^1[0-9]\d{10}$/.test(val));
    },
    vaildUsername : function(val) {
        return (/^\w{6,32}$/.test(val));
    },
    vaildPwd : function(val) {
        return (/^\w{6,32}$/.test(val));
    }
}

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth() + 1, // 月份
        "d+" : this.getDate(), // 日
        "h+" : this.getHours(), // 小时
        "m+" : this.getMinutes(), // 分
        "s+" : this.getSeconds(), // 秒
        "q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
        "S" : this.getMilliseconds()

    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

String.prototype.trim = function(s) {
    s = (s ? s : "\\s");
    s = ("(" + s + ")");
    var reg_trim = new RegExp("(^" + s + "*)|(" + s + "*$)", "g");
    return this.replace(reg_trim, "");
};

function openUrl(url,name){
    name = name || "_self";
    window.open(url,name);
}

function postUrl(url,data){
    var id = "form-hide-submit-unique";
    var form = $("<form method='post'></form>"),input;
    form.attr({"action":url});
    if(data!=null){
        if(typeof data=="object"){
            if(data instanceof Array){// serializeArray 方式
                $.each(data,function(key,value){
                    input = $("<input type='hidden'>");
                    input.attr({"name":value.name});
                    input.val(value.value);
                    form.append(input);
                });
            }else{
                $.each(data,function(key,value){// {name:value}格式
                    input = $("<input type='hidden'>");
                    input.attr({"name":key});
                    input.val(value);
                    form.append(input);
                });
            }
        }else if(typeof data=="string"){
            form.attr({"action":form.attr("action")+data});
        }
    }
    var node = $("#"+id);
    if(node.length<=0){
        $("body").append('<div style="display: none;" id="'+id+'"></div>');
        node = $("#"+id);
    }
    node.html(form);
    form.submit();

}

Date.prototype.diff = function(date){
    return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
}
Date.prototype.lastdate = function (){
    var day = new Date(this.getFullYear(),this.getMonth()+1,0);
    return  day.getDate();
}

Date.prototype.clone = function (){
    return new Date(this.getTime());
}
Date.prototype.intervalDays = function(date){// 时间相差的天
    return (this.getTime() - date.getTime())/(24 * 60 * 60 * 1000);
}
Date.prototype.intervalMonths = function (date){// 时间相差的自然月
    var days = date.clone().intervalDays(this.clone());
    var monthTemp = Math.floor(days/28);
    if(monthTemp>0){
        var thisYear = this.getFullYear();
        var thisMonth = this.getMonth()+1;
        var thisDay = this.getDate();
        var thisLastDay = this.lastMonthDay();

        var dateYear = date.getFullYear();
        var dateMonth = date.getMonth()+1;
        var dateDay = date.getDate();
        var dateLastDay = date.lastMonthDay();
        if(thisYear<=dateYear){
            var year = dateYear-thisYear;
            // 0-11 2016-05-01~2017-06-01
            // 0-11 2016-05-01~2017-05-01
            // 0-11 2016-05-01~2017-04-01
            var month = dateMonth-thisMonth;
            if(thisDay>dateDay&&dateDay!=dateLastDay){
                month = month-1;
            }
            return (year*12)+month;
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}
Date.prototype.lastMonthDay = function (){// 当月的最后一天
    var day = new Date(this.getFullYear(),this.getMonth()+1,0);
    return  day.getDate();
}

Date.prototype.addMonth = function (monthNum){// 添加指定自然月
    var date = this.clone();
    var num = date.getMonth()+monthNum;
    var day = new Date(date.getFullYear(),num+1,0);
    if (date.getDate()>day.getDate()){
        date.setDate(1);
        date.setMonth(num);
        date.setDate(day.getDate());
    }else{
        date.setMonth(num);
    }
    return  date;
}


String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
};

var datepickerOpt = {
    numberOfMonths : 2,
    selectOtherMonths : false,
    showOtherMonths : false,
    showMonthAfterYear : true,
    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
    monthNamesShort : [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二' ],
    dayNames : [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
    dayNamesShort : [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
    dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
    dateFormat : 'yy-mm-dd',
    minDate : "Now"
};

(function( window, undefined ) {
    var $AJAX = {
        ajax : function(opt) {
            var defOpt = {
                type : "POST",
                dataType : "json",
            };
            $.extend(defOpt, opt);
            $.ajax(defOpt);
        }
    };
    window.$AJAX = $AJAX;
})( window );

var alertify = {
    tips_success:function(msg,callback){
        msg=msg?msg:"成功";
        $("body").append("<div class=\"submit-tips alert alert-success\" style='display: none'><i class=\"fa fa-check\" aria-hidden=\"true\"></i> "+msg+"</div>");
        var tips = $(".submit-tips");
        tips.fadeIn(300);
        window.setTimeout(function(){tips.fadeOut(200);tips.remove();},3000);
        callback && callback();
    },
    tips_error:function(msg,callback){
        msg=msg?msg:"失败";
        $("body").append("<div class=\"submit-tips alert alert-danger\" style='display: none'><i class=\"fa fa-close\" aria-hidden=\"true\"></i> "+msg+"</div>");
        var tips = $(".submit-tips");
        tips.fadeIn(300);
        window.setTimeout(function(){tips.fadeOut(200);tips.remove();},3000);
        callback && callback();
    },
    tips_info:function(msg,callback){
        msg=msg?msg:"tips";
        $("body").append("<div class=\"submit-tips alert alert-info\" style='display: none'><i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i> "+msg+"</div>");
        var tips = $(".submit-tips");
        tips.fadeIn(300);
        window.setTimeout(function(){tips.fadeOut(200);tips.remove();},3000);
        callback && callback();
    }
}


var insertOrReplaceSelect = function(obj,str) {

    var insertText = function(obj,str) {
        if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
                tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += str;
        }
    };

    if(typeof obj == 'object'){
        for(i in obj){
            insertText(obj[i],str);
        }
    }else{
        insertText(obj,str);
    }
}


var TOOLS = {
    MD_HTML : {
        toMarkdown : function(str){
            return toMarkdown(str);
        },
        toHtml : function(str) {
            return Markdown.toHTML(str);
        }
    },
    QRCODE : {
        getTable : function(id,text){
            $(id).qrcode({
                render : "table",
                text : text
            });
        },
        getCavans : function(id,text){
            $(id).qrcode({
                text : text
            });
        }
    }
}

// convert rgb to hex value string
function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) { return rgb; }

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (rgb === null) { return "N/A"; }

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}



// Github Latest Commit
if ($('.github-commit').length) { // Checks if widget div exists (Index only)
    $.ajax({
        url: "https://api.github.com/repos/dogfalo/materialize/commits/master",
        dataType: "json",
        success: function (data) {
            var sha = data.sha,
                date = jQuery.timeago(data.commit.author.date);
            if (window_width < 1120) {
                sha = sha.substring(0,7);
            }
            $('.github-commit').find('.date').html(date);
            $('.github-commit').find('.sha').html(sha).attr('href', data.html_url);
        }
    });
}
