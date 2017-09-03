var ad=document.getElementById('ad');//audio
var playPrev=document.getElementById('play-prev');//上一首
var playBegin=document.getElementById('play-begin');//播放/暂停
var playNext=document.getElementById('play-next');//下一首
var playMode = document.getElementById('play-mode');//播放模式
//列表
var playList=document.getElementsByClassName('center')[0];//歌曲列表盒子
var playLis=playList.getElementsByClassName('list');//歌曲列表
//时间
var time=document.getElementById('time');//当前歌曲时长
var curTime=document.getElementById('cur-time');//当前歌曲播放用时
//当前部分歌曲名/歌手
var playSing=document.getElementById('play-sing');//歌曲名
var playSinger=document.getElementById('play-singer');//歌手名
var singer=document.getElementById('singer');//专辑封面
var playJp=document.getElementsByClassName('cd-jp')[0];//黑胶唱盘
var playCd=document.getElementsByClassName('cd-tou')[0];//黑胶唱臂
var dian1 = document.getElementsByClassName('dian1')[0];//播放进度的点
var playLine = document.getElementsByClassName('line')[0];//播放进度的点
var timer=null;
//鼠标移入时的播放按钮
var playBtn=document.getElementsByClassName('play-btn');
//左侧正在播放
var playing=document.getElementsByClassName('nav')[0].getElementsByTagName('li')[0];
//列表中当前的状态图
var playingImg=playList.getElementsByTagName('strong');



//获取显示歌词的大盒子
var word = document.getElementById('word');
//获取歌词区域
var ul = word.getElementsByTagName('ul')[0];

//控制播放模式（顺序/单曲/随机）
var x = 0;
//播放模式
var playT = ['顺序播放','单曲循环','随机播放'];
var playM = ['loopPlay','singleTC','SequentialPlay']


//当前播放第几个
var n = 0;
//初始化
changeMusic(n);
//暂停/播放
playBegin.onclick = function() {
	if(ad.paused) {
		// 暂停中
		ad.play();
		this.src='img/16.png';
		//调用函数showLyc(word,text);使歌词同步
		showLyc(word,nowData[n].lyric);
		//留声机部分
		playJp.classList.remove('cd-zt');
		playJp.classList.add('cd-play');
		playCd.classList.add('zt');
		playCd.classList.add('tin');
		playing.style.backgroundImage='url(img/playing.gif)';
		if(navLis[0].className=='active'){
			playingImg[n].getElementsByTagName('img')[0].src='img/playing2.gif';
			playingImg[n].style.display='inline-block';
		}
		//添加音乐到 播放历史
		nowData.forEach(function(a){
			if(a.name==title.innerHTML){
				if(!hismusic.some(function(b){
					return b.name == title.innerHTML;
				})){
					hismusic.push(a);
				}
			}
		})
	} else {
		// 播放中
		ad.pause();
		this.src='img/pause.png';
		//留声机部分
		playJp.classList.add('cd-zt');
		playCd.classList.remove('zt');
		playCd.classList.add('tin');
		playing.style.backgroundImage='url(img/spectra.png)';
		if(navLis[0].className=='active'){
			playingImg[n].getElementsByTagName('img')[0].src='img/paused.png';
			playingImg[n].style.display='inline-block';
		}
	}
}

/*---------------------------------------bw [[-----------------------------------------*/
//下一首
playNext.onclick = function() {
	singData = nowData;
	playing.style.backgroundImage='url(img/playing.gif)';
	n = (n+1)%singData.length;//递增
	playBegin.src='img/16.png';//按钮变为播放状态
	changeMusic(n);//渲染歌曲
	ad.play();
	playJp.classList.remove('cd-play');
	playCd.classList.remove('zt');
	playCd.classList.add('tin');
	setTimeout(function(){
		cdPlayStyle();
	},500);
	nowPlayGif();
	//添加音乐到 播放历史
	nowData.forEach(function(a){
		if(a.name==title.innerHTML){
			if(!hismusic.some(function(b){
				return b.name == title.innerHTML;
			})){
				hismusic.push(a);
			}
		}
	})
}
//上一首
playPrev.onclick = function() {
	singData = nowData;
	playing.style.backgroundImage='url(img/playing.gif)';
	n = (n+singData.length-1)%singData.length;//递减
	playBegin.src='img/16.png';//按钮变为播放状态
	changeMusic(n);//渲染歌曲
	ad.play();
	playJp.classList.remove('cd-play');
	playCd.classList.remove('zt');
	playCd.classList.add('tin');
	setTimeout(function(){
		cdPlayStyle();
	},500);
	nowPlayGif();
	//添加音乐到 播放历史
	nowData.forEach(function(a){
		if(a.name==title.innerHTML){
			if(!hismusic.some(function(b){
				return b.name == title.innerHTML;
			})){
				hismusic.push(a);
			}
		}
	})
}

