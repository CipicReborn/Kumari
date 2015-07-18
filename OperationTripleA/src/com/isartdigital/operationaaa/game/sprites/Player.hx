package com.isartdigital.operationaaa.game.sprites;

import com.isartdigital.operationaaa.controller.Controller;
import com.isartdigital.operationaaa.controller.KeyboardController;
import com.isartdigital.operationaaa.controller.TouchController;
import com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
import com.isartdigital.utils.game.BoxType;
import com.isartdigital.utils.game.PoolManager;

import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.operationaaa.game.planes.GamePlane;

import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet;
import com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;

import com.isartdigital.operationaaa.ui.hud.Hud;
import com.isartdigital.utils.game.Camera;
import com.isartdigital.utils.game.CollisionManager;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.system.DeviceCapabilities;
import com.isartdigital.utils.ui.UIPosition;
import haxe.Constraints.Function;
import howler.Howl;
import pixi.display.DisplayObject;
import pixi.display.DisplayObjectContainer;
import pixi.display.Sprite;
import pixi.geom.Point;
import pixi.geom.Rectangle;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Cindy Asselin de Beauville
 */
class Player extends Collisionnable {
	
	/**
	 * instance+ unique de la classe Character
	 */
	private static var instance: Player;
	
	private var WAIT (default, never): String = "wait"; // une inline n'est pas héritée par les filles. c'est pour celà qu'on utilise pas inline ici.
	private var WALK (default, never): String = "walk"; // une inline n'est pas héritée par les filles. c'est pour celà qu'on utilise pas inline ici.
	private var JUMP (default, never): String = "jump"; // une inline n'est pas héritée par les filles. c'est pour celà qu'on utilise pas inline ici.
	private var FALL (default, never): String = "fall"; // une inline n'est pas héritée par les filles. c'est pour celà qu'on utilise pas inline ici.
	private var LANDING (default, never): String = "reception"; // une inline n'est pas héritée par les filles. c'est pour celà qu'on utilise pas inline ici.
	private var DOUBLE_JUMP(default, never):String = "doublejump";
	
	private var DEATH(default, never):String = "death";
	private var RESPAWN(default, never):String = "respawn";
	
	private var controller: Controller;
	
	private var floor:Collisionnable;
	
	private var accelerationGround: Float = 14;
	private var frictionGround: Float = 0.45;
	
	private var accelerationAir: Float = 2;
	private var frictionAir: Point = new Point(0.92, 0.92);
	
	private var impulse:Float = 15;
	private var gravity:Float = 3;
	private var GRAVITY_JUMP:Float = 2;
	private var GRAVITY_NORMAL:Float = 3;
	
	private var impulseDuration:UInt = 10;
	private var impulseCounter:UInt = 0;
	
	private var sizeOfReplacement:Float = 10;
	
	private var actionJump:Map<String, Bool> = [
		"haveDoubleJump" => false,
		"canDoubleJump" => true,
		"lastJump" => true,
		"isDoubleJump" => false,
		"jumpBefore" => false
	];
	
	private var actionShoot:Map<String, Bool> = [
		"haveSuperShoot" => false,
		"lastShoot" => false
	];
	
	private var actionShield:Map<String, Int> = [
		"collectibleCounter" => 0,
		"collectibleNecessary" => 5
	];
	
	private var shootColors:Array<String> = [
	"ShootPlayer_Blue", "ShootPlayer_DarkBlue", "ShootPlayer_Green",
	"ShootPlayer_Orange", "ShootPlayer_RoseViolet"];
	
	private var haveShield:Bool = false;
	private var upgradeShootCounter:Float = 15;
	private var delayShootCounter:Float = 4;
	private var counter:Float = 0;
	private var isFinish = false;
	
	private var haveMagnet:Bool = false;
	
	private var fallCounterToJump:Float = 2;
	//Contient le point de réapparition du joueur 
	private var respawnPoint:Point;
	
