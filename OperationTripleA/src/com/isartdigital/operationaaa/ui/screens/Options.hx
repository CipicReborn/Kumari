package com.isartdigital.operationaaa.ui.screens;
import com.isartdigital.operationaaa.ui.buttons.ButtonBack;
import com.isartdigital.operationaaa.ui.buttons.ButtonDeleteSave;
import com.isartdigital.operationaaa.ui.buttons.ButtonSave;
import com.isartdigital.operationaaa.ui.buttons.ButtonSoundOff;
import com.isartdigital.operationaaa.ui.buttons.ButtonSoundOn;
import com.isartdigital.operationaaa.ui.elements.Background;
import com.isartdigital.operationaaa.ui.popin.DeleteSave;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.events.GameStageEvent;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.loader.Loader;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.Button;
import com.isartdigital.utils.ui.Screen;
import com.isartdigital.utils.ui.TranslationManager;
import com.isartdigital.utils.ui.UIPosition;
import howler.Howler;
import js.Browser;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.text.Text;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Benjamin
 */
class Options extends Screen {
	
	/**
	 * Marges
	 */
	private static inline var OFFSET_BOTTOM:Int =  550;
	private static inline var OFFSET_LEFT:Int   = -900;
	private static inline var OFFSET_RIGHT:Int  = -OFFSET_LEFT;
	
	private static inline var OFFSET_FLAG_UP:Int     =  -200;
	private static inline var OFFSET_FLAG_LEFT:Int   =  -400;
	private static inline var OFFSET_FLAG_RIGHT:Int  =  -OFFSET_FLAG_LEFT;
	/**
	 * instance unique de la classe Options
	 */
	private static var instance: Options;
	
	/**
	 * Fond de l'écran
	 */
	private var background:Background;
	
	private var backBtn:ButtonBack;
	private var deleteSaveBtn:ButtonDeleteSave;
	private var soundBtnOn :ButtonSoundOn;
	private var soundBtnOff:ButtonSoundOff;
	
	private var flagsMap:Map<String, Sprite>;
	private var enFlag:Sprite;
	private var frFlag:Sprite;
	private var flagMarker:Sprite;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Options {
		if (instance == null) instance = new Options();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		super();
		
		background = new Background('Options_bg');
		addChild(background);
		
		backBtn = new ButtonBack();
		backBtn.position.set(OFFSET_LEFT, OFFSET_BOTTOM);
		backBtn.onClick = onClickBackBtn;
		addChild(backBtn);
		
		deleteSaveBtn = new ButtonDeleteSave();
		deleteSaveBtn.position.set(OFFSET_RIGHT, OFFSET_BOTTOM);
		deleteSaveBtn.onClick = onClickDeleteSaveBtn;
		addChild(deleteSaveBtn);
		
		soundBtnOn = new ButtonSoundOn();
		soundBtnOn.position.y = 200;
		soundBtnOn.onClick = onClickSoundOnBtn;
		addChild(soundBtnOn);
		
		var titleTxt = new Text(TranslationManager.get(TranslationLabels.OPTIONS_TITLE));
		titleTxt.setStyle( { fill:'white', stroke: 'black', strokeThickness: 5, font : "124px GothicStyle" } );
		titleTxt.anchor.set(0.5, 0.5);
		titleTxt.y = -550;
		
		addChild(titleTxt);
		
		flagsMap = new Map<String, Sprite>();
		
		//On ajoute les drapeaux
		addFlagToScreen("fr", OFFSET_FLAG_LEFT, OFFSET_FLAG_UP);
		addFlagToScreen("en", OFFSET_FLAG_RIGHT, OFFSET_FLAG_UP);
		
		//On marque le drapeau du langage courant
		markFlag(SaveManager.getInstance().userConfig["language"]);
	}
	
