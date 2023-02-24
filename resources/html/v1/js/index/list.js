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
			      if(i<=0){
			          btn.text("Submit");
			          btn.removeAttr("disabled");

			          window.clearInterval(interval);
			      }else{
			          btn.text("after"+i+"s");
			          i--;
			      }
			  },1000);


			    $.ajax({
			        type: "POST",
			        url: "https://www.kykys.cn/java/index/board/add",
			        data: decodeURIComponent(list.el.serialize()),
			        timeout: 5000,
			        beforeSend: function () {
			        },
			        success: function (response) {
			            if (response && response.success) {
			              alert("thanks for your message");
			            } else {
			              alert("server error");
			            }
			        }
			    });
			},
			list: function(){

				 $.ajax({
			        type: "GET",
			        url: "https://www.kykys.cn/java/index/board/list",
			        data: {},
			        timeout: 5000,
			        beforeSend: function () {
			        },
			        success: function (response) {
			            if (response && response.success && response.response && response.response.messageBoardModelList.length>0) {

			            	var box = $(list.selector.messagebox);
			            	for(var i=0;i<response.response.messageBoardModelList.length;i++){
			            		var obj = response.response.messageBoardModelList[i];
			            		box.append("<h2><i>"+textToEmojimessage(obj.nickname)
			            			+"</i><small class='pull-right'>"+new Date(obj.createTime).Format("yyyy-MM-dd hh:mm:ss")+"</small></h2><p>"+textToEmojimessage(obj.content)+"</p><hr>");
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
})();