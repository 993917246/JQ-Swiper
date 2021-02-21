
function Swiper(options,_this) {
  this.width = options.width || 500
  this.height = options.height || 400
  this.timer = options.timer || 2000
  this.showSpots = options.showSpots ? true : false
  this.type = options.type || 'fade'
  this.isAuto = options.isAuto ? true : false
  this.btnStatus = options.btnStatus ? options.btnStatus : 'always'
  this.spotsPosition = options.spotsPosition ? options.spotsPosition : 'left' 
  this._this = _this
  this.list = options.list
  this.len = options.list.length
  //当前index
  this.newIndex = 0
  //定时器
  this.timers = null
  //点击上锁  还没写
  this.flag = true
}

Swiper.prototype.init = function () {
  //渲染css
  this.initSyle()
  //插入按钮
  this.initBtn()
  //插入下方小圆点
  this.initSpots()
  //绑定事件
  this.addEvent()
  //开启自动轮播
  if (this.isAuto) {
    this.autoChange()
  }
}

//绑定事件
Swiper.prototype.addEvent = function () {
  let that = this

  //鼠标进入窗体关闭轮播图定时器
  $(this._this).mouseenter(item => {
    clearInterval(this.timers)
  }).mouseleave(item => {
    if (this.isAuto) {
      this.autoChange()
    }
  })

  //btn点击事件
  $('#swiper .swiperBtn .left').click(item => {
    this.toLeft()
  }).siblings('.right').click(item => {
    this.toRight()
  })

  //下方小圆点hover事件
  $('#swiper .spots span').mouseenter(function () {
    let index = $(this).index()
    that.newIndex = index
    that.move()
  })
}


//向左滑动
Swiper.prototype.toLeft = function () {
  //点击向左滚动
  this.newIndex = this.newIndex == '0' ? this.len - 1 : this.newIndex - 1
  if (this.type == 'animate') {
    if (this.newIndex == this.len - 1 ) {
      $('#swiper ul').css({
        transition : 'none',
        transform : `translateX(${-(this.len * this.width)}px)`,
      })
    }
  }
  setTimeout(() => {
    this.move()
  }, 0);
}

//向右滑动
Swiper.prototype.toRight = function () {
  //点击向右滚动
  if (this.type == 'animate') {
    if (this.newIndex == this.len) {
      $('#swiper ul').css({
        transition : 'none',
        transform : 'translateX(0px)',
      })
    }
  }
  this.newIndex = this.newIndex == this.len ? 1 : this.newIndex + 1
  //解决css延迟覆盖问题
  setTimeout(() => {
    this.move()
  }, 0);
}

//渲染滚动
Swiper.prototype.move = function () {
  if (this.type == 'animate') {
    $('#swiper ul').css({
      transition : 'all 300ms',
      transform: `translateX(${-(this.newIndex * this.width)}px)`
    })
  }else if (this.type == 'fade') {
    $('#swiper ul li').eq(this.newIndex).fadeIn().siblings().fadeOut()
  }
  
  $('#swiper .spots span').eq(this.newIndex % this.len).addClass('active').siblings().removeClass('active')
}

//插入下方小圆点
Swiper.prototype.initSpots = function () {
  let str = $(`<div class = 'spots'></div>`)
  this.list.each(item => {
    str.append($('<span></span>'))
  })
  str.find('span').eq(0).addClass('active')
  
  //是否显示
  if (!this.showSpots) {str.hide()}

  //html中插入远点
  this._this.append(str)

  //小圆点的位置
  switch (this.spotsPosition) {
    case 'right':
      str.css({
        left : this.width - str.width() - 20
      })
      break
    case 'center' : 
      str.css({
        left : 0,
        right : 0,
        textAlign: 'center'
      })
  }
}

//插入left right 按钮
Swiper.prototype.initBtn = function () {
  let str = $(`<div class="swiperBtn">
              <div class="btn left">&#xe610;</div>
              <div class="btn right">&#xe64a;</div>
            </div>`)

  //按钮的显示状态
  switch (this.btnStatus) {
    case 'always':
      str.find('.btn').css({
        opacity : .2
      })
      break;
    case 'hide' :
      str.hide()
      break;
  }

  $(this._this).append($(str))
  
}

//初始化样式
Swiper.prototype.initSyle = function () {
  this._this.css({
    width : this.width,
    height : this.height
  }).find('ul').css({
    width : this.width * (this.len + 1),
    height : this.height
  }).find('li').css({
    width : this.width,
    height : this.height
  }).addClass(this.type)
  //克隆第一张插入到最后
  this.list.eq(0).clone().appendTo($('#swiper ul'))
}


//定时轮播
Swiper.prototype.autoChange = function () {
  this.timers = setInterval(() => {
    this.toRight()
  }, this.timer);
}

$.fn.extend({
  swiper(options) {
    let obj = new Swiper(options,this)
    obj.init()
  }
})