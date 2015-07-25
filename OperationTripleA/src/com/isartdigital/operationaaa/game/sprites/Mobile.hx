package com.isartdigital.operationaaa.game.sprites;

import com.isartdigital.utils.game.StateGraphic;

import pixi.geom.Point;

/**
 * ...
 * @author Cyprien LARROUY
 */

class Mobile extends StateGraphic {
	
	private var acceleration: Point = new Point(0, 0);
	private var friction: Point = new Point(0, 0);
	public var speed: Point = new Point(0, 0);   //public pour le cliping a voir le setter
	private var maxHSpeed: Float = 0;
	private var maxVSpeed: Float = 0;
	
	public function new () {
		super();
	}
	
	/**
	 * applique l'accélération et la friction pour calculer la nouvelle vitesse, dans la limite de maxHSpeed et maxVSpeed,
	 * puis modifie la position de l'objet en fonction, avant de remettre l'accélération à zéro pour le tour suivant.
	 */
	private function move (): Void {
		
		speed.x += acceleration.x;
		speed.y += acceleration.y;
		
		speed.x *= friction.x;
		speed.y *= friction.y;
		
		//on limite la vitesse à maxSpeed;
		speed.x = (speed.x < 0 ? -1 : 1) * Math.min(Math.abs(speed.x), maxHSpeed);
		speed.y = (speed.y < 0 ? -1 : 1) * Math.min(Math.abs(speed.y), maxVSpeed);
		
		y += speed.y;
		x += speed.x;
		
		acceleration.set(0, 0);
	}
}