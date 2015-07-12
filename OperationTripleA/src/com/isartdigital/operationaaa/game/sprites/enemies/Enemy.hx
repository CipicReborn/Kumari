package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.CollisionManager;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.sounds.SoundManager;
import pixi.display.DisplayObject;
import pixi.display.DisplayObjectContainer;
import pixi.geom.Point;


/**
 * ...
 * @author Cedric RECOL
 */
class Enemy extends Hostile {
	
	public static var list:Map<String, StateGraphic> = new Map<String, StateGraphic>();
	
	private static inline var WAIT:String = "wait";
	private var PATROL:String = "walk";
	private var countShoot:Int = 0;
	public var initialLifePoints:Int = 1;
	public var lifePoints:Int = 1;
	
	
	public function new () {
		super();	
	}
	
	/**
	 * Paramètre l'objet avant de l'ajouter à la DisplayList (après sortie du Pool)
	 * @param	pId la référence LD de l'objet
	 * @author	Cyprien
	 */
	 public function set (pId: String, pLifePoints: Int): Void {
		//• Toute valeur spécifique à une instance doit être passée à cette méthode.
		//• Activer les écouteurs ici
		//• list.push(this)
		//• lancer éventuellement le start ici
		id = pId;
		list.set(id , this);
		lifePoints = pLifePoints;
	}
	
	/**
	 * Déparamètre l'objet avant de le remettre dans le Pool (après retrait de la DisplayList)
	 * @param	pIdla référence LD de l'objet
	 * @author	Cyprien
	 */
	public function unset (): Void {
		//• Désactivez les écouteurs et tout ce qui poursuivrait son exécution
		//• Passez en setModeVoid
		//• Retirez de list
		setModeVoid();
		
		if (id == null) Debug.warn('[Enemy.unset] You are trying to remove an Enemy with no Id');
		if (list.exists(id)) list.remove(id);
		if (list.exists(id)) Debug.warn('[Enemy.unset] Removal from list has failed for Enemy ' + id);
		id = null;
	}
	
	public function init (): Void {
		//a ne pas supprimer, override dans classe fille
	}
	

	override public function destroy (): Void {
		//• quand vous avez besoin de définitivement détruire une instance
		//• appeler la méthode désactivation dans le destroy en plus du code spécifique au 
		//destroy
		unset();
		super.destroy();
	}
	
	//---------------------------------------------------------------------------------------------
	
	private function testPoint (pList:Map<String, StateGraphic>, pPoint:Point): StateGraphic {
		for (lObject in pList) {
			if (CollisionManager.hitTestPoint(lObject.hitBox, box.toGlobal(pPoint))) {
				return lObject;
			}
		}	
		return null;
	}
	
	private function playerDetector (): Bool {
		return CollisionManager.hitTestObject(Player.getInstance().hitBox,checkDetector());
	}
	
	private function checkDetector (): DisplayObject{
		return box.getChildByName("mcDetector");
	}
	
	private function onCrosshair  (): Point {
		return box.getChildByName("mcFirePoint").position;
	}
	
	private function getFrontCaneTop (): Point {
		return box.getChildByName("mcCaneFrontTop").position;
	}
	
	private function getFrontCaneMid (): Point {
		return box.getChildByName("mcCaneFrontMid").position;
	}
	
	private function getFrontCaneBottom (): Point {
		return box.getChildByName("mcCaneFrontBottom").position;
	}
	
	override function get_hitBox (): DisplayObjectContainer {
		if (state!="death") return cast box.getChildByName("mcGlobalBox");
		return null;
	}
	
	private function canContinue (): Bool {
		//test collision wall in front top false
		var lCaneTop = testPoint(Wall.list, getFrontCaneTop());
		//test collision wall in front mid false
		var lCaneMid = testPoint(Wall.list, getFrontCaneMid());
		//test collision wall under true
		var lCaneBottom1 = testPoint(Wall.list, getFrontCaneBottom());
		var lCaneBottom2 = testPoint(Platform.list, getFrontCaneBottom());
		
		
		if (lCaneTop == null && lCaneMid == null && lCaneBottom1 != null|| lCaneBottom2 != null) return true;
		
		return false;
		
	}
	
	private function resetPath (): Void {
		//pour pas flip des qu'il y a vide mais attendre un peu pour s'approcher un peu du bord 
		stepsCount = 0;
		accelerationGround *= -1;
	}
	
	public function hurt (pDamage, ?shootScaleX:Float = 0): Void {
		
		lifePoints -= pDamage;
		
		if (lifePoints <= 0) {
			setModeDeath();
		}
		
	}
	
	//------------------------------------------------------------------------------
	//--------------------------DO ACTION-------------------------------------------
	
	override private function setModeNormal (): Void {
		setState(WAIT);
		doAction = doActionNormal;
	}
	
	
	override private function doActionNormal (): Void {
		//test de la detection du player pour 3/4 enemis (fire deja en mouvement)
		//si detecté setModePatrol(enemi speed/Bomb) setModeShoot(turret)
		if (playerDetector()) { //override pour le setModeShoot car plus d'enemy patrouille
			setModePatrol();
			SoundManager.getSound("click").play();
		}
		
	}
	private function setModePatrol (): Void {
		setState(PATROL,true);
		doAction = doActionPatrol;

	}
	
	private function doActionPatrol (): Void {
		
		stepsCount ++;
		
		if (!canContinue()) {
			resetPath();
		}
		
		scale.x = (accelerationGround >= 0)? 1 : -1;
		
		if (stepsCount >= maxSteps) {
			accelerationGround *= -1;
			stepsCount = 0;
		}
		
		
		move();
		friction.set(frictionGround, 0);
		acceleration.set(accelerationGround, 0);
		
	}
	
	private function setModeDeath (): Void {
		setState("death");
		doAction = doActionDeath;
	}
	
	private function doActionDeath (): Void {
		if (isAnimEnd) LevelManager.getInstance().removeFromLevel(this);
	}
	
	private function createShoot (?pScale:Float = 0): Void {
		
		var lPoint = GamePlane.getInstance().toLocal(box.toGlobal(onCrosshair()));
		
		var lShoot = cast(PoolManager.getInstance().getFromPool('ShootEnemyFire'), Shoot);
		lShoot.set(6, 0.72, scale, lPoint, false); // TODO passer ces valeurs de shoots en dur en attributs de l'enemy. (de Cipic)
		
		GamePlane.getInstance().addChild(lShoot); // TODO addChild dans le bon "sous-plan" de jeu ? (de Cipic)
	}
	
}