	private var counterInvincibility:Int = 0;
	private var counterLimit:Int = 100;
	private var haveShieldActivate:Bool = false;
	private var startCounterToInvincibility:Bool = false;
	
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Player {
		if (instance == null) instance = new Player();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		super();
		if (DeviceCapabilities.system == DeviceCapabilities.SYSTEM_DESKTOP) controller = KeyboardController.getInstance();
		else controller = TouchController.getInstance();
		
		maxHSpeed = 16;
		maxVSpeed = 35;
	}
	
	public function takeCameraFocus (): Void {
		if (state == null) {
			setState(DEFAULT_STATE);
		}
		Camera.getInstance().setFocus(box.getChildByName("mcCamera"));
	}
	
	override public function start():Void 
	{
		super.start();
		//On fait respawn le joueur à sa position initiale si il n'a pas activé de checkpoint
		respawnPoint = new Point(x, y);
		floor = null;
		takeCameraFocus();
		//trace('Player Started');
	}
	
	//____________________________________________________________________________________________________________________//
	//_________________________________________________POINTS ET SCALE___________________________________________________//
	//__________________________________________________________________________________________________________________//
	
	//@:getter(hitBox) Retourne la box principale
	override function get_hitBox():DisplayObjectContainer {
		return cast box.getChildByName("mcGlobalBox");
	}
	
	public function getSuperShoot():Bool {
		return actionShoot["haveSuperShoot"];
	}
	
	public function getShield():Bool {
		return haveShield;
	}
	
	/**
	 * Tourne le personnage a gauche ou a droite
	 */
	private function flipLeft():Void {
		scale.x = -1;
	}
	
	private function flipRight():Void {
		scale.x = 1;
	}
	
	/**
	 * Retourne les différents point de collision autours du Player
	 * @return les cannes bot et top
	 */
	private function hitBottom():Point {
		return box.getChildByName("mcBottom").position;
	}
	
	private function hitTop():Point {
		return box.getChildByName("mcTop").position;
	}
	
	private function checkTop():Point {
		return box.getChildByName("mcCaneTop").position;
	}
	
	private function checkBottom():Point {
		return box.getChildByName("mcCaneBottom").position;
	}
	
	private function checkFront():Point {
		return box.getChildByName("mcFront").position;
	}
	
	private function checkBack():Point {
		return box.getChildByName("mcBack").position;
	}
	
	private function checkFrontTop():Point {
		return box.getChildByName("mcCaneTopRight").position;
	}
	
	private function checkBackTop():Point {
		return box.getChildByName("mcCaneTopLeft").position;
	}
	
	private function checkCaneFront():Point {
		return box.getChildByName("mcCaneFront").position;
	}
	
	private function onCrosshair():Point {
		return box.getChildByName("mcCrosshair").position;
	}
	
	/**
	 * Retourne le bon point en fonction du scale (getLeft ou getRight)
	 * @return point
	 */
		
	private function getLeft():Point{
	    return (scale.x == 1)? checkBack() : checkFront();
	}
	
	private function getRight():Point{
	    return (scale.x == 1)? checkFront() : checkBack();
	}
	
	//____________________________________________________________________________________________________________________//
	//____________________________________________________COLLISIONS_____________________________________________________//
	//__________________________________________________________________________________________________________________//
	
	/**
	 * Teste la collision entre un array d'objet et un point
	 * @param	pList Array<Dynamic>
	 * @param	pPoint
	 * @return l'objet si il y a collision, sinon retourne null
	 */
	//private function testPoint(pList:Array<Dynamic>, pPoint:Point):StateGraphic {
		//for (i in 0...pList.length) {
			//if (CollisionManager.hitTestPoint(cast(pList[i], StateGraphic).hitBox, box.toGlobal(pPoint))) {
				//return pList[i];
			//} 
		//}	
		//return null;
	//}
	private function testPoint(pList:Map<String, StateGraphic>, pPoint:Point):StateGraphic {
		for (lObject in pList) {
			if (CollisionManager.hitTestPoint(lObject.hitBox, box.toGlobal(pPoint))) {
				return lObject;
			}
		}	
		return null;
	}
	
