package com.isartdigital.operationaaa.ui.popin;
import com.isartdigital.operationaaa.ui.buttons.ButtonRefuse;
import com.isartdigital.operationaaa.ui.buttons.ButtonValidate;
import com.isartdigital.operationaaa.ui.screens.TitleCard;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.Popin;
import com.isartdigital.utils.ui.TranslationManager;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.text.Text;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Benjamin PAGEAUD
 */
class DeleteSave extends Confirmation
{
	
	/**
	 * instance unique de la classe DeleteSavePopIn
	 */
	private static var instance: DeleteSave;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): DeleteSave {
		if (instance == null) instance = new DeleteSave();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		setBackgroundTexture("DeleteSave_bg");
		popInTitle.setText(TranslationManager.get(TranslationLabels.DELETE_SAVE_TEXT));
	}
	
	override private function onClickValidateBtn(pEvent:InteractionData = null):Void {
		SoundManager.getSound("click").play();
		SaveManager.getInstance().deleteSave();
		UIManager.getInstance().closeCurrentPopin();
		UIManager.getInstance().openScreen(TitleCard.getInstance());
	}
	
	override private function onClickRefuseBtn(pEvent:InteractionData = null):Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().closeCurrentPopin();
	}
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
	}

}