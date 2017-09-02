/**
 *  music HTML5 Audio 
 * 
 */
;(function(global, factory){
    //检查上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function';
    //检查上下文是否为node
    var hasExports = typeof module !== 'undefined' && module.exports;

    if(hasDefine) {
        // AMD环境或CMD环境
        define(factory);
    }else if(hasExports) {
        //定义为node模块commonJs
        module.exports = factory();
    }else {
        //将模块的执行结果放在window变量中，浏览器中指向window对象
        this[global] = factory();
    }
})('Music', function() {
    'use strict';

    function Music(parent, list) {
        this.box = parent;
        this.musicList = list;
        this.musicIndex = 0;
        this.init();
        this.bind();
       // this.start();       
    }
    //播放或者暂停
    Music.prototype = {
        init: function() {
            this.prevBtn = this.getElement('.back');
            this.nextBtn = this.getElement('.forward');
            this.playBtn = this.getElement('.play');

            this.title = this.getElement('.title');
            this.auther = this.getElement('.auther');
            this.time = this.getElement('.time');

            this.progressBar = this.getElement('.bar');
            this.progressNow = this.getElement('.progress-now');

            this.icon = this.playBtn.querySelector('.fa');
            

            this.rangeBtn = this.getElement('.range');

            this.play_modeBtn = this.getElement('.play_mode');


            //创建一个Audio对象
            this.audio = new Audio();
            //设置自动播放
            // this.audio.autoplay = true;
            // 获取播放列表，并加装第一首歌
            this.loadMusic(this.musicList[this.musicIndex]);
        },
        loadMusic: function(item) {
            this.audio.src = item.src;
            this.title.innerText = item.title;
            this.auther.innerText = item.auther; 
        },
        next: function() {
            this.musicIndex++;
            this.musicIndex = (this.musicIndex % this.musicList.length);
            this.loadMusic(this.musicList[this.musicIndex]);
            if(this.isPlay(this.icon)) {
                this.audio.autoplay = false;
            }else {
                this.audio.autoplay = true;
            };
        },
        prev: function() {
            this.musicIndex--;
            this.musicIndex = (this.musicIndex + this.musicList.length) % this.musicList.length;
            this.loadMusic(this.musicList[this.musicIndex]);
            //检查是否播放按钮状态
            if(this.isPlay(this.icon)) {
                this.audio.autoplay = false;
            }else {
                this.audio.autoplay = true;
            };
        },
        play: function() {            
            if(this.isPlay(this.icon)) {
                this.audio.play();
            }else {
                this.audio.pause();
            }
            this.icon.classList.toggle('fa-play');
            this.icon.classList.toggle('fa-pause');
        },
        isPlay: function() {       
            if(this.icon.classList.contains('fa-play')) {
               return true;
            }else {
               return false;
            }
        },
        bind: function() {
            var self = this;

            this.playBtn.onclick = function() {
                self.play();
            }

            this.prevBtn.onclick = function() {
                self.prev();
            }
         
            this.nextBtn.onclick = function() {
                self.next();
            }

            this.rangeBtn.onchange = function() {
                self.audio.volume = this.value/100; 
            }

            this.play_modeBtn.onclick = function() {
                var modes = self.play_modeBtn.querySelector('.fa');              
                modes.classList.toggle('fa-random');
                modes.classList.toggle('fa-reorder');
                
            }

            this.progressBar.onclick = function(e) {
                var pro = e.offsetX / parseInt(getComputedStyle(this).width);
                self.audio.currentTime = pro * self.audio.duration;
                self.progressNow.style.width = pro * 100 + '%';
            }

            this.audio.onplaying = function() {
                this.timer = setInterval(function() {
                    updateProgess();                               
                }, 1000)
            }

            this.audio.onended = function() {
                var modes = self.play_modeBtn.querySelector('.fa');
                if(modes.classList.contains('fa-random')) {
                    //随机播放
                    self.musicIndex = Math.floor(Math.random() * self.musicList.length);
                    self.loadMusic(self.musicList[self.musicIndex]);
                     if(self.isPlay(this.icon)) {
                        self.audio.autoplay = false;
                    }else {
                        self.audio.autoplay = true;
                    };
                }else{
                    //顺序模式
                    self.next();
                }
             
            }

            this.audio.onpause = function() {
                clearInterval(this.timer);
            }

            //更新进度和时间
           function updateProgess() {   
                var parent = (self.audio.currentTime / self.audio.duration) *100 + '%';
                self.progressNow.style.width = parent;
                var minutes = parseInt(self.audio.currentTime / 60, 10);
                var seconds = parseInt(self.audio.currentTime % 60, 10) +'';
                seconds = seconds.length == 2 ? seconds : '0' + seconds;
                self.time.innerText = minutes + ':' + seconds;
            }

        },
        start: function() {
            this.audio.play();
        },
        getElement: function(cls) {
            return this.box.querySelector(cls);
        }
    }

    return Music;
});
