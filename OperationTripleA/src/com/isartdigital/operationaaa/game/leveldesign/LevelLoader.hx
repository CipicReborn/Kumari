package com.isartdigital.operationaaa.game.leveldesign;

import com.isartdigital.operationaaa.game.leveldesign.Cell;
import com.isartdigital.operationaaa.game.leveldesign.GameObjectSetter;
import com.isartdigital.operationaaa.game.leveldesign.KillZoneDynamicSetter;
import com.isartdigital.operationaaa.game.leveldesign.UpgradeSetter;
import com.isartdigital.operationaaa.game.planes.ScrollingPlane;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.*;
import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeFire;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeJump;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeMagnet;
import com.isartdigital.operationaaa.game.sprites.collectables.UpgradeShield;
import com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemyBomb;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemyFire;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemySpeed;
import com.isartdigital.operationaaa.game.sprites.enemies.EnemyTurret;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.operationaaa.game.sprites.walls.Destructible;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.operationaaa.ui.CheatPanel;
import com.isartdigital.operationaaa.ui.GraphicLoader;
import com.isartdigital.operationaaa.ui.UIManager;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.events.LoaderEvent;
import com.isartdigital.utils.game.Camera;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.loader.Loader;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.system.DeviceCapabilities;
import haxe.Timer;
import js.Browser;
import pixi.display.Sprite;

	
/**
 * Classe servant à charger les niveaux
 * @author Benjamin PAGEAUD, Cyprien LARROUY
 */
class LevelLoader {

	// =======================##### VARIABLES ET FONCTIONS STATIQUES #####=======================
	
	/**
	 * PATHS
	 */
	private static inline var LEVELPATH:String = "levels/";
	private static inline var PATH_TO_SPRITE_CLASSES:String = "com.isartdigital.operationaaa.game.sprites.";
	private static inline var PLATFORMS_PATH:String = "platforms.";
	private static inline var ENEMIES_PATH:String   = "enemies.";
	private static inline var WALLS_PATH:String     = "walls.";
	private static inline var COLLECTABLES_PATH:String  = "collectables.";
	private var PLAYER_PATH:String  = "";
	
	/**
	 * Types
	 */
	static public inline var BRIDGE_LEFT		: String = 'BridgeLeft';
	static public inline var BRIDGE_RIGHT		: String = 'BridgeRight';
	static public inline var PLATFORM_0			: String = 'Platform0';
	static public inline var PLATFORM_1			: String = 'Platform1';
	static public inline var LIMIT_LEFT			: String = 'LimitLeft';
	static public inline var LIMIT_RIGHT		: String = 'LimitRight';
	static public inline var WALL_0				: String = 'Wall0';
	static public inline var WALL_1				: String = 'Wall1';
	static public inline var WALL_2				: String = 'Wall2';
	static public inline var WALL_3				: String = 'Wall3';
	static public inline var GROUND				: String = 'Ground';
	static public inline var DESTRUCTIBLE		: String = 'Destructible';
	static public inline var COLLECTABLE		: String = 'Collectable';
	static public inline var UPGRADE_FIRE		: String = 'UpgradeFire';
	static public inline var UPGRADE_JUMP		: String = 'UpgradeJump';
	static public inline var UPGRADE_SHIELD		: String = 'UpgradeShield';
	static public inline var UPGRADE_MAGNET		: String = 'UpgradeMagnet';
	static public inline var ENEMY_FIRE			: String = 'EnemyFire';
	static public inline var ENEMY_SPEED		: String = 'EnemySpeed';
	static public inline var ENEMY_ENEMY_BOMB	: String = 'EnemyBomb';
	static public inline var ENEMY_TURRET		: String = 'EnemyTurret';
	static public inline var KILLZONE_STATIC	: String = 'KillZoneStatic';
	static public inline var KILLZONE_DYNAMIC	: String = 'KillZoneDynamic';
	static public inline var CHECKPOINT			: String = 'Checkpoint';
	static public inline var ENDCHECKPOINT		: String = 'EndLevelCheckpoint';
	static public inline var PLAYER				: String = 'Player';
	
