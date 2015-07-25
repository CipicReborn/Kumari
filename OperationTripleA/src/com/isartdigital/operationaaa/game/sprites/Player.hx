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
 * @author Cyprien
 */
class Player extends Collisionnable {
	
	/**
	 * instance unique de la classe Character
	 */
	private static var instance: Player;
	
	private static inline var WAIT = "wait";
	private static inline var WALK = "walk";
	private static inline var JUMP = "jump";
	private static inline var FALL = "fall";
	private static inline var LANDING = "reception";
	private static inline var DOUBLE_JUMP = "doublejump";
	private static inline var DEATH = "death";
	private static inline var RESPAWN = "respawn";
	
	private var controller: Controller;
	
	/**
	 * L'objet floor enregistré comme étant sous les pieds du Player
	 */
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
	
	private var hasShield:Bool = false;
	private var upgradeShootCounter:Float = 15;
	private var delayShootCounter:Float = 4;
	private var counter:Float = 0;
	private var isFinish = false;
	
	private var hasMagnet:Bool = false;
	
	private var fallCounterToJump:Float = 2;
	//Contient le point de réapparition du joueur 
	private var respawnPoint:Point;
	
	private var counterInvincibility:Int = 0;
	private var counterLimit:Int = 100;
	private var haveShieldActivate:Bool = false;
	private var startCounterToInvincibility:Bool = false;
	
	/**
	 * ??
	 * @return Bool
	 */
	private var chargeSound: Howl;
	
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
	
	override public function start (): Void {
		
		super.start();
		//On fait respawn le joueur à sa position initiale si il n'a pas activé de checkpoint
		respawnPoint = new Point(x, y);
		floor = null;
		takeCameraFocus();
		//trace('Player Started');
	}
	
	public function unset (): Void {
		
		setModeVoid();
	}
	
	/**
	 * Retourne true si l'upgrade du Shoot a été collecté
	 * @return
	 */
	public function hasSuperShoot (): Bool {
		return actionShoot["haveSuperShoot"];
	}
	
	/**
	 * Oriente le personnage vers la gauche
	 */
	private function flipLeft (): Void {
		//trace('flipLeft');
		scale.x = -1;
		update();
	}
	
	/**
	 * Oriente le personnage vers la droite
	 */
	private function flipRight (): Void {
		//trace('flipRight');
		scale.x = 1;
		update();
	}
	
	//____________________________________________________________________________________________________________________//
	//____________________________________________________COLLISIONS_____________________________________________________//
	//__________________________________________________________________________________________________________________//
	
	/**
	 * Teste la collision entre un point de référence du player et une liste de StateGraphic.
	 * Retourne null ou le premier objet collisionné de la liste.
	 * @param	pList
	 * @param	StateGraphic>
	 * @param	pPoint
	 * @return
	 */
	private function testPoint(pList:Map<String, StateGraphic>, pPoint:Point):StateGraphic {
		for (lObject in pList) {
			if (CollisionManager.hitTestPoint(lObject.hitBox, hitBox.toGlobal(pPoint))) {
				return lObject;
			}
		}	
		return null;
	}
	
