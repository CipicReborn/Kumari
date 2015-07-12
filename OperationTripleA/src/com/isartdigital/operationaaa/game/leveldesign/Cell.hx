package com.isartdigital.operationaaa.game.leveldesign;

/**
 * ...
 * @author Cyprien LARROUY
 */
class Cell{
	
	
	public var content: Array<String>;
	
	
	public function new() {
		
		content = new Array<String>();
	}
	
	public function add (pInstance: String) {
		
		content.push(pInstance);
	}
	
	public function objectsCount (): Int {
		return content.length;
	}
	
	public function getElement(pId: Int) {
		if (content[pId] == null) {
			
		}
		
		
	}
}