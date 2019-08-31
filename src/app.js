
// 图层
var NODE_LAYER = {
    BG: 0,
    SPRITE_LOVE: 1,
    LABEL_NUM: 2,
    LABEL_HAPPY_BIRTHDAY: 9,
    LABEL_SPECIAL_TALK: 10,
    LABEL_RANDOM_TALK: 5
};

// 颜色
var MY_COLOR = {
    PURPLE_0: cc.color(255, 100, 183),
    PURPLE_1: cc.color(255, 51, 153),
    PURPLE_2: cc.color(157, 114, 148),
    PURPLE_3: cc.color(138, 0, 96),
    PURPLE_4: cc.color(130, 26, 125), // 暗紫色
    PURPLE_n: cc.color(153, 102, 204)
};

// 动作
var MY_ACTION = {
    BEAT: cc.sequence(cc.scaleTo(0.05, 1.05), cc.scaleTo(0.05, 1), cc.scaleTo(0.05, 0.95), cc.scaleTo(0.05, 1),
        cc.scaleTo(0.05, 1.05), cc.scaleTo(0.05, 1), cc.scaleTo(0.05, 0.95), cc.scaleTo(0.05, 1)),
    LABEL_BEAT: cc.sequence(cc.fadeIn(0.01), cc.scaleTo(0.1, 1.5), cc.delayTime(0.1), cc.scaleTo(0.5, 1), cc.delayTime(3), cc.fadeOut(1))
};

var STR_HAPPY_BIRTHDAY = "祝我家妞生日快乐!";

// 随机祝福语
var RANDOM_TALK = [
    "么么哒",
    "爱我家妞",
    "我家妞女神",
    "我家妞最美丽",
    "在我家妞身边守护我家妞",
    "妞呀妞",
    "有我在我家妞身边",
    "要赚好多好多钱给我家妞花",
    "注意休息",
    "保持好心情",
    "抱抱我家妞",
    "亲亲我家妞"
];

// 特殊的话
var SPECIAL_TALK = [
    "我爱我家妞", // 0
    "一直都在我家妞身边", // 1
    "我想一直抱着我家妞", // 2
    "我对我自己很好\n有能力对妞好!", // 3
    "么么么哒", // 4
    "嫁给我好吗?", // 5
    "守护我家妞", // 6
    "" // n
];

// 随机颜色
var RANDOM_TALK_COLOR = [
    MY_COLOR.PURPLE_0,
    MY_COLOR.PURPLE_1,
    MY_COLOR.PURPLE_2,
    MY_COLOR.PURPLE_3,
    MY_COLOR.PURPLE_n
];

