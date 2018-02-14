var Box = function(x, y, w, h, s) {//Box是背景浮动的光点，属于烘托气氛的。
    /*定义了一堆参数*/
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.a = Math.random() * Math.PI * 2;
    this.hue = Math.random() * 360;
};
Box.prototype = {
    constructor: Box,

    update: function() {
        this.a += Math.random() * 0.5 - 0.25;/*-0.25~0.25*/
        this.x += Math.cos(this.a) * this.s;/*cosa + s?*/
        this.y += Math.sin(this.a) * this.s;/*sina + s?*/
        this.hue += 5;
        /*从另一头钻出来*/
        if(this.x > WIDTH) this.x = 0;
        else if(this.x < 0) this.x = WIDTH;
        if(this.y > HEIGHT) this.y = 0;
        else if(this.y < 0) this.y = HEIGHT;


    },

    render: function(ctx) {/*渲染*/
        ctx.save();
        ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 50%, 1)';
        ctx.translate(this.x, this.y);
        ctx.rotate(this.a);
        ctx.fillRect(-this.w, -this.h / 2, this.w, this.h);
        ctx.restore();
    }
};


var Circle = function(x, y, tx, ty, r) {//这是实现文字的渲染的
    /*定义了一堆参数*/
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.tx = tx;
    this.ty = ty;
    this.lx = x;
    this.ly = y;
    this.r = r;
    this.br = r;
    this.a = Math.random() * Math.PI * 2;
    this.sx = Math.random() * 0.5;
    this.sy = Math.random() * 0.5;
    this.o = Math.random();

    this.delay = Math.random() * 200;
    this.delayCtr = 0;
    this.hue = Math.random() * 360;
};
Circle.prototype = {
    constructor: Circle,

    update: function(){//更新位置
        if(this.delayCtr < this.delay){
            this.delayCtr++;
            return;
        }
        this.hue += 1;
        this.a += 0.1;
        this.lx = this.x;
        this.ly = this.y;
        if(!clickToggle){//一帧一帧聚集
            this.x += (this.tx - this.x) * this.sx;
            this.y += (this.ty - this.y) * this.sy;
        } else {//散开
            this.x += (this.ox - this.x) * this.sx;
            this.y += (this.oy - this.y) * this.sy;
        }
        this.r = this.br + Math.cos(this.a) * (this.br * 0.5);
    },

    render: function(ctx){//渲染
        ctx.save();
        ctx.globalAlpha = this.o;
        ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 90%, 1)';
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if(clickToggle){
            ctx.save();
            ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, 90%, 1)';
            ctx.beginPath();
            ctx.moveTo(this.lx, this.ly);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
            ctx.restore();
        }
    }
};



var txtCanvas = document.createElement('canvas');
var txtCtx = txtCanvas.getContext('2d');
var c = document.getElementById('c');
var ctx = c.getContext('2d');
var WIDTH = c.width = window.innerWidth;
var HEIGHT = c.height = window.innerHeight;
var imgData = null;
var idx = null;
var skip = 8;
var circles = [];
var circle = null;
var a = null;
var clickToggle = false;
var boxList = [];
var box = null;
var counter = 0;

txtCanvas.width = WIDTH;
txtCanvas.height = HEIGHT;
txtCtx.font = '143px Sans-serif';
txtCtx.textAlign = 'left';
txtCtx.baseline = 'middle';
txtCtx.fillText('这是', WIDTH / 5, HEIGHT *1.2/5);
txtCtx.fillText('第一段，', WIDTH / 5, HEIGHT *2.2/5);
txtCtx.fillText('连篇', WIDTH / 5, HEIGHT *3.2/5);
txtCtx.fillText('的骚话。', WIDTH / 5, HEIGHT *4.2/5);
ctx.font = 'bold 12px Monospace';
ctx.textAlign = 'center';
ctx.baseline = 'middle';
imgData = txtCtx.getImageData(0, 0, WIDTH, HEIGHT).data;//把文字转换成图片，其实渲染的是图片对应的坐标啊

