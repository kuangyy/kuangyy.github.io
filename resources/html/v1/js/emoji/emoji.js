// Copyright Tsung Wu <tsung.bz@gmail.com>
// twitter: @ioNull
// github: http://github.com/ioNull/emoji.js
// 
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

;(function(root) {
	var list;
	if (typeof require != 'undefined') {
		getEmojiListObj = require('./emoji-list-with-image');
		punycode = require('./vendor/punycode/punycode.min.js');
		list = getEmojiListObj.getEmojiList();
	} else {
		list = root.getEmojiList();
	}

	if (typeof console === 'undefined') {
		console = {
			log: function() {}
		};
	}
	var emoji = {
		parse: function(what) {
			var unicodes;
			if (what) {
				unicodes = punycode.ucs2.decode(what);
			} else {
				return '';
			}
			//console.log(unicodes.length);
			var unicodeString = '';
			var kinds = list;
			//debugger
			for (var now = 0; now < unicodes.length;) {
				var unicode = unicodes[now];
				var isEmoji = false;
				var isEmojiUnicode = false;
				if (unicode >= 0xE000 && unicode < 0xE538) {
					unicodeString = unicode.toString(16);
					//console.log('it is emoji: ' + unicode + punycode.ucs2.encode([unicode]) + ' : ' + unicodeString);
					//replace with img directly
					isEmoji = true;
				} else if (
				//左上左下右上右下箭头
				(unicode >= 0x2196 && unicode <= 0x2199) || 左右三角箭头 (unicode="=" 0x25c0 unicode="=" 0x25b6) 2三角左右 0x23ea 0x23e9)>= 0x2600 && unicode <= 0x3299) || (unicode>= 0x1f000 && unicode <= 6 0x1f700)) { unicodestring="unicode.toString(16);" console.log('it is unicode emoji: ' + punycode.ucs2.encode([unicode]) : unicodestring); we need to find out what mapped isemoji="true;" isemojiunicode="true;" } else not emoji' unicode); 数字和#号 if (unicode="=" 0x20e3) (now> 0) {
							//check if previous is a number or #
							var preCode = unicodes[now - 1];
							if (preCode == 0x23 || preCode >= 0x30 && preCode <= 1 0x39) { console.log('it is a number unicode: ' + precode); isemoji="true;" isemojiunicode="true;" --now; unicode="preCode;" } if (isemoji) for (var i="0;" < kinds.length; ++i) var kind="kinds[i];" j="0;" kind.length; ++j) emo="kind[j];" foundcount="0;" unicodeemoji="emo[1];" (isemojiunicode) isarray="(typeof" !="string" ); (isarray && now unicodeemoji.length - unicodes.length) console.log('is array :' unicodeemoji.length); uindex="0;" unicodeemoji.length; uindex++) unstring="unicodes[now" uindex].tostring(16); console.log('unstring is: unstring); (unstring break; else foundcount++; console.log('emojis string emo[0] count: foundcount); (!isarray emo[1]="=" unicodestring) (!isemojiunicode (foundcount> 0) {
								//console.log('emojis string is: ' + emo[0] + ' count: ' + foundCount);
								var data = 'data:image/png;base64,' + emo[2];
								var html = '<img style="display: inline;vertical-align: middle;" src="' + data + '" unicode16="'+emo[1]+'">';
								//console.log('img is: ' + html);
								//remove old text, add html string
								var puny = punycode.ucs2.decode(html);
								//console.log('puny length: ' + puny.length);
								unicodes.splice(now, foundCount);
								for (var curr = 0; curr < puny.length; ++curr) {
									unicodes.splice(now, 0, puny[curr]);
									//move next
									++now;
								}
								//index increase next loop
								--now;
								//console.log('unicodes length: ' + unicodes.length);
								break;
							}
						}
					}
				}++now;
			}
			//console.log('unicodes length: ' + unicodes.length);
			var html = punycode.ucs2.encode(unicodes);
			return html;
		},
		decodeChar: function (code_point) {//单个字符解码，如 0x1f604=>字符
		    var output = '';
		    if (code_point > 0xFFFF) {
		        code_point -= 0x10000;
		        output += String.fromCharCode(code_point >>> 10 & 0x3FF | 0xD800);
		        code_point = 0xDC00 | code_point & 0x3FF;
		    }
		    output += String.fromCharCode(code_point);
		    return output;
		}
	};

	var ioNull = {
		emoji: emoji
	};

	function extend(a, b) {
		for (var prop in b) {
			if (typeof b[prop] === 'undefined') {
				delete a[prop];
				// Avoid "Member not found" error in IE8 caused by setting window.constructor
			} else if (prop !== 'constructor' || a !== root) {
				a[prop] = b[prop];
			}
		}
		return a;
	};
	if (typeof exports === 'undefined') {
		if (typeof root.ioNull === 'undefined') {
			root.ioNull = ioNull;
		} else {
			extend(root.ioNull, ioNull);
		}
	} else { // 支持exports方式
		extend(exports, ioNull);
	}
})(this);

</=></=></=></=></tsung.bz@gmail.com>