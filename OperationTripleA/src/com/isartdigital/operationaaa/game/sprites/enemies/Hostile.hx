package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.operationaaa.game.sprites.Collisionnable;
import pixi.display.DisplayObjectContainer;
import pixi.geom.Point;

/**
 * ...
 * @author Cedric RECOL
 */
class Hostile extends Collisionnable {
	
	private var frictionGround:Float = 0;
	private var frictionAir:Float = 0;
	
	private var accelerationGround:Float = 0;
	private var accelerationAir:Float = 0;
	
	public var stepsCount:Int = 0;
	private var maxSteps:Int = 200;
	
	public function new () {
		super();
		stepsCount = maxSteps;
	}
	
	override function get_hitBox (): DisplayObjectContainer {
		return cast box.getChildByName("mcGlobalBox");
	}
}