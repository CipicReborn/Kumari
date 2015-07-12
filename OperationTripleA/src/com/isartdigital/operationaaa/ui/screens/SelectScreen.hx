package com.isartdigital.operationaaa.ui.screens;

import com.isartdigital.operationaaa.SaveManager;
import com.isartdigital.operationaaa.ui.buttons.ButtonBack;
import com.isartdigital.operationaaa.ui.buttons.LevelSelectionPanel;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.system.DeviceCapabilities;
import com.isartdigital.utils.ui.Screen;
import pixi.display.DisplayObjectContainer;
import pixi.display.Sprite;
import pixi.geom.Point;
import pixi.geom.Rectangle;
import pixi.InteractionData;
import pixi.primitives.Graphics;
import pixi.textures.Texture;

	
/**
 * Principales méthodes de la Classe SelectScreen :
 * 
 * - new : récupère la sauvegarde de l'ordre des niveaux si elle existe, sinon appelle shuffle et enregistre le résultat
 * - shuffle : génère un ordre d'affichage aléatoire pour les niveaux
 * - open : initialise et affiche les 4 panneaux de niveaux en fonction de l'ordre enregistré. (4 instances de la classe ui.buttons.LevelSelectionPanel).
 * - setModeOpenPanel et setMode4Panels : lance le tween des panneaux d'un état a un autre (appelé par les panneaux.onClick ou le bouton back)
 * - doActionMovePanels : repositionne les panneaux sur l'écran au fur et à mesure du tween.
 * @author Cyprien LARROUY & Cindy ASSELIN DE BEAUVILLE
 */
class SelectScreen extends Screen {
	
	/**
	 * instance unique de la classe TestScreen
	 */
	static private var instance: SelectScreen;
	
	/**
	 * nb minimum de Pixels que doit faire la zone cliquable pour un pouce normal sur un petit écran (à régler)
	 */
	static inline var minLevelWidth: Int = 300;
	
	/**
	 * contient les coordonées du rectangle d'affichage disponible (la plus grande portion de GraphicZone disponible)
	 */
	private var screenLimits: Rectangle;
	
	/**
	 * Tableau des panneaux de niveaux dans l'ordre ou ils sont affichés
	 */
	private var levelPanels: Array<LevelSelectionPanel>;
	
	/**
	 * Index du panneau ouvert en plein écran
	 */
	private var currentIndex: Int;
	
	/**
	 * Tableau contenant l'ordre dans lequel afficher les niveaux
	 */
	private var levelSorting: Array<Int>;
	
	/**
	 * Tableau de données sauvegardées
	 */
	private var levelsData: Array<Map<String, Dynamic>>;
	
	/**
	 * Fonction dynamique pour le rafraîchissement de l'écran de Sélection
	 */
	private var doAction: Dynamic;
	
	/**
	 * est à true quand l'écran de selection est dans son état initial (4 panneaux égaux)
	 */
	private var isOnMainScreen:Bool = true;
	
	/**
	 * Bouton Retour et ses Marges de positionnement
	 */
	private var backBtn:ButtonBack;
	private var MARGIN_X:Float = -900;
	private var MARGIN_Y:Float = 600;
	
