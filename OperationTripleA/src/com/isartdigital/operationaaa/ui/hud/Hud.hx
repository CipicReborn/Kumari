package com.isartdigital.operationaaa.ui.hud;

import com.isartdigital.operationaaa.controller.TouchDetectionZone;
import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.operationaaa.ui.buttons.ButtonPause;
import com.isartdigital.operationaaa.ui.elements.GraphicElement;
import com.isartdigital.operationaaa.ui.popin.Pause;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.events.GameStageEvent;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.system.DeviceCapabilities;
import com.isartdigital.utils.ui.Button;
import com.isartdigital.utils.ui.Screen;
import com.isartdigital.utils.ui.TranslationManager;
import com.isartdigital.utils.ui.UIPosition;
import js.html.svg.Number;
import pixi.display.DisplayObject;
import pixi.display.DisplayObjectContainer;
import pixi.display.Sprite;
import pixi.filters.BlurFilter;
import pixi.geom.Point;
import pixi.geom.Rectangle;
import pixi.text.Text;
import pixi.textures.Texture;

/**
 * Classe en charge de gérer les informations du Hud
 * @author Benjamin, Cyprien
 */
class Hud extends Screen 
{
	//Position en Y à partir du centre
	private static inline var OFFSET_HUD_TOP_CENTER:Int = -150;
	
	
	/**
	 * instance unique de la classe Hud
	 */
	private static var instance: Hud;
	
	// On créé des Sprites et non des DisplayObjectContainers pour pouvoir bénéficier de l'anchor 
	private var hudTopLeft:Sprite;
	private var hudTopRight:Sprite;
	private var hudTopCenter:Sprite;
	public var leftTouchZone (get, null): TouchDetectionZone;
	public var rightTouchZone (get, null): TouchDetectionZone;
	
	//Bouton Pause 
	private var pauseBtn:ButtonPause;
	
	//Text affichant le nombre de collectibles
	private var collectibleTxt:Text;
	public var collectibleCount (get, set):Int;
	private var _collectibleCount:Int = 0;
	private var collectibleIcon:GraphicElement;
	
	//Texte affichant le niveau en cours
	private var levelTxt:Text;
	private var adviceTxt:Text;
	
	//Compteur servant au fadein/fadeOut
	private var counter:Int;
	private var alphaPerFrame:Float;
	
	//Constantes fadeIn/FadeOut
	private static inline var FADE_TOTAL_DURATION:Int = 300;
	private static inline var FADE_IN_OUT_DURATION:Int = 60;
	private static inline var FADE_IN_START_TXT_ZONE:Int   = FADE_TOTAL_DURATION - (1 * 60);
	private static inline var FADE_IN_START_TXT_ADVICE:Int = FADE_TOTAL_DURATION - (2 * 60);
	
	private var isTouchDetectionEnabled = false;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Hud {
		if (instance == null) instance = new Hud();
		return instance;
	}	
	
	public function new() {
		
		super();
		_modal = false;
		
		//Hud top Left
		hudTopLeft = new Sprite(null);
		addChild(hudTopLeft);
		
		collectibleIcon = new GraphicElement("collectible_icon", 0, 0.5);
		hudTopLeft.addChild(collectibleIcon);
		collectibleIcon.position.set(0, collectibleIcon.height/2);
		
		collectibleTxt = new Text("", {fill:"white", stroke:"black", strokeThickness: 3, font : "bold 86px GothicStyle" } );
		updateCollectibleTxt();
		collectibleTxt.anchor.set(0, 0.5);
		collectibleTxt.position.set(collectibleIcon.width + collectibleIcon.x + 30, collectibleIcon.y);
		hudTopLeft.addChild(collectibleTxt);
		
		//Hud Top Right
		//hudTopRight = new Sprite(Texture.fromImage(Config.assetsPath + "HudRight.png"));
		hudTopRight = new Sprite(null);
		hudTopRight.anchor.set(1, 0);
		addChild(hudTopRight);
		
		pauseBtn = new ButtonPause();
		pauseBtn.onClick = onClickPause;
		pauseBtn.x = -pauseBtn.width / 2;
		pauseBtn.y = pauseBtn.y + pauseBtn.height / 2;
		hudTopRight.addChild(pauseBtn);
		
		//Hud Top Center
		hudTopCenter = new Sprite(null);
		hudTopCenter.anchor.set(0.5, 0.5);
		//hudTopCenter.position.y = OFFSET_HUD_TOP_CENTER;
		addChild(hudTopCenter);
		
		trace("LevelID: " + GameManager.getInstance().currentLevelId);
		levelTxt = new Text(TranslationManager.get("LABEL_LEVEL" + GameManager.getInstance().currentLevelId));
		levelTxt.setStyle({fill:'white', stroke: 'black', strokeThickness: 5, font : "128px GothicStyle" });
		levelTxt.anchor.set(0.5, 0.5);
		levelTxt.alpha = 0;
		levelTxt.position.set(0, -300);
		hudTopCenter.addChild(levelTxt);
		
		adviceTxt = new Text(TranslationManager.get(TranslationLabels.INGAME_ADVICE_TEXT));
		adviceTxt.setStyle({fill:'white', stroke: 'black', strokeThickness: 5, font : "64px GothicStyle" });
		adviceTxt.anchor.set(0.5, 0.5);
		adviceTxt.alpha = 0;
		adviceTxt.position.set(0, levelTxt.y + 200);
		hudTopCenter.addChild(adviceTxt);
		
		counter = FADE_TOTAL_DURATION;
		alphaPerFrame = 1 / 60;
		
		//Ajout d'un écouteur sur la Gameloop
		Main.getInstance().addEventListener(GameEvent.GAME_LOOP, hudLoop);
	}
	
