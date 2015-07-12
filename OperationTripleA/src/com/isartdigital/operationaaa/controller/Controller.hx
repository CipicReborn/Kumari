package com.isartdigital.operationaaa.controller;

	
/**
 * ...
 * @author Cyprien LARROUY
 */
class Controller {
	
	/**
	 * instance unique de la classe Controller
	 */
	private static var instance: Controller;
	
	
	//public var up (default, null): Bool;
	
	public var up (get, null): Bool;
	public var down (get, null): Bool;
	public var left (get, null): Bool;
	public var right (get, null): Bool;
	public var jump (get, null): Bool;
	public var fire (get, null): Bool;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Controller {
		if (instance == null) instance = new Controller();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		
	}
	
	public function init (): Void {};
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}
	
	private function get_up():Bool {
		return false;
	}
	
	private function get_down():Bool {
		return false;
	}
	
	private function get_left():Bool {
		return false;
	}
	
	private function get_right():Bool {
		return false;
	}
	
	private function get_jump():Bool {
		return false;
	}
	
	private function get_fire():Bool {
		return false;
	}
	

}