	/**
	 * Fonction permettant d'ajouter un drapeau de sélection de langue à l'écran (en supposant que ce drapeau existe dans le cache)
	 * @param	pLanguage
	 */
	private function addFlagToScreen(pLanguage:String, ?pHorizontalOffset:Int = 0, ?pVerticalOffset:Int = 0):Void {
		flagsMap[pLanguage] = new Sprite(Texture.fromFrame("flag_" + pLanguage + ".png"));
		
		var lFlag:Sprite = flagsMap[pLanguage];
		lFlag.anchor.set(0.5, 0.5);
		lFlag.scale.set(0.75, 0.75);
		lFlag.position.set(pHorizontalOffset, pVerticalOffset);
		lFlag.interactive = true;
		lFlag.name = pLanguage;
		lFlag.click = lFlag.tap = onClickFlag;
		
		addChild(lFlag);
	}
	
	/**
	 * Marque le drapeau en fonction de la langue passée en paramètre
	 * @param	pLanguageToMark La langue (en, fr ..) du drapeau à marquer
	 */
	private function markFlag(pLanguageToMark:String):Void {
		//Si le marqueur n'existe pas, on le crée
		if (flagMarker == null) {
			flagMarker = new Sprite(Texture.fromFrame("ButtonValidate0001.png"));
			flagMarker.scale.x = flagMarker.scale.y *= 0.5;
			flagMarker.tint = 0x00CC00;
		}
		
		//Si il est attaché à la displaylist, on le retire
		if (flagMarker.parent != null) {
			flagMarker.parent.removeChild(flagMarker);
		}
		
		flagMarker.anchor.set(0.5, 0.5);
		
		flagMarker.position.set(flagsMap[pLanguageToMark].x - 10, flagsMap[pLanguageToMark].y + 50);
		addChild(flagMarker);
		
	}
	
	/**
	 * Callback pour les flags
	 * @param	pEvent
	 */
	private function onClickFlag(pEvent:InteractionData):Void {
		var lLang:String = pEvent.target.name;
		markFlag(lLang);
		SoundManager.getSound("click").play();
		
		//On change la langue du jeu et on l'indique dans le cookie des paramètres utilisateur
		TranslationManager.getInstance().setLanguage(lLang);
		SaveManager.getInstance().userConfig["language"] = lLang;
		SaveManager.getInstance().save();
		
		trace("Langue après changement : " + SaveManager.getInstance().userConfig["language"]);
	}
	/**
	 * Callback pour le bouton Back
	 * @param	pEvent
	 */
	private function onClickBackBtn(pEvent:InteractionData):Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().openScreen(TitleCard.getInstance());
	}
	
	/**
	 * Callback pour le bouton Save
	 * @param	pEvent
	 */
	private function onClickSaveBtn(pEvent:InteractionData):Void {
		SoundManager.getSound("click").play();
	}
	
	/**
	 * Callback pour le bouton DeleteSave
	 * @param	pEvent
	 */
	private function onClickDeleteSaveBtn(pEvent:InteractionData):Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().openPopin(DeleteSave.getInstance());
	}
	
	/**
	 * Callback pour le bouton SoundOn
	 * @param	pEvent
	 */
	private function onClickSoundOnBtn(pEvent:InteractionData):Void {
		SoundManager.getSound("click").play();
		Howler.mute();
		
		soundBtnOff = new ButtonSoundOff();
		soundBtnOff.position.set(soundBtnOn.x, soundBtnOn.y);
		removeChild(soundBtnOn);
		
		soundBtnOff.onClick = onClickSoundOffBtn;
		addChild(soundBtnOff);
	}
	
	/**
	 * Callback pour le bouton SoundOff
	 * @param	pEvent
	 */
	private function onClickSoundOffBtn(pEvent:InteractionData):Void {
		Howler.unmute();
		soundBtnOn = new ButtonSoundOn();
		soundBtnOn.position.set(soundBtnOff.x, soundBtnOff.y);
		removeChild(soundBtnOff);
		
		soundBtnOn.onClick = onClickSoundOnBtn;
		addChild(soundBtnOn);
	}
	
	override public function open():Void 
	{
		super.open();
		SoundManager.getSound("main_music").play();
	}
	
	override public function close():Void 
	{
		super.close();
		SoundManager.getSound("main_music").pause();
	}
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
	}

}