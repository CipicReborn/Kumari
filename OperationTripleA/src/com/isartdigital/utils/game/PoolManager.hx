package com.isartdigital.utils.game;
import com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
import com.isartdigital.operationaaa.game.sprites.Checkpoint;
import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield;
import com.isartdigital.operationaaa.game.sprites.EndLevelCheckpoint;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.operationaaa.game.sprites.walls.Destructible;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;

	
/**
 * ...
 * @author Cyprien LARROUY
 */
class PoolManager {
	
	// =================  STATIQUES
	
	/**
	 * instance unique de la classe PoolManager
	 */
	private static var instance: PoolManager;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): PoolManager {
		if (instance == null) instance = new PoolManager();
		return instance;
	}
	
	// Fonctions d'Instanciation des Classes
	static public var createInstance (default, null): Map<String, Dynamic> = [
		'BridgeLeft'				=> function () { return Type.createInstance(Platform , ['BridgeLeft']); },
		'BridgeRight'				=> function () { return Type.createInstance(Platform , ['BridgeRight']); },
		'Platform0'					=> function () { return Type.createInstance(Platform , ['Platform0']); },
		'Platform1'					=> function () { return Type.createInstance(Platform , ['Platform1']); },
		'LimitLeft'					=> function () { return Type.createInstance(Wall , ['LimitLeft']); },
		'LimitRight'				=> function () { return Type.createInstance(Wall , ['LimitRight']); },
		'Wall0'						=> function () { return Type.createInstance(Wall , ['Wall0']); },
		'Wall1'						=> function () { return Type.createInstance(Wall , ['Wall1']); },
		'Wall2'						=> function () { return Type.createInstance(Wall , ['Wall2']); },
		'Wall3'						=> function () { return Type.createInstance(Wall , ['Wall3']); },
		'Ground'					=> function () { return Type.createInstance(Wall , ['Ground']); },
		'Destructible'				=> function () { return Type.createInstance(Destructible , []); },
		'Collectable'				=> function () { return Type.createInstance(Collectable , []); },
		'UpgradeFire'				=> function () { return Type.createInstance(UpgradeFire , []); },
		'UpgradeJump'				=> function () { return Type.createInstance(UpgradeJump , []); },
		'UpgradeShield'				=> function () { return Type.createInstance(UpgradeShield , []); },
		'UpgradeMagnet'				=> function () { return Type.createInstance(UpgradeMagnet , []); },
		'EnemyFire'					=> function () { return Type.createInstance(EnemyFire , []); },
		'EnemySpeed'				=> function () { return Type.createInstance(EnemySpeed , []); },
		'EnemyBomb'					=> function () { return Type.createInstance(EnemyBomb , []); },
		'EnemyTurret'				=> function () { return Type.createInstance(EnemyTurret , []); },
		'KillZoneStatic'			=> function () { return Type.createInstance(KillZoneStatic , []); },
		'KillZoneDynamic'			=> function () { return Type.createInstance(KillZoneDynamic , []); },
		'Checkpoint'				=> function () { return Type.createInstance(Checkpoint , []); },
		'ShootPlayer_Blue'			=> function () { return Type.createInstance(Shoot , ['ShootPlayer_Blue']); },
		'ShootPlayer_DarkBlue'		=> function () { return Type.createInstance(Shoot , ['ShootPlayer_DarkBlue']); },
		'ShootPlayer_Green'			=> function () { return Type.createInstance(Shoot , ['ShootPlayer_Green']); },
		'ShootPlayer_Orange'		=> function () { return Type.createInstance(Shoot , ['ShootPlayer_Orange']); },
		'ShootPlayer_RoseViolet' 	=> function () { return Type.createInstance(Shoot , ['ShootPlayer_RoseViolet']); },
		'ShootPlayerPower_Yellow' 	=> function () { return Type.createInstance(Shoot , ['ShootPlayerPower_Yellow']); },
		'ShootEnemyFire' 			=> function () { return Type.createInstance(Shoot , ['ShootEnemyFire']); },
		'ShootEnemyTurret' 			=> function () { return Type.createInstance(Shoot , ['ShootEnemyTurret']); }
	];
	
	// =================  VARIABLES
	
	private var pools: Map<String, Array<StateGraphic>>;
	private var outRegister: Map<String, Int>;
	private var maxCountOut: Map<String, Int>;
	
	
	// =================  FONCTIONS
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		pools = new Map<String, Array<StateGraphic>>();
		outRegister = new Map<String, Int>();
		maxCountOut = new Map<String, Int>();
	}
	
	/**
	 * Stocke pInstance dans le pool des pType
	 * @param	pType
	 * @param	pInstance
	 */
	public function addToPool (pType: String, pInstance: StateGraphic): Void {
		//trace('pool ' + pType);
		if (!pools.exists(pType)) {
			pools.set(pType, new Array<StateGraphic>());
			//outRegister[pType] = 1;
		}
		//pInstance.id = null; // non à déplacer dans les classes des instances dans la méthode désinit
		pools[pType].push(pInstance);
		//outRegister[pType] = outRegister[pType] - 1;
		//trace(pType + ' Pool : ' + pools[pType].length);
	};
	
	/**
	 * retourne une instance de pType depuis le pool ou nouvellement créée si le pool est vide
	 * @param	pType
	 * @return
	 */
	public function  getFromPool (pType: String): StateGraphic {
		//trace('recycle');
		
		// Si le pool est vide :
		if (!pools.exists(pType) || pools[pType].length == 0) {
			trace('[PoolManager.getFromPool] ' + pType + ' Pool Empty ! Creating Instance on the fly');
			createStateGraphic(pType); //les Objets se poolent eux-même à la création
		}
		
		return pools[pType].shift();
	}
	
	/**
	 * Fonction temporaire servant a compter le nombre d'instance max dans un niveau
	 * @param	pType
	 */
	private function checkMaxCount(pType: String, ?pFeedback: Bool = true){
		if(maxCountOut[pType] == null) maxCountOut[pType] = 0;
		if (outRegister[pType] > maxCountOut[pType]) {
			maxCountOut[pType] = outRegister[pType];
			//if (pFeedback)trace(pType + 'maxCount = ' + maxCountOut[pType] + '.');
		}
		//trace(pType + ' Pool : ' + pools[pType].length);
	}
	
	/**
	 * Vide les instances du pool de pType
	 * @param	pType
	 */
	public function clear (?pType: String = null): Void {
		
		if (pType == null) {
			trace('=====##### POOLS CLEARING ENGAGED #####=====');
			
			for (lType in pools.keys()) {
				if (lType != 'Player') destroyPoolContent(lType);
			}
			
			for (key in pools.keys()) {
				trace('- ' + key + ' : ' + pools[key].length);
			}
			trace('### Pools cleared');
			//trace(pools);
			//pools = new Map<String, Array<StateGraphic>>();
			
		} else if (pools.exists(pType)) {
			destroyPoolContent(pType);
			trace(pType + ' Pool size after emptying : ' + pools[pType].length);
			//pools.set(pType, new Array<StateGraphic>());
		}
		
	}
	
	private function destroyPoolContent(pType: String) {
		//trace('# Destroying Pool ' + pType + ', containing ' + pools[pType].length + ' objects :');
		var lLength = pools[pType].length;
		for (i in 0...lLength) {
			//trace('destroying ' + pType + ' from pool');
			var j = lLength - 1 - i;
			//trace('loop info : i = ' + i + ', j = ' + j);
			var lObject = pools[pType][j];
			if (lObject == null) {
				Debug.warn('pools[' + pType + '][' + j + '] is undefined. Skipping Destroy, next to Splicing');
			}
			else {
				//si l'objet n'est finalement jamais sorti de la pool, il n'a peut-être jamais été setState. du coup on lui fait un setModeNormal/setModeVoid avant de mourir
				lObject.start();
				lObject.setModeVoid();
				lObject.destroy();
			}
			pools[pType].splice(pools[pType].indexOf(lObject), 1);
			//trace('object destroyed and removed from pool. Pool now containing ' + pools[pType].length + ' objects.');
		}
		//trace('# Pool ' + pType + ' Cleared');
	}
	
	/**
	 * Crée un objet du type demandé
	 * @param	pType
	 */
	public function createStateGraphic(pType: String) {
		
		// Si la pool n'existe pas on la créé.
		if (!pools.exists(pType)) pools.set(pType, new Array<StateGraphic>());
		
		// On créée une instance en vérifiant que la pool s'est bien incrémentée de un
		var expectedPoolLength =  pools[pType].length + 1;
		createInstance[pType]();
		if (pools[pType].length != expectedPoolLength) Debug.warn('L\'objet de type ' + pType + ' a été créé mais n\'a pas été ajouté à la pool.\n' +
		'Vérifiez que le constructeur de classe appelle bien la fonction PoolManager.getInstance().addToPool() avec les bons paramètres.');
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}

}