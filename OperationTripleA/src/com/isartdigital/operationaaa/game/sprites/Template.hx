package com.isartdigital.operationaaa.game.sprites;

import com.isartdigital.utils.game.BoxType;
import com.isartdigital.utils.game.StateGraphic;
import pixi.geom.Point;
import pixi.InteractionData;

	
/**
 * Exemple de classe héritant de StateGraphic
 * @author Mathieu ANTHOINE
 */
class Template extends StateGraphic 
{
	
	/**
	 * instance unique de la classe Template
	 */
	private static var instance: Template;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Template {
		if (instance == null) instance = new Template();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		// ATTENTION: assetName et boxType se définissent après le super
		boxType = BoxType.SIMPLE;
		Main.getInstance().stage.click = Main.getInstance().stage.tap = onClick;
	}
	
	override private function setModeNormal():Void {
		setState(DEFAULT_STATE, true);
		anim.anchor.set(0.5, 0.5);
		super.setModeNormal();
	}
	
	private function onClick (pEvent:InteractionData):Void {
		trace("Qui a fait ça ?");
		var lLocal:Point = pEvent.getLocalPosition(parent);
		position.set(lLocal.x, lLocal.y);
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}
	
	private function testFunction (): Void {
		trace("testFunction Called");
	}

}