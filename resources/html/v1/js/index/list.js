 //messageboard
(function () {
var list = {
		el: $("#boardfrom"),
			data: {
		},
		selector: {
			nickname: "input[name='nickname']",
			contact: "input[name='contact']",
			content: "input[name='content']",
			messagebox: "#messagebox",
		},
		events: function () {
			this.el.on("click", 'button', this.eventsCallBack.commit);
			this.eventsCallBack.list();
		},
		eventsCallBack: {
			commit: function () {

			  //disable the btn 
			  var btn = list.el.find("button");
			  btn.attr("disabled",true);
			  var i = 10 ;
			  var interval = window.setInterval(function(){
			      if(i<=0){ btn.text("submit"); btn.removeattr("disabled"); window.clearinterval(interval); }else{ btn.text("after"+i+"s"); i--; } },1000); $.ajax({ type: "post", url: "https: www.kykys.cn java index board add", data: decodeuricomponent(list.el.serialize()), timeout: 5000, beforesend: function () { }, success: (response) if (response && response.success) alert("thanks for your message"); else alert("server error"); }); list: function(){ "get", list", {}, response.success response.response response.response.messageboardmodellist.length>0) {

			            	var box = $(list.selector.messagebox);
			            	for(var i=0;i<response.response.messageboardmodellist.length;i++){ var obj="response.response.messageBoardModelList[i];" box.append("<h2><i>"+textToEmojimessage(obj.nickname)
			            			+"</i><small class="pull-right">"+new Date(obj.createTime).Format("yyyy-MM-dd hh:mm:ss")+"</small><p>"+textToEmojimessage(obj.content)+"</p><hr>");
			            	}
			             
			            } else {
			              console.log("server error");
			            }
			        }
			    });
				
			},
		},
		init: function () {
			this.events();
		}
	};
	list.init();
})();</response.response.messageboardmodellist.length;i++){></=0){>