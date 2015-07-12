package com.isartdigital.operationaaa.game.sprites;
import com.isartdigital.operationaaa.ui.popin.WinInterlevel;
import com.isartdigital.operationaaa.ui.UIManager;
import com.isartdigital.utils.sounds.SoundManager;

	
/**
 * ...
 * @author Recol Cedric
 */
class EndLevelCheckpoint extends Checkpoint 
{
	
	//private var END:String = GameManager.getInstance().currentLevelId;
	/**
	 * instance unique de la classe endLevelCheckpoint
	 */
	private static var instance: EndLevelCheckpoint;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): EndLevelCheckpoint {
		if (instance == null) instance = new EndLevelCheckpoint();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		assetName = "Checkpoint";
	}
	
	override public function setModeActive():Void 
	{
		//setState(END);
		SoundManager.getSound("activate_checkpoint").play();
		UIManager.getInstance().openPopin(WinInterlevel.getInstance());
		
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
		override public function destroy (): Void {
		instance = null;
	}

}