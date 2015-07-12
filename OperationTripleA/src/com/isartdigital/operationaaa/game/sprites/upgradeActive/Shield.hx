package com.isartdigital.operationaaa.game.sprites.upgradeActive;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.utils.game.CollisionManager;
import com.isartdigital.utils.game.StateGraphic;

	
/**
 * ...
 * @author Cindy Asselin de Beauville 
 */
class Shield extends Collisionnable 
{
	
	/**
	 * instance unique de la classe Shield
	 */
	private static var instance: Shield;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Shield {
		if (instance == null) instance = new Shield();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
	}
	
	
	//______________________________________________________________________________________________________________________________//
	//____________________________________________________SET MODE ET DO ACTION____________________________________________________//
	//____________________________________________________________________________________________________________________________//
	
	override function setModeNormal():Void 
	{
		super.setModeNormal();
		anim.visible = false;
		visible = false;

	}
	
	public function setModeActif():Void {
		GamePlane.getInstance().addChild(this);
		setState(DEFAULT_STATE, true);
		anim.anchor.set(0, 0);
		anim.animationSpeed = 0.5;
		anim.visible = true;
		visible = true;
		doAction = doActionActif;
	}
	
	private function doActionActif():Void {
		x = Player.getInstance().x - (Player.getInstance().width * Player.getInstance().scale.x);
		y = Player.getInstance().y - Player.getInstance().height;
		for (lShoot in Shoot.list[1]) {
			if (CollisionManager.hitTestObject(hitBox, lShoot.hitBox)) {
				lShoot.setModeEnd();
				setModeNormal();
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