	public function initTouchZones (): Void {
		
		FeedbackManager.getInstance();
		
		var lScreen: Rectangle = DeviceCapabilities.getScreenRect(GameStage.getInstance().getHudContainer());
		
		//Hud BottomLeft
		leftTouchZone = new TouchDetectionZone();
		leftTouchZone.tint = 0x0000FF;
		//hudBottomLeft.anchor.set(1, 0.5);
		leftTouchZone.anchor.set(0, 1);
		leftTouchZone.width = lScreen.width / 2;
		leftTouchZone.height = lScreen.height;
		leftTouchZone.alpha = 0;
		addChild(leftTouchZone);
		
		//Hud BottomRight
		rightTouchZone = new TouchDetectionZone();
		//hudBottomRight.anchor.set(0, 0.5);
		rightTouchZone.anchor.set(1, 1);
		rightTouchZone.width = lScreen.width / 2;
		rightTouchZone.height = lScreen.height;
		rightTouchZone.alpha = 0;
		addChild(rightTouchZone);
		
		//var lText1 = new Text("hudBottomRight", { font : "64px Arial" } );
		//lText1.anchor.set(1, 1);
		//hudBottomRight.addChild(lText1);
		
		rightTouchZone.interactive = true;
		leftTouchZone.interactive = true;
		
		isTouchDetectionEnabled = true;
		
		trace("[Hud.initTouchZones] Done");
		//trace(leftTouchZone);
		//trace(rightTouchZone);
	}
	
	/**
	 * repositionne les éléments du Hud
	 * @param	pEvent
	 */
	override private function onResize (pEvent:GameStageEvent=null): Void {
		//repositionne l'élement de Hud concerné en haut à gauche
		UIPosition.setPosition(hudTopLeft, UIPosition.TOP_LEFT, 100, 50);
		
		//Reposition l'élement du hud en haut à droite
		UIPosition.setPosition(hudTopRight, UIPosition.TOP_RIGHT, 100, 50);
		
		if (isTouchDetectionEnabled) {
			
			trace("[Hud.onResize] Touch Detection enabled, TouchZones repositionning");
			//Reposition l'élement du hud en bas à gauche
			UIPosition.setPosition(leftTouchZone, UIPosition.BOTTOM_LEFT, 0, 0);
			
			//Reposition l'élement du hud en bas à droite
			UIPosition.setPosition(rightTouchZone, UIPosition.BOTTOM_RIGHT, 0, 0);
		}
		
	}
	
	/**
	 * Callback du bouton pause
	 */
	private function onClickPause():Void {
		UIManager.getInstance().openPopin(Pause.getInstance());
	}
	 
	//GameLoop propre au Hud, sert notamment pour le fadeIn/Out
	private function hudLoop():Void {
		counter--;
		
		
		if (counter > FADE_TOTAL_DURATION - FADE_IN_OUT_DURATION) {
			levelTxt.alpha  += alphaPerFrame;
			
		} else if(counter < (60*2)) {
			levelTxt.alpha  -= alphaPerFrame;
		}
		
		if (counter < FADE_TOTAL_DURATION - FADE_IN_OUT_DURATION && counter > FADE_TOTAL_DURATION - (60 * 2)) {
			adviceTxt.alpha += alphaPerFrame;
		} else if (counter < 60) {
			adviceTxt.alpha -= alphaPerFrame;
		}
		
		if (counter == 0) {
			removeChild(levelTxt);
			removeChild(adviceTxt);
			Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, hudLoop);
		}
	}
	
	public function doAction():Void {
		for (lIcon in CollectibleJuicyIcon.list) {
			lIcon.doAction();
		}
	}
	/**
	 * Met à jour le nombre de collectibles
	 * @param Nombre de collectibles
	 */
	public function updateCollectibleTxt(pCollectibleNumber:Int = 0):Void {
		var lCollectibleText:String = ("00" + pCollectibleNumber).substr( -2);
		collectibleTxt.setText(lCollectibleText);
	}
	
	//---- GETTER SETTERS
	private function get_rightTouchZone (): TouchDetectionZone {
		return rightTouchZone;
	}
	
	private function get_leftTouchZone (): TouchDetectionZone {
		return leftTouchZone;
	}	
	
	private function get_collectibleCount (): Int {
		return _collectibleCount;
	}
	
	private function set_collectibleCount (pCollectibleCount:Int): Int {
		_collectibleCount = pCollectibleCount;
		updateCollectibleTxt(_collectibleCount);
		
		//Nombre de petites icones juicys qui apparaissent à chaque pickup de collectible
		//On fait l'effet uniquement quand on passe le compteur à plus que 0
		if(_collectibleCount > 0) {
			for (i in 0...5) {
				collectibleIcon.addChild(new CollectibleJuicyIcon());
			}
		}
		return _collectibleCount;
	}
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}