	/**
	 * Teste la collision entre une box de collision et une liste de StateGraphic.
	 * Retourne null ou le premier objet collisionné de la liste.
	 * @param	pList la liste des objets à tester
	 * @param	pBox la box à tester
	 * @return
	 */
	private function testBox(pList:Map<String, StateGraphic>, pBox:DisplayObject):StateGraphic {
		for (lObject in pList) {
			if (CollisionManager.hitTestObject(lObject.hitBox, pBox)) {
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
	 * Teste la collision entre un point et les surfaces de type sol (listes Wall + Platform).
	 * Par défaut, le point testé est le bas de la box du player
	 * Retourne true si le point collisione une surface, false sinon
	 * Sur une collision, repositionne le player
	 * @param	pPoint si non renseigné, le point testé est le bas de la box du player
	 * @return
	 */
	private function hitFloor (?pPoint:Point = null): Bool {
		
		// si aucun point n'est fourni on prend le bas de la box de collision par défaut
		if (pPoint == null) pPoint = getBottom();
		
		// on teste le dernier floor enregistré en priorité : si le joueur n'a pas bougé on s'évite de tester toute la liste.
		if (floor != null && testPoint(["floor" => floor], pPoint) != null) return true;
		// si le joueur n'est plus sur le même floor, on teste les autres surfaces collisionnables à l'écran
		var lCollision:StateGraphic = testPoint(Wall.list, pPoint);
		if (lCollision == null) lCollision = testPoint(Platform.list, pPoint);
		
		if (lCollision != null) {
			// on enregistre une référence vers la surface collisionnée, pour le test prioritaire
			floor = cast(lCollision, Collisionnable);
			actionJump["jumpBefore"] = false; // ?
			// on repositionne le personnage sur la box de collision de la surface collisionnée
			y = lCollision.y;
			return true;
		}
		
		floor = null;
		return false;
	}
	
	/**
	 * Teste la collision entre un point et les objets de la liste Wall.
	 * Retourne le premier wall collisionné ou null
	 * @param	pPoint que l'on veut tester
	 */
	private function hitWall(pPoint:Point): Wall {
		var lObject: StateGraphic = testPoint(Wall.list, pPoint);
		if (lObject != null) return cast (lObject, Wall);
		return null;
	}
	
	/**
	 * Teste les collisions latérales du personnage avec les Walls.
	 * Sur collision, repositionne le player.
	 */
	private function hitSides():Void {
		var lWall: Wall;
		
		lWall = hitWall(getRight());
		if (lWall != null) {
			x = (lWall.x + lWall.hitBox.x) - hitBox.width / 2;
		}
		
		lWall = hitWall(getLeft());
		if (lWall != null) {
			x = (lWall.x + lWall.hitBox.x) + lWall.hitBox.width + hitBox.width / 2;
		}
		// getCaneTopBack(), 1);
		// getCaneTopFront(), -1);
	}
	
	/**
	 * Teste la collision entre le plafond et le haut de la box du player.
	 * Sur une collision, repositionne le player et met sa vitesse verticale à zéro.
	 */
	private function hitCeiling (): Void {
		var lCeiling:StateGraphic = testPoint(Wall.list, getTop());
		if (lCeiling != null) {
			speed.y = 0;
			y = lCeiling.y + lCeiling.hitBox.height + hitBox.height;
			setModeFall();
		}	
	}
	

	/**
	 * Teste la collision entre le player et les hostiles (Enemy + KZDynamic + KZStatic)
	 * modifie éventuellement counterLimit (?)
	 * @return
	 */
	 private function hitHostiles (): Bool {
		
		var lEnemy:StateGraphic = testBox(Enemy.list, hitBox);
		if (lEnemy != null) return true;
		
		var lKZDynamic: StateGraphic = testBox(KillZoneDynamic.list, hitBox);
		if (lKZDynamic != null) {
			
			counterLimit = 100; // ?
			return true;
		}
		
		var lKZStatic: StateGraphic = testBox(KillZoneStatic.list, hitBox);
		if (lKZDynamic != null) {
			
			counterLimit = 100; // ?
			return true;
		}
		
		return false;
	}
	
	/**
	 * Appelle kill() si hitHostiles() vaut true
	 */
	private function killIfHitEnnemies():Void {
		if (hitHostiles()) kill();
	}
	
	/**
	 * Teste la collision entre les collectables et le joueur
	 * Si collision, appelle la méthode pickup du Collectable et ajoute 1 au compteur du Shield 
	 */
	private function hitCollectible (): Void {
		
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
	 * Si collision, appelle la méthode pickup de l'upgrade et appelle setModeVoid().
	 */
	private function hitUpgrade (): Void {
		
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
	private function canJump (): Bool {
		//var lCeiling:StateGraphic = testPoint(Wall.list, getCaneTop());
		//checkInputJump();
		//if (controller.jump && lCeiling == null && actionJump["lastJump"]) {
			//return true;
		//}
		//return false;
		
		
		if (controller.jump) {
			var lCeiling:StateGraphic = testPoint(Wall.list, getCaneTop());
			if (lCeiling == null) return true;
		}
		return false;
	}
	
	/**
	 * Empêche le rebond lorsque la touche reste appuyée
	 * @return Bool
	 */
	//private function checkInputJump():Bool {
		//if (!controller.jump) {
			//actionJump["lastJump"] = true;
		//}
		//return actionJump["lastJump"];
	//}
	
	/**
	 * Retourne true si la canne bottom ne sonde aucun sol.
	 * @return
	 */
	private function canFall () :Bool {
		return !hitFloor(getCaneBottom());
	}
	
	/**
	 * Check si on peut courir ou non
	 * @return true/false
	 */
	//private function canWalk():Bool {
		//var lWall:StateGraphic = testPoint(Wall.list, getCaneFront());
		//if (lWall == null) return true;
		//return false;
	//}
	
	/**
	 * Règle la valeur d'accélération selon l'input left/right du controller
	 * appelle flipLeft() ou flipRight() si besoin
	 * @param	pAcceleration (Ground, Air, etc)
	 */
	private function applyAcceleration (pAcceleration:Float): Void {
		
		if (controller.left) {
			//if(canWalk()) acceleration.x = -pAcceleration;
			acceleration.x = -pAcceleration;
			if (scale.x != -1) flipLeft();
		}
		
		else if (controller.right) {
			//if(canWalk()) acceleration.x = pAcceleration;
			acceleration.x = pAcceleration;
			if (scale.x != 1) flipRight();
		}
	}
	
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
		var lPoint = GamePlane.getInstance().toLocal(box.toGlobal(getCrosshair()));
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
			if (hitHostiles()) {
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
		else hitCeiling();
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
	
	override public function setModeVoid():Void {
		super.setModeVoid();
		floor = null;
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
			hasShield = true;
		}
		else if (pLevel == 4) {
			hasMagnet = true;
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
		if (hasShield && actionShield["collectibleCounter"] == actionShield["collectibleNecessary"]) {
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
		if (hasMagnet) {
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
	
	
	
	//____________________________________________________________________________________________________________________//
	//																													  //
	//________________________________________ GETTERS BOX ET POINTS DE REFERENCE ________________________________________//
	//____________________________________________________________________________________________________________________//
	
	/**
	 * Retourne la box de collision du player
	 * @return
	 */
	override private function get_hitBox (): DisplayObjectContainer {
		return cast box.getChildByName("mcGlobalBox");
	}
	
	/**
	 * Retourne le point de référence du bas de la box de collision, au milieu
	 * @return
	 */
	private function getBottom (): Point {
		return box.getChildByName("mcBottom").position;
	}
	
	/**
	 * Retourne le point de référence du haut de la box de collision, au milieu
	 * @return
	 */
	private function getTop (): Point {
		return box.getChildByName("mcTop").position;
	}
	
	/**
	 * Retourne le point de référence de la canne située au-dessus du personnage
	 * @return
	 */
	private function getCaneTop (): Point {
		return box.getChildByName("mcCaneTop").position;
	}
	
	/**
	 * Retourne le point de référence de la canne située sous le personnage
	 * @return
	 */
	private function getCaneBottom (): Point {
		return box.getChildByName("mcCaneBottom").position;
	}
	
	/**
	 * Retourne le point de référence de l'avant de la box de collision, à 1/4 de la hauteur à la grosse
	 * @return
	 */
	private function getFront (): Point {
		return box.getChildByName("mcFront").position;
	}
	
	/**
	 * Retourne le point de référence de l'arrière de la box de collision, à 1/4 de la hauteur à la grosse
	 * @return
	 */
	private function getBack (): Point {
		return box.getChildByName("mcBack").position;
	}
	
	/**
	 * Retourne le point de référence de la canne située à l'avant du personnage, en haut
	 * @return
	 */
	private function getCaneTopFront (): Point {
		return box.getChildByName("mcCaneTopFront").position;
	}
	
	/**
	 * Retourne le point de référence de la canne située à l'arrière du personnage, en haut
	 * @return
	 */
	private function getCaneTopBack (): Point {
		return box.getChildByName("mcCaneTopBack").position;
	}
	
	/**
	 * Retourne le point de référence de la canne située à l'avant du personnage, à 1/4 de la hauteur à la grosse
	 * @return
	 */
	private function getCaneFront (): Point {
		return box.getChildByName("mcCaneFront").position;
	}
	
	/**
	 * Retourne le point de référence du viseur de tir
	 * @return
	 */
	private function getCrosshair (): Point {
		return box.getChildByName("mcCrosshair").position;
	}
	
	/**
	 * Retourne le point de référence de la limite gauche de la box, , à 1/4 de la hauteur à la grosse
	 * @return point
	 */
	private function getLeft():Point{
	    return (scale.x == 1) ? getBack() : getFront();
	}
	
	/**
	 * Retourne le point de référence de la limite droite de la box, , à 1/4 de la hauteur à la grosse
	 * @return
	 */
	private function getRight():Point{
	    return (scale.x == 1) ? getFront() : getBack();
	}
}