	/**
	 * ClassNames
	 */
	static public var setters (default, null): Map<String, Dynamic> = [
		BRIDGE_LEFT			=> PlatformSetter,
		BRIDGE_RIGHT		=> PlatformSetter,
		PLATFORM_0			=> PlatformSetter,
		PLATFORM_1			=> PlatformSetter,
		LIMIT_LEFT			=> WallSetter,
		LIMIT_RIGHT			=> WallSetter,
		WALL_0				=> WallSetter,
		WALL_1				=> WallSetter,
		WALL_2				=> WallSetter,
		WALL_3				=> WallSetter,
		GROUND				=> WallSetter,
		DESTRUCTIBLE		=> WallSetter,
		COLLECTABLE			=> CollectableSetter, 
		UPGRADE_FIRE		=> UpgradeSetter, 
		UPGRADE_JUMP		=> UpgradeSetter, 
		UPGRADE_SHIELD		=> UpgradeSetter, 
		UPGRADE_MAGNET		=> UpgradeSetter, 
		ENEMY_FIRE			=> EnemySetter,
		ENEMY_SPEED			=> EnemySetter,
		ENEMY_ENEMY_BOMB	=> EnemySetter,
		ENEMY_TURRET		=> EnemySetter, 
		KILLZONE_STATIC		=> KillZoneStaticSetter,
		KILLZONE_DYNAMIC	=> KillZoneDynamicSetter,
		CHECKPOINT			=> CheckpointSetter,
		ENDCHECKPOINT		=> CheckpointSetter,
		PLAYER				=> PlayerSetter
	];
	
	public var soundLevel:String = "";
	
