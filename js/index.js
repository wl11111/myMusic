//生成li歌曲列表
var uls = document.getElementsByClassName('center-info')[0];//歌曲列表ul center
var lis = uls.getElementsByClassName('list');

//歌词列表高度控制
var info=document.getElementsByClassName('center-info')[0];
var scrollBox = document.getElementById('scroll-box');
var scrollDray = document.getElementById('scroll-dray');
var infoList = document.getElementById('info-list');

var str='';
//初始化数据
var n=0;
var nowData=data;
var singData=nowData;
var hismusic=[];
var arrmusic=[];
//执行
showSing(singData);


//左边列表
var nav =document.getElementsByClassName('nav')[0];
var navLis=nav.getElementsByTagName('li');
navLis[0].className='active';
var hisIndex=0;
for(var i=0; i<navLis.length; i++){
	navLis[i].index=i;
	navLis[i].onclick=function(){
		for(var i=0; i<navLis.length; i++){
			navLis[i].className='';
		}
		navLis[this.index].className='active';
		if(navLis[0].className=='active'){
			singData=nowData;
			showSing(singData);
			numm.innerHTML = '('+singData.length+')';
			//判断是否显示滚动条
			showScroll()
			curDel(nowData);//删除当前
			playFn();//播放当前
			curFn();//收藏
			nowData.forEach(function(a,b){
				//歌曲高亮
				if(a.name==title.innerHTML){
					lis[b].classList.add('active');
				}
				if(!ad.paused){
					playingImg[n].getElementsByTagName('img')[0].src='img/playing2.gif';
					playingImg[n].style.display='inline-block';
				}else{
					playingImg[n].getElementsByTagName('img')[0].src='img/paused.png';
					playingImg[n].style.display='inline-block';
				}
				//如果歌曲有收藏，显示被收藏的歌曲状态
				arrmusic.forEach(function(c){
					if(c.name==a.name){
						likeimg[b].src = "img/25.png";
						likeimg[b].style.display =  'inline-block';
						likeimg[b].likeOnOff = true;
					}
				})
			})
		}
		if(navLis[1].className=='active'){
			singData=hismusic;
			showSing(singData);
			numm.innerHTML = '('+singData.length+')';
			//判断是否显示滚动条
			showScroll()
			//播放历史的播放按钮
			playActive(hismusic);
			
			//点击 播放历史 里的 删除 按钮
			singleDel(hismusic);
			
			//隐藏收藏
			for(var i=0; i<likeimg.length; i++){
				likeimg[i].style.display='none';
			}
		}
		//收藏
		if(navLis[2].className=='active'){
			singData=arrmusic;
			showSing(singData);
			numm.innerHTML = '('+singData.length+')';
			//判断是否显示滚动条
			showScroll()
			//我的收藏的播放按钮
			playActive(arrmusic);
			//隐藏收藏按钮
			for(var i=0; i<likeimg.length; i++){
				likeimg[i].style.display='none';
			}
			//删除当前
			singleDel(arrmusic);
		}
	}
}
//歌曲列表渲染函数
function showSing(singData){
	str='';
	uls.innerHTML='';
	//生成li歌曲名列表
	var nn = 1;
	//uls.innerHTML='';
	singData.forEach(function(a){
		str += `<li class="list clearfix">
		<div class="song">
			<input type="checkbox" name="" id="" class="check" value="" />
			<span class="number">${nn++}</span>
			<b class="play-btn"></b>
			<strong>
				<img src=""/>
			</strong>
			<a class="song-name">${a.name}</a>
		</div>
		<div class="singer">
			<a>${a.singer}</a>
		</div>
		<div class="songs">
			<a>${a.album}</a>
			<img class="likeimg" src="img/collect.png"/>
			<img class="del1" src="img/9.png"/>
		</div>
		</li>`;
	})
	uls.innerHTML += str;
}


var check = uls.getElementsByClassName('check');
var checkall = document.getElementsByClassName('checkall')[0];
var numm = document.getElementById('numm');
numm.innerHTML = '('+singData.length+')';
for(var i=0;i<check.length;i++){
	check[i].onclick =function(){
		var num = 1;
		for(var i=0;i<check.length;i++){
			num*=check[i].checked;
		}
		if(num){
			checkall.checked =true;
		}else{
			checkall.checked =false;
		}
	}	
}

