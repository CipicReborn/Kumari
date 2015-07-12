(function () { "use strict";
var $hxClasses = {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = ["DateTools"];
DateTools.delta = function(d,t) {
	var t1 = d.getTime() + t;
	var d1 = new Date();
	d1.setTime(t1);
	return d1;
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
IMap.prototype = {
	__class__: IMap
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var com = {};
com.isartdigital = {};
com.isartdigital.operationaaa = {};
com.isartdigital.operationaaa.Main = function() {
	this.canRender = true;
	this.frames = 0;
	PIXI.EventTarget.call(this);
	this.stage = new PIXI.Stage(10066329);
	com.isartdigital.utils.system.DeviceCapabilities.scaleViewport();
	this.renderer = PIXI.autoDetectRenderer((function($this) {
		var $r;
		var this1 = com.isartdigital.utils.system.DeviceCapabilities.get_width();
		var $int = this1;
		$r = $int < 0?4294967296.0 + $int:$int + 0.0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this2 = com.isartdigital.utils.system.DeviceCapabilities.get_height();
		var int1 = this2;
		$r = int1 < 0?4294967296.0 + int1:int1 + 0.0;
		return $r;
	}(this)));
	window.document.body.appendChild(this.renderer.view);
	var lConfig = new PIXI.JsonLoader("config.json");
	lConfig.addEventListener("loaded",$bind(this,this.preloadAssets));
	lConfig.load();
};
$hxClasses["com.isartdigital.operationaaa.Main"] = com.isartdigital.operationaaa.Main;
com.isartdigital.operationaaa.Main.__name__ = ["com","isartdigital","operationaaa","Main"];
com.isartdigital.operationaaa.Main.main = function() {
	com.isartdigital.operationaaa.Main.getInstance();
};
com.isartdigital.operationaaa.Main.getInstance = function() {
	if(com.isartdigital.operationaaa.Main.instance == null) com.isartdigital.operationaaa.Main.instance = new com.isartdigital.operationaaa.Main();
	return com.isartdigital.operationaaa.Main.instance;
};
com.isartdigital.operationaaa.Main.__super__ = PIXI.EventTarget;
com.isartdigital.operationaaa.Main.prototype = $extend(PIXI.EventTarget.prototype,{
	preloadAssets: function(pEvent) {
		pEvent.target.removeEventListener("loaded",$bind(this,this.preloadAssets));
		com.isartdigital.utils.Config.init((js.Boot.__cast(pEvent.target , PIXI.JsonLoader)).json);
		com.isartdigital.utils.system.DeviceCapabilities.init(1,0.375,0.25);
		if(com.isartdigital.utils.Config.get_debug()) com.isartdigital.utils.Debug.getInstance().init(this);
		if(com.isartdigital.utils.Config.get_data().boxAlpha != null) com.isartdigital.utils.game.StateGraphic.boxAlpha = com.isartdigital.utils.Config.get_data().boxAlpha;
		if(com.isartdigital.utils.Config.get_data().animAlpha != null) com.isartdigital.utils.game.StateGraphic.animAlpha = com.isartdigital.utils.Config.get_data().animAlpha;
		com.isartdigital.utils.game.GameStage.getInstance().set_scaleMode(com.isartdigital.utils.game.GameStageScale.SHOW_ALL);
		com.isartdigital.utils.game.GameStage.getInstance().init($bind(this,this.render),2048,1366,false);
		com.isartdigital.utils.system.DeviceCapabilities.displayFullScreenButton();
		this.stage.addChild(com.isartdigital.utils.game.GameStage.getInstance());
		window.addEventListener("resize",$bind(this,this.resize));
		this.resize();
		var lLoader = new com.isartdigital.utils.loader.Loader();
		lLoader.addAssetFile("black_bg.png");
		lLoader.addAssetFile("LoadingScreen.json");
		lLoader.addAssetFile("preload_ovale.png");
		lLoader.addEventListener("LoaderEvent.COMPLETE",$bind(this,this.loadFonts));
		lLoader.load();
	}
	,loadFonts: function(pEvent) {
		var _g = this;
		pEvent.target.removeEventListener("LoaderEvent.COMPLETE",$bind(this,this.loadFonts));
		var webFontConfig = { custom : { families : ["GothicStyle"], urls : [com.isartdigital.utils.Config.get_cssPath() + "fonts.css"]}, active : function() {
			_g.loadAssets();
		}};
		WebFont.load(webFontConfig);
	}
	,loadAssets: function() {
		var lLoader = new com.isartdigital.utils.loader.Loader();
		lLoader.addTxtFile("boxes.json");
		if(!com.isartdigital.utils.Config.get_data().debugNoSoundLoad) lLoader.addSoundFile("sounds.json");
		lLoader.addAssetFile("alpha_bg.png");
		lLoader.addAssetFile("TitleCard.json");
		lLoader.addAssetFile("buttons_TitleCard.json");
		lLoader.addAssetFile("OptionButtons.json");
		lLoader.addAssetFile("buttonsValidate.json");
		lLoader.addAssetFile("ButtonsNextPauseBack.json");
		lLoader.addAssetFile("UpgradeWin.json");
		lLoader.addAssetFile("Confirm.png");
		lLoader.addAssetFile("collectible_icon.png");
		lLoader.addAssetFile("MiniGem.json");
		lLoader.addAssetFile("HudCenter.png");
		lLoader.addAssetFile("selection_screen/selection_level1.png");
		lLoader.addAssetFile("selection_screen/selection_level2.png");
		lLoader.addAssetFile("selection_screen/selection_level3.png");
		lLoader.addAssetFile("selection_screen/selection_level4.png");
		lLoader.addAssetFile("DeleteSave_bg.png");
		lLoader.addAssetFile("Pause_bg.png");
		lLoader.addAssetFile("Options_bg.png");
		lLoader.addAssetFile("touch_feedback.json");
		lLoader.addAssetFile("collectables/Collectable.json");
		lLoader.addAssetFile("characters/enemies/" + "enemies_bomb_speed.json");
		lLoader.addAssetFile("characters/enemies/" + "enemies_fire_turret.json");
		lLoader.addAssetFile("characters/enemies/" + "EnemyBomb_death.json");
		lLoader.addAssetFile("characters/enemies/" + "EnemyFire_death.json");
		lLoader.addAssetFile("characters/enemies/" + "EnemySpeed_death.json");
		lLoader.addAssetFile("characters/enemies/" + "EnemySpeed_death2.json");
		lLoader.addAssetFile("characters/enemies/" + "EnemyTurret_death.json");
		var _g = 1;
		while(_g < 7) {
			var i = _g++;
			lLoader.addAssetFile("shoots/shoots" + i + ".json");
		}
		lLoader.addAssetFile("checkpoint.json");
		lLoader.addTxtFile("anchors.json");
		lLoader.addAssetFile("shield.json");
		lLoader.addAssetFile("magnet.json");
		lLoader.addAssetFile("characters/player.json");
		lLoader.addTxtFile("main.json",com.isartdigital.utils.Config.get_langPath() + "en/");
		lLoader.addTxtFile("main.json",com.isartdigital.utils.Config.get_langPath() + "fr/");
		lLoader.addEventListener("LoaderEvent.PROGRESS",$bind(this,this.onLoadProgress));
		lLoader.addEventListener("LoaderEvent.COMPLETE",$bind(this,this.onLoadComplete));
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.GraphicLoader.getInstance());
		window.requestAnimationFrame($bind(this,this.gameLoop));
		lLoader.load();
	}
	,onLoadProgress: function(pEvent) {
		com.isartdigital.operationaaa.ui.GraphicLoader.getInstance().update(pEvent.data.loaded / pEvent.data.total);
	}
	,onLoadComplete: function(pEvent) {
		pEvent.target.removeEventListener("LoaderEvent.PROGRESS",$bind(this,this.onLoadProgress));
		pEvent.target.removeEventListener("LoaderEvent.COMPLETE",$bind(this,this.onLoadComplete));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("MiniGem.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("TitleCard.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("buttons_TitleCard.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("Button.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("ButtonsNextPauseBack.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("upgradeWin.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("OptionButtons.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("buttonsValidate.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("UpgradeWin.json"));
		var _g = 1;
		while(_g < 7) {
			var i = _g++;
			com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("shoots/shoots" + i + ".json"));
		}
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/" + "enemies_bomb_speed.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/" + "enemies_fire_turret.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/" + "EnemyBomb_death.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/" + "EnemyFire_death.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/" + "EnemySpeed_death.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/" + "EnemySpeed_death2.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/" + "EnemyTurret_death.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("checkpoint.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("shield.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("magnet.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("touch_feedback.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("collectables/Collectable.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/player.json"));
		com.isartdigital.utils.game.StateGraphic.addBoxes(com.isartdigital.utils.loader.Loader.getContent("boxes.json",com.isartdigital.utils.Config.get_jsonPath()));
		com.isartdigital.utils.game.StateGraphic.addAnchors(com.isartdigital.utils.loader.Loader.getContent("anchors.json",com.isartdigital.utils.Config.get_jsonPath()));
		com.isartdigital.utils.ui.TranslationManager.addTranslations("en",com.isartdigital.utils.loader.Loader.getContent("main.json",com.isartdigital.utils.Config.get_langPath() + "en/"));
		com.isartdigital.utils.ui.TranslationManager.addTranslations("fr",com.isartdigital.utils.loader.Loader.getContent("main.json",com.isartdigital.utils.Config.get_langPath() + "fr/"));
		com.isartdigital.utils.ui.TranslationManager.getInstance().setLanguage((function($this) {
			var $r;
			var this1 = com.isartdigital.operationaaa.SaveManager.getInstance().get_userConfig();
			$r = this1.get("language");
			return $r;
		}(this)));
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeScreens();
		com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().load(1);
	}
	,gameLoop: function() {
		haxe.Timer.delay($bind(this,this.gameLoop),16);
		if(this.canRender) {
			this.renderer.render(this.stage);
			this.canRender = false;
		} else {
			this.canRender = true;
			this.stage.updateTransform();
		}
		this.dispatchEvent("GameEvent.GAME_LOOP");
	}
	,resize: function(pEvent) {
		this.renderer.resize((function($this) {
			var $r;
			var this1 = com.isartdigital.utils.system.DeviceCapabilities.get_width();
			var $int = this1;
			$r = $int < 0?4294967296.0 + $int:$int + 0.0;
			return $r;
		}(this)),(function($this) {
			var $r;
			var this2 = com.isartdigital.utils.system.DeviceCapabilities.get_height();
			var int1 = this2;
			$r = int1 < 0?4294967296.0 + int1:int1 + 0.0;
			return $r;
		}(this)));
		com.isartdigital.utils.game.GameStage.getInstance().resize();
	}
	,render: function() {
		if(this.frames++ % 2 == 0) this.renderer.render(this.stage); else this.stage.updateTransform();
	}
	,destroy: function() {
		window.removeEventListener("resize",$bind(this,this.resize));
		com.isartdigital.operationaaa.Main.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.Main
});
com.isartdigital.operationaaa.SaveManager = function() {
	this.data = this.getData();
	if(this.data == null) {
		this.initialiseDataObject();
		this.save();
	} else {
	}
};
$hxClasses["com.isartdigital.operationaaa.SaveManager"] = com.isartdigital.operationaaa.SaveManager;
com.isartdigital.operationaaa.SaveManager.__name__ = ["com","isartdigital","operationaaa","SaveManager"];
com.isartdigital.operationaaa.SaveManager.getInstance = function() {
	if(com.isartdigital.operationaaa.SaveManager.instance == null) com.isartdigital.operationaaa.SaveManager.instance = new com.isartdigital.operationaaa.SaveManager();
	return com.isartdigital.operationaaa.SaveManager.instance;
};
com.isartdigital.operationaaa.SaveManager.prototype = {
	initialiseDataObject: function() {
		this.data = new haxe.ds.StringMap();
		this.initLevelSorting();
		this.initLevelsData();
		this.initUserConfig();
		this.data.set("dataModelVersion","alpha_1.0");
		haxe.Log.trace(this.data.toString(),{ fileName : "SaveManager.hx", lineNumber : 104, className : "com.isartdigital.operationaaa.SaveManager", methodName : "initialiseDataObject"});
	}
	,initLevelSorting: function() {
		var v = new Array();
		this.data.set("level_sorting",v);
		v;
	}
	,initLevelsData: function() {
		var v = new Array();
		this.data.set("levels_data",v);
		v;
		var _g = 1;
		while(_g < 5) {
			var i = _g++;
			this.data.get("levels_data")[i] = new haxe.ds.StringMap();
		}
		haxe.Log.trace("[SaveManager.initialiseDataObject] Levels Data length : " + Std.string(this.data.get("levels_data").length),{ fileName : "SaveManager.hx", lineNumber : 122, className : "com.isartdigital.operationaaa.SaveManager", methodName : "initLevelsData"});
	}
	,initUserConfig: function() {
		var lUserConfig = new haxe.ds.StringMap();
		this.data.set("user_config",lUserConfig);
		lUserConfig;
		var v = com.isartdigital.utils.Config.get_language();
		lUserConfig.set("language",v);
		v;
		lUserConfig.set("sound_muted",false);
		false;
	}
	,save: function() {
		js.Cookie.set("OperationAAASavedGame",haxe.Serializer.run(this.data),31536000,"com.isartdigital.operationaaa");
	}
	,getData: function() {
		var lCoookieData = js.Cookie.get("OperationAAASavedGame");
		if(lCoookieData != null) {
			var lData = haxe.Unserializer.run(js.Cookie.get("OperationAAASavedGame"));
			if(lData.get("dataModelVersion") != "alpha_1.0") {
				window.alert("ATTENTION : Votre sauvegarde a été effectuée avec un modèle obsolète.\n\nVotre sauvegarde va être effacée.");
				lData = null;
			}
			return lData;
		} else return null;
	}
	,getLevelData: function(pLevel) {
		haxe.Log.trace(this.data.get("levels_data")[pLevel],{ fileName : "SaveManager.hx", lineNumber : 177, className : "com.isartdigital.operationaaa.SaveManager", methodName : "getLevelData"});
		if(this.data == null || this.data.get("levels_data")[pLevel].length == 0) return null;
		return this.data.get("levels_data")[pLevel];
	}
	,saveLevelData: function(pLevel,pData) {
		this.data.get("levels_data")[pLevel] = pData;
		this.save();
	}
	,deleteSave: function() {
		this.initialiseDataObject();
		js.Cookie.remove("OperationAAASavedGame","com.isartdigital.operationaaa");
	}
	,destroy: function() {
		com.isartdigital.operationaaa.SaveManager.instance = null;
	}
	,get_levelSorting: function() {
		if(this.data == null || this.data.get("level_sorting").length == 0) return null;
		return this.data.get("level_sorting");
	}
	,set_levelSorting: function(pArray) {
		this.data.set("level_sorting",pArray);
		pArray;
		haxe.Log.trace(pArray,{ fileName : "SaveManager.hx", lineNumber : 216, className : "com.isartdigital.operationaaa.SaveManager", methodName : "set_levelSorting"});
		this.save();
		return this.data.get("level_sorting");
	}
	,get_levelsData: function() {
		if(this.data == null || this.data.get("levels_data").length == 0) return null;
		return this.data.get("levels_data");
	}
	,set_levelsData: function(pArray) {
		this.data.set("levels_data",pArray);
		pArray;
		this.save();
		return this.data.get("levels_data");
	}
	,get_userConfig: function() {
		if(this.data == null || this.data.get("user_config") == null) return null;
		return this.data.get("user_config");
	}
	,set_userConfig: function(pMap) {
		this.data.set("user_config",pMap);
		pMap;
		return this.data.get("user_config");
	}
	,__class__: com.isartdigital.operationaaa.SaveManager
};
com.isartdigital.operationaaa.controller = {};
com.isartdigital.operationaaa.controller.Controller = function() {
};
$hxClasses["com.isartdigital.operationaaa.controller.Controller"] = com.isartdigital.operationaaa.controller.Controller;
com.isartdigital.operationaaa.controller.Controller.__name__ = ["com","isartdigital","operationaaa","controller","Controller"];
com.isartdigital.operationaaa.controller.Controller.getInstance = function() {
	if(com.isartdigital.operationaaa.controller.Controller.instance == null) com.isartdigital.operationaaa.controller.Controller.instance = new com.isartdigital.operationaaa.controller.Controller();
	return com.isartdigital.operationaaa.controller.Controller.instance;
};
com.isartdigital.operationaaa.controller.Controller.prototype = {
	init: function() {
	}
	,destroy: function() {
		com.isartdigital.operationaaa.controller.Controller.instance = null;
	}
	,get_up: function() {
		return false;
	}
	,get_down: function() {
		return false;
	}
	,get_left: function() {
		return false;
	}
	,get_right: function() {
		return false;
	}
	,get_jump: function() {
		return false;
	}
	,get_fire: function() {
		return false;
	}
	,__class__: com.isartdigital.operationaaa.controller.Controller
};
com.isartdigital.operationaaa.controller.KeyboardController = function() {
	com.isartdigital.operationaaa.controller.Controller.call(this);
	window.addEventListener("keydown",$bind(this,this.registerKeyDown));
	window.addEventListener("keyup",$bind(this,this.registerKeyUp));
};
$hxClasses["com.isartdigital.operationaaa.controller.KeyboardController"] = com.isartdigital.operationaaa.controller.KeyboardController;
com.isartdigital.operationaaa.controller.KeyboardController.__name__ = ["com","isartdigital","operationaaa","controller","KeyboardController"];
com.isartdigital.operationaaa.controller.KeyboardController.getInstance = function() {
	if(com.isartdigital.operationaaa.controller.KeyboardController.instance == null) com.isartdigital.operationaaa.controller.KeyboardController.instance = new com.isartdigital.operationaaa.controller.KeyboardController();
	return com.isartdigital.operationaaa.controller.KeyboardController.instance;
};
com.isartdigital.operationaaa.controller.KeyboardController.__super__ = com.isartdigital.operationaaa.controller.Controller;
com.isartdigital.operationaaa.controller.KeyboardController.prototype = $extend(com.isartdigital.operationaaa.controller.Controller.prototype,{
	destroy: function() {
		window.removeEventListener("keydown",$bind(this,this.registerKeyDown));
		window.removeEventListener("keyup",$bind(this,this.registerKeyUp));
		com.isartdigital.operationaaa.controller.Controller.prototype.destroy.call(this);
	}
	,registerKeyDown: function(pEvent) {
		if(pEvent.keyCode == 32) this.jump = true;
		if(pEvent.keyCode == 37) this.left = true; else if(pEvent.keyCode == 39) this.right = true; else if(pEvent.keyCode == 38) this.up = true; else if(pEvent.keyCode == 40) this.down = true;
		if(pEvent.keyCode == 67) this.fire = true;
	}
	,registerKeyUp: function(pEvent) {
		pEvent.preventDefault();
		if(pEvent.keyCode == 32) this.jump = false;
		if(pEvent.keyCode == 37) this.left = false; else if(pEvent.keyCode == 39) this.right = false; else if(pEvent.keyCode == 38) this.up = false; else if(pEvent.keyCode == 40) this.down = false;
		if(pEvent.keyCode == 67) this.fire = false;
	}
	,get_up: function() {
		return this.up;
	}
	,get_down: function() {
		return this.down;
	}
	,get_left: function() {
		return this.left;
	}
	,get_right: function() {
		return this.right;
	}
	,get_jump: function() {
		return this.jump;
	}
	,get_fire: function() {
		return this.fire;
	}
	,__class__: com.isartdigital.operationaaa.controller.KeyboardController
});
com.isartdigital.operationaaa.controller.TouchController = function() {
	com.isartdigital.operationaaa.controller.Controller.call(this);
	this.init();
};
$hxClasses["com.isartdigital.operationaaa.controller.TouchController"] = com.isartdigital.operationaaa.controller.TouchController;
com.isartdigital.operationaaa.controller.TouchController.__name__ = ["com","isartdigital","operationaaa","controller","TouchController"];
com.isartdigital.operationaaa.controller.TouchController.getInstance = function() {
	if(com.isartdigital.operationaaa.controller.TouchController.instance == null) com.isartdigital.operationaaa.controller.TouchController.instance = new com.isartdigital.operationaaa.controller.TouchController();
	return com.isartdigital.operationaaa.controller.TouchController.instance;
};
com.isartdigital.operationaaa.controller.TouchController.__super__ = com.isartdigital.operationaaa.controller.Controller;
com.isartdigital.operationaaa.controller.TouchController.prototype = $extend(com.isartdigital.operationaaa.controller.Controller.prototype,{
	init: function() {
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().initTouchZones();
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_leftTouchZone().touchstart = $bind(this,this.touchLeftStart);
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_leftTouchZone().touchmove = $bind(this,this.touchLeftMove);
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_leftTouchZone().touchend = $bind(this,this.touchLeftEnd);
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_leftTouchZone().touchendoutside = $bind(this,this.touchLeftEnd);
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_rightTouchZone().touchstart = $bind(this,this.touchRightStart);
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_rightTouchZone().touchmove = $bind(this,this.touchRightMove);
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_rightTouchZone().touchend = $bind(this,this.touchRightEnd);
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().get_rightTouchZone().touchendoutside = $bind(this,this.touchRightEnd);
		this.leftTouchIndex = null;
		this.rightTouchIndex = null;
		this.leftTouchOrigin = new PIXI.Point(0,0);
		this.leftTouchPosition = new PIXI.Point(0,0);
		this.leftTouchVector = new PIXI.Point(0,0);
		this.rightTouchOrigin = new PIXI.Point(0,0);
		this.rightTouchPosition = new PIXI.Point(0,0);
		this.rightTouchVector = new PIXI.Point(0,0);
		this.leftTouchOriginEvent = new CustomEvent("leftTouchOriginEvent");
		this.leftTouchMoveEvent = new CustomEvent("leftTouchMoveEvent");
		this.leftTouchStopEvent = new CustomEvent("leftTouchStopEvent");
		this.rightTouchOriginEvent = new CustomEvent("rightTouchOriginEvent");
		this.rightTouchMoveEvent = new CustomEvent("rightTouchMoveEvent");
		this.swapFeedbackToJumpEvent = new CustomEvent("swapFeedbackToJumpEvent");
		this.rightTouchStopEvent = new CustomEvent("rightTouchStopEvent");
		haxe.Log.trace("Init Touch Done",{ fileName : "TouchController.hx", lineNumber : 109, className : "com.isartdigital.operationaaa.controller.TouchController", methodName : "init"});
	}
	,touchLeftStart: function(pEvent) {
		var lEvent = pEvent.originalEvent;
		lEvent.preventDefault();
		this.leftTouchIndex = lEvent.touches.length - 1;
		this.leftTouchOrigin.set(lEvent.touches[this.leftTouchIndex].clientX,lEvent.touches[this.leftTouchIndex].clientY);
		this.leftTouchOriginEvent.initCustomEvent("leftTouchOriginEvent",false,false,{ origin : this.leftTouchOrigin, position : this.leftTouchOrigin});
		window.dispatchEvent(this.leftTouchOriginEvent);
	}
	,touchLeftMove: function(pEvent) {
		var lEvent = pEvent.originalEvent;
		lEvent.preventDefault();
		this.leftTouchPosition.set(lEvent.touches[this.leftTouchIndex].clientX,lEvent.touches[this.leftTouchIndex].clientY);
		this.leftTouchOrigin.y = this.leftTouchPosition.y;
		this.leftTouchVector.set(this.leftTouchPosition.x - this.leftTouchOrigin.x,0);
		if(this.leftTouchVector.x > 100) this.leftTouchOrigin.x = this.leftTouchPosition.x - 100; else if(this.leftTouchVector.x < -100) this.leftTouchOrigin.x = this.leftTouchPosition.x + 100;
		this.leftTouchVector.set(this.leftTouchPosition.x - this.leftTouchOrigin.x,0);
		this.leftAngle = Math.round(Math.atan2(this.leftTouchVector.y,this.leftTouchVector.x) * com.isartdigital.operationaaa.controller.TouchController.RAD2DEG);
		if(this.leftAngle >= 0 && this.leftAngle <= 45) this.leftDirection = "right"; else if(this.leftAngle > 45 && this.leftAngle <= 135) this.leftDirection = "down"; else if(this.leftAngle > 135 && this.leftAngle <= 180) this.leftDirection = "left"; else if(this.leftAngle < 0 && this.leftAngle >= -45) this.leftDirection = "right"; else if(this.leftAngle < -45 && this.leftAngle >= -135) this.leftDirection = "up"; else if(this.leftAngle < -135 && this.leftAngle >= -180) this.leftDirection = "left";
		if(this.leftTouchVector.x < -10 && this.leftDirection == "left") this.left = true; else this.left = false;
		if(this.leftTouchVector.x > 10 && this.leftDirection == "right") this.right = true; else this.right = false;
		if(this.leftTouchVector.y < -10 && this.leftDirection == "up") this.up = true; else this.up = false;
		if(this.leftTouchVector.y > 10 && this.leftDirection == "down") this.down = true; else this.down = false;
		this.leftTouchMoveEvent.initCustomEvent("leftTouchMoveEvent",false,false,{ origin : this.leftTouchOrigin, position : this.leftTouchPosition});
		window.dispatchEvent(this.leftTouchMoveEvent);
	}
	,touchLeftEnd: function(pEvent) {
		var lEvent = pEvent.originalEvent;
		lEvent.preventDefault();
		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
		this.leftTouchStopEvent.initCustomEvent("leftTouchStopEvent",false,false,{ origin : this.leftTouchOrigin, position : this.leftTouchPosition});
		window.dispatchEvent(this.leftTouchStopEvent);
	}
	,touchRightStart: function(pEvent) {
		var lEvent = pEvent.originalEvent;
		lEvent.preventDefault();
		this.rightTouchIndex = lEvent.touches.length - 1;
		this.rightTouchOrigin.set(lEvent.touches[this.rightTouchIndex].clientX,lEvent.touches[this.rightTouchIndex].clientY);
		this.rightTouchPosition.set(this.rightTouchOrigin.x,this.rightTouchOrigin.y);
		this.fire = true;
		this.jump = false;
		this.rightTouchOriginEvent.initCustomEvent("rightTouchOriginEvent",false,false,{ origin : this.rightTouchOrigin, position : this.rightTouchPosition});
		window.dispatchEvent(this.rightTouchOriginEvent);
	}
	,touchRightMove: function(pEvent) {
		var lEvent = pEvent.originalEvent;
		lEvent.preventDefault();
		this.rightTouchPosition.set(lEvent.touches[this.rightTouchIndex].clientX,lEvent.touches[this.rightTouchIndex].clientY);
		this.rightTouchVector.set(this.rightTouchPosition.x - this.rightTouchOrigin.x,this.rightTouchPosition.y - this.rightTouchOrigin.y);
		this.rightAngle = Math.round(Math.atan2(this.rightTouchVector.y,this.rightTouchVector.x) * com.isartdigital.operationaaa.controller.TouchController.RAD2DEG);
		if(this.rightAngle < -45 && this.rightAngle >= -135) this.rightDirection = "up"; else this.rightDirection = "";
		if(this.rightTouchVector.y < -10 && this.rightDirection == "up") {
			if(!this.get_jump()) window.dispatchEvent(this.swapFeedbackToJumpEvent);
			this.jump = true;
			this.fire = false;
			this.swapFeedbackToJumpEvent.initCustomEvent("swapFeedbackToJumpEvent",false,false,{ });
		}
		this.rightTouchMoveEvent.initCustomEvent("rightTouchMoveEvent",false,false,{ origin : this.rightTouchOrigin, position : this.rightTouchPosition});
		window.dispatchEvent(this.rightTouchMoveEvent);
	}
	,touchRightEnd: function(pEvent) {
		var lEvent = pEvent.originalEvent;
		lEvent.preventDefault();
		this.jump = false;
		this.fire = false;
		this.rightTouchStopEvent.initCustomEvent("rightTouchStopEvent",false,false,{ origin : this.rightTouchOrigin, position : this.rightTouchPosition});
		window.dispatchEvent(this.rightTouchStopEvent);
	}
	,get_up: function() {
		return this.up;
	}
	,get_down: function() {
		return this.down;
	}
	,get_left: function() {
		return this.left;
	}
	,get_right: function() {
		return this.right;
	}
	,get_jump: function() {
		return this.jump;
	}
	,get_fire: function() {
		return this.fire;
	}
	,destroy: function() {
		com.isartdigital.operationaaa.controller.TouchController.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.controller.TouchController
});
var pixi = {};
pixi.display = {};
pixi.display.DisplayObject = function() {
	PIXI.DisplayObject.call(this);
	this.name = "";
};
$hxClasses["pixi.display.DisplayObject"] = pixi.display.DisplayObject;
pixi.display.DisplayObject.__name__ = ["pixi","display","DisplayObject"];
pixi.display.DisplayObject.__super__ = PIXI.DisplayObject;
pixi.display.DisplayObject.prototype = $extend(PIXI.DisplayObject.prototype,{
	__class__: pixi.display.DisplayObject
});
pixi.display.DisplayObjectContainer = function() {
	PIXI.DisplayObjectContainer.call(this);
};
$hxClasses["pixi.display.DisplayObjectContainer"] = pixi.display.DisplayObjectContainer;
pixi.display.DisplayObjectContainer.__name__ = ["pixi","display","DisplayObjectContainer"];
pixi.display.DisplayObjectContainer.__super__ = PIXI.DisplayObjectContainer;
pixi.display.DisplayObjectContainer.prototype = $extend(PIXI.DisplayObjectContainer.prototype,{
	getChildByName: function(name) {
		var _g1 = 0;
		var _g = this.children.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.children[i].name == name) return this.children[i];
		}
		return null;
	}
	,applyScale: function(pixelRatio) {
		if(pixelRatio > 0) this.scale.set(1 / pixelRatio,1 / pixelRatio);
	}
	,__class__: pixi.display.DisplayObjectContainer
});
com.isartdigital.operationaaa.controller.TouchDetectionZone = function() {
	PIXI.Sprite.call(this,PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "touchzone.png"));
};
$hxClasses["com.isartdigital.operationaaa.controller.TouchDetectionZone"] = com.isartdigital.operationaaa.controller.TouchDetectionZone;
com.isartdigital.operationaaa.controller.TouchDetectionZone.__name__ = ["com","isartdigital","operationaaa","controller","TouchDetectionZone"];
com.isartdigital.operationaaa.controller.TouchDetectionZone.__super__ = PIXI.Sprite;
com.isartdigital.operationaaa.controller.TouchDetectionZone.prototype = $extend(PIXI.Sprite.prototype,{
	__class__: com.isartdigital.operationaaa.controller.TouchDetectionZone
});
com.isartdigital.operationaaa.game = {};
com.isartdigital.operationaaa.game.GameManager = function() {
	this.winLoopFramesCount = 0;
};
$hxClasses["com.isartdigital.operationaaa.game.GameManager"] = com.isartdigital.operationaaa.game.GameManager;
com.isartdigital.operationaaa.game.GameManager.__name__ = ["com","isartdigital","operationaaa","game","GameManager"];
com.isartdigital.operationaaa.game.GameManager.getInstance = function() {
	if(com.isartdigital.operationaaa.game.GameManager.instance == null) com.isartdigital.operationaaa.game.GameManager.instance = new com.isartdigital.operationaaa.game.GameManager();
	return com.isartdigital.operationaaa.game.GameManager.instance;
};
com.isartdigital.operationaaa.game.GameManager.prototype = {
	start: function(pLevel) {
		if(pLevel == null) pLevel = 1;
		this.currentLevelId = pLevel;
		haxe.Log.trace("[GameManager.start] Level " + this.currentLevelId + " starting...",{ fileName : "GameManager.hx", lineNumber : 88, className : "com.isartdigital.operationaaa.game.GameManager", methodName : "start"});
		this.setBackgrounds();
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().init();
		com.isartdigital.utils.game.Camera.getInstance().setTarget(com.isartdigital.operationaaa.game.planes.GamePlane.getInstance());
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().takeCameraFocus();
		com.isartdigital.utils.game.Camera.getInstance().setPosition();
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().populateScreen();
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().update();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().startGame();
		this.runGameLoop();
	}
	,gameLoop: function() {
		this.background.doAction();
		this.backgroundTransparent.doAction();
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().doAction();
		if(com.isartdigital.utils.game.Camera.getInstance().move()) com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().checkClipping();
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().doAction();
		var _g = 0;
		var _g1 = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[0];
		while(_g < _g1.length) {
			var lObject = _g1[_g];
			++_g;
			lObject.doAction();
		}
		var _g2 = 0;
		var _g11 = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[1];
		while(_g2 < _g11.length) {
			var lObject1 = _g11[_g2];
			++_g2;
			lObject1.doAction();
		}
		var $it0 = com.isartdigital.operationaaa.game.sprites.walls.Wall.list.iterator();
		while( $it0.hasNext() ) {
			var lObject2 = $it0.next();
			lObject2.doAction();
		}
		var $it1 = com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list.iterator();
		while( $it1.hasNext() ) {
			var lObject3 = $it1.next();
			lObject3.doAction();
		}
		var $it2 = com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list.iterator();
		while( $it2.hasNext() ) {
			var lObject4 = $it2.next();
			lObject4.doAction();
		}
		var $it3 = com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.iterator();
		while( $it3.hasNext() ) {
			var lObject5 = $it3.next();
			lObject5.doAction();
		}
		var $it4 = com.isartdigital.operationaaa.game.sprites.collectables.Collectable.dyingList.iterator();
		while( $it4.hasNext() ) {
			var lObject6 = $it4.next();
			lObject6.doAction();
		}
		com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.getInstance().doAction();
		com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.getInstance().doAction();
	}
	,winLoop: function() {
		this.background.doAction();
		this.backgroundTransparent.doAction();
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().doAction();
		if(com.isartdigital.utils.game.Camera.getInstance().move()) com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().checkClipping();
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().doAction();
		if(this.winLoopFramesCount++ > 60) {
			com.isartdigital.operationaaa.ui.UIManager.getInstance().openPopin(com.isartdigital.operationaaa.ui.popin.WinInterlevel.getInstance());
			this.runNoLoop();
		}
	}
	,runGameLoop: function() {
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.winLoop));
		com.isartdigital.operationaaa.Main.getInstance().addEventListener("GameEvent.GAME_LOOP",$bind(this,this.gameLoop));
	}
	,runWinLoop: function() {
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.gameLoop));
		this.winLoopFramesCount = 0;
		com.isartdigital.operationaaa.Main.getInstance().addEventListener("GameEvent.GAME_LOOP",$bind(this,this.winLoop));
	}
	,runNoLoop: function() {
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.gameLoop));
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.winLoop));
	}
	,setBackgrounds: function() {
		this.background = new com.isartdigital.operationaaa.game.planes.ScrollingPlane(["BackgroundScroll_1.png","BackgroundScroll_2.png","BackgroundScroll_3.png"]);
		this.background.scrollSpeed.set(0.1,0.01);
		this.background.pivot.y = 20;
		this.backgroundTransparent = new com.isartdigital.operationaaa.game.planes.ScrollingPlane(["BackgroundScrollTransparent_1.png","BackgroundScrollTransparent_2.png","BackgroundScrollTransparent_3.png"]);
		this.backgroundTransparent.scrollSpeed.set(0.2,0.15);
		this.backgroundTransparent.pivot.y = -120;
		var lGameStage = com.isartdigital.utils.game.GameStage.getInstance();
		lGameStage.addChildAt(this.background,0);
		lGameStage.addChildAt(this.backgroundTransparent,1);
		this.background.start();
		this.backgroundTransparent.start();
	}
	,respawnAt: function(pX,pY) {
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().position.set(pX,pY);
		com.isartdigital.utils.game.Camera.getInstance().setPosition();
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().reloadLevelAtLastCheckpoint();
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().update();
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().setModeCheckClipping();
	}
	,stopGameAndBackToSelection: function(pSave) {
		if(pSave == null) pSave = false;
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().setModeVoid();
		this.runNoLoop();
		if(pSave) com.isartdigital.operationaaa.SaveManager.getInstance().saveLevelData(this.currentLevelId,com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().getCurrentLevelData());
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.SelectScreen.getInstance());
		com.isartdigital.operationaaa.ui.CheatPanel.getInstance().clear();
		com.isartdigital.utils.game.Camera.getInstance().destroy();
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().destroyLevel();
		this.currentLevelId = null;
	}
	,win: function() {
		haxe.Log.trace("VICTORY",{ fileName : "GameManager.hx", lineNumber : 260, className : "com.isartdigital.operationaaa.game.GameManager", methodName : "win"});
		com.isartdigital.operationaaa.game.sprites.Player.getInstance().setUpgrade(this.currentLevelId);
		com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().recordUpgradeForCurrentLevel();
		com.isartdigital.utils.sounds.SoundManager.getSound(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().soundLevel).fadeOut(10,10,null);
		com.isartdigital.utils.sounds.SoundManager.getSound("unlock").play();
		this.runWinLoop();
		haxe.Log.trace((function($this) {
			var $r;
			var this1 = com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().getCurrentLevelData();
			$r = this1.toString();
			return $r;
		}(this)),{ fileName : "GameManager.hx", lineNumber : 270, className : "com.isartdigital.operationaaa.game.GameManager", methodName : "win"});
		com.isartdigital.operationaaa.SaveManager.getInstance().saveLevelData(this.currentLevelId,com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().getCurrentLevelData());
	}
	,winFinal: function() {
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.FinalWin.getInstance());
	}
	,destroy: function() {
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.gameLoop));
		com.isartdigital.operationaaa.game.GameManager.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.game.GameManager
};
com.isartdigital.operationaaa.game.leveldesign = {};
com.isartdigital.operationaaa.game.leveldesign.Cell = function() {
	this.content = new Array();
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.Cell"] = com.isartdigital.operationaaa.game.leveldesign.Cell;
com.isartdigital.operationaaa.game.leveldesign.Cell.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","Cell"];
com.isartdigital.operationaaa.game.leveldesign.Cell.prototype = {
	add: function(pInstance) {
		this.content.push(pInstance);
	}
	,objectsCount: function() {
		return this.content.length;
	}
	,getElement: function(pId) {
		if(this.content[pId] == null) {
		}
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.Cell
};
com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter = function(pModel,pClass,pId) {
	this.id = pId.toString();
	this.type = pModel.type;
	this.objectClass = pClass;
	this.x = pModel.x;
	this.y = pModel.y;
	this.scaleX = pModel.scaleX;
	this.scaleY = pModel.scaleY;
	this.rotation = pModel.rotation;
	this.cells = pModel.cells;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter"] = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","GameObjectSetter"];
com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype = {
	setupGameObject: function() {
		this.inGameInstance = com.isartdigital.utils.game.PoolManager.getInstance().getFromPool(this.get_type());
		this.inGameInstance.x = this.get_x();
		this.inGameInstance.y = this.get_y();
		this.inGameInstance.scale.set(this.get_scaleX() / Math.abs(this.get_scaleX()),this.get_scaleY() / Math.abs(this.get_scaleY()));
		this.inGameInstance.rotation = this.get_rotation() * com.isartdigital.operationaaa.game.GameManager.DEG2RAD;
		if(this.plane == null) {
			haxe.Log.trace(this.id + " has no GamePlane layer associated with",{ fileName : "GameObjectSetter.hx", lineNumber : 120, className : "com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter", methodName : "setupGameObject"});
			return null;
		}
		this.plane.addChild(this.inGameInstance);
		this.inGameInstance.start();
		this.inGameInstance.update();
		this.specificSetup();
		return this.inGameInstance;
	}
	,specificSetup: function() {
	}
	,unset: function() {
		this.inGameInstance = null;
	}
	,get_type: function() {
		return this.type;
	}
	,get_x: function() {
		return this.x;
	}
	,get_y: function() {
		return this.y;
	}
	,get_scaleX: function() {
		return this.scaleX;
	}
	,get_scaleY: function() {
		return this.scaleY;
	}
	,get_rotation: function() {
		return this.rotation;
	}
	,get_id: function() {
		return this.id;
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter
};
com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter = function(pModel,pClass,pId) {
	this.isActivated = false;
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().objectsContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter"] = com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter;
com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","CheckpointSetter"];
com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.Checkpoint)).set(this.id.toString(),this.isActivated);
	}
	,unset: function() {
		var lCheckpoint;
		lCheckpoint = js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.Checkpoint);
		this.isActivated = lCheckpoint.isActivated;
		lCheckpoint.unset();
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter
});
com.isartdigital.operationaaa.game.leveldesign.CollectableSetter = function(pModel,pClass,pId) {
	this._alreadyCollected = false;
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().objectsContainer;
	this.set_alreadyCollected(false);
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.CollectableSetter"] = com.isartdigital.operationaaa.game.leveldesign.CollectableSetter;
com.isartdigital.operationaaa.game.leveldesign.CollectableSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","CollectableSetter"];
com.isartdigital.operationaaa.game.leveldesign.CollectableSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.CollectableSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.collectables.Collectable)).set(this.id.toString(),this.get_alreadyCollected());
	}
	,unset: function() {
		var lCollectable;
		lCollectable = js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.collectables.Collectable);
		this.collected = lCollectable.collected;
		lCollectable.unset();
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,get_alreadyCollected: function() {
		return this._alreadyCollected;
	}
	,set_alreadyCollected: function(pValue) {
		this._alreadyCollected = pValue;
		return this._alreadyCollected;
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.CollectableSetter
});
com.isartdigital.operationaaa.game.leveldesign.EnemySetter = function(pModel,pClass,pId) {
	this.speed = new PIXI.Point(0,0);
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().objectsContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.EnemySetter"] = com.isartdigital.operationaaa.game.leveldesign.EnemySetter;
com.isartdigital.operationaaa.game.leveldesign.EnemySetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","EnemySetter"];
com.isartdigital.operationaaa.game.leveldesign.EnemySetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.EnemySetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		var lObject;
		lObject = js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.enemies.Enemy);
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.enemies.Enemy)).set(this.id.toString(),lObject.initialLifePoints);
	}
	,unset: function() {
		var lObject;
		lObject = js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.enemies.Enemy);
		this.lifePoints = lObject.lifePoints;
		lObject.unset();
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.EnemySetter
});
com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter = function(pModel,pClass,pId) {
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.rotation = Math.round(this.get_rotation() * com.isartdigital.operationaaa.game.GameManager.DEG2RAD * 10) / 10;
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().objectsContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter"] = com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter;
com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","KillZoneDynamicSetter"];
com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		var lKZ;
		lKZ = js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic);
		lKZ.set(this.id.toString(),this.get_x(),this.get_y(),this.get_rotation());
	}
	,unset: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic)).unset();
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter
});
com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter = function(pModel,pClass,pId) {
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().objectsContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter"] = com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter;
com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","KillZoneStaticSetter"];
com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		var lKZ;
		lKZ = js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic);
		lKZ.stepsCount = 0;
		lKZ.set(this.id.toString());
	}
	,unset: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic)).unset();
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter
});
com.isartdigital.operationaaa.game.leveldesign.PlatformSetter = function(pModel,pClass,pId) {
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().platformsContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.PlatformSetter"] = com.isartdigital.operationaaa.game.leveldesign.PlatformSetter;
com.isartdigital.operationaaa.game.leveldesign.PlatformSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","PlatformSetter"];
com.isartdigital.operationaaa.game.leveldesign.PlatformSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.PlatformSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.platforms.Platform)).set(this.id.toString());
	}
	,unset: function() {
		if(this.id == null) haxe.Log.trace("WARNING: you are trying to remove a Platform with no Id",{ fileName : "PlatformSetter.hx", lineNumber : 27, className : "com.isartdigital.operationaaa.game.leveldesign.PlatformSetter", methodName : "unset"});
		if(!com.isartdigital.operationaaa.game.sprites.platforms.Platform.list.remove(this.id)) haxe.Log.trace("ERROR: removal of Platform " + this.id + " has failed.",{ fileName : "PlatformSetter.hx", lineNumber : 28, className : "com.isartdigital.operationaaa.game.leveldesign.PlatformSetter", methodName : "unset"});
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.PlatformSetter
});
com.isartdigital.operationaaa.game.leveldesign.WallSetter = function(pModel,pClass,pId) {
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	if(this.get_type().indexOf("Ground") == -1) this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().wallsContainer; else this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().groundsContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.WallSetter"] = com.isartdigital.operationaaa.game.leveldesign.WallSetter;
com.isartdigital.operationaaa.game.leveldesign.WallSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","WallSetter"];
com.isartdigital.operationaaa.game.leveldesign.WallSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.WallSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.walls.Wall)).set(this.id.toString());
	}
	,unset: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.walls.Wall)).unset();
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.WallSetter
});
com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter = function(pModel,pClass,pId) {
	this.isActivated = false;
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().objectsContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter"] = com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter;
com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","UpgradeSetter"];
com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	specificSetup: function() {
		(js.Boot.__cast(this.inGameInstance , com.isartdigital.operationaaa.game.sprites.collectables.Upgrade)).set(this.id.toString());
	}
	,unset: function() {
		if(this.id == null) haxe.Log.trace("WARNING: you are trying to remove a Checkpoint with no Id",{ fileName : "UpgradeSetter.hx", lineNumber : 28, className : "com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter", methodName : "unset"});
		if(!com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list.remove(this.id)) haxe.Log.trace("ERROR: removal of Checkpoint " + this.id + " has failed.",{ fileName : "UpgradeSetter.hx", lineNumber : 29, className : "com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter", methodName : "unset"});
		com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype.unset.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter
});
com.isartdigital.operationaaa.game.leveldesign.PlayerSetter = function(pModel,pClass,pId) {
	com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.call(this,pModel,pClass,pId);
	this.plane = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().playerContainer;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.PlayerSetter"] = com.isartdigital.operationaaa.game.leveldesign.PlayerSetter;
com.isartdigital.operationaaa.game.leveldesign.PlayerSetter.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","PlayerSetter"];
com.isartdigital.operationaaa.game.leveldesign.PlayerSetter.__super__ = com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
com.isartdigital.operationaaa.game.leveldesign.PlayerSetter.prototype = $extend(com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter.prototype,{
	setupGameObject: function() {
		this.inGameInstance = com.isartdigital.operationaaa.game.sprites.Player.getInstance();
		this.inGameInstance.x = this.get_x();
		this.inGameInstance.y = this.get_y();
		this.inGameInstance.scale.set(this.get_scaleX() / Math.abs(this.get_scaleX()),this.get_scaleY() / Math.abs(this.get_scaleY()));
		this.inGameInstance.rotation = this.get_rotation() * com.isartdigital.operationaaa.game.GameManager.DEG2RAD;
		if(this.plane == null) {
			haxe.Log.trace(this.id + " has no GamePlane layer associated with",{ fileName : "PlayerSetter.hx", lineNumber : 28, className : "com.isartdigital.operationaaa.game.leveldesign.PlayerSetter", methodName : "setupGameObject"});
			return null;
		}
		this.plane.addChild(this.inGameInstance);
		this.inGameInstance.start();
		this.inGameInstance.update();
		this.specificSetup();
		return this.inGameInstance;
	}
	,specificSetup: function() {
		if(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().playerHasUpgrade("PowerShoot")) com.isartdigital.operationaaa.game.sprites.Player.getInstance().setUpgrade(1);
		if(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().playerHasUpgrade("DoubleJump")) com.isartdigital.operationaaa.game.sprites.Player.getInstance().setUpgrade(2);
		if(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().playerHasUpgrade("Shield")) com.isartdigital.operationaaa.game.sprites.Player.getInstance().setUpgrade(3);
		if(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().playerHasUpgrade("Magnet")) com.isartdigital.operationaaa.game.sprites.Player.getInstance().setUpgrade(4);
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.PlayerSetter
});
com.isartdigital.operationaaa.game.leveldesign.LevelLoader = function() {
	this.soundLevel = "";
	this.PLAYER_PATH = "";
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.LevelLoader"] = com.isartdigital.operationaaa.game.leveldesign.LevelLoader;
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","LevelLoader"];
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance = function() {
	if(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.instance == null) com.isartdigital.operationaaa.game.leveldesign.LevelLoader.instance = new com.isartdigital.operationaaa.game.leveldesign.LevelLoader();
	return com.isartdigital.operationaaa.game.leveldesign.LevelLoader.instance;
};
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.prototype = {
	load: function(pLevelNumber) {
		this.currentLevelId = pLevelNumber;
		this.getPathPlayer();
		var lLoader = new com.isartdigital.utils.loader.Loader();
		lLoader.addTxtFile("levels/" + this.currentLevelId + "/level.json");
		lLoader.addTxtFile("levels/" + this.currentLevelId + "/pools.json");
		lLoader.addTxtFile("levels/" + this.currentLevelId + "/anchors_graphics.json");
		lLoader.addAssetFile("levels/" + this.currentLevelId + "/backgrounds.json");
		lLoader.addAssetFile("levels/" + this.currentLevelId + "/graphics.json");
		lLoader.addAssetFile("characters/enemies/KillZoneDynamic.json");
		lLoader.addAssetFile("collectables/Collectable.json");
		lLoader.addAssetFile("characters" + this.PLAYER_PATH + "/player.json");
		lLoader.addEventListener("LoaderEvent.PROGRESS",$bind(this,this.onLoadProgress));
		lLoader.addEventListener("LoaderEvent.COMPLETE",$bind(this,this.onLoadComplete));
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.GraphicLoader.getInstance());
		lLoader.load();
	}
	,onLoadProgress: function(pEvent) {
		com.isartdigital.operationaaa.ui.GraphicLoader.getInstance().update(pEvent.data.loaded / pEvent.data.total);
	}
	,onLoadComplete: function(pEvent) {
		com.isartdigital.utils.game.StateGraphic.clearTextures(com.isartdigital.utils.loader.Loader.getContent("levels/" + this.currentLevelId + "/graphics.json"));
		com.isartdigital.utils.game.StateGraphic.clearTextures(com.isartdigital.utils.loader.Loader.getContent("characters" + this.PLAYER_PATH + "/player.json"));
		com.isartdigital.utils.game.StateGraphic.clearTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/KillZoneDynamic.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("levels/" + this.currentLevelId + "/graphics.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters" + this.PLAYER_PATH + "/player.json"));
		com.isartdigital.utils.game.StateGraphic.addTextures(com.isartdigital.utils.loader.Loader.getContent("characters/enemies/KillZoneDynamic.json"));
		com.isartdigital.utils.game.StateGraphic.addAnchors(com.isartdigital.utils.loader.Loader.getContent("anchors_graphics.json",com.isartdigital.utils.Config.get_jsonPath() + "levels/" + this.currentLevelId + "/"));
		var jsonObjectsList = com.isartdigital.utils.loader.Loader.getContent("level.json",com.isartdigital.utils.Config.get_jsonPath() + "levels/" + this.currentLevelId + "/").objects;
		var jsonLevelMap = com.isartdigital.utils.loader.Loader.getContent("level.json",com.isartdigital.utils.Config.get_jsonPath() + "levels/" + this.currentLevelId + "/").leveldesign;
		this.getSavedGame();
		this.levelObjectsList = new haxe.ds.StringMap();
		var lSetter;
		var lCollectablesCount = 0;
		var lAlreadyCollected = 0;
		var _g = 0;
		var _g1 = Reflect.fields(jsonObjectsList);
		while(_g < _g1.length) {
			var lJsonObject = _g1[_g];
			++_g;
			var lClass = this.getClassFromString(Reflect.field(jsonObjectsList,lJsonObject).type);
			if(lClass == null) {
				com.isartdigital.utils.Debug.error("Impossible de trouver " + Std.string(Reflect.field(jsonObjectsList,lJsonObject).type) + " \n Oubli d'import | mauvais path | classe inexistante");
				continue;
			}
			var lSetterClass;
			var key = Reflect.field(jsonObjectsList,lJsonObject).type;
			lSetterClass = com.isartdigital.operationaaa.game.leveldesign.LevelLoader.setters.get(key);
			lSetter = Type.createInstance(lSetterClass,[Reflect.field(jsonObjectsList,lJsonObject),lClass,lJsonObject]);
			if(lSetter.get_type() == "Collectable") {
				lCollectablesCount++;
				if(((function($this) {
					var $r;
					var this1 = $this.get_currentSavedData();
					$r = this1.get("collectables");
					return $r;
				}(this))).get(lSetter.id) != null) {
					(js.Boot.__cast(lSetter , com.isartdigital.operationaaa.game.leveldesign.CollectableSetter)).set_alreadyCollected(((function($this) {
						var $r;
						var this2 = $this.get_currentSavedData();
						$r = this2.get("collectables");
						return $r;
					}(this))).get(lSetter.id));
					if((js.Boot.__cast(lSetter , com.isartdigital.operationaaa.game.leveldesign.CollectableSetter)).get_alreadyCollected()) lAlreadyCollected++;
				}
			}
			this.levelObjectsList.set(lJsonObject,lSetter);
		}
		var this3 = this.get_currentSavedData();
		this3.set("collected",lAlreadyCollected);
		lAlreadyCollected;
		var this4 = this.get_currentSavedData();
		this4.set("total",lCollectablesCount);
		lCollectablesCount;
		var lJsonCol;
		var lJsonCell;
		this.levelMap = new Array();
		var lCell;
		var _g2 = 0;
		var _g11 = Reflect.fields(jsonLevelMap);
		while(_g2 < _g11.length) {
			var col = _g11[_g2];
			++_g2;
			lJsonCol = Reflect.field(jsonLevelMap,col);
			this.levelMap[Std.parseInt(col)] = [];
			var _g21 = 0;
			var _g3 = Reflect.fields(lJsonCol);
			while(_g21 < _g3.length) {
				var row = _g3[_g21];
				++_g21;
				lJsonCell = Reflect.field(lJsonCol,row);
				lCell = new com.isartdigital.operationaaa.game.leveldesign.Cell();
				var _g4 = 0;
				var _g5 = Reflect.fields(lJsonCell);
				while(_g4 < _g5.length) {
					var i = _g5[_g4];
					++_g4;
					lCell.add(Reflect.field(lJsonCell,i));
				}
				this.levelMap[Std.parseInt(col)][Std.parseInt(row)] = lCell;
			}
		}
		this.pools = com.isartdigital.utils.loader.Loader.getContent("levels/" + this.currentLevelId + "/pools.json");
		this.soundLevel = "level_music" + this.currentLevelId;
		com.isartdigital.utils.sounds.SoundManager.getSound(this.soundLevel).play();
		com.isartdigital.operationaaa.game.GameManager.getInstance().start(this.currentLevelId);
	}
	,getClassFromString: function(pType) {
		var pathToClass = "com.isartdigital.operationaaa.game.sprites.";
		if(pType.indexOf("Platform") != -1 || pType.indexOf("Bridge") != -1) pathToClass += "platforms." + "Platform"; else if(pType.indexOf("Wall") != -1 || pType.indexOf("Limit") != -1 || pType == "Ground") pathToClass += "walls." + "Wall"; else if(pType.indexOf("Enemy") != -1 || pType.indexOf("KillZone") != -1) pathToClass += "enemies." + pType; else if(pType == "Destructible") pathToClass += "walls." + pType; else if(pType.indexOf("Collectable") != -1 || pType.indexOf("Upgrade") != -1) pathToClass += "collectables." + pType; else pathToClass += pType;
		return Type.resolveClass(pathToClass);
	}
	,getSavedGame: function() {
		this.currentSavedData = com.isartdigital.operationaaa.SaveManager.getInstance().getLevelData(this.currentLevelId);
		haxe.Log.trace((function($this) {
			var $r;
			var this1 = $this.get_currentSavedData();
			$r = this1.toString();
			return $r;
		}(this)),{ fileName : "LevelLoader.hx", lineNumber : 359, className : "com.isartdigital.operationaaa.game.leveldesign.LevelLoader", methodName : "getSavedGame"});
		if(!(function($this) {
			var $r;
			var this2 = $this.get_currentSavedData();
			$r = this2.exists("collectables");
			return $r;
		}(this))) {
			haxe.Log.trace("[LevelLoader.getSavedGame] No Saved Game detected. About to create a new Save.",{ fileName : "LevelLoader.hx", lineNumber : 363, className : "com.isartdigital.operationaaa.game.leveldesign.LevelLoader", methodName : "getSavedGame"});
			this.currentSavedData = new haxe.ds.StringMap();
			var this3 = this.get_currentSavedData();
			this3.set("upgrade",false);
			var this4 = this.get_currentSavedData();
			var value = new haxe.ds.StringMap();
			this4.set("collectables",value);
			var this5 = this.get_currentSavedData();
			this5.set("total",0);
		}
	}
	,recordCollectablePickUp: function(pId) {
		var this1;
		this1 = js.Boot.__cast((function($this) {
			var $r;
			var this2 = $this.get_currentSavedData();
			$r = this2.get("collectables");
			return $r;
		}(this)) , haxe.ds.StringMap);
		this1.set(pId,true);
		true;
	}
	,recordUpgradeForCurrentLevel: function() {
		var this1 = this.get_currentSavedData();
		this1.set("upgrade",true);
		true;
		haxe.Log.trace((function($this) {
			var $r;
			var this2 = $this.get_currentSavedData();
			$r = this2.toString();
			return $r;
		}(this)),{ fileName : "LevelLoader.hx", lineNumber : 389, className : "com.isartdigital.operationaaa.game.leveldesign.LevelLoader", methodName : "recordUpgradeForCurrentLevel"});
	}
	,convertToGameObject: function(pObject) {
		haxe.Log.trace("GameObject" + Std.string(pObject.type),{ fileName : "LevelLoader.hx", lineNumber : 400, className : "com.isartdigital.operationaaa.game.leveldesign.LevelLoader", methodName : "convertToGameObject"});
		return js.Boot.__cast(pObject , com.isartdigital.utils.game.GameObject);
	}
	,getPathPlayer: function() {
		if(this.playerHasUpgrade("Shield") && this.playerHasUpgrade("PowerShoot")) this.PLAYER_PATH = "/ShieldAndPowerShoot"; else if(this.playerHasUpgrade("PowerShoot")) this.PLAYER_PATH = "/PowerShoot"; else if(this.playerHasUpgrade("Shield")) this.PLAYER_PATH = "/Shield"; else {
		}
	}
	,playerHasUpgrade: function(pUpgrade) {
		if(pUpgrade == "PowerShoot") {
			var this1 = com.isartdigital.operationaaa.SaveManager.getInstance().get_levelsData()[1];
			return this1.get("upgrade");
		} else if(pUpgrade == "DoubleJump") {
			var this2 = com.isartdigital.operationaaa.SaveManager.getInstance().get_levelsData()[2];
			return this2.get("upgrade");
		} else if(pUpgrade == "Shield") {
			var this3 = com.isartdigital.operationaaa.SaveManager.getInstance().get_levelsData()[3];
			return this3.get("upgrade");
		} else if(pUpgrade == "Magnet") {
			var this4 = com.isartdigital.operationaaa.SaveManager.getInstance().get_levelsData()[4];
			return this4.get("upgrade");
		} else return null;
	}
	,getCurrentLevelData: function() {
		var lCollectablesCount = 0;
		var lPickedUpCollectablesCount = 0;
		var $it0 = this.levelObjectsList.iterator();
		while( $it0.hasNext() ) {
			var lSetter = $it0.next();
			if(lSetter.get_type() == "Collectable") {
				lCollectablesCount++;
				if(((function($this) {
					var $r;
					var this1 = $this.get_currentSavedData();
					$r = this1.get("collectables");
					return $r;
				}(this))).get(lSetter.id) != null) {
					if((function($this) {
						var $r;
						var this2;
						this2 = js.Boot.__cast((function($this) {
							var $r;
							var this3 = $this.get_currentSavedData();
							$r = this3.get("collectables");
							return $r;
						}($this)) , haxe.ds.StringMap);
						$r = this2.get(lSetter.id);
						return $r;
					}(this))) lPickedUpCollectablesCount++;
				}
			}
		}
		var this4 = this.get_currentSavedData();
		this4.set("collected",lPickedUpCollectablesCount);
		lPickedUpCollectablesCount;
		var this5 = this.get_currentSavedData();
		this5.set("total",lCollectablesCount);
		lCollectablesCount;
		return this.get_currentSavedData();
	}
	,destroyCurrentLevel: function() {
		haxe.Log.trace("\n\n===> Début de la destruction du niveau " + new Date().getTime(),{ fileName : "LevelLoader.hx", lineNumber : 470, className : "com.isartdigital.operationaaa.game.leveldesign.LevelLoader", methodName : "destroyCurrentLevel"});
		var $it0 = com.isartdigital.operationaaa.game.sprites.walls.Wall.list.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			lObject.destroy();
		}
		var $it1 = com.isartdigital.operationaaa.game.sprites.platforms.Platform.list.iterator();
		while( $it1.hasNext() ) {
			var lObject1 = $it1.next();
			lObject1.destroy();
		}
		var $it2 = com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list.iterator();
		while( $it2.hasNext() ) {
			var lObject2 = $it2.next();
			lObject2.destroy();
		}
		var $it3 = com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list.iterator();
		while( $it3.hasNext() ) {
			var lObject3 = $it3.next();
			lObject3.destroy();
		}
		var $it4 = com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.iterator();
		while( $it4.hasNext() ) {
			var lObject4 = $it4.next();
			lObject4.destroy();
		}
		var $it5 = com.isartdigital.operationaaa.game.sprites.Checkpoint.list.iterator();
		while( $it5.hasNext() ) {
			var lObject5 = $it5.next();
			lObject5.destroy();
		}
		var $it6 = com.isartdigital.operationaaa.game.sprites.Checkpoint.inactiveList.iterator();
		while( $it6.hasNext() ) {
			var lObject6 = $it6.next();
			lObject6.destroy();
		}
		var $it7 = com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list.iterator();
		while( $it7.hasNext() ) {
			var lObject7 = $it7.next();
			lObject7.destroy();
		}
		var $it8 = com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list.iterator();
		while( $it8.hasNext() ) {
			var lObject8 = $it8.next();
			lObject8.destroy();
		}
		var _g1 = 0;
		var _g = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[i][j].destroy();
			}
		}
		com.isartdigital.operationaaa.game.sprites.walls.Wall.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.platforms.Platform.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.Checkpoint.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.Checkpoint.inactiveList = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list = [[],[]];
		com.isartdigital.utils.game.PoolManager.getInstance().clear();
		this.levelObjectsList = null;
		this.levelMap = null;
		com.isartdigital.operationaaa.game.GameManager.getInstance().background.destroy();
		com.isartdigital.operationaaa.game.GameManager.getInstance().backgroundTransparent.destroy();
		haxe.Log.trace("\n\n===> Fin de la destruction du niveau " + new Date().getTime(),{ fileName : "LevelLoader.hx", lineNumber : 508, className : "com.isartdigital.operationaaa.game.leveldesign.LevelLoader", methodName : "destroyCurrentLevel"});
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.leveldesign.LevelLoader.instance = null;
	}
	,get_currentSavedData: function() {
		return this.currentSavedData;
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.LevelLoader
};
com.isartdigital.operationaaa.game.leveldesign.LevelManager = function() {
	this.previousBottomRow = 0;
	this.previousTopRow = 0;
	this.previousRightColumn = 0;
	this.previousLeftColumn = 0;
	this.bottomRow = 0;
	this.topRow = 0;
	this.rightColumn = 0;
	this.leftColumn = 0;
	this.verticalClippingMargin = 560;
	this.horizontalClippingMargin = 1120;
	this.gridSize = 280;
};
$hxClasses["com.isartdigital.operationaaa.game.leveldesign.LevelManager"] = com.isartdigital.operationaaa.game.leveldesign.LevelManager;
com.isartdigital.operationaaa.game.leveldesign.LevelManager.__name__ = ["com","isartdigital","operationaaa","game","leveldesign","LevelManager"];
com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance = function() {
	if(com.isartdigital.operationaaa.game.leveldesign.LevelManager.instance == null) com.isartdigital.operationaaa.game.leveldesign.LevelManager.instance = new com.isartdigital.operationaaa.game.leveldesign.LevelManager();
	return com.isartdigital.operationaaa.game.leveldesign.LevelManager.instance;
};
com.isartdigital.operationaaa.game.leveldesign.LevelManager.prototype = {
	init: function() {
		com.isartdigital.operationaaa.game.sprites.walls.Wall.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.platforms.Platform.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.Checkpoint.list = new haxe.ds.StringMap();
		com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list = new haxe.ds.StringMap();
		var lTimer = new Date().getTime();
		haxe.Log.trace("\n\n===> Début de l'initialisation du niveau : " + lTimer,{ fileName : "LevelManager.hx", lineNumber : 157, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "init"});
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().init();
		com.isartdigital.utils.game.GameStage.getInstance().getGameContainer().addChild(com.isartdigital.operationaaa.game.planes.GamePlane.getInstance());
		haxe.Log.trace("... Copying ObjectList from Saved Data",{ fileName : "LevelManager.hx", lineNumber : 162, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "init"});
		this.objectsList = this.createNewListFrom(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().levelObjectsList);
		this.lastCheckpoint = this.createNewListFrom(this.objectsList);
		this.mapWidth = com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().levelMap.length;
		this.mapHeight = com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().levelMap[0].length;
		this.levelWidthInPixels = this.mapWidth * this.gridSize;
		this.levelHeightInPixels = this.mapHeight * this.gridSize;
		haxe.Log.trace("...Calculating Map Size : " + this.mapWidth + " Columns x " + this.mapHeight + " Rows",{ fileName : "LevelManager.hx", lineNumber : 170, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "init"});
		haxe.Log.trace("...Calculating Map Size : " + this.levelWidthInPixels + " px x " + this.levelHeightInPixels + " px",{ fileName : "LevelManager.hx", lineNumber : 171, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "init"});
		if(this.levelHeightInPixels > 6720) com.isartdigital.utils.Debug.warn("ATTENTION VOUS DEVEZ LOADER UN JSON DE NIVEAU NON SUPéRIEUR à " + 6720 + " px");
		this.remapLevel();
		haxe.Log.trace("... Creating Player",{ fileName : "LevelManager.hx", lineNumber : 177, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "init"});
		this.objectsList.get("player").setupGameObject();
		this.initPools(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().pools);
		this.totalCollectablesInLD = 0;
		var $it0 = this.objectsList.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			if(lObject.get_type() == "Collectable") this.totalCollectablesInLD++;
		}
		haxe.Log.trace("... " + this.totalCollectablesInLD + " Collectables counted in the Level",{ fileName : "LevelManager.hx", lineNumber : 189, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "init"});
		this.checkClipping = $bind(this,this.doCheckClipping);
		var lTimer2 = new Date().getTime();
		haxe.Log.trace("\n\n===> Fin de l'initialisation du niveau : " + lTimer2 + ", soit " + (lTimer2 - lTimer) + " ms.",{ fileName : "LevelManager.hx", lineNumber : 196, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "init"});
		window.objectsList = this.objectsList;
		window.levelMap = this.levelMap;
		window.Collectables = com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list;
		window.Upgrades = com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list;
	}
	,createNewListFrom: function(pList) {
		var lList = new haxe.ds.StringMap();
		var $it0 = pList.iterator();
		while( $it0.hasNext() ) {
			var lSetter = $it0.next();
			lList.set(lSetter.id,lSetter);
		}
		return lList;
	}
	,remapLevel: function() {
		haxe.Log.trace("... Creating Clipping Map",{ fileName : "LevelManager.hx", lineNumber : 224, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "remapLevel"});
		this.levelMap = [];
		var _g1 = 0;
		var _g = this.mapWidth;
		while(_g1 < _g) {
			var i = _g1++;
			this.levelMap[i] = [];
			var _g3 = 0;
			var _g2 = this.mapHeight;
			while(_g3 < _g2) {
				var j = _g3++;
				this.levelMap[i][j] = new com.isartdigital.operationaaa.game.leveldesign.Cell();
			}
		}
		var $it0 = this.objectsList.iterator();
		while( $it0.hasNext() ) {
			var lSetter = $it0.next();
			if(lSetter.id == "player") continue;
			var _g4 = 0;
			var _g11 = lSetter.cells;
			while(_g4 < _g11.length) {
				var lCoords = _g11[_g4];
				++_g4;
				this.levelMap[lCoords.x][lCoords.y].add(lSetter.id);
			}
		}
	}
	,initPools: function(pPools) {
		haxe.Log.trace("*... Creating Pools",{ fileName : "LevelManager.hx", lineNumber : 250, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "initPools"});
		var _g = 0;
		var _g1 = Reflect.fields(pPools);
		while(_g < _g1.length) {
			var lType = _g1[_g];
			++_g;
			var lCount = Reflect.field(pPools,lType);
			var _g2 = 0;
			while(_g2 < lCount) {
				var i = _g2++;
				if(lType != "Player") com.isartdigital.utils.game.PoolManager.getInstance().createStateGraphic(lType);
			}
		}
	}
	,setLastCheckpoint: function() {
		this.lastCheckpoint = this.createNewListFrom(this.objectsList);
		haxe.Log.trace("object List saved",{ fileName : "LevelManager.hx", lineNumber : 261, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "setLastCheckpoint"});
	}
	,reloadLevelAtLastCheckpoint: function() {
		this.objectsList = this.createNewListFrom(this.lastCheckpoint);
		this.remapLevel();
		this.populateScreen();
		var lCount = 0;
		var $it0 = this.objectsList.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			if(lObject.get_type() == "Collectable") lCount++;
		}
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().set_collectibleCount(this.totalCollectablesInLD - lCount);
		haxe.Log.trace("LCount : " + lCount,{ fileName : "LevelManager.hx", lineNumber : 277, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "reloadLevelAtLastCheckpoint", customParams : [" totalCollectibles : " + this.totalCollectablesInLD]});
	}
	,populateScreen: function() {
		haxe.Log.trace("Populating Screen...",{ fileName : "LevelManager.hx", lineNumber : 286, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateScreen"});
		this.unclipEntireMap();
		this.calculateScreenAndClippingLimits();
		var lToClip = new haxe.ds.StringMap();
		var lCellContent;
		var _g1 = this.leftColumn;
		var _g = this.rightColumn + 1;
		while(_g1 < _g) {
			var col = _g1++;
			var _g3 = this.topRow;
			var _g2 = this.bottomRow + 1;
			while(_g3 < _g2) {
				var row = _g3++;
				lCellContent = this.levelMap[col][row].content;
				var _g4 = 0;
				while(_g4 < lCellContent.length) {
					var lInstanceName = lCellContent[_g4];
					++_g4;
					if(this.objectsList.get(lInstanceName) == null) {
						if(lInstanceName == null) haxe.Log.trace("WARNING: you are trying to remove an Object with no Id",{ fileName : "LevelManager.hx", lineNumber : 310, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateScreen"});
						if(!HxOverrides.remove(lCellContent,lInstanceName)) haxe.Log.trace("ERROR: removal of Object " + lInstanceName + " has failed.",{ fileName : "LevelManager.hx", lineNumber : 311, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateScreen"});
					} else {
						var value = this.objectsList.get(lInstanceName);
						lToClip.set(lInstanceName,value);
					}
				}
			}
		}
		var $it0 = lToClip.iterator();
		while( $it0.hasNext() ) {
			var lGoG = $it0.next();
		}
		this.clipObjects(lToClip);
		haxe.Log.trace("... Screen Populated",{ fileName : "LevelManager.hx", lineNumber : 324, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateScreen"});
	}
	,unclipEntireMap: function() {
		haxe.Log.trace("... Unclipping Level",{ fileName : "LevelManager.hx", lineNumber : 332, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
		var lToUnclip = new haxe.ds.StringMap();
		var lCellContent;
		var _g1 = 0;
		var _g = this.mapWidth;
		while(_g1 < _g) {
			var col = _g1++;
			var _g3 = 0;
			var _g2 = this.mapHeight;
			while(_g3 < _g2) {
				var row = _g3++;
				lCellContent = this.levelMap[col][row].content;
				var _g4 = 0;
				while(_g4 < lCellContent.length) {
					var lInstanceName = lCellContent[_g4];
					++_g4;
					if(this.objectsList.get(lInstanceName).inGameInstance == null) continue;
					if(lInstanceName == "player") continue;
					this.unclipObject(this.objectsList.get(lInstanceName).inGameInstance);
				}
			}
		}
		var lCount = 0;
		var $it0 = com.isartdigital.operationaaa.game.sprites.walls.Wall.list.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			haxe.Log.trace(lObject.id + " of Wall List",{ fileName : "LevelManager.hx", lineNumber : 353, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
			lCount++;
		}
		var $it1 = com.isartdigital.operationaaa.game.sprites.platforms.Platform.list.iterator();
		while( $it1.hasNext() ) {
			var lObject1 = $it1.next();
			haxe.Log.trace(lObject1.id + " of Platform List",{ fileName : "LevelManager.hx", lineNumber : 357, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
			lCount++;
		}
		var $it2 = com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list.iterator();
		while( $it2.hasNext() ) {
			var lObject2 = $it2.next();
			haxe.Log.trace(lObject2.id + " of Enemy List",{ fileName : "LevelManager.hx", lineNumber : 361, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
			lCount++;
		}
		var $it3 = com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list.iterator();
		while( $it3.hasNext() ) {
			var lObject3 = $it3.next();
			haxe.Log.trace(lObject3.id + " of KZ Static List",{ fileName : "LevelManager.hx", lineNumber : 365, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
			lCount++;
		}
		var $it4 = com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list.iterator();
		while( $it4.hasNext() ) {
			var lObject4 = $it4.next();
			haxe.Log.trace(lObject4.id + " of KZ Dynamic List",{ fileName : "LevelManager.hx", lineNumber : 369, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
			lCount++;
		}
		var $it5 = com.isartdigital.operationaaa.game.sprites.Checkpoint.list.iterator();
		while( $it5.hasNext() ) {
			var lObject5 = $it5.next();
			haxe.Log.trace(lObject5.id + " of Checkpoint List",{ fileName : "LevelManager.hx", lineNumber : 373, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
			lCount++;
		}
		var $it6 = com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.iterator();
		while( $it6.hasNext() ) {
			var lObject6 = $it6.next();
			haxe.Log.trace(lObject6.id + " of Collectable List",{ fileName : "LevelManager.hx", lineNumber : 377, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
			lCount++;
		}
		haxe.Log.trace(lCount + " objects remaining in the lists",{ fileName : "LevelManager.hx", lineNumber : 380, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "unclipEntireMap"});
	}
	,doCheckClipping: function() {
		this.calculateScreenAndClippingLimits();
		var lToClip = new haxe.ds.StringMap();
		var lToUnclip = new haxe.ds.StringMap();
		var lCellContent;
		if(this.leftColumn > this.previousLeftColumn) this.populateClippingListByColumns(lToUnclip,this.previousLeftColumn,this.leftColumn,this.previousTopRow,this.previousBottomRow); else if(this.leftColumn < this.previousLeftColumn) this.populateClippingListByColumns(lToClip,this.leftColumn,this.previousLeftColumn,this.topRow,this.bottomRow);
		if(this.rightColumn > this.previousRightColumn) this.populateClippingListByColumns(lToClip,this.rightColumn,this.previousRightColumn,this.topRow,this.bottomRow); else if(this.rightColumn < this.previousRightColumn) this.populateClippingListByColumns(lToUnclip,this.previousRightColumn,this.rightColumn,this.previousTopRow,this.previousBottomRow);
		if(this.topRow < this.previousTopRow) this.populateClippingListByRows(lToClip,this.topRow,this.previousTopRow,this.leftColumn,this.rightColumn); else if(this.topRow > this.previousTopRow) this.populateClippingListByRows(lToUnclip,this.previousTopRow,this.topRow,this.previousLeftColumn,this.previousRightColumn);
		if(this.bottomRow < this.previousBottomRow) this.populateClippingListByRows(lToUnclip,this.previousBottomRow,this.bottomRow,this.previousLeftColumn,this.previousRightColumn); else if(this.bottomRow > this.previousBottomRow) this.populateClippingListByRows(lToClip,this.bottomRow,this.previousBottomRow,this.leftColumn,this.rightColumn);
		this.clipObjects(lToClip);
		this.unclipObjects(lToUnclip);
	}
	,dontCheckClipping: function() {
	}
	,setModeCheckClipping: function() {
		this.checkClipping = $bind(this,this.doCheckClipping);
	}
	,setModeDontCheckClipping: function() {
		this.checkClipping = $bind(this,this.dontCheckClipping);
	}
	,calculateScreenAndClippingLimits: function() {
		this.screenRect = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(com.isartdigital.operationaaa.game.planes.GamePlane.getInstance());
		var lClippingZone = new PIXI.Rectangle(this.screenRect.x - this.horizontalClippingMargin,this.screenRect.y - this.verticalClippingMargin,this.screenRect.width + 2 * this.horizontalClippingMargin,this.screenRect.height + 2 * this.verticalClippingMargin);
		this.previousBottomRow = this.bottomRow;
		this.previousLeftColumn = this.leftColumn;
		this.previousRightColumn = this.rightColumn;
		this.previousTopRow = this.topRow;
		this.leftColumn = Std["int"](Math.floor(Math.floor(lClippingZone.x) / this.gridSize));
		this.leftColumn = Std["int"](Math.min(this.levelMap.length - 1,Math.max(0,this.leftColumn)));
		this.rightColumn = Std["int"](Math.ceil((Math.floor(lClippingZone.x) + lClippingZone.width) / this.gridSize) - 1);
		this.rightColumn = Std["int"](Math.min(this.levelMap.length - 1,Math.max(0,this.rightColumn)));
		this.topRow = Std["int"](Math.floor(Math.floor(lClippingZone.y) / this.gridSize));
		this.topRow = Std["int"](Math.min(this.levelMap[0].length - 1,Math.max(0,this.topRow)));
		this.bottomRow = Std["int"](Math.ceil((Math.floor(lClippingZone.y) + lClippingZone.height) / this.gridSize) - 1);
		this.bottomRow = Std["int"](Math.min(this.levelMap[0].length - 1,Math.max(0,this.bottomRow)));
	}
	,populateClippingListByColumns: function(pList,pColA,pColB,pRowTop,pRowBottom) {
		var lCellContent;
		var lLeftCol;
		var lRightCol;
		if(pColA > pColB) {
			lLeftCol = pColB + 1;
			lRightCol = pColA + 1;
		} else {
			lLeftCol = pColA;
			lRightCol = pColB;
		}
		var _g = lLeftCol;
		while(_g < lRightCol) {
			var lCol = _g++;
			var _g2 = pRowTop;
			var _g1 = pRowBottom + 1;
			while(_g2 < _g1) {
				var lRow = _g2++;
				lCellContent = this.levelMap[lCol][lRow].content;
				var _g3 = 0;
				while(_g3 < lCellContent.length) {
					var lInstanceName = lCellContent[_g3];
					++_g3;
					if(this.objectsList.get(lInstanceName) == null) {
						if(lInstanceName == null) haxe.Log.trace("WARNING: you are trying to remove an Object with no Id",{ fileName : "LevelManager.hx", lineNumber : 570, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByColumns"});
						if(!HxOverrides.remove(lCellContent,lInstanceName)) haxe.Log.trace("ERROR: removal of Object " + lInstanceName + " has failed.",{ fileName : "LevelManager.hx", lineNumber : 571, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByColumns"});
					} else {
						var value = this.objectsList.get(lInstanceName);
						pList.set(lInstanceName,value);
					}
				}
			}
		}
		var _g11 = pRowTop;
		var _g4 = pRowBottom + 1;
		while(_g11 < _g4) {
			var lRow1 = _g11++;
			lCellContent = this.levelMap[pColB][lRow1].content;
			var _g21 = 0;
			while(_g21 < lCellContent.length) {
				var lInstanceName1 = lCellContent[_g21];
				++_g21;
				if(this.objectsList.get(lInstanceName1) == null) {
					if(lInstanceName1 == null) haxe.Log.trace("WARNING: you are trying to remove an Object with no Id",{ fileName : "LevelManager.hx", lineNumber : 585, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByColumns"});
					if(!HxOverrides.remove(lCellContent,lInstanceName1)) haxe.Log.trace("ERROR: removal of Object " + lInstanceName1 + " has failed.",{ fileName : "LevelManager.hx", lineNumber : 586, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByColumns"});
				} else pList.remove(lInstanceName1);
			}
		}
	}
	,populateClippingListByRows: function(pList,pRowA,pRowB,pLeftCol,pRightCol) {
		var lCellContent;
		var lTopRow;
		var lBottomRow;
		if(pRowA > pRowB) {
			lTopRow = pRowB + 1;
			lBottomRow = pRowA + 1;
		} else {
			lTopRow = pRowA;
			lBottomRow = pRowB;
		}
		var _g = lTopRow;
		while(_g < lBottomRow) {
			var lRow = _g++;
			var _g2 = pLeftCol;
			var _g1 = pRightCol + 1;
			while(_g2 < _g1) {
				var lCol = _g2++;
				lCellContent = this.levelMap[lCol][lRow].content;
				var _g3 = 0;
				while(_g3 < lCellContent.length) {
					var lInstanceName = lCellContent[_g3];
					++_g3;
					if(this.objectsList.get(lInstanceName) == null) {
						if(lInstanceName == null) haxe.Log.trace("WARNING: you are trying to remove an Object with no Id",{ fileName : "LevelManager.hx", lineNumber : 623, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByRows"});
						if(!HxOverrides.remove(lCellContent,lInstanceName)) haxe.Log.trace("ERROR: removal of Object " + lInstanceName + " has failed.",{ fileName : "LevelManager.hx", lineNumber : 624, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByRows"});
					} else {
						var value = this.objectsList.get(lInstanceName);
						pList.set(lInstanceName,value);
					}
				}
			}
		}
		var _g11 = pLeftCol;
		var _g4 = pRightCol + 1;
		while(_g11 < _g4) {
			var lCol1 = _g11++;
			lCellContent = this.levelMap[lCol1][pRowB].content;
			var _g21 = 0;
			while(_g21 < lCellContent.length) {
				var lInstanceName1 = lCellContent[_g21];
				++_g21;
				if(this.objectsList.get(lInstanceName1) == null) {
					if(lInstanceName1 == null) haxe.Log.trace("WARNING: you are trying to remove an Object with no Id",{ fileName : "LevelManager.hx", lineNumber : 637, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByRows"});
					if(!HxOverrides.remove(lCellContent,lInstanceName1)) haxe.Log.trace("ERROR: removal of Object " + lInstanceName1 + " has failed.",{ fileName : "LevelManager.hx", lineNumber : 638, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "populateClippingListByRows"});
				} else pList.remove(lInstanceName1);
			}
		}
	}
	,clipObjects: function(pList) {
		var $it0 = pList.iterator();
		while( $it0.hasNext() ) {
			var lSetter = $it0.next();
			lSetter.setupGameObject();
		}
	}
	,unclipObjects: function(pList) {
		var $it0 = pList.iterator();
		while( $it0.hasNext() ) {
			var lSetter = $it0.next();
			if(lSetter.inGameInstance == null) com.isartdigital.utils.Debug.warn("[LevelManager.unclipObjects] : " + lSetter.id + " of " + lSetter.get_type() + " is about to be unclipped but has no Game Object associated with. (Already Unclipped)"); else this.unclipObject(lSetter.inGameInstance);
		}
	}
	,unclipObject: function(pObject) {
		if(this.objectsList.get(pObject.id) == null || this.objectsList.get(pObject.id).plane == null) com.isartdigital.utils.Debug.warn("[LevelManager.unclipObject] Issue with " + Type.getClassName(Type.getClass(pObject)).split(":").pop() + " " + pObject.id);
		this.objectsList.get(pObject.id).plane.removeChild(pObject);
		com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.objectsList.get(pObject.id).get_type(),pObject);
		this.objectsList.get(pObject.id).unset();
	}
	,removeFromLevel: function(pObject) {
		var lId = pObject.id;
		this.unclipObject(pObject);
		if(lId == null) haxe.Log.trace("WARNING: you are trying to remove an Object with no Id",{ fileName : "LevelManager.hx", lineNumber : 696, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "removeFromLevel"});
		if(!this.objectsList.remove(lId)) haxe.Log.trace("ERROR: removal of Object " + lId + " has failed.",{ fileName : "LevelManager.hx", lineNumber : 697, className : "com.isartdigital.operationaaa.game.leveldesign.LevelManager", methodName : "removeFromLevel"});
	}
	,destroyLevel: function() {
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().destroy();
		com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().destroyCurrentLevel();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.game.leveldesign.LevelManager
};
com.isartdigital.utils = {};
com.isartdigital.utils.game = {};
com.isartdigital.utils.game.GameObject = function() {
	pixi.display.DisplayObjectContainer.call(this);
	this.setModeVoid();
};
$hxClasses["com.isartdigital.utils.game.GameObject"] = com.isartdigital.utils.game.GameObject;
com.isartdigital.utils.game.GameObject.__name__ = ["com","isartdigital","utils","game","GameObject"];
com.isartdigital.utils.game.GameObject.__super__ = pixi.display.DisplayObjectContainer;
com.isartdigital.utils.game.GameObject.prototype = $extend(pixi.display.DisplayObjectContainer.prototype,{
	setModeVoid: function() {
		this.doAction = $bind(this,this.doActionVoid);
	}
	,doActionVoid: function() {
	}
	,setModeNormal: function() {
		this.doAction = $bind(this,this.doActionNormal);
	}
	,doActionNormal: function() {
	}
	,start: function() {
		this.setModeNormal();
	}
	,destroy: function() {
		this.setModeVoid();
	}
	,__class__: com.isartdigital.utils.game.GameObject
});
com.isartdigital.operationaaa.game.planes = {};
com.isartdigital.operationaaa.game.planes.GamePlane = function() {
	com.isartdigital.utils.game.GameObject.call(this);
	this.groundsContainer = new pixi.display.DisplayObjectContainer();
	this.wallsContainer = new pixi.display.DisplayObjectContainer();
	this.platformsContainer = new pixi.display.DisplayObjectContainer();
	this.objectsContainer = new pixi.display.DisplayObjectContainer();
	this.playerContainer = new pixi.display.DisplayObjectContainer();
};
$hxClasses["com.isartdigital.operationaaa.game.planes.GamePlane"] = com.isartdigital.operationaaa.game.planes.GamePlane;
com.isartdigital.operationaaa.game.planes.GamePlane.__name__ = ["com","isartdigital","operationaaa","game","planes","GamePlane"];
com.isartdigital.operationaaa.game.planes.GamePlane.getInstance = function() {
	if(com.isartdigital.operationaaa.game.planes.GamePlane.instance == null) com.isartdigital.operationaaa.game.planes.GamePlane.instance = new com.isartdigital.operationaaa.game.planes.GamePlane();
	return com.isartdigital.operationaaa.game.planes.GamePlane.instance;
};
com.isartdigital.operationaaa.game.planes.GamePlane.__super__ = com.isartdigital.utils.game.GameObject;
com.isartdigital.operationaaa.game.planes.GamePlane.prototype = $extend(com.isartdigital.utils.game.GameObject.prototype,{
	init: function() {
		this.addChild(this.groundsContainer);
		this.addChild(this.wallsContainer);
		this.addChild(this.platformsContainer);
		this.addChild(this.objectsContainer);
		this.addChild(this.playerContainer);
		return this;
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.planes.GamePlane.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.game.planes.GamePlane
});
com.isartdigital.operationaaa.game.planes.ScrollingPlane = function(pAssets) {
	this.assetsArray = new Array();
	this.scrollSpeed = new PIXI.Point(1,1);
	this.partsArray = new Array();
	com.isartdigital.utils.game.GameObject.call(this);
	this.assetsArray = pAssets;
};
$hxClasses["com.isartdigital.operationaaa.game.planes.ScrollingPlane"] = com.isartdigital.operationaaa.game.planes.ScrollingPlane;
com.isartdigital.operationaaa.game.planes.ScrollingPlane.__name__ = ["com","isartdigital","operationaaa","game","planes","ScrollingPlane"];
com.isartdigital.operationaaa.game.planes.ScrollingPlane.__super__ = com.isartdigital.utils.game.GameObject;
com.isartdigital.operationaaa.game.planes.ScrollingPlane.prototype = $extend(com.isartdigital.utils.game.GameObject.prototype,{
	createParts: function() {
		var lScreenRect = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(this);
		var howManyPartsFitInScreen = Math.ceil(lScreenRect.width / 1239);
		var duplicateAllPartsCount = Math.ceil(howManyPartsFitInScreen / this.assetsArray.length) + 1;
		var _g1 = 0;
		var _g = this.assetsArray.length * duplicateAllPartsCount;
		while(_g1 < _g) {
			var i = _g1++;
			this.partsArray[i] = new PIXI.Sprite(PIXI.Texture.fromFrame(this.assetsArray[i % this.assetsArray.length]));
			this.partsArray[i].x = 1239 * i;
			this.addChild(this.partsArray[i]);
		}
		this.partDimensions = new PIXI.Rectangle(0,0,this.partsArray[0].width,this.partsArray[0].height);
	}
	,setModeNormal: function() {
		this.createParts();
		com.isartdigital.utils.game.GameObject.prototype.setModeNormal.call(this);
	}
	,doActionNormal: function() {
		this.x = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().x * this.scrollSpeed.x;
		this.y = (com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().y + this.height * 2) * this.scrollSpeed.y;
		if(this.toGlobal(this.partsArray[0].position).x + 1239 < 0 - this.partDimensions.width / 2) {
			this.partsArray[0].x = this.partsArray[this.partsArray.length - 1].x + 1239;
			this.partsArray.push(this.partsArray.shift());
		} else if(this.toGlobal(this.partsArray[this.partsArray.length - 1].position).x > com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(this).width) {
			this.partsArray[this.partsArray.length - 1].x = this.partsArray[0].x - 1239;
			this.partsArray.unshift(this.partsArray.pop());
		}
	}
	,destroy: function() {
		com.isartdigital.utils.game.GameObject.prototype.destroy.call(this);
		this.parent.removeChild(this);
	}
	,__class__: com.isartdigital.operationaaa.game.planes.ScrollingPlane
});
com.isartdigital.utils.game.StateGraphic = function() {
	this.boxType = com.isartdigital.utils.game.BoxType.NONE;
	this.DEFAULT_STATE = "";
	com.isartdigital.utils.game.GameObject.call(this);
};
$hxClasses["com.isartdigital.utils.game.StateGraphic"] = com.isartdigital.utils.game.StateGraphic;
com.isartdigital.utils.game.StateGraphic.__name__ = ["com","isartdigital","utils","game","StateGraphic"];
com.isartdigital.utils.game.StateGraphic.set_textureDigits = function(pDigits) {
	com.isartdigital.utils.game.StateGraphic.digits = "";
	var _g = 0;
	while(_g < pDigits) {
		var i = _g++;
		com.isartdigital.utils.game.StateGraphic.digits += "0";
	}
	return com.isartdigital.utils.game.StateGraphic.textureDigits = pDigits;
};
com.isartdigital.utils.game.StateGraphic.addTextures = function(pJson) {
	var lFrames = Reflect.field(pJson,"frames");
	if(com.isartdigital.utils.game.StateGraphic.texturesDefinition == null) com.isartdigital.utils.game.StateGraphic.texturesDefinition = new haxe.ds.StringMap();
	if(com.isartdigital.utils.game.StateGraphic.digits == null) com.isartdigital.utils.game.StateGraphic.set_textureDigits(com.isartdigital.utils.game.StateGraphic.textureDigits);
	var lID;
	var lNum;
	var _g = 0;
	var _g1 = Reflect.fields(lFrames);
	while(_g < _g1.length) {
		var lID1 = _g1[_g];
		++_g;
		lID1 = lID1.split(".")[0];
		lNum = Std.parseInt(HxOverrides.substr(lID1,-1 * com.isartdigital.utils.game.StateGraphic.textureDigits,null));
		if(lNum != null) lID1 = HxOverrides.substr(lID1,0,lID1.length - com.isartdigital.utils.game.StateGraphic.textureDigits);
		if(com.isartdigital.utils.game.StateGraphic.texturesDefinition.get(lID1) == null) {
			var v;
			if(lNum == null) v = 1; else v = lNum;
			com.isartdigital.utils.game.StateGraphic.texturesDefinition.set(lID1,v);
			v;
		} else if(lNum > com.isartdigital.utils.game.StateGraphic.texturesDefinition.get(lID1)) {
			com.isartdigital.utils.game.StateGraphic.texturesDefinition.set(lID1,lNum);
			lNum;
		}
	}
	if(com.isartdigital.utils.game.StateGraphic.texturesCache == null) com.isartdigital.utils.game.StateGraphic.texturesCache = new haxe.ds.StringMap();
};
com.isartdigital.utils.game.StateGraphic.clearTextures = function(pJson) {
	var lFrames = Reflect.field(pJson,"frames");
	if(com.isartdigital.utils.game.StateGraphic.texturesDefinition == null) return;
	var lID;
	var lNum;
	var _g = 0;
	var _g1 = Reflect.fields(lFrames);
	while(_g < _g1.length) {
		var lID1 = _g1[_g];
		++_g;
		lID1 = lID1.split(".")[0];
		lNum = Std.parseInt(HxOverrides.substr(lID1,-1 * com.isartdigital.utils.game.StateGraphic.textureDigits,null));
		if(lNum != null) lID1 = HxOverrides.substr(lID1,0,lID1.length - com.isartdigital.utils.game.StateGraphic.textureDigits);
		com.isartdigital.utils.game.StateGraphic.texturesDefinition.set(lID1,null);
		null;
		com.isartdigital.utils.game.StateGraphic.texturesCache.set(lID1,null);
		null;
	}
};
com.isartdigital.utils.game.StateGraphic.addBoxes = function(pJson) {
	if(com.isartdigital.utils.game.StateGraphic.boxesCache == null) com.isartdigital.utils.game.StateGraphic.boxesCache = new haxe.ds.StringMap();
	var lItem;
	var lObj;
	var _g = 0;
	var _g1 = Reflect.fields(pJson);
	while(_g < _g1.length) {
		var lName = _g1[_g];
		++_g;
		lItem = Reflect.field(pJson,lName);
		var v = new haxe.ds.StringMap();
		com.isartdigital.utils.game.StateGraphic.boxesCache.set(lName,v);
		v;
		var _g2 = 0;
		var _g3 = Reflect.fields(lItem);
		while(_g2 < _g3.length) {
			var lObjName = _g3[_g2];
			++_g2;
			lObj = Reflect.field(lItem,lObjName);
			if(lObj.type == "Rectangle") {
				var this1 = com.isartdigital.utils.game.StateGraphic.boxesCache.get(lName);
				var v1 = new PIXI.Rectangle(lObj.x,lObj.y,lObj.width,lObj.height);
				this1.set(lObjName,v1);
				v1;
			} else if(lObj.type == "Ellipse") {
				var this2 = com.isartdigital.utils.game.StateGraphic.boxesCache.get(lName);
				var v2 = new PIXI.Ellipse(lObj.x,lObj.y,lObj.width / 2,lObj.height / 2);
				this2.set(lObjName,v2);
				v2;
			} else if(lObj.type == "Circle") {
				var this3 = com.isartdigital.utils.game.StateGraphic.boxesCache.get(lName);
				var v3 = new PIXI.Circle(lObj.x,lObj.y,lObj.radius);
				this3.set(lObjName,v3);
				v3;
			} else if(lObj.type == "Point") {
				var this4 = com.isartdigital.utils.game.StateGraphic.boxesCache.get(lName);
				var v4 = new PIXI.Point(lObj.x,lObj.y);
				this4.set(lObjName,v4);
				v4;
			}
		}
	}
};
com.isartdigital.utils.game.StateGraphic.addAnchors = function(pJson) {
	if(com.isartdigital.utils.game.StateGraphic.anchorsCache == null) com.isartdigital.utils.game.StateGraphic.anchorsCache = new haxe.ds.StringMap();
	var lAnchor;
	var _g = 0;
	var _g1 = Reflect.fields(pJson);
	while(_g < _g1.length) {
		var lName = _g1[_g];
		++_g;
		lAnchor = Reflect.field(pJson,lName);
		var v = new PIXI.Point(lAnchor.x,lAnchor.y);
		com.isartdigital.utils.game.StateGraphic.anchorsCache.set(lName,v);
		v;
	}
};
com.isartdigital.utils.game.StateGraphic.__super__ = com.isartdigital.utils.game.GameObject;
com.isartdigital.utils.game.StateGraphic.prototype = $extend(com.isartdigital.utils.game.GameObject.prototype,{
	setAnimEnd: function() {
		this.isAnimEnd = true;
	}
	,setState: function(pState,pLoop,pAutoPlay,pStart) {
		if(pStart == null) pStart = 0;
		if(pAutoPlay == null) pAutoPlay = true;
		if(pLoop == null) pLoop = false;
		if(this.state == pState) return;
		if(this.assetName == null) this.assetName = Type.getClassName(Type.getClass(this)).split(".").pop();
		this.state = pState;
		if(this.anim == null) {
			this.anim = new PIXI.MovieClip(this.getTextures(this.state));
			this.anim.scale.set(1 / com.isartdigital.utils.system.DeviceCapabilities.textureRatio,1 / com.isartdigital.utils.system.DeviceCapabilities.textureRatio);
			if(com.isartdigital.utils.game.StateGraphic.animAlpha < 1) this.anim.alpha = com.isartdigital.utils.game.StateGraphic.animAlpha;
			this.addChild(this.anim);
		} else this.anim.textures = this.getTextures(this.state);
		this.isAnimEnd = false;
		this.anim.onComplete = $bind(this,this.setAnimEnd);
		this.anim.loop = pLoop;
		if(this.anim.totalFrames > 1) this.anim.gotoAndStop(pStart); else this.anim.gotoAndStop(0);
		if(pAutoPlay) this.anim.play();
		if(this.box == null) {
			if(this.boxType == com.isartdigital.utils.game.BoxType.SELF) {
				this.box = this.anim;
				return;
			} else {
				this.box = new pixi.display.DisplayObjectContainer();
				if(this.boxType != com.isartdigital.utils.game.BoxType.NONE) this.createBox();
			}
			this.addChild(this.box);
		} else if(this.boxType == com.isartdigital.utils.game.BoxType.MULTIPLE) {
			this.removeChild(this.box);
			this.box = new pixi.display.DisplayObjectContainer();
			this.createBox();
			this.addChild(this.box);
		}
		this.setAnimAnchor(pState);
	}
	,update: function() {
		if(this.stage == null) {
			com.isartdigital.utils.Debug.warn("[StateGraphic.update] Vous essayez de mettre à jour un StateGraphic qui n'est pas attaché à la DisplayList, la mise à jour est ignorée.");
			return;
		}
		this.updateTransform();
		if(this.box == null) {
			com.isartdigital.utils.Debug.warn("StateGraphic.update] Vous essayez de mettre à jour un StateGraphic qui n'est pas été setState : " + this.id);
			return;
		}
		this.box.updateTransform();
	}
	,createBox: function() {
		var lBoxes = this.getBox((this.boxType == com.isartdigital.utils.game.BoxType.MULTIPLE?this.state + "_":"") + "box");
		var lChild;
		var $it0 = lBoxes.keys();
		while( $it0.hasNext() ) {
			var lBox = $it0.next();
			lChild = new PIXI.Graphics();
			lChild.alpha = com.isartdigital.utils.game.StateGraphic.boxAlpha;
			lChild.beginFill(16720418);
			if(Std["is"](lBoxes.get(lBox),PIXI.Rectangle)) lChild.drawRect(lBoxes.get(lBox).x,lBoxes.get(lBox).y,lBoxes.get(lBox).width,lBoxes.get(lBox).height); else if(Std["is"](lBoxes.get(lBox),PIXI.Ellipse)) lChild.drawEllipse(lBoxes.get(lBox).x,lBoxes.get(lBox).y,lBoxes.get(lBox).width,lBoxes.get(lBox).height); else if(Std["is"](lBoxes.get(lBox),PIXI.Circle)) lChild.drawCircle(lBoxes.get(lBox).x,lBoxes.get(lBox).y,lBoxes.get(lBox).radius); else if(Std["is"](lBoxes.get(lBox),PIXI.Point)) lChild.drawCircle(0,0,10);
			lChild.endFill();
			lChild.updateCache();
			lChild.name = lBox;
			if(Std["is"](lBoxes.get(lBox),PIXI.Point)) lChild.position.set(lBoxes.get(lBox).x,lBoxes.get(lBox).y); else lChild.hitArea = lBoxes.get(lBox);
			this.box.addChild(lChild);
		}
		this.box.renderable = false;
	}
	,getTextures: function(pState) {
		var lID;
		if(pState == this.DEFAULT_STATE) lID = this.assetName + ""; else lID = this.assetName + "_" + pState + "";
		if(com.isartdigital.utils.game.StateGraphic.texturesCache.get(lID) == null) {
			var lFrames = com.isartdigital.utils.game.StateGraphic.texturesDefinition.get(lID);
			if((function($this) {
				var $r;
				var $int = lFrames;
				$r = $int < 0?4294967296.0 + $int:$int + 0.0;
				return $r;
			}(this)) == 1) {
				var v = [PIXI.Texture.fromFrame(lID + ".png")];
				com.isartdigital.utils.game.StateGraphic.texturesCache.set(lID,v);
				v;
			} else {
				var v1 = new Array();
				com.isartdigital.utils.game.StateGraphic.texturesCache.set(lID,v1);
				v1;
				var _g1 = 1;
				var _g = lFrames + 1;
				while(_g1 < _g) {
					var i = _g1++;
					com.isartdigital.utils.game.StateGraphic.texturesCache.get(lID).push(PIXI.Texture.fromFrame(lID + HxOverrides.substr(com.isartdigital.utils.game.StateGraphic.digits + i,-1 * com.isartdigital.utils.game.StateGraphic.textureDigits,null) + ".png"));
				}
			}
		}
		if(this.assetName == "leftcontrollerzero") haxe.Log.trace(com.isartdigital.utils.game.StateGraphic.texturesCache.get(lID),{ fileName : "StateGraphic.hx", lineNumber : 307, className : "com.isartdigital.utils.game.StateGraphic", methodName : "getTextures"});
		return com.isartdigital.utils.game.StateGraphic.texturesCache.get(lID);
	}
	,getBox: function(pState) {
		return com.isartdigital.utils.game.StateGraphic.boxesCache.get(this.assetName + "_" + pState);
	}
	,getAnchor: function(pState) {
		var lAnchorName;
		if(pState == this.DEFAULT_STATE) lAnchorName = this.assetName; else lAnchorName = this.assetName + "_" + pState;
		return com.isartdigital.utils.game.StateGraphic.anchorsCache.get(lAnchorName);
	}
	,setAnimAnchor: function(pState) {
		var lAnchor = this.getAnchor(pState);
		if(lAnchor != null) this.anim.pivot.set(lAnchor.x,lAnchor.y);
	}
	,pause: function() {
		if(this.anim != null) this.anim.stop();
	}
	,resume: function() {
		if(this.anim != null) this.anim.play();
	}
	,get_hitBox: function() {
		return this.box;
	}
	,get_hitPoints: function() {
		return null;
	}
	,destroy: function() {
		this.anim.stop();
		this.removeChild(this.anim);
		this.anim = null;
		this.removeChild(this.box);
		this.box = null;
		com.isartdigital.utils.game.GameObject.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.utils.game.StateGraphic
});
com.isartdigital.operationaaa.game.sprites = {};
com.isartdigital.operationaaa.game.sprites.Mobile = function() {
	this.maxVSpeed = 0;
	this.maxHSpeed = 0;
	this.speed = new PIXI.Point(0,0);
	this.friction = new PIXI.Point(0,0);
	this.acceleration = new PIXI.Point(0,0);
	com.isartdigital.utils.game.StateGraphic.call(this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.Mobile"] = com.isartdigital.operationaaa.game.sprites.Mobile;
com.isartdigital.operationaaa.game.sprites.Mobile.__name__ = ["com","isartdigital","operationaaa","game","sprites","Mobile"];
com.isartdigital.operationaaa.game.sprites.Mobile.__super__ = com.isartdigital.utils.game.StateGraphic;
com.isartdigital.operationaaa.game.sprites.Mobile.prototype = $extend(com.isartdigital.utils.game.StateGraphic.prototype,{
	move: function() {
		this.speed.x += this.acceleration.x;
		this.speed.y += this.acceleration.y;
		this.speed.x *= this.friction.x;
		this.speed.y *= this.friction.y;
		this.speed.x = (this.speed.x < 0?-1:1) * Math.min(Math.abs(this.speed.x),this.maxHSpeed);
		this.speed.y = (this.speed.y < 0?-1:1) * Math.min(Math.abs(this.speed.y),this.maxVSpeed);
		this.y += this.speed.y;
		this.x += this.speed.x;
		this.acceleration.set(0,0);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.Mobile
});
com.isartdigital.operationaaa.game.sprites.Collisionnable = function() {
	com.isartdigital.operationaaa.game.sprites.Mobile.call(this);
	this.boxType = com.isartdigital.utils.game.BoxType.SIMPLE;
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.Collisionnable"] = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.Collisionnable.__name__ = ["com","isartdigital","operationaaa","game","sprites","Collisionnable"];
com.isartdigital.operationaaa.game.sprites.Collisionnable.__super__ = com.isartdigital.operationaaa.game.sprites.Mobile;
com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Mobile.prototype,{
	setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Mobile.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.doAction = $bind(this,this.doActionNormal);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.Collisionnable
});
com.isartdigital.operationaaa.game.sprites.Checkpoint = function() {
	this.isActivated = false;
	this.isScaled = false;
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.assetName = "Checkpoint";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.Checkpoint"] = com.isartdigital.operationaaa.game.sprites.Checkpoint;
com.isartdigital.operationaaa.game.sprites.Checkpoint.__name__ = ["com","isartdigital","operationaaa","game","sprites","Checkpoint"];
com.isartdigital.operationaaa.game.sprites.Checkpoint.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.Checkpoint.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	set: function(pId,pIsActivated) {
		this.id = pId;
		com.isartdigital.operationaaa.game.sprites.Checkpoint.list.set(this.id,this);
		this.isActivated = pIsActivated;
		if(!this.isActivated) {
			com.isartdigital.operationaaa.game.sprites.Checkpoint.inactiveList.set(this.id,this);
			this.setModeNormal();
		} else this.setModeActive();
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) haxe.Log.trace("WARNING: you are trying to remove a Checkpoint with no Id",{ fileName : "Checkpoint.hx", lineNumber : 69, className : "com.isartdigital.operationaaa.game.sprites.Checkpoint", methodName : "unset"});
		if(!com.isartdigital.operationaaa.game.sprites.Checkpoint.list.remove(this.id)) haxe.Log.trace("ERROR: removal of Checkpoint " + this.id + " has failed.",{ fileName : "Checkpoint.hx", lineNumber : 70, className : "com.isartdigital.operationaaa.game.sprites.Checkpoint", methodName : "unset"});
		if(!this.isActivated && !com.isartdigital.operationaaa.game.sprites.Checkpoint.inactiveList.remove(this.id)) haxe.Log.trace("ERROR: removal of Checkpoint " + this.id + " has failed.",{ fileName : "Checkpoint.hx", lineNumber : 71, className : "com.isartdigital.operationaaa.game.sprites.Checkpoint", methodName : "unset"});
	}
	,setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.setModeNormal.call(this);
		if(!this.isActivated) this.setState(this.DEFAULT_STATE); else this.setState("active");
		if(!this.isScaled) {
			this.anim.scale.x = this.anim.scale.y *= 2;
			this.isScaled = true;
		}
	}
	,onCollision: function() {
		com.isartdigital.utils.sounds.SoundManager.getSound("activate_checkpoint").play();
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().setLastCheckpoint();
		this.setModeActive();
	}
	,setModeActive: function() {
		this.setState("active");
		this.isActivated = true;
		if(this.id == null) haxe.Log.trace("WARNING: you are trying to remove a Checkpoint with no Id",{ fileName : "Checkpoint.hx", lineNumber : 99, className : "com.isartdigital.operationaaa.game.sprites.Checkpoint", methodName : "setModeActive"});
		if(!com.isartdigital.operationaaa.game.sprites.Checkpoint.inactiveList.remove(this.id)) haxe.Log.trace("ERROR: removal of Checkpoint " + this.id + " has failed.",{ fileName : "Checkpoint.hx", lineNumber : 100, className : "com.isartdigital.operationaaa.game.sprites.Checkpoint", methodName : "setModeActive"});
	}
	,get_hitBox: function() {
		if(!this.isActivated) return this.box.getChildByName("mcGlobalBox");
		return null;
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.Checkpoint
});
com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint = function() {
	com.isartdigital.operationaaa.game.sprites.Checkpoint.call(this);
	this.assetName = "Checkpoint";
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint"] = com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint;
com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.__name__ = ["com","isartdigital","operationaaa","game","sprites","EndLevelCheckpoint"];
com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.getInstance = function() {
	if(com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.instance == null) com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.instance = new com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint();
	return com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.instance;
};
com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.__super__ = com.isartdigital.operationaaa.game.sprites.Checkpoint;
com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Checkpoint.prototype,{
	setModeActive: function() {
		com.isartdigital.utils.sounds.SoundManager.getSound("activate_checkpoint").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openPopin(com.isartdigital.operationaaa.ui.popin.WinInterlevel.getInstance());
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint
});
com.isartdigital.operationaaa.game.sprites.Player = function() {
	this.chargeSound = null;
	this.startCounterToInvincibility = false;
	this.haveShieldActivate = false;
	this.counterLimit = 100;
	this.counterInvincibility = 0;
	this.fallCounterToJump = 2;
	this.haveMagnet = false;
	this.isFinish = false;
	this.counter = 0;
	this.delayShootCounter = 4;
	this.upgradeShootCounter = 15;
	this.haveShield = false;
	this.shootColors = ["ShootPlayer_Blue","ShootPlayer_DarkBlue","ShootPlayer_Green","ShootPlayer_Orange","ShootPlayer_RoseViolet"];
	this.actionShield = (function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("collectibleCounter",0);
		_g.set("collectibleNecessary",5);
		$r = _g;
		return $r;
	}(this));
	this.actionShoot = (function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("haveSuperShoot",false);
		_g.set("lastShoot",false);
		$r = _g;
		return $r;
	}(this));
	this.actionJump = (function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("haveDoubleJump",false);
		_g.set("canDoubleJump",true);
		_g.set("lastJump",true);
		_g.set("isDoubleJump",false);
		_g.set("jumpBefore",false);
		$r = _g;
		return $r;
	}(this));
	this.sizeOfReplacement = 10;
	this.impulseCounter = 0;
	this.impulseDuration = 10;
	this.GRAVITY_NORMAL = 3;
	this.GRAVITY_JUMP = 2;
	this.gravity = 3;
	this.impulse = 15;
	this.frictionAir = new PIXI.Point(0.92,0.92);
	this.accelerationAir = 2;
	this.frictionGround = 0.45;
	this.accelerationGround = 14;
	this.RESPAWN = "respawn";
	this.DEATH = "death";
	this.DOUBLE_JUMP = "doublejump";
	this.LANDING = "reception";
	this.FALL = "fall";
	this.JUMP = "jump";
	this.WALK = "walk";
	this.WAIT = "wait";
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.controller = com.isartdigital.operationaaa.controller.KeyboardController.getInstance();
	this.maxHSpeed = 16;
	this.maxVSpeed = 35;
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.Player"] = com.isartdigital.operationaaa.game.sprites.Player;
com.isartdigital.operationaaa.game.sprites.Player.__name__ = ["com","isartdigital","operationaaa","game","sprites","Player"];
com.isartdigital.operationaaa.game.sprites.Player.getInstance = function() {
	if(com.isartdigital.operationaaa.game.sprites.Player.instance == null) com.isartdigital.operationaaa.game.sprites.Player.instance = new com.isartdigital.operationaaa.game.sprites.Player();
	return com.isartdigital.operationaaa.game.sprites.Player.instance;
};
com.isartdigital.operationaaa.game.sprites.Player.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.Player.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	takeCameraFocus: function() {
		if(this.state == null) this.setState(this.DEFAULT_STATE);
		com.isartdigital.utils.game.Camera.getInstance().setFocus(this.box.getChildByName("mcCamera"));
	}
	,start: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.start.call(this);
		this.respawnPoint = new PIXI.Point(this.x,this.y);
		this.floor = null;
		this.takeCameraFocus();
	}
	,get_hitBox: function() {
		return this.box.getChildByName("mcGlobalBox");
	}
	,getSuperShoot: function() {
		return this.actionShoot.get("haveSuperShoot");
	}
	,getShield: function() {
		return this.haveShield;
	}
	,flipLeft: function() {
		this.scale.x = -1;
	}
	,flipRight: function() {
		this.scale.x = 1;
	}
	,hitBottom: function() {
		return this.box.getChildByName("mcBottom").position;
	}
	,hitTop: function() {
		return this.box.getChildByName("mcTop").position;
	}
	,checkTop: function() {
		return this.box.getChildByName("mcCaneTop").position;
	}
	,checkBottom: function() {
		return this.box.getChildByName("mcCaneBottom").position;
	}
	,checkFront: function() {
		return this.box.getChildByName("mcFront").position;
	}
	,checkBack: function() {
		return this.box.getChildByName("mcBack").position;
	}
	,checkFrontTop: function() {
		return this.box.getChildByName("mcCaneTopRight").position;
	}
	,checkBackTop: function() {
		return this.box.getChildByName("mcCaneTopLeft").position;
	}
	,checkCaneFront: function() {
		return this.box.getChildByName("mcCaneFront").position;
	}
	,onCrosshair: function() {
		return this.box.getChildByName("mcCrosshair").position;
	}
	,getLeft: function() {
		if(this.scale.x == 1) return this.checkBack(); else return this.checkFront();
	}
	,getRight: function() {
		if(this.scale.x == 1) return this.checkFront(); else return this.checkBack();
	}
	,testPoint: function(pList,pPoint) {
		var $it0 = pList.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			if(com.isartdigital.utils.game.CollisionManager.hitTestPoint(lObject.get_hitBox(),this.box.toGlobal(pPoint))) return lObject;
		}
		return null;
	}
	,testCollectibles: function(pList) {
		var $it0 = pList.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			if(com.isartdigital.utils.game.CollisionManager.hitTestObject(this.get_hitBox(),(js.Boot.__cast(lObject , com.isartdigital.operationaaa.game.sprites.collectables.Collectable)).get_hitBox())) return lObject;
		}
		return null;
	}
	,testBox: function(pList,pBox) {
		var $it0 = pList.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			if(com.isartdigital.utils.game.CollisionManager.hitTestObject(lObject.get_hitBox(),pBox)) return lObject;
		}
		return null;
	}
	,hitCheckpoint: function() {
		var checkpointHit = this.testBox(com.isartdigital.operationaaa.game.sprites.Checkpoint.inactiveList,this.get_hitBox());
		if(checkpointHit == null) return; else {
			var checkpoint;
			checkpoint = js.Boot.__cast(checkpointHit , com.isartdigital.operationaaa.game.sprites.Checkpoint);
			checkpoint.onCollision();
			var lRespawnCheckpoint = new PIXI.Point(checkpoint.box.getChildByName("mcRespawnPoint").x,checkpoint.box.getChildByName("mcRespawnPoint").y);
			this.respawnPoint.set(checkpoint.x + lRespawnCheckpoint.x,checkpoint.y + lRespawnCheckpoint.y - 80);
		}
	}
	,hitFloor: function(pPoint) {
		if(pPoint == null) pPoint = this.hitBottom();
		var lCollision = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,pPoint);
		if(lCollision == null) lCollision = this.testPoint(com.isartdigital.operationaaa.game.sprites.platforms.Platform.list,pPoint);
		if(lCollision != null) {
			this.floor = js.Boot.__cast(lCollision , com.isartdigital.operationaaa.game.sprites.Collisionnable);
			this.actionJump.set("jumpBefore",false);
			false;
			this.y = lCollision.y;
			return true;
		}
		this.floor = null;
		return false;
	}
	,hitSides: function() {
		this.hitSide(this.getRight(),-1);
		this.hitSide(this.getLeft(),1);
		this.hitSide(this.checkBackTop(),1);
		this.hitSide(this.checkFrontTop(),-1);
	}
	,hitSide: function(pPoint,pCoef) {
		var lCollision = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,pPoint);
		if(lCollision != null) {
			this.speed.x = 0;
			this.x += this.sizeOfReplacement * pCoef;
		}
	}
	,hitCeil: function() {
		var lCeil = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.hitTop());
		if(lCeil != null) {
			this.speed.y = 0;
			this.y = lCeil.y + lCeil.get_hitBox().height + this.get_hitBox().height;
			this.setModeFall();
		}
	}
	,hitEnemies: function() {
		var lEnemy = this.testBox(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list,this.get_hitBox());
		var lKillZoneD = this.testBox(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list,this.get_hitBox());
		var lKillZoneS = this.testBox(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list,this.get_hitBox());
		if(lEnemy == null && lKillZoneD == null && lKillZoneS == null) return false; else {
			var lBy;
			if(lEnemy == null) {
				if(lKillZoneD == null) lBy = lKillZoneS.id; else lBy = lKillZoneD.id;
			} else lBy = lEnemy.id;
			if(lEnemy == null) this.counterLimit = 100;
			return true;
		}
	}
	,killIfHitEnnemies: function() {
		if(this.hitEnemies()) this.kill();
	}
	,hitCollectible: function() {
		var lObject = this.testBox(com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list,this.get_hitBox());
		if(lObject == null) return; else {
			(js.Boot.__cast(lObject , com.isartdigital.operationaaa.game.sprites.collectables.Collectable)).onPickup();
			var v = this.actionShield.get("collectibleCounter") + 1;
			this.actionShield.set("collectibleCounter",v);
			v;
		}
	}
	,hitUpgrade: function() {
		var lObject = this.testBox(com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list,this.get_hitBox());
		if(lObject == null) return; else {
			(js.Boot.__cast(lObject , com.isartdigital.operationaaa.game.sprites.collectables.Upgrade)).onPickup();
			this.setModeVoid();
		}
	}
	,canJump: function() {
		var lCeil = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.checkTop());
		this.checkInputJump();
		if(this.controller.get_jump() && lCeil == null && this.actionJump.get("lastJump")) return true;
		return false;
	}
	,checkInputJump: function() {
		if(!this.controller.get_jump()) {
			this.actionJump.set("lastJump",true);
			true;
		}
		return this.actionJump.get("lastJump");
	}
	,canFall: function() {
		if(this.floor != null && this.testPoint((function($this) {
			var $r;
			var _g = new haxe.ds.StringMap();
			_g.set("",$this.floor);
			$r = _g;
			return $r;
		}(this)),this.checkBottom()) == this.floor) return false;
		return !this.hitFloor(this.checkBottom());
	}
	,canWalk: function() {
		var lWall = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.checkCaneFront());
		if(lWall == null) return true;
		return false;
	}
	,applyAcceleration: function(pAcceleration) {
		if(this.controller.get_left()) {
			if(this.canWalk()) this.acceleration.x = -pAcceleration;
			this.flipLeft();
		} else if(this.controller.get_right()) {
			if(this.canWalk()) this.acceleration.x = pAcceleration;
			this.flipRight();
		}
	}
	,defineShootMode: function(pState,pLoop) {
		if(pLoop == null) pLoop = false;
		if(this.controller.get_fire()) {
			this.counter++;
			this.actionShoot.set("lastShoot",true);
			true;
			if(this.counter > this.upgradeShootCounter - this.delayShootCounter && this.actionShoot.get("haveSuperShoot")) {
				this.setState(pState + "Charge",true);
				if(this.chargeSound == null) {
					this.chargeSound = com.isartdigital.utils.sounds.SoundManager.getSound("player_charge");
					this.chargeSound.loop(true);
					this.chargeSound.play();
				}
			}
		} else if(!this.controller.get_fire() && this.actionShoot.get("lastShoot")) {
			if(this.counter > this.upgradeShootCounter && this.actionShoot.get("haveSuperShoot")) this.createShoot("ShootPlayerPower_Yellow",true); else {
				var alea = Math.floor(Math.random() * this.shootColors.length);
				this.createShoot(this.shootColors[alea]);
			}
			this.setState(pState + "Shoot",pLoop);
			this.actionShoot.set("lastShoot",false);
			false;
			this.counter = 0;
		}
		this.manageShootMode(pState);
	}
	,manageShootMode: function(pState) {
		if(this.state != pState && this.isAnimEnd) {
			this.isFinish = true;
			if(this.chargeSound != null) {
				this.chargeSound.stop();
				this.chargeSound = null;
			}
		}
		if(this.isFinish) {
			this.setState(pState);
			this.isFinish = false;
		}
	}
	,moveWithGravity: function() {
		this.acceleration.y += this.gravity;
		this.move();
	}
	,createShoot: function(pAsset,pIsSuperShoot) {
		if(pIsSuperShoot == null) pIsSuperShoot = false;
		var lPoint = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().toLocal(this.box.toGlobal(this.onCrosshair()));
		var lShoot;
		lShoot = js.Boot.__cast(com.isartdigital.utils.game.PoolManager.getInstance().getFromPool(pAsset) , com.isartdigital.operationaaa.game.sprites.shoot.Shoot);
		lShoot.set(15,0.67,this.scale,lPoint,true,pIsSuperShoot);
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().addChild(lShoot);
		if(pIsSuperShoot) com.isartdigital.utils.sounds.SoundManager.getSound("player_superfire").play(); else com.isartdigital.utils.sounds.SoundManager.getSound("player_fire").play();
	}
	,kill: function() {
		this.setModeDeath();
	}
	,respawn: function() {
		this.setState(this.RESPAWN);
		com.isartdigital.utils.sounds.SoundManager.getSound("respawn").play();
		com.isartdigital.operationaaa.game.GameManager.getInstance().respawnAt(Math.round(this.respawnPoint.x),Math.round(this.respawnPoint.y));
		var _g = 0;
		var _g1 = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[0];
		while(_g < _g1.length) {
			var lShoot = _g1[_g];
			++_g;
			lShoot.destroy();
		}
		var _g2 = 0;
		var _g11 = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[1];
		while(_g2 < _g11.length) {
			var lShoot1 = _g11[_g2];
			++_g2;
			lShoot1.destroy();
		}
	}
	,isInvicible: function() {
		if(this.haveShieldActivate) {
			if(this.hitEnemies()) {
				this.startCounterToInvincibility = true;
				com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.getInstance().setModeNormal();
			}
		} else {
			this.killIfHitEnnemies();
			this.startCounterToInvincibility = false;
			this.counterInvincibility = 0;
		}
		if(this.startCounterToInvincibility) {
			this.counterInvincibility++;
			if(this.counterInvincibility > 30 && this.counterInvincibility % 2 == 0) this.alpha += 0.1; else this.alpha -= 0.01;
			if(this.counterInvincibility > this.counterLimit) {
				this.alpha = 1;
				this.haveShieldActivate = false;
			}
		}
	}
	,setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.setModeNormal.call(this);
		this.boxType = com.isartdigital.utils.game.BoxType.NONE;
		this.setState(this.WAIT);
	}
	,doActionNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.doActionNormal.call(this);
		if(this.canJump()) this.setModeJump(); else if(this.canFall()) this.setModeFall(); else if(this.controller.get_right() || this.controller.get_left()) this.setModeWalk(); else this.defineShootMode(this.WAIT);
		this.checkUpdate();
	}
	,setModeWalk: function() {
		this.setState(this.WALK,true);
		this.friction.set(this.frictionGround,0);
		this.anim.animationSpeed = 0.5;
		this.doAction = $bind(this,this.doActionWalk);
	}
	,doActionWalk: function() {
		this.applyAcceleration(this.accelerationGround);
		this.move();
		this.hitSides();
		this.hitCheckpoint();
		if(this.canJump()) this.setModeJump(); else if(this.canFall()) this.setModeFall();
		this.defineShootMode(this.WALK);
		if(Math.abs(this.speed.x) < 1) this.setModeNormal();
		this.checkUpdate();
	}
	,setModeJump: function() {
		if(this.actionJump.get("isDoubleJump")) this.setState(this.DOUBLE_JUMP); else this.setState(this.JUMP);
		this.gravity = this.GRAVITY_JUMP;
		this.friction.set(this.frictionAir.x,this.frictionAir.y);
		this.impulseCounter = 0;
		this.actionJump.set("lastJump",false);
		false;
		this.actionJump.set("jumpBefore",true);
		true;
		this.doAction = $bind(this,this.doActionJump);
	}
	,doActionJump: function() {
		this.applyAcceleration(this.accelerationAir);
		if(this.controller.get_jump()) {
			if((function($this) {
				var $r;
				var a = $this.impulseCounter++;
				var b = $this.impulseDuration;
				$r = (function($this) {
					var $r;
					var aNeg = b < 0;
					var bNeg = a < 0;
					$r = aNeg != bNeg?aNeg:b > a;
					return $r;
				}($this));
				return $r;
			}(this))) this.acceleration.y = -this.impulse; else this.impulseCounter = this.impulseDuration;
		}
		this.moveWithGravity();
		this.hitSides();
		this.hitCheckpoint();
		if(this.actionJump.get("isDoubleJump")) this.defineShootMode(this.DOUBLE_JUMP); else this.defineShootMode(this.JUMP);
		this.checkDoubleJump();
		if(this.speed.y > 0) this.setModeFall(); else this.hitCeil();
		this.checkUpdate();
	}
	,setModeFall: function() {
		this.setState(this.FALL);
		this.gravity = this.GRAVITY_NORMAL;
		this.friction.set(this.frictionAir.x,this.frictionAir.y);
		this.doAction = $bind(this,this.doActionFall);
		this.impulseCounter = 0;
	}
	,doActionFall: function() {
		this.applyAcceleration(this.accelerationAir);
		this.moveWithGravity();
		this.hitSides();
		this.hitCheckpoint();
		this.defineShootMode(this.FALL);
		if(this.hitFloor()) this.setModeLanding();
		this.fallCounterToJump--;
		if(this.fallCounterToJump > 0 && this.canJump() && !this.actionJump.get("jumpBefore")) {
			if(this.state == this.FALL) this.speed.y = 0;
			this.setModeJump();
		} else this.checkDoubleJump();
		this.checkUpdate();
	}
	,setModeLanding: function() {
		this.speed.y = 0;
		this.setState(this.LANDING);
		this.friction.set(this.frictionGround,0);
		this.actionJump.set("canDoubleJump",true);
		true;
		this.actionJump.set("isDoubleJump",false);
		false;
		this.fallCounterToJump = 2;
		this.doAction = $bind(this,this.doActionLanding);
	}
	,doActionLanding: function() {
		if(this.controller.get_right() || this.controller.get_left()) this.setModeWalk();
		this.move();
		this.defineShootMode(this.LANDING);
		if(this.isAnimEnd) {
			if(Math.abs(this.speed.x) < 1) this.setModeNormal(); else this.setModeWalk();
		}
		this.checkUpdate();
	}
	,setModeDeath: function() {
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().setModeDontCheckClipping();
		this.anim.animationSpeed = 0.3;
		this.deathCounter = 0;
		if(this.deathScreen != null) this.deathScreen.parent.removeChild(this.deathScreen);
		this.deathScreen = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/black_bg.png"));
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().addChild(this.deathScreen);
		this.isDead = true;
		var lScreen = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(this);
		var lTopLeft = new PIXI.Point(lScreen.x,lScreen.y);
		com.isartdigital.utils.ui.UIPosition.setPosition(this.deathScreen,"topLeft");
		this.deathScreen.width = lScreen.width;
		this.deathScreen.height = lScreen.height;
		this.deathScreen.alpha = 0;
		this.actionShield.set("collectibleCounter",0);
		0;
		this.doAction = $bind(this,this.doActionDeath);
		this.boxType = com.isartdigital.utils.game.BoxType.NONE;
		this.setState(this.DEATH);
	}
	,doActionDeath: function() {
		this.deathCounter++;
		if(this.deathCounter == 60.) {
			this.respawn();
			com.isartdigital.utils.game.Camera.getInstance().setPosition();
		}
		if(this.deathCounter >= 120) {
			this.deathScreen.parent.removeChild(this.deathScreen);
			this.deathScreen = null;
			this.isDead = false;
			return this.setModeNormal();
		}
		if(this.deathCounter < 60.) this.deathScreen.alpha += 0.016666666666666666; else this.deathScreen.alpha -= 0.016666666666666666;
	}
	,setUpgrade: function(pLevel) {
		if(pLevel == 1) {
			this.actionShoot.set("haveSuperShoot",true);
			true;
		} else if(pLevel == 2) {
			this.actionJump.set("haveDoubleJump",true);
			true;
		} else if(pLevel == 3) this.haveShield = true; else if(pLevel == 4) this.haveMagnet = true;
	}
	,checkDoubleJump: function() {
		if(this.canJump()) {
			if(this.actionJump.get("haveDoubleJump") && this.actionJump.get("canDoubleJump")) {
				this.actionJump.set("canDoubleJump",false);
				false;
				this.actionJump.set("isDoubleJump",true);
				true;
				if(this.state == this.FALL) this.speed.y = 0;
				this.setModeJump();
			}
		}
	}
	,checkShield: function() {
		if(this.haveShield && this.actionShield.get("collectibleCounter") == this.actionShield.get("collectibleNecessary")) {
			this.haveShieldActivate = true;
			com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.getInstance().setModeActif();
			com.isartdigital.utils.sounds.SoundManager.getSound("magic_shield").play();
			this.actionShield.set("collectibleCounter",0);
			0;
			this.anim.animationSpeed = 0.2;
		}
	}
	,checkMagnet: function() {
		if(this.haveMagnet) {
			com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.getInstance().setModeNormal();
			this.anim.animationSpeed = 0.2;
		}
	}
	,checkUpdate: function() {
		this.hitCollectible();
		this.hitUpgrade();
		this.checkShield();
		this.checkMagnet();
		this.isInvicible();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.sprites.Player.instance = null;
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.Player
});
com.isartdigital.operationaaa.game.sprites.Template = function() {
	com.isartdigital.utils.game.StateGraphic.call(this);
	this.boxType = com.isartdigital.utils.game.BoxType.SIMPLE;
	com.isartdigital.operationaaa.Main.getInstance().stage.click = com.isartdigital.operationaaa.Main.getInstance().stage.tap = $bind(this,this.onClick);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.Template"] = com.isartdigital.operationaaa.game.sprites.Template;
com.isartdigital.operationaaa.game.sprites.Template.__name__ = ["com","isartdigital","operationaaa","game","sprites","Template"];
com.isartdigital.operationaaa.game.sprites.Template.getInstance = function() {
	if(com.isartdigital.operationaaa.game.sprites.Template.instance == null) com.isartdigital.operationaaa.game.sprites.Template.instance = new com.isartdigital.operationaaa.game.sprites.Template();
	return com.isartdigital.operationaaa.game.sprites.Template.instance;
};
com.isartdigital.operationaaa.game.sprites.Template.__super__ = com.isartdigital.utils.game.StateGraphic;
com.isartdigital.operationaaa.game.sprites.Template.prototype = $extend(com.isartdigital.utils.game.StateGraphic.prototype,{
	setModeNormal: function() {
		this.setState(this.DEFAULT_STATE,true);
		this.anim.anchor.set(0.5,0.5);
		com.isartdigital.utils.game.StateGraphic.prototype.setModeNormal.call(this);
	}
	,onClick: function(pEvent) {
		haxe.Log.trace("Qui a fait ça ?",{ fileName : "Template.hx", lineNumber : 48, className : "com.isartdigital.operationaaa.game.sprites.Template", methodName : "onClick"});
		var lLocal = pEvent.getLocalPosition(this.parent);
		this.position.set(lLocal.x,lLocal.y);
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.sprites.Template.instance = null;
		com.isartdigital.utils.game.StateGraphic.prototype.destroy.call(this);
	}
	,testFunction: function() {
		haxe.Log.trace("testFunction Called",{ fileName : "Template.hx", lineNumber : 62, className : "com.isartdigital.operationaaa.game.sprites.Template", methodName : "testFunction"});
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.Template
});
com.isartdigital.operationaaa.game.sprites.collectables = {};
com.isartdigital.operationaaa.game.sprites.collectables.Collectable = function() {
	this.collected = false;
	this.alreadyCollected = false;
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.assetName = "Collectable";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.collectables.Collectable"] = com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
com.isartdigital.operationaaa.game.sprites.collectables.Collectable.__name__ = ["com","isartdigital","operationaaa","game","sprites","collectables","Collectable"];
com.isartdigital.operationaaa.game.sprites.collectables.Collectable.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.collectables.Collectable.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	set: function(pId,pAlreadyCollected) {
		this.id = pId;
		this.collected = false;
		this.alreadyCollected = pAlreadyCollected;
		if(this.alreadyCollected) this.setModeGhost();
		com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.set(pId,this);
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) com.isartdigital.utils.Debug.warn("[Collectable.unset] You are trying to unset a Collectable with no id");
		if(com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.exists(this.id)) com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.remove(this.id);
		if(com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.exists(this.id)) com.isartdigital.utils.Debug.warn("[Collectable.unset] Removal from list has failed for Collectable " + this.id);
		this.id = null;
	}
	,onPickup: function() {
		this.setModeCollected();
		com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().recordCollectablePickUp(this.id);
		var _g = com.isartdigital.operationaaa.ui.hud.Hud.getInstance();
		var _g1 = _g.get_collectibleCount();
		_g.set_collectibleCount(_g1 + 1);
		_g1;
		com.isartdigital.utils.sounds.SoundManager.getSound("pickup_collectable").play();
	}
	,setModeGhost: function() {
		this.setState(com.isartdigital.operationaaa.game.sprites.collectables.Collectable.GHOST);
		this.doAction = $bind(this,this.doActionNormal);
	}
	,setModeCollected: function() {
		this.setState(com.isartdigital.operationaaa.game.sprites.collectables.Collectable.COLLECTED);
		this.collected = true;
		this.doAction = $bind(this,this.doActionCollected);
		this.count = 0;
	}
	,doActionCollected: function() {
		if(this.count++ > 5) {
			this.count = 0;
			this.kill();
		}
	}
	,kill: function() {
		com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().removeFromLevel(this);
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.destroy.call(this);
	}
	,get_hitBox: function() {
		if(this.collected) return null; else return this.box.getChildByName("mcGlobalBox");
	}
	,get_hitPoint: function() {
		return this.box.getChildByName("mcCenter").position;
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.collectables.Collectable
});
com.isartdigital.operationaaa.game.sprites.collectables.Upgrade = function() {
	this.assetName = "UpgradeWin";
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.collectables.Upgrade"] = com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.__name__ = ["com","isartdigital","operationaaa","game","sprites","collectables","Upgrade"];
com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	set: function(pId) {
		this.id = pId;
		com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list.set(pId,this);
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) com.isartdigital.utils.Debug.warn("[Upgrade.unset] You are trying to unset a Upgrade with no id");
		if(com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list.exists(this.id)) com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list.remove(this.id);
		if(com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list.exists(this.id)) com.isartdigital.utils.Debug.warn("[Upgrade.unset] Removal from list has failed for Upgrade " + this.id);
		this.id = null;
	}
	,get_hitBox: function() {
		return this.box.getChildByName("mcGlobalBox");
	}
	,onPickup: function() {
		com.isartdigital.operationaaa.game.GameManager.getInstance().win();
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.collectables.Upgrade
});
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire = function() {
	com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.call(this);
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool("UpgradeFire",this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire"] = com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire.__name__ = ["com","isartdigital","operationaaa","game","sprites","collectables","UpgradeFire"];
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire.__super__ = com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire.prototype = $extend(com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype,{
	setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.gotoAndStop(0);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire
});
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump = function() {
	com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.call(this);
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool("UpgradeJump",this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump"] = com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump.__name__ = ["com","isartdigital","operationaaa","game","sprites","collectables","UpgradeJump"];
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump.__super__ = com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump.prototype = $extend(com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype,{
	setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE,false,false,2);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump
});
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet = function() {
	com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.call(this);
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool("UpgradeMagnet",this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet"] = com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet.__name__ = ["com","isartdigital","operationaaa","game","sprites","collectables","UpgradeMagnet"];
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet.__super__ = com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet.prototype = $extend(com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype,{
	setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE,false,false,4);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet
});
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield = function() {
	com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.call(this);
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool("UpgradeShield",this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield"] = com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield.__name__ = ["com","isartdigital","operationaaa","game","sprites","collectables","UpgradeShield"];
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield.__super__ = com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield.prototype = $extend(com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype,{
	setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE,false,false,3);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield
});
com.isartdigital.operationaaa.game.sprites.enemies = {};
com.isartdigital.operationaaa.game.sprites.enemies.Hostile = function() {
	this.maxSteps = 200;
	this.stepsCount = 0;
	this.accelerationAir = 0;
	this.accelerationGround = 0;
	this.frictionAir = 0;
	this.frictionGround = 0;
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.stepsCount = this.maxSteps;
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.Hostile"] = com.isartdigital.operationaaa.game.sprites.enemies.Hostile;
com.isartdigital.operationaaa.game.sprites.enemies.Hostile.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","Hostile"];
com.isartdigital.operationaaa.game.sprites.enemies.Hostile.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	get_hitBox: function() {
		return this.box.getChildByName("mcGlobalBox");
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.Hostile
});
com.isartdigital.operationaaa.game.sprites.enemies.Enemy = function() {
	this.lifePoints = 1;
	this.initialLifePoints = 1;
	this.countShoot = 0;
	this.PATROL = "walk";
	com.isartdigital.operationaaa.game.sprites.enemies.Hostile.call(this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.Enemy"] = com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
com.isartdigital.operationaaa.game.sprites.enemies.Enemy.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","Enemy"];
com.isartdigital.operationaaa.game.sprites.enemies.Enemy.__super__ = com.isartdigital.operationaaa.game.sprites.enemies.Hostile;
com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype = $extend(com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype,{
	set: function(pId,pLifePoints) {
		this.id = pId;
		com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list.set(this.id,this);
		this.lifePoints = pLifePoints;
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) com.isartdigital.utils.Debug.warn("[Enemy.unset] You are trying to remove an Enemy with no Id");
		if(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list.exists(this.id)) com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list.remove(this.id);
		if(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list.exists(this.id)) com.isartdigital.utils.Debug.warn("[Enemy.unset] Removal from list has failed for Enemy " + this.id);
		this.id = null;
	}
	,init: function() {
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype.destroy.call(this);
	}
	,testPoint: function(pList,pPoint) {
		var $it0 = pList.iterator();
		while( $it0.hasNext() ) {
			var lObject = $it0.next();
			if(com.isartdigital.utils.game.CollisionManager.hitTestPoint(lObject.get_hitBox(),this.box.toGlobal(pPoint))) return lObject;
		}
		return null;
	}
	,playerDetector: function() {
		return com.isartdigital.utils.game.CollisionManager.hitTestObject(com.isartdigital.operationaaa.game.sprites.Player.getInstance().get_hitBox(),this.checkDetector());
	}
	,checkDetector: function() {
		return this.box.getChildByName("mcDetector");
	}
	,onCrosshair: function() {
		return this.box.getChildByName("mcFirePoint").position;
	}
	,getFrontCaneTop: function() {
		return this.box.getChildByName("mcCaneFrontTop").position;
	}
	,getFrontCaneMid: function() {
		return this.box.getChildByName("mcCaneFrontMid").position;
	}
	,getFrontCaneBottom: function() {
		return this.box.getChildByName("mcCaneFrontBottom").position;
	}
	,get_hitBox: function() {
		if(this.state != "death") return this.box.getChildByName("mcGlobalBox");
		return null;
	}
	,canContinue: function() {
		var lCaneTop = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.getFrontCaneTop());
		var lCaneMid = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.getFrontCaneMid());
		var lCaneBottom1 = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.getFrontCaneBottom());
		var lCaneBottom2 = this.testPoint(com.isartdigital.operationaaa.game.sprites.platforms.Platform.list,this.getFrontCaneBottom());
		if(lCaneTop == null && lCaneMid == null && lCaneBottom1 != null || lCaneBottom2 != null) return true;
		return false;
	}
	,resetPath: function() {
		this.stepsCount = 0;
		this.accelerationGround *= -1;
	}
	,hurt: function(pDamage,shootScaleX) {
		if(shootScaleX == null) shootScaleX = 0;
		this.lifePoints -= pDamage;
		if(this.lifePoints <= 0) this.setModeDeath();
	}
	,setModeNormal: function() {
		this.setState("wait");
		this.doAction = $bind(this,this.doActionNormal);
	}
	,doActionNormal: function() {
		if(this.playerDetector()) {
			this.setModePatrol();
			com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		}
	}
	,setModePatrol: function() {
		this.setState(this.PATROL,true);
		this.doAction = $bind(this,this.doActionPatrol);
	}
	,doActionPatrol: function() {
		this.stepsCount++;
		if(!this.canContinue()) this.resetPath();
		if(this.accelerationGround >= 0) this.scale.x = 1; else this.scale.x = -1;
		if(this.stepsCount >= this.maxSteps) {
			this.accelerationGround *= -1;
			this.stepsCount = 0;
		}
		this.move();
		this.friction.set(this.frictionGround,0);
		this.acceleration.set(this.accelerationGround,0);
	}
	,setModeDeath: function() {
		this.setState("death");
		this.doAction = $bind(this,this.doActionDeath);
	}
	,doActionDeath: function() {
		if(this.isAnimEnd) com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().removeFromLevel(this);
	}
	,createShoot: function(pScale) {
		if(pScale == null) pScale = 0;
		var lPoint = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().toLocal(this.box.toGlobal(this.onCrosshair()));
		var lShoot;
		lShoot = js.Boot.__cast(com.isartdigital.utils.game.PoolManager.getInstance().getFromPool("ShootEnemyFire") , com.isartdigital.operationaaa.game.sprites.shoot.Shoot);
		lShoot.set(6,0.72,this.scale,lPoint,false);
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().addChild(lShoot);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.Enemy
});
com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb = function() {
	this.alive = true;
	com.isartdigital.operationaaa.game.sprites.enemies.Enemy.call(this);
	this.maxHSpeed = 5;
	this.maxSteps = 150;
	this.initialLifePoints = 3;
	this.assetName = "EnemyBomb";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb"] = com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb;
com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","EnemyBomb"];
com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb.__super__ = com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb.prototype = $extend(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype,{
	setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype.setModeNormal.call(this);
		this.anim.scale.x *= -1;
	}
	,checkExplosionDetector: function() {
		return this.box.getChildByName("mcExplosionDetector");
	}
	,doActionPatrol: function() {
		if(com.isartdigital.utils.game.CollisionManager.hitTestObject(com.isartdigital.operationaaa.game.sprites.Player.getInstance().get_hitBox(),this.checkExplosionDetector())) this.setModeExplosion();
		com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype.doActionPatrol.call(this);
	}
	,setModeExplosion: function() {
		haxe.Log.trace("explosion",{ fileName : "EnemyBomb.hx", lineNumber : 50, className : "com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb", methodName : "setModeExplosion"});
		haxe.Timer.delay($bind(this,this.explosion),2500);
		this.doAction = $bind(this,this.doActionVoid);
	}
	,explosion: function() {
		if(com.isartdigital.utils.game.CollisionManager.hitTestObject(com.isartdigital.operationaaa.game.sprites.Player.getInstance().get_hitBox(),this.checkExplosionDetector()) && this.alive) com.isartdigital.operationaaa.game.sprites.Player.getInstance().kill();
		var $it0 = com.isartdigital.operationaaa.game.sprites.walls.Wall.list.iterator();
		while( $it0.hasNext() ) {
			var lWall = $it0.next();
			var lDest;
			if((lWall instanceof com.isartdigital.operationaaa.game.sprites.walls.Destructible)) lDest = lWall; else lDest = null;
			if(lDest != null && com.isartdigital.utils.game.CollisionManager.hitTestObject(lDest.get_hitBox(),this.checkExplosionDetector())) com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().removeFromLevel(lDest);
		}
		this.setModeDeath();
	}
	,hurt: function(pDamage,shootScaleX) {
		if(shootScaleX == null) shootScaleX = 0;
		if(pDamage == 3) this.lifePoints -= pDamage; else this.createShoot(shootScaleX);
		if(this.lifePoints <= 0) this.alive = false;
	}
	,createShoot: function(pScale) {
		if(pScale == null) pScale = 0;
		var lScale = this.scale;
		if(pScale == 0) lScale.x = this.scale.x; else lScale.x = pScale *= -1;
		var lPoint = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().toLocal(this.box.toGlobal(this.onCrosshair()));
		var lShoot;
		lShoot = js.Boot.__cast(com.isartdigital.utils.game.PoolManager.getInstance().getFromPool("ShootEnemyFire") , com.isartdigital.operationaaa.game.sprites.shoot.Shoot);
		lShoot.set(10,0.67,lScale,lPoint,false);
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().addChild(lShoot);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb
});
com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire = function() {
	com.isartdigital.operationaaa.game.sprites.enemies.Enemy.call(this);
	this.maxHSpeed = 8;
	this.frictionGround = 1;
	this.accelerationGround = 0.75;
	this.maxSteps = 150;
	this.initialLifePoints = 6;
	this.assetName = "EnemyFire";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire"] = com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire;
com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","EnemyFire"];
com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire.__super__ = com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire.prototype = $extend(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype,{
	setModeNormal: function() {
		this.setState(this.PATROL,true);
		this.doAction = $bind(this,this.doActionPatrol);
	}
	,doActionPatrol: function() {
		if(this.playerDetector()) this.setModeFirePatrol();
		com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype.doActionPatrol.call(this);
	}
	,setModeFirePatrol: function() {
		this.doAction = $bind(this,this.doActionFirePatrol);
	}
	,doActionFirePatrol: function() {
		this.countShoot++;
		if(!this.playerDetector()) this.setModePatrol();
		if(this.countShoot >= 75) {
			this.createShoot();
			this.countShoot = 0;
		}
		com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype.doActionPatrol.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire
});
com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed = function() {
	com.isartdigital.operationaaa.game.sprites.enemies.Enemy.call(this);
	this.maxSteps = 100;
	this.maxHSpeed = 12;
	this.frictionGround = 1;
	this.accelerationGround = 1;
	this.initialLifePoints = 3;
	this.assetName = "EnemySpeed";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed"] = com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed;
com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","EnemySpeed"];
com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed.__super__ = com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed.prototype = $extend(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype,{
	canContinue: function() {
		var wallInFront = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.getFrontCaneTop());
		var walkableWall = this.testPoint(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,this.getFrontCaneBottom());
		var walkablePlatform = this.testPoint(com.isartdigital.operationaaa.game.sprites.platforms.Platform.list,this.getFrontCaneBottom());
		if(wallInFront == null && (walkableWall != null || walkablePlatform != null)) return true;
		return false;
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed
});
com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret = function() {
	this.DEATH = "death";
	this.ACTIVE = "fire";
	this.WAIT = "wait";
	com.isartdigital.operationaaa.game.sprites.enemies.Enemy.call(this);
	this.initialLifePoints = 4;
	this.assetName = "EnemyTurret";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret"] = com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret;
com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","EnemyTurret"];
com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret.__super__ = com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret.prototype = $extend(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.prototype,{
	createShoot: function(pScale) {
		if(pScale == null) pScale = 0;
		var lPoint = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().toLocal(this.box.toGlobal(this.onCrosshair()));
		var lRotation = Math.atan2(com.isartdigital.operationaaa.game.sprites.Player.getInstance().y - com.isartdigital.operationaaa.game.sprites.Player.getInstance().height / 3 - lPoint.y,com.isartdigital.operationaaa.game.sprites.Player.getInstance().x - lPoint.x);
		var lShoot;
		lShoot = js.Boot.__cast(com.isartdigital.utils.game.PoolManager.getInstance().getFromPool("ShootEnemyTurret") , com.isartdigital.operationaaa.game.sprites.shoot.Shoot);
		lShoot.set(3.5,0.75,this.scale,lPoint,false,false,lRotation,true);
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().addChild(lShoot);
		this.setState(this.WAIT,true);
		this.doAction = $bind(this,this.doActionNormal);
	}
	,doActionNormal: function() {
		if(this.playerDetector()) this.setModeShoot();
	}
	,setModeShoot: function() {
		this.setState(this.ACTIVE);
		this.doAction = $bind(this,this.doActionShoot);
	}
	,doActionShoot: function() {
		this.countShoot++;
		if(this.countShoot >= 120) {
			this.createShoot();
			this.countShoot = 0;
		}
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret
});
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic = function() {
	com.isartdigital.operationaaa.game.sprites.enemies.Hostile.call(this);
	this.assetName = "KillZoneDynamic";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
	this.frictionGround = 1;
	this.frictionAir = 1;
	this.friction.set(this.frictionGround,this.frictionAir);
	this.accelerationGround = 1;
	this.accelerationAir = 1;
	this.maxHSpeed = 15;
	this.maxVSpeed = 15;
	this.maxSteps = 70;
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic"] = com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","KillZoneDynamic"];
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.__super__ = com.isartdigital.operationaaa.game.sprites.enemies.Hostile;
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.prototype = $extend(com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype,{
	set: function(pId,pX,pY,pPathAngle) {
		this.id = pId;
		com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list.set(pId,this);
		this.x = pX;
		this.y = pY;
		this.rotation = 0;
		this.pathAngle = pPathAngle;
		this.acceleration.x = Math.round(Math.cos(-this.pathAngle) * this.accelerationGround);
		this.acceleration.y = Math.round(Math.sin(-this.pathAngle) * this.accelerationGround);
		this.stepsCount = 0;
		this.speed.x = Math.round(Math.cos(this.pathAngle) * this.maxHSpeed);
		this.speed.y = Math.round(Math.sin(this.pathAngle) * this.maxVSpeed);
		this.setModeNormal();
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) com.isartdigital.utils.Debug.warn("[KillZoneDynamic.unset] You are trying to remove an KillZoneDynamic with no Id");
		if(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list.exists(this.id) && !com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list.remove(this.id)) com.isartdigital.utils.Debug.error("[KillZoneDynamic.unset] Removal from list has failed for KillZoneDynamic " + this.id);
		this.id = null;
	}
	,flip: function() {
		this.stepsCount = 0;
		this.acceleration.x *= -1;
		this.acceleration.y *= -1;
	}
	,setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE,true);
	}
	,doActionNormal: function() {
		if(this.stepsCount >= this.maxSteps) this.flip();
		this.move();
		this.stepsCount++;
	}
	,move: function() {
		this.speed.x += this.acceleration.x;
		this.speed.y += this.acceleration.y;
		this.speed.x *= this.friction.x;
		this.speed.y *= this.friction.y;
		this.speed.x = (this.speed.x < 0?-1:1) * Math.min(Math.abs(this.speed.x),this.maxHSpeed);
		this.speed.y = (this.speed.y < 0?-1:1) * Math.min(Math.abs(this.speed.y),this.maxVSpeed);
		this.x += this.speed.x;
		this.y += this.speed.y;
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic
});
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic = function() {
	com.isartdigital.operationaaa.game.sprites.enemies.Hostile.call(this);
	this.assetName = "KillZoneStatic";
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic"] = com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.__name__ = ["com","isartdigital","operationaaa","game","sprites","enemies","KillZoneStatic"];
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.__super__ = com.isartdigital.operationaaa.game.sprites.enemies.Hostile;
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.prototype = $extend(com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype,{
	set: function(pId) {
		this.id = pId;
		com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list.set(pId,this);
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) com.isartdigital.utils.Debug.warn("[KillZoneStatic.unset] You are trying to remove an KillZoneStatic with no Id (already unset)");
		if(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list.exists(this.id)) com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list.remove(this.id);
		if(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list.exists(this.id)) com.isartdigital.utils.Debug.warn("[KillZoneStatic.unset] Removal from list has failed for KillZoneStatic " + this.id);
		this.id = null;
	}
	,get_hitBox: function() {
		return this.box.getChildByName("mcGlobalBox");
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.enemies.Hostile.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic
});
com.isartdigital.operationaaa.game.sprites.platforms = {};
com.isartdigital.operationaaa.game.sprites.platforms.Platform = function(pAssetName) {
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.assetName = pAssetName;
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.platforms.Platform"] = com.isartdigital.operationaaa.game.sprites.platforms.Platform;
com.isartdigital.operationaaa.game.sprites.platforms.Platform.__name__ = ["com","isartdigital","operationaaa","game","sprites","platforms","Platform"];
com.isartdigital.operationaaa.game.sprites.platforms.Platform.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.platforms.Platform.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	set: function(pId) {
		this.id = pId;
		com.isartdigital.operationaaa.game.sprites.platforms.Platform.list.set(pId,this);
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) com.isartdigital.utils.Debug.warn("[Platform.unset] You are trying to unset a Platform with no id");
		if(com.isartdigital.operationaaa.game.sprites.platforms.Platform.list.exists(this.id)) com.isartdigital.operationaaa.game.sprites.platforms.Platform.list.remove(this.id);
		if(com.isartdigital.operationaaa.game.sprites.platforms.Platform.list.exists(this.id)) com.isartdigital.utils.Debug.warn("[Platform.unset] Removal from list has failed for Platform " + this.id);
		this.id = null;
	}
	,get_hitBox: function() {
		return this.box.getChildByName("mcGlobalBox");
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.platforms.Platform
});
com.isartdigital.operationaaa.game.sprites.shoot = {};
com.isartdigital.operationaaa.game.sprites.shoot.Shoot = function(pAssetName) {
	this.isTurretShoot = false;
	this.END = "end";
	this.BEGIN = "begin";
	this.isASuperShoot = false;
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.assetName = pAssetName;
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.shoot.Shoot"] = com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
com.isartdigital.operationaaa.game.sprites.shoot.Shoot.__name__ = ["com","isartdigital","operationaaa","game","sprites","shoot","Shoot"];
com.isartdigital.operationaaa.game.sprites.shoot.Shoot.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.shoot.Shoot.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	set: function(pAcc,pFriction,pScale,pViseur,pIsPlayerShoot,superShoot,pRotation,pIsTurret) {
		if(pIsTurret == null) pIsTurret = false;
		if(pRotation == null) pRotation = 0;
		if(superShoot == null) superShoot = false;
		if(pIsPlayerShoot == null) pIsPlayerShoot = false;
		this.isPlayerShoot = pIsPlayerShoot;
		if(this.isPlayerShoot) com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[0].push(this); else com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[1].push(this);
		this.accelerationAir = pAcc;
		this.frictionAir = pFriction;
		this.maxHSpeed = 80;
		this.maxVSpeed = 80;
		this.scale.x = pScale.x;
		this.rotation = pRotation;
		this.isTurretShoot = pIsTurret;
		this.isASuperShoot = superShoot;
		this.position.set(pViseur.x,pViseur.y);
		this.start();
	}
	,unset: function() {
		this.setModeVoid();
		if(this.isPlayerShoot) com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[0].splice(HxOverrides.indexOf(com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[0],this,0),1); else com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[1].splice(HxOverrides.indexOf(com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[1],this,0),1);
	}
	,applyAcceleration: function() {
		if(this.scale.x == 1) this.acceleration.x = this.accelerationAir; else this.acceleration.x = -this.accelerationAir;
	}
	,moveWithDir: function() {
		if(this.rotation > 0 && this.rotation < Math.PI / 2 || this.rotation > 3 * Math.PI / 2 && this.rotation < 0) this.acceleration.x = -this.accelerationAir; else this.acceleration.x = this.accelerationAir;
		this.acceleration.y = this.accelerationAir;
		this.speed.x += this.acceleration.x;
		this.speed.y += this.acceleration.y;
		this.speed.x *= this.friction.x;
		this.speed.y *= this.friction.y;
		this.speed.x = (this.speed.x < 0?-1:1) * Math.min(Math.abs(this.speed.x),this.maxHSpeed);
		this.speed.y = (this.speed.y < 0?-1:1) * Math.min(Math.abs(this.speed.y),this.maxVSpeed);
		this.x += Math.cos(this.rotation) * this.speed.x;
		this.y += Math.sin(this.rotation) * this.speed.y;
		this.acceleration.set(0,0);
	}
	,hitObject: function(pList,pCondition) {
		if(pCondition) {
			var $it0 = pList.iterator();
			while( $it0.hasNext() ) {
				var lObject = $it0.next();
				if(com.isartdigital.utils.game.CollisionManager.hitTestObject(lObject.get_hitBox(),this.box)) {
					if(pList == com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list) {
						var enemy;
						enemy = js.Boot.__cast(lObject , com.isartdigital.operationaaa.game.sprites.enemies.Enemy);
						if(this.isASuperShoot) enemy.hurt(3); else enemy.hurt(1,this.scale.x);
					}
					return true;
				}
			}
		}
		return false;
	}
	,hitWall: function() {
		return this.hitObject(com.isartdigital.operationaaa.game.sprites.walls.Wall.list,!this.isTurretShoot);
	}
	,hitKillZone: function() {
		return this.hitObject(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list,!this.isTurretShoot);
	}
	,hitEnemies: function() {
		return this.hitObject(com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list,this.isPlayerShoot);
	}
	,hitPlayer: function() {
		if(!this.isPlayerShoot) {
			if(com.isartdigital.utils.game.CollisionManager.hitTestObject(com.isartdigital.operationaaa.game.sprites.Player.getInstance().get_hitBox(),this.get_hitBox())) {
				com.isartdigital.operationaaa.game.sprites.Player.getInstance().kill();
				return true;
			}
		}
		return false;
	}
	,isOutOfCamera: function() {
		if(!this.isTurretShoot) {
			var lRect = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(com.isartdigital.operationaaa.game.planes.GamePlane.getInstance());
			if(this.x > lRect.x + lRect.width || this.x < lRect.x || this.y > lRect.y + lRect.height || this.y < lRect.y) return true;
		}
		return false;
	}
	,setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.setModeNormal.call(this);
		if(this.isPlayerShoot) this.setState(this.DEFAULT_STATE,true); else this.setState(this.BEGIN,true);
		this.anim.loop = true;
		this.friction.set(this.frictionAir,this.frictionAir);
	}
	,doActionNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.doActionNormal.call(this);
		if(this.isTurretShoot) this.moveWithDir(); else {
			this.applyAcceleration();
			this.move();
		}
		if(this.isOutOfCamera()) this.backToPool(); else if(this.hitPlayer() || this.hitEnemies() || this.hitWall() || this.hitKillZone()) this.setModeEnd();
	}
	,setModeEnd: function() {
		this.anim.loop = false;
		this.setState(this.END);
		this.doAction = $bind(this,this.doActionEnd);
	}
	,doActionEnd: function() {
		if(this.isAnimEnd) this.backToPool();
	}
	,backToPool: function() {
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().removeChild(this);
		com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
		this.unset();
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.shoot.Shoot
});
com.isartdigital.operationaaa.game.sprites.upgradeActive = {};
com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet = function() {
	this.deltaT = com.isartdigital.operationaaa.Main.getInstance().frames / 2;
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.speed.x = 25;
	this.speed.y = 25;
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet"] = com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet;
com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.__name__ = ["com","isartdigital","operationaaa","game","sprites","upgradeActive","Magnet"];
com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.getInstance = function() {
	if(com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.instance == null) com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.instance = new com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet();
	return com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.instance;
};
com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	convergeCollectible: function() {
		return this.box.toGlobal(this.box.getChildByName("mcGetCollectible").position);
	}
	,setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.setModeNormal.call(this);
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().addChild(this);
		this.currentCollectible = new haxe.ds.StringMap();
	}
	,doActionNormal: function() {
		this.x = com.isartdigital.operationaaa.game.sprites.Player.getInstance().x - com.isartdigital.operationaaa.game.sprites.Player.getInstance().width * com.isartdigital.operationaaa.game.sprites.Player.getInstance().scale.x;
		this.y = com.isartdigital.operationaaa.game.sprites.Player.getInstance().y - com.isartdigital.operationaaa.game.sprites.Player.getInstance().height;
		var $it0 = com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list.iterator();
		while( $it0.hasNext() ) {
			var lStateGraphic = $it0.next();
			var lcurrentCollectible;
			lcurrentCollectible = js.Boot.__cast(lStateGraphic , com.isartdigital.operationaaa.game.sprites.collectables.Collectable);
			if(com.isartdigital.utils.game.CollisionManager.hitTestObject(this.get_hitBox(),lcurrentCollectible.get_hitBox())) this.currentCollectible.set(lcurrentCollectible.id,lcurrentCollectible);
		}
		this.collectCoins();
	}
	,collectCoins: function() {
		var $it0 = this.currentCollectible.iterator();
		while( $it0.hasNext() ) {
			var lCollectable = $it0.next();
			var lPoint = com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().toLocal(this.convergeCollectible());
			var angle = Math.atan2(lPoint.y - lCollectable.y,lPoint.x - lCollectable.x);
			lCollectable.height -= 15;
			lCollectable.width -= 20;
			lCollectable.x += Math.cos(angle) * ((-2 * this.deltaT * this.deltaT * this.deltaT + 3 * this.deltaT * this.deltaT) * this.speed.x);
			lCollectable.y += Math.sin(angle) * ((-2 * this.deltaT * this.deltaT * this.deltaT + 3 * this.deltaT * this.deltaT) * this.speed.y);
			if(lCollectable.width <= 100 || lCollectable.height <= 100) {
				lCollectable.onPickup();
				this.currentCollectible.remove(lCollectable.id);
			}
		}
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet
});
com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield = function() {
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield"] = com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield;
com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.__name__ = ["com","isartdigital","operationaaa","game","sprites","upgradeActive","Shield"];
com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.getInstance = function() {
	if(com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.instance == null) com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.instance = new com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield();
	return com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.instance;
};
com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	setModeNormal: function() {
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.setModeNormal.call(this);
		this.anim.visible = false;
		this.visible = false;
	}
	,setModeActif: function() {
		com.isartdigital.operationaaa.game.planes.GamePlane.getInstance().addChild(this);
		this.setState(this.DEFAULT_STATE,true);
		this.anim.anchor.set(0,0);
		this.anim.animationSpeed = 0.5;
		this.anim.visible = true;
		this.visible = true;
		this.doAction = $bind(this,this.doActionActif);
	}
	,doActionActif: function() {
		this.x = com.isartdigital.operationaaa.game.sprites.Player.getInstance().x - com.isartdigital.operationaaa.game.sprites.Player.getInstance().width * com.isartdigital.operationaaa.game.sprites.Player.getInstance().scale.x;
		this.y = com.isartdigital.operationaaa.game.sprites.Player.getInstance().y - com.isartdigital.operationaaa.game.sprites.Player.getInstance().height;
		var _g = 0;
		var _g1 = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[1];
		while(_g < _g1.length) {
			var lShoot = _g1[_g];
			++_g;
			if(com.isartdigital.utils.game.CollisionManager.hitTestObject(this.get_hitBox(),lShoot.get_hitBox())) {
				lShoot.setModeEnd();
				this.setModeNormal();
			}
		}
	}
	,destroy: function() {
		com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield
});
com.isartdigital.operationaaa.game.sprites.walls = {};
com.isartdigital.operationaaa.game.sprites.walls.Wall = function(pAssetName) {
	com.isartdigital.operationaaa.game.sprites.Collisionnable.call(this);
	this.assetName = pAssetName;
	com.isartdigital.utils.game.PoolManager.getInstance().addToPool(this.assetName,this);
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.walls.Wall"] = com.isartdigital.operationaaa.game.sprites.walls.Wall;
com.isartdigital.operationaaa.game.sprites.walls.Wall.__name__ = ["com","isartdigital","operationaaa","game","sprites","walls","Wall"];
com.isartdigital.operationaaa.game.sprites.walls.Wall.__super__ = com.isartdigital.operationaaa.game.sprites.Collisionnable;
com.isartdigital.operationaaa.game.sprites.walls.Wall.prototype = $extend(com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype,{
	set: function(pId) {
		this.id = pId;
		com.isartdigital.operationaaa.game.sprites.walls.Wall.list.set(pId,this);
	}
	,unset: function() {
		this.setModeVoid();
		if(this.id == null) com.isartdigital.utils.Debug.warn("[Wall.unset] You are trying to remove a Wall with no Id");
		if(com.isartdigital.operationaaa.game.sprites.walls.Wall.list.exists(this.id)) com.isartdigital.operationaaa.game.sprites.walls.Wall.list.remove(this.id);
		if(com.isartdigital.operationaaa.game.sprites.walls.Wall.list.exists(this.id)) com.isartdigital.utils.Debug.warn("[Wall.unset] Removal from list has failed for Wall " + this.id);
		this.id = null;
	}
	,get_hitBox: function() {
		return this.box.getChildByName("mcGlobalBox");
	}
	,destroy: function() {
		this.unset();
		com.isartdigital.operationaaa.game.sprites.Collisionnable.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.walls.Wall
});
com.isartdigital.operationaaa.game.sprites.walls.Destructible = function() {
	com.isartdigital.operationaaa.game.sprites.walls.Wall.call(this,"Destructible");
};
$hxClasses["com.isartdigital.operationaaa.game.sprites.walls.Destructible"] = com.isartdigital.operationaaa.game.sprites.walls.Destructible;
com.isartdigital.operationaaa.game.sprites.walls.Destructible.__name__ = ["com","isartdigital","operationaaa","game","sprites","walls","Destructible"];
com.isartdigital.operationaaa.game.sprites.walls.Destructible.__super__ = com.isartdigital.operationaaa.game.sprites.walls.Wall;
com.isartdigital.operationaaa.game.sprites.walls.Destructible.prototype = $extend(com.isartdigital.operationaaa.game.sprites.walls.Wall.prototype,{
	doActionNormal: function() {
		var _g = 0;
		var _g1 = com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list[0];
		while(_g < _g1.length) {
			var shoot = _g1[_g];
			++_g;
			if(shoot.isASuperShoot) {
				if(com.isartdigital.utils.game.CollisionManager.hitTestObject(this,shoot)) com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().removeFromLevel(this);
			}
		}
	}
	,__class__: com.isartdigital.operationaaa.game.sprites.walls.Destructible
});
com.isartdigital.operationaaa.ui = {};
com.isartdigital.operationaaa.ui.CheatPanel = function() {
	this.init();
};
$hxClasses["com.isartdigital.operationaaa.ui.CheatPanel"] = com.isartdigital.operationaaa.ui.CheatPanel;
com.isartdigital.operationaaa.ui.CheatPanel.__name__ = ["com","isartdigital","operationaaa","ui","CheatPanel"];
com.isartdigital.operationaaa.ui.CheatPanel.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.CheatPanel.instance == null) com.isartdigital.operationaaa.ui.CheatPanel.instance = new com.isartdigital.operationaaa.ui.CheatPanel();
	return com.isartdigital.operationaaa.ui.CheatPanel.instance;
};
com.isartdigital.operationaaa.ui.CheatPanel.prototype = {
	init: function() {
		if(com.isartdigital.utils.Config.get_debug() && com.isartdigital.utils.Config.get_data().cheat) this.gui = new dat.gui.GUI();
	}
	,ingame: function() {
		if(this.gui == null) return;
		this.gui.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"x",0,2048);
		this.gui.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"y",0,1366);
		this.gui.add(com.isartdigital.operationaaa.game.GameManager.getInstance(),"win");
		this.gui.add(com.isartdigital.operationaaa.game.GameManager.getInstance(),"winFinal");
		this.setCamera();
	}
	,setPlayer: function() {
		if(this.gui == null) return;
		var lPosition = this.gui.addFolder("position");
		lPosition.open();
		var lSpeed = this.gui.addFolder("speed");
		lSpeed.open();
		var lAcc = this.gui.addFolder("acceleration");
		lAcc.open();
		var lParams = this.gui.addFolder("friction");
		lParams.open();
		lPosition.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"state").listen();
		lSpeed.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().speed,"x").listen();
		lSpeed.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().speed,"y").listen();
		lSpeed.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"maxHSpeed").min(0).max(100).step(1).listen();
		lSpeed.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"maxVSpeed").min(0).max(100).step(1).listen();
		lAcc.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().acceleration,"x").listen();
		lAcc.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().acceleration,"y").listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"accelerationGround").min(0).max(100).step(1).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"frictionGround").min(0).max(1).step(0.01).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"accelerationAir").min(0).max(100).step(1).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().frictionAir,"x").min(0).max(1).step(0.01).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().frictionAir,"y").min(0).max(1).step(0.01).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"GRAVITY_JUMP").min(0).max(20).step(1).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"GRAVITY_NORMAL").min(0).max(20).step(1).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"impulse").min(0).max(50).step(1).listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"impulseDuration").listen();
		lParams.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance(),"impulseCounter").listen();
		this.trail = new com.isartdigital.utils.effects.Trail(com.isartdigital.operationaaa.game.sprites.Player.getInstance());
	}
	,setCamera: function() {
		if(this.gui == null) return;
		var lParams = this.gui.addFolder("Parameters");
		lParams.open();
		var lFocus = this.gui.addFolder("Focus");
		lFocus.open();
		lParams.add(com.isartdigital.utils.game.Camera.getInstance().inertiaMax,"x").min(1).max(100).listen();
		lParams.add(com.isartdigital.utils.game.Camera.getInstance().inertiaMax,"y").min(1).max(100).listen();
		lParams.add(com.isartdigital.utils.game.Camera.getInstance().inertiaMin,"x").min(1).max(100).listen();
		lParams.add(com.isartdigital.utils.game.Camera.getInstance().inertiaMin,"y").min(1).max(100).listen();
		lFocus.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().box.getChildByName("mcCamera").position,"x").step(5).listen();
		lFocus.add(com.isartdigital.operationaaa.game.sprites.Player.getInstance().box.getChildByName("mcCamera").position,"y").step(5).listen();
	}
	,clear: function() {
		if(this.gui == null) return;
		if(this.trail != null) {
			this.trail.destroy();
			this.trail = null;
		}
		this.gui.destroy();
		this.init();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.CheatPanel.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.ui.CheatPanel
};
com.isartdigital.operationaaa.ui.Feedback = function(pAssetName) {
	com.isartdigital.utils.game.StateGraphic.call(this);
	this.assetName = pAssetName;
};
$hxClasses["com.isartdigital.operationaaa.ui.Feedback"] = com.isartdigital.operationaaa.ui.Feedback;
com.isartdigital.operationaaa.ui.Feedback.__name__ = ["com","isartdigital","operationaaa","ui","Feedback"];
com.isartdigital.operationaaa.ui.Feedback.__super__ = com.isartdigital.utils.game.StateGraphic;
com.isartdigital.operationaaa.ui.Feedback.prototype = $extend(com.isartdigital.utils.game.StateGraphic.prototype,{
	init: function() {
		this.setState(this.DEFAULT_STATE);
		this.anim.anchor.set(0.5,0.5);
		this.anim.scale.set(0.5,0.5);
	}
	,__class__: com.isartdigital.operationaaa.ui.Feedback
});
com.isartdigital.operationaaa.ui.FeedbackManager = function() {
	window.addEventListener("leftTouchOriginEvent",$bind(this,this.feedbackLeftTouchOrigin));
	window.addEventListener("leftTouchMoveEvent",$bind(this,this.feedbackLeftTouchMove));
	window.addEventListener("leftTouchStopEvent",$bind(this,this.feedbackLeftTouchStop));
	window.addEventListener("rightTouchOriginEvent",$bind(this,this.feedbackRightTouchOrigin));
	window.addEventListener("rightTouchMoveEvent",$bind(this,this.feedbackRightTouchMove));
	window.addEventListener("rightTouchStopEvent",$bind(this,this.feedbackRightTouchStop));
	window.addEventListener("swapFeedbackToJumpEvent",$bind(this,this.feedbackSwapToJump));
	this.leftTouchPositionFeedback = new com.isartdigital.operationaaa.ui.Feedback("leftcontrollerposition");
	this.leftTouchPositionFeedback.init();
	this.leftTouchZeroFeedback = new com.isartdigital.operationaaa.ui.Feedback("leftcontrollerzero");
	this.leftTouchZeroFeedback.init();
	this.shootInputFeedback = new com.isartdigital.operationaaa.ui.Feedback("fire");
	this.shootInputFeedback.init();
	this.chargedShootInputFeedback = new com.isartdigital.operationaaa.ui.Feedback("charge");
	this.chargedShootInputFeedback.init();
	this.jumpInputFeedback = new com.isartdigital.operationaaa.ui.Feedback("jump");
	this.jumpInputFeedback.init();
	this.doubleJumpInputFeedback = new com.isartdigital.operationaaa.ui.Feedback("doublejump");
	this.doubleJumpInputFeedback.init();
	this.leftThumbPosition = new PIXI.Point(0,0);
	this.rightThumbPosition = new PIXI.Point(0,0);
};
$hxClasses["com.isartdigital.operationaaa.ui.FeedbackManager"] = com.isartdigital.operationaaa.ui.FeedbackManager;
com.isartdigital.operationaaa.ui.FeedbackManager.__name__ = ["com","isartdigital","operationaaa","ui","FeedbackManager"];
com.isartdigital.operationaaa.ui.FeedbackManager.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.FeedbackManager.instance == null) com.isartdigital.operationaaa.ui.FeedbackManager.instance = new com.isartdigital.operationaaa.ui.FeedbackManager();
	return com.isartdigital.operationaaa.ui.FeedbackManager.instance;
};
com.isartdigital.operationaaa.ui.FeedbackManager.prototype = {
	feedbackLeftTouchOrigin: function(pEvent) {
		this.leftThumbPosition.set(pEvent.detail.position.x,pEvent.detail.position.y);
		this.leftTouchZeroFeedback.position.set(this.leftThumbPosition.x,this.leftThumbPosition.y);
		com.isartdigital.operationaaa.Main.getInstance().stage.addChild(this.leftTouchZeroFeedback);
		this.leftTouchPositionFeedback.position.set(this.leftThumbPosition.x,this.leftThumbPosition.y);
		com.isartdigital.operationaaa.Main.getInstance().stage.addChild(this.leftTouchPositionFeedback);
	}
	,feedbackLeftTouchMove: function(pEvent) {
		this.leftThumbPosition.set(pEvent.detail.position.x,pEvent.detail.position.y);
		this.leftTouchZeroFeedback.position.set(pEvent.detail.origin.x,pEvent.detail.origin.y);
		this.leftTouchPositionFeedback.position.set(this.leftThumbPosition.x,this.leftThumbPosition.y);
	}
	,feedbackLeftTouchStop: function(pEvent) {
		this.leftThumbPosition.set(pEvent.detail.x,pEvent.detail.y);
		this.leftTouchZeroFeedback.position.set(this.leftThumbPosition.x,this.leftThumbPosition.y);
		com.isartdigital.operationaaa.Main.getInstance().stage.removeChild(this.leftTouchZeroFeedback);
		this.leftTouchPositionFeedback.position.set(this.leftThumbPosition.x,this.leftThumbPosition.y);
		com.isartdigital.operationaaa.Main.getInstance().stage.removeChild(this.leftTouchPositionFeedback);
	}
	,feedbackRightTouchOrigin: function(pEvent) {
		this.rightThumbPosition.set(pEvent.detail.position.x,pEvent.detail.position.y);
		this.rightThumbFeedback = this.shootInputFeedback;
		this.rightThumbFeedback.position.set(this.rightThumbPosition.x,this.rightThumbPosition.y);
		com.isartdigital.operationaaa.Main.getInstance().stage.addChild(this.rightThumbFeedback);
	}
	,feedbackRightTouchMove: function(pEvent) {
		this.rightThumbPosition.set(pEvent.detail.position.x,pEvent.detail.position.y);
		this.rightThumbFeedback.y = this.rightThumbPosition.y;
	}
	,feedbackRightTouchStop: function(pEvent) {
		this.rightThumbPosition.set(pEvent.detail.position.x,pEvent.detail.position.y);
		this.rightThumbFeedback.position.set(this.rightThumbPosition.x,this.rightThumbPosition.y);
		com.isartdigital.operationaaa.Main.getInstance().stage.removeChild(this.rightThumbFeedback);
	}
	,feedbackSwapToJump: function(pEvent) {
		com.isartdigital.operationaaa.Main.getInstance().stage.removeChild(this.rightThumbFeedback);
		this.rightThumbFeedback = this.jumpInputFeedback;
		this.rightThumbFeedback.position.set(this.rightThumbPosition.x,this.rightThumbPosition.y);
		com.isartdigital.operationaaa.Main.getInstance().stage.addChild(this.rightThumbFeedback);
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.FeedbackManager.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.ui.FeedbackManager
};
com.isartdigital.utils.ui = {};
com.isartdigital.utils.ui.UIComponent = function() {
	this.modalImage = "assets/alpha_bg.png";
	this._modal = true;
	pixi.display.DisplayObjectContainer.call(this);
};
$hxClasses["com.isartdigital.utils.ui.UIComponent"] = com.isartdigital.utils.ui.UIComponent;
com.isartdigital.utils.ui.UIComponent.__name__ = ["com","isartdigital","utils","ui","UIComponent"];
com.isartdigital.utils.ui.UIComponent.__super__ = pixi.display.DisplayObjectContainer;
com.isartdigital.utils.ui.UIComponent.prototype = $extend(pixi.display.DisplayObjectContainer.prototype,{
	open: function() {
		if(this.isOpened) return;
		this.isOpened = true;
		this.set_modal(this._modal);
		com.isartdigital.utils.game.GameStage.getInstance().addEventListener("GameStageEvent.RESIZE",$bind(this,this.onResize));
		this.onResize();
	}
	,get_modal: function() {
		return this._modal;
	}
	,set_modal: function(pModal) {
		this._modal = pModal;
		if(this._modal) {
			if(this.modalZone == null) {
				this.modalZone = new PIXI.Sprite(PIXI.Texture.fromImage(this.modalImage));
				this.modalZone.interactive = true;
				this.modalZone.click = this.modalZone.tap = $bind(this,this.stopPropagation);
			}
			if(this.parent != null) this.parent.addChildAt(this.modalZone,this.parent.getChildIndex(this));
		} else if(this.modalZone != null) {
			if(this.modalZone.parent != null) this.modalZone.parent.removeChild(this.modalZone);
			this.modalZone = null;
		}
		return this._modal;
	}
	,stopPropagation: function(pEvent) {
	}
	,close: function() {
		if(!this.isOpened) return;
		this.isOpened = false;
		this.set_modal(false);
		this.destroy();
	}
	,onResize: function(pEvent) {
		if(this.get_modal()) com.isartdigital.utils.ui.UIPosition.setPosition(this.modalZone,"fitScreen");
	}
	,destroy: function() {
		this.close();
	}
	,__class__: com.isartdigital.utils.ui.UIComponent
});
com.isartdigital.utils.ui.Screen = function() {
	com.isartdigital.utils.ui.UIComponent.call(this);
	this.modalImage = "assets/black_bg.png";
};
$hxClasses["com.isartdigital.utils.ui.Screen"] = com.isartdigital.utils.ui.Screen;
com.isartdigital.utils.ui.Screen.__name__ = ["com","isartdigital","utils","ui","Screen"];
com.isartdigital.utils.ui.Screen.__super__ = com.isartdigital.utils.ui.UIComponent;
com.isartdigital.utils.ui.Screen.prototype = $extend(com.isartdigital.utils.ui.UIComponent.prototype,{
	__class__: com.isartdigital.utils.ui.Screen
});
com.isartdigital.operationaaa.ui.GraphicLoader = function() {
	this.spritesCount = 10;
	com.isartdigital.utils.ui.Screen.call(this);
	this.funkySprites = [];
	var _g1 = 0;
	var _g = this.spritesCount;
	while(_g1 < _g) {
		var i = _g1++;
		var lSprite = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "preload_ovale.png"));
		lSprite.position.set(Math.floor(Math.random() * 2430) - 1215.,Math.floor(Math.random() * 1536) - 768.);
		this.addChild(lSprite);
		this.funkySprites.push(lSprite);
	}
	var title = new PIXI.Sprite(PIXI.Texture.fromFrame("preload_title.png"));
	title.anchor.set(0.5,0.5);
	title.y -= title.height / 2;
	this.addChild(title);
	var lBg = new PIXI.Sprite(PIXI.Texture.fromFrame("preload_bg.png"));
	lBg.anchor.set(0.5,0.5);
	lBg.y = 200;
	this.addChild(lBg);
	this.loaderBar = new PIXI.Sprite(PIXI.Texture.fromFrame("preload.png"));
	this.loaderBar.anchor.y = 0.5;
	this.loaderBar.anchor.x = 0.05;
	this.loaderBar.x = -this.loaderBar.width / 2 + 20;
	this.loaderBar.y = 200;
	this.addChild(this.loaderBar);
	this.loaderBar.scale.x = 0;
	com.isartdigital.operationaaa.Main.getInstance().addEventListener("GameEvent.GAME_LOOP",$bind(this,this.loaderLoop));
};
$hxClasses["com.isartdigital.operationaaa.ui.GraphicLoader"] = com.isartdigital.operationaaa.ui.GraphicLoader;
com.isartdigital.operationaaa.ui.GraphicLoader.__name__ = ["com","isartdigital","operationaaa","ui","GraphicLoader"];
com.isartdigital.operationaaa.ui.GraphicLoader.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.GraphicLoader.instance == null) com.isartdigital.operationaaa.ui.GraphicLoader.instance = new com.isartdigital.operationaaa.ui.GraphicLoader();
	return com.isartdigital.operationaaa.ui.GraphicLoader.instance;
};
com.isartdigital.operationaaa.ui.GraphicLoader.__super__ = com.isartdigital.utils.ui.Screen;
com.isartdigital.operationaaa.ui.GraphicLoader.prototype = $extend(com.isartdigital.utils.ui.Screen.prototype,{
	update: function(pProgress) {
		this.loaderBar.scale.x = pProgress;
	}
	,loaderLoop: function() {
		var _g1 = 0;
		var _g = this.spritesCount;
		while(_g1 < _g) {
			var i = _g1++;
			var lSprite = this.funkySprites[i];
			lSprite.position.x += 10;
			var lFrame = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(this);
			if(lSprite.position.x > lFrame.x + lFrame.width) lSprite.position.x = lFrame.x - lSprite.width;
		}
	}
	,close: function() {
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.loaderLoop));
		com.isartdigital.utils.ui.Screen.prototype.close.call(this);
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.GraphicLoader.instance = null;
		com.isartdigital.utils.ui.Screen.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.ui.GraphicLoader
});
com.isartdigital.operationaaa.ui.TranslationLabels = function() { };
$hxClasses["com.isartdigital.operationaaa.ui.TranslationLabels"] = com.isartdigital.operationaaa.ui.TranslationLabels;
com.isartdigital.operationaaa.ui.TranslationLabels.__name__ = ["com","isartdigital","operationaaa","ui","TranslationLabels"];
com.isartdigital.operationaaa.ui.UIManager = function() {
	this.popins = [];
};
$hxClasses["com.isartdigital.operationaaa.ui.UIManager"] = com.isartdigital.operationaaa.ui.UIManager;
com.isartdigital.operationaaa.ui.UIManager.__name__ = ["com","isartdigital","operationaaa","ui","UIManager"];
com.isartdigital.operationaaa.ui.UIManager.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.UIManager.instance == null) com.isartdigital.operationaaa.ui.UIManager.instance = new com.isartdigital.operationaaa.ui.UIManager();
	return com.isartdigital.operationaaa.ui.UIManager.instance;
};
com.isartdigital.operationaaa.ui.UIManager.prototype = {
	openScreen: function(pScreen) {
		this.closeScreens();
		com.isartdigital.utils.game.GameStage.getInstance().getScreensContainer().addChild(pScreen);
		pScreen.open();
	}
	,closeScreens: function() {
		var lContainer = com.isartdigital.utils.game.GameStage.getInstance().getScreensContainer();
		while(lContainer.children.length > 0) {
			var lCurrent;
			lCurrent = js.Boot.__cast(lContainer.getChildAt(lContainer.children.length - 1) , com.isartdigital.utils.ui.Screen);
			lContainer.removeChild(lCurrent);
			lCurrent.close();
		}
	}
	,openPopin: function(pPopin) {
		this.popins.push(pPopin);
		com.isartdigital.utils.game.GameStage.getInstance().getPopinsContainer().addChild(pPopin);
		pPopin.open();
	}
	,closeCurrentPopin: function() {
		if(this.popins.length == 0) return;
		var lCurrent = this.popins.pop();
		com.isartdigital.utils.game.GameStage.getInstance().getPopinsContainer().removeChild(lCurrent);
		lCurrent.close();
	}
	,openHud: function() {
		com.isartdigital.utils.game.GameStage.getInstance().getHudContainer().addChild(com.isartdigital.operationaaa.ui.hud.Hud.getInstance());
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().open();
	}
	,closeHud: function() {
		com.isartdigital.utils.game.GameStage.getInstance().getHudContainer().removeChild(com.isartdigital.operationaaa.ui.hud.Hud.getInstance());
		com.isartdigital.operationaaa.ui.hud.Hud.getInstance().close();
	}
	,startGame: function() {
		this.closeScreens();
		this.openHud();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.UIManager.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.ui.UIManager
};
com.isartdigital.utils.ui.Button = function() {
	com.isartdigital.utils.game.StateGraphic.call(this);
	this.boxType = com.isartdigital.utils.game.BoxType.SELF;
	this.interactive = true;
	this.buttonMode = true;
	this.onMouseOver = $bind(this,this._mouseVoid);
	this.onMouseDown = $bind(this,this._mouseVoid);
	this.onClick = $bind(this,this._mouseVoid);
	this.onMouseOut = $bind(this,this._mouseVoid);
	this.click = this.tap = $bind(this,this._click);
	this.mousedown = $bind(this,this._mouseDown);
	this.mouseover = $bind(this,this._mouseOver);
	this.mouseupoutside = this.mouseout = $bind(this,this._mouseOut);
	this.initStyle();
	this.txt = new PIXI.Text("",this.upStyle);
	this.txt.anchor.set(0.5,0.5);
	this.start();
};
$hxClasses["com.isartdigital.utils.ui.Button"] = com.isartdigital.utils.ui.Button;
com.isartdigital.utils.ui.Button.__name__ = ["com","isartdigital","utils","ui","Button"];
com.isartdigital.utils.ui.Button.__super__ = com.isartdigital.utils.game.StateGraphic;
com.isartdigital.utils.ui.Button.prototype = $extend(com.isartdigital.utils.game.StateGraphic.prototype,{
	initStyle: function() {
		this.upStyle = { font : "80px Arial", fill : "#000000", align : "center"};
		this.overStyle = { font : "80px Arial", fill : "#AAAAAA", align : "center"};
		this.downStyle = { font : "80px Arial", fill : "#FFFFFF", align : "center"};
	}
	,setText: function(pText) {
		this.txt.setText(pText);
	}
	,setModeNormal: function() {
		this.setState(this.DEFAULT_STATE);
		this.anim.anchor.set(0.5,0.5);
		this.anim.gotoAndStop(0);
		this.addChild(this.txt);
		com.isartdigital.utils.game.StateGraphic.prototype.setModeNormal.call(this);
	}
	,_mouseVoid: function() {
	}
	,_click: function(pEvent) {
		this.anim.gotoAndStop(0);
		this.txt.setStyle(this.upStyle);
		this.onClick(pEvent);
	}
	,_mouseDown: function(pEvent) {
		this.anim.gotoAndStop(2);
		this.txt.setStyle(this.downStyle);
		this.onMouseDown(pEvent);
	}
	,_mouseOver: function(pEvent) {
		this.anim.gotoAndStop(1);
		this.txt.setStyle(this.overStyle);
		this.onMouseOver(pEvent);
	}
	,_mouseOut: function(pEvent) {
		this.anim.gotoAndStop(0);
		this.txt.setStyle(this.upStyle);
		this.onMouseOut(pEvent);
	}
	,__class__: com.isartdigital.utils.ui.Button
});
com.isartdigital.operationaaa.ui.buttons = {};
com.isartdigital.operationaaa.ui.buttons.ButtonBack = function() {
	com.isartdigital.utils.ui.Button.call(this);
	this.start();
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonBack"] = com.isartdigital.operationaaa.ui.buttons.ButtonBack;
com.isartdigital.operationaaa.ui.buttons.ButtonBack.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonBack"];
com.isartdigital.operationaaa.ui.buttons.ButtonBack.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonBack.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x = this.anim.scale.y *= 0.8;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonBack
});
com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave"] = com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave;
com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonDeleteSave"];
com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x *= 0.55;
		this.anim.scale.y *= 0.55;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave
});
com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel"] = com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel;
com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonNextLevel"];
com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x = this.anim.scale.y *= 0.55;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel
});
com.isartdigital.operationaaa.ui.buttons.ButtonOptions = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonOptions"] = com.isartdigital.operationaaa.ui.buttons.ButtonOptions;
com.isartdigital.operationaaa.ui.buttons.ButtonOptions.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonOptions"];
com.isartdigital.operationaaa.ui.buttons.ButtonOptions.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonOptions.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	__class__: com.isartdigital.operationaaa.ui.buttons.ButtonOptions
});
com.isartdigital.operationaaa.ui.buttons.ButtonPause = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonPause"] = com.isartdigital.operationaaa.ui.buttons.ButtonPause;
com.isartdigital.operationaaa.ui.buttons.ButtonPause.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonPause"];
com.isartdigital.operationaaa.ui.buttons.ButtonPause.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonPause.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x = this.anim.scale.y *= 0.55;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonPause
});
com.isartdigital.operationaaa.ui.buttons.ButtonPlay = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonPlay"] = com.isartdigital.operationaaa.ui.buttons.ButtonPlay;
com.isartdigital.operationaaa.ui.buttons.ButtonPlay.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonPlay"];
com.isartdigital.operationaaa.ui.buttons.ButtonPlay.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonPlay.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	__class__: com.isartdigital.operationaaa.ui.buttons.ButtonPlay
});
com.isartdigital.operationaaa.ui.buttons.ButtonRefuse = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonRefuse"] = com.isartdigital.operationaaa.ui.buttons.ButtonRefuse;
com.isartdigital.operationaaa.ui.buttons.ButtonRefuse.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonRefuse"];
com.isartdigital.operationaaa.ui.buttons.ButtonRefuse.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonRefuse.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x = this.anim.scale.y *= 0.55;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonRefuse
});
com.isartdigital.operationaaa.ui.buttons.ButtonSave = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonSave"] = com.isartdigital.operationaaa.ui.buttons.ButtonSave;
com.isartdigital.operationaaa.ui.buttons.ButtonSave.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonSave"];
com.isartdigital.operationaaa.ui.buttons.ButtonSave.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonSave.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	__class__: com.isartdigital.operationaaa.ui.buttons.ButtonSave
});
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff"] = com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff;
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonSoundOff"];
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x = this.anim.scale.y *= 0.60;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff
});
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn"] = com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn;
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonSoundOn"];
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x *= 0.70;
		this.anim.scale.y *= 0.70;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn
});
com.isartdigital.operationaaa.ui.buttons.ButtonValidate = function() {
	com.isartdigital.utils.ui.Button.call(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.ButtonValidate"] = com.isartdigital.operationaaa.ui.buttons.ButtonValidate;
com.isartdigital.operationaaa.ui.buttons.ButtonValidate.__name__ = ["com","isartdigital","operationaaa","ui","buttons","ButtonValidate"];
com.isartdigital.operationaaa.ui.buttons.ButtonValidate.__super__ = com.isartdigital.utils.ui.Button;
com.isartdigital.operationaaa.ui.buttons.ButtonValidate.prototype = $extend(com.isartdigital.utils.ui.Button.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.ui.Button.prototype.setModeNormal.call(this);
		this.setState(this.DEFAULT_STATE);
		this.anim.scale.x = this.anim.scale.y *= 0.55;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.ButtonValidate
});
com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel = function(pLevel,pUpgrade,pCollectedGems,pTotalGems) {
	this.isTweening = false;
	this.isMain = false;
	com.isartdigital.utils.game.GameObject.call(this);
	this.levelId = pLevel;
	this.upgradeCollected = pUpgrade;
	this.collectedGems = pCollectedGems;
	this.totalGems = pTotalGems;
	this.levelSprite = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "selection_screen/selection_level" + Std.string(this.levelId) + ".png"));
	this.levelSprite.anchor.set(0.5,0.5);
	this.addChild(this.levelSprite);
	this.leftFrame = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "selection_screen/left_frame.png"));
	this.midFrame = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "selection_screen/mid_frame.png"));
	this.rightFrame = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "selection_screen/right_frame.png"));
	this.leftFrame.anchor.set(0,0.5);
	this.midFrame.anchor.set(0.5,0.5);
	this.rightFrame.anchor.set(1,0.5);
	this.addChild(this.midFrame);
	this.addChild(this.leftFrame);
	this.addChild(this.rightFrame);
	this.mask = new PIXI.Graphics();
	this.addChild(this.mask);
	this.mask.lineStyle(0);
	this.levelSprite.interactive = true;
	this.infoBox = new pixi.display.DisplayObjectContainer();
	this.miniUpgrade = new PIXI.Sprite(PIXI.Texture.fromFrame("UpgradeWin000" + this.levelId + ".png"));
	this.miniUpgrade.anchor.set(0.5,0.5);
	if(!this.upgradeCollected) this.miniUpgrade.alpha = 0.5;
	this.miniGauge = new com.isartdigital.operationaaa.ui.elements.MiniGauge(this.collectedGems,this.totalGems,150);
	this.levelName = new PIXI.Text(com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel.localisedLevelNames[this.levelId],{ fill : "white", stroke : "black", strokeThickness : 5, font : "64px GothicStyle"});
	this.levelName.anchor.set(0.5,1);
	this.levelName.y = 500;
	this.gauge = new com.isartdigital.operationaaa.ui.elements.MiniGauge(this.collectedGems,this.totalGems,250);
	this.gauge.y = -200;
};
$hxClasses["com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel"] = com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel;
com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel.__name__ = ["com","isartdigital","operationaaa","ui","buttons","LevelSelectionPanel"];
com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel.getLocalisedLevelNames = function() {
	com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel.localisedLevelNames = ["LEVEL ZERO",com.isartdigital.utils.ui.TranslationManager.get("LABEL_LEVEL1"),com.isartdigital.utils.ui.TranslationManager.get("LABEL_LEVEL2"),com.isartdigital.utils.ui.TranslationManager.get("LABEL_LEVEL3"),com.isartdigital.utils.ui.TranslationManager.get("LABEL_LEVEL4")];
};
com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel.__super__ = com.isartdigital.utils.game.GameObject;
com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel.prototype = $extend(com.isartdigital.utils.game.GameObject.prototype,{
	onClickDoStartLevel: function(pEvent) {
		haxe.Log.trace("[LevelSelectionPanel.onClick] Level " + this.levelId + " clicked : Loading Level...",{ fileName : "LevelSelectionPanel.hx", lineNumber : 219, className : "com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel", methodName : "onClickDoStartLevel"});
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().load(this.levelId);
	}
	,onClickDoOpenPanel: function(pEvent) {
		haxe.Log.trace("[LevelSelectionPanel.onClick] Level " + this.levelId + " clicked : Opening Panel...",{ fileName : "LevelSelectionPanel.hx", lineNumber : 230, className : "com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel", methodName : "onClickDoOpenPanel"});
		com.isartdigital.operationaaa.ui.screens.SelectScreen.getInstance().setModeOpenPanel(this.levelId);
	}
	,setModeNormal: function() {
		com.isartdigital.utils.game.GameObject.prototype.setModeNormal.call(this);
		this.levelSprite.click = this.levelSprite.tap = $bind(this,this.onClickDoOpenPanel);
		this.drawMask();
		this.infoBox.addChild(this.miniGauge);
		this.infoBox.addChild(this.miniUpgrade);
		this.miniUpgrade.scale.set(0.5,0.5);
		this.miniUpgrade.y = 300;
		this.addChild(this.infoBox);
		this.miniGauge.start();
	}
	,doActionNormal: function() {
		com.isartdigital.utils.game.GameObject.prototype.doActionNormal.call(this);
		this.miniGauge.doAction();
	}
	,setModeOpen: function() {
		this.doAction = $bind(this,this.doActionOpen);
		this.levelSprite.click = this.levelSprite.tap = $bind(this,this.onClickDoStartLevel);
		this.drawMask();
		this.infoBox.addChild(this.levelName);
		this.infoBox.addChild(this.gauge);
		this.infoBox.addChild(this.miniUpgrade);
		this.miniUpgrade.scale.set(1,1);
		this.miniUpgrade.y = -200;
		this.addChild(this.infoBox);
		this.gauge.start();
	}
	,doActionOpen: function() {
		this.gauge.doAction();
	}
	,setModeClosed: function() {
		this.doAction = $bind(this,this.doActionVoid);
		this.levelSprite.click = this.levelSprite.tap = $bind(this,this.onClickDoOpenPanel);
		this.drawMask();
	}
	,setModeTween: function(pTargetWidth,pSetModeCallback) {
		this.doAction = $bind(this,this.doActionTween);
		this.click = this.tap = null;
		this.isTweening = true;
		this.targetWidth = pTargetWidth;
		this.setModeCallback = pSetModeCallback;
	}
	,doActionTween: function() {
		if(this.infoBox.parent != null) {
			if((this.infoBox.scale.x *= 0.9) < 0.1) {
				this.infoBox.scale.x = 1;
				this.removeChild(this.infoBox);
				this.infoBox.removeChildren();
			}
		}
		this.rectangle.width += 0.1 * (this.targetWidth - this.rectangle.width);
		if(-5 < this.targetWidth - this.rectangle.width && this.targetWidth - this.rectangle.width < 5) {
			this.rectangle.width = this.targetWidth;
			this.isTweening = false;
			this.setModeCallback();
		}
		this.rectangle.x = -this.rectangle.width / 2;
		this.drawMask();
	}
	,drawMask: function() {
		this.mask.clear();
		this.mask.beginFill(16777215,1);
		this.mask.drawShape(this.rectangle);
		this.mask.endFill();
		this.leftFrame.x = this.rectangle.x;
		this.leftFrame.height = this.rectangle.height;
		this.midFrame.width = this.rectangle.width - (this.leftFrame.width + this.rightFrame.width);
		this.midFrame.height = this.rectangle.height;
		this.rightFrame.x = this.rectangle.x + this.rectangle.width;
		this.rightFrame.height = this.rectangle.height;
		this.levelSprite.hitArea = this.rectangle;
	}
	,get_id: function() {
		return this.levelId;
	}
	,__class__: com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel
});
com.isartdigital.operationaaa.ui.elements = {};
com.isartdigital.operationaaa.ui.elements.MiniGauge = function(pCurrentCount,pMaxCount,pRadius) {
	com.isartdigital.utils.game.GameObject.call(this);
	this.currentCount = pCurrentCount;
	this.maxCount = pMaxCount;
	this.radius = pRadius;
	this.spread = 2 * Math.PI / this.maxCount;
	this.gems = [];
	var lGem;
	var _g1 = 0;
	var _g = this.maxCount;
	while(_g1 < _g) {
		var i = _g1++;
		lGem = new com.isartdigital.operationaaa.ui.elements.MiniGem(-Math.PI / 2 + Math.round(i * this.spread * 100) / 100);
		lGem.start();
		lGem.x = this.radius * Math.cos(this.spread * i);
		lGem.y = this.radius * Math.sin(this.spread * i);
		this.addChild(lGem);
		this.gems.push(lGem);
	}
};
$hxClasses["com.isartdigital.operationaaa.ui.elements.MiniGauge"] = com.isartdigital.operationaaa.ui.elements.MiniGauge;
com.isartdigital.operationaaa.ui.elements.MiniGauge.__name__ = ["com","isartdigital","operationaaa","ui","elements","MiniGauge"];
com.isartdigital.operationaaa.ui.elements.MiniGauge.__super__ = com.isartdigital.utils.game.GameObject;
com.isartdigital.operationaaa.ui.elements.MiniGauge.prototype = $extend(com.isartdigital.utils.game.GameObject.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.game.GameObject.prototype.setModeNormal.call(this);
		this.reinitGauge();
	}
	,reinitGauge: function() {
		var _g1 = 0;
		var _g = this.maxCount;
		while(_g1 < _g) {
			var i = _g1++;
			this.gems[i].setModeNormal();
		}
		this.frameCount = 0;
		this.blobCount = 0;
	}
	,doActionNormal: function() {
		this.scale.x = 1 + Math.sin(this.blobCount) * 0.01;
		this.scale.y = 1 + Math.sin(this.blobCount) * 0.01;
		this.blobCount += 0.1;
		if(this.frameCount < this.currentCount) {
			this.gems[this.frameCount].setModeFull();
			this.frameCount++;
		}
		var _g1 = 0;
		var _g = this.maxCount;
		while(_g1 < _g) {
			var i = _g1++;
			this.gems[i].doAction();
		}
	}
	,__class__: com.isartdigital.operationaaa.ui.elements.MiniGauge
});
com.isartdigital.operationaaa.ui.elements.MiniGem = function(pRotation) {
	com.isartdigital.utils.game.StateGraphic.call(this);
	this.rotation = pRotation;
};
$hxClasses["com.isartdigital.operationaaa.ui.elements.MiniGem"] = com.isartdigital.operationaaa.ui.elements.MiniGem;
com.isartdigital.operationaaa.ui.elements.MiniGem.__name__ = ["com","isartdigital","operationaaa","ui","elements","MiniGem"];
com.isartdigital.operationaaa.ui.elements.MiniGem.__super__ = com.isartdigital.utils.game.StateGraphic;
com.isartdigital.operationaaa.ui.elements.MiniGem.prototype = $extend(com.isartdigital.utils.game.StateGraphic.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.game.StateGraphic.prototype.setModeNormal.call(this);
		this.setState("empty");
	}
	,setModeFull: function() {
		this.setState("full");
	}
	,__class__: com.isartdigital.operationaaa.ui.elements.MiniGem
});
com.isartdigital.operationaaa.ui.hud = {};
com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon = function() {
	this.speed = new PIXI.Point(-10 + Math.random() * 20,Math.random() * -15);
	PIXI.Sprite.call(this,PIXI.Texture.fromFrame(com.isartdigital.utils.Config.get_assetsPath() + "collectible_icon.png"));
	com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon.list.push(this);
};
$hxClasses["com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon"] = com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon;
com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon.__name__ = ["com","isartdigital","operationaaa","ui","hud","CollectibleJuicyIcon"];
com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon.__super__ = PIXI.Sprite;
com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon.prototype = $extend(PIXI.Sprite.prototype,{
	doAction: function() {
		this.x += this.speed.x;
		this.y += this.speed.y;
		this.speed.y++;
		this.alpha -= 0.05;
		this.scale.x = this.scale.y -= 0.05;
		if(this.alpha <= 0) this.destroy();
	}
	,destroy: function() {
		if(this.parent != null) this.parent.removeChild(this);
		HxOverrides.remove(com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon.list,this);
	}
	,__class__: com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon
});
com.isartdigital.operationaaa.ui.hud.Hud = function() {
	this.isTouchDetectionEnabled = false;
	this._collectibleCount = 0;
	com.isartdigital.utils.ui.Screen.call(this);
	this._modal = false;
	this.hudTopLeft = new PIXI.Sprite(null);
	this.addChild(this.hudTopLeft);
	this.collectibleIcon = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "collectible_icon.png"));
	this.hudTopLeft.addChild(this.collectibleIcon);
	this.collectibleIcon.anchor.set(0,0.5);
	this.collectibleIcon.position.set(0,this.collectibleIcon.height / 2);
	this.collectibleTxt = new PIXI.Text("",{ fill : "white", stroke : "black", strokeThickness : 3, font : "bold 86px GothicStyle"});
	this.updateCollectibleTxt();
	this.collectibleTxt.anchor.set(0,0.5);
	this.collectibleTxt.position.set(this.collectibleIcon.width + this.collectibleIcon.x + 30,this.collectibleIcon.y);
	this.hudTopLeft.addChild(this.collectibleTxt);
	this.hudTopRight = new PIXI.Sprite(null);
	this.hudTopRight.anchor.set(1,0);
	this.addChild(this.hudTopRight);
	this.pauseBtn = new com.isartdigital.operationaaa.ui.buttons.ButtonPause();
	this.pauseBtn.onClick = $bind(this,this.onClickPause);
	this.pauseBtn.x = -this.pauseBtn.width / 2;
	this.pauseBtn.y = this.pauseBtn.y + this.pauseBtn.height / 2;
	this.hudTopRight.addChild(this.pauseBtn);
	this.hudTopCenter = new PIXI.Sprite(null);
	this.hudTopCenter.anchor.set(0.5,0.5);
	this.addChild(this.hudTopCenter);
	haxe.Log.trace("LevelID: " + com.isartdigital.operationaaa.game.GameManager.getInstance().currentLevelId,{ fileName : "Hud.hx", lineNumber : 120, className : "com.isartdigital.operationaaa.ui.hud.Hud", methodName : "new"});
	this.levelTxt = new PIXI.Text(com.isartdigital.utils.ui.TranslationManager.get("LABEL_LEVEL" + com.isartdigital.operationaaa.game.GameManager.getInstance().currentLevelId));
	this.levelTxt.setStyle({ fill : "white", stroke : "black", strokeThickness : 5, font : "128px GothicStyle"});
	this.levelTxt.anchor.set(0.5,0.5);
	this.levelTxt.alpha = 0;
	this.levelTxt.position.set(0,-300);
	this.hudTopCenter.addChild(this.levelTxt);
	this.adviceTxt = new PIXI.Text(com.isartdigital.utils.ui.TranslationManager.get("INGAME_ADVICE_TEXT"));
	this.adviceTxt.setStyle({ fill : "white", stroke : "black", strokeThickness : 5, font : "64px GothicStyle"});
	this.adviceTxt.anchor.set(0.5,0.5);
	this.adviceTxt.alpha = 0;
	this.adviceTxt.position.set(0,this.levelTxt.y + 200);
	this.hudTopCenter.addChild(this.adviceTxt);
	this.counter = 300;
	this.alphaPerFrame = 0.016666666666666666;
	com.isartdigital.operationaaa.Main.getInstance().addEventListener("GameEvent.GAME_LOOP",$bind(this,this.hudLoop));
};
$hxClasses["com.isartdigital.operationaaa.ui.hud.Hud"] = com.isartdigital.operationaaa.ui.hud.Hud;
com.isartdigital.operationaaa.ui.hud.Hud.__name__ = ["com","isartdigital","operationaaa","ui","hud","Hud"];
com.isartdigital.operationaaa.ui.hud.Hud.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.hud.Hud.instance == null) com.isartdigital.operationaaa.ui.hud.Hud.instance = new com.isartdigital.operationaaa.ui.hud.Hud();
	return com.isartdigital.operationaaa.ui.hud.Hud.instance;
};
com.isartdigital.operationaaa.ui.hud.Hud.__super__ = com.isartdigital.utils.ui.Screen;
com.isartdigital.operationaaa.ui.hud.Hud.prototype = $extend(com.isartdigital.utils.ui.Screen.prototype,{
	initTouchZones: function() {
		com.isartdigital.operationaaa.ui.FeedbackManager.getInstance();
		var lScreen = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(com.isartdigital.utils.game.GameStage.getInstance().getHudContainer());
		this.leftTouchZone = new com.isartdigital.operationaaa.controller.TouchDetectionZone();
		this.get_leftTouchZone().tint = 255;
		this.get_leftTouchZone().anchor.set(0,1);
		this.get_leftTouchZone().width = lScreen.width / 2;
		this.get_leftTouchZone().height = lScreen.height;
		this.get_leftTouchZone().alpha = 0;
		this.addChild(this.get_leftTouchZone());
		this.rightTouchZone = new com.isartdigital.operationaaa.controller.TouchDetectionZone();
		this.get_rightTouchZone().anchor.set(1,1);
		this.get_rightTouchZone().width = lScreen.width / 2;
		this.get_rightTouchZone().height = lScreen.height;
		this.get_rightTouchZone().alpha = 0;
		this.addChild(this.get_rightTouchZone());
		this.get_rightTouchZone().interactive = true;
		this.get_leftTouchZone().interactive = true;
		this.isTouchDetectionEnabled = true;
		haxe.Log.trace("[Hud.initTouchZones] Done",{ fileName : "Hud.hx", lineNumber : 177, className : "com.isartdigital.operationaaa.ui.hud.Hud", methodName : "initTouchZones"});
	}
	,onResize: function(pEvent) {
		com.isartdigital.utils.ui.UIPosition.setPosition(this.hudTopLeft,"topLeft",100,50);
		com.isartdigital.utils.ui.UIPosition.setPosition(this.hudTopRight,"topRight",100,50);
		if(this.isTouchDetectionEnabled) {
			haxe.Log.trace("[Hud.onResize] Touch Detection enabled, TouchZones repositionning",{ fileName : "Hud.hx", lineNumber : 195, className : "com.isartdigital.operationaaa.ui.hud.Hud", methodName : "onResize"});
			com.isartdigital.utils.ui.UIPosition.setPosition(this.get_leftTouchZone(),"bottomLeft",0,0);
			com.isartdigital.utils.ui.UIPosition.setPosition(this.get_rightTouchZone(),"bottomRight",0,0);
		}
	}
	,onClickPause: function() {
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openPopin(com.isartdigital.operationaaa.ui.popin.Pause.getInstance());
	}
	,hudLoop: function() {
		this.counter--;
		if(this.counter > 240) this.levelTxt.alpha += this.alphaPerFrame; else if(this.counter < 120) this.levelTxt.alpha -= this.alphaPerFrame;
		if(this.counter < 240 && this.counter > 180) this.adviceTxt.alpha += this.alphaPerFrame; else if(this.counter < 60) this.adviceTxt.alpha -= this.alphaPerFrame;
		if(this.counter == 0) {
			this.removeChild(this.levelTxt);
			this.removeChild(this.adviceTxt);
			com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.hudLoop));
		}
	}
	,doAction: function() {
		var _g = 0;
		var _g1 = com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon.list;
		while(_g < _g1.length) {
			var lIcon = _g1[_g];
			++_g;
			lIcon.doAction();
		}
	}
	,updateCollectibleTxt: function(pCollectibleNumber) {
		if(pCollectibleNumber == null) pCollectibleNumber = 0;
		var lCollectibleText = HxOverrides.substr("00" + pCollectibleNumber,-2,null);
		this.collectibleTxt.setText(lCollectibleText);
	}
	,get_rightTouchZone: function() {
		return this.rightTouchZone;
	}
	,get_leftTouchZone: function() {
		return this.leftTouchZone;
	}
	,get_collectibleCount: function() {
		return this._collectibleCount;
	}
	,set_collectibleCount: function(pCollectibleCount) {
		this._collectibleCount = pCollectibleCount;
		this.updateCollectibleTxt(this._collectibleCount);
		if(this._collectibleCount > 0) {
			var _g = 0;
			while(_g < 5) {
				var i = _g++;
				this.collectibleIcon.addChild(new com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon());
			}
		}
		return this._collectibleCount;
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.hud.Hud.instance = null;
		com.isartdigital.utils.ui.Screen.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.ui.hud.Hud
});
com.isartdigital.utils.ui.Popin = function() {
	com.isartdigital.utils.ui.UIComponent.call(this);
};
$hxClasses["com.isartdigital.utils.ui.Popin"] = com.isartdigital.utils.ui.Popin;
com.isartdigital.utils.ui.Popin.__name__ = ["com","isartdigital","utils","ui","Popin"];
com.isartdigital.utils.ui.Popin.__super__ = com.isartdigital.utils.ui.UIComponent;
com.isartdigital.utils.ui.Popin.prototype = $extend(com.isartdigital.utils.ui.UIComponent.prototype,{
	__class__: com.isartdigital.utils.ui.Popin
});
com.isartdigital.operationaaa.ui.popin = {};
com.isartdigital.operationaaa.ui.popin.Confirm = function() {
	com.isartdigital.utils.ui.Popin.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "Confirm.png"));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	this.interactive = true;
	this.buttonMode = true;
	this.click = this.tap = $bind(this,this.onClick);
};
$hxClasses["com.isartdigital.operationaaa.ui.popin.Confirm"] = com.isartdigital.operationaaa.ui.popin.Confirm;
com.isartdigital.operationaaa.ui.popin.Confirm.__name__ = ["com","isartdigital","operationaaa","ui","popin","Confirm"];
com.isartdigital.operationaaa.ui.popin.Confirm.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.popin.Confirm.instance == null) com.isartdigital.operationaaa.ui.popin.Confirm.instance = new com.isartdigital.operationaaa.ui.popin.Confirm();
	return com.isartdigital.operationaaa.ui.popin.Confirm.instance;
};
com.isartdigital.operationaaa.ui.popin.Confirm.__super__ = com.isartdigital.utils.ui.Popin;
com.isartdigital.operationaaa.ui.popin.Confirm.prototype = $extend(com.isartdigital.utils.ui.Popin.prototype,{
	onClick: function(pData) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeCurrentPopin();
		com.isartdigital.operationaaa.game.GameManager.getInstance().start(1);
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.popin.Confirm.instance = null;
		com.isartdigital.utils.ui.Popin.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.ui.popin.Confirm
});
com.isartdigital.operationaaa.ui.popin.Confirmation = function() {
	com.isartdigital.utils.ui.Popin.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "Confirm.png"));
	this.background.anchor.set(0.5,0.5);
	this.background.position.y = -50;
	this.addChild(this.background);
	this.popInTitle = new PIXI.Text("Placeholder_TEXT",{ font : "48px Arial"});
	this.popInTitle.anchor.set(0.5,0.5);
	this.popInTitle.setStyle({ fill : "white", stroke : "black", strokeThickness : 5, align : "center", font : "86px GothicStyle"});
	this.popInTitle.position.y = -200;
	this.addChild(this.popInTitle);
	this.validateBtn = new com.isartdigital.operationaaa.ui.buttons.ButtonValidate();
	this.validateBtn.position.set(-300,150);
	this.validateBtn.onClick = $bind(this,this.onClickValidateBtn);
	this.addChild(this.validateBtn);
	this.refuseBtn = new com.isartdigital.operationaaa.ui.buttons.ButtonRefuse();
	this.refuseBtn.position.set(300,150);
	this.refuseBtn.onClick = $bind(this,this.onClickRefuseBtn);
	this.addChild(this.refuseBtn);
};
$hxClasses["com.isartdigital.operationaaa.ui.popin.Confirmation"] = com.isartdigital.operationaaa.ui.popin.Confirmation;
com.isartdigital.operationaaa.ui.popin.Confirmation.__name__ = ["com","isartdigital","operationaaa","ui","popin","Confirmation"];
com.isartdigital.operationaaa.ui.popin.Confirmation.__super__ = com.isartdigital.utils.ui.Popin;
com.isartdigital.operationaaa.ui.popin.Confirmation.prototype = $extend(com.isartdigital.utils.ui.Popin.prototype,{
	setBackgroundTexture: function(pImagePath) {
		this.background.texture = PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + pImagePath + ".png");
	}
	,onClickValidateBtn: function(pEvent) {
	}
	,onClickRefuseBtn: function(pEvent) {
	}
	,__class__: com.isartdigital.operationaaa.ui.popin.Confirmation
});
com.isartdigital.operationaaa.ui.popin.DeleteSave = function() {
	com.isartdigital.operationaaa.ui.popin.Confirmation.call(this);
	this.setBackgroundTexture("DeleteSave_bg");
	this.popInTitle.setText(com.isartdigital.utils.ui.TranslationManager.get("DELETE_SAVE_TEXT"));
};
$hxClasses["com.isartdigital.operationaaa.ui.popin.DeleteSave"] = com.isartdigital.operationaaa.ui.popin.DeleteSave;
com.isartdigital.operationaaa.ui.popin.DeleteSave.__name__ = ["com","isartdigital","operationaaa","ui","popin","DeleteSave"];
com.isartdigital.operationaaa.ui.popin.DeleteSave.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.popin.DeleteSave.instance == null) com.isartdigital.operationaaa.ui.popin.DeleteSave.instance = new com.isartdigital.operationaaa.ui.popin.DeleteSave();
	return com.isartdigital.operationaaa.ui.popin.DeleteSave.instance;
};
com.isartdigital.operationaaa.ui.popin.DeleteSave.__super__ = com.isartdigital.operationaaa.ui.popin.Confirmation;
com.isartdigital.operationaaa.ui.popin.DeleteSave.prototype = $extend(com.isartdigital.operationaaa.ui.popin.Confirmation.prototype,{
	onClickValidateBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.SaveManager.getInstance().deleteSave();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeCurrentPopin();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.TitleCard.getInstance());
	}
	,onClickRefuseBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeCurrentPopin();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.popin.DeleteSave.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.ui.popin.DeleteSave
});
com.isartdigital.operationaaa.ui.popin.Pause = function() {
	com.isartdigital.operationaaa.ui.popin.Confirmation.call(this);
	this.setBackgroundTexture("Pause_bg");
	this.popInTitle.setText(com.isartdigital.utils.ui.TranslationManager.get("PAUSE_TEXT"));
	com.isartdigital.utils.sounds.SoundManager.getSound(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().soundLevel).pause();
};
$hxClasses["com.isartdigital.operationaaa.ui.popin.Pause"] = com.isartdigital.operationaaa.ui.popin.Pause;
com.isartdigital.operationaaa.ui.popin.Pause.__name__ = ["com","isartdigital","operationaaa","ui","popin","Pause"];
com.isartdigital.operationaaa.ui.popin.Pause.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.popin.Pause.instance == null) com.isartdigital.operationaaa.ui.popin.Pause.instance = new com.isartdigital.operationaaa.ui.popin.Pause();
	return com.isartdigital.operationaaa.ui.popin.Pause.instance;
};
com.isartdigital.operationaaa.ui.popin.Pause.__super__ = com.isartdigital.operationaaa.ui.popin.Confirmation;
com.isartdigital.operationaaa.ui.popin.Pause.prototype = $extend(com.isartdigital.operationaaa.ui.popin.Confirmation.prototype,{
	onClickValidateBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.utils.sounds.SoundManager.getSound(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().soundLevel).stop();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeCurrentPopin();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeHud();
		com.isartdigital.operationaaa.game.GameManager.getInstance().stopGameAndBackToSelection();
	}
	,onClickRefuseBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.utils.sounds.SoundManager.getSound(com.isartdigital.operationaaa.game.leveldesign.LevelLoader.getInstance().soundLevel).play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeCurrentPopin();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.popin.Pause.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.ui.popin.Pause
});
com.isartdigital.operationaaa.ui.popin.WinInterlevel = function() {
	com.isartdigital.utils.ui.Popin.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "WinInterlevel.png"));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	this.currentLevel = com.isartdigital.operationaaa.game.GameManager.getInstance().currentLevelId;
	this.nextBtn = new com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel();
	this.nextBtn.position.set(0,300);
	this.nextBtn.scale.set(0.5,0.5);
	this.addChild(this.nextBtn);
	this.nextBtn.onClick = $bind(this,this.onClickNext);
	var winTxt = new PIXI.Text("Bravo vous avez fini le niveau !!",{ font : "36px Arial"});
	winTxt.anchor.set(0.5,0.5);
	winTxt.position.set(0,-300);
	this.addChild(winTxt);
	var winTxt2 = new PIXI.Text("Vous obtenez le : ",{ font : "36px Arial"});
	winTxt2.anchor.set(0.5,0.5);
	winTxt2.position.set(0,-240);
	this.addChild(winTxt2);
	var lTexture = PIXI.Texture.fromFrame("UpgradeWin000" + this.currentLevel + ".png");
	var currentUpgrade = new PIXI.Sprite(lTexture);
	currentUpgrade.anchor.set(0.5,0.5);
	currentUpgrade.position.set(0,-120);
	this.addChild(currentUpgrade);
	var winTxt3 = new PIXI.Text("Complétion du niveau :",{ font : "36px Arial"});
	winTxt3.anchor.set(0.5,0.5);
	winTxt3.position.set(0,0);
	this.addChild(winTxt3);
	var winGauge = new com.isartdigital.utils.ui.Gauge();
	winGauge.anchor.set(0.5,0.5);
	winGauge.position.set(0,120);
	this.addChild(winGauge);
};
$hxClasses["com.isartdigital.operationaaa.ui.popin.WinInterlevel"] = com.isartdigital.operationaaa.ui.popin.WinInterlevel;
com.isartdigital.operationaaa.ui.popin.WinInterlevel.__name__ = ["com","isartdigital","operationaaa","ui","popin","WinInterlevel"];
com.isartdigital.operationaaa.ui.popin.WinInterlevel.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.popin.WinInterlevel.instance == null) com.isartdigital.operationaaa.ui.popin.WinInterlevel.instance = new com.isartdigital.operationaaa.ui.popin.WinInterlevel();
	return com.isartdigital.operationaaa.ui.popin.WinInterlevel.instance;
};
com.isartdigital.operationaaa.ui.popin.WinInterlevel.__super__ = com.isartdigital.utils.ui.Popin;
com.isartdigital.operationaaa.ui.popin.WinInterlevel.prototype = $extend(com.isartdigital.utils.ui.Popin.prototype,{
	onClickNext: function(pData) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeCurrentPopin();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeHud();
		com.isartdigital.operationaaa.game.GameManager.getInstance().stopGameAndBackToSelection();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.popin.WinInterlevel.instance = null;
		com.isartdigital.utils.ui.Popin.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.ui.popin.WinInterlevel
});
com.isartdigital.operationaaa.ui.screens = {};
com.isartdigital.operationaaa.ui.screens.CreditsScreen = function() {
	com.isartdigital.utils.ui.Screen.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "winFinal_bg.png"));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	var progCredits = new PIXI.Text("PROGRAMMERS",{ font : "78px Arial"});
	progCredits.anchor.set(0.5,0.5);
	progCredits.position.set(0,-200);
	this.addChild(progCredits);
	var daCredtis = new PIXI.Text("DESGINERS",{ font : "78px Arial"});
	daCredtis.anchor.set(0.5,0.5);
	daCredtis.position.set(0,200);
	this.addChild(daCredtis);
	var tcButton = new com.isartdigital.utils.ui.Button();
	tcButton.position.set(0,400);
	tcButton.onClick = $bind(this,this.onClickTcButtonBtn);
	this.addChild(tcButton);
};
$hxClasses["com.isartdigital.operationaaa.ui.screens.CreditsScreen"] = com.isartdigital.operationaaa.ui.screens.CreditsScreen;
com.isartdigital.operationaaa.ui.screens.CreditsScreen.__name__ = ["com","isartdigital","operationaaa","ui","screens","CreditsScreen"];
com.isartdigital.operationaaa.ui.screens.CreditsScreen.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.screens.CreditsScreen.instance == null) com.isartdigital.operationaaa.ui.screens.CreditsScreen.instance = new com.isartdigital.operationaaa.ui.screens.CreditsScreen();
	return com.isartdigital.operationaaa.ui.screens.CreditsScreen.instance;
};
com.isartdigital.operationaaa.ui.screens.CreditsScreen.__super__ = com.isartdigital.utils.ui.Screen;
com.isartdigital.operationaaa.ui.screens.CreditsScreen.prototype = $extend(com.isartdigital.utils.ui.Screen.prototype,{
	onClickTcButtonBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeScreens();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.TitleCard.getInstance());
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.screens.CreditsScreen.instance = null;
		com.isartdigital.utils.ui.Screen.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.ui.screens.CreditsScreen
});
com.isartdigital.operationaaa.ui.screens.FinalWin = function() {
	com.isartdigital.utils.ui.Screen.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "winFinal_bg.png"));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	var winTitle = new PIXI.Text("VICTOIRE !!",{ font : "78px Arial"});
	winTitle.anchor.set(0.5,0.5);
	winTitle.position.set(0,-400);
	this.addChild(winTitle);
	this.creditButton = new com.isartdigital.utils.ui.Button();
	this.creditButton.position.set(0,400);
	this.creditButton.onClick = $bind(this,this.onClickCreditBtn);
	this.addChild(this.creditButton);
};
$hxClasses["com.isartdigital.operationaaa.ui.screens.FinalWin"] = com.isartdigital.operationaaa.ui.screens.FinalWin;
com.isartdigital.operationaaa.ui.screens.FinalWin.__name__ = ["com","isartdigital","operationaaa","ui","screens","FinalWin"];
com.isartdigital.operationaaa.ui.screens.FinalWin.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.screens.FinalWin.instance == null) com.isartdigital.operationaaa.ui.screens.FinalWin.instance = new com.isartdigital.operationaaa.ui.screens.FinalWin();
	return com.isartdigital.operationaaa.ui.screens.FinalWin.instance;
};
com.isartdigital.operationaaa.ui.screens.FinalWin.__super__ = com.isartdigital.utils.ui.Screen;
com.isartdigital.operationaaa.ui.screens.FinalWin.prototype = $extend(com.isartdigital.utils.ui.Screen.prototype,{
	onClickCreditBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeScreens();
		com.isartdigital.operationaaa.ui.CheatPanel.getInstance().clear();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().closeHud();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.CreditsScreen.getInstance());
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.screens.FinalWin.instance = null;
		com.isartdigital.utils.ui.Screen.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.ui.screens.FinalWin
});
com.isartdigital.operationaaa.ui.screens.Options = function() {
	com.isartdigital.utils.ui.Screen.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromImage(com.isartdigital.utils.Config.get_assetsPath() + "Options_bg.png"));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	this.backBtn = new com.isartdigital.operationaaa.ui.buttons.ButtonBack();
	this.backBtn.position.set(-900,550);
	this.backBtn.onClick = $bind(this,this.onClickBackBtn);
	this.addChild(this.backBtn);
	this.deleteSaveBtn = new com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave();
	this.deleteSaveBtn.position.set(900,550);
	this.deleteSaveBtn.onClick = $bind(this,this.onClickDeleteSaveBtn);
	this.addChild(this.deleteSaveBtn);
	this.soundBtnOn = new com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn();
	this.soundBtnOn.position.y = 200;
	this.soundBtnOn.onClick = $bind(this,this.onClickSoundOnBtn);
	this.addChild(this.soundBtnOn);
	var titleTxt = new PIXI.Text(com.isartdigital.utils.ui.TranslationManager.get("OPTIONS_TITLE"));
	titleTxt.setStyle({ fill : "white", stroke : "black", strokeThickness : 5, font : "124px GothicStyle"});
	titleTxt.anchor.set(0.5,0.5);
	titleTxt.y = -550;
	this.addChild(titleTxt);
	this.flagsMap = new haxe.ds.StringMap();
	this.addFlagToScreen("fr",-400,-200);
	this.addFlagToScreen("en",400,-200);
	this.markFlag((function($this) {
		var $r;
		var this1 = com.isartdigital.operationaaa.SaveManager.getInstance().get_userConfig();
		$r = this1.get("language");
		return $r;
	}(this)));
};
$hxClasses["com.isartdigital.operationaaa.ui.screens.Options"] = com.isartdigital.operationaaa.ui.screens.Options;
com.isartdigital.operationaaa.ui.screens.Options.__name__ = ["com","isartdigital","operationaaa","ui","screens","Options"];
com.isartdigital.operationaaa.ui.screens.Options.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.screens.Options.instance == null) com.isartdigital.operationaaa.ui.screens.Options.instance = new com.isartdigital.operationaaa.ui.screens.Options();
	return com.isartdigital.operationaaa.ui.screens.Options.instance;
};
com.isartdigital.operationaaa.ui.screens.Options.__super__ = com.isartdigital.utils.ui.Screen;
com.isartdigital.operationaaa.ui.screens.Options.prototype = $extend(com.isartdigital.utils.ui.Screen.prototype,{
	addFlagToScreen: function(pLanguage,pHorizontalOffset,pVerticalOffset) {
		if(pVerticalOffset == null) pVerticalOffset = 0;
		if(pHorizontalOffset == null) pHorizontalOffset = 0;
		var v = new PIXI.Sprite(PIXI.Texture.fromFrame("flag_" + pLanguage + ".png"));
		this.flagsMap.set(pLanguage,v);
		v;
		var lFlag = this.flagsMap.get(pLanguage);
		lFlag.anchor.set(0.5,0.5);
		lFlag.scale.set(0.75,0.75);
		lFlag.position.set(pHorizontalOffset,pVerticalOffset);
		lFlag.interactive = true;
		lFlag.name = pLanguage;
		lFlag.click = lFlag.tap = $bind(this,this.onClickFlag);
		this.addChild(lFlag);
	}
	,markFlag: function(pLanguageToMark) {
		if(this.flagMarker == null) {
			this.flagMarker = new PIXI.Sprite(PIXI.Texture.fromFrame("ButtonValidate0001.png"));
			this.flagMarker.scale.x = this.flagMarker.scale.y *= 0.5;
			this.flagMarker.tint = 52224;
		}
		if(this.flagMarker.parent != null) this.flagMarker.parent.removeChild(this.flagMarker);
		this.flagMarker.anchor.set(0.5,0.5);
		this.flagMarker.position.set(this.flagsMap.get(pLanguageToMark).x - 10,this.flagsMap.get(pLanguageToMark).y + 50);
		this.addChild(this.flagMarker);
	}
	,onClickFlag: function(pEvent) {
		var lLang = pEvent.target.name;
		this.markFlag(lLang);
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.utils.ui.TranslationManager.getInstance().setLanguage(lLang);
		var this1 = com.isartdigital.operationaaa.SaveManager.getInstance().get_userConfig();
		this1.set("language",lLang);
		lLang;
		com.isartdigital.operationaaa.SaveManager.getInstance().save();
		haxe.Log.trace("Langue après changement : " + Std.string((function($this) {
			var $r;
			var this2 = com.isartdigital.operationaaa.SaveManager.getInstance().get_userConfig();
			$r = this2.get("language");
			return $r;
		}(this))),{ fileName : "Options.hx", lineNumber : 169, className : "com.isartdigital.operationaaa.ui.screens.Options", methodName : "onClickFlag"});
	}
	,onClickBackBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.TitleCard.getInstance());
	}
	,onClickSaveBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
	}
	,onClickDeleteSaveBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openPopin(com.isartdigital.operationaaa.ui.popin.DeleteSave.getInstance());
	}
	,onClickSoundOnBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		window.Howler.mute();
		this.soundBtnOff = new com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff();
		this.soundBtnOff.position.set(this.soundBtnOn.x,this.soundBtnOn.y);
		this.removeChild(this.soundBtnOn);
		this.soundBtnOff.onClick = $bind(this,this.onClickSoundOffBtn);
		this.addChild(this.soundBtnOff);
	}
	,onClickSoundOffBtn: function(pEvent) {
		window.Howler.unmute();
		this.soundBtnOn = new com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn();
		this.soundBtnOn.position.set(this.soundBtnOff.x,this.soundBtnOff.y);
		this.removeChild(this.soundBtnOff);
		this.soundBtnOn.onClick = $bind(this,this.onClickSoundOnBtn);
		this.addChild(this.soundBtnOn);
	}
	,open: function() {
		com.isartdigital.utils.ui.Screen.prototype.open.call(this);
		com.isartdigital.utils.sounds.SoundManager.getSound("main_music").play();
	}
	,close: function() {
		com.isartdigital.utils.ui.Screen.prototype.close.call(this);
		com.isartdigital.utils.sounds.SoundManager.getSound("main_music").pause();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.screens.Options.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.ui.screens.Options
});
com.isartdigital.operationaaa.ui.screens.SelectScreen = function() {
	this.MARGIN_Y = 600;
	this.MARGIN_X = -900;
	this.isOnMainScreen = true;
	com.isartdigital.utils.ui.Screen.call(this);
	com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel.getLocalisedLevelNames();
	this.levelPanels = [];
	var _g = new haxe.ds.StringMap();
	_g.set("closed",0);
	_g.set("normal",0);
	_g.set("open",0);
	this.levelWidths = _g;
	this.doAction = $bind(this,this.doActionVoid);
	this.levelSorting = com.isartdigital.operationaaa.SaveManager.getInstance().get_levelSorting();
	if(this.levelSorting == null) com.isartdigital.operationaaa.SaveManager.getInstance().set_levelSorting(this.levelSorting = this.shuffleLevels());
};
$hxClasses["com.isartdigital.operationaaa.ui.screens.SelectScreen"] = com.isartdigital.operationaaa.ui.screens.SelectScreen;
com.isartdigital.operationaaa.ui.screens.SelectScreen.__name__ = ["com","isartdigital","operationaaa","ui","screens","SelectScreen"];
com.isartdigital.operationaaa.ui.screens.SelectScreen.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.screens.SelectScreen.instance == null) com.isartdigital.operationaaa.ui.screens.SelectScreen.instance = new com.isartdigital.operationaaa.ui.screens.SelectScreen();
	return com.isartdigital.operationaaa.ui.screens.SelectScreen.instance;
};
com.isartdigital.operationaaa.ui.screens.SelectScreen.__super__ = com.isartdigital.utils.ui.Screen;
com.isartdigital.operationaaa.ui.screens.SelectScreen.prototype = $extend(com.isartdigital.utils.ui.Screen.prototype,{
	shuffleLevels: function() {
		var lPool = [1,2,3,4];
		var lLevelSorting = [];
		var randomIndex;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			randomIndex = Math.floor(Math.random() * lPool.length);
			lLevelSorting.push(lPool[randomIndex]);
			lPool.splice(randomIndex,1);
		}
		return lLevelSorting;
	}
	,open: function() {
		com.isartdigital.utils.ui.Screen.prototype.open.call(this);
		com.isartdigital.utils.sounds.SoundManager.getSound("main_music").play();
		this.recordScreenLimits();
		this.calculateWidths();
		this.levelsData = com.isartdigital.operationaaa.SaveManager.getInstance().get_levelsData();
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.initPanelForLevel(i,this.levelSorting[i]);
		}
		this.addButton();
		com.isartdigital.operationaaa.Main.getInstance().addEventListener("GameEvent.GAME_LOOP",$bind(this,this.selecLoop));
	}
	,recordScreenLimits: function() {
		var lScreenRectangle = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(this);
		var lTopLeft = new PIXI.Point(lScreenRectangle.x,lScreenRectangle.y);
		var lBottomRight = new PIXI.Point(lScreenRectangle.x + lScreenRectangle.width,lScreenRectangle.y + lScreenRectangle.height);
		var lWidth;
		var lHeight;
		if(lTopLeft.x < -1215) lTopLeft.x = -1215;
		if(lTopLeft.y < -768) lTopLeft.y = -768;
		if(lBottomRight.x > 1215) lBottomRight.x = 1215;
		if(lBottomRight.y > 768) lBottomRight.y = 768;
		lWidth = lBottomRight.x - lTopLeft.x;
		lHeight = lBottomRight.y - lTopLeft.y;
		this.screenLimits = new PIXI.Rectangle(lTopLeft.x,lTopLeft.y,lWidth,lHeight);
	}
	,calculateWidths: function() {
		var v = this.screenLimits.width / 4;
		this.levelWidths.set("normal",v);
		v;
		if(this.screenLimits.width * 0.1 < 300) {
			this.levelWidths.set("closed",300);
			300;
			var v1 = this.screenLimits.width - 900;
			this.levelWidths.set("open",v1);
			v1;
		} else {
			var v2 = this.screenLimits.width * 0.1;
			this.levelWidths.set("closed",v2);
			v2;
			var v3 = this.screenLimits.width * 0.7;
			this.levelWidths.set("open",v3);
			v3;
		}
	}
	,initPanelForLevel: function(pIndex,pLevel) {
		var lTotalCollectables;
		if(this.levelsData[pLevel].get("total") == null) lTotalCollectables = 60; else lTotalCollectables = this.levelsData[pLevel].get("total");
		var lCollectedCollectables;
		if(this.levelsData[pLevel].get("collected") == null) lCollectedCollectables = 0; else lCollectedCollectables = this.levelsData[pLevel].get("collected");
		var lLevelPanel = new com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel(pLevel,this.levelsData[pLevel].get("upgrade"),lCollectedCollectables,lTotalCollectables);
		this.levelPanels.push(lLevelPanel);
		lLevelPanel.x = this.screenLimits.x + (2 * pIndex + 1) / 8 * this.screenLimits.width;
		lLevelPanel.y = this.screenLimits.y + this.screenLimits.height / 2;
		lLevelPanel.rectangle = new PIXI.Rectangle(-this.screenLimits.width / 8,lLevelPanel.y - this.screenLimits.height / 2,this.levelWidths.get("normal"),this.screenLimits.height);
		lLevelPanel.setModeNormal();
		this.addChild(lLevelPanel);
	}
	,selecLoop: function() {
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.levelPanels[i].doAction();
		}
		this.doAction();
	}
	,setModeOpenPanel: function(pLevel) {
		this.isOnMainScreen = false;
		var lLevelPanel;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			lLevelPanel = this.levelPanels[i];
			if(lLevelPanel.levelId == pLevel) {
				this.currentIndex = i;
				lLevelPanel.setModeTween(this.levelWidths.get("open"),$bind(lLevelPanel,lLevelPanel.setModeOpen));
			} else this.levelPanels[i].setModeTween(this.levelWidths.get("closed"),$bind(lLevelPanel,lLevelPanel.setModeClosed));
		}
		this.doAction = $bind(this,this.doActionMovePanels);
	}
	,setMode4Panels: function() {
		this.isOnMainScreen = true;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			this.levelPanels[i].setModeTween(this.levelWidths.get("normal"),($_=this.levelPanels[i],$bind($_,$_.setModeNormal)));
		}
		this.doAction = $bind(this,this.doActionMovePanels);
	}
	,doActionMovePanels: function() {
		var lPanel;
		var lPreviousPanel;
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			lPanel = this.levelPanels[i];
			if(i == 0) lPanel.x = this.screenLimits.x + lPanel.rectangle.width / 2; else {
				lPreviousPanel = this.levelPanels[i - 1];
				lPanel.x = lPreviousPanel.x + lPreviousPanel.rectangle.width / 2 + lPanel.rectangle.width / 2;
			}
		}
		if(!this.levelPanels[0].isTweening && !this.levelPanels[1].isTweening && !this.levelPanels[2].isTweening && !this.levelPanels[3].isTweening) {
			haxe.Log.trace("transition Done",{ fileName : "SelectScreen.hx", lineNumber : 342, className : "com.isartdigital.operationaaa.ui.screens.SelectScreen", methodName : "doActionMovePanels"});
			this.doAction = $bind(this,this.doActionVoid);
		}
	}
	,doActionVoid: function() {
	}
	,addButton: function() {
		var backBtn = new com.isartdigital.operationaaa.ui.buttons.ButtonBack();
		backBtn.position.set(this.MARGIN_X,this.MARGIN_Y);
		backBtn.onClick = $bind(this,this.onClickBackBtn);
		this.addChild(backBtn);
	}
	,onClickBackBtn: function(pEvent) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		if(this.isOnMainScreen) com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.TitleCard.getInstance()); else this.setMode4Panels();
	}
	,close: function() {
		com.isartdigital.utils.sounds.SoundManager.getSound("main_music").pause();
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.selecLoop));
		com.isartdigital.utils.ui.Screen.prototype.close.call(this);
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.screens.SelectScreen.instance = null;
	}
	,__class__: com.isartdigital.operationaaa.ui.screens.SelectScreen
});
com.isartdigital.operationaaa.ui.screens.TitleCard = function() {
	this.countdown = 45;
	com.isartdigital.utils.ui.Screen.call(this);
	this.background = new PIXI.Sprite(PIXI.Texture.fromFrame("TitleCard_bg.png"));
	this.background.anchor.set(0.5,0.5);
	this.addChild(this.background);
	this.title = new PIXI.Sprite(PIXI.Texture.fromFrame("TitleCard_title.png"));
	this.title.anchor.set(0.5,0.45);
	this.addChild(this.title);
	this.background.scale = this.title.scale = new PIXI.Point(1 / com.isartdigital.utils.system.DeviceCapabilities.textureRatio,1 / com.isartdigital.utils.system.DeviceCapabilities.textureRatio);
	this.buttonPlay = new com.isartdigital.operationaaa.ui.buttons.ButtonPlay();
	this.buttonPlay.position.set(-18,-1000);
	this.buttonPlayFinalPosition = new PIXI.Point(-18,390);
	this.buttonPlay.scale.x = this.buttonPlay.scale.y *= 0.6;
	this.addChild(this.buttonPlay);
	this.buttonOptions = new com.isartdigital.operationaaa.ui.buttons.ButtonOptions();
	this.buttonOptions.position.set(729,-1000);
	this.buttonOptionsFinalPosition = new PIXI.Point(729,520);
	this.buttonOptions.scale.x = this.buttonOptions.scale.y *= 0.65;
	this.addChild(this.buttonOptions);
	this.buttonPlay.onClick = this.buttonPlay.tap = $bind(this,this.onClickOnPlay);
	this.buttonOptions.onClick = this.buttonOptions.tap = $bind(this,this.onClickOnOptions);
	com.isartdigital.operationaaa.Main.getInstance().addEventListener("GameEvent.GAME_LOOP",$bind(this,this.TCLoop));
};
$hxClasses["com.isartdigital.operationaaa.ui.screens.TitleCard"] = com.isartdigital.operationaaa.ui.screens.TitleCard;
com.isartdigital.operationaaa.ui.screens.TitleCard.__name__ = ["com","isartdigital","operationaaa","ui","screens","TitleCard"];
com.isartdigital.operationaaa.ui.screens.TitleCard.getInstance = function() {
	if(com.isartdigital.operationaaa.ui.screens.TitleCard.instance == null) com.isartdigital.operationaaa.ui.screens.TitleCard.instance = new com.isartdigital.operationaaa.ui.screens.TitleCard();
	return com.isartdigital.operationaaa.ui.screens.TitleCard.instance;
};
com.isartdigital.operationaaa.ui.screens.TitleCard.__super__ = com.isartdigital.utils.ui.Screen;
com.isartdigital.operationaaa.ui.screens.TitleCard.prototype = $extend(com.isartdigital.utils.ui.Screen.prototype,{
	onClickOnPlay: function(pData) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.SelectScreen.getInstance());
	}
	,onClickOnOptions: function(pData) {
		com.isartdigital.utils.sounds.SoundManager.getSound("click").play();
		com.isartdigital.operationaaa.ui.UIManager.getInstance().openScreen(com.isartdigital.operationaaa.ui.screens.Options.getInstance());
	}
	,TCLoop: function() {
		if(this.countdown > 0) {
			this.countdown--;
			return;
		}
		if(this.tweenOn) {
			this.buttonPlay.position.y += (this.buttonPlayFinalPosition.y - this.buttonPlay.position.y) * 0.1;
			this.buttonOptions.position.y += (this.buttonOptionsFinalPosition.y - this.buttonOptions.position.y) * 0.1;
			if(this.buttonPlay.position.y - this.buttonPlayFinalPosition.y > -5 && this.buttonOptions.position.y - this.buttonOptionsFinalPosition.y > -5) {
				this.buttonPlay.position.y = this.buttonPlayFinalPosition.y;
				this.buttonOptions.position.y = this.buttonOptionsFinalPosition.y;
				this.tweenOn = false;
			}
		}
		this.buttonPlay.scale.x = 1 + Math.sin(this.playBlobCount) * 0.04;
		this.buttonPlay.scale.y = 1 + Math.cos(this.playBlobCount) * 0.04;
		this.playBlobCount += 0.1;
	}
	,open: function() {
		com.isartdigital.utils.ui.Screen.prototype.open.call(this);
		this.playBlobCount = 0;
		this.tweenOn = true;
		com.isartdigital.utils.sounds.SoundManager.getSound("main_music").play();
	}
	,close: function() {
		com.isartdigital.utils.sounds.SoundManager.getSound("main_music").pause();
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",$bind(this,this.TCLoop));
		com.isartdigital.utils.ui.Screen.prototype.close.call(this);
	}
	,destroy: function() {
		com.isartdigital.operationaaa.ui.screens.TitleCard.instance = null;
		com.isartdigital.utils.ui.Screen.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.operationaaa.ui.screens.TitleCard
});
com.isartdigital.utils.Config = function() { };
$hxClasses["com.isartdigital.utils.Config"] = com.isartdigital.utils.Config;
com.isartdigital.utils.Config.__name__ = ["com","isartdigital","utils","Config"];
com.isartdigital.utils.Config.init = function(pConfig) {
	var _g = 0;
	var _g1 = Reflect.fields(pConfig);
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		Reflect.setField(com.isartdigital.utils.Config._data,i,Reflect.field(pConfig,i));
	}
	if(com.isartdigital.utils.Config._data.version == null) com.isartdigital.utils.Config._data.version = "0.0.0";
	if(com.isartdigital.utils.Config._data.language == null || com.isartdigital.utils.Config._data.language == "") com.isartdigital.utils.Config._data.language = HxOverrides.substr(window.navigator.language,0,2);
	if(com.isartdigital.utils.Config._data.languages == []) com.isartdigital.utils.Config._data.languages.push(com.isartdigital.utils.Config._data.language);
	if(com.isartdigital.utils.Config._data.debug == null) com.isartdigital.utils.Config._data.debug = false;
	if(com.isartdigital.utils.Config._data.fps == null) com.isartdigital.utils.Config._data.fps = false;
	if(com.isartdigital.utils.Config._data.qrcode == null) com.isartdigital.utils.Config._data.qrcode = false;
	if(com.isartdigital.utils.Config._data.langPath == null) com.isartdigital.utils.Config._data.langPath = "";
	if(com.isartdigital.utils.Config._data.assetsPath == null) com.isartdigital.utils.Config._data.assetsPath = "";
	if(com.isartdigital.utils.Config._data.jsonPath == null) com.isartdigital.utils.Config._data.jsonPath = "";
	if(com.isartdigital.utils.Config._data.cssPath == null) com.isartdigital.utils.Config._data.cssPath = "";
	if(com.isartdigital.utils.Config._data.soundsPath == null) com.isartdigital.utils.Config._data.soundsPath = "";
};
com.isartdigital.utils.Config.get_data = function() {
	return com.isartdigital.utils.Config._data;
};
com.isartdigital.utils.Config.get_version = function() {
	return com.isartdigital.utils.Config._data.version;
};
com.isartdigital.utils.Config.get_language = function() {
	return com.isartdigital.utils.Config.get_data().language;
};
com.isartdigital.utils.Config.get_languages = function() {
	return com.isartdigital.utils.Config.get_data().languages;
};
com.isartdigital.utils.Config.get_debug = function() {
	return com.isartdigital.utils.Config.get_data().debug;
};
com.isartdigital.utils.Config.get_fps = function() {
	return com.isartdigital.utils.Config.get_data().fps;
};
com.isartdigital.utils.Config.get_qrcode = function() {
	return com.isartdigital.utils.Config.get_data().qrcode;
};
com.isartdigital.utils.Config.get_langPath = function() {
	return com.isartdigital.utils.Config._data.langPath;
};
com.isartdigital.utils.Config.get_cssPath = function() {
	return com.isartdigital.utils.Config._data.cssPath;
};
com.isartdigital.utils.Config.get_jsonPath = function() {
	return com.isartdigital.utils.Config._data.jsonPath;
};
com.isartdigital.utils.Config.get_assetsPath = function() {
	return com.isartdigital.utils.Config._data.assetsPath;
};
com.isartdigital.utils.Config.get_soundsPath = function() {
	return com.isartdigital.utils.Config._data.soundsPath;
};
com.isartdigital.utils.Debug = function() {
};
$hxClasses["com.isartdigital.utils.Debug"] = com.isartdigital.utils.Debug;
com.isartdigital.utils.Debug.__name__ = ["com","isartdigital","utils","Debug"];
com.isartdigital.utils.Debug.getInstance = function() {
	if(com.isartdigital.utils.Debug.instance == null) com.isartdigital.utils.Debug.instance = new com.isartdigital.utils.Debug();
	return com.isartdigital.utils.Debug.instance;
};
com.isartdigital.utils.Debug.error = function(pArg) {
	console.error(pArg);
};
com.isartdigital.utils.Debug.warn = function(pArg) {
	console.warn(pArg);
};
com.isartdigital.utils.Debug.table = function(pArg) {
	console.table(pArg);
};
com.isartdigital.utils.Debug.info = function(pArg) {
	console.info(pArg);
};
com.isartdigital.utils.Debug.prototype = {
	init: function(pGameDispatcher) {
		if(com.isartdigital.utils.Config.get_fps()) {
			this.stats = new Stats();
			this.stats.domElement.style.position = "absolute";
			this.stats.domElement.style.left = "0px";
			this.stats.domElement.style.top = "0px";
			window.document.body.appendChild(this.stats.domElement);
			pGameDispatcher.addEventListener("GameEvent.GAME_LOOP",$bind(this,this.updateStats));
		}
		if(com.isartdigital.utils.Config.get_qrcode()) {
			var lQr = new Image();
			lQr.style.position = "absolute";
			lQr.style.right = "0px";
			lQr.style.bottom = "0px";
			var lSize = Std["int"](0.35 * com.isartdigital.utils.system.DeviceCapabilities.getSizeFactor());
			lQr.src = "https://chart.googleapis.com/chart?chs=" + lSize + "x" + lSize + "&cht=qr&chl=" + window.location.href + "&choe=UTF-8";
			window.document.body.appendChild(lQr);
		}
	}
	,updateStats: function(pEvent) {
		this.stats.end();
		this.stats.begin();
	}
	,__class__: com.isartdigital.utils.Debug
};
com.isartdigital.utils.effects = {};
com.isartdigital.utils.effects.Trail = function(pTarget,pFrequency,pPersistence) {
	if(pPersistence == null) pPersistence = 0;
	if(pFrequency == null) pFrequency = 0;
	this.oldPos = new PIXI.Point(0,0);
	this.list = [];
	this.counter = 0;
	com.isartdigital.utils.game.GameObject.call(this);
	this.target = pTarget;
	this.frequency = Math.max(0,Math.min(pFrequency,1)) * 4;
	this.persistence = 0.95 + Math.max(0,Math.min(pPersistence,1)) / 20;
	this.target.parent.addChildAt(this,this.target.parent.getChildIndex(this.target));
	this.start();
};
$hxClasses["com.isartdigital.utils.effects.Trail"] = com.isartdigital.utils.effects.Trail;
com.isartdigital.utils.effects.Trail.__name__ = ["com","isartdigital","utils","effects","Trail"];
com.isartdigital.utils.effects.Trail.__super__ = com.isartdigital.utils.game.GameObject;
com.isartdigital.utils.effects.Trail.prototype = $extend(com.isartdigital.utils.game.GameObject.prototype,{
	setModeNormal: function() {
		com.isartdigital.utils.game.GameObject.prototype.setModeNormal.call(this);
		com.isartdigital.operationaaa.Main.getInstance().addEventListener("GameEvent.GAME_LOOP",this.doAction);
	}
	,doActionNormal: function() {
		var _g1 = 0;
		var _g = this.list.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.list[i].scale.x *= this.persistence;
			this.list[i].scale.y *= this.persistence;
			this.list[i].alpha *= this.persistence;
		}
		if(this.list.length > 0 && this.list[0].scale.x < 0.1) this.removeChild(this.list.shift());
		if((function($this) {
			var $r;
			var a = ++$this.counter;
			$r = (function($this) {
				var $r;
				var $int = a;
				$r = $int < 0?4294967296.0 + $int:$int + 0.0;
				return $r;
			}($this)) > $this.frequency;
			return $r;
		}(this)) && (this.oldPos.x != this.target.x || this.oldPos.y != this.target.y)) {
			var lCircle = new pixi.display.DisplayObjectContainer();
			var lGraph = new PIXI.Graphics();
			lGraph.beginFill(16777215);
			lGraph.drawCircle(0,0,20);
			lGraph.endFill();
			lCircle.position = this.target.position.clone();
			lCircle.addChild(lGraph);
			this.addChild(lCircle);
			this.list.push(lCircle);
			this.counter = 0;
		}
		this.oldPos = this.target.position.clone();
	}
	,destroy: function() {
		com.isartdigital.operationaaa.Main.getInstance().removeEventListener("GameEvent.GAME_LOOP",this.doAction);
		this.target.parent.removeChild(this);
		this.target = null;
		com.isartdigital.utils.game.GameObject.prototype.destroy.call(this);
	}
	,__class__: com.isartdigital.utils.effects.Trail
});
com.isartdigital.utils.events = {};
com.isartdigital.utils.events.EventTarget = function() {
	PIXI.EventTarget.call(this);
};
$hxClasses["com.isartdigital.utils.events.EventTarget"] = com.isartdigital.utils.events.EventTarget;
com.isartdigital.utils.events.EventTarget.__name__ = ["com","isartdigital","utils","events","EventTarget"];
com.isartdigital.utils.events.EventTarget.__super__ = PIXI.EventTarget;
com.isartdigital.utils.events.EventTarget.prototype = $extend(PIXI.EventTarget.prototype,{
	__class__: com.isartdigital.utils.events.EventTarget
});
com.isartdigital.utils.events.GameEvent = function(target,name,data) {
	PIXI.Event.call(this,target,name,data);
};
$hxClasses["com.isartdigital.utils.events.GameEvent"] = com.isartdigital.utils.events.GameEvent;
com.isartdigital.utils.events.GameEvent.__name__ = ["com","isartdigital","utils","events","GameEvent"];
com.isartdigital.utils.events.GameEvent.__super__ = PIXI.Event;
com.isartdigital.utils.events.GameEvent.prototype = $extend(PIXI.Event.prototype,{
	__class__: com.isartdigital.utils.events.GameEvent
});
com.isartdigital.utils.events.GameStageEvent = function(target,name,data) {
	PIXI.Event.call(this,target,name,data);
};
$hxClasses["com.isartdigital.utils.events.GameStageEvent"] = com.isartdigital.utils.events.GameStageEvent;
com.isartdigital.utils.events.GameStageEvent.__name__ = ["com","isartdigital","utils","events","GameStageEvent"];
com.isartdigital.utils.events.GameStageEvent.__super__ = PIXI.Event;
com.isartdigital.utils.events.GameStageEvent.prototype = $extend(PIXI.Event.prototype,{
	__class__: com.isartdigital.utils.events.GameStageEvent
});
com.isartdigital.utils.events.LoaderEvent = function(target,name,data) {
	PIXI.Event.call(this,target,name,data);
};
$hxClasses["com.isartdigital.utils.events.LoaderEvent"] = com.isartdigital.utils.events.LoaderEvent;
com.isartdigital.utils.events.LoaderEvent.__name__ = ["com","isartdigital","utils","events","LoaderEvent"];
com.isartdigital.utils.events.LoaderEvent.__super__ = PIXI.Event;
com.isartdigital.utils.events.LoaderEvent.prototype = $extend(PIXI.Event.prototype,{
	__class__: com.isartdigital.utils.events.LoaderEvent
});
com.isartdigital.utils.game.BoxType = $hxClasses["com.isartdigital.utils.game.BoxType"] = { __ename__ : ["com","isartdigital","utils","game","BoxType"], __constructs__ : ["NONE","SIMPLE","MULTIPLE","SELF"] };
com.isartdigital.utils.game.BoxType.NONE = ["NONE",0];
com.isartdigital.utils.game.BoxType.NONE.__enum__ = com.isartdigital.utils.game.BoxType;
com.isartdigital.utils.game.BoxType.SIMPLE = ["SIMPLE",1];
com.isartdigital.utils.game.BoxType.SIMPLE.__enum__ = com.isartdigital.utils.game.BoxType;
com.isartdigital.utils.game.BoxType.MULTIPLE = ["MULTIPLE",2];
com.isartdigital.utils.game.BoxType.MULTIPLE.__enum__ = com.isartdigital.utils.game.BoxType;
com.isartdigital.utils.game.BoxType.SELF = ["SELF",3];
com.isartdigital.utils.game.BoxType.SELF.__enum__ = com.isartdigital.utils.game.BoxType;
com.isartdigital.utils.game.Camera = function() {
	this.focusXOnCameraBlocked = null;
	this.zoomMax = 1.2;
	this.zoomSpeed = 0.001;
	this.idleDelay = 60;
	this.idleCounter = 0;
	this.delayV = 60;
	this.countV = 5;
	this.delayH = 40;
	this.countH = 40;
	this.inertiaMin = new PIXI.Point(6.5,8);
	this.inertiaMax = new PIXI.Point(40,20);
};
$hxClasses["com.isartdigital.utils.game.Camera"] = com.isartdigital.utils.game.Camera;
com.isartdigital.utils.game.Camera.__name__ = ["com","isartdigital","utils","game","Camera"];
com.isartdigital.utils.game.Camera.getInstance = function() {
	if(com.isartdigital.utils.game.Camera.instance == null) com.isartdigital.utils.game.Camera.instance = new com.isartdigital.utils.game.Camera();
	return com.isartdigital.utils.game.Camera.instance;
};
com.isartdigital.utils.game.Camera.prototype = {
	setTarget: function(pTarget) {
		if(pTarget.stage == null) {
			com.isartdigital.utils.Debug.warn("L'élément que vous voulez cibler n'est pas attaché à la DisplayList, l'action est ignorée.");
			return;
		}
		this.target = pTarget;
	}
	,setFocus: function(pFocus) {
		this.focus = pFocus;
	}
	,changePosition: function(pDelay,pVLock) {
		if(pVLock == null) pVLock = false;
		if(pDelay == null) pDelay = true;
		this.countH++;
		this.countV++;
		var lCenter = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(this.target.parent);
		var lFocus = this.target.toLocal(this.focus.position,this.focus.parent);
		var lInertiaX;
		if(pDelay) lInertiaX = this.getInertiaX(); else lInertiaX = 1;
		var lInertiaY;
		if(pDelay) lInertiaY = this.getInertiaY(); else lInertiaY = 1;
		var lDeltaX = (lCenter.x + lCenter.width / 2 - lFocus.x - this.target.x) / lInertiaX;
		var lDeltaY = (lCenter.y + lCenter.height / 2 - lFocus.y - this.target.y) / lInertiaY;
		if(pVLock) lDeltaY = 0;
		var lMoved = true;
		if(Math.round(lDeltaX * 1000) / 1000 == 0 && Math.round(lDeltaY * 1000) / 1000 == 0) lMoved = false;
		if(!this.limitsHorizontalReached()) this.target.x += lDeltaX;
		this.target.y += lDeltaY;
		return lMoved;
	}
	,getInertiaX: function() {
		if((function($this) {
			var $r;
			var a = $this.countH;
			var b = $this.delayH;
			var aNeg = a < 0;
			var bNeg = b < 0;
			$r = aNeg != bNeg?aNeg:a > b;
			return $r;
		}(this))) return this.inertiaMin.x;
		return this.inertiaMax.x + (function($this) {
			var $r;
			var $int = $this.countH;
			$r = $int < 0?4294967296.0 + $int:$int + 0.0;
			return $r;
		}(this)) * (this.inertiaMin.x - this.inertiaMax.x) / (function($this) {
			var $r;
			var int1;
			{
				var int2 = $this.delayH;
				if(int2 < 0) int1 = 4294967296.0 + int2; else int1 = int2 + 0.0;
			}
			$r = int1 < 0?4294967296.0 + int1:int1 + 0.0;
			return $r;
		}(this));
	}
	,getInertiaY: function() {
		if((function($this) {
			var $r;
			var a = $this.countV;
			var b = $this.delayV;
			var aNeg = a < 0;
			var bNeg = b < 0;
			$r = aNeg != bNeg?aNeg:a > b;
			return $r;
		}(this))) return this.inertiaMin.y;
		return this.inertiaMax.y + (function($this) {
			var $r;
			var $int = $this.countV;
			$r = $int < 0?4294967296.0 + $int:$int + 0.0;
			return $r;
		}(this)) * (this.inertiaMin.y - this.inertiaMax.y) / (function($this) {
			var $r;
			var int1;
			{
				var int2 = $this.delayV;
				if(int2 < 0) int1 = 4294967296.0 + int2; else int1 = int2 + 0.0;
			}
			$r = int1 < 0?4294967296.0 + int1:int1 + 0.0;
			return $r;
		}(this));
	}
	,setPosition: function() {
		com.isartdigital.utils.game.GameStage.getInstance().render();
		this.changePosition(false);
	}
	,limitsHorizontalReached: function() {
		return com.isartdigital.operationaaa.game.sprites.Player.getInstance().x < 1700 && !com.isartdigital.operationaaa.game.sprites.Player.getInstance().isDead || com.isartdigital.operationaaa.game.sprites.Player.getInstance().x > com.isartdigital.operationaaa.game.leveldesign.LevelManager.getInstance().levelWidthInPixels - 1700;
	}
	,move: function() {
		return this.changePosition(true);
	}
	,resetX: function() {
		this.countH = 0;
	}
	,resetY: function() {
		this.countV = 0;
	}
	,destroy: function() {
		com.isartdigital.utils.game.Camera.instance = null;
	}
	,__class__: com.isartdigital.utils.game.Camera
};
com.isartdigital.utils.game.CollisionManager = function() {
};
$hxClasses["com.isartdigital.utils.game.CollisionManager"] = com.isartdigital.utils.game.CollisionManager;
com.isartdigital.utils.game.CollisionManager.__name__ = ["com","isartdigital","utils","game","CollisionManager"];
com.isartdigital.utils.game.CollisionManager.hitTestObject = function(pObjectA,pObjectB) {
	if(pObjectA == null || pObjectB == null) return null;
	return com.isartdigital.utils.game.CollisionManager.getIntersection(pObjectA.getBounds(),pObjectB.getBounds());
};
com.isartdigital.utils.game.CollisionManager.hitTestPoint = function(pItem,pGlobalPoint) {
	var lTransform = pItem.worldTransform;
	var a = lTransform.a;
	var b = lTransform.b;
	var c = lTransform.c;
	var tx = lTransform.tx;
	var d = lTransform.d;
	var ty = lTransform.ty;
	var id = 1 / (a * d + c * -b);
	var x = d * id * pGlobalPoint.x + -c * id * pGlobalPoint.y + (ty * c - tx * d) * id;
	var y = a * id * pGlobalPoint.y + -b * id * pGlobalPoint.x + (-ty * a + tx * b) * id;
	if(pItem.hitArea != null && pItem.hitArea.contains != null) return pItem.hitArea.contains(x,y); else if(js.Boot.__instanceof(pItem,PIXI.Sprite)) {
		var lSprite;
		lSprite = js.Boot.__cast(pItem , PIXI.Sprite);
		var lWidth = lSprite.texture.frame.width;
		var lHeight = lSprite.texture.frame.height;
		var lX1 = -lWidth * lSprite.anchor.x;
		var lY1;
		if(x > lX1 && x < lX1 + lWidth) {
			lY1 = -lHeight * lSprite.anchor.y;
			if(y > lY1 && y < lY1 + lHeight) return true;
		}
	} else if(js.Boot.__instanceof(pItem,PIXI.Graphics)) {
		var lGraphicsData = pItem.graphicsData;
		var _g1 = 0;
		var _g = lGraphicsData.length;
		while(_g1 < _g) {
			var i = _g1++;
			var lData = lGraphicsData[i];
			if(!lData.fill) continue;
			if(lData.shape != null && lData.shape.contains(x,y)) return true;
		}
	} else if(js.Boot.__instanceof(pItem,pixi.display.DisplayObjectContainer)) {
		var lContainer;
		lContainer = js.Boot.__cast(pItem , pixi.display.DisplayObjectContainer);
		var lLength = lContainer.children.length;
		var _g2 = 0;
		while(_g2 < lLength) {
			var i1 = _g2++;
			if(com.isartdigital.utils.game.CollisionManager.hitTestPoint(lContainer.children[i1],pGlobalPoint)) return true;
		}
	}
	return false;
};
com.isartdigital.utils.game.CollisionManager.hasCollision = function(pHitBoxA,pHitBoxB,pPointsA,pPointsB) {
	if(pHitBoxA == null || pHitBoxB == null) return false;
	if(!com.isartdigital.utils.game.CollisionManager.hitTestObject(pHitBoxA,pHitBoxB)) return false;
	if(pPointsA == null && pPointsB == null) return true;
	if(pPointsA != null) return com.isartdigital.utils.game.CollisionManager.testPoints(pPointsA,pHitBoxB);
	if(pPointsB != null) return com.isartdigital.utils.game.CollisionManager.testPoints(pPointsB,pHitBoxA);
	return false;
};
com.isartdigital.utils.game.CollisionManager.getIntersection = function(pRectA,pRectB) {
	return !(pRectB.x > pRectA.x + pRectA.width || pRectB.x + pRectB.width < pRectA.x || pRectB.y > pRectA.y + pRectA.height || pRectB.y + pRectB.height < pRectA.y);
};
com.isartdigital.utils.game.CollisionManager.testPoints = function(pHitPoints,pHitBox) {
	var lLength = pHitPoints.length;
	var _g = 0;
	while(_g < lLength) {
		var i = _g++;
		if(com.isartdigital.utils.game.CollisionManager.hitTestPoint(pHitBox,pHitPoints[i])) return true;
	}
	return false;
};
com.isartdigital.utils.game.CollisionManager.prototype = {
	__class__: com.isartdigital.utils.game.CollisionManager
};
com.isartdigital.utils.game.GameStage = function() {
	this._safeZone = new PIXI.Rectangle(0,0,2048,1366);
	this._scaleMode = com.isartdigital.utils.game.GameStageScale.SHOW_ALL;
	this._alignMode = com.isartdigital.utils.game.GameStageAlign.CENTER;
	pixi.display.DisplayObjectContainer.call(this);
	this.gameContainer = new pixi.display.DisplayObjectContainer();
	this.addChild(this.gameContainer);
	this.screensContainer = new pixi.display.DisplayObjectContainer();
	this.addChild(this.screensContainer);
	this.hudContainer = new pixi.display.DisplayObjectContainer();
	this.addChild(this.hudContainer);
	this.popinsContainer = new pixi.display.DisplayObjectContainer();
	this.addChild(this.popinsContainer);
	this.eventTarget = new com.isartdigital.utils.events.EventTarget();
};
$hxClasses["com.isartdigital.utils.game.GameStage"] = com.isartdigital.utils.game.GameStage;
com.isartdigital.utils.game.GameStage.__name__ = ["com","isartdigital","utils","game","GameStage"];
com.isartdigital.utils.game.GameStage.getInstance = function() {
	if(com.isartdigital.utils.game.GameStage.instance == null) com.isartdigital.utils.game.GameStage.instance = new com.isartdigital.utils.game.GameStage();
	return com.isartdigital.utils.game.GameStage.instance;
};
com.isartdigital.utils.game.GameStage.__super__ = pixi.display.DisplayObjectContainer;
com.isartdigital.utils.game.GameStage.prototype = $extend(pixi.display.DisplayObjectContainer.prototype,{
	init: function(pRender,pSafeZoneWidth,pSafeZoneHeight,centerGameContainer,centerScreensContainer,centerPopinContainer) {
		if(centerPopinContainer == null) centerPopinContainer = true;
		if(centerScreensContainer == null) centerScreensContainer = true;
		if(centerGameContainer == null) centerGameContainer = false;
		if(pSafeZoneHeight == null) pSafeZoneHeight = 2048;
		if(pSafeZoneWidth == null) pSafeZoneWidth = 2048;
		this._render = pRender;
		this._safeZone = new PIXI.Rectangle(0,0,(function($this) {
			var $r;
			var $int = pSafeZoneWidth;
			$r = $int < 0?4294967296.0 + $int:$int + 0.0;
			return $r;
		}(this)),(function($this) {
			var $r;
			var int1 = pSafeZoneHeight;
			$r = int1 < 0?4294967296.0 + int1:int1 + 0.0;
			return $r;
		}(this)));
		if(centerGameContainer) {
			this.gameContainer.x = this.get_safeZone().width / 2;
			this.gameContainer.y = this.get_safeZone().height / 2;
		}
		if(centerScreensContainer) {
			this.screensContainer.x = this.get_safeZone().width / 2;
			this.screensContainer.y = this.get_safeZone().height / 2;
		}
		if(centerPopinContainer) {
			this.popinsContainer.x = this.get_safeZone().width / 2;
			this.popinsContainer.y = this.get_safeZone().height / 2;
		}
		this.hudContainer.x = this.get_safeZone().width / 2;
		this.hudContainer.y = this.get_safeZone().height / 2;
	}
	,resize: function() {
		var lWidth = com.isartdigital.utils.system.DeviceCapabilities.get_width();
		var lHeight = com.isartdigital.utils.system.DeviceCapabilities.get_height();
		var lRatio = Math.round(10000 * Math.min((function($this) {
			var $r;
			var $int = lWidth;
			$r = $int < 0?4294967296.0 + $int:$int + 0.0;
			return $r;
		}(this)) / this.get_safeZone().width,(function($this) {
			var $r;
			var int1 = lHeight;
			$r = int1 < 0?4294967296.0 + int1:int1 + 0.0;
			return $r;
		}(this)) / this.get_safeZone().height)) / 10000;
		if(this.get_scaleMode() == com.isartdigital.utils.game.GameStageScale.SHOW_ALL) this.scale.set(lRatio,lRatio); else this.scale.set(1,1);
		if(this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.LEFT || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.TOP_LEFT || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.BOTTOM_LEFT) this.x = 0; else if(this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.RIGHT || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.TOP_RIGHT || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.BOTTOM_RIGHT) this.x = (function($this) {
			var $r;
			var int2 = lWidth;
			$r = int2 < 0?4294967296.0 + int2:int2 + 0.0;
			return $r;
		}(this)) - this.get_safeZone().width * this.scale.x; else this.x = ((function($this) {
			var $r;
			var int3 = lWidth;
			$r = int3 < 0?4294967296.0 + int3:int3 + 0.0;
			return $r;
		}(this)) - this.get_safeZone().width * this.scale.x) / 2;
		if(this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.TOP || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.TOP_LEFT || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.TOP_RIGHT) this.y = 0; else if(this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.BOTTOM || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.BOTTOM_LEFT || this.get_alignMode() == com.isartdigital.utils.game.GameStageAlign.BOTTOM_RIGHT) this.y = (function($this) {
			var $r;
			var int4 = lHeight;
			$r = int4 < 0?4294967296.0 + int4:int4 + 0.0;
			return $r;
		}(this)) - this.get_safeZone().height * this.scale.y; else this.y = ((function($this) {
			var $r;
			var int5 = lHeight;
			$r = int5 < 0?4294967296.0 + int5:int5 + 0.0;
			return $r;
		}(this)) - this.get_safeZone().height * this.scale.y) / 2;
		this.render();
		this.eventTarget.dispatchEvent("GameStageEvent.RESIZE",{ width : lWidth, height : lHeight});
	}
	,render: function() {
		if(this._render != null) this._render();
	}
	,get_alignMode: function() {
		return this._alignMode;
	}
	,set_alignMode: function(pAlign) {
		this._alignMode = pAlign;
		this.resize();
		return this._alignMode;
	}
	,get_scaleMode: function() {
		return this._scaleMode;
	}
	,set_scaleMode: function(pScale) {
		this._scaleMode = pScale;
		this.resize();
		return this._scaleMode;
	}
	,get_safeZone: function() {
		return this._safeZone;
	}
	,getGameContainer: function() {
		return this.gameContainer;
	}
	,getScreensContainer: function() {
		return this.screensContainer;
	}
	,getHudContainer: function() {
		return this.hudContainer;
	}
	,getPopinsContainer: function() {
		return this.popinsContainer;
	}
	,addEventListener: function(pType,pListener) {
		this.eventTarget.addEventListener(pType,pListener);
	}
	,removeEventListener: function(pType,pListener) {
		this.eventTarget.removeEventListener(pType,pListener);
	}
	,destroy: function() {
		this.eventTarget = null;
		com.isartdigital.utils.game.GameStage.instance = null;
	}
	,__class__: com.isartdigital.utils.game.GameStage
});
com.isartdigital.utils.game.GameStageAlign = $hxClasses["com.isartdigital.utils.game.GameStageAlign"] = { __ename__ : ["com","isartdigital","utils","game","GameStageAlign"], __constructs__ : ["TOP","TOP_LEFT","TOP_RIGHT","CENTER","LEFT","RIGHT","BOTTOM","BOTTOM_LEFT","BOTTOM_RIGHT"] };
com.isartdigital.utils.game.GameStageAlign.TOP = ["TOP",0];
com.isartdigital.utils.game.GameStageAlign.TOP.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.TOP_LEFT = ["TOP_LEFT",1];
com.isartdigital.utils.game.GameStageAlign.TOP_LEFT.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.TOP_RIGHT = ["TOP_RIGHT",2];
com.isartdigital.utils.game.GameStageAlign.TOP_RIGHT.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.CENTER = ["CENTER",3];
com.isartdigital.utils.game.GameStageAlign.CENTER.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.LEFT = ["LEFT",4];
com.isartdigital.utils.game.GameStageAlign.LEFT.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.RIGHT = ["RIGHT",5];
com.isartdigital.utils.game.GameStageAlign.RIGHT.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.BOTTOM = ["BOTTOM",6];
com.isartdigital.utils.game.GameStageAlign.BOTTOM.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.BOTTOM_LEFT = ["BOTTOM_LEFT",7];
com.isartdigital.utils.game.GameStageAlign.BOTTOM_LEFT.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageAlign.BOTTOM_RIGHT = ["BOTTOM_RIGHT",8];
com.isartdigital.utils.game.GameStageAlign.BOTTOM_RIGHT.__enum__ = com.isartdigital.utils.game.GameStageAlign;
com.isartdigital.utils.game.GameStageScale = $hxClasses["com.isartdigital.utils.game.GameStageScale"] = { __ename__ : ["com","isartdigital","utils","game","GameStageScale"], __constructs__ : ["NO_SCALE","SHOW_ALL"] };
com.isartdigital.utils.game.GameStageScale.NO_SCALE = ["NO_SCALE",0];
com.isartdigital.utils.game.GameStageScale.NO_SCALE.__enum__ = com.isartdigital.utils.game.GameStageScale;
com.isartdigital.utils.game.GameStageScale.SHOW_ALL = ["SHOW_ALL",1];
com.isartdigital.utils.game.GameStageScale.SHOW_ALL.__enum__ = com.isartdigital.utils.game.GameStageScale;
com.isartdigital.utils.game.PoolManager = function() {
	this.pools = new haxe.ds.StringMap();
	this.outRegister = new haxe.ds.StringMap();
	this.maxCountOut = new haxe.ds.StringMap();
};
$hxClasses["com.isartdigital.utils.game.PoolManager"] = com.isartdigital.utils.game.PoolManager;
com.isartdigital.utils.game.PoolManager.__name__ = ["com","isartdigital","utils","game","PoolManager"];
com.isartdigital.utils.game.PoolManager.getInstance = function() {
	if(com.isartdigital.utils.game.PoolManager.instance == null) com.isartdigital.utils.game.PoolManager.instance = new com.isartdigital.utils.game.PoolManager();
	return com.isartdigital.utils.game.PoolManager.instance;
};
com.isartdigital.utils.game.PoolManager.prototype = {
	addToPool: function(pType,pInstance) {
		if(!this.pools.exists(pType)) {
			var value = new Array();
			this.pools.set(pType,value);
		}
		this.pools.get(pType).push(pInstance);
	}
	,getFromPool: function(pType) {
		if(!this.pools.exists(pType) || this.pools.get(pType).length == 0) {
			haxe.Log.trace("[PoolManager.getFromPool] " + pType + " Pool Empty ! Creating Instance on the fly",{ fileName : "PoolManager.hx", lineNumber : 126, className : "com.isartdigital.utils.game.PoolManager", methodName : "getFromPool"});
			this.createStateGraphic(pType);
		}
		return this.pools.get(pType).shift();
	}
	,checkMaxCount: function(pType,pFeedback) {
		if(pFeedback == null) pFeedback = true;
		if(this.maxCountOut.get(pType) == null) {
			this.maxCountOut.set(pType,0);
			0;
		}
		if(this.outRegister.get(pType) > this.maxCountOut.get(pType)) {
			var v = this.outRegister.get(pType);
			this.maxCountOut.set(pType,v);
			v;
		}
	}
	,clear: function(pType) {
		if(pType == null) {
			haxe.Log.trace("=====##### POOLS CLEARING ENGAGED #####=====",{ fileName : "PoolManager.hx", lineNumber : 153, className : "com.isartdigital.utils.game.PoolManager", methodName : "clear"});
			var $it0 = this.pools.keys();
			while( $it0.hasNext() ) {
				var lType = $it0.next();
				if(lType != "Player") this.destroyPoolContent(lType);
			}
			var $it1 = this.pools.keys();
			while( $it1.hasNext() ) {
				var key = $it1.next();
				haxe.Log.trace("- " + key + " : " + this.pools.get(key).length,{ fileName : "PoolManager.hx", lineNumber : 160, className : "com.isartdigital.utils.game.PoolManager", methodName : "clear"});
			}
			haxe.Log.trace("### Pools cleared",{ fileName : "PoolManager.hx", lineNumber : 162, className : "com.isartdigital.utils.game.PoolManager", methodName : "clear"});
		} else if(this.pools.exists(pType)) {
			this.destroyPoolContent(pType);
			haxe.Log.trace(pType + " Pool size after emptying : " + this.pools.get(pType).length,{ fileName : "PoolManager.hx", lineNumber : 168, className : "com.isartdigital.utils.game.PoolManager", methodName : "clear"});
		}
	}
	,destroyPoolContent: function(pType) {
		var lLength = this.pools.get(pType).length;
		var _g = 0;
		while(_g < lLength) {
			var i = _g++;
			var j = lLength - 1 - i;
			var lObject = this.pools.get(pType)[j];
			if(lObject == null) com.isartdigital.utils.Debug.warn("pools[" + pType + "][" + j + "] is undefined. Skipping Destroy, next to Splicing"); else {
				lObject.start();
				lObject.setModeVoid();
				lObject.destroy();
			}
			this.pools.get(pType).splice((function($this) {
				var $r;
				var _this = $this.pools.get(pType);
				$r = HxOverrides.indexOf(_this,lObject,0);
				return $r;
			}(this)),1);
		}
	}
	,createStateGraphic: function(pType) {
		if(!this.pools.exists(pType)) {
			var value = new Array();
			this.pools.set(pType,value);
		}
		var expectedPoolLength = this.pools.get(pType).length + 1;
		(com.isartdigital.utils.game.PoolManager.createInstance.get(pType))();
		if(this.pools.get(pType).length != expectedPoolLength) com.isartdigital.utils.Debug.warn("L'objet de type " + pType + " a été créé mais n'a pas été ajouté à la pool.\n" + "Vérifiez que le constructeur de classe appelle bien la fonction PoolManager.getInstance().addToPool() avec les bons paramètres.");
	}
	,destroy: function() {
		com.isartdigital.utils.game.PoolManager.instance = null;
	}
	,__class__: com.isartdigital.utils.game.PoolManager
};
com.isartdigital.utils.loader = {};
com.isartdigital.utils.loader.Loader = function() {
	PIXI.EventTarget.call(this);
	haxe.Log.trace("========== Loader: Initialisation ==========",{ fileName : "Loader.hx", lineNumber : 73, className : "com.isartdigital.utils.loader.Loader", methodName : "new"});
	this.txtFiles = [];
	this.assetsFiles = [];
	this.soundsList = [];
	this.soundsFiles = [];
};
$hxClasses["com.isartdigital.utils.loader.Loader"] = com.isartdigital.utils.loader.Loader;
com.isartdigital.utils.loader.Loader.__name__ = ["com","isartdigital","utils","loader","Loader"];
com.isartdigital.utils.loader.Loader.getContent = function(pFile,pPath) {
	if(pPath == null) pPath = com.isartdigital.utils.Config.get_assetsPath();
	return com.isartdigital.utils.loader.Loader.txtLoaded.get(pPath + pFile);
};
com.isartdigital.utils.loader.Loader.__super__ = PIXI.EventTarget;
com.isartdigital.utils.loader.Loader.prototype = $extend(PIXI.EventTarget.prototype,{
	addTxtFile: function(pUrl,pPath) {
		if(pPath == null) pPath = com.isartdigital.utils.Config.get_jsonPath();
		haxe.Log.trace("Loader: addTxtFile = " + pPath + pUrl,{ fileName : "Loader.hx", lineNumber : 88, className : "com.isartdigital.utils.loader.Loader", methodName : "addTxtFile"});
		this.txtFiles.push(pPath + pUrl);
	}
	,addAssetFile: function(pUrl) {
		haxe.Log.trace("Loader: addAssetFile = " + com.isartdigital.utils.Config.get_assetsPath() + pUrl,{ fileName : "Loader.hx", lineNumber : 99, className : "com.isartdigital.utils.loader.Loader", methodName : "addAssetFile"});
		this.assetsFiles.unshift(com.isartdigital.utils.Config.get_assetsPath() + pUrl);
	}
	,addSoundFile: function(pUrl) {
		haxe.Log.trace("Loader: addSoundFile = " + com.isartdigital.utils.Config.get_soundsPath() + pUrl,{ fileName : "Loader.hx", lineNumber : 110, className : "com.isartdigital.utils.loader.Loader", methodName : "addSoundFile"});
		this.soundsList.push(com.isartdigital.utils.Config.get_soundsPath() + pUrl);
	}
	,load: function() {
		haxe.Log.trace("---------- Loader: Chargement ----------",{ fileName : "Loader.hx", lineNumber : 120, className : "com.isartdigital.utils.loader.Loader", methodName : "load"});
		this.loaded = 0;
		this.loadSoundsLists();
	}
	,loadSoundsLists: function() {
		if(this.soundsList.length > 0) {
			var lLoader = new PIXI.JsonLoader(this.soundsList.shift());
			lLoader.addEventListener("loaded",$bind(this,this.onSoundsListsLoaded));
			lLoader.load();
		} else {
			this.nbFiles = this.txtFiles.length + this.assetsFiles.length + this.soundsFiles.length;
			this.loadNext();
		}
	}
	,onSoundsListsLoaded: function(pEvent) {
		haxe.Log.trace("Loader: " + Std.string(pEvent.target.url) + " chargé",{ fileName : "Loader.hx", lineNumber : 146, className : "com.isartdigital.utils.loader.Loader", methodName : "onSoundsListsLoaded"});
		pEvent.target.removeEventListener("loaded",$bind(this,this.onSoundsListsLoaded));
		var lList = (js.Boot.__cast(pEvent.target , PIXI.JsonLoader)).json;
		this.addSounds(Reflect.field(lList,"fxs"),false,Reflect.field(lList,"extensions"));
		this.addSounds(Reflect.field(lList,"musics"),true,Reflect.field(lList,"extensions"));
		this.loadSoundsLists();
	}
	,addSounds: function(pList,pLoop,pExtensions) {
		var _g = 0;
		var _g1 = Reflect.fields(pList);
		while(_g < _g1.length) {
			var lID = _g1[_g];
			++_g;
			this.soundsFiles.push({ name : lID, options : { urls : (function($this) {
				var $r;
				var _g2 = [];
				{
					var _g4 = 0;
					var _g3 = pExtensions.length;
					while(_g4 < _g3) {
						var i = _g4++;
						_g2.push(com.isartdigital.utils.Config.get_soundsPath() + lID + "." + pExtensions[i]);
					}
				}
				$r = _g2;
				return $r;
			}(this)), volume : Reflect.field(pList,lID) / 100, loop : pLoop, onload : $bind(this,this.onSoundLoaded)}});
		}
	}
	,loadNext: function() {
		if(this.txtFiles.length > 0) {
			var lLoader = new PIXI.JsonLoader(this.txtFiles.shift());
			lLoader.addEventListener("loaded",$bind(this,this.onTxtLoaded));
			lLoader.load();
		} else if(this.assetsFiles != null) {
			var lLoader1 = new PIXI.AssetLoader(this.assetsFiles);
			lLoader1.addEventListener("onProgress",$bind(this,this.onAssetLoaded));
			lLoader1.load();
		} else if(this.soundsFiles.length > 0) com.isartdigital.utils.sounds.SoundManager.addSound(this.soundsFiles[0].name,new window.Howl(this.soundsFiles[0].options)); else this.onComplete();
	}
	,onTxtLoaded: function(pEvent) {
		pEvent.target.removeEventListener("loaded",$bind(this,this.onTxtLoaded));
		var k = pEvent.target.url;
		var v = (js.Boot.__cast(pEvent.target , PIXI.JsonLoader)).json;
		com.isartdigital.utils.loader.Loader.txtLoaded.set(k,v);
		v;
		this.currentLoadComplete();
		haxe.Log.trace("Loader: " + Std.string(pEvent.target.url) + " chargé (" + this.loaded + "/" + this.nbFiles + ")",{ fileName : "Loader.hx", lineNumber : 192, className : "com.isartdigital.utils.loader.Loader", methodName : "onTxtLoaded"});
		this.loadNext();
	}
	,onAssetLoaded: function(pEvent) {
		if(js.Boot.__instanceof(pEvent.content.loader,PIXI.JsonLoader)) {
			var k = pEvent.content.loader.url;
			var v = (js.Boot.__cast(pEvent.content.loader , PIXI.JsonLoader)).json;
			com.isartdigital.utils.loader.Loader.txtLoaded.set(k,v);
			v;
		}
		this.currentLoadComplete();
		haxe.Log.trace("Loader: " + pEvent.target.assetURLs[pEvent.target.loadCount] + " chargé (" + this.loaded + "/" + this.nbFiles + ")",{ fileName : "Loader.hx", lineNumber : 207, className : "com.isartdigital.utils.loader.Loader", methodName : "onAssetLoaded"});
		if(pEvent.target.loadCount == 0) {
			pEvent.target.removeEventListener("onProgress",$bind(this,this.onAssetLoaded));
			this.assetsFiles = null;
			this.loadNext();
		}
	}
	,onSoundLoaded: function() {
		this.currentLoadComplete();
		haxe.Log.trace("Loader: Son " + this.soundsFiles[0].name + " chargé (" + this.loaded + "/" + this.nbFiles + ")",{ fileName : "Loader.hx", lineNumber : 223, className : "com.isartdigital.utils.loader.Loader", methodName : "onSoundLoaded"});
		this.soundsFiles.shift();
		this.loadNext();
	}
	,currentLoadComplete: function() {
		this.loaded++;
		this.dispatchEvent("LoaderEvent.PROGRESS",{ loaded : this.loaded, total : this.nbFiles});
	}
	,onComplete: function() {
		haxe.Log.trace("---------- Loader: Fin ----------",{ fileName : "Loader.hx", lineNumber : 241, className : "com.isartdigital.utils.loader.Loader", methodName : "onComplete"});
		this.dispatchEvent("LoaderEvent.COMPLETE");
	}
	,__class__: com.isartdigital.utils.loader.Loader
});
com.isartdigital.utils.sounds = {};
com.isartdigital.utils.sounds.SoundManager = function() {
};
$hxClasses["com.isartdigital.utils.sounds.SoundManager"] = com.isartdigital.utils.sounds.SoundManager;
com.isartdigital.utils.sounds.SoundManager.__name__ = ["com","isartdigital","utils","sounds","SoundManager"];
com.isartdigital.utils.sounds.SoundManager.addSound = function(pName,pSound) {
	if(com.isartdigital.utils.sounds.SoundManager.list == null) com.isartdigital.utils.sounds.SoundManager.list = new haxe.ds.StringMap();
	com.isartdigital.utils.sounds.SoundManager.list.set(pName,pSound);
	pSound;
};
com.isartdigital.utils.sounds.SoundManager.getSound = function(pName) {
	if(com.isartdigital.utils.sounds.SoundManager.list == null) com.isartdigital.utils.sounds.SoundManager.list = new haxe.ds.StringMap();
	if(!com.isartdigital.utils.sounds.SoundManager.list.exists(pName)) return new window.Howl({ });
	return com.isartdigital.utils.sounds.SoundManager.list.get(pName);
};
com.isartdigital.utils.sounds.SoundManager.prototype = {
	__class__: com.isartdigital.utils.sounds.SoundManager
};
com.isartdigital.utils.system = {};
com.isartdigital.utils.system.DeviceCapabilities = function() { };
$hxClasses["com.isartdigital.utils.system.DeviceCapabilities"] = com.isartdigital.utils.system.DeviceCapabilities;
com.isartdigital.utils.system.DeviceCapabilities.__name__ = ["com","isartdigital","utils","system","DeviceCapabilities"];
com.isartdigital.utils.system.DeviceCapabilities.get_height = function() {
	return window.innerHeight;
};
com.isartdigital.utils.system.DeviceCapabilities.get_width = function() {
	return window.innerWidth;
};
com.isartdigital.utils.system.DeviceCapabilities.get_system = function() {
	if(new EReg("IEMobile","i").match(window.navigator.userAgent)) return "IEMobile"; else if(new EReg("iPhone|iPad|iPod","i").match(window.navigator.userAgent)) return "iOS"; else if(new EReg("BlackBerry","i").match(window.navigator.userAgent)) return "BlackBerry"; else if(new EReg("PlayBook","i").match(window.navigator.userAgent)) return "BlackBerry PlayBook"; else if(new EReg("Android","i").match(window.navigator.userAgent)) return "Android"; else return "Desktop";
};
com.isartdigital.utils.system.DeviceCapabilities.displayFullScreenButton = function() {
	if(!new EReg("(iPad|iPhone|iPod)","g").match(window.navigator.userAgent) && !new EReg("MSIE","i").match(window.navigator.userAgent)) {
		window.document.onfullscreenchange = com.isartdigital.utils.system.DeviceCapabilities.onChangeFullScreen;
		window.document.onwebkitfullscreenchange = com.isartdigital.utils.system.DeviceCapabilities.onChangeFullScreen;
		window.document.onmozfullscreenchange = com.isartdigital.utils.system.DeviceCapabilities.onChangeFullScreen;
		window.document.onmsfullscreenchange = com.isartdigital.utils.system.DeviceCapabilities.onChangeFullScreen;
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton = new Image();
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.style.position = "absolute";
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.style.right = "0px";
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.style.top = "0px";
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.style.cursor = "pointer";
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.width = Std["int"](com.isartdigital.utils.system.DeviceCapabilities.getSizeFactor() * 0.075);
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.height = Std["int"](com.isartdigital.utils.system.DeviceCapabilities.getSizeFactor() * 0.075);
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.onclick = com.isartdigital.utils.system.DeviceCapabilities.enterFullscreen;
		com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.src = com.isartdigital.utils.Config.get_assetsPath() + "fullscreen.png";
		window.document.body.appendChild(com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton);
	}
};
com.isartdigital.utils.system.DeviceCapabilities.enterFullscreen = function(pEvent) {
	var lDocElm = window.document.documentElement;
	if($bind(lDocElm,lDocElm.requestFullscreen) != null) lDocElm.requestFullscreen(); else if(lDocElm.mozRequestFullScreen != null) lDocElm.mozRequestFullScreen(); else if(lDocElm.webkitRequestFullScreen != null) lDocElm.webkitRequestFullScreen(); else if(lDocElm.msRequestFullscreen != null) lDocElm.msRequestFullscreen();
};
com.isartdigital.utils.system.DeviceCapabilities.exitFullscreen = function() {
	if(($_=window.document,$bind($_,$_.exitFullscreen)) != null) window.document.exitFullscreen(); else if(window.document.mozCancelFullScreen != null) window.document.mozCancelFullScreen(); else if(window.document.webkitCancelFullScreen != null) window.document.webkitCancelFullScreen(); else if(window.document.msExitFullscreen) window.document.msExitFullscreen();
};
com.isartdigital.utils.system.DeviceCapabilities.onChangeFullScreen = function(pEvent) {
	if(window.document.fullScreen || (window.document.mozFullScreen || (window.document.webkitIsFullScreen || window.document.msFullscreenElement))) com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.style.display = "none"; else com.isartdigital.utils.system.DeviceCapabilities.fullScreenButton.style.display = "block";
	pEvent.preventDefault();
};
com.isartdigital.utils.system.DeviceCapabilities.getSizeFactor = function() {
	var lSize = Math.floor(Math.min(window.screen.width,window.screen.height));
	if(com.isartdigital.utils.system.DeviceCapabilities.get_system() == "Desktop") lSize /= 3;
	return lSize;
};
com.isartdigital.utils.system.DeviceCapabilities.getScreenRect = function(pTarget) {
	if(pTarget.stage == null) {
		com.isartdigital.utils.Debug.warn("L'élément que vous ciblez n'est pas attaché à la DisplayList, le repositionnement est ignoré.");
		return null;
	}
	var lTopLeft = new PIXI.Point(0,0);
	var lBottomRight = new PIXI.Point((function($this) {
		var $r;
		var this1 = com.isartdigital.utils.system.DeviceCapabilities.get_width();
		var $int = this1;
		$r = $int < 0?4294967296.0 + $int:$int + 0.0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this2 = com.isartdigital.utils.system.DeviceCapabilities.get_height();
		var int1 = this2;
		$r = int1 < 0?4294967296.0 + int1:int1 + 0.0;
		return $r;
	}(this)));
	lTopLeft = pTarget.toLocal(lTopLeft);
	lBottomRight = pTarget.toLocal(lBottomRight);
	return new PIXI.Rectangle(lTopLeft.x,lTopLeft.y,lBottomRight.x - lTopLeft.x,lBottomRight.y - lTopLeft.y);
};
com.isartdigital.utils.system.DeviceCapabilities.scaleViewport = function() {
	if(com.isartdigital.utils.system.DeviceCapabilities.get_system() == "IEMobile") return;
	com.isartdigital.utils.system.DeviceCapabilities.screenRatio = window.devicePixelRatio;
	window.document.write("<meta name=\"viewport\" content=\"initial-scale=" + Math.round(100 / com.isartdigital.utils.system.DeviceCapabilities.screenRatio) / 100 + ", user-scalable=no, minimal-ui\">");
};
com.isartdigital.utils.system.DeviceCapabilities.init = function(pHd,pMd,pLd) {
	if(pLd == null) pLd = 0.25;
	if(pMd == null) pMd = 0.5;
	if(pHd == null) pHd = 1;
	com.isartdigital.utils.system.DeviceCapabilities.texturesRatios.set("hd",pHd);
	pHd;
	com.isartdigital.utils.system.DeviceCapabilities.texturesRatios.set("md",pMd);
	pMd;
	com.isartdigital.utils.system.DeviceCapabilities.texturesRatios.set("ld",pLd);
	pLd;
	if(com.isartdigital.utils.Config.get_data().texture != null && com.isartdigital.utils.Config.get_data().texture != "") com.isartdigital.utils.system.DeviceCapabilities.textureType = com.isartdigital.utils.Config.get_data().texture; else {
		var lRatio = Math.min(window.screen.width * com.isartdigital.utils.system.DeviceCapabilities.screenRatio / com.isartdigital.utils.game.GameStage.getInstance().get_safeZone().width,window.screen.height * com.isartdigital.utils.system.DeviceCapabilities.screenRatio / com.isartdigital.utils.game.GameStage.getInstance().get_safeZone().height);
		if(lRatio <= 0.25) com.isartdigital.utils.system.DeviceCapabilities.textureType = "ld"; else if(lRatio <= 0.5) com.isartdigital.utils.system.DeviceCapabilities.textureType = "md"; else com.isartdigital.utils.system.DeviceCapabilities.textureType = "hd";
	}
	com.isartdigital.utils.system.DeviceCapabilities.textureRatio = com.isartdigital.utils.system.DeviceCapabilities.texturesRatios.get(com.isartdigital.utils.system.DeviceCapabilities.textureType);
};
com.isartdigital.utils.ui.Gauge = function() {
	this.debut = 270;
	this.playerCollectible = Math.floor(Math.random() * 100);
	this.currentLevelCollectible = Math.floor(Math.random() * 50);
	this.DEG2RAD = Math.PI / 180;
	this.currentLevelCollectible += this.playerCollectible;
	this.lTexture = null;
	PIXI.Sprite.call(this,this.lTexture);
	var bkground = new PIXI.Graphics();
	bkground.beginFill(16711680,1);
	bkground.drawCircle(0,0,100);
	bkground.endFill();
	this.addChild(bkground);
	var gauge = new PIXI.Graphics();
	gauge.beginFill(15778560,1);
	gauge.drawCircle(0,0,80);
	gauge.endFill();
	this.addChild(gauge);
	this.tailleArc = 360 / this.currentLevelCollectible * this.playerCollectible;
	var masque = new PIXI.Graphics();
	masque.beginFill(16777215,1);
	masque.moveTo(0,0);
	masque.arc(0,0,80,this.debut * this.DEG2RAD,this.tailleArc * this.DEG2RAD);
	masque.isMask = true;
	masque.endFill();
	this.addChild(masque);
	gauge.mask = masque;
	var foreground = new PIXI.Graphics();
	foreground.beginFill(16711680,1);
	foreground.drawCircle(0,0,50);
	foreground.endFill();
	this.addChild(foreground);
};
$hxClasses["com.isartdigital.utils.ui.Gauge"] = com.isartdigital.utils.ui.Gauge;
com.isartdigital.utils.ui.Gauge.__name__ = ["com","isartdigital","utils","ui","Gauge"];
com.isartdigital.utils.ui.Gauge.__super__ = PIXI.Sprite;
com.isartdigital.utils.ui.Gauge.prototype = $extend(PIXI.Sprite.prototype,{
	__class__: com.isartdigital.utils.ui.Gauge
});
com.isartdigital.utils.ui.Keyboard = function() {
};
$hxClasses["com.isartdigital.utils.ui.Keyboard"] = com.isartdigital.utils.ui.Keyboard;
com.isartdigital.utils.ui.Keyboard.__name__ = ["com","isartdigital","utils","ui","Keyboard"];
com.isartdigital.utils.ui.Keyboard.prototype = {
	__class__: com.isartdigital.utils.ui.Keyboard
};
com.isartdigital.utils.ui.TranslationManager = function() {
};
$hxClasses["com.isartdigital.utils.ui.TranslationManager"] = com.isartdigital.utils.ui.TranslationManager;
com.isartdigital.utils.ui.TranslationManager.__name__ = ["com","isartdigital","utils","ui","TranslationManager"];
com.isartdigital.utils.ui.TranslationManager.getInstance = function() {
	if(com.isartdigital.utils.ui.TranslationManager.instance == null) com.isartdigital.utils.ui.TranslationManager.instance = new com.isartdigital.utils.ui.TranslationManager();
	return com.isartdigital.utils.ui.TranslationManager.instance;
};
com.isartdigital.utils.ui.TranslationManager.addTranslations = function(pLang,pJson) {
	if((function($this) {
		var $r;
		var _this = com.isartdigital.utils.Config.get_languages();
		$r = HxOverrides.indexOf(_this,pLang,0);
		return $r;
	}(this)) == -1) {
		haxe.Log.trace("[Translation Manager] Le language que vous essayez de charger n'est pas disponible, vérifier le fichier de config",{ fileName : "TranslationManager.hx", lineNumber : 47, className : "com.isartdigital.utils.ui.TranslationManager", methodName : "addTranslations"});
		return;
	}
	var v = pJson;
	com.isartdigital.utils.ui.TranslationManager.translationFiles.set(pLang,v);
	v;
	haxe.Log.trace("[Translation Manager] : Fichier pour la langue " + pLang + " chargé dans TranslationManager",{ fileName : "TranslationManager.hx", lineNumber : 51, className : "com.isartdigital.utils.ui.TranslationManager", methodName : "addTranslations"});
};
com.isartdigital.utils.ui.TranslationManager.get = function(pLabel) {
	if(com.isartdigital.utils.ui.TranslationManager.translations.get(pLabel) == null) {
		com.isartdigital.utils.Debug.warn("Le label " + pLabel + " n'est pas disponible dans la langue : " + com.isartdigital.utils.ui.TranslationManager.currentLanguage);
		return "LABEL_ERROR";
	}
	return com.isartdigital.utils.ui.TranslationManager.translations.get(pLabel);
};
com.isartdigital.utils.ui.TranslationManager.prototype = {
	setLanguage: function(pLang) {
		if((function($this) {
			var $r;
			var _this = com.isartdigital.utils.Config.get_languages();
			$r = HxOverrides.indexOf(_this,pLang,0);
			return $r;
		}(this)) == -1) {
			com.isartdigital.utils.Debug.error("[Translation Manager | setLanguage] Le langage demandé n'est pas disponible");
			return;
		} else if(com.isartdigital.utils.ui.TranslationManager.translationFiles.get(pLang) == null) com.isartdigital.utils.Debug.error("[Translation Manager | setLanguage] Les fichiers de traduction pour la langue : " + pLang + " ne sont pas chargés dans le TranslationManager");
		com.isartdigital.utils.ui.TranslationManager.currentLanguage = pLang;
		this.setTranslatedTexts(pLang);
		haxe.Log.trace("Traduction : Passage à la langue " + pLang,{ fileName : "TranslationManager.hx", lineNumber : 67, className : "com.isartdigital.utils.ui.TranslationManager", methodName : "setLanguage"});
	}
	,setTranslatedTexts: function(pLang) {
		var transUnits = Reflect.field(com.isartdigital.utils.ui.TranslationManager.translationFiles.get(pLang),"transUnits");
		var _g = 0;
		while(_g < transUnits.length) {
			var lTransUnit = transUnits[_g];
			++_g;
			var k = lTransUnit.id;
			var v = lTransUnit.target;
			com.isartdigital.utils.ui.TranslationManager.translations.set(k,v);
			v;
		}
	}
	,destroy: function() {
		com.isartdigital.utils.ui.TranslationManager.instance = null;
	}
	,__class__: com.isartdigital.utils.ui.TranslationManager
};
com.isartdigital.utils.ui.UIPosition = function() {
};
$hxClasses["com.isartdigital.utils.ui.UIPosition"] = com.isartdigital.utils.ui.UIPosition;
com.isartdigital.utils.ui.UIPosition.__name__ = ["com","isartdigital","utils","ui","UIPosition"];
com.isartdigital.utils.ui.UIPosition.setPosition = function(pTarget,pPosition,pOffsetX,pOffsetY) {
	if(pOffsetY == null) pOffsetY = 0;
	if(pOffsetX == null) pOffsetX = 0;
	if(pTarget.stage == null) {
		com.isartdigital.utils.Debug.warn("L'élément que vous voulez repositionner n'est pas attaché à la DisplayList, le repositionnement est ignoré.");
		return;
	}
	var lScreen = com.isartdigital.utils.system.DeviceCapabilities.getScreenRect(pTarget.parent);
	var lTopLeft = new PIXI.Point(lScreen.x,lScreen.y);
	var lBottomRight = new PIXI.Point(lScreen.x + lScreen.width,lScreen.y + lScreen.height);
	if(pPosition == "top" || pPosition == "topLeft" || pPosition == "topRight") pTarget.y = lTopLeft.y + pOffsetY;
	if(pPosition == "bottom" || pPosition == "bottomLeft" || pPosition == "bottomRight") pTarget.y = lBottomRight.y - pOffsetY;
	if(pPosition == "left" || pPosition == "topLeft" || pPosition == "bottomLeft") pTarget.x = lTopLeft.x + pOffsetX;
	if(pPosition == "right" || pPosition == "topRight" || pPosition == "bottomRight") pTarget.x = lBottomRight.x - pOffsetX;
	if(pPosition == "fitWidth" || pPosition == "fitScreen") {
		pTarget.x = lTopLeft.x;
		pTarget.width = lBottomRight.x - lTopLeft.x;
	}
	if(pPosition == "fitHeight" || pPosition == "fitScreen") {
		pTarget.y = lTopLeft.y;
		pTarget.height = lBottomRight.y - lTopLeft.y;
	}
};
com.isartdigital.utils.ui.UIPosition.prototype = {
	__class__: com.isartdigital.utils.ui.UIPosition
};
var haxe = {};
haxe.Log = function() { };
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
};
haxe.Serializer.prototype = {
	toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(Math.isNaN(v2)) this.buf.b += "k"; else if(!Math.isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var $it0 = v3.iterator();
					while( $it0.hasNext() ) {
						var i1 = $it0.next();
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(HxOverrides.dateStr(d));
					break;
				case haxe.ds.StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it1 = v4.keys();
					while( $it1.hasNext() ) {
						var k = $it1.next();
						this.serializeString(k);
						this.serialize(v4.get(k));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it2 = v5.keys();
					while( $it2.hasNext() ) {
						var k1 = $it2.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.get(k1));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it3 = v6.keys();
					while( $it3.hasNext() ) {
						var k2 = $it3.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe.io.Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe.Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(this.useCache && this.serializeRef(v)) return;
				this.buf.b += "o";
				this.serializeFields(v);
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw "Cannot serialize function";
				break;
			default:
				throw "Cannot serialize " + Std.string(v);
			}
		}
	}
	,__class__: haxe.Serializer
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c1 = this.buf.charCodeAt(this.pos);
				if(c1 == 104) {
					this.pos++;
					break;
				}
				if(c1 == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw "Invalid reference";
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw "Invalid string reference";
			return this.scache[n2];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw "Enum not found " + name1;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw "Enum not found " + name2;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw "Unknown enum index " + name2 + "@" + index;
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe.ds.IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c2 = this.get(this.pos++);
			while(c2 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c2 = this.get(this.pos++);
			}
			if(c2 != 104) throw "Invalid IntMap format";
			return h1;
		case 77:
			var h2 = new haxe.ds.ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			var s3 = HxOverrides.substr(this.buf,this.pos,19);
			d = HxOverrides.strDate(s3);
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c21 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c21 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c22 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c22 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c22 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw "Class not found " + name3;
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw "Invalid custom data";
			return o2;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,__class__: haxe.Unserializer
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.add(Std.string(i));
			s.b += " => ";
			s.add(Std.string(this.h[i.__id__]));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Cookie = function() { };
$hxClasses["js.Cookie"] = js.Cookie;
js.Cookie.__name__ = ["js","Cookie"];
js.Cookie.set = function(name,value,expireDelay,path,domain) {
	var s = name + "=" + encodeURIComponent(value);
	if(expireDelay != null) {
		var d = DateTools.delta(new Date(),expireDelay * 1000);
		s += ";expires=" + d.toGMTString();
	}
	if(path != null) s += ";path=" + path;
	if(domain != null) s += ";domain=" + domain;
	window.document.cookie = s;
};
js.Cookie.all = function() {
	var h = new haxe.ds.StringMap();
	var a = window.document.cookie.split(";");
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		e = StringTools.ltrim(e);
		var t = e.split("=");
		if(t.length < 2) continue;
		h.set(t[0],decodeURIComponent(t[1].split("+").join(" ")));
	}
	return h;
};
js.Cookie.get = function(name) {
	return js.Cookie.all().get(name);
};
js.Cookie.remove = function(name,path,domain) {
	js.Cookie.set(name,"",-10,path,domain);
};
pixi.DomDefinitions = function() { };
$hxClasses["pixi.DomDefinitions"] = pixi.DomDefinitions;
pixi.DomDefinitions.__name__ = ["pixi","DomDefinitions"];
pixi.renderers = {};
pixi.renderers.IRenderer = function() { };
$hxClasses["pixi.renderers.IRenderer"] = pixi.renderers.IRenderer;
pixi.renderers.IRenderer.__name__ = ["pixi","renderers","IRenderer"];
pixi.renderers.IRenderer.prototype = {
	__class__: pixi.renderers.IRenderer
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
com.isartdigital.operationaaa.Main.FRAMERATE = 16;
com.isartdigital.operationaaa.Main.CONFIG_PATH = "config.json";
com.isartdigital.operationaaa.Main.ENEMIES_PATH = "characters/enemies/";
com.isartdigital.operationaaa.SaveManager.LEVELS_DATA = "levels_data";
com.isartdigital.operationaaa.SaveManager.LEVEL_SORTING = "level_sorting";
com.isartdigital.operationaaa.SaveManager.USER_CONFIG = "user_config";
com.isartdigital.operationaaa.SaveManager.VERSION_LABEL = "dataModelVersion";
com.isartdigital.operationaaa.SaveManager.VERSION_ID = "alpha_1.0";
com.isartdigital.operationaaa.controller.TouchController.INPUT_DETECTION_TRESHOLD = 10;
com.isartdigital.operationaaa.controller.TouchController.LEFT_INPUT_MAX_SPREAD = 100;
com.isartdigital.operationaaa.controller.TouchController.RAD2DEG = 180 / Math.PI;
com.isartdigital.operationaaa.game.GameManager.DEG2RAD = Math.PI / 180;
com.isartdigital.operationaaa.game.GameManager.WINLOOP_FRAMES_COUNT = 60;
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.LEVELPATH = "levels/";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.PATH_TO_SPRITE_CLASSES = "com.isartdigital.operationaaa.game.sprites.";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.PLATFORMS_PATH = "platforms.";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.ENEMIES_PATH = "enemies.";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.WALLS_PATH = "walls.";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.COLLECTABLES_PATH = "collectables.";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.BRIDGE_LEFT = "BridgeLeft";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.BRIDGE_RIGHT = "BridgeRight";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.PLATFORM_0 = "Platform0";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.PLATFORM_1 = "Platform1";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.LIMIT_LEFT = "LimitLeft";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.LIMIT_RIGHT = "LimitRight";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.WALL_0 = "Wall0";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.WALL_1 = "Wall1";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.WALL_2 = "Wall2";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.WALL_3 = "Wall3";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.GROUND = "Ground";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.DESTRUCTIBLE = "Destructible";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.COLLECTABLE = "Collectable";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.UPGRADE_FIRE = "UpgradeFire";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.UPGRADE_JUMP = "UpgradeJump";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.UPGRADE_SHIELD = "UpgradeShield";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.UPGRADE_MAGNET = "UpgradeMagnet";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.ENEMY_FIRE = "EnemyFire";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.ENEMY_SPEED = "EnemySpeed";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.ENEMY_ENEMY_BOMB = "EnemyBomb";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.ENEMY_TURRET = "EnemyTurret";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.KILLZONE_STATIC = "KillZoneStatic";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.KILLZONE_DYNAMIC = "KillZoneDynamic";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.CHECKPOINT = "Checkpoint";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.ENDCHECKPOINT = "EndLevelCheckpoint";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.PLAYER = "Player";
com.isartdigital.operationaaa.game.leveldesign.LevelLoader.setters = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("BridgeLeft",com.isartdigital.operationaaa.game.leveldesign.PlatformSetter);
	_g.set("BridgeRight",com.isartdigital.operationaaa.game.leveldesign.PlatformSetter);
	_g.set("Platform0",com.isartdigital.operationaaa.game.leveldesign.PlatformSetter);
	_g.set("Platform1",com.isartdigital.operationaaa.game.leveldesign.PlatformSetter);
	_g.set("LimitLeft",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("LimitRight",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("Wall0",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("Wall1",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("Wall2",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("Wall3",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("Ground",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("Destructible",com.isartdigital.operationaaa.game.leveldesign.WallSetter);
	_g.set("Collectable",com.isartdigital.operationaaa.game.leveldesign.CollectableSetter);
	_g.set("UpgradeFire",com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter);
	_g.set("UpgradeJump",com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter);
	_g.set("UpgradeShield",com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter);
	_g.set("UpgradeMagnet",com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter);
	_g.set("EnemyFire",com.isartdigital.operationaaa.game.leveldesign.EnemySetter);
	_g.set("EnemySpeed",com.isartdigital.operationaaa.game.leveldesign.EnemySetter);
	_g.set("EnemyBomb",com.isartdigital.operationaaa.game.leveldesign.EnemySetter);
	_g.set("EnemyTurret",com.isartdigital.operationaaa.game.leveldesign.EnemySetter);
	_g.set("KillZoneStatic",com.isartdigital.operationaaa.game.leveldesign.KillZoneStaticSetter);
	_g.set("KillZoneDynamic",com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter);
	_g.set("Checkpoint",com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter);
	_g.set("EndLevelCheckpoint",com.isartdigital.operationaaa.game.leveldesign.CheckpointSetter);
	_g.set("Player",com.isartdigital.operationaaa.game.leveldesign.PlayerSetter);
	$r = _g;
	return $r;
}(this));
com.isartdigital.operationaaa.game.planes.GamePlane.DEG2RAD = Math.PI / 180;
com.isartdigital.operationaaa.game.planes.ScrollingPlane.PART_WIDTH = 1239;
com.isartdigital.utils.game.StateGraphic.ANIM_SUFFIX = "";
com.isartdigital.utils.game.StateGraphic.BOX_SUFFIX = "box";
com.isartdigital.utils.game.StateGraphic.textureDigits = 4;
com.isartdigital.utils.game.StateGraphic.animAlpha = 1;
com.isartdigital.utils.game.StateGraphic.boxAlpha = 0;
com.isartdigital.operationaaa.game.sprites.Checkpoint.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.Checkpoint.inactiveList = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.Checkpoint.ACTIVE_STATE = "active";
com.isartdigital.operationaaa.game.sprites.Player.DEATH_DURATION = 120;
com.isartdigital.operationaaa.game.sprites.collectables.Collectable.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.collectables.Collectable.dyingList = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.collectables.Collectable.COLLECTED = "pickup";
com.isartdigital.operationaaa.game.sprites.collectables.Collectable.GHOST = "ghost";
com.isartdigital.operationaaa.game.sprites.collectables.Upgrade.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.enemies.Enemy.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.enemies.Enemy.WAIT = "wait";
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.platforms.Platform.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.game.sprites.shoot.Shoot.list = [[],[]];
com.isartdigital.operationaaa.game.sprites.walls.Wall.list = new haxe.ds.StringMap();
com.isartdigital.operationaaa.ui.TranslationLabels.LABEL_LEVEL1 = "LABEL_LEVEL1";
com.isartdigital.operationaaa.ui.TranslationLabels.LABEL_LEVEL2 = "LABEL_LEVEL2";
com.isartdigital.operationaaa.ui.TranslationLabels.LABEL_LEVEL3 = "LABEL_LEVEL3";
com.isartdigital.operationaaa.ui.TranslationLabels.LABEL_LEVEL4 = "LABEL_LEVEL4";
com.isartdigital.operationaaa.ui.TranslationLabels.LABEL_PLAY = "LABEL_PLAY";
com.isartdigital.operationaaa.ui.TranslationLabels.INGAME_ADVICE_TEXT = "INGAME_ADVICE_TEXT";
com.isartdigital.operationaaa.ui.TranslationLabels.OPTIONS_TITLE = "OPTIONS_TITLE";
com.isartdigital.operationaaa.ui.TranslationLabels.OPTIONS_LANGUAGES = "OPTIONS_LANGUAGES";
com.isartdigital.operationaaa.ui.TranslationLabels.OPTIONS_SOUND = "OPTIONS_SOUND";
com.isartdigital.operationaaa.ui.TranslationLabels.PAUSE_TITLE = "PAUSE_TITLE";
com.isartdigital.operationaaa.ui.TranslationLabels.PAUSE_TEXT = "PAUSE_TEXT";
com.isartdigital.operationaaa.ui.TranslationLabels.DELETE_SAVE_TEXT = "DELETE_SAVE_TEXT";
com.isartdigital.utils.ui.Button.UP = 0;
com.isartdigital.utils.ui.Button.OVER = 1;
com.isartdigital.utils.ui.Button.DOWN = 2;
com.isartdigital.operationaaa.ui.hud.CollectibleJuicyIcon.list = new Array();
com.isartdigital.operationaaa.ui.hud.Hud.OFFSET_HUD_TOP_CENTER = -150;
com.isartdigital.operationaaa.ui.hud.Hud.FADE_TOTAL_DURATION = 300;
com.isartdigital.operationaaa.ui.hud.Hud.FADE_IN_OUT_DURATION = 60;
com.isartdigital.operationaaa.ui.hud.Hud.FADE_IN_START_TXT_ZONE = 240;
com.isartdigital.operationaaa.ui.hud.Hud.FADE_IN_START_TXT_ADVICE = 180;
com.isartdigital.operationaaa.ui.popin.Confirmation.MARGIN_LEFT = -300;
com.isartdigital.operationaaa.ui.popin.Confirmation.MARGIN_RIGHT = 300;
com.isartdigital.operationaaa.ui.popin.Confirmation.MARGIN_BOTTOM = 150;
com.isartdigital.operationaaa.ui.screens.Options.OFFSET_BOTTOM = 550;
com.isartdigital.operationaaa.ui.screens.Options.OFFSET_LEFT = -900;
com.isartdigital.operationaaa.ui.screens.Options.OFFSET_RIGHT = 900;
com.isartdigital.operationaaa.ui.screens.Options.OFFSET_FLAG_UP = -200;
com.isartdigital.operationaaa.ui.screens.Options.OFFSET_FLAG_LEFT = -400;
com.isartdigital.operationaaa.ui.screens.Options.OFFSET_FLAG_RIGHT = 400;
com.isartdigital.operationaaa.ui.screens.SelectScreen.minLevelWidth = 300;
com.isartdigital.utils.Config._data = { };
com.isartdigital.utils.Debug.QR_SIZE = 0.35;
com.isartdigital.utils.events.GameEvent.GAME_LOOP = "GameEvent.GAME_LOOP";
com.isartdigital.utils.events.GameStageEvent.RESIZE = "GameStageEvent.RESIZE";
com.isartdigital.utils.events.LoaderEvent.PROGRESS = "LoaderEvent.PROGRESS";
com.isartdigital.utils.events.LoaderEvent.COMPLETE = "LoaderEvent.COMPLETE";
com.isartdigital.utils.game.GameStage.SAFE_ZONE_WIDTH = 2048;
com.isartdigital.utils.game.GameStage.SAFE_ZONE_HEIGHT = 1366;
com.isartdigital.utils.game.PoolManager.createInstance = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("BridgeLeft",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.platforms.Platform,["BridgeLeft"]);
	});
	_g.set("BridgeRight",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.platforms.Platform,["BridgeRight"]);
	});
	_g.set("Platform0",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.platforms.Platform,["Platform0"]);
	});
	_g.set("Platform1",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.platforms.Platform,["Platform1"]);
	});
	_g.set("LimitLeft",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Wall,["LimitLeft"]);
	});
	_g.set("LimitRight",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Wall,["LimitRight"]);
	});
	_g.set("Wall0",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Wall,["Wall0"]);
	});
	_g.set("Wall1",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Wall,["Wall1"]);
	});
	_g.set("Wall2",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Wall,["Wall2"]);
	});
	_g.set("Wall3",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Wall,["Wall3"]);
	});
	_g.set("Ground",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Wall,["Ground"]);
	});
	_g.set("Destructible",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.walls.Destructible,[]);
	});
	_g.set("Collectable",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.collectables.Collectable,[]);
	});
	_g.set("UpgradeFire",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire,[]);
	});
	_g.set("UpgradeJump",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump,[]);
	});
	_g.set("UpgradeShield",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield,[]);
	});
	_g.set("UpgradeMagnet",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet,[]);
	});
	_g.set("EnemyFire",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire,[]);
	});
	_g.set("EnemySpeed",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed,[]);
	});
	_g.set("EnemyBomb",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb,[]);
	});
	_g.set("EnemyTurret",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret,[]);
	});
	_g.set("KillZoneStatic",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic,[]);
	});
	_g.set("KillZoneDynamic",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic,[]);
	});
	_g.set("Checkpoint",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.Checkpoint,[]);
	});
	_g.set("ShootPlayer_Blue",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootPlayer_Blue"]);
	});
	_g.set("ShootPlayer_DarkBlue",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootPlayer_DarkBlue"]);
	});
	_g.set("ShootPlayer_Green",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootPlayer_Green"]);
	});
	_g.set("ShootPlayer_Orange",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootPlayer_Orange"]);
	});
	_g.set("ShootPlayer_RoseViolet",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootPlayer_RoseViolet"]);
	});
	_g.set("ShootPlayerPower_Yellow",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootPlayerPower_Yellow"]);
	});
	_g.set("ShootEnemyFire",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootEnemyFire"]);
	});
	_g.set("ShootEnemyTurret",function() {
		return Type.createInstance(com.isartdigital.operationaaa.game.sprites.shoot.Shoot,["ShootEnemyTurret"]);
	});
	$r = _g;
	return $r;
}(this));
com.isartdigital.utils.loader.Loader.txtLoaded = new haxe.ds.StringMap();
com.isartdigital.utils.sounds.SoundManager.FX = "fxs";
com.isartdigital.utils.sounds.SoundManager.MUSIC = "musics";
com.isartdigital.utils.system.DeviceCapabilities.SYSTEM_ANDROID = "Android";
com.isartdigital.utils.system.DeviceCapabilities.SYSTEM_IOS = "iOS";
com.isartdigital.utils.system.DeviceCapabilities.SYSTEM_BLACKBERRY = "BlackBerry";
com.isartdigital.utils.system.DeviceCapabilities.SYSTEM_BB_PLAYBOOK = "BlackBerry PlayBook";
com.isartdigital.utils.system.DeviceCapabilities.SYSTEM_WINDOWS_MOBILE = "IEMobile";
com.isartdigital.utils.system.DeviceCapabilities.SYSTEM_DESKTOP = "Desktop";
com.isartdigital.utils.system.DeviceCapabilities.ICON_SIZE = 0.075;
com.isartdigital.utils.system.DeviceCapabilities.TEXTURE_NO_SCALE = "";
com.isartdigital.utils.system.DeviceCapabilities.TEXTURE_HD = "hd";
com.isartdigital.utils.system.DeviceCapabilities.TEXTURE_MD = "md";
com.isartdigital.utils.system.DeviceCapabilities.TEXTURE_LD = "ld";
com.isartdigital.utils.system.DeviceCapabilities.texturesRatios = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("hd",1);
	_g.set("md",0.5);
	_g.set("ld",0.25);
	$r = _g;
	return $r;
}(this));
com.isartdigital.utils.system.DeviceCapabilities.textureRatio = 1;
com.isartdigital.utils.system.DeviceCapabilities.textureType = "";
com.isartdigital.utils.system.DeviceCapabilities.screenRatio = 1;
com.isartdigital.utils.ui.Keyboard.A = 65;
com.isartdigital.utils.ui.Keyboard.B = 66;
com.isartdigital.utils.ui.Keyboard.C = 67;
com.isartdigital.utils.ui.Keyboard.D = 68;
com.isartdigital.utils.ui.Keyboard.E = 69;
com.isartdigital.utils.ui.Keyboard.F = 70;
com.isartdigital.utils.ui.Keyboard.G = 71;
com.isartdigital.utils.ui.Keyboard.H = 72;
com.isartdigital.utils.ui.Keyboard.I = 73;
com.isartdigital.utils.ui.Keyboard.J = 74;
com.isartdigital.utils.ui.Keyboard.K = 75;
com.isartdigital.utils.ui.Keyboard.L = 76;
com.isartdigital.utils.ui.Keyboard.M = 77;
com.isartdigital.utils.ui.Keyboard.N = 78;
com.isartdigital.utils.ui.Keyboard.O = 79;
com.isartdigital.utils.ui.Keyboard.P = 80;
com.isartdigital.utils.ui.Keyboard.Q = 81;
com.isartdigital.utils.ui.Keyboard.R = 82;
com.isartdigital.utils.ui.Keyboard.S = 83;
com.isartdigital.utils.ui.Keyboard.T = 84;
com.isartdigital.utils.ui.Keyboard.U = 85;
com.isartdigital.utils.ui.Keyboard.V = 86;
com.isartdigital.utils.ui.Keyboard.W = 87;
com.isartdigital.utils.ui.Keyboard.X = 88;
com.isartdigital.utils.ui.Keyboard.Y = 89;
com.isartdigital.utils.ui.Keyboard.Z = 90;
com.isartdigital.utils.ui.Keyboard.NUMBER_0 = 48;
com.isartdigital.utils.ui.Keyboard.NUMBER_1 = 49;
com.isartdigital.utils.ui.Keyboard.NUMBER_2 = 50;
com.isartdigital.utils.ui.Keyboard.NUMBER_3 = 51;
com.isartdigital.utils.ui.Keyboard.NUMBER_4 = 52;
com.isartdigital.utils.ui.Keyboard.NUMBER_5 = 53;
com.isartdigital.utils.ui.Keyboard.NUMBER_6 = 54;
com.isartdigital.utils.ui.Keyboard.NUMBER_7 = 55;
com.isartdigital.utils.ui.Keyboard.NUMBER_8 = 56;
com.isartdigital.utils.ui.Keyboard.NUMBER_9 = 57;
com.isartdigital.utils.ui.Keyboard.NUMPAD_0 = 96;
com.isartdigital.utils.ui.Keyboard.NUMPAD_1 = 97;
com.isartdigital.utils.ui.Keyboard.NUMPAD_2 = 98;
com.isartdigital.utils.ui.Keyboard.NUMPAD_3 = 99;
com.isartdigital.utils.ui.Keyboard.NUMPAD_4 = 100;
com.isartdigital.utils.ui.Keyboard.NUMPAD_5 = 101;
com.isartdigital.utils.ui.Keyboard.NUMPAD_6 = 102;
com.isartdigital.utils.ui.Keyboard.NUMPAD_7 = 103;
com.isartdigital.utils.ui.Keyboard.NUMPAD_8 = 104;
com.isartdigital.utils.ui.Keyboard.NUMPAD_9 = 105;
com.isartdigital.utils.ui.Keyboard.NUMPAD_ADD = 107;
com.isartdigital.utils.ui.Keyboard.NUMPAD_DECIMAL = 110;
com.isartdigital.utils.ui.Keyboard.NUMPAD_DIVIDE = 111;
com.isartdigital.utils.ui.Keyboard.NUMPAD_ENTER = 108;
com.isartdigital.utils.ui.Keyboard.NUMPAD_MULTIPLY = 106;
com.isartdigital.utils.ui.Keyboard.NUMPAD_SUBTRACT = 109;
com.isartdigital.utils.ui.Keyboard.F1 = 112;
com.isartdigital.utils.ui.Keyboard.F2 = 113;
com.isartdigital.utils.ui.Keyboard.F3 = 114;
com.isartdigital.utils.ui.Keyboard.F4 = 115;
com.isartdigital.utils.ui.Keyboard.F5 = 116;
com.isartdigital.utils.ui.Keyboard.F6 = 117;
com.isartdigital.utils.ui.Keyboard.F7 = 118;
com.isartdigital.utils.ui.Keyboard.F8 = 119;
com.isartdigital.utils.ui.Keyboard.F9 = 120;
com.isartdigital.utils.ui.Keyboard.F10 = 121;
com.isartdigital.utils.ui.Keyboard.F11 = 122;
com.isartdigital.utils.ui.Keyboard.F12 = 123;
com.isartdigital.utils.ui.Keyboard.F13 = 124;
com.isartdigital.utils.ui.Keyboard.F14 = 125;
com.isartdigital.utils.ui.Keyboard.F15 = 126;
com.isartdigital.utils.ui.Keyboard.LEFT = 37;
com.isartdigital.utils.ui.Keyboard.UP = 38;
com.isartdigital.utils.ui.Keyboard.RIGHT = 39;
com.isartdigital.utils.ui.Keyboard.DOWN = 40;
com.isartdigital.utils.ui.Keyboard.BACKSLASH = 220;
com.isartdigital.utils.ui.Keyboard.BACKSPACE = 8;
com.isartdigital.utils.ui.Keyboard.CAPS_LOCK = 20;
com.isartdigital.utils.ui.Keyboard.COMMA = 188;
com.isartdigital.utils.ui.Keyboard.COMMAND = 15;
com.isartdigital.utils.ui.Keyboard.CONTROL = 17;
com.isartdigital.utils.ui.Keyboard.DELETE = 46;
com.isartdigital.utils.ui.Keyboard.END = 35;
com.isartdigital.utils.ui.Keyboard.ENTER = 13;
com.isartdigital.utils.ui.Keyboard.EQUAL = 187;
com.isartdigital.utils.ui.Keyboard.ESCAPE = 27;
com.isartdigital.utils.ui.Keyboard.HOME = 36;
com.isartdigital.utils.ui.Keyboard.INSERT = 45;
com.isartdigital.utils.ui.Keyboard.LEFTBRACKET = 219;
com.isartdigital.utils.ui.Keyboard.MINUS = 189;
com.isartdigital.utils.ui.Keyboard.PAGE_DOWN = 34;
com.isartdigital.utils.ui.Keyboard.PAGE_UP = 33;
com.isartdigital.utils.ui.Keyboard.PERIOD = 190;
com.isartdigital.utils.ui.Keyboard.QUOTE = 222;
com.isartdigital.utils.ui.Keyboard.RIGHTBRACKET = 221;
com.isartdigital.utils.ui.Keyboard.SEMICOLON = 186;
com.isartdigital.utils.ui.Keyboard.SHIFT = 16;
com.isartdigital.utils.ui.Keyboard.SLASH = 191;
com.isartdigital.utils.ui.Keyboard.SPACE = 32;
com.isartdigital.utils.ui.Keyboard.TAB = 9;
com.isartdigital.utils.ui.Keyboard.MENU = 16777234;
com.isartdigital.utils.ui.Keyboard.SEARCH = 16777247;
com.isartdigital.utils.ui.Keyboard.KEY_DOWN = "keydown";
com.isartdigital.utils.ui.Keyboard.KEY_UP = "keyup";
com.isartdigital.utils.ui.TranslationManager.translationFiles = new haxe.ds.StringMap();
com.isartdigital.utils.ui.TranslationManager.translations = new haxe.ds.StringMap();
com.isartdigital.utils.ui.UIPosition.LEFT = "left";
com.isartdigital.utils.ui.UIPosition.RIGHT = "right";
com.isartdigital.utils.ui.UIPosition.TOP = "top";
com.isartdigital.utils.ui.UIPosition.BOTTOM = "bottom";
com.isartdigital.utils.ui.UIPosition.TOP_LEFT = "topLeft";
com.isartdigital.utils.ui.UIPosition.TOP_RIGHT = "topRight";
com.isartdigital.utils.ui.UIPosition.BOTTOM_LEFT = "bottomLeft";
com.isartdigital.utils.ui.UIPosition.BOTTOM_RIGHT = "bottomRight";
com.isartdigital.utils.ui.UIPosition.FIT_WIDTH = "fitWidth";
com.isartdigital.utils.ui.UIPosition.FIT_HEIGHT = "fitHeight";
com.isartdigital.utils.ui.UIPosition.FIT_SCREEN = "fitScreen";
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
com.isartdigital.operationaaa.Main.main();
})();
