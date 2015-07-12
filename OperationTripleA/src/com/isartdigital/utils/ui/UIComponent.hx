package com.isartdigital.utils.ui;

import com.isartdigital.utils.events.GameStageEvent;
import com.isartdigital.utils.game.GameStage;
import pixi.display.DisplayObjectContainer;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.textures.Texture;

/**
 * Base de tous les conteneurs d'interface
 * @author Mathieu ANTHOINE
 */
class UIComponent extends DisplayObjectContainer
{

	private var isOpened:Bool;
	
	private var modalZone:Sprite;
	
	private var _modal:Bool=true;
	
	// TODO: pouvoir le varier dynamiquement
	public var modalImage:String="assets/alpha_bg.png";
	
	public function new() 
	{
		super();
	}
	
	public function open (): Void {
		if (isOpened) return;
		isOpened = true;
		modal = _modal;
		GameStage.getInstance().addEventListener(GameStageEvent.RESIZE, onResize);
		onResize();
	}
	
	//TODO: verifier si y a besoin d'une variable privée ou si on peut utiliser modal direct
	
	public var modal (get, set):Bool;
	
	private function get_modal ():Bool {
		return _modal;
	}
	
	private function set_modal (pModal:Bool):Bool {
		_modal = pModal;
		
		if (_modal) {
			if (modalZone == null) {
				modalZone = new Sprite(Texture.fromImage(modalImage));
				modalZone.interactive = true;
				modalZone.click = modalZone.tap = stopPropagation;
			}
			if (parent != null) parent.addChildAt(modalZone, parent.getChildIndex(this));
		} else {	
			if (modalZone != null) {
				if (modalZone.parent != null) modalZone.parent.removeChild(modalZone);
				modalZone=null;
			}
		}
		
		return _modal;
	}
	
	private function stopPropagation (pEvent:InteractionData): Void {}
	
	public function close ():Void {
		if (!isOpened) return;
		isOpened = false;
		modal = false;
		destroy();
	}
	
	/**
	 * repositionne les éléments de l'écran
	 * @param pEvent
	 */
	private function onResize (pEvent:GameStageEvent = null): Void {
		if (modal) UIPosition.setPosition(modalZone, UIPosition.FIT_SCREEN);
	}
	
	/**
	 * nettoie l'instance
	 */
	public function destroy (): Void {
		close();
	}
	
}