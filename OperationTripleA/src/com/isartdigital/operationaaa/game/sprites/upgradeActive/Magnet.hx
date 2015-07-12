package com.isartdigital.operationaaa.game.sprites.upgradeActive;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.ui.hud.Hud;

import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.Collisionnable;
import com.isartdigital.utils.game.CollisionManager;
import pixi.geom.Point;

	
/**
 * ...
 * @author Cindy Asselin de Beauville 
 */
class Magnet extends Collisionnable 
{
	
	/**
	 * instance unique de la classe Magnet
	 */
	private static var instance: Magnet;

	private var deltaT:Float = Main.getInstance().frames / 2;
	private var currentCollectible:Map < String, Collectable>;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Magnet {
		if (instance == null) instance = new Magnet();
		return instance;
	}
	
	private function convergeCollectible():Point {
		return box.toGlobal(box.getChildByName("mcGetCollectible").position);
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		speed.x = 25;
		speed.y = 25;
		
	}
	
	//______________________________________________________________________________________________________________________________//
	//____________________________________________________SET MODE ET DO ACTION____________________________________________________//
	//____________________________________________________________________________________________________________________________//
	override function setModeNormal():Void 
	{
		super.setModeNormal();
		GamePlane.getInstance().addChild(this);
		currentCollectible = new Map<String, Collectable>();
	}
	
	override function doActionNormal():Void {
		x = Player.getInstance().x - (Player.getInstance().width * Player.getInstance().scale.x);
		y = Player.getInstance().y - Player.getInstance().height;
		
		for (lStateGraphic in Collectable.list) {
			var lcurrentCollectible = cast(lStateGraphic, Collectable);
			if (CollisionManager.hitTestObject(this.hitBox, lcurrentCollectible.hitBox)) {
				currentCollectible.set(lcurrentCollectible.id, lcurrentCollectible);
			}
		}
		
		collectCoins();
	}
	
	/**
	 * Attire les collectible à soi
	 */
	private function collectCoins():Void {
		for (lCollectable in currentCollectible) {
			var lPoint = GamePlane.getInstance().toLocal(convergeCollectible());
			var angle = Math.atan2(lPoint.y - lCollectable.y, lPoint.x - lCollectable.x);
			lCollectable.height -= 15;
			lCollectable.width -= 20;
			lCollectable.x += Math.cos(angle) * (((-2 * deltaT * deltaT * deltaT) + (3 * deltaT * deltaT)) * speed.x);
			lCollectable.y += Math.sin(angle) * ((( -2 * deltaT * deltaT * deltaT) + (3 * deltaT * deltaT)) * speed.y);
			if (lCollectable.width <= 100 || lCollectable.height <= 100) {
				lCollectable.onPickup();
				currentCollectible.remove(lCollectable.id);
			}
		}
	}

	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
	}

}