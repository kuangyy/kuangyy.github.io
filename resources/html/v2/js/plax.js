(function(s){var r=25,l=1/r*1e3,u=(new Date).getTime(),g=[],m={},c=30,d=1,p=-1,n=null,e=null,v=false,b=null;var t={useTransform:true};s.fn.plaxify=function(i){b=s.extend({},t,i);b.useTransform=b.useTransform?o():false;return this.each(function(){var r=-1;var t={xRange:s(this).data("xrange")||0,yRange:s(this).data("yrange")||0,zRange:s(this).data("zrange")||0,invert:s(this).data("invert")||false,background:s(this).data("background")||false};for(var n=0;n<g.length;n++){if(this===g[n].obj.get(0)){r=n}}for(var e in i){if(t[e]==0){t[e]=i[e]}}t.inversionFactor=t.invert?-1:1;t.obj=s(this);if(t.background){pos=(t.obj.css("background-position")||"0px 0px").split(/ /);if(pos.length!=2){return}x=pos[0].match(/^((-?\d+)\s*px|0+\s*%|left)$/);y=pos[1].match(/^((-?\d+)\s*px|0+\s*%|top)$/);if(!x||!y){return}t.originX=t.startX=x[2]||0;t.originY=t.startY=y[2]||0;t.transformOriginX=t.transformStartX=0;t.transformOriginY=t.transformStartY=0;t.transformOriginZ=t.transformStartZ=0}else{var o=t.obj.position(),a=f(t.obj);t.obj.css({transform:a.join()+"px",top:o.top,left:o.left,right:"",bottom:""});t.originX=t.startX=o.left;t.originY=t.startY=o.top;t.transformOriginX=t.transformStartX=a[0];t.transformOriginY=t.transformStartY=a[1];t.transformOriginZ=t.transformStartZ=a[2]}t.startX-=t.inversionFactor*Math.floor(t.xRange/2);t.startY-=t.inversionFactor*Math.floor(t.yRange/2);t.transformStartX-=t.inversionFactor*Math.floor(t.xRange/2);t.transformStartY-=t.inversionFactor*Math.floor(t.yRange/2);t.transformStartZ-=t.inversionFactor*Math.floor(t.zRange/2);if(r>=0){g.splice(r,1,t)}else{g.push(t)}})};function f(r){var t=[0,0,0],n=r.css("-webkit-transform")||r.css("-moz-transform")||r.css("-ms-transform")||r.css("-o-transform")||r.css("transform");if(n!=="none"){var e=n.split("(")[1].split(")")[0].split(",");var o=0,a=0,i=0;if(e.length==16){o=parseFloat(e[e.length-4]);a=parseFloat(e[e.length-3]);i=parseFloat(e[e.length-2])}else{o=parseFloat(e[e.length-2]);a=parseFloat(e[e.length-1]);i=0}t=[o,a,i]}return t}function h(r){if(r.offsetWidth===0||r.offsetHeight===0)return false;var t=document.documentElement.clientHeight,n=r.getClientRects();for(var e=0,o=n.length;e<o;e++){var a=n[e],i=a.top>0?a.top<=t:a.bottom>0&&a.bottom<=t;if(i)return true}return false}function o(){var r=document.createElement("p"),t,n={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};document.body.insertBefore(r,null);for(var e in n){if(r.style[e]!==undefined){r.style[e]="translate3d(1px,1px,1px)";t=window.getComputedStyle(r).getPropertyValue(n[e])}}document.body.removeChild(r);return t!==undefined&&t.length>0&&t!=="none"}function w(){return v===true?false:window.DeviceOrientationEvent!==undefined}function Y(r){x=r.gamma;y=r.beta;if(Math.abs(window.orientation)===90){var t=x;x=y;y=t}if(window.orientation<0){x=-x;y=-y}n=n===null?x:n;e=e===null?y:e;return{x:x-n,y:y-e}}function a(r){if((new Date).getTime()<u+l)return;u=(new Date).getTime();var t=m.offset()!=null?m.offset().left:0,n=m.offset()!=null?m.offset().top:0,e=r.pageX-t,o=r.pageY-n;if(!h(g[0].obj[0].parentNode))return;if(w()){if(r.gamma===undefined){v=true;return}values=Y(r);e=values.x/c;o=values.y/c;e=e<p?p:e>d?d:e;o=o<p?p:o>d?d:o;e=(e+1)/2;o=(o+1)/2}var a=e/(w()===true?d:m.width()),i=o/(w()===true?d:m.height()),s,f;for(f=g.length;f--;){s=g[f];if(b.useTransform&&!s.background){newX=s.transformStartX+s.inversionFactor*(s.xRange*a);newY=s.transformStartY+s.inversionFactor*(s.yRange*i);newZ=s.transformStartZ;s.obj.css({transform:"translate3d("+newX+"px,"+newY+"px,"+newZ+"px)"})}else{newX=s.startX+s.inversionFactor*(s.xRange*a);newY=s.startY+s.inversionFactor*(s.yRange*i);if(s.background){s.obj.css("background-position",newX+"px "+newY+"px")}else{s.obj.css("left",newX).css("top",newY)}}}}s.plax={enable:function(r){if(r){if(r.activityTarget)m=r.activityTarget||s(document.body);if(typeof r.gyroRange==="number"&&r.gyroRange>0)c=r.gyroRange}else{m=s(document.body)}m.bind("mousemove.plax",function(r){a(r)});if(w()){window.ondeviceorientation=function(r){a(r)}}},disable:function(r){s(document).unbind("mousemove.plax");window.ondeviceorientation=undefined;if(r&&typeof r.restorePositions==="boolean"&&r.restorePositions){for(var t=g.length;t--;){layer=g[t];if(b.useTransform&&!layer.background){layer.obj.css("transform","translate3d("+layer.transformOriginX+"px,"+layer.transformOriginY+"px,"+layer.transformOriginZ+"px)").css("top",layer.originY)}else{if(g[t].background){layer.obj.css("background-position",layer.originX+"px "+layer.originY+"px")}else{layer.obj.css("left",layer.originX).css("top",layer.originY)}}}}if(r&&typeof r.clearLayers==="boolean"&&r.clearLayers)g=[]}};if(typeof ender!=="undefined"){s.ender(s.fn,true)}})(function(){return typeof jQuery!=="undefined"?jQuery:ender}());