//鼠标移入时的播放按钮
playFn();
function playFn(){
	var playBtn=document.getElementsByClassName('play-btn');
	for(var i=0; i<playLis.length; i++){
		playBtn[i].index=i;
		playBtn[i].onclick=function(){
			n=this.index;
			playBegin.src='img/16.png';//按钮变为播放状态
			changeMusic(n);
			ad.play();
			playing.style.backgroundImage='url(img/playing.gif)';
			//当前播放歌曲的gif
			nowPlayGif();
			//添加音乐到 播放历史
			nowData.forEach(function(a){
				if(a.name==title.innerHTML){
					if(!hismusic.some(function(b){
						return b.name == title.innerHTML;
					})){
						hismusic.push(a);
					}
				}
			})
			//留声机部分
			playJp.classList.remove('cd-zt');
			playJp.classList.add('cd-play');
			playCd.classList.add('zt');
			playCd.classList.add('tin');
		}
	}
}
//渲染染歌曲信息
function changeMusic(n) {
	for(var i=0; i<playLis.length; i++){
		for(var i=0; i<playLis.length; i++){
			playLis[i].classList.remove('active');
			playingImg[i].style.display='none';
		}
		if(navLis[0].className=='active'){
			playLis[n].classList.add('active');//当前播放歌曲高亮
		}
	}
	ad.src = 'music/' +singData[n].singer+ '/' +singData[n].album+ '/' +singData[n].name+ '.' +singData[n].format;//歌曲文件
	singer.src = 'music/' +singData[n].singer+ '/' +singData[n].album+ '/' + 'album.jpg';//专辑封面
	playSing.innerHTML=singData[n].name;//歌曲名
	playSinger.innerHTML= ' &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;'+singData[n].singer;//歌手名
	showLyc(word,singData[n].lyric);//歌词文件
	title.innerHTML = singData[n].name;//title名
	dian1.style.left = 0;//播放条初始位置
	ad.volume = 0.5;//初始音量
	if(navLis[0].className=='active'){
		playingImg[n].getElementsByTagName('img')[0].src='img/paused.png';
		playingImg[n].style.display='inline-block';
	}
}
//播放状态下留声机样式
function cdPlayStyle(){
//留声机部分
	playJp.classList.add('cd-play');
	playCd.classList.add('zt');
	playCd.classList.add('tin');
	playJp.classList.remove('cd-zt');
}

//切换播放模式
playMode.onclick = function() {
    x = (x+1)%3;
    playMode.title = playT[x];
    playMode.src = 'img/' + playM[x] + '.png';
}

//当歌曲播放完成时触发事件，改变播放模式
ad.addEventListener('ended',function() {
	//初始化进度条位置
	dian1.style.left = 0;
    //顺序播放
    if(x == 0) {
        playNext.onclick();
        nowPlayGif();
    //单曲循环
    }else if(x == 1) {
    	changeMusic(n)
        ad.play();   
        nowPlayGif();
    //随机播放
    }else{
        n = Math.floor(Math.random()*playLis.length);
        changeMusic(n);
        ad.play();
        nowPlayGif();
    }     
},false);

/*---------------------------------------]] bw-----------------------------------------*/

//双击播放
//dblPlay();
function dblPlay(){
	for(var i=0; i<playLis.length; i++){
		playLis[i].index=i;
		playLis[i].ondblclick=function(ev){
			n=this.index;
			ev.preventDefault();
			playBegin.src='img/16.png';
			changeMusic(n);
			ad.play();
			playJp.classList.remove('cd-play');
			playCd.classList.remove('zt');
			playCd.classList.add('tin');
			setTimeout(function(){
				cdPlayStyle();
			},500);
			//当前播放歌曲的gif
			nowPlayGif();
		}
	}
	
}
var playVolume=document.getElementById('play-volume');//当前音量
var totalVolume=document.getElementById('total-volume');//总音量
var disX = 0;
var disX2 = 0;

