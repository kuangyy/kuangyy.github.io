!function(){
        var obj = {
            el: $(document),
            data: {
              timenow: new Array(),//save the played time
              time: new Array(),
              nowplay: 0,//music id
            },
            selector: {
              musiclist: "#musiclist",
              musictext: "#music-text",
              musictime: "#music-time",
              musicprogress: "#music-progress",
              play: "#music-play",
              pause: "#music-pause",
              prev: "#music-prev",
              next: "#music-next",
            },
            events: function () {
              this.el.on("click", this.selector.play, this.eventsCallBack.musicplay);
              this.el.on("click", this.selector.pause, this.eventsCallBack.musicpause);
              this.el.on("click", this.selector.prev, this.eventsCallBack.musicprev);
              this.el.on("click", this.selector.next, this.eventsCallBack.musicnext);
              //start the sycn
              this.eventsCallBack.timesync();
            },
            eventsCallBack: {
              musicplay: function (type) {
                    $(obj.selector.play).hide();
                    $(obj.selector.pause).show();
                    //play
                    $(obj.selector.musiclist)[0].play();
                    //show the name&author
                    var musics = $(obj.selector.musiclist).children();
                    $(obj.selector.musictext).html(
                      $(musics[obj.data.nowplay]).attr("name")
                      +"<br>"
                      +$(musics[obj.data.nowplay]).attr("author")
                      );
              },
              musicpause: function (type) {
                    $(obj.selector.pause).hide();
                    $(obj.selector.play).show();
                    //pause and save the played time
                    $(obj.selector.musiclist)[0].pause();
                    // $(obj.selector.musiclist)[0].currentTime=obj.data.time[0];
              },
              musicprev: function (type) {
                   //start play
                    $(obj.selector.play).hide();
                    $(obj.selector.pause).show();
                    //get the play list
                    var musics = $(obj.selector.musiclist).children();
                    //num--
                    obj.data.nowplay--;
                    if(obj.data.nowplay<0) obj.data.nowplay="musics.length-1;" set music $(obj.selector.musiclist).attr("src",$(musics[obj.data.nowplay]).attr("src")); show the name&author $(obj.selector.musictext).html( $(musics[obj.data.nowplay]).attr("name") +"@" +$(musics[obj.data.nowplay]).attr("author") ); ok play it $(obj.selector.musiclist)[0].play(); }, musicnext: function (type) { start $(obj.selector.play).hide(); $(obj.selector.pause).show(); get list var musics="$(obj.selector.musiclist).children();" num++ obj.data.nowplay++; if(obj.data.nowplay>=musics.length)
                      obj.data.nowplay=0;
                    //set music
                    $(obj.selector.musiclist).attr("src",$(musics[obj.data.nowplay]).attr("src"));
                    //show the name&author
                    $(obj.selector.musictext).html(
                      $(musics[obj.data.nowplay]).attr("name")
                      +"@"
                      +$(musics[obj.data.nowplay]).attr("author")
                      );
                    //ok play it
                    $(obj.selector.musiclist)[0].play();
              },
              timesync:function(){
                var timecheck = window.setInterval(function(){

                    var audios=$(obj.selector.musiclist);
                    //calculate the time
                    var total=audios[0].duration;
                    var now=audios[0].currentTime;
                    obj.data.time[0]=now;
                    
                    var minuteTotal=Math.floor(total/60)>9?Math.floor(total/60):"0"+Math.floor(total/60);
                    var secondTotal=Math.floor(total%60)>9?Math.floor(total%60):"0"+Math.floor(total%60);
                  
                    var minuteNow=Math.floor(now/60)>9?Math.floor(now/60):"0"+Math.floor(now/60);
                    var secondNow=Math.floor(now%60)>9?Math.floor(now%60):"0"+Math.floor(now%60);
                    
                     //sync progress bar
                    var audiopro=$(obj.selector.musicprogress);
                    var widthpx=audiopro.css("width");
                    widthpx = $('#musiclist').css("width");
                    var w=parseInt(widthpx);
                    // console.log(now/total*w);
                    audiopro.animate({width:now/total*100});
                    audiopro.attr("aria-valuenow",now/total);
                    //sync time
                    $(obj.selector.musictime).html(minuteNow+":"+secondNow+"/"+minuteTotal+":"+secondTotal);
                    
                },1000);
              }
            },
            init: function () {
              this.events();
            }
          };
          obj.init();
}() </0)>