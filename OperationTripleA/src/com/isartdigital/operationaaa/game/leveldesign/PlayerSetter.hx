package com.isartdigital.operationaaa.game.leveldesign;

import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.utils.game.GameObject;

/**
 * ...
 * @author Cyprien LARROUY
 */
class PlayerSetter extends GameObjectSetter{

	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId: String) {
		super(pModel, pClass, pId);
		plane = GamePlane.getInstance().playerContainer;
	}
	
	override public function setupGameObject():GameObject {
		
		inGameInstance = Player.getInstance();
		
		// Paramétrage de positionnement
		inGameInstance.x = x;
		inGameInstance.y = y;
		inGameInstance.scale.set(scaleX/Math.abs(scaleX), scaleY/Math.abs(scaleY));
		inGameInstance.rotation = rotation * GameManager.DEG2RAD;
		if (plane == null) {
			trace(id + ' has no GamePlane layer associated with');
			return null;
		}
		
		// Ajout en jeu et démarrage
		plane.addChild(inGameInstance);
		inGameInstance.start();
		inGameInstance.update();
		
		// Paramétrage spécifique à la classe fille (notamment ajout dans les listes)
		// TODO : cette méthode doit en fait être une méthode de l'instance de type inGameInstance.init({ objet de paramètres })
		specificSetup();
		
		//• Ne pas faire de new
		//• créez une variable (locale) du type qui vous intéresse, transtypez le résultat de 
		//PoolManager.getFromPool
		//• exécutez la méthode d'initialisation de l'instance
		//• positionnez, ajoutez à la displayList
		
		//if (type == LevelLoader.COLLECTABLE) trace(cast(inGameInstance, Collectable).hitPoint);
		return inGameInstance;
	}
	
	/**
	 * Attention : au moment de l'éxécution du specificSetup, le setModeNormal est déjà passé.
	 * Si besoin le rappeller, ou un autre setMode
	 */
	override public function specificSetup (): Void {
		
		//trace('Player setup done at ' + x + ', ' + y + '.');
		
		if (LevelLoader.getInstance().playerHasUpgrade('PowerShoot')) {
			Player.getInstance().setUpgrade(1);
			//trace('Setting Upgrade PowerShoot');
		}
		if (LevelLoader.getInstance().playerHasUpgrade('DoubleJump')) {
			Player.getInstance().setUpgrade(2);
			//trace('Setting Upgrade DoubleJump');
		}
		if (LevelLoader.getInstance().playerHasUpgrade('Shield')) {
			Player.getInstance().setUpgrade(3);
			//trace('Setting Upgrade Shield');
		}
		if (LevelLoader.getInstance().playerHasUpgrade('Magnet')) {
			Player.getInstance().setUpgrade(4);
			//trace('Setting Upgrade Magnet');
		}
	}
}