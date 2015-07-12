package com.isartdigital.operationaaa.game.sprites.shoot;

import com.isartdigital.operationaaa.game.sprites.Collisionnable;
import com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.utils.game.Camera;
import com.isartdigital.utils.game.CollisionManager;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.utils.system.DeviceCapabilities;
import pixi.display.DisplayObjectContainer;
import pixi.geom.Point;

/**
 * ...
 * @author Cindy Asselin De Beauville
 */
class Shoot extends Collisionnable
{
	/**
	 * Liste de variables : état, tableau, bool, valeurs
	 */
	public static var list:Array<Array<Shoot>> = [[], []];
	
	public var isASuperShoot:Bool = false;
	
	private var BEGIN(default, never):String = "begin";
	private var END(default, never):String = "end";
	
	private var isPlayerShoot:Bool;
	private var isTurretShoot:Bool = false;
	
	private var accelerationAir:Float;
	private var frictionAir:Float;
	
	/**
	 * Faire un new shoot avec différentes propriétés
	 * @param	pAssetName : nom du shoot que l'on veut donner
	 * @param	pAcc : Acceleration du shoot
	 * @param	pFriction : Friction du shoot
	 * @param	pScale : Scale du shoot
	 * @param	pViseur : Viseur du tireur
	 * @param	pIsPlayerShoot : Si True, c'est un shoot du player
	 * @param   isASuperShoot : Si true, c'est un super tir du player
	 * @param   pRotation : Rotation du shoot (pour les turret)
	 * @param	pIsTurret : Si True, c'est un shoot de turret
	 */
	public function new (pAssetName:String) {
		//• Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs à des propriétés si elles 
		//  diffèrent entre chaque instance. 
		//• Faites un PoolManager.addToPool(assetName,this)
		//• Ne faites pas de list.push(this)
		
		super();
		assetName = pAssetName;
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	public function set (pAcc:Float, pFriction:Float, pScale:Point, pViseur:Point, ?pIsPlayerShoot:Bool = false , ?superShoot:Bool = false, ?pRotation:Float = 0, ?pIsTurret:Bool = false): Void {
		//• Toute valeur spécifique à une instance doit être passée à cette méthode.
		//• Activer les écouteurs ici
		//• addChild l'instance
		//• list.push(this)
		//• lancer éventuellement le start ici
		
		isPlayerShoot = pIsPlayerShoot;
		isPlayerShoot ? list[0].push(this) : list[1].push(this);
		accelerationAir = pAcc;
		frictionAir = pFriction;
		maxHSpeed = 80;
		maxVSpeed = 80;
		scale.x = pScale.x;
		rotation = pRotation;
		isTurretShoot = pIsTurret;
		isASuperShoot = superShoot;
		position.set(pViseur.x, pViseur.y);
		start();
	}
	
	public function unset (): Void {
		//• Désactivez les écouteurs et tout ce qui poursuivrait son exécution
		//• Passez en setModeVoid
		//• Retirez de list
		setModeVoid();
		isPlayerShoot ? list[0].splice(list[0].indexOf(this), 1) : list[1].splice(list[1].indexOf(this), 1);
	}
	
	//______________________________________________________________________________________________________________________________//
	//_____________________________________________FONCTIONS DE MOUVEMENTS_________________________________________________________//
	//____________________________________________________________________________________________________________________________//
	
	/**
	 * Applique l'acceleration pour les tirs horizontaux
	 */
	private function applyAcceleration() {
		if (scale.x == 1) {
			acceleration.x = accelerationAir;
		}
		else {
			acceleration.x = -accelerationAir;
		}
	}
	
	/**
	 * Move spécialisé pour les shoot type turret
	 */
	private function moveWithDir():Void {
		if ((rotation > 0 && rotation < Math.PI/2) || (rotation > (3 * Math.PI/2) && rotation < 0)) {
				acceleration.x = -accelerationAir;
			} 
		else{
				acceleration.x = accelerationAir;
			}
			
		acceleration.y = accelerationAir;
			
		speed.x += acceleration.x;
		speed.y += acceleration.y;
			
		speed.x *= friction.x;
		speed.y *= friction.y;
			
		speed.x = (speed.x < 0 ? -1 : 1) * Math.min(Math.abs(speed.x), maxHSpeed);
		speed.y = (speed.y < 0 ? -1 : 1) * Math.min(Math.abs(speed.y), maxVSpeed);
			
		x += Math.cos(rotation) * speed.x;
		y += Math.sin(rotation) * speed.y;
			
		acceleration.set(0, 0);
	}
	
	//______________________________________________________________________________________________________________________________//
	//_____________________________________________BOOL DE COLLISIONS______________________________________________________________//
	//____________________________________________________________________________________________________________________________//
	
	/**
	 * Si le shoot collisionne un objet dans une liste en fonction de quel type de shoot il est
	 * @param	pList Array<Dynamic>
	 * @param	pCondition Bool
	 * @return	true/false
	 */
	private function hitObject(pList: Map<String, StateGraphic>, pCondition:Bool):Bool {
		if (pCondition) {
			for (lObject in pList) {
				if (CollisionManager.hitTestObject(lObject.hitBox, box)) {
					if (pList == Enemy.list) {
						var enemy = cast(lObject, Enemy);
						if (isASuperShoot) {
							enemy.hurt(3);
						}
						else enemy.hurt(1,scale.x);
					}
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * Test des murs en fonction des shoots différent de la tourelle
	 * @return true/false
	 */
	private function hitWall():Bool {
		return hitObject(Wall.list, !isTurretShoot);
	}
	
	private function hitKillZone():Bool {
		return hitObject(KillZoneStatic.list, !isTurretShoot);
	}
	
	/**
	 * Test des ennemis si c'est un shoot du player
	 * @return true/false
	 */
	private function hitEnemies():Bool {
		return hitObject(Enemy.list, isPlayerShoot);
	}
	
	/**
	 * Test du player si ce n'est pas un shoot du player
	 * @return true/false
	 */
	private function hitPlayer():Bool {
		if (!isPlayerShoot) {
			if (CollisionManager.hitTestObject(Player.getInstance().hitBox, hitBox)) {
				Player.getInstance().kill();
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Test si l'un des shoots est hors du champ de vision du player
	 * @return true/false
	 */
	private function isOutOfCamera():Bool {
		if(!isTurretShoot){
			var lRect = DeviceCapabilities.getScreenRect(GamePlane.getInstance());
			if (x > lRect.x + lRect.width || x < lRect.x || y > lRect.y + lRect.height || y < lRect.y) return true;
		}
		return false;
	}
	
	
	//______________________________________________________________________________________________________________________________//
	//____________________________________________________SET MODE ET DO ACTION____________________________________________________//
	//____________________________________________________________________________________________________________________________//
	
	/**
	 * Mode Normal (Begin)
	 */
	override function setModeNormal():Void {
		super.setModeNormal();
		if (isPlayerShoot) setState(DEFAULT_STATE, true);
		else setState(BEGIN, true);
		anim.loop = true;
		friction.set(frictionAir, frictionAir);
	}
	
	override function doActionNormal():Void {
		super.doActionNormal();
		if (isTurretShoot) {
			moveWithDir();
		}
		else {
			applyAcceleration();
			move();
		}
		
		if (isOutOfCamera()) {
			backToPool();
			//trace("Shoot sorti de l'écran");
		} 
		else if (hitPlayer() || hitEnemies() ||hitWall() || hitKillZone()) {
			setModeEnd();
			// If hitEnemies() et ennemi is bomb, on doit recréer un shoot et ne pas lancer le modeEnd()
		}
		
	}
	
	/**
	 * Mode Contact (Fin)
	 */
	public function setModeEnd():Void {
		anim.loop = false;
		setState(END);
		doAction = doActionEnd;
	}
	
	private function doActionEnd():Void {
		if (isAnimEnd) backToPool();
	}
	
	public function backToPool (): Void {
		
		GamePlane.getInstance().removeChild(this);
		PoolManager.getInstance().addToPool(assetName, this);
		unset();
	}
	
	/**
	 * Destroy Shoot
	 */
	override public function destroy (): Void {
		//• quand vous avez besoin de définitivement détruire une instance
		//• appeler la méthode désactivation dans le destroy en plus du code spécifique au 
		//destroy
		
		unset();
		super.destroy();
		//trace('Shoot Destroyed');
	}
}