	private function testCollectibles(pList:Map<String, StateGraphic>):StateGraphic {
		for (lObject in pList) {
			if (CollisionManager.hitTestObject(hitBox, cast(lObject, Collectable).hitBox)) {
				return lObject;
			}
		}	
		return null;
	}
	
	/**
	 * Teste la collision entre un array d'objets et une box
	 * @param	pPoint
	 * @return
	 */
	private function testBox(pList:Map<String, StateGraphic>, pBox:DisplayObject):StateGraphic {
		for (lObject in pList) {
			
			if (CollisionManager.hitTestObject(lObject.hitBox, pBox)) {
				//trace('testBox determined a collision with ' + lObject.id);
				return lObject;
			}
		}
		return null;
	}
	
	/**
	 * Vérifie que le joueur collisionne un checkpoint et change le respawnPoint en conséquence
	 * @author Benjamin
	 */
	private function hitCheckpoint(): Void {
		//On teste inactiveList, pour éviter de tester les checkpoints déjà activés et qui n'ont plus besoin d'être collisionnés
		var checkpointHit:StateGraphic = testBox(Checkpoint.inactiveList, hitBox);
		if (checkpointHit == null) return;
		else {
			var checkpoint:Checkpoint = cast(checkpointHit, Checkpoint);
			checkpoint.onCollision();
			
			//On enregistre le point de respawn, avec des coordonnées dans le repère du GamePlane
			var lRespawnCheckpoint:Point = new Point(checkpoint.box.getChildByName("mcRespawnPoint").x, checkpoint.box.getChildByName("mcRespawnPoint").y);
			respawnPoint.set(checkpoint.x + lRespawnCheckpoint.x, checkpoint.y + lRespawnCheckpoint.y - 80);
		}
	}
	
	/**
	 * Teste la collision entre le sol sur lequel est le player et lui.
	 * @param	pPoint
	 * @return true -> collision / false -> pas de collision
	 */
	private function hitFloor(?pPoint:Point = null):Bool {
		if (pPoint == null) pPoint = hitBottom();
		
		var lCollision:StateGraphic = testPoint(Wall.list, pPoint);
		if (lCollision == null) lCollision = testPoint(Platform.list, pPoint);
		
		if (lCollision != null) {
			floor = cast(lCollision, Collisionnable);
			actionJump["jumpBefore"] = false;
			y = lCollision.y;
			return true;
		}
		floor = null;
		return false;
	}
	
	/**
	 * Appelle tout les points que l'on doit tester
	 */
	private function hitSides():Void {
		hitSide(getRight(), -1);
		hitSide(getLeft(), 1);
		hitSide(checkBackTop(), 1);
		hitSide(checkFrontTop(), -1);
	}
	
	/**
	 * Teste la collision entre les cotés du player et les murs
	 * @param	pPoint que l'on veut tester
	 * @param	pCoef selon le scale
	 */
	private function hitSide(pPoint:Point, pCoef:Float) {
		var lCollision:StateGraphic = testPoint(Wall.list, pPoint);
		if (lCollision != null) {
			speed.x = 0;
			x += (sizeOfReplacement * pCoef);
		}
	}
	
	/**
	 * Teste la collision entre le plafond et la canne Top du player.
	 */
	private function hitCeil():Void {
		var lCeil:StateGraphic = testPoint(Wall.list, hitTop());
		if (lCeil != null) {
			speed.y = 0;
			y = lCeil.y + lCeil.hitBox.height + hitBox.height;
			setModeFall();
		}	
	}
	
	/**
	 * Teste la collision entre les ennemis et le player
	 */
	private function hitEnemies():Bool {
		var lEnemy:StateGraphic = testBox(Enemy.list, hitBox);
		var lKillZoneD:StateGraphic = testBox(KillZoneDynamic.list, hitBox);
		var lKillZoneS:StateGraphic = testBox(KillZoneStatic.list, hitBox);
		if (lEnemy == null && lKillZoneD == null && lKillZoneS == null) return false;
		else {
			var lBy: String = lEnemy == null ? lKillZoneD == null ? lKillZoneS.id : lKillZoneD.id : lEnemy.id;
			if (lEnemy == null) counterLimit = 100;
			//trace('Player Killed by ' + lBy);
			return true;
		}
	}
	
