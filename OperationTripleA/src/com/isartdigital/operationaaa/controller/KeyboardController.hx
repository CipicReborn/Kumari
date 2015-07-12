package com.isartdigital.operationaaa.controller;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.utils.ui.Keyboard;
import js.html.KeyboardEvent;

import js.Browser;

	
/**
 * ...
 * @author Cyprien LARROUY
 */
class KeyboardController extends Controller {
	
	/**
	 * instance unique de la classe KeyboardController
	 */
	private static var instance: KeyboardController;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): KeyboardController {
		if (instance == null) instance = new KeyboardController();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		super();
		
		Browser.window.addEventListener("keydown", registerKeyDown);
		Browser.window.addEventListener("keyup", registerKeyUp);
		
	}
	
	override public function destroy():Void {
		
		Browser.window.removeEventListener("keydown", registerKeyDown);
		Browser.window.removeEventListener("keyup", registerKeyUp);
		super.destroy();
	}
	
	
	private function registerKeyDown(pEvent:KeyboardEvent):Void {
		
		//pEvent.preventDefault();
		if (pEvent.keyCode == Keyboard.SPACE) { jump = true; }
		if (pEvent.keyCode == Keyboard.LEFT) { left = true; }
		else if (pEvent.keyCode == Keyboard.RIGHT) { right = true; }
		else if (pEvent.keyCode == Keyboard.UP) { up = true; }
		else if (pEvent.keyCode == Keyboard.DOWN) { down = true; }
		
		if (pEvent.keyCode == Keyboard.C) { fire = true; };
	}
	
	private function registerKeyUp(pEvent:KeyboardEvent):Void {
		
		pEvent.preventDefault();
		if (pEvent.keyCode == Keyboard.SPACE) { jump = false; }
		if (pEvent.keyCode == Keyboard.LEFT) { left = false; }
		else if (pEvent.keyCode == Keyboard.RIGHT) { right = false; }
		else if (pEvent.keyCode == Keyboard.UP) { up = false; }
		else if (pEvent.keyCode == Keyboard.DOWN) { down = false; }
		
		if (pEvent.keyCode == Keyboard.C) { fire = false; };
	}
	
	override function get_up():Bool {
		return up;
	}
	override function get_down():Bool {
		return down;
	}
	override function get_left():Bool {
		return left;
	}
	override function get_right():Bool {
		return right;
	}
	
	override function get_jump():Bool {
		return jump;
	}
	
	override function get_fire():Bool {
		return fire;
	}
	

}