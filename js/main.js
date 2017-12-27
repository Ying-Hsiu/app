$(document).ready(function() {
	var canvas,stage;
    canvas = document.getElementById('myCanvas')
    canvas.height = $(document).height();
    canvas.width = $(document).width();
    stage = new createjs.Stage(canvas);
    
    var startTime = new Date().getTime();

    var stageHeight,stageWidth,blockHeight;
    stageHeight = $(document).height();
    stageWidth = $(document).width();

    var leader={
            face:"",
            body:"",
            hair:"",
            dialog:""
        },
        follower={
            face:"",
            body:"",
            hair:"",
            dialog:""
        }
    var characterHeight = 128;
    var characterWidth = 75;

    function setup() {
        //建立跑步的人物所需的sprite
        body = new createjs.SpriteSheet({
            images: ['asset/body.png'],
            frames: { height: 128, count: 10, width: 76.05 }
            // animations:{run:[0,3]} /* 這段用途??? */
        })
        face = new createjs.SpriteSheet({
            images: ['asset/face.png'],
            frames: { height: 128, count: 7, width: 76.05 }
        })
        hair = new createjs.SpriteSheet({
            images: ['asset/hair.png'],
            frames: { height: 128, count: 7, width: 76.05 }
        })
        dialog = new createjs.SpriteSheet({
            images: ['asset/dialog.png'],
            frames: { height: 128, count: 6, width: 76.05 }
        })

        follower.body = new createjs.Sprite(body);
        follower.body.x = 0;
        follower.body.y = 0;
        stage.addChild(follower.body);

        follower.face = new createjs.Sprite(face);
        follower.face.x = 0;
        follower.face.y = 0;
        follower.face.gotoAndStop(4);
        stage.addChild(follower.face);

        follower.hair = new createjs.Sprite(hair);
        follower.hair.x = 0;
        follower.hair.y = 0;
        follower.hair.gotoAndStop(1);
        stage.addChild(follower.hair);

        follower.dialog = new createjs.Sprite(dialog);
        follower.dialog.x = 0;
        follower.dialog.y = 0;
        stage.addChild(follower.dialog);

        leader.body = new createjs.Sprite(body);
        leader.body.x = 0;
        leader.body.y = 0;
        stage.addChild(leader.body);

        leader.face = new createjs.Sprite(face);
        leader.face.x = 0;
        leader.face.y = 0;
        leader.face.gotoAndStop(6);
        stage.addChild(leader.face);

        leader.hair = new createjs.Sprite(hair);
        leader.hair.x = 0;
        leader.hair.y = 0;
        leader.hair.gotoAndStop(0);
        stage.addChild(leader.hair);

        //播放人物跑步效果
        leader.body.stop();
        follower.body.stop();
        follower.dialog.gotoAndStop(5);

        //调用tick方法
    	createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", tick);
        stage.update();
    }

    function tick(event) {
        var tickXL = stage.mouseX - leader.body.x - characterWidth/2,
            tickYL = stage.mouseY - leader.body.y - characterHeight/2,
            tickXF = stage.mouseX - follower.body.x - characterWidth/2,
            tickYF = stage.mouseY - follower.body.y - characterHeight/2;
        
        var absX = Math.abs(leader.body.x-follower.body.x),
            absY = Math.abs(leader.body.y-follower.body.y);


        tickXL < 10 && tickYL < 10 ? leader.body.gotoAndStop(0) : leader.body.play();
        absX<100 && absY<100 ? follower.body.gotoAndStop(0) : follower.body.play();

        if (tickXL > 0) { //move Right
            if (leader.body.scaleX < 0) {
                leader.body.scaleX *= -1; //翻轉圖片方向
                leader.body.x -= 75;
                leader.face.scaleX *= -1; //翻轉圖片方向
                leader.face.x -= 75;
                leader.hair.scaleX *= -1; //翻轉圖片方向
                leader.hair.x -= 75;
            }
        } else {
            if (leader.body.scaleX > 0) {
                leader.body.scaleX *= -1; //翻轉圖片方向
                leader.body.x += 75;
                leader.face.scaleX *= -1; //翻轉圖片方向
                leader.face.x += 75;
                leader.hair.scaleX *= -1; //翻轉圖片方向
                leader.hair.x += 75;
            }
        }

        if (leader.body.x-follower.body.x > 0) { //move Right
            if (follower.body.scaleX < 0) {
                follower.body.scaleX *= -1; //翻轉圖片方向
                follower.body.x -= 75;
                follower.face.scaleX *= -1; //翻轉圖片方向
                follower.face.x -= 75;
                follower.hair.scaleX *= -1; //翻轉圖片方向
                follower.hair.x -= 75;
            }
        } else {
            if (follower.body.scaleX > 0) {
                follower.body.scaleX *= -1; //翻轉圖片方向
                follower.body.x += 75;
                follower.face.scaleX *= -1; //翻轉圖片方向
                follower.face.x += 75;
                follower.hair.scaleX *= -1; //翻轉圖片方向
                follower.hair.x -= 75;
            }
        }

        if(absX <= 100 && absY <= 100){
            if(follower.dialog.currentFrame == 4)
                follower.dialog.gotoAndPlay(2);
            else
                follower.dialog.play();
        }else if(absX < 200 && absY < 200){
            follower.dialog.gotoAndStop(0);
        }else{
            follower.dialog.gotoAndStop(6)
        }


        leader.body.x += tickXL * 0.05;
        leader.body.y += tickYL * 0.05;
        if( Math.abs(leader.body.x-follower.body.x)>100 || Math.abs(leader.body.y-follower.body.y)>100 ){
		    follower.body.x += tickXF * 0.01;
		    follower.body.y += tickYF * 0.01;
            follower.face.gotoAndStop(1);
            leader.face.gotoAndStop(6);
        }else if( Math.abs(leader.body.x-follower.body.x)<120 || Math.abs(leader.body.y-follower.body.y)<120 ){
            follower.face.gotoAndStop(3);
            leader.face.gotoAndStop(5);
        }

        leader.face.x = leader.body.x;
        leader.face.y = leader.body.y;
        leader.hair.x = leader.body.x;
        leader.hair.y = leader.body.y;

        follower.face.x = follower.body.x;
        follower.face.y = follower.body.y;
        follower.hair.x = follower.body.x;
        follower.hair.y = follower.body.y;

        follower.dialog.x = follower.body.x + 50 * follower.body.scaleX;
        follower.dialog.y = follower.body.y - 50;

        stage.update();
    }

    setup();
})