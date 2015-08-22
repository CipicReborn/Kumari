package com.isartdigital.operationaaa.game.leveldesign;

import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.Checkpoint;
import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
import com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.operationaaa.ui.hud.Hud;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.system.DeviceCapabilities;
import haxe.Serializer;
import js.Browser;
import pixi.display.DisplayObject;
import pixi.geom.Rectangle;

	
/**
 * Classe centrale pour la manipulation des briques de gameplay inGame.
 * Gère la liste des objets totale du niveau, les listes statiques de chaque classe, interagit avec le Pooling et le GamePlane pour faire les addChild.
 * @author Cyprien LARROUY
 */
class LevelManager {
	
	// INTERFACE
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): LevelManager {
		if (instance == null) instance = new LevelManager();
		return instance;
	}
	/**
	 * nombre total de collectables dans le LevelDesign du level
	 */
	public var totalCollectablesInLD: Int;		
	/**
	 * Largeur du level en pixels
	 */
	public var levelWidthInPixels:Int;
	/**
	 * Hauteur du level en pixels
	 */
	public var levelHeightInPixels:Int;
	/**
	 * Fonction -> contient doCheckClipping ou bien dontCheckClipping
	 */
	public var checkClipping: Dynamic;
	
	
	/**
	 * Initialisation :
	 * - Initialisation du GamePlane
	 * - Récupération du Level chargé par le Loader et création d'un point de retour
	 * - Map pour le clipping
	 * - Setup du Player dans le niveau
	 * - Initialisation des Pools
	 * - Compte et Setup des collectibles
	 */
	public function init (){
		
		Wall.list = new Map<String, StateGraphic>();
		Platform.list = new Map<String, StateGraphic>();
		KillZoneDynamic.list = new Map<String, StateGraphic>();
		KillZoneStatic.list = new Map<String, StateGraphic>();
		Collectable.list = new Map<String, StateGraphic>();
		Checkpoint.list = new Map<String, StateGraphic>();
		Enemy.list = new Map<String, StateGraphic>();
		
		var lTimer: Float = Date.now().getTime();
		trace('\n\n===> Début de l\'initialisation du niveau : ' + lTimer);
		
		GamePlane.getInstance().init();
		GameStage.getInstance().getGameContainer().addChild(GamePlane.getInstance());
		
		trace('... Copying ObjectList from Saved Data');
		objectsList = createNewListFrom(LevelLoader.getInstance().levelObjectsList);
		lastCheckpoint = createNewListFrom(objectsList);
		
		mapWidth = LevelLoader.getInstance().levelMap.length;
		mapHeight = LevelLoader.getInstance().levelMap[0].length;
		levelWidthInPixels = mapWidth * gridSize;
		levelHeightInPixels = mapHeight * gridSize;
		trace('...Calculating Map Size : ' + mapWidth + ' Columns x ' + mapHeight + ' Rows');
		trace('...Calculating Map Size : ' + levelWidthInPixels + ' px x ' + levelHeightInPixels + ' px');
		if (levelHeightInPixels > (12 * 560)) {
			Debug.warn('ATTENTION VOUS DEVEZ LOADER UN JSON DE NIVEAU NON SUPéRIEUR à ' + (12 * 560) + ' px');
		}
		remapLevel();
		
		trace('... Creating Player');
		objectsList.get('player').setupGameObject(); // indispensable pour poser le joueur aux bonnes cooordonnées avant de setPosition la Camera
		
		initPools(LevelLoader.getInstance().pools);
		
		// Compte des Collectables dans la totalité du niveau
		totalCollectablesInLD = 0;
		for (lObject in objectsList) {
			if (lObject.type == "Collectable") {
				totalCollectablesInLD++;
			}
		}
		trace('... ' + totalCollectablesInLD + ' Collectables counted in the Level');
		
		
		//checkClipping
		checkClipping = doCheckClipping;
		
		var lTimer2: Float = Date.now().getTime();
		trace('\n\n===> Fin de l\'initialisation du niveau : ' + lTimer2 + ', soit ' + (lTimer2 - lTimer) + ' ms.');
		
		//pour debug
		Debug.warn('LevelManager.init : variables globales à commenter ici');
		untyped Browser.window.objectsList = objectsList;
		untyped Browser.window.levelMap = levelMap;
		untyped Browser.window.Collectables = Collectable.list;
		untyped Browser.window.Upgrades = Upgrade.list;
		
	}
	

	/**
	 * Enregistre les objets présents dans le niveau dans la liste lastCheckpoint
	 */
	public function setLastCheckpoint (): Void {
		lastCheckpoint = createNewListFrom(objectsList);
		trace('object List saved');
	}
	
	/**
	 * Remet la liste courante au dernier checkpoint, remapLevel et populateScreen
	 */
	public function reloadLevelAtLastCheckpoint (): Void {
		objectsList = createNewListFrom(lastCheckpoint);
		remapLevel();
		populateScreen();
		
		var lCount:Int = 0;
		for (lObject in objectsList) {
			if(lObject.type == LevelLoader.COLLECTABLE)lCount++;
		}
		Hud.getInstance().collectibleCount = totalCollectablesInLD -  lCount;
		trace("LCount : " + lCount, " totalCollectibles : " + totalCollectablesInLD);
	}

	/**
	 * Active le mode CheckClipping
	 */
	public function setModeCheckClipping(): Void {
		//trace('Clipping Enabled');
		checkClipping = doCheckClipping;
	}
	
	/**
	 * Désactive le mode CheckClipping
	 */
	public function setModeDontCheckClipping(): Void {
		//trace('Clipping Disabled');
		checkClipping = dontCheckClipping;
	}
	
	/**
	 * Déclippe tous les objets sauf le player et repositionne le visible a la caméra.
	 * A appeller imémdiatement après un setPosition de la Camera
	 */
	public function populateScreen (): Void {
		
		trace('Populating Screen...');
		
		
		//– Tout retirer de la displayList
		unclipEntireMap();
		//clipObject(objectsList.get('player'));
		//– déterminer la colonne et la ligne du focus de la caméra
		//– déduire l'index
		//		» des colonnes gauche, droite
		//		» des lignes haut,bas
		
		calculateScreenAndClippingLimits();
		
		//– Construire l'ensemble de l'écran à partir des éléments contenus dans les Cell
		var lToClip: Map<String, GameObjectSetter> = new Map<String, GameObjectSetter>();
		var lCellContent: Array<String>;
		var j: Int;
		var lLength: Int;
		var lInstanceName: String;
		
		for (col in leftColumn...rightColumn + 1) {
			for (row in topRow...bottomRow + 1) {
				
				lCellContent = levelMap[col][row].content;
				lLength = lCellContent.length;
				//trace(lCellContent);
				for (i in 0...lLength) {
					j = lLength - 1 - i;
					lInstanceName = lCellContent[j];
					if (objectsList.get(lInstanceName) == null) { 
						if (lInstanceName == null) trace('WARNING: you are trying to remove an Object with no Id');
						else {
							lCellContent.splice(j , 1);
							//trace(lInstanceName + ' has previously been removed from Level. It will not be mapped in cell [' + col + '][' + row + '] anymore.');
						}
					}
					else lToClip.set(lInstanceName, objectsList.get(lInstanceName));
				}
			}
		}
		/*
		for (lGoG in lToClip) {
			trace(lGoG.type);
		}
		*/
		clipObjects(lToClip);
		trace('... Screen Populated');
	}
	
	/**
	 * Enlève dynamiquement un objet du niveau (ennemi tué, collectable ramassé)
	 * @param	pObject
	 */
	public function removeFromLevel(pObject: StateGraphic): Void {
		
		var lId: String = pObject.id;
		unclipObject(pObject);
		if (lId == null) trace ('WARNING: you are trying to remove an Object with no Id');
		if (!objectsList.remove(lId)) trace ('ERROR: removal of Object ' + lId + ' has failed.');
		//else trace ('LevelManager to ' + lId + ' : Removal complete !');
	}
	
	/**
	 * Détruit le plan de jeu ainsi que tous les objets du niveau
	 */
	public function destroyLevel(): Void {
		
		GamePlane.getInstance().destroy();
		LevelLoader.getInstance().destroyCurrentLevel();
	}
	
	/**
	 * détruit l'instance unique du Level Manager et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}
	
	
	
	
	
	// IMPLEMENTATION
	
	
	
	
	
	// =======================##### ATTRIBUTS ET METHODES STATIQUES #####=======================
	/**
	 * instance unique de la classe LevelManager
	 */
	private static var instance: LevelManager;
	
	
	
	// =======================##### ATTRIBUTS #####=======================

	/**
	 * La liste de tous les objets de jeu présents dans le niveau à un moment donné.
	 */
	private var objectsList: Map<String, GameObjectSetter>;
	
	/**
	 * La map du niveau en fonction d'une grille virtuelle 280x280
	 */
	private var levelMap: Array<Array<Cell>>;
	/**
	 * le pas de la grille virtuelle de clipping
	 */
	private var gridSize: Int = 280;
	/**
	 * La largeur max sur laquelle le jeu s'affiche
	 */
	private var GRAPHIC_ZONE_WIDTH: Int = 2430;
	/**
	 * La hauteur max surlaquelle le jeu s'affiche
	 */
	private var GRAPHIC_ZONE_HEIGHT: Int = 1536;
	/**
	 * marge horizontale à laquelle les objets sont clippés/déclippés
	 */
	private var horizontalClippingMargin: Int =  1120; // 1120;
	/**
	 * marge verticale à laquelle les objets sont clippés/déclippés
	 */
	private var verticalClippingMargin: Int =  560; // 560;
	/**
	 * l'index de la colonne de Clipping la plus à gauche
	 */
	private var leftColumn: Int = 0;
	/**
	 * l'index de la colonne de Clipping la plus à droite
	 */
	private var rightColumn: Int = 0;
	/**
	 * l'index de la ligne de Clipping la plus haute
	 */
	private var topRow: Int = 0;
	/**
	 * l'index de la ligne de Clipping la plus basse
	 */
	private var bottomRow: Int = 0;
	/**
	 * l'index de la colonne de Clipping la plus à gauche à la frame d'avant
	 */
	private var previousLeftColumn: Int = 0;
	/**
	 * l'index de la colonne de Clipping la plus à droite à la frame d'avant
	 */
	private var previousRightColumn: Int = 0;
	/**
	 * l'index de la ligne de Clipping la plus haute à la frame d'avant
	 */
	private var previousTopRow: Int = 0;
	/**
	 * l'index de la ligne de Clipping la plus basse à la frame d'avant
	 */
	private var previousBottomRow: Int = 0;
	
	/**
	 * Le rectangle représentant l'écran dans le repère du GamePlane
	 */
	private var screenRect:Rectangle;
	

	
	/**
	 * Liste des objets au dernier checkpoint
	 */
	private var lastCheckpoint: Map<String, GameObjectSetter>;
	
	private var mapWidth: Int;
	private var mapHeight: Int;

	
	// =======================##### METHODES #####=======================
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {}
	
	
	// =============# INIT #=============
	
	/**
	 * Copie une liste de GameObjectSetters (Map<String, GameoObjectSetter>) et renvoie la nouvelle liste.
	 * @param	pList
	 * @return
	 */
	private function createNewListFrom (pList: Map<String, GameObjectSetter>): Map<String, GameObjectSetter> {
		var lList: Map<String, GameObjectSetter> = new Map<String, GameObjectSetter> (); 
		for (lSetter in pList) {
			lList.set(lSetter.id, lSetter);
		}
		return lList;
	}
	
	
	/**
	 * recrée levelMap en fonction de objectsList (pour un checkPoint on ne peut pas repoartir du json)
	 */
	private function remapLevel (): Void {
		trace('... Creating Clipping Map');
		//trace("mapWidth : " + mapWidth, "mapHeight : " + mapHeight);
		levelMap = [];
		for (i in 0...mapWidth) {
			levelMap[i] = [];
			for (j in 0...mapHeight) {
				levelMap[i][j] = new Cell();
			}
		}
		for (lSetter in objectsList) {
			if (lSetter.id == 'player') continue;
			for (lCoords in lSetter.cells) {
				//trace(untyped lCoords.x);
				//trace(untyped lCoords.y);
				//trace("X : " + untyped lCoords.x, "Y : " + untyped lCoords.y);
				levelMap[untyped lCoords.x][untyped lCoords.y].add(lSetter.id);
			}
		}
	}
	
	
	/**
	 * Créé les objets demandés.
	 * @param	pPools
	 */
	private function initPools (pPools: Dynamic): Void {
		trace('... Creating Pools');
		for (lType in Reflect.fields(pPools)) {
			var lCount: Int = Reflect.field(pPools, lType);
			trace('Creating ' + lCount + ' ' + lType + 's');
			for (i in 0...lCount) {
				if (lType != 'Player') PoolManager.getInstance().createStateGraphic(lType);
			}
		}
	}
	

	
	// =============# CLIPPING #=============
	
	
	/**
	 * Déclip levelMap sauf le Player
	 */
	private function unclipEntireMap (): Void {
		trace('... Unclipping Level');
		var lToUnclip: Map<String, GameObjectSetter> = new Map<String, GameObjectSetter>();
		var lCellContent: Array<String>;
		
		for (col in 0...mapWidth) {
			for (row in 0...mapHeight) {
				lCellContent = levelMap[col][row].content;
				for (lInstanceName in lCellContent) {
					if (objectsList[lInstanceName].inGameInstance == null) continue;
					if (lInstanceName == 'player') continue;
					//trace('about to clean ' + objectsList[lInstanceName].id + ' of ' + objectsList[lInstanceName].type);
					unclipObject(objectsList[lInstanceName].inGameInstance);
				}
			}
		}
		//unclipObjects(lToUnclip);

		
		
		var lCount = 0;
		for (lObject in Wall.list) {
			trace(lObject.id + ' of Wall List');
			lCount++;
		}
		for (lObject in Platform.list) {
			trace(lObject.id + ' of Platform List');
			lCount++;
		}
		for (lObject in Enemy.list) {
			trace(lObject.id + ' of Enemy List');
			lCount++;
		}
		for (lObject in KillZoneStatic.list) {
			trace(lObject.id + ' of KZ Static List');
			lCount++;
		}
		for (lObject in KillZoneDynamic.list) {
			trace(lObject.id + ' of KZ Dynamic List');
			lCount++;
		}
		for (lObject in Checkpoint.list) {
			trace(lObject.id + ' of Checkpoint List');
			lCount++;
		}
		for (lObject in Collectable.list) {
			trace(lObject.id + ' of Collectable List');
			lCount++;
		}
		trace(lCount + ' objects remaining in the lists');
	}
	
	
	/**
	 * A appeler immédiatement après un move de la Camera pour clipper/declipper les objets
	 */
	private function doCheckClipping (): Void {
		//trace('Checking clipping...');
		calculateScreenAndClippingLimits();
		
		var lToClip: Map<String, GameObjectSetter> = new Map<String, GameObjectSetter>();
		var lToUnclip: Map<String, GameObjectSetter> = new Map<String, GameObjectSetter>();
		var lCellContent: Array<String>;

		// ## LEFT COLUMN
		// si on se déplace vers la droite, il va falloir déclipper ce qui sort
		if (leftColumn > previousLeftColumn) {
			
			// Déroulement :
			// - On remplit ToUnclip avec les objets mappés dans la colonne sortie entre les index previousTopRow et previousBottomRow
			// - On corrige en supprimant les objets mappés dans la nouvelle colonne de gauche entre les index previousTopRow et previousBottomRow
			populateClippingListByColumns(lToUnclip, previousLeftColumn, leftColumn, previousTopRow, previousBottomRow);
			
		}
		// si on se déplace vers la gauche il va falloir clipper ce qui entre
		else if (leftColumn < previousLeftColumn) {
			
			// Déroulement :
			// - On remplit ToClip avec les objets mappés dans la colonne entrée entre les index topRow et bottomRow
			// - On corrige en supprimant les objets déjà mappés dans l'ancienne colonne de gauche entre les index topRow et bottomRow
			populateClippingListByColumns(lToClip, leftColumn, previousLeftColumn, topRow, bottomRow);
			
		}
		
		// ## RIGHT COLUMN
		// si on se déplace vers la droite, il va falloir clipper ce qui entre
		if (rightColumn > previousRightColumn) {
			
			// Déroulement :
			// - On remplit ToClip avec les objets mappés dans la colonne entrée entre les index topRow et bottomRow
			// - On corrige en supprimant les objets déjà mappés dans l'ancienne colonne de droite entre les index topRow et bottomRow
			populateClippingListByColumns(lToClip, rightColumn, previousRightColumn, topRow, bottomRow);
			
		}
		// si on se déplace vers la gauche il va falloir déclipper ce qui sort
		else if (rightColumn < previousRightColumn) {
			
			// Déroulement :
			// - On remplit ToUnclip avec les objets mappés dans la colonne sortie entre les index previousTopRow et previousBottomRow
			// - On corrige en supprimant les objets encore mappés dans l'ancienne colonne de droite entre les index previousTopRow et previousBottomRow
			populateClippingListByColumns(lToUnclip, previousRightColumn, rightColumn, previousTopRow, previousBottomRow);
			
		}
		
		// ## TOP ROW
		// si on se déplace vers le haut, il va falloir clipper ce qui entre
		if (topRow < previousTopRow) {
			
			// Déroulement :
			// - On remplit ToClip avec les objets mappés dans la ligne entrée entre les index leftColumn et rightColumn
			// - On corrige en supprimant les objets déjà mappés dans l'ancienne ligne du haut entre les index leftColumn et rightColumn.
			populateClippingListByRows(lToClip, topRow, previousTopRow, Std.int(Math.max(leftColumn, previousLeftColumn)), Std.int(Math.min(rightColumn, previousRightColumn)));
			
		}
		// si on se déplace vers le bas il va falloir déclipper ce qui sort
		else if (topRow > previousTopRow) {
			
			// Déroulement :
			// - On remplit ToUnclip avec les objets mappés dans la ligne sortie entre les index previousLeftColumn et previousRightColumn
			// - On corrige en supprimant les objets encore mappés dans l'ancienne ligne du haut entre les index previousLeftColumn et previousRightColumn.
			populateClippingListByRows(lToUnclip, previousTopRow, topRow, Std.int(Math.max(leftColumn, previousLeftColumn)), Std.int(Math.min(rightColumn, previousRightColumn)));
			
		}
		
		// ## BOTTOM ROW
		// si on se déplace vers le haut, il va falloir déclipper ce qui sort
		if (bottomRow < previousBottomRow) {
			
			// Déroulement :
			// - On remplit ToUnclip avec les objets mappés dans la ligne sortie entre les index previousLeftColumn et previousRightColumn
			// - On corrige en supprimant les objets encore mappés dans l'ancienne ligne du haut entre les index previousLeftColumn et previousRightColumn.
			populateClippingListByRows(lToUnclip, previousBottomRow, bottomRow, Std.int(Math.max(leftColumn, previousLeftColumn)), Std.int(Math.min(rightColumn, previousRightColumn)));
			
		}
		// si on se déplace vers le bas il va falloir clipper ce qui entre
		else if (bottomRow > previousBottomRow) {
			
			// Déroulement :
			// - On remplit ToClip avec les objets mappés dans la ligne entrée entre les index leftColumn et rightColumn
			// - On corrige en supprimant les objets déjà mappés dans l'ancienne ligne du haut entre les index leftColumn et rightColumn.
			populateClippingListByRows(lToClip, bottomRow, previousBottomRow, Std.int(Math.max(leftColumn, previousLeftColumn)), Std.int(Math.min(rightColumn, previousRightColumn)));
			
		}
		
		
		// #### Une fois les listes prêtes, on clippe et on déclippe :
		/*
		var lCount: Int = 0;
		for (lGOS in lToClip) {
			lCount++;
			if (lCount == 1) Debug.warn('## New clipping Round');
			trace(lGOS.id + ' of ' + lGOS.type + ' about to be Clipped.');
		}
		if (lCount > 0) trace (lCount + ' objects to be clipped');
		lCount = 0;
		for (lGOS in lToUnclip) {
			lCount++;
			if (lCount == 1) Debug.warn('## New unclipping Round');
			trace(lGOS.id + ' of ' + lGOS.type + ' about to be Unclipped.');
		}
		if (lCount > 0) trace (lCount + ' objects to be declipped');
		*/
		clipObjects(lToClip);
		unclipObjects(lToUnclip);
		//trace('... Clipping Checked');
	}
	
	private function dontCheckClipping(): Void {}
	
	/**
	 * Récupère les coordonnées de l'écran dans le GamePlane et en déduit les coordonnées dans la grille de clipping
	 */
	private function calculateScreenAndClippingLimits (): Void {
		
		screenRect = DeviceCapabilities.getScreenRect(GamePlane.getInstance());
		//trace(screenRect);
		
		// Un rectangle de la taille de la GRAPHIC Zone + la marge, centré sur l'écran du Device
		var lClippingZone: Rectangle = new Rectangle(
			screenRect.x - horizontalClippingMargin + (screenRect.width - GRAPHIC_ZONE_WIDTH)/2,	// x
			screenRect.y - verticalClippingMargin + (screenRect.height - GRAPHIC_ZONE_HEIGHT)/2,	// y
			GRAPHIC_ZONE_WIDTH + 2 * horizontalClippingMargin,										// width
			GRAPHIC_ZONE_HEIGHT + 2 * verticalClippingMargin										// height
		);
		
		// on stocke les anciennes coordonnées de grille de clipping
		previousBottomRow	= bottomRow;
		previousLeftColumn	= leftColumn;
		previousRightColumn	= rightColumn;
		previousTopRow		= topRow;
		
		//on calcule les nouvelles coordonnées de grille de clipping
		leftColumn	= Std.int(Math.floor(Math.floor(lClippingZone.x) / gridSize));
		leftColumn	= Std.int(Math.min(levelMap.length - 1, Math.max(0, leftColumn)));
		
		rightColumn	= Std.int(Math.ceil((Math.floor(lClippingZone.x) + lClippingZone.width) / gridSize) - 1);
		rightColumn	= Std.int(Math.min(levelMap.length - 1, Math.max(0, rightColumn)));
		
		topRow		= Std.int(Math.floor(Math.floor(lClippingZone.y) / gridSize));
		topRow		= Std.int(Math.min(levelMap[0].length - 1, Math.max(0, topRow)));
		
		bottomRow	= Std.int(Math.ceil((Math.floor(lClippingZone.y) + lClippingZone.height) / gridSize) - 1);
		bottomRow	= Std.int(Math.min(levelMap[0].length - 1, Math.max(0, bottomRow)));
		/*
		if (bottomRow != previousBottomRow || topRow != previousTopRow || leftColumn != previousLeftColumn || rightColumn != previousRightColumn) {
			trace('Coordoonées de l\'écran dans la Grille :'
			 + '\n > Gauche - Droite : ' + leftColumn + ' - ' + rightColumn + ','
			 + '\n > Haut - Bas      : ' + topRow + ' - ' + bottomRow);			
		}
		*/
	}
	
	
	/**
	 * Parcourt les colonnes de levelMap pour créer des liste d'objets à clipper ou déclipper.
	 * @param	pColA on ajoute à la liste les objets mappés dans cette colonne et toutes les autres jusqu'a pColB
	 * @param	pColB on enlève de la liste les objets mappés dans cette colonne
	 * @param	pList La liste visée
	 * @param	pRowTop la ligne min de la colonne
	 * @param	pRowBottom la ligne max de la colonne
	 */
	private function populateClippingListByColumns (pList: Map<String, GameObjectSetter>, pAddFromColIndex: Int, pRemoveColIndex: Int, pRowTop: Int, pRowBottom: Int): Void {
		
		//trace('populateClippingListByColumns called with (' + pAddFromColIndex + ', ' + pRemoveColIndex + ', ' + pRowTop + ', ' + pRowBottom + ') as arguments');
		var lCellContent: Array<String>;
		var lLeftColToAdd: Int;
		var lRightColStopToAdd: Int;
		var j: Int; // l'index recalculé pour parcourir les arrays à l'envers. (le array.remove dans une boucle for object in array fait foirer)
		var lLength: Int; // la longueur des arrays à parcourir à l'envers
		
		// sélection des colonnes dans l'intervalle [pAddFromColIndex-pRemoveColIndex[
		if (pAddFromColIndex > pRemoveColIndex) {
			lLeftColToAdd = pRemoveColIndex + 1;
			lRightColStopToAdd = pAddFromColIndex + 1;
		} else {
			lLeftColToAdd = pAddFromColIndex;
			lRightColStopToAdd = pRemoveColIndex;
		}
		
		//trace('adding from ' + lLeftColToAdd + ' to ' + (lRightColStopToAdd - 1));
		// ajout à la liste des objets mappés dans les colonne selectionnées 
		for (lCol in lLeftColToAdd...lRightColStopToAdd) {
			
			for (lRow in pRowTop...(pRowBottom + 1)) {
				lCellContent = levelMap[lCol][lRow].content;
				
				lLength = lCellContent.length;
				for (i in 0...lLength) {
					j = lLength - 1 - i;
					var lInstanceName: String = lCellContent[j];
					//trace(lInstanceName);
					if (objectsList.get(lInstanceName) == null) {
						if (lInstanceName == null) Debug.error('[LevelManager.populateClippingListByColumns] ERROR : you are trying to clip/unclip an object with no id');
						else {
							lCellContent.splice(j , 1);
							//trace(lInstanceName + ' has previously been removed from Level. It will not be mapped in cell [' + lCol + '][' + lRow + '] anymore.');
						}
					}
					else pList.set(lInstanceName, objectsList.get(lInstanceName));
				}
			}
		}

		//trace('removing col ' + pRemoveColIndex);
		// suppression de la liste  des objets mappés dans la colonne B
		for (lRow in pRowTop...(pRowBottom + 1)) {
			lCellContent = levelMap[pRemoveColIndex][lRow].content;
			
			lLength = lCellContent.length;
			for (i in 0...lLength) {
				j = lLength - 1 - i;
				var lInstanceName: String = lCellContent[j];
				//trace(lInstanceName);
				if (objectsList.get(lInstanceName) == null) {
					if (lInstanceName == null) Debug.error('[LevelManager.populateClippingListByColumns] ERROR: you are trying to clip/unclip an Object with no Id');
					else {
						lCellContent.splice(j , 1);
						//trace(lInstanceName + ' has previously been removed from Level. It will not be mapped in cell [' + pRemoveColIndex + '][' + lRow + '] anymore.');
					}
				}
				else if (pList.exists(lInstanceName)) if(!pList.remove(lInstanceName)) Debug.error('Clipping\'s gonna fuck');
				
			}
		}
		/*
		trace('## resume :');
		for (lName in pList.keys()) {
			trace(lName + ' of ' + pList[lName].type);
		}
		*/
	}
	
	/**
	 * Parcourt les lignes de levelMap pour créer des liste d'objets à clipper ou déclipper.
	 * @param	pRowA on ajoute à la liste les objets mappés dans cette ligne et toutes les autres jusqu'a pRowB
	 * @param	pRowB on enlève de la liste les objets mappés dans cette ligne.
	 * @param	pList la liste visée
	 * @param	pLeftCol la colonne min de la ligne
	 * @param	pRightCol la colonne max de la ligne
	 */
	private function populateClippingListByRows (pList: Map<String, GameObjectSetter>, pAddFromRowIndex: Int, pRemoveRowIndex: Int, pLeftCol: Int, pRightCol: Int): Void {
		
		//trace('populateClippingListByRows called with (' + pAddFromRowIndex + ', ' + pRemoveRowIndex + ', ' + pLeftCol + ', ' + pRightCol + ') as arguments');
		var lCellContent: Array<String>;
		var lTopRowToAdd: Int;
		var lBottomRowStopToAdd: Int;
		var j: Int; // l'index recalculé pour parcourir les arrays à l'envers. (le array.remove dans une boucle for object in array fait foirer)
		var lLength: Int; // la longueur des arrays à parcourir à l'envers
		
		// sélection des lignes dans l'intervalle [pAddFromRowIndex-pRemoveRowIndex[
		if (pAddFromRowIndex > pRemoveRowIndex) {
			lTopRowToAdd = pRemoveRowIndex + 1;
			lBottomRowStopToAdd = pAddFromRowIndex + 1;
		} else {
			lTopRowToAdd = pAddFromRowIndex;
			lBottomRowStopToAdd = pRemoveRowIndex;
		}
		
		//trace('adding from ' + lTopRowToAdd + ' to ' + (lBottomRowStopToAdd - 1));
		// ajout à la liste des objets mappés dans les lignes selectionnés
		for (lRow in lTopRowToAdd...lBottomRowStopToAdd) {
			for (lCol in pLeftCol...(pRightCol + 1)) {
				lCellContent = levelMap[lCol][lRow].content;
				
				lLength = lCellContent.length;
				for (i in 0...lLength) {
					j = lLength - 1 - i;
					var lInstanceName: String = lCellContent[j];
					//trace(lInstanceName);
					if (objectsList.get(lInstanceName) == null) {
						if (lInstanceName == null) trace ('WARNING: you are trying to remove an Object with no Id');
						else {
							lCellContent.splice(j , 1);
							//trace(lInstanceName + ' has previously been removed from Level. It will not be mapped in cell [' + lCol + '][' + lRow + '] anymore.');
						}
					}
					else pList.set(lInstanceName, objectsList.get(lInstanceName));
				}
			}
		}
		
		//trace('removing row ' + pRemoveRowIndex);
		// suppression de la liste  des objets mappés dans la ligne B
		for (lCol in pLeftCol...(pRightCol + 1)) {
			lCellContent = levelMap[lCol][pRemoveRowIndex].content;
			
			lLength = lCellContent.length;
			for (i in 0...lLength) {
				j = lLength - 1 - i;
				var lInstanceName: String = lCellContent[j];
				//trace(lInstanceName);
				if (objectsList.get(lInstanceName) == null) {
					if (lInstanceName == null) trace ('WARNING: you are trying to remove an Object with no Id');
					else {
						lCellContent.splice(j , 1);
						//trace(lInstanceName + ' has previously been removed from Level. It will not be mapped in cell [' + lCol + '][' + pRemoveRowIndex + '] anymore.');
					}
				}
				else if (pList.exists(lInstanceName)) if (!pList.remove(lInstanceName)) Debug.error('Clipping\'s gonna fuck');
			}
		}
		/*
		trace('## resume :');
		for (lName in pList.keys()) {
			trace(lName + ' of ' + pList[lName].type);
		}
		*/
	}
	
	/**
	 * Clippe la LISTE de GameObjects
	 * @param	pList
	 */
	private function clipObjects (pList: Map<String, GameObjectSetter>){
		for (lSetter in pList) {
			lSetter.setupGameObject();
		}
	}
	
	/**
	 * Déclippe la LISTE de GameObjects
	 * @param	pList
	 */
	private function unclipObjects (pList: Map<String, GameObjectSetter>) {	
		for (lSetter in pList) {
			
			if (lSetter.inGameInstance == null) {
				Debug.warn('[LevelManager.unclipObjects] : ' + lSetter.id + ' of ' + lSetter.type + ' is about to be unclipped but has no Game Object associated with. (Already Unclipped)');
			}
			else {
				//trace('about to unclip ' + lSetter.id + ' of ' + lSetter.type);
				unclipObject(lSetter.inGameInstance);
			}
		}
	}
	
	
	/**
	 * déclip UN objet du gamePlane
	 * @param	pObject
	*/
	private function unclipObject (pObject: StateGraphic): Void {
		
		//trace('unclipping ' + objectsList.get(pObject.id).type);
		if (objectsList[pObject.id] == null || objectsList[pObject.id].plane == null) Debug.warn('[LevelManager.unclipObject] Issue with ' + Type.getClassName(Type.getClass(pObject)).split(':').pop() + ' ' + pObject.id);
		objectsList[pObject.id].plane.removeChild(pObject);
		PoolManager.getInstance().addToPool(objectsList.get(pObject.id).type, pObject);
		objectsList.get(pObject.id).unset(); // enleve de la liste
		
	}
	

}