checkall.onclick = function(){
	if(this.checked){
		for(var i=0;i<check.length;i++){
			check[i].checked = true;
		}
	}else{
		for(var i=0;i<check.length;i++){
			check[i].checked = false;
		}	
	}
}
//删除
allDel(nowData);
function allDel(nowData){
var del = document.getElementsByClassName('del')[0];
var numbers = document.getElementsByClassName('number');
	del.onclick=function(){
		for(var i=0; i<check.length; i++){
			if(check[i].checked){
				//正在播放时才执行
				if(navLis[0].className=='active'){
					if(check[n].checked){
						if(!ad.paused){
							//当删除正在播放的数据时,默认播放第一首
							n=0;
							changeMusic(n);//渲染歌曲
							ad.play();
							nowPlayGif();
						}else{
							n=0;
							changeMusic(n);//渲染歌曲
						}
					}
					uls.removeChild(check[i].parentNode.parentNode);
					nowData.splice(i,1);
					if(i<n){
						n--;
					}
					numm.innerHTML = '('+nowData.length+')';
					
					//判断是否显示滚动条
					showScroll();
				}
				//历史播放时才执行
				if(navLis[1].className=='active'){
					uls.removeChild(check[i].parentNode.parentNode);
					hismusic.splice(i,1);
					numm.innerHTML = '('+hismusic.length+')';
					//判断全选
					if(hismusic.length==0){
						checkall.checked=false;
					}
				}
				//收藏的时候才执行
				if(navLis[2].className=='active'){
					uls.removeChild(check[i].parentNode.parentNode);
					arrmusic.splice(i,1);
					numm.innerHTML = '('+arrmusic.length+')';
					//判断全选
					if(arrmusic.length==0){
						checkall.checked=false;
					}
				}
				
				i--;
			}
		}
		playFn();
		//排序
		var numbers=document.getElementsByClassName('number');
		for(var i=0;i<numbers.length;i++){
			numbers[i].innerHTML=i+1;
		}
		
		if(nowData.length==0){
			checkall.checked=false;
			ad.pause();
			playBegin.src='img/pause.png';
			//留声机部分
			playJp.classList.add('cd-zt');
			playCd.classList.remove('zt');
			playCd.classList.add('tin');
			playing.style.backgroundImage='url(img/spectra.png)';
		}
	}
}
var checksong = [];
for(var i=0;i<check.length;i++){
	if(check[i].checked){
		checksong.push(lis[i])
	}
}