	/**
	 * Applique la mort si hitEnnemies vaut true
	 */
	private function killIfHitEnnemies():Void {
		if (hitEnemies()) kill();
	}
	
	/**
	 * Teste la collision entre les collectibles et le joueur
	 */
	private function hitCollectible():Void {
		
		var lObject: StateGraphic = testBox(Collectable.list, hitBox);
		if (lObject == null) return;
		else {
			//trace('Yahoo ' + lObject.id + ' captured !');
			cast(lObject, Collectable).onPickup();
			actionShield["collectibleCounter"] = actionShield["collectibleCounter"] + 1 ;
		}
	}
	
	/**
	 * Teste la collision entre l'upgrade de fin de level
	 */
	private function hitUpgrade(): Void {
		
		var lObject: StateGraphic = testBox(Upgrade.list, hitBox);
		if (lObject == null) return;
		else {
			cast(lObject, Upgrade).onPickup();
			setModeVoid();
		}
	}
	
	//____________________________________________________________________________________________________________________//
	//______________________________________PERMISSIONS D INPUT/COLLISONS________________________________________________//
	//__________________________________________________________________________________________________________________//
	
	/**
	 * Check si le saut est possible ou non
	 * @return true/false
	 */
	private function canJump():Bool {
		var lCeil:StateGraphic = testPoint(Wall.list, checkTop());
		checkInputJump();
		if (controller.jump && lCeil == null && actionJump["lastJump"]) {
			return true;
		}
		return false;
	}
	
	/**
	 * Empeche le rebond lorsque la touche reste appuyée
	 * @return Bool
	 */
	private function checkInputJump():Bool {
		if (!controller.jump) {
			actionJump["lastJump"] = true;
		}
		return actionJump["lastJump"];
	}
	
	/**
	 * Check si la chute est possible ou non
	 * @return true/false
	 */
	private function canFall():Bool {
		if (floor != null && testPoint(['' => floor], checkBottom()) == floor) return false;
		return !hitFloor(checkBottom());
	}
	
	/**
	 * Check si on peut courir ou non
	 * @return true/false
	 */
	private function canWalk():Bool {
		var lWall:StateGraphic = testPoint(Wall.list, checkCaneFront());
		if (lWall == null) return true;
		return false;
	}
	
	/**
	 * Applique selon le controller.left/controller.right l'acceleration qu'il faut
	 * @param	pAcceleration (Ground, Air, etc)
	 */
	private function applyAcceleration(pAcceleration:Float) {
			if (controller.left) {
				if(canWalk()) acceleration.x = -pAcceleration;
				flipLeft();
			} else if (controller.right) {
				if(canWalk()) acceleration.x = pAcceleration;
				flipRight();
			}
	}
	
	/**
	 * Defini en fonction du temps de l'input si le player fait un shoot normal ou une super charge
	 * @return Bool
	 */
	private var chargeSound:Howl = null;
	private function defineShootMode(pState:String, ?pLoop:Bool = false):Void {	
		if (controller.fire) {
			counter++;
			actionShoot["lastShoot"] = true;
			if (counter > (upgradeShootCounter - delayShootCounter) && actionShoot["haveSuperShoot"]) {
				setState(pState + "Charge", true); // state Charge here
				if (chargeSound == null) {
					chargeSound = SoundManager.getSound("player_charge");
					chargeSound.loop(true);
					chargeSound.play();
				}
			}
		}
		else if (!controller.fire && actionShoot["lastShoot"]) {
			if (counter > upgradeShootCounter && actionShoot["haveSuperShoot"]) {
				createShoot("ShootPlayerPower_Yellow", true);
			} else {
				var alea = Math.floor(Math.random() * shootColors.length);
				createShoot(shootColors[alea]);
			}
			setState(pState + 'Shoot', pLoop);
			actionShoot["lastShoot"] = false;
			counter = 0;
		}
		manageShootMode(pState);
	}
	

	
	/**
	 * Gère si l'anim est fini pour remettre la bonne state
	 * @param	pState
	 */
	private function manageShootMode(pState:String) {
		if (state != pState &&  isAnimEnd) {
			isFinish = true;
			if (chargeSound != null) {
				chargeSound.stop();
				chargeSound = null;
			}
		}
		if (isFinish) {
			setState(pState);
			isFinish = false;
		}
	}
	