//音量默认left值
var L=parseFloat(getComputedStyle(playVolume).left);
//音量默认
var scale=0.5;
//改变音量大小
playVolume.onmousedown = function(ev) {
	ev.preventDefault();
	disX = ev.clientX - playVolume.offsetLeft;
	document.onmousemove = function(ev) {
		L = ev.clientX - disX;
		if(L < 0) {
			L = 0;
		} else if(L > totalVolume.offsetWidth - playVolume.offsetWidth) {
			L = totalVolume.offsetWidth - playVolume.offsetWidth;
		}
		playVolume.style.left = L + 'px';
		scale = L / (totalVolume.offsetWidth - playVolume.offsetWidth);
		ad.volume = scale;
		if(L==0){
			ad.volume = 0;
			volumeOnOff.src='img/volume-off.png';
		}else{
			volumeOnOff.src='img/23.png';
		}
	};
	document.onmouseup = function(ev) {
		document.onmousemove = null;
		document.onmouseup = null;
	};
};
//点击改变大小
var volumeParent=document.getElementsByClassName('volume-parentNode')[0];
volumeParent.onclick=function(ev){
	L=ev.clientX-this.getBoundingClientRect().left;
	playVolume.style.left = L + 'px';
	scale = L / (totalVolume.offsetWidth - playVolume.offsetWidth);
	if(scale>1){
		scale=1;
	}
	if(scale<0){
		scale=0
	}
	if(scale==0){
		volumeOnOff.src='img/volume-off.png';
	}else{
		volumeOnOff.src='img/23.png';
	}
	ad.volume = scale;
}
//静音
var volumeOnOff=document.getElementById('volume-onOff')
volumeOnOff.onclick = function() {
	if(ad.muted) {
		ad.volume = scale;
		ad.muted = false;
		volumeOnOff.src='img/23.png';
		//添加
		Mtween({
 			el:playVolume,
 			target:{
 				left:L
 			},
 			time:160,
 			fx:'linear'
 		})
	} else {
		ad.volume = 0;
		ad.muted = true;
		volumeOnOff.src='img/volume-off.png';
		Mtween({
 			el:playVolume,
 			target:{
 				left:0
 			},
 			time:160,
 			fx:'linear'
 		})
	}
};
/*---------------------------------------拖动播放（快进、快退）-----------------------------------------*/
//防止覆盖用addEventListener
//	    播放进度时间
ad.addEventListener('timeupdate',function(){
	//当前时间
	curTime.innerHTML=changeTime(ad.currentTime)
	//根据时间改变播放进度
	var scale2 = ad.currentTime/ad.duration;
	dian1.style.left = scale2 * 680 + 'px';
})

//总时间
ad.oncanplay = function() {
	time.innerHTML =changeTime(ad.duration)
}
//播放时间
var disX2=0;
var footerCenter=document.getElementsByClassName('footer-center')[0];//中间播放条部分
dian1.onmousedown = function(ev){
	ev.preventDefault();
	disX2 = ev.clientX - dian1.offsetLeft;
	footerCenter.onmousemove = function(ev){
		ev.preventDefault();
		var ev = ev || window.event;
		var L2 = ev.clientX - disX2;
		if(L2<0){
			L2 = 0;
		}
		else if(L2>playLine.offsetWidth - dian1.offsetWidth){
			L2 = playLine.offsetWidth - dian1.offsetWidth;
		}
		dian1.style.left = L2 + 'px';
		var scale2 = L2/(playLine.offsetWidth - dian1.offsetWidth);
		ad.currentTime = scale2 * ad.duration;
	};
	document.onmouseup = function(){
		footerCenter.onmousemove = null;
	};
}
//点击快进快进
var lineWrap=document.getElementsByClassName('line-wrap')[0];
lineWrap.onclick=function(ev){
	L2=ev.clientX-this.getBoundingClientRect().left;
	dian1.style.left = L2 + 'px';
	var scale3 = L2/(playLine.offsetWidth - dian1.offsetWidth);
	ad.currentTime = scale3 * ad.duration;
}

/*---------------------------------------end-----------------------------------------*/

//处理时间格式
function changeTime(iNum){
	iNum = parseInt( iNum );
	var iM = toZero(Math.floor(iNum%3600/60));
	var iS = toZero(Math.floor(iNum%60));
	return iM + ':' + iS;
	}
//处理小于10的时间格式
function toZero(num){
	return	num<10?'0' + num: '' + num;
}
//当前播放歌曲的gif
function nowPlayGif(){
	for(var i=0; i<playLis.length; i++){
		if(navLis[0].className=='active'){
			playingImg[n].getElementsByTagName('img')[0].src='img/playing2.gif';
			playingImg[n].style.display='inline-block';
		}
	}
}