	/**
	 * tableau des largeurs de panneaux recalculé en fonction des dimensions de l'écran
	 */
	private var levelWidths: Map<String, Float>;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): SelectScreen {
		if (instance == null) instance = new SelectScreen();
		return instance;
	}
	
	
	/**
	 * constructeur privé pour éviter qu'une instance ne soit créée directement
	 */
	private function new() {
		
		super();
		
		// On enregistre de manière statique les noms des niveaux dans la langue configurée
		LevelSelectionPanel.getLocalisedLevelNames();
		
		// initialisation des tableaux qui référencent les 4 panneaux et les 4 rectangle-quides
		levelPanels = [];
		
		levelWidths = [
			"closed" => 0,
			"normal" => 0,
			"open" => 0
		];
		
		doAction = doActionVoid;
		
		// On récupère l'éventuelle sauvegarde
		levelSorting = SaveManager.getInstance().levelSorting;
		//trace(levelSorting);
		
		// S'il n'y a pas de sauvegarde, on tire une fois au hasard l'ordre des niveaux et on fait une sauvegarde
		if (levelSorting == null) {
			
			SaveManager.getInstance().levelSorting = levelSorting = shuffleLevels();
			
		}
		//trace(levelSorting);
	}
	
	
	/**
	 * Retourne un tableau du Random initial des niveaux
	 */
	private function shuffleLevels (): Array<Int> {
		
		var lPool: Array<Int> = [1, 2, 3, 4];
		var lLevelSorting: Array<Int> = [];
		var randomIndex: Int;
		
		for (i in 0...4) {
			randomIndex = Math.floor(Math.random() * lPool.length);
			lLevelSorting.push(lPool[randomIndex]);
			lPool.splice(randomIndex, 1);
		}
		
		//trace("[SelectScreen.shuffleLevels] Initial Levels Shuffle :");
		//trace(lLevelSorting);
		
		return lLevelSorting;
	}
	
	
	/**
	 * Ouverture de l'écran : Affichage des 4 panneaux avec les données
	 */
	override public function open():Void {
		
		super.open();
		SoundManager.getSound("main_music").play();
		
		// calcule la taille d'écran et calcule les largeurs des panneaux
		recordScreenLimits();
		calculateWidths();
		
		// récupération/mise-à-jour des infos sauvegardées
		levelsData = SaveManager.getInstance().levelsData;
		//trace(levelsData);
		
		// Initialise les 4 box des 4 niveaux
		for (i in 0...4) {
			initPanelForLevel(i, levelSorting[i]);
		}
		
		addButton();
		
		// enregistre le SelecScreen en tant qu'écouteur de la gameloop principale
		Main.getInstance().addEventListener(GameEvent.GAME_LOOP, selecLoop);
	}
	
	
	/**
	 * Enregistre dans displayLimits un rectangle représentant la taille de la fenêtre de jeu dans la limite de la hauteur et de la largeur de la Graphic Zone.
	 */
	private function recordScreenLimits (): Void {
		
		var lScreenRectangle: Rectangle = DeviceCapabilities.getScreenRect(this);
		var lTopLeft: Point = new Point(lScreenRectangle.x, lScreenRectangle.y);
		var lBottomRight: Point = new Point(lScreenRectangle.x + lScreenRectangle.width, lScreenRectangle.y + lScreenRectangle.height);
		var lWidth: Float;
		var lHeight: Float;
		
		//Si la fenêtre de jeu est plus grande que la graphic zone, on prend la graphic zone, sinon on prend la taille de la fenêtre de jeu
		if (lTopLeft.x < -1215) lTopLeft.x = -1215;
		if (lTopLeft.y < -768) lTopLeft.y = -768;
		if (lBottomRight.x > 1215) lBottomRight.x = 1215;
		if (lBottomRight.y > 768) lBottomRight.y = 768;
		
		//On calcule la largeur et la hauteur disponible pour l'affichage
		lWidth = lBottomRight.x - lTopLeft.x;
		lHeight = lBottomRight.y - lTopLeft.y;
		
		screenLimits = new Rectangle(lTopLeft.x, lTopLeft.y, lWidth, lHeight);
	};
	
	
	/**
	 * Le but de cette fonction est de précalculer les différentes positions et largeurs possibles pour les panneaux de level en fonction de la taille disponible à l'écran
	 */
	private function calculateWidths (): Void {
		
		// On calcule d'abord les trois tailles de levelPanel : fermé, normal, ouvert
		
		levelWidths["normal"] = screenLimits.width / 4;
		
		if (screenLimits.width * 0.1 < minLevelWidth) {
			
			levelWidths["closed"] = minLevelWidth;
			levelWidths["open"] = screenLimits.width - 3 * minLevelWidth;
		} else {
			
			levelWidths["closed"] = screenLimits.width * 0.1;
			levelWidths["open"] = screenLimits.width * 0.7;
		}
	}
	
	
	/**
	 * Crée et référence un panneau de Niveau, le positionne en fonction de son index, et initialise le masque
	 * @param	pLevel compris entre 1 et 4
	 */
	private function initPanelForLevel (pIndex: Int, pLevel: Int): Void {
		
		// Création et positionnement du panneau du niveau
		var lTotalCollectables: Int = levelsData[pLevel]['total'] == null ? 60 : levelsData[pLevel]['total'];
		var lCollectedCollectables: Int = levelsData[pLevel]['collected'] == null ? 0 : levelsData[pLevel]['collected'];
		
		var lLevelPanel: LevelSelectionPanel = new LevelSelectionPanel(pLevel, levelsData[pLevel]['upgrade'], lCollectedCollectables, lTotalCollectables);
		levelPanels.push(lLevelPanel);
		
		lLevelPanel.x = screenLimits.x + (( 2 * ( pIndex ) + 1 ) / 8 * screenLimits.width);
		lLevelPanel.y = screenLimits.y + screenLimits.height / 2;
		
		// Calcul de la taille du masque en fonction de la taille de l'écran (1/4 de la largeur dans la limite de la Graphic zone)
		lLevelPanel.rectangle = new Rectangle( - screenLimits.width / 8, lLevelPanel.y - screenLimits.height / 2, levelWidths["normal"], screenLimits.height);
		
		lLevelPanel.setModeNormal();
		
		addChild(lLevelPanel);
	}

	
	/**
	 * Loop de rafraîchissement de l'écran de selection
	 */
	private function selecLoop (): Void {
		
		// doAction des panneaux de level
		for (i in 0...4) {
			levelPanels[i].doAction();
		}
		
		// doAction du SelectScreen pour les changements position en fonction des tweens
		doAction();

	}
	
	
	/**
	 * Passe en mode 1 Panneau FullScreen 3 Panneaux fermés
	 * @param	pLevel l'id du Level demandé
	 */
	public function setModeOpenPanel (pLevel: Int): Void {
		
		isOnMainScreen = false;
		
		var lLevelPanel: LevelSelectionPanel;
		for (i in 0...4) {
			
			lLevelPanel = levelPanels[i];
			
			//pour le panneau passé en paramètre
			if (lLevelPanel.levelId == pLevel) {
				
				currentIndex = i;
				lLevelPanel.setModeTween(levelWidths["open"], lLevelPanel.setModeOpen);
			}
			// pour les 3 autres
			else {
				
				levelPanels[i].setModeTween(levelWidths["closed"], lLevelPanel.setModeClosed);
			}
		}
		
		doAction = doActionMovePanels;
	}
	
	/**
	 * Passe en mode 4 Panneaux égaux
	 */
	private function setMode4Panels() {
		
		isOnMainScreen = true;
		
		for (i in 0...4) {
			
			levelPanels[i].setModeTween(levelWidths["normal"], levelPanels[i].setModeNormal);
		}
		
		doAction = doActionMovePanels;
	}
	

	/**
	 * Repositionne les panneaux quand ils sont en train de tweener
	 */
	private function doActionMovePanels(): Void {
		
		// REPOSITION
		var lPanel: LevelSelectionPanel;
		var lPreviousPanel: LevelSelectionPanel;
		
		for (i in 0...4) {
			
			lPanel = levelPanels[i];
			
			if (i == 0) {
				
				lPanel.x = screenLimits.x + lPanel.rectangle.width / 2;	
				
			} else {
				
				lPreviousPanel = levelPanels[i - 1];
				lPanel.x = lPreviousPanel.x + lPreviousPanel.rectangle.width / 2 + lPanel.rectangle.width / 2;
			}
		}
		
		if (!levelPanels[0].isTweening && !levelPanels[1].isTweening && !levelPanels[2].isTweening && !levelPanels[3].isTweening) {
			trace("transition Done");
			doAction = doActionVoid;
		}
	}
	
	
	private function doActionVoid (): Void {}
	
	/**
	 * Ajoute un bouton Retour
	 */
	private function addButton() {
		
		var backBtn = new ButtonBack();
		backBtn.position.set(MARGIN_X, MARGIN_Y);
		backBtn.onClick = onClickBackBtn;
		addChild(backBtn);
	}
	
	/**
	 * Callback pour le bouton Back
	 * @param	pEvent
	 */
	private function onClickBackBtn(pEvent:InteractionData):Void {
		SoundManager.getSound("click").play();
		
		if (isOnMainScreen) {
			UIManager.getInstance().openScreen(TitleCard.getInstance());
		}
		else {
			setMode4Panels();
		}
	}
	
	
	override public function close():Void {
		// déregistre le SelecScreen en tant qu'écouteur de la gameloop principale
		SoundManager.getSound("main_music").pause();
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, selecLoop);
		super.close();
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
	}

}