	//____________________________________________________________________________________________________________________//
	//____________________________________________________INCLASSABLE____________________________________________________//
	//__________________________________________________________________________________________________________________//
	
	/**
	 * Applique le mouvement et la gravité (utilisable pour le saut/fall)
	 */
	private function moveWithGravity():Void {
		acceleration.y += gravity;
		move();
	}
	
	/**
	 * Créer un shoot pour le player en fonction du scale et de la position du viseur
	 */
	private function createShoot(pAsset:String, ?pIsSuperShoot:Bool = false):Void {
		var lPoint = GamePlane.getInstance().toLocal(box.toGlobal(onCrosshair()));
		var lShoot = cast(PoolManager.getInstance().getFromPool(pAsset), Shoot);
		lShoot.set(15, 0.67, scale, lPoint, true, pIsSuperShoot);
		
		GamePlane.getInstance().addChild(lShoot); // TODO addChild dans le bon "sous-plan" de jeu ? (de Cipic)
		lShoot.update(); //ajout Cipic
		//Si c'est un super shoot,
		if (pIsSuperShoot) SoundManager.getSound("player_superfire").play();
		else SoundManager.getSound("player_fire").play();
	}
	
	/**
	 * Tue le joueur
	 * @author Benjamin PAGEAUD
	 */
	public function kill():Void {
		setModeDeath();
	}
	
	/**
	 * Fait réapparaître le joueur au dernier checkpoint ou au début 
	 * @author Benjamin PAGEAUD
	 */
	public function respawn():Void {
		setState(RESPAWN);
		SoundManager.getSound('respawn').play();
		GameManager.getInstance().respawnAt(Math.round(respawnPoint.x), Math.round(respawnPoint.y));
		for (lShoot in Shoot.list[0]) lShoot.destroy();
		for (lShoot in Shoot.list[1]) lShoot.destroy();
	}
	
	/**
	 * Méthode qui empeche au player de mourir tout de suite à la fin du bouclier
	 * @return Bool
	 */
	public function isInvicible():Void {
		if (haveShieldActivate) {
			if (hitEnemies()) {
				startCounterToInvincibility = true;
				Shield.getInstance().setModeNormal();
			}
		} else {
			killIfHitEnnemies();
			startCounterToInvincibility = false;
			counterInvincibility = 0;
		}
		
		if (startCounterToInvincibility) {
			counterInvincibility++;
			
			if (counterInvincibility > 30 && counterInvincibility % 2 == 0) {
				alpha += 0.1;
			} else alpha -= 0.01;
			
			if (counterInvincibility > counterLimit) {
				alpha = 1;
				haveShieldActivate = false;
			}
		}
	}
	
	//______________________________________________________________________________________________________________________________//
	//____________________________________________________SET MODE ET DO ACTION____________________________________________________//
	//____________________________________________________________________________________________________________________________//
	
	/**
	 * Set le mode Normal(Wait)
	 */
	override public function setModeNormal (): Void {
		super.setModeNormal();
		boxType = BoxType.NONE;
		setState(WAIT);
		//trace("[Player.setModeNormal] On");
	}
	
	/**
	 * En Wait, on check si on peut jump, fall ou walk.
	 */
	override function doActionNormal():Void {
		super.doActionNormal();
		if (canJump()) {
			setModeJump();
		} else if (canFall()){
			setModeFall();
		} else if (controller.right || controller.left) {
			setModeWalk(); 
		} else {
			defineShootMode(WAIT);
		}
		checkUpdate();
	}
	
