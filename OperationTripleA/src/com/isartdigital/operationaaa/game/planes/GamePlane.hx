package com.isartdigital.operationaaa.game.planes;

import com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
import com.isartdigital.operationaaa.game.leveldesign.Cell;
import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.system.DeviceCapabilities;
import pixi.display.DisplayObjectContainer;
import pixi.geom.Point;
import pixi.geom.Rectangle;

	
/**
 * ...
 * @author Cyprien LARROUY
 */
class GamePlane extends GameObject {
	
	
	// =======================##### VARIABLES ET FONCTIONS STATIQUES #####=======================
	
	
	/**
	 * instance unique de la classe GamePlane
	 */
	private static var instance: GamePlane;
	
	
	/**
	 * valeur à utiliser pour convertir les degrés en radians
	 */
	private static var DEG2RAD: Float = Math.PI / 180;
	
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): GamePlane {
		if (instance == null) instance = new GamePlane();
		return instance;
	}
	
	
	
	// =======================##### VARIABLES #####=======================
	
	public var groundsContainer:	DisplayObjectContainer;
	public var wallsContainer:		DisplayObjectContainer;
	public var platformsContainer:	DisplayObjectContainer; 
	public var objectsContainer:	DisplayObjectContainer;
	public var playerContainer:		DisplayObjectContainer; 
	
	
	
	// =======================##### FONCTIONS #####=======================
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		super();
		groundsContainer = new DisplayObjectContainer();
		wallsContainer = new DisplayObjectContainer();
		platformsContainer = new DisplayObjectContainer();
		objectsContainer = new DisplayObjectContainer();
		playerContainer = new DisplayObjectContainer();
	}
	
	public function init(): GamePlane {
		addChild(groundsContainer);
		addChild(wallsContainer);
		addChild(platformsContainer);
		addChild(objectsContainer);
		addChild(playerContainer);
		
		return this;
	}
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
	}

}