var HelloWorldLayer = cc.Layer.extend({
    m_labelNum: null, // 用于计数的 label
    m_spriteLove: null,
    m_labelSpecialTalk: null,

    m_num: 0, // 用于计数
    m_hasShowHappyBirthday: false,

    ctor: function () {
        // 1. super init first
        this._super();

        this.InitUI();
        return true;
    },

    // 初始化 UI
    InitUI: function () {
        // ask the window size
        var size = cc.winSize;

        // 加一个颜色图层
        var colorLayer = new cc.LayerColor(cc.color.WHITE);

        this.addChild(colorLayer, NODE_LAYER.BG);

        // 添加爱心图片
        this.m_spriteLove = new cc.Sprite("res/heart.png");
        this.m_spriteLove.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.m_spriteLove.setColor(MY_COLOR.PURPLE_1);
        this.addChild(this.m_spriteLove, NODE_LAYER.SPRITE_LOVE);

        // 计数的 label
        this.m_labelNum = new cc.LabelTTF("", "Arial", 36);
        this.m_labelNum.x = size.width / 2;
        this.m_labelNum.y = size.height / 2;
        this.m_labelNum.setFontFillColor(MY_COLOR.PURPLE_0);
        this.addChild(this.m_labelNum, NODE_LAYER.LABEL_NUM);

        // sprite 的触摸响应
        var that = this;
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var locationInNode = that.m_spriteLove.convertToNodeSpace(touch.getLocation());
                var s = that.m_spriteLove.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    that.OnPressStart();
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                that.OnPressEnd();
            }
        });
        this.setUserObject(listener);
        cc.eventManager.addListener(listener, this.m_spriteLove);

        this.m_labelSpecialTalk = new cc.LabelTTF("", "Arial", 36);
        this.m_labelSpecialTalk.x = size.width / 2;
        this.m_labelSpecialTalk.y = size.height / 2;
        this.m_labelSpecialTalk.setFontFillColor(MY_COLOR.PURPLE_4);
        this.addChild(this.m_labelSpecialTalk, NODE_LAYER.LABEL_NUM);
    },

    onEnter: function () {
        this._super();

//        if (!cc.sys.isNative) {
//            var canvasNode = document.getElementById(cc.game.config["id"]);
//
//            //canvasNode.style.backgroundColor = "#ffffff";
//            canvasNode.style.backgroundColor = "white";
//        }
    },

    onExit: function () {
//        if (!cc.sys.isNative) {
//            var canvasNode = document.getElementById(cc.game.config["id"]);
//
//            if (canvasNode != null) {
//                canvasNode.style.backgroundColor = "black";
//            }
//        }

        this._super();
    },

    // 按下 sprite
    OnPressStart: function () {
        // 爱心跳动
        this.m_spriteLove.setColor(cc.color.RED);
        this.m_spriteLove.stopAllActions();
        this.m_spriteLove.runAction(MY_ACTION.BEAT.clone());

        // 累加数字并有相应的表现
        this.AddAndRefreshLabelNum();

        // 随机祝福语
        if (this.m_num > 1) {
            var loopCount = 1;

            if ((this.m_num % 7 == 0) ||
                (this.m_num % 2 == 0)) {
                loopCount = 2;
            }

            for (var i = 0; i < loopCount; i++)
            {
                this.CreateRandomTalk();
            }
        }

        // 显示生日祝福语
        if (!this.m_hasShowHappyBirthday) {
            this.m_hasShowHappyBirthday = true;
            this.ShowHappyBirthdayLabel();
        }

        { // 点击到不同阶段有不同的特殊文字
            switch (this.m_num) {
                case 52: // 52
                    this.ShowSpecialLabel(SPECIAL_TALK[0]); // 我爱我家妞
                    break;
                case 66: // 66
                    this.ShowSpecialLabel(SPECIAL_TALK[1]); // 我一直都在我家妞身边
                    break;
                case 80: // 80
                    this.ShowSpecialLabel(SPECIAL_TALK[2]); // 我想一直抱着我家妞
                    break;
                case 99: // 99
                    this.ShowSpecialLabel(SPECIAL_TALK[3]); // 我对我自己很好\n有能力对妞好!
                    break;
                case 120: // 120
                    this.ShowSpecialLabel(SPECIAL_TALK[4]); // 么么么哒
                    break;
                case 199: // 199
                    this.ShowSpecialLabel(SPECIAL_TALK[5]); // 嫁给我好吗?
                    break;
                case 520: // 520
                    this.ShowSpecialLabel(SPECIAL_TALK[5]); // 嫁给我好吗?
                    break;
                case 999: // 999
                    this.ShowSpecialLabel(SPECIAL_TALK[6]); // 守护我家妞
                    break;

                default:
                    break;
            }
        }
    },

    // 放开 sprite
    OnPressEnd: function () {
        this.m_spriteLove.setColor(MY_COLOR.PURPLE_1);
    },

    // 显示特殊祝福语
    ShowSpecialLabel: function (str) {
        if (str == null) {
            str = "";
        }
        var startPos = this.GetScreenCenterPos();

        this.m_labelSpecialTalk.x = startPos.x;
        this.m_labelSpecialTalk.y = startPos.y;
        this.m_labelSpecialTalk.scaleX = 0;
        this.m_labelSpecialTalk.scaleY = 0;
        this.m_labelSpecialTalk.setString(str);

        var action = cc.sequence(
            cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, startPos.x, startPos.y + 160))
        );

        this.m_labelSpecialTalk.runAction(action);
    },

    // 累加数字及刷新 UI
    AddAndRefreshLabelNum: function () {
        this.m_num++;
        this.m_labelNum.setString(String(this.m_num));
        this.m_labelNum.stopAllActions();
        this.m_labelNum.runAction(MY_ACTION.LABEL_BEAT.clone());
    },

    // 显示生日祝福语
    ShowHappyBirthdayLabel: function () {
        var startPos = this.GetScreenCenterPos();
        var label = new cc.LabelTTF(STR_HAPPY_BIRTHDAY, "Arial", 38);

        label.scaleX = 0;
        label.scaleY = 0;
        label.x = startPos.x;
        label.y = startPos.y;
        label.setFontFillColor(MY_COLOR.PURPLE_1);
        this.addChild(label, NODE_LAYER.LABEL_HAPPY_BIRTHDAY);

        var action = cc.sequence(
            cc.spawn(cc.scaleTo(0.5, 0.8), cc.moveTo(0.5, startPos.x, startPos.y + 160)),
            cc.delayTime(0.5),
            cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, startPos.x, startPos.y - 200)),
            cc.delayTime(0.1),
            cc.scaleTo(0.1, 1.1),
            cc.scaleTo(0.1, 1),
            cc.scaleTo(0.1, 1.1),
            cc.scaleTo(0.1, 1)
        );

        label.runAction(action);
    },
    
    // 获得屏幕的中心点
    GetScreenCenterPos: function () {
        var size = cc.winSize;
        return cc.p(size.width / 2, size.height / 2);
    },

    // 创建随机的祝福语
    CreateRandomTalk: function () {
        var startPos = this.GetScreenCenterPos();
        var size = cc.winSize;
        var minX = 120;
        var maxX = size.width - 120;
        var minY = 50;
        var maxY = size.height - 50;
        var randomNumA = Math.random();
        var randomNumB = Math.random();
        var randomIndex = ~~(RANDOM_TALK.length * Math.random());
        var endPos = cc.p( minX * randomNumA + maxX * (1 - randomNumA),
                minY * randomNumB + maxY * (1 - randomNumB));
        var label = new cc.LabelTTF(RANDOM_TALK[randomIndex], "Arial", 38);

        label.scaleX = 0.2;
        label.scaleY = 0.2;
        label.x = startPos.x;
        label.y = startPos.y;
        var randomColorIndex = ~~(RANDOM_TALK_COLOR.length * Math.random());

        label.setFontFillColor(RANDOM_TALK_COLOR[randomColorIndex]);
        this.addChild(label, NODE_LAYER.LABEL_RANDOM_TALK);
        var action = cc.sequence(
            cc.spawn(cc.moveTo(0.8, endPos.x, endPos.y), cc.scaleTo(0.8, 1)),
            cc.delayTime(3),
            cc.fadeOut(0.5),
            cc.callFunc(this.CallFuncRemoveSelfLabel)
        );

        label.runAction(action);
    },

    // 由 cc.callFunc 触发, 移除自身 label
    CallFuncRemoveSelfLabel: function (sender) {
        sender.removeFromParent(true);
    },

    FuncEmpty: function () {

    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

