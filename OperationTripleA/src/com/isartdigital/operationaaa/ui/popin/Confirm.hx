package com.isartdigital.operationaaa.ui.popin;

import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.Popin;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.textures.Texture;

	
/**
 * Exemple de classe héritant de Popin
 * @author Mathieu ANTHOINE
 */
class Confirm extends Popin 
{
	
	private var background:Sprite;
	
	/**
	 * instance unique de la classe Confirm
	 */
	private static var instance: Confirm;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Confirm {
		if (instance == null) instance = new Confirm();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		background = new Sprite(Texture.fromImage(Config.assetsPath+"Confirm.png"));
		background.anchor.set(0.5, 0.5);
		addChild(background);
		interactive = true;
		buttonMode = true;
		click = tap = onClick;
	}
	
	private function onClick (pData:InteractionData): Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().closeCurrentPopin();
		GameManager.getInstance().start(1);
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}