	/**
	 * Set le mode Walk et remet les frictions à 0
	 */
	public function setModeWalk (): Void {	
		//trace("[Player.setModeWalk] On");
		setState(WALK, true);
		friction.set(frictionGround, 0);
		anim.animationSpeed = 0.5;
		doAction = doActionWalk;
	}
	
	/**
	 * Fait bouger le perso en fonction de l'input
	 */
	private function doActionWalk (): Void {
		applyAcceleration(accelerationGround);
		move();
		hitSides();
		hitCheckpoint();
		if (canJump()) {
			setModeJump();
		} else if (canFall()) {
			setModeFall();
		} 
		defineShootMode(WALK);
		
		if (Math.abs(speed.x ) < 1) setModeNormal();
		checkUpdate();
	}
	
	/**
	 * Set le modeJump, remet friction et count de l'impulsion à zéro  
	 */
	public function setModeJump (): Void {
		
		//trace("[Player.setModeJump] On");
		if (actionJump["isDoubleJump"]) setState(DOUBLE_JUMP)
		else setState(JUMP);
		gravity = GRAVITY_JUMP;
		friction.set(frictionAir.x, frictionAir.y);
		impulseCounter = 0;
		actionJump["lastJump"] = false;
		actionJump["jumpBefore"] = true;
		doAction = doActionJump;
	}

	/**
	 * Saute en fonction d'un certain temps donné
	 */
	private function doActionJump (): Void {
		applyAcceleration(accelerationAir);
		
		if(controller.jump){
			if (impulseCounter++ < impulseDuration) acceleration.y = -impulse;
			else impulseCounter = impulseDuration;
		}
		
		moveWithGravity();
		hitSides();
		hitCheckpoint();
		
		if (actionJump["isDoubleJump"]) defineShootMode(DOUBLE_JUMP);
		else defineShootMode(JUMP);
			
		checkDoubleJump();
		
		if (speed.y > 0) setModeFall();
		else hitCeil();
		checkUpdate();
	}
	
	/**
	 * Set mode Fall, friction à zéro
	 */
	public function setModeFall (): Void {
		setState(FALL);
		gravity = GRAVITY_NORMAL;
		friction.set(frictionAir.x, frictionAir.y);
		doAction = doActionFall;
		impulseCounter = 0;
	}
	
	/**
	 * Fait tomber le player jusqu'a toucher un sol & check le Double Jump
	 */
	private function doActionFall (): Void {
		applyAcceleration(accelerationAir);
		moveWithGravity();
		hitSides();
		hitCheckpoint();
		defineShootMode(FALL);
		
		if (hitFloor()) setModeLanding();
		
		fallCounterToJump--;
		if (fallCounterToJump > 0 && canJump() && !actionJump["jumpBefore"]) {
			if (state == FALL) speed.y = 0;
			setModeJump();
	}
		else checkDoubleJump();
		checkUpdate();
	
	}
	
	/**
	 * Set le mode reception, friction et vitesse réinitialisées
	 */
	public function setModeLanding (): Void {
		speed.y = 0;
		setState(LANDING);
		friction.set(frictionGround, 0);
		actionJump["canDoubleJump"] = true;
		actionJump["isDoubleJump"] = false;
		fallCounterToJump = 2;
		doAction = doActionLanding;
	}
	
	/**
	 * Mode reception
	 */
	private function doActionLanding (): Void {
		if (controller.right || controller.left) {
			setModeWalk(); 
		}
		move();
		defineShootMode(LANDING);
		if (isAnimEnd) {
			if (Math.abs(speed.x) < 1) setModeNormal();
			else setModeWalk();
		}
		checkUpdate();
	}
	
	/**
	 * Mode mort du joueur
	 * @author Benjamin PAGEAUD
	 */
	//Variables qui ne servent qu'ici
	
