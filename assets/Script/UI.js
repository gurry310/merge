cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: {
            default: null,
            type: cc.Label
        },
        heartLabel: {
            default: null,
            type: cc.Label
        },
        diamondLabel: {
            default: null,
            type: cc.Label
        },

        collectionThingPrefab: {
            default: null,
            type: cc.Prefab,
        },


        dragonPrefab: {
            default: null,
            type: cc.Prefab,
        },

        nameLevelLabel: {
            default: null,
            type: cc.Label
        },

        nameLevelLabel: {
            default: null,
            type: cc.Label
        },

        descLabel: {
            default: null,
            type: cc.Label
        },

        unDescNode: {
            default: null,
            type: cc.Node
        },
        descNode: {
            default: null,
            type: cc.Node
        },

        dragonNestNode: {
            default: null,
            type: cc.Node
        },

        //图鉴按钮 node 用于控制是否显示 在是否点击物品的情况下
        tujianBtnNode: {
            default: null,
            type: cc.Node
        },

        tujianLayer:{
            default:null,
            type:cc.Node
        },

        tujianFlower:{
            default:null,
            type:cc.Node
        },

        tujianHeart:{
            default:null,
            type:cc.Node
        },

        tujianDragon:{
            default:null,
            type:cc.Node
        },
        // defaults, set visually when attaching this script to the Canvas

    },

    // use this for initialization
    onLoad: function () {

        this.refreshUI();
        let self = this;
        this.descNode.active = true;
        this.unDescNode.active = false;

    },

    refreshUI: function () {
        this.coinLabel.string = cc.dataMgr.getCoinCount();
        this.heartLabel.string = cc.dataMgr.getHeartCount();
        this.diamondLabel.string = cc.dataMgr.getDiamondCount();
    },

    start: function () {

    },

    //图鉴按钮被点击
    tujianClick: function () {
        console.log("图鉴按钮点击了！");
        this.tujianLayer.active = true;
        if (this.thingType == 1) {
            this.tujianHeart.active = true;

            this.tujianDragon.active = false;
            this.tujianFlower.active = false;
        } else if (this.thingType == 2) {
            this.tujianFlower.active = true;

            this.tujianDragon.active = false;
            this.tujianHeart.active = false;
        } else if (this.thingType == 3) {
            this.tujianDragon.active = true;

            this.tujianHeart.active = false;
            this.tujianFlower.active = false;
        } else {
            debugger;
        }
    },

    tujianCloseClick:function() {
        this.tujianLayer.active = false;
    },

    addHeartAndAni: function (camerapos, level) {

        var nodepos = this.node.convertToNodeSpaceAR(camerapos);
        var collectionThingNode = cc.instantiate(this.collectionThingPrefab);
        this.node.addChild(collectionThingNode);
        collectionThingNode.position = nodepos;
        collectionThingNode.getComponent('thingImageAndAni').settingSpriteFrame(1, level);

        var targetPos = cc.pAdd(this.heartLabel.node.parent.position, cc.v2(70, 0));
        var action = cc.moveTo(1.0, targetPos);
        var action2 = cc.fadeOut(1.0);
        var together = cc.spawn(action, action2);
        var seq = cc.sequence(together, cc.callFunc(this.moveToLabelOver, this, collectionThingNode));
        collectionThingNode.runAction(seq);

        var heartStrength = cc.dataMgr.getHeartCountByLevel(level);
        cc.dataMgr.addHeartCount(heartStrength);
    },

    addDragonToNest: function (camerapos, level) {
        var nodepos = this.node.convertToNodeSpaceAR(camerapos);

        var dragonNode = cc.instantiate(this.dragonPrefab);
        this.node.addChild(dragonNode);
        dragonNode.position = nodepos;
        dragonNode.getComponent('Dragon').setTypeAndLevel_forNewDragon(3, level);
        dragonNode.remove
        var targetPos = this.dragonNestNode.position;
        var action = cc.moveTo(2.0, targetPos);
        var action2 = cc.scaleTo(2.0, 0.5);
        var together = cc.spawn(action, action2);
        var seq = cc.sequence(together, cc.callFunc(this.moveToDragonNestOver, this, dragonNode));
        dragonNode.runAction(seq);

        cc.dataMgr.pushDragonToNest(Date.now(), level);
    },

    moveToDragonNestOver: function (dragonNode) {
        this.dragonNestNode.getComponent(cc.Animation).play('nestin');
        dragonNode.destroy();
    },


    moveToLabelOver: function (collectionThingNode) {
        this.refreshUI();
    },


    //strength 用于显示龙 剩余的体力
    addDescForClick: function (thingType, thingLevel, strength) {
        //根据这个值 来处理 图鉴按钮被点击
        this.thingType = thingType;
        var descDatas = cc.dataMgr.getDescByTypeAndLevel(thingType, thingLevel);

        this.tujianBtnNode.active = true;
        //debugger;
        this.nameLevelLabel.string = descDatas.name + "-" + descDatas.levelDesc;
        if (thingType == 3 && thingLevel > 0) {
            this.descLabel.string = descDatas.desc + "  " + "剩余体力：" + strength;
        } else {
            this.descLabel.string = descDatas.desc;
        }

    },



    clearDescForUnClick: function () {
        this.nameLevelLabel.string = "未选中任何东西";
        this.descLabel.string = "";

        this.tujianBtnNode.active = false;
    },

    unDescClick: function () {
        console.log("unDescClick");
        this.descNode.active = true;
        this.unDescNode.active = false;
    },

    descClick: function () {
        console.log("descClick");
        this.descNode.active = false;
        this.unDescNode.active = true;
    },

    // called every frame
    update: function (dt) {

    },
});