	/**
	 * instance unique de la classe LevelManager
	 */
	private static var instance: LevelLoader;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): LevelLoader {
		if (instance == null) instance = new LevelLoader();
		return instance;
	}

	// =======================##### VARIABLES #####=======================
	
	private var currentLevelId: Int;
	
	public var levelObjectsList: Map<String, GameObjectSetter>;
	
	public var levelMap: Array<Array<Cell>>;
	
	public var pools: Dynamic;
	
	/**
	 * Infos du level : on charge la sauvegarde puis on modifie ce tableau au fil du jeu.
	 * Contient levelId (Int), upgradeCollected (Bool), collectables (Array<Bool>);
	 */
	public var currentSavedData (get, null): Map<String, Dynamic>;	
	
	
	
	// =======================##### FONCTIONS #####=======================
	
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {}
	
	
	/**
	 * Lance le chargement des assets d'un niveau en passant son id
	 * @param	pLevelNumber (défaut = 1)
	 */
	public function load (pLevelNumber: Int):Void {
		
		currentLevelId = pLevelNumber;
		getPathPlayer();
		
		var lLoader:Loader = new Loader();
		
		lLoader.addTxtFile(LEVELPATH + currentLevelId + '/level.json');
		lLoader.addTxtFile(LEVELPATH + currentLevelId + '/pools.json');
		lLoader.addTxtFile(LEVELPATH + currentLevelId + '/anchors_graphics.json');
		
		lLoader.addAssetFile(LEVELPATH + currentLevelId + '/backgrounds.json');
		lLoader.addAssetFile(LEVELPATH + currentLevelId + '/graphics.json');

		lLoader.addAssetFile('characters/enemies/KillZoneDynamic.json');
		lLoader.addAssetFile('collectables/Collectable.json');
		lLoader.addAssetFile('characters' + PLAYER_PATH + '/player.json');
		
		lLoader.addEventListener(LoaderEvent.PROGRESS, onLoadProgress);
		lLoader.addEventListener(LoaderEvent.COMPLETE, onLoadComplete);
		
		// affiche l'écran de préchargement
		UIManager.getInstance().openScreen(GraphicLoader.getInstance());
		
		lLoader.load();
	}
	
	
	/**
	 * transmet les paramètres de chargement au préchargeur graphique
	 * @param	pEvent evenement de chargement
	 */
	private function onLoadProgress (pEvent:LoaderEvent): Void {
		GraphicLoader.getInstance().update(pEvent.data.loaded / pEvent.data.total);
	}
	
		
	/**
	 * Une fois le chargement des Assets terminé, on prépare le tableau du LD
	 * @param	pEvent
	 */
	private function onLoadComplete (pEvent: LoaderEvent): Void {
		
		
		//trace("Level Manager loaded successfully Level " + currentLevel);
		
		
		// = 1. Chargement des TEXTURES, du JSON de LevelDesign et de la Sauvegarde
		StateGraphic.clearTextures(Loader.getContent(LEVELPATH + currentLevelId + '/graphics.json'));
		StateGraphic.clearTextures(Loader.getContent('characters' + PLAYER_PATH + '/player.json'));
		StateGraphic.clearTextures(Loader.getContent('characters/enemies/KillZoneDynamic.json'));
		
		StateGraphic.addTextures(Loader.getContent(LEVELPATH + currentLevelId + '/graphics.json'));
		StateGraphic.addTextures(Loader.getContent('characters' + PLAYER_PATH + '/player.json'));
		StateGraphic.addTextures(Loader.getContent('characters/enemies/KillZoneDynamic.json'));
		
		StateGraphic.addAnchors(Loader.getContent('anchors_graphics.json', Config.jsonPath + LEVELPATH + currentLevelId + '/'));
		
		var jsonObjectsList:Dynamic = Loader.getContent('level.json', Config.jsonPath + LEVELPATH + currentLevelId + '/').objects;
		var jsonLevelMap:Dynamic = Loader.getContent('level.json', Config.jsonPath + LEVELPATH + currentLevelId + '/').leveldesign;
		
		getSavedGame();
		
		
		// = 2. CREATION DE LA LISTE DES OBJETS du LD
		
		levelObjectsList = new Map<String, GameObjectSetter>();
		var lSetter: GameObjectSetter;
		var lCollectablesCount: Int = 0;
		var lAlreadyCollected: Int = 0;
		
		for (lJsonObject in Reflect.fields(jsonObjectsList)) {
			//trace(lJsonObject); //instanceMachin
			// On récupère la classe qualifiée avec le path spécifique grace au champ 'type' de l'objet json
			var lClass:Class<Dynamic> = getClassFromString(Reflect.field(jsonObjectsList, lJsonObject).type); 
			
			// Si classe non trouvée, on empêche pas le loading du level mais on affiche une erreur
			if (lClass == null) {
				Debug.error("Impossible de trouver " + Reflect.field(jsonObjectsList, lJsonObject).type + " \n Oubli d'import | mauvais path | classe inexistante");
				continue; //passe à l'itération suivante sans exécuter la fin de l'itération courante
			}
			
			// Sinon si on a bien trouvé la classe, on créé le setter d'objet qu'on ajoute à lObjectsList
			var lSetterClass: Dynamic = setters[Reflect.field(jsonObjectsList, lJsonObject).type];
			lSetter = Type.createInstance(lSetterClass, [Reflect.field(jsonObjectsList, lJsonObject), lClass, lJsonObject]);
			
				// Si c'est un collectable on met-à-jour son état en fonction de la sauvegarde
			if (lSetter.type == COLLECTABLE) {
				
				lCollectablesCount++;
				if(currentSavedData['collectables'].get(lSetter.id) != null) {
					
					cast(lSetter, CollectableSetter).alreadyCollected = currentSavedData['collectables'].get(lSetter.id);
					if (cast(lSetter, CollectableSetter).alreadyCollected) {
						lAlreadyCollected++;
					}
				}
			}
			
			
			levelObjectsList.set(lJsonObject, lSetter);
		}
		currentSavedData['collected'] = lAlreadyCollected;
		currentSavedData['total'] = lCollectablesCount;
		
		// = 3. CREATION DE LA MAP DES OBJETS DU LD
		
		var lJsonCol: Dynamic;
		var lJsonCell: Dynamic;
		levelMap = new Array<Array<Cell>>();
		var lCell: Cell;
		
		for (col in Reflect.fields(jsonLevelMap)) {
			
			lJsonCol = Reflect.field(jsonLevelMap, col);
			levelMap[Std.parseInt(col)] = [];
			
			for (row in Reflect.fields(lJsonCol)) {
				
				lJsonCell = Reflect.field(lJsonCol, row);
				
				lCell = new Cell ();
				for (i in Reflect.fields(lJsonCell)) {
					
					lCell.add(Reflect.field(lJsonCell, i));
				}
				
				levelMap[Std.parseInt(col)][Std.parseInt(row)] = lCell;
			}
		}
		
		//Getting Pool.json
		pools = Loader.getContent('pools.json', Config.jsonPath + LEVELPATH + currentLevelId + '/');
		
		//Lancement du son
		soundLevel = "level_music" + currentLevelId;
		SoundManager.getSound(soundLevel).play();
		
		// = 5. Lancement de la partie
		GameManager.getInstance().start(currentLevelId);
	}
	
	
	/**
	 * Transforms a string className into a qualified classname with path.
	 * @param	pType the 'rough' className of the object
	 * @return the proper ClassName including specific path
	 */
	private function getClassFromString (pType: String): Class<Dynamic> {
			
			//Classe du GameObject
			var pathToClass:String = PATH_TO_SPRITE_CLASSES;
			
			if (pType.indexOf("Platform") != -1 || pType.indexOf("Bridge") != -1) {
				pathToClass += PLATFORMS_PATH + "Platform";
			} 
			else if (pType.indexOf("Wall") != -1 || pType.indexOf("Limit") != -1 || pType == "Ground") {
				pathToClass += WALLS_PATH + "Wall";
			} 
			else if (pType.indexOf("Enemy") != -1 || pType.indexOf("KillZone") != -1) {
				pathToClass += ENEMIES_PATH + pType;
			} 
			else if (pType == "Destructible") {
				pathToClass += WALLS_PATH + pType;
			} 
			else if (pType.indexOf("Collectable") != -1 || pType.indexOf("Upgrade") != -1){
				pathToClass += COLLECTABLES_PATH + pType;
			} else {
				pathToClass += pType;
			}
			
			//Récupération de la classe
			return Type.resolveClass(pathToClass);
	}
	
	
	/**
	 * récupère la Sauvegarde et l'affecte à levelData
	 */
	private function getSavedGame (): Void {
		
		// on récupère la Sauvegarde
		currentSavedData = SaveManager.getInstance().getLevelData(currentLevelId);
		trace(currentSavedData);
		
		// si elle est vide, on créé un modèle
		if (!currentSavedData.exists('collectables')) {
			trace('[LevelLoader.getSavedGame] No Saved Game detected. About to create a new Save.');
			currentSavedData = new Map<String, Dynamic>();
			currentSavedData.set('upgrade', false); //GamePlane.getInstance().totalCollectablesInLD
			currentSavedData.set('collectables', new Map<String, Dynamic>());
			currentSavedData.set('total', 0);
			//trace('[GameManager.checkSavedGame] Currently ' + Collectable.list.length + ' collectables exists in the level');
		}
	}


	/**
	 * enregistre dans la sauvegarde 'vive' (variable currentSavedData du LevelManager) le fait qu'un collectable a été ramassé.
	 * @param	pId l'id du Collectable
	 */
	public function recordCollectablePickUp (pId: String): Void {
		
		cast(currentSavedData['collectables'], Map<String, Dynamic>)[pId] = true;
		//trace(currentSavedData);
	}
	
	/**
	 * enregistre dans la sauvegarde 'vive' (variable currentSavedData du LevelManager) le fait que l'upgrade du niveau a été ramassé.
	 */
	public function recordUpgradeForCurrentLevel (): Void {
		
		currentSavedData['upgrade'] = true;
		trace(currentSavedData);
	}
	
	
	/**
	 * convert the Object into a GameObject using a safe cast.
	 * @param	pObject must extends GameObject
	 * @return pObject casted to GameObject
	 */
	private function convertToGameObject (pObject: Dynamic): GameObject {

		trace("GameObject" + pObject.type);
		return cast(pObject, GameObject);
	}
	
	/**
	 * Définit le bon chemin de Texture en fonction de l'upgrade
	 * @author Cindy Asselin de Beauville
	 * Note de Cyprien : risque de ne pas marcher pour le moment car à cet instant, au premier level cliqué depuis le lancement du programme, les data ne sont pas encore chargées.
	 * Peut-être plus aller chercher l'info dans le SaveManager. (SaveManager.getInstance().playerHasShield, playerHasSuperShoot à coder)
	 */
	private function getPathPlayer():Void {
		if (playerHasUpgrade('Shield') && playerHasUpgrade('PowerShoot')) {
			PLAYER_PATH = "/ShieldAndPowerShoot";
			//trace('upgrade power shoot + shield loaded');
		}
		else if (playerHasUpgrade('PowerShoot')) {
			PLAYER_PATH = "/PowerShoot";
			//trace('upgrade power shoot');
			
		}
		else if (playerHasUpgrade('Shield')) {
			PLAYER_PATH = "/Shield";
			//trace('upgrade shield loaded');
		} else {
			//trace(' no specific upgrade loaded');
		}
	}
	
	/**
	 * retourne true/false pour l'upgrade passé en paramètre en fonction de la sauvergarde courante
	 * @param	pUpgrade l'upgrade en question parmi 'Shield', 'PowerShoot', 'Magnet', 'DoubleJump'
	 */
	public function playerHasUpgrade(pUpgrade: String): Bool {
		if (pUpgrade == 'PowerShoot') return SaveManager.getInstance().levelsData[1]['upgrade'];
		else if (pUpgrade == 'DoubleJump') return SaveManager.getInstance().levelsData[2]['upgrade'];
		else if (pUpgrade == 'Shield') return SaveManager.getInstance().levelsData[3]['upgrade'];
		else if (pUpgrade == 'Magnet') return SaveManager.getInstance().levelsData[4]['upgrade'];
		else return null;
	}
	
	
	public function getCurrentLevelData (): Map <String, Dynamic> {
		
		var lCollectablesCount: Int = 0;
		var lPickedUpCollectablesCount: Int = 0;
		
		for (lSetter in levelObjectsList) {
			
			if (lSetter.type == COLLECTABLE) {
				
				lCollectablesCount++;
				
				if(currentSavedData['collectables'].get(lSetter.id) != null) {
					if (cast(currentSavedData['collectables'], Map<String, Dynamic>).get(lSetter.id)) {
						lPickedUpCollectablesCount++;
					}
				}
			}
		}
		
		currentSavedData['collected'] = lPickedUpCollectablesCount;
		currentSavedData['total'] = lCollectablesCount;
		
		return currentSavedData;
	}
	
	/**
	 * Detruit le niveau actuel
	 */
	public function destroyCurrentLevel():Void {
		trace('\n\n===> Début de la destruction du niveau ' + Date.now().getTime());
		
		
		for (lObject in Wall.list) lObject.destroy();
		for (lObject in Platform.list) lObject.destroy();
		for (lObject in KillZoneDynamic.list) lObject.destroy();
		for (lObject in KillZoneStatic.list) lObject.destroy();
		for (lObject in Collectable.list) lObject.destroy();
		for (lObject in Checkpoint.list) lObject.destroy();
		for (lObject in Checkpoint.inactiveList) lObject.destroy();
		for (lObject in Enemy.list) lObject.destroy();
		for (lObject in Upgrade.list) lObject.destroy();
		
		for (i in 0...Shoot.list.length) {
			for (j in 0...Shoot.list[i].length) Shoot.list[i][j].destroy();
		}
		
		Wall.list = new Map<String, StateGraphic>();
		Platform.list = new Map<String, StateGraphic>();
		KillZoneDynamic.list = new Map<String, StateGraphic>();
		KillZoneStatic.list = new Map<String, StateGraphic>();
		Collectable.list = new Map<String, StateGraphic>();
		Checkpoint.list = new Map<String, StateGraphic>();
		Checkpoint.inactiveList = new Map<String, StateGraphic>();
		Enemy.list = new Map<String, StateGraphic>();
		Upgrade.list = new Map<String, StateGraphic>();
		Shoot.list = [[], []];
		
		Player.getInstance().unset();
		
		PoolManager.getInstance().clear();
		
		levelObjectsList = null;
		levelMap = null;
		
		
		GameManager.getInstance().background.destroy();
		GameManager.getInstance().backgroundTransparent.destroy();
		
		trace('\n\n===> Fin de la destruction du niveau ' + Date.now().getTime());
	}

	
	/**
	 * détruit l'instance unique du LevelManager et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}
	
	
	
	// =======================##### GETTERS & SETTERS #####=======================	
	
	
	private function get_currentSavedData (): Map<String, Dynamic> {
		return currentSavedData;
	}	
	

}