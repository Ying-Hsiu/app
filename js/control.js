$(document).ready(function() {
    // 舞台設定
    var canvas, stage;
    canvas = document.getElementById('myCanvas')
    canvas.height = $(document).height();
    canvas.width = $(document).width();
    stage = new createjs.Stage(canvas);

    var stageHeight, stageWidth;
    stageHeight = $(document).height();
    stageWidth = $(document).width();

    var fps = 30;
    var status = "normal"; // 1. normal,2. near,3. far
    var distance = "";
    var rand = 0; //隨機種子
    var timer = 0; //  fps 幀/秒
    var positionX = 0,
        positionY = 0;

    // 角色設定
    var leader = {
            items: {
                body: "",
                hand: "",
                hair: "",
                face: "",
                cloth: "",
                dialog: ""
            },
            speed: 0.05,
            turnLeft: false,
            anima:{
                normal_01:function(){ //面無表情+無或問號
                    leader.items["hand"].gotoAndStop(0);
                    leader.items["face"].gotoAndStop(0);
                    leader.items["dialog"].gotoAndStop(rand>0?3:8);
                },
                normal_02:function(){ //笑
                    leader.items["hand"].gotoAndStop(0);
                    leader.items["face"].gotoAndStop(1);
                    leader.items["dialog"].gotoAndStop(8);
                },
                shock_01:function(){ //驚嚇
                    leader.items["hand"].gotoAndStop(0);
                    leader.items["face"].gotoAndStop(2);
                    leader.items["dialog"].gotoAndStop(6);
                },
                shock_02:function(){ //冒汗或翻白眼+刪節號
                    leader.items["hand"].gotoAndStop(2);
                    leader.items["face"].gotoAndStop(rand>0?3:6);
                    if(rand>0){
                        switch (leader.items["dialog"].timer) {
                            case (fps / 3):
                                leader.items["dialog"].gotoAndStop(0)
                                break;
                            case (fps / 2):
                                leader.items["dialog"].gotoAndStop(1)
                                break;
                            case fps:
                                leader.items["dialog"].gotoAndStop(2)
                                leader.items["dialog"].timer = 0 //重置
                                break;
                        }                    
                    }else{
                        leader.items["dialog"].gotoAndStop(7);
                    }
                },
                sign_01:function(){ //嘆氣或翻白眼+閉嘴或生氣
                    leader.items["hand"].gotoAndStop(2);
                    leader.items["face"].gotoAndStop(rand>0?4:6);
                    leader.items["dialog"].gotoAndStop(rand>0?4:7);
                },
                sign_02:function(){ //嘆氣
                    leader.items["hand"].gotoAndStop(0);
                    leader.items["face"].gotoAndStop(4);
                    leader.items["dialog"].gotoAndStop(8)
                }

            }
        },
        follower = {
            items: {
                body: "",
                hand: "",
                hair: "",
                face: "",
                cloth: "",
                dialog: ""
            },
            speed: 0.01,
            turnLeft: false,
            anima:{
                star_01:function(){ //驚訝+星星
                    follower.items["hand"].gotoAndStop(3);
                    follower.items["face"].gotoAndStop(0);
                    switch (follower.items["dialog"].timer) {
                        case (fps / 3):
                            follower.items["dialog"].gotoAndStop(6);
                            break;
                        case (fps / 2):
                            follower.items["dialog"].gotoAndStop(7);
                            break;
                        case fps:
                            follower.items["dialog"].gotoAndStop(8);
                            follower.items["dialog"].timer = 0; //重置
                            break;
                    }
                },
                talk_01:function(){ //講話
                    follower.items["hand"].gotoAndStop(3);
                    if (timer % 5 == 0) {
                        if (timer % 2 == 0) {
                            follower.items["face"].gotoAndStop(1);
                        } else {
                            follower.items["face"].gotoAndStop(2);
                        }
                    }
                    follower.items["dialog"].gotoAndStop(5);
                },
                talk_02:function(){ //微笑或忍住不哭+冒愛心或心碎
                    follower.items["hand"].gotoAndStop(rand>0?3:1);
                    follower.items["face"].gotoAndStop(rand>0?2:3);
                    follower.items["dialog"].gotoAndStop(rand>0?0:1);
                },
                cry_01:function(){ //忍住不哭+驚嘆號
                    follower.items["hand"].gotoAndStop(1);
                    follower.items["face"].gotoAndStop(3);
                    follower.items["dialog"].gotoAndStop(2);
                },
                cry_02:function(){ //大哭+心碎
                    follower.items["hand"].gotoAndStop(1);
                    if (timer % 5 == 0) {
                        if (timer % 2 == 0) {
                            follower.items["face"].gotoAndStop(4);
                        } else {
                            follower.items["face"].gotoAndStop(5);
                        }
                    }
                    follower.items["dialog"].gotoAndStop(1);
                },
                cry_03:function(){ //生氣+心碎
                    follower.items["hand"].gotoAndStop(3);
                    follower.items["face"].gotoAndStop(6);
                    follower.items["dialog"].gotoAndStop(1);
                }

            }
        }

    var characterHeight, characterWidth;
    characterHeight = 150;
    characterWidth = 120;

    function setup() {
        body = new createjs.SpriteSheet({
            images: ['assets/images/body.png'],
            frames: { height: 150, count: 10, width: 120 }
        })

        hand = new createjs.SpriteSheet({
            images: ['assets/images/hand.png'],
            frames: { height: 150, count: 5, width: 120 }
        })

        cloth = new createjs.SpriteSheet({
            images: ['assets/images/cloth.png'],
            frames: { height: 150, count: 10, width: 120 }
        })

        face_shu = new createjs.SpriteSheet({
            images: ['assets/images/shuten_face.png'],
            frames: { height: 150, count: 7, width: 120 }
        })

        face_ibara = new createjs.SpriteSheet({
            images: ['assets/images/ibaraki_face.png'],
            frames: { height: 150, count: 7, width: 120 }
        })

        hair_shu = new createjs.SpriteSheet({
            images: ['assets/images/shuten_hair.png'],
            frames: { height: 150, count: 4, width: 120 }
        })

        hair_ibara = new createjs.SpriteSheet({
            images: ['assets/images/ibaraki_hair.png'],
            frames: { height: 150, count: 4, width: 120 }
        })

        dialog_shu = new createjs.SpriteSheet({
            images: ['assets/images/shuten_dialog.png'],
            frames: { height: 150, count: 10, width: 120 }
        })

        dialog_ibara = new createjs.SpriteSheet({
            images: ['assets/images/ibaraki_dialog.png'],
            frames: { height: 150, count: 10, width: 120 }
        })

        /* =================== ibaraki ===================== */

        follower.items.body = new createjs.Sprite(body);
        stage.addChild(follower.items.body);

        follower.items.hair = new createjs.Sprite(hair_ibara);
        follower.items.hair.gotoAndStop(0);
        stage.addChild(follower.items.hair);

        follower.items.hand = new createjs.Sprite(hand);
        follower.items.hand.gotoAndStop(3);
        stage.addChild(follower.items.hand);

        follower.items.face = new createjs.Sprite(face_ibara);
        follower.items.face.gotoAndStop(0);
        stage.addChild(follower.items.face);

        follower.items.cloth = new createjs.Sprite(cloth);
        follower.items.cloth.gotoAndStop(0);
        stage.addChild(follower.items.cloth);

        follower.items.dialog = new createjs.Sprite(dialog_ibara);
        follower.items.dialog.timer = 0;
        follower.items.dialog.gotoAndStop(0);
        stage.addChild(follower.items.dialog);

        /* =================== shuten ===================== */

        leader.items.body = new createjs.Sprite(body);
        stage.addChild(leader.items.body);

        leader.items.hair = new createjs.Sprite(hair_shu);
        leader.items.hair.gotoAndStop(0);
        stage.addChild(leader.items.hair);

        leader.items.hand = new createjs.Sprite(hand);
        leader.items.hand.gotoAndStop(0);
        stage.addChild(leader.items.hand);

        leader.items.face = new createjs.Sprite(face_shu);
        leader.items.face.gotoAndStop(1);
        stage.addChild(leader.items.face);

        leader.items.cloth = new createjs.Sprite(cloth);
        leader.items.cloth.gotoAndStop(0);
        stage.addChild(leader.items.cloth);

        leader.items.dialog = new createjs.Sprite(dialog_shu);
        leader.items.dialog.timer = 0;
        leader.items.dialog.gotoAndStop(0);
        stage.addChild(leader.items.dialog);

        //播放人物走路效果
        leader.items.body.play();
        follower.items.body.play();

        $('#myCanvas').on("click", handleClick);
        $('#shuten_hair,#ibaraki_hair').on("change", handleChangeHair);
        $('#shuten_cloth,#ibaraki_cloth').on("change", handleChangeCloth);

        //调用tick方法
        createjs.Ticker.setFPS(fps);
        createjs.Ticker.addEventListener("tick", tick);
        stage.update();
    }

    // 移動吞哥
    function handleClick(event) {
        status = "normal";
        leader.speed = 0.05;
        positionX = event.clientX;
        positionY = event.clientY;
        timer = 0;
        rand = Math.random()*2|0;
    }

    // 變更頭髮
    function handleChangeHair() {
        leader.items["hair"].gotoAndStop(parseInt($('#shuten_hair').val()));
        follower.items["hair"].gotoAndStop(parseInt($('#ibaraki_hair').val()));
    }

    // 變更衣服
    function handleChangeCloth() {
        leader.items["cloth"].gotoAndStop(parseInt($('#shuten_cloth').val()));
        follower.items["cloth"].gotoAndStop(parseInt($('#ibaraki_cloth').val()));
    }

    function handleStatus(statusName,toggleTime,resetTime,toggleAction){
        if (timer > fps * resetTime) {
            timer = 0;
        } else if (timer > fps * toggleTime) {
            status = statusName;
            timer = 0;
            if(toggleAction){
                toggleAction();
            }
        }
    }

    // 變更距離後，重置時間與種子
    function handleEventDistance(dist) {
        if (distance !== dist) {
            distance = dist;
            timer = 0;
            rand = Math.random()*2|0;
        }
    }

    function handleDirection(tickXL,apartX){
        if (tickXL > 0) { //move Right
            if (leader.items["body"].scaleX < 0) {
                $.each(leader.items, function(key, value) {
                    if (key != "dialog") {
                        leader.items[key].scaleX *= -1; //翻轉圖片方向
                        leader.items[key].x -= characterWidth;
                    }
                })
                leader.turnLeft = false;
            }
        } else { //move Left
            if (leader.items["body"].scaleX > 0) {
                $.each(leader.items, function(key, value) {
                    if (key != "dialog") {
                        leader.items[key].scaleX *= -1; //翻轉圖片方向
                        leader.items[key].x += characterWidth;
                    }
                })
                leader.turnLeft = true;
            }
        }

        if (apartX > 0) { //move Right
            if (follower.items["body"].scaleX < 0) {
                $.each(follower.items, function(key, value) {
                    if (key != "dialog") {
                        follower.items[key].scaleX *= -1; //翻轉圖片方向
                        follower.items[key].x -= characterWidth;
                    }
                })
                follower.turnLeft = false;
            }
        } else {
            if (follower.items["body"].scaleX > 0) {
                $.each(follower.items, function(key, value) {
                    if (key != "dialog") {
                        follower.items[key].scaleX *= -1; //翻轉圖片方向
                        follower.items[key].x += characterWidth;
                    }
                })
                follower.turnLeft = true;
            }
        }
    }

    function normal() {
        var tickXL = positionX - leader.items["body"].x - characterWidth / 2,
            tickYL = positionY - leader.items["body"].y - characterHeight / 2,
            tickXF = positionX - follower.items["body"].x - characterWidth / 2,
            tickYF = positionY - follower.items["body"].y - characterHeight / 2;

        var absX = Math.abs(leader.items["body"].x - follower.items["body"].x),
            absY = Math.abs(leader.items["body"].y - follower.items["body"].y);

        var apartX = leader.items["body"].x - follower.items["body"].x,
            apartY = leader.items["body"].y - follower.items["body"].y;

        /* 方向變換 */
        handleDirection(tickXL,apartX);

        /* 距離事件判斷 */
        if (absX < 150 + (leader.turnLeft == follower.turnLeft ? 0 : 120) && absY < 150 + (leader.turnLef == follower.turnLeft ? 0 : 120)) {
            handleEventDistance("1");

            leader.anima.shock_02();
            follower.anima.talk_01();
            handleStatus("near",5,8,function(){
                if(rand==0){
                    if(leader.items["body"].x<0){
                        positionX = leader.items["body"].x + absX*2;
                    }else if(leader.items["body"].x>$(window).width()){
                        positionX = leader.items["body"].x - absX*2;
                    }else{
                        positionX = leader.items["body"].x + absX*2 * (Math.random()*2|0 ? 1 : -1);
                    }

                    if(leader.items["body"].y<0){
                        positionY = leader.items["body"].y + absY*2;
                    }else if(leader.items["body"].y>$(window).height()){
                        positionY = leader.items["body"].y - absY*2;
                    }else{
                        positionY = leader.items["body"].y + absY*2 * (Math.random()*2|0 ? 1 : -1);
                    }
                }
            })
        } else if (absX < 300 && absY < 300) {
            handleEventDistance("2");

            leader.anima.shock_01();
            follower.anima.star_01();
        } else if (absX < 500 && absY < 500) {
            handleEventDistance("3");

            leader.anima.normal_01();
            follower.anima.cry_01();
        } else {
            handleEventDistance("4");

            leader.anima.normal_02();
            follower.anima.cry_02();
            handleStatus("far",5,8,function(){
                leader.speed = 0.01;
                positionX = (leader.items["body"].x + follower.items["body"].x)/2;
                positionY = (leader.items["body"].y + follower.items["body"].y)/2;
            })
        }

        if (Math.abs(tickXL) > 1 && Math.abs(tickYL) > 1) {
            leader.items["body"].x += tickXL * leader.speed;
            leader.items["body"].y += tickYL * leader.speed;
            $.each(leader.items,function(key,value){
                leader.items[key].x = leader.items["body"].x;
                leader.items[key].y = leader.items["body"].y;
            })
            leader.items["dialog"].x = leader.items["body"].x - (leader.turnLeft ? 120 : 0);
            leader.items["dialog"].y = leader.items["body"].y - 70;
            leader.items["body"].play();
        } else {
            leader.items["body"].gotoAndStop(0);
        }

        if ((absX < 500 && absY < 500) && (absX >= 100 + (leader.turnLeft == follower.turnLeft ? 0 : 120) || absY >= 100 + (leader.turnLeft == follower.turnLeft ? 0 : 120))) {
            follower.items["body"].x += tickXF * follower.speed;
            follower.items["body"].y += tickYF * follower.speed;
            $.each(follower.items,function(key,value){
                follower.items[key].x = follower.items["body"].x;
                follower.items[key].y = follower.items["body"].y;
            })
            follower.items["dialog"].x = follower.items["body"].x - (follower.turnLeft ? 120 : 0);
            follower.items["dialog"].y = follower.items["body"].y - 70;
            follower.items["body"].play();
        } else {
            follower.items["body"].gotoAndStop(0);
        }


        leader.items["dialog"].timer > fps ? leader.items["dialog"].timer = 0 : leader.items["dialog"].timer++;
        follower.items["dialog"].timer > fps ? follower.items["dialog"].timer = 0 : follower.items["dialog"].timer++;
        timer++;
        
    }

    function near() {
        var tickXL = positionX - leader.items["body"].x - characterWidth / 2,
            tickYL = positionY - leader.items["body"].y - characterHeight / 2,
            tickXF = positionX - follower.items["body"].x - characterWidth / 2,
            tickYF = positionY - follower.items["body"].y - characterHeight / 2;

        var absX = Math.abs(leader.items["body"].x - follower.items["body"].x),
            absY = Math.abs(leader.items["body"].y - follower.items["body"].y);

        var apartX = leader.items["body"].x - follower.items["body"].x,
            apartY = leader.items["body"].y - follower.items["body"].y;

        leader.anima.sign_01();
        follower.anima.talk_02();

        handleDirection(tickXL,apartX);

        if (Math.abs(tickXL) > 1 && Math.abs(tickYL) > 1) {
            leader.items["body"].x += tickXL * leader.speed;
            leader.items["body"].y += tickYL * leader.speed;
            $.each(leader.items,function(key,value){
                leader.items[key].x = leader.items["body"].x;
                leader.items[key].y = leader.items["body"].y;
            })
            leader.items["dialog"].x = leader.items["body"].x - (leader.turnLeft ? 120 : 0);
            leader.items["dialog"].y = leader.items["body"].y - 70;
            leader.items["body"].play();
        } else {
            leader.items["body"].gotoAndStop(0);
        }
        handleStatus("normal",3,15);
        timer++;
    
    }

    function far(){
        var tickXL = positionX - leader.items["body"].x - characterWidth / 2,
            tickYL = positionY - leader.items["body"].y - characterHeight / 2,
            tickXF = positionX - follower.items["body"].x - characterWidth / 2,
            tickYF = positionY - follower.items["body"].y - characterHeight / 2;

        var absX = Math.abs(leader.items["body"].x - follower.items["body"].x),
            absY = Math.abs(leader.items["body"].y - follower.items["body"].y);

        var apartX = leader.items["body"].x - follower.items["body"].x,
            apartY = leader.items["body"].y - follower.items["body"].y;

        leader.anima.sign_02();
        follower.anima.cry_01();

        handleDirection(tickXL,apartX);

        if (Math.abs(tickXL) > 1 && Math.abs(tickYL) > 1) {
            leader.items["body"].x += tickXL * leader.speed;
            leader.items["body"].y += tickYL * leader.speed;
            $.each(leader.items,function(key,value){
                leader.items[key].x = leader.items["body"].x;
                leader.items[key].y = leader.items["body"].y;
            })
            leader.items["dialog"].x = leader.items["body"].x - (leader.turnLeft ? 120 : 0);
            leader.items["dialog"].y = leader.items["body"].y - 70;
            leader.items["body"].play();
        } else {
            leader.items["body"].gotoAndStop(0);
        }
        handleStatus("normal",3,15,function(){
            leader.speed = 0.05;
        });
        timer++;
    }

    function tick(event) {
        var self = this;

        //判斷status
        switch (status) {
            case "normal":
                normal();
                break;
            case "near":
                near();
                break;
            case "far":
                far();
                break;
        }
        stage.update();
    }

    setup();
})