//点击收藏 
var playLis=document.getElementsByClassName('list');
var likeimg=document.getElementsByClassName('likeimg');
curFn();
function curFn(){
	for(var i=0; i<playLis.length; i++){
		likeimg[i].likeOnOff=false;
		likeimg[i].onclick=function(){
			_this = this;
			if(!this.likeOnOff){
				this.src='img/25.png';
				this.style.display='inline-block';
				this.likeOnOff=true;
				//添加收藏列表数据
				nowData.forEach(function(a){
					if(a.name==_this.parentNode.parentNode.firstElementChild.lastElementChild.innerHTML){
						if(!arrmusic.some(function(b){
							return b.name == _this.parentNode.parentNode.firstElementChild.lastElementChild.innerHTML;
						})){
							arrmusic.push(a);
						}
					}
				})
			}else{
				this.src='img/5.png';
				this.style.cssText='';
				this.likeOnOff=false;
				arrmusic.forEach(function(a,b){
					if(a.name==_this.parentNode.parentNode.firstElementChild.lastElementChild.innerHTML){
						arrmusic.splice(b,1);
					}
				})
			}
		}
	}
}
//li右侧删除图标---正在播放
curDel(nowData);
function curDel(nowData){
	var del1 = uls.getElementsByClassName('del1');
	for(var i=0; i<del1.length; i++){
		del1[i].index=i;
		del1[i].onclick=function(){
			nowData.splice(this.index,1);
			uls.removeChild(this.parentNode.parentNode);
			curDel(nowData);
			playFn();
			//判断是否显示滚动条
			showScroll();
			
			//排序
			var numbers=document.getElementsByClassName('number');
			for(var i=0;i<numbers.length;i++){
				numbers[i].innerHTML=i+1;
			}
			numm.innerHTML = '('+nowData.length+')';
			if(playLis.length){
				if(!ad.paused &&(!playLis[0].classList.contains('active')) && (this.parentNode.parentNode.firstElementChild.lastElementChild.innerHTML==title.innerHTML)){
					//当删除正在播放的数据时,默认播放第一首
					n=0;
					changeMusic(n);//渲染歌曲
					ad.play();
					nowPlayGif();
				}else{
					if(this.index<n){
						n--;
					}
				}
				if(ad.paused &&(!playLis[0].classList.contains('active')) && (this.parentNode.parentNode.firstElementChild.lastElementChild.innerHTML==title.innerHTML)){
					n=0;
					changeMusic(n);//渲染歌曲
				}
			}			
		}
	}
	if(nowData.length==0){
		checkall.checked=false;
		ad.pause();
		playBegin.src='img/pause.png';
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
//播放历史(收藏列表) 点击音乐里的删除按钮函数
function singleDel(hismusic){
	var del1 = uls.getElementsByClassName('del1');
	for(var i=0;i<del1.length;i++){
		del1[i].index = i;
		del1[i].onclick = function(){
			var _this = this;
			hismusic.forEach(function(a,b){
				if(a.name==_this.parentNode.parentNode.firstElementChild.lastElementChild.innerHTML){
					hismusic.splice(b,1);
					uls.removeChild(_this.parentNode.parentNode);
					numm.innerHTML = '('+hismusic.length+')';
				}
			})
		}
	}
}

//刷新页面
var like=document.getElementsByClassName('like')[0];
like.onclick=function(){
	location.reload();
}

//播放历史(收藏列表)的播放按钮函数
function playActive(activeData){
	for(var i=0; i<playBtn.length; i++){
		playBtn[i].index=i;
		playBtn[i].onclick=function(){
			var _this=this;
			nowData.forEach(function(a,b){
				if(a.name==_this.parentNode.lastElementChild.innerHTML){
					n=b;
				}
			})
			//正在播放列表没有此歌曲，就添加
			if(!nowData.some(function(a){
				return a.name==_this.parentNode.lastElementChild.innerHTML;
			})){
				nowData.unshift(activeData[_this.index]);
				n=0;
				changeMusic(n);
			}
			ad.src = 'music/' +nowData[n].singer+ '/' +nowData[n].album+ '/' +nowData[n].name+ '.' +nowData[n].format;//歌曲文件
			singer.src = 'music/' +nowData[n].singer+ '/' +nowData[n].album+ '/' + 'album.jpg';//专辑封面
			playSing.innerHTML=nowData[n].name;//歌曲名
			playSinger.innerHTML= ' &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;'+nowData[n].singer;//歌手名
			showLyc(word,nowData[n].lyric);//歌词文件
			title.innerHTML = nowData[n].name;//title名
			dian1.style.left = 0;//播放条初始位置
			var playBegin = document.getElementById('play-begin');
			playBegin.src='img/16.png';
			ad.play();
			playing.style.backgroundImage='url(img/playing.gif)';
			//点击收藏里的播放按钮，向播放历史里添加歌曲
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
	}
	for(var i=0;i<check.length;i++){
		check[i].onclick =function(){
			var num = 1;
			for(var i=0;i<check.length;i++){
				num*=check[i].checked;
			}
			if(num){
				checkall.checked =true;
			}else{
				checkall.checked =false;
			}
		}	
	}
		
}

//歌词列表高度控制
var maxH = infoList.scrollHeight-infoList.clientHeight;
//判断是否显示滚动条
showScroll();
scrollDray.onmousedown = function(ev){
	ev.preventDefault();
	var oldY = ev.clientY-this.offsetTop;
	document.onmousemove = function(ev){
	var y = ev.clientY-oldY;
	var maxY = scrollBox.clientHeight-scrollDray.offsetHeight;
	if(y<0){
		y = 0;
	}
	if(y>maxY){
		y = maxY;
	}
	scrollDray.style.top = y +'px';
	var scale = y/maxY;
	
	info.style.top = -maxH*scale+'px';

	}
	document.onmouseup = function(){
		document.onmousemove = document.onmouseup = null;
	}
}

//判断是否显示滚动条
function showScroll(){
	var infoH=info.scrollHeight;
	if(infoH>410){
		info.style.height='410px';
		scrollBox.style.display='block';
	}else{
		scrollBox.style.display='none';
	}
}