	private var deathScreen:Sprite;
	private var deathCounter:Int;
	private static inline var DEATH_DURATION:Int = 60 * 2;
	public var isDead:Bool;
	
	private function setModeDeath(): Void {
		LevelManager.getInstance().setModeDontCheckClipping();
		anim.animationSpeed = 0.3;
		deathCounter = 0;
		//L'écran noir lors de la mort est tellement simple que je pense qu'il ne mérite pas de singleton
		if (deathScreen != null) deathScreen.parent.removeChild(deathScreen);
		deathScreen = new Sprite(Texture.fromFrame("assets/black_bg.png"));
		Hud.getInstance().addChild(deathScreen);
		
		isDead = true;
		var lScreen:Rectangle = DeviceCapabilities.getScreenRect(this);
		var lTopLeft:Point = new Point(lScreen.x, lScreen.y);
		UIPosition.setPosition(deathScreen, UIPosition.TOP_LEFT);
		deathScreen.width = lScreen.width;
		deathScreen.height = lScreen.height;
		deathScreen.alpha = 0;
		actionShield["collectibleCounter"] = 0;
	    doAction = doActionDeath;
		boxType = BoxType.NONE;
		setState(DEATH);
	}
	
	/**
	 * doAction du joueur lors de sa mort
	 * @author Benjamin PAGEAUD
	 */
	private function doActionDeath(): Void {
			deathCounter++;
			//A la moitié de l'anim totale de la mort, on remet le joueur au bon endroit
			if (deathCounter == DEATH_DURATION / 2) {
				respawn();
				Camera.getInstance().setPosition();
			}
			if (deathCounter >= DEATH_DURATION) {
				deathScreen.parent.removeChild(deathScreen);
				deathScreen = null;
				isDead = false;
				return setModeNormal();
			}
			
			if (deathCounter < DEATH_DURATION / 2) {
				deathScreen.alpha += 2 / DEATH_DURATION;
			} else {
				deathScreen.alpha -= 2 / DEATH_DURATION;
			}
	}
	
	//________________________________________________________________________________________________________________//
	//____________________________________________________UPGRADE____________________________________________________//
	//______________________________________________________________________________________________________________//
	
	public function setUpgrade(pLevel: Int): Void {
		//trace (pLevel);
		if (pLevel == 1) {
			actionShoot['haveSuperShoot'] = true;
			//trace("actionShoot['haveSuperShoot'] == " + actionShoot['haveSuperShoot']);
			//trace(getSuperShoot());
		}
		else if (pLevel == 2) {
			actionJump['haveDoubleJump'] = true;
		}
		else if (pLevel == 3) {
			haveShield = true;
		}
		else if (pLevel == 4) {
			haveMagnet = true;
		}
	}
	
	/**
	 * Upgrade du Double Jump
	 */
	private function checkDoubleJump() {
		if (canJump()) {
			if (actionJump["haveDoubleJump"] && actionJump["canDoubleJump"]) {
				actionJump["canDoubleJump"] = false;
				actionJump["isDoubleJump"] = true;
				if (state == FALL) speed.y = 0; // permet si on était en train de tomber de passer directement sur une vitesse vers le haut
				setModeJump();
			}
		}
	}
	
	/**
	 * Upgrade du Shield
	 */
	private function checkShield() {
		if (haveShield && actionShield["collectibleCounter"] == actionShield["collectibleNecessary"]) {
			haveShieldActivate = true;
			Shield.getInstance().setModeActif();
			SoundManager.getSound('magic_shield').play();
			actionShield["collectibleCounter"] = 0;
			anim.animationSpeed = 0.2;
		}
	}
	
	/**
	 * Upgrade de l'Aimant
	 */
	private function checkMagnet() {
		if (haveMagnet) {
			Magnet.getInstance().setModeNormal();
			anim.animationSpeed = 0.2;
		}
	}
	
	/**
	 * Appelle les différents "check" que l'on doit faire
	 */
	private function checkUpdate() {
		hitCollectible();
		hitUpgrade();
		checkShield();
		checkMagnet();
		isInvicible();
	}
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}