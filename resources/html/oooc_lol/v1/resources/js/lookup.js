!function(d) {
    document.addEventListener("mousemove", update_mouse_pos, true);
    document.addEventListener("mouseup", on_mouse_up, true);
    document.addEventListener("mousedown", on_mouse_down, true);
    document.addEventListener("dblclick", on_mouse_dbclick, true);

    var clientX, clientY;
    // 鼠标按下的位置，用于判断鼠标是不是有很大的位移
    var mouse_down_x, mouse_down_y;

    /* 接受到取词通知时候的回调函数 */
    function getRequest(text) {
        console.log(text);
        d.onTextClick && d.onTextClick();
    }

    function update_mouse_pos(event) {
        clientX = event.clientX, clientY = event.clientY;
    }
    /* 得到鼠标位置所指的词语 */
    function get_word_by_mouse() {
        var ret = {
            text: "",
            pos: -1
        };
        if (clientY == 0 || clientY == 0) {
            return ret;
        }
        var r = document.caretRangeFromPoint(clientX, clientY);
        if (!r) {
            return ret;
        }
        if (r.startContainer.data) {
            var rcText = null;
            if (r.startContainer.getBoundingClientRect) {
                rcText = r.startContainer.getBoundingClientRect();
            } else if (r.startContainer.parentElement && r.startContainer.parentElement.getBoundingClientRect) {
                rcText = r.startContainer.parentElement.getBoundingClientRect();
            }
            if (rcText == null || (rcText && rcText.left < clientX && clientX < rcText.right && rcText.top < clientY && clientY < rcText.bottom)) {
                ret.text = r.startContainer.data;
                ret.pos = r.startOffset;
                return ret;
            }
        }
        return ret;
    };

    function on_mouse_down(event) {
        mouse_down_x = event.clientX;
        mouse_down_y = event.clientY;
    }

    function on_mouse_up(event) {
        if (Math.abs(event.clientX - mouse_down_x) > 2 || Math.abs(event.clientY - mouse_down_y) > 2) {
            var sText = document.selection == undefined ? document.getSelection().toString() : document.selection.createRange().text;
            if (sText != "") {
                // todo: 字符串过长的问题.
                if (sText.length > 2000) sText = sText.substr(0, 2000);
                getRequest(sText);
            }
        }
    }

    function on_mouse_dbclick(event) {
        var sText = document.selection == undefined ? document.getSelection().toString() : document.selection.createRange().text;
        if (sText != "") {
            // todo: 字符串过长的问题.
            if (sText.length > 2000) sText = sText.substr(0, 2000);
        	getRequest(sText);
        }
    }
}(document)