function getElCoordinate(e){var t=e.offsetTop;var r=e.offsetLeft;e=e.offsetParent;while(e){t+=e.offsetTop;r+=e.offsetLeft;e=e.offsetParent}return{top:t,left:r}}function mousePosition(e){if(!e)e=window.event;if(e.pageX||e.pageY){return{x:e.pageX,y:e.pageY}}return{x:e.clientX+document.documentElement.scrollLeft-document.body.clientLeft,y:e.clientY+document.documentElement.scrollTop-document.body.clientTop}}Date.prototype.format=function(e){var t={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};if(/(y+)/.test(e))e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));for(var r in t)if(new RegExp("("+r+")").test(e))e=e.replace(RegExp.$1,RegExp.$1.length==1?t[r]:("00"+t[r]).substr((""+t[r]).length));return e};function getDateFromFormat(e,t){var r=/\d+/g;var s=/[YyMmdHhSs]+/g;var n=e.match(r);var a=t.match(s);var i=new Date;for(var o=0;o<n.length;o++){switch(a[o].substring(0,1)){case"Y":case"y":i.setFullYear(parseInt(n[o]));break;case"M":i.setMonth(parseInt(n[o])-1);break;case"d":i.setDate(parseInt(n[o]));break;case"H":case"h":i.setHours(parseInt(n[o]));break;case"m":i.setMinutes(parseInt(n[o]));break;case"s":i.setSeconds(parseInt(n[o]));break}}return i}function parseCurrency(e){var t=/[\d\.]+/g;var r=e.match(t);var s="";var n=false;for(var a=0;a<r.length;a++){var i=r[a];if(i=="."){if(n)continue}s+=i}return parseFloat(s)}function brgba(e,t){if(!/#?\d+/g.test(e))return e;var r=e.charAt(0)=="#"?e.substring(1):e,s=parseInt(r.substring(0,2),16),n=parseInt(r.substring(2,4),16),a=parseInt(r.substring(4,6),16),i=t;return"rgba("+s+","+n+","+a+","+i+")"}function ch(e){var t=escape(e);return unescape(t)}function Str2Hex(s){var c="";var n;var ss="0123456789ABCDEF";var digS="";for(var i=0;i<s.length;i++){c=s.charAt(i);n=ss.indexOf(c);digS+=Dec2Dig(eval(n))}return digS}function Dec2Dig(e){var t="";var r=0;for(var s=0;s<4;s++){r=Math.pow(2,3-s);if(e>=r){t+="1";e=e-r}else t+="0"}return t}function Dig2Dec(s){var retV=0;if(s.length==4){for(var i=0;i<4;i++){retV+=eval(s.charAt(i))*Math.pow(2,3-i)}return retV}return-1}function Hex2Utf8(s){var retS="";var tempS="";var ss="";if(s.length==16){tempS="1110"+s.substring(0,4);tempS+="10"+s.substring(4,10);tempS+="10"+s.substring(10,16);var sss="0123456789ABCDEF";for(var i=0;i<3;i++){retS+="%";ss=tempS.substring(i*8,(eval(i)+1)*8);retS+=sss.charAt(Dig2Dec(ss.substring(0,4)));retS+=sss.charAt(Dig2Dec(ss.substring(4,8)))}return retS}return""}