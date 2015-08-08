package com.isartdigital.operationaaa.ui.popin;
import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.operationaaa.game.leveldesign.LevelLoader;
import com.isartdigital.operationaaa.ui.buttons.ButtonRefuse;
import com.isartdigital.operationaaa.ui.buttons.ButtonValidate;
import com.isartdigital.operationaaa.ui.screens.SelectScreen;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.Popin;
import com.isartdigital.utils.ui.TranslationManager;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Benjamin PAGEAUD
 */
class Pause extends Confirmation
{

	/**
	 * instance unique de la classe Pause
	 */
	private static var instance: Pause;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Pause {
		if (instance == null) instance = new Pause();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		super("Pause_bg");
		popInTitle.setText(TranslationManager.get(TranslationLabels.PAUSE_TEXT));
		SoundManager.getSound(LevelLoader.getInstance().soundLevel).pause();
	}
	
	override private function onClickValidateBtn(pEvent:InteractionData = null):Void {
		SoundManager.getSound("click").play();
		SoundManager.getSound(LevelLoader.getInstance().soundLevel).stop();
		UIManager.getInstance().closeCurrentPopin();
		UIManager.getInstance().closeHud();
		
		GameManager.getInstance().stopGameAndBackToSelection();
	}
	
	override private function onClickRefuseBtn(pEvent:InteractionData = null):Void {
		SoundManager.getSound("click").play();
		SoundManager.getSound(LevelLoader.getInstance().soundLevel).play();
		UIManager.getInstance().closeCurrentPopin();
	}
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
	}

}