/*主体粒子*/
for(var y = 0; y < HEIGHT; y += skip){
    for(var x = 0; x < WIDTH; x += skip){
        idx = (x + y * WIDTH) * 4 - 1;
        if(imgData[idx] > 0){//按imgData选择粒子
            a = Math.PI * 2 * Math.random();
            circle = new Circle(
                WIDTH / 2 + Math.cos(a) * WIDTH,
                HEIGHT / 2 + Math.sin(a) * WIDTH,
                x,
                y,
                Math.random() * 4
            );
            circles.push(circle);
        }
    }
}

/*背景悬浮粒子*/
for(var b = 0; b < 10; b++){
    box = new Box(
        WIDTH * Math.random(),
        HEIGHT * Math.random(),
        5,
        2,
        5 + Math.random() * 5
    );
    boxList.push(box);
}


c.addEventListener('click', function(){
    clickToggle = !clickToggle;
    if(!clickToggle){
        circles = [];//先清空circle盒子
    }
    if(counter === 0 && clickToggle){//再重新刷新文字
        txtCtx.clearRect(0,0,WIDTH,HEIGHT);
        txtCtx.fillText('这是', WIDTH / 5, HEIGHT *1.2/5);
        txtCtx.fillText('第二段，', WIDTH / 5, HEIGHT *2.2/5);
        txtCtx.fillText('。', WIDTH / 5, HEIGHT *3.2/5);
        txtCtx.fillText('。', WIDTH / 5, HEIGHT *4.2/5);
        counter++;
    }
    else if(counter === 1 && clickToggle){
        txtCtx.clearRect(0,0,WIDTH,HEIGHT);
        txtCtx.fillText('第三段', WIDTH / 5, HEIGHT *1.2/5);
        txtCtx.fillText('了', WIDTH / 5, HEIGHT *2.2/5);
        txtCtx.fillText('祝你', WIDTH / 5, HEIGHT *3.2/5);
        txtCtx.fillText('成功。', WIDTH / 5, HEIGHT *4.2/5);
        counter++;

    }
    else if(counter===2 && clickToggle){
        txtCtx.clearRect(0,0,WIDTH,HEIGHT);
        txtCtx.fillText('还是', WIDTH / 5, HEIGHT *1.2/5);
        txtCtx.fillText('第一段，', WIDTH / 5, HEIGHT *2.2/5);
        txtCtx.fillText('周而', WIDTH / 5, HEIGHT *3.2/5);
        txtCtx.fillText('复始。', WIDTH / 5, HEIGHT *4.2/5);
        counter=0;
    }


    imgData = txtCtx.getImageData(0, 0, WIDTH, HEIGHT).data;//保存为图片

    /*主体粒子*/
    for(var y = 0; y < HEIGHT; y += skip){//粒子添加
        for(var x = 0; x < WIDTH; x += skip){
            idx = (x + y * WIDTH) * 4 - 1;
            if(imgData[idx] > 0){
                a = Math.PI * 2 * Math.random();
                circle = new Circle(
                    WIDTH / 2 + Math.cos(a) * WIDTH,
                    HEIGHT / 2 + Math.sin(a) * WIDTH,
                    x,
                    y,
                    Math.random() * 4
                );
                circles.push(circle);
            }
        }
    }
});

/*每当浏览器刷新时调用*/
requestAnimationFrame(function loop(){
    requestAnimationFrame(loop);


    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(20, 20, 20, 0.5)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'white';
    ctx.globalCompositeOperation = 'lighter';
    for(var i = 0, len = circles.length; i < len; i++){
        circle = circles[i];
        circle.update();
        circle.render(ctx);
    }
    for(var j = 0; j < boxList.length; j++){
        box = boxList[j];
        box.update();
        box.render(ctx);
    }

});

