package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.BoxType;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import pixi.geom.Point;

/**
 * ...
 * @author Cedric RECOL
 */
class KillZoneDynamic extends Hostile {
	
	public static var list: Map<String, StateGraphic> = new Map<String, StateGraphic>();
	
	private var pathAngle:  Float;
	
	public function new() {
		//• Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs à des propriétés si elles 
		//  diffèrent entre chaque instance. 
		//• Faites un PoolManager.addToPool(assetName,this)
		//• Ne faites pas de list.push(this)
		
		super();
		assetName = 'KillZoneDynamic';
		PoolManager.getInstance().addToPool(assetName, this);
		
		frictionGround = 1;
		frictionAir = 1;
		friction.set(frictionGround, frictionAir);
		accelerationGround = 1;
		accelerationAir = 1;
		maxHSpeed = 15;
		maxVSpeed = 15;
		maxSteps = 70;
		
	}

	
	/**
	 * Paramètre l'objet avant de l'ajouter à la DisplayList (après sortie du Pool)
	 * @param	pId la référence LD de l'objet
	 * @param	pPathAngle l'angle de patrouille de la KillZone, en radians
	 * @author Cyprien
	 */
	public function set (pId: String, pX: Int, pY: Int, pPathAngle: Float): Void {
		//• Toute valeur spécifique à une instance doit être passée à cette méthode.
		//• Activer les écouteurs ici
		//• list.push(this)
		//• lancer éventuellement le start ici
		
		id = pId;
		list.set(pId , this);
		
		// Position
		x = pX;
		y = pY;
		rotation = 0;
		
		// Angle du path de patrouille
		pathAngle = pPathAngle;
		acceleration.x = Math.round(Math.cos(-pathAngle) * accelerationGround);
		acceleration.y = Math.round(Math.sin( -pathAngle) * accelerationGround);
		
		stepsCount = 0;
		
		// Vitesse initiale (on met la vitesse initiale comme s'il arrivait de retour de son path)
		speed.x = Math.round(Math.cos(pathAngle) * maxHSpeed);
		speed.y = Math.round(Math.sin(pathAngle) * maxVSpeed);
		
		setModeNormal();
	}
	
	/**
	 * Déparamètre l'objet avant de le remettre dans le Pool (après retrait de la DisplayList)
	 * @author Cyprien
	 */
	public function unset (): Void {
		//• Désactivez les écouteurs et tout ce qui poursuivrait son exécution
		//• Passez en setModeVoid
		//• Retirez de list
		setModeVoid();
		if (id == null) Debug.warn('[KillZoneDynamic.unset] You are trying to remove an KillZoneDynamic with no Id');
		if (list.exists(id) && !list.remove(id)) Debug.error('[KillZoneDynamic.unset] Removal from list has failed for KillZoneDynamic ' + id);
		id = null;
	}
	
	/**
	 * 
	 * @author Cyprien
	 */
	private function flip (): Void {
		stepsCount = 0;
		acceleration.x *= -1;
		acceleration.y *= -1;
	}
	
	override private function setModeNormal (): Void {
		super.setModeNormal();
		setState(DEFAULT_STATE, true);
		//anim.loop = true;  // probleme du setState forçant le animloop
	}
	
	override private function doActionNormal (): Void {
		
		if (stepsCount >= maxSteps) flip();
		move();
		stepsCount ++;
	}
	
	override function move () {
		
		// Vitesse
		speed.x += acceleration.x;
		speed.y += acceleration.y;
		
		speed.x *= friction.x;
		speed.y *= friction.y;
		
		speed.x = (speed.x < 0 ? -1 : 1) * Math.min(Math.abs(speed.x), maxHSpeed);
		speed.y = (speed.y < 0 ? -1 : 1) * Math.min(Math.abs(speed.y), maxVSpeed);
		
		// Position
		x += speed.x;
		y += speed.y;
	}

	/**
	 * - unset
	 * - appelle super.destroy()
	 */
	override public function destroy (): Void {
		//• quand vous avez besoin de définitivement détruire une instance
		//• appeler la méthode désactivation dans le destroy en plus du code spécifique au 
		//destroy
		unset();
		super.destroy();
	}
	
}