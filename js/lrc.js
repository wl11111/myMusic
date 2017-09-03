/*		showLyc(word,text);歌词同步函数；
				 		word:歌词块的div的id;
						text:传入的歌词文本,string
			 * */
//初始化第一首歌曲
var title = document.getElementsByTagName('title')[0];
var pres = document.getElementById('pres');
var word = document.getElementById('word');
title.innerHTML = singData[0].name;
//歌词向上滚动距离
var lh = 30;
//封装函数，处理歌词文本，得到歌词的二位数组
function parseLyric(text){
	//把文本分成一行一行存入数组
	var lines = text.split('\n');
	//用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
	var pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
	//保存最终结果的数组    
	var result = []; 
	//去掉不含时间的行    
	while (!pattern.test(lines[0])) {    
		lines = lines.slice(1);    
	};
	//上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉    
	lines[lines.length - 1].length === 0 && lines.pop();
	lines.forEach(function(a){
		//提取出时间[xx:xx.xx]
		var time = a.match(pattern);
		//提取歌词    
		var lyc = a.replace(pattern,'');
		//因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
		time.forEach(function(a1){
			//去掉时间里的中括号得到xx:xx.xx 
			var t = a1.slice(1,-1).split(':'); 
			//将结果放入最终数组    
			result.push([parseInt(t[0],10)*60 + parseFloat(t[1]),lyc]);
		})
	})
	//去除时间后为空歌词的项(执行2次)
	for(var i=0;i<2;i++){
		result.forEach(function(a,b){
			if(a[1]==''){
				result.splice(b,1);
			}
		})
	}
	//最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
	result.sort(function(a,b){    
		return a[0] - b[0];    
	});
	return result;
}
//当歌曲播放时，监听audio标签的ontimeupdate事件，即时更新显示歌词到页面；
//封装函数，获得歌词，并显示在页面上
function showLyc(word,text){
	var onOff = false;
	//清除歌词内容
	ul.innerHTML = '';
	ul.style.top = 0;
	var lyric = parseLyric(text);
	//ul内显示歌词
	for(var i=0;i<lyric.length;i++){
		/*var li = document.createElement('li');
		li.innerHTML = lyric[i][1];
		ul.appendChild(li);*/
		ul.innerHTML += '<li>'+lyric[i][1]+'</li>';
	}
	//获取放有每句歌词的li元素
	var lycLis = ul.getElementsByTagName('li');
	//监听ontimeupdate事件
	ad.ontimeupdate = function(){
		//判断播放完毕,切换下一首
		var songName = title.innerHTML;
		if(parseInt(this.currentTime)==parseInt(this.duration)-1){
			ul.style.top = 0;
		}
		//遍历所有歌词，看哪句歌词的时间与当前时间吻合
		for(var i=0;i<lyric.length;i++){
			if(this.currentTime /*当前播放的时间*/ > lyric[i][0]){
				//加类名高亮显示当前歌词
				if(!onOff){
					//清除歌词样式
					for(var j=0;j<lycLis.length;j++){
						lycLis[j].className = '';
					}
					if(lycLis[i]){
						lycLis[i].className = 'active';
					}
					//歌词向上滚动
					if(i>=5){
						ul.style.top = -(i-5)*lh+'px';
						var h=0;
						for(var j=0;j<i;j++){
							if(lycLis[j].offsetHeight>30){
								h++;
								ul.style.top = -(i-5)*lh-h*30+'px';
							}
						}
					}
				}
			}
		}
	}
	//拖拽
	drag(ul);
	//拖拽改变播放进度函数
	function drag(obj){
		obj.onmousedown = function(ev){
			ev.preventDefault();
			//进度线出现
			pres.style.background = '#ccc';
			for(var i=0;i<lycLis.length;i++){
				//检测是否碰到进度线
				if(duang(pres,lycLis[i])){
					//歌词高亮
					lycLis[i].className = 'active';
				}else{
					lycLis[i].className = '';
				}
			}
			//暂停播放
			//ad.pause();
			onOff = true;
			var oldY = ev.clientY+word.getBoundingClientRect().top;
			var pos = obj.getBoundingClientRect();
			word.onmousemove = function(ev){
				if(onOff){
					var t = 0;
					var newY = ev.clientY;
					t = newY-(oldY-pos.top);
					//限制歌词拖动距离
					if(t>166){
						t = 166;
					}
					if(t<-obj.offsetHeight+166){
						t = -obj.offsetHeight+166;
					}
					obj.style.top = t + 'px';
					//改变播放进度
					for(var i=0;i<lycLis.length;i++){
						//检测是否碰到进度线
						if(duang(pres,lycLis[i])){
							//歌词高亮
							lycLis[i].className = 'active';
						}else{
							lycLis[i].className = '';
						}
					}
				}
			}
			document.onmouseup = function(){
				if(onOff){
					//设置播放时间
					for(var i=0;i<lycLis.length;i++){
						//检测是否碰到进度线
						if(duang(pres,lycLis[i])){
							//获取歌词时间并设置为播放时间,延迟点时间为了拖动时所有歌词同步
							ad.currentTime = lyric[i][0]+0.0001;
						}
					}
				}
				//继续播放
				//ad.play();
				//进度线消失
				pres.style.background = 'transparent';
				onOff = false;
			}
		}
	}
	var conr = document.getElementsByClassName('content-right')[0];
	conr.onmousedown = function(ev){
		ev.preventDefault();
	}
}
//检测是否碰撞
function duang(obj,obj2){
	var pos1 = obj.getBoundingClientRect();
	var pos2 = obj2.getBoundingClientRect();
	if(!(pos1.right<pos2.left||pos1.left>pos2.right||pos1.bottom<pos2.top||pos1.top>pos2.bottom)){
		return true;
	}else{
		return false;
	}
}




