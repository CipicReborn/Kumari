package com.isartdigital.operationaaa.ui.buttons;

import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.operationaaa.game.leveldesign.LevelLoader;
import com.isartdigital.operationaaa.ui.elements.MiniGauge;
import com.isartdigital.operationaaa.ui.screens.SelectScreen;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.TranslationManager;
import pixi.display.DisplayObjectContainer;
import pixi.display.Sprite;
import pixi.geom.Rectangle;
import pixi.InteractionData;
import pixi.primitives.Graphics;
import pixi.text.Text;
import pixi.textures.Texture;

/**
 * Méthodes principales de la Classe Panneau de Selection du Niveau
 * - new : récupère la sauvegarde du taux de complétion du niveau et créé les composants du panneau
 * - setModeNormal, setModeClosed, setModeOpen, setModeTween et leurs doActions associés qui gèrent chacun des états du panneau
 * - drawMask qui redessine le masque à chaque frame
 * - 2 callbacks de clic : la première pour ouvrir le panneau fullScreen et la deuxième pour lancer le niveau au second clic. (le bouton Back est sur l'écran de Selection)
 * @author Cyprien LARROUY
 */
class LevelSelectionPanel extends GameObject {
	
	// =======================##### VARIABLES ET FONCTIONS STATIQUES #####=======================
	
	/**
	 * Variable statique contenant les noms de niveaux localisés à l'index de leur id
	 */
	static private var localisedLevelNames: Array<String>;
	
	/**
	 * Fonction statique à exécuter pour récupérer les noms des niveaux dans la langue de la config depuis le json de localisation
	 */
	static public function getLocalisedLevelNames (): Void {
		
		localisedLevelNames = [
			'LEVEL ZERO',
			TranslationManager.get(TranslationLabels.LABEL_LEVEL1),
			TranslationManager.get(TranslationLabels.LABEL_LEVEL2),
			TranslationManager.get(TranslationLabels.LABEL_LEVEL3),
			TranslationManager.get(TranslationLabels.LABEL_LEVEL4)
		];
	}
	
	
	// =======================##### VARIABLES #####=======================
	
	/**
	 * l'id du niveau (de 1 à 4, on aurait pu mettre un enum ?).
	 */
	public var levelId (default, null): Int;
	
	/**
	 * le sprite affiché à l'écran de selection
	 */
	private var levelSprite: Sprite;
	
	/**
	 * le rectangle sur lequel va se caler le masque (nécessaire pour régler taille et position du masque)
	 */
	public var rectangle: Rectangle;
	
	/**
	 * la partie gauche du cadre dynamique (le cadre dynamique est un asset graphique qui encadre les panneaux pour faire joli, et qui s'adapte au tween)
	 */
	private var leftFrame: Sprite;
	
	/**
	 * la partie centrale du cadre dynamique (le cadre dynamique est un asset graphique qui encadre les panneaux pour faire joli, et qui s'adapte au tween)
	 */
	private var midFrame: Sprite;
	
	/**
	 * la partie droite du cadre dynamique (le cadre dynamique est un asset graphique qui encadre les panneaux pour faire joli, et qui s'adapte au tween)
	 */
	private var rightFrame: Sprite;
	
	/**
	 * true si le panneau est affiché en "plein écran" sur l'écran de sélection
	 */
	public var isMain: Bool = false;
	
	/**
	 * true si le panneau est en train de tweener.
	 */
	public var isTweening = false;
	
	/**
	 * le nom du niveau
	 */
	private var levelName: Text;
	
	/**
	 * objet MiniGauge pour l'état normal
	 */
	private var miniGauge: MiniGauge;
	
	/**
	 * objet MiniUpgrade pour l'état normal
	 */
	private var miniUpgrade: Sprite;
	
	/**
	 * objet Gauge pour l'état open
	 */
	private var gauge: MiniGauge;
	
	/**
	 * L'infoBox est un container pour toutes les informations à ajouter par-dessus le sprite d'illustration
	 */
	private var infoBox: DisplayObjectContainer;
	
	/**
	 * la largeur cible à atteindre en mode tween
	 */
	private var targetWidth: Float;
	
	/**
	 * référence vers le setMode à appeller à la fin du tween
	 */
	private var setModeCallback: Dynamic;
	
	/**
	 * le nombre de collectibles déjà ramassés par le joueur dans ce niveau
	 */
	private var collectedGems: Int;
	
	/**
	 * le nombre total de collectibles à ramasser dans le niveau
	 */
	private var totalGems: Int;
	
	/**
	 * true si le joueur a déjà récupéré l'upgrade du niveau
	 */
	private var upgradeCollected: Bool;
	
	
	// =======================##### FONCTIONS #####=======================
	
	
	/**
	 * Constructeur du Panneau de Niveau
	 * - récupère la sauvegarde pour le taux de complétion du niveau (nombre de gemmes ramassées sur nombre de gemmes total)
	 * - créé et ajoute les composants du panneau : sprite, cadre dynamique, masque, infoBox et ses informations
	 * - rend le panneau interactif
	 * @param	pLevel l'id du Level à créer (1 pour le level 1, etc.)
	 * @param	pSavedData les données présentes en sauvegarde
	 */
	public function new (pLevel: Int, pUpgrade: Bool, pCollectedGems: Int, pTotalGems: Int) {
		
		super();
		levelId = pLevel;
		
		upgradeCollected = pUpgrade;
		collectedGems = pCollectedGems;
		totalGems = pTotalGems;
		
		// Image du level
		levelSprite = new Sprite(Texture.fromImage(Config.assetsPath + "selection_screen/selection_level" + Std.string(levelId) + ".png"));
		levelSprite.anchor.set(0.5, 0.5);
		addChild(levelSprite);
		
		// Creation du Cadre transparent redimensionnable
		leftFrame = new Sprite(Texture.fromImage(Config.assetsPath + "selection_screen/left_frame.png"));
		midFrame = new Sprite(Texture.fromImage(Config.assetsPath + "selection_screen/mid_frame.png"));
		rightFrame = new Sprite(Texture.fromImage(Config.assetsPath + "selection_screen/right_frame.png"));
		
		leftFrame.anchor.set(0, 0.5);
		midFrame.anchor.set(0.5, 0.5);
		rightFrame.anchor.set(1, 0.5);
		
		addChild(midFrame);
		addChild(leftFrame);
		addChild(rightFrame);
		
		// masque
		mask = new Graphics();
		addChild(mask);
		mask.lineStyle(0);
		
		// interactivité
		levelSprite.interactive = true;
		
		// autres éléments d'UI
		
			// container des éléments d'UI
		infoBox = new DisplayObjectContainer();
		
			//état normal
		miniUpgrade = new Sprite(Texture.fromFrame("UpgradeWin000" + levelId + ".png"));
		miniUpgrade.anchor.set(0.5, 0.5);
		if (!upgradeCollected) miniUpgrade.alpha = 0.5;
		
		miniGauge = new MiniGauge(collectedGems, totalGems, 150);
		
			//état ouvert
		levelName = new Text(localisedLevelNames[levelId], {fill:'white', stroke: 'black', strokeThickness: 5, font : "64px GothicStyle" } );
		levelName.anchor.set(0.5, 1);
		levelName.y = 500;
		
		gauge = new MiniGauge(collectedGems, totalGems, 250);
		gauge.y = -200;
		
	}
	
	/**
	 * Callback de clic sur le panneau : lance le niveau (LevelManager.load)
	 * @param	pEvent
	 */
	private function onClickDoStartLevel (pEvent: InteractionData): Void {
		
		trace("[LevelSelectionPanel.onClick] Level " + levelId + " clicked : Loading Level...");
		SoundManager.getSound("click").play();
		LevelLoader.getInstance().load(levelId);
	}
	
	/**
	 * Callback de clic sur le panneau : ouvre le panneau en plein écran (SelectScreen.setModeOpen)
	 * @param	pEvent
	 */
	private function onClickDoOpenPanel (pEvent: InteractionData): Void {
		
		trace("[LevelSelectionPanel.onClick] Level " + levelId + " clicked : Opening Panel...");
		
		SelectScreen.getInstance().setModeOpenPanel(levelId);
	}
	
	/**
	 * Met le panneau en mode affichage à un quart de la largeur, avec mini panneau infos
	 */
	override public function setModeNormal (): Void {
		
		super.setModeNormal(); //doAction = doActionNormal;
		levelSprite.click = levelSprite.tap = onClickDoOpenPanel;
		
		drawMask();
		
		infoBox.addChild(miniGauge);
		
		infoBox.addChild(miniUpgrade);
		miniUpgrade.scale.set(0.5, 0.5);
		miniUpgrade.y = 300;
		
		addChild(infoBox);
		miniGauge.start();
		
		// trace('[LevelSelectionPanel.setModeNormal] Done');
	}
	
	/**
	 * remplit la mini-jauge en mode 4Panels
	 */
	override function doActionNormal():Void {
		
		super.doActionNormal();
		
		miniGauge.doAction();
	}
	
	public function setModeOpen (): Void {
		
		doAction = doActionOpen;
		levelSprite.click = levelSprite.tap = onClickDoStartLevel;
		
		drawMask();
		
		infoBox.addChild(levelName);
		
		infoBox.addChild(gauge);
		
		infoBox.addChild(miniUpgrade);
		miniUpgrade.scale.set(1, 1);
		miniUpgrade.y = -200;
		
		addChild(infoBox);
		gauge.start();
	}
	
	/**
	 * remplit la jauge en mode Main/FullScreen
	 */
	private function doActionOpen (): Void {
		
		gauge.doAction();
	}
	
	public function setModeClosed (): Void {
		
		doAction = doActionVoid;
		levelSprite.click = levelSprite.tap = onClickDoOpenPanel;
		
		drawMask();
	}
	
	public function setModeTween (pTargetWidth: Float, pSetModeCallback: Dynamic): Void {
		
		doAction = doActionTween;
		click = tap = null;
		
		isTweening = true;
		targetWidth = pTargetWidth;
		setModeCallback = pSetModeCallback;
		
	}
	
	/**
	 * calcul du Tween
	 */
	public function doActionTween (): Void {
		
		// on fait disparaitre l'infoBox s'il y en a une
		if (infoBox.parent != null) {
			if ((infoBox.scale.x *= 0.9) < 0.1) {
				infoBox.scale.x = 1;
				removeChild(infoBox);
				infoBox.removeChildren();
			}
		}
		
		// on tween la largeur
		rectangle.width += 0.1 * (targetWidth - rectangle.width);
		
		// si on a fini le tween on SetModeCallback
		if (-5 < targetWidth - rectangle.width && targetWidth - rectangle.width < 5) {
			rectangle.width = targetWidth;
			isTweening = false;
			setModeCallback();
		}
		
		//repositionnement post-tween
		rectangle.x = - rectangle.width / 2;
		
		//on redessine le mask
		drawMask();
	}
	
	/**
	 * efface le masque et en redessine un en fonction du rectangle courant
	 */
	public function drawMask(): Void {
		
		// on part d'un truc propre
		mask.clear();
		
		// dessin du masque
		mask.beginFill(0xffffff, 1);
		mask.drawShape(rectangle);
		mask.endFill();
		
		// redimensionnement et repositionnement du cadre transparent
		leftFrame.x = rectangle.x;
		leftFrame.height = rectangle.height;
		midFrame.width = rectangle.width - (leftFrame.width + rightFrame.width);
		midFrame.height = rectangle.height;
		rightFrame.x = rectangle.x + rectangle.width;
		rightFrame.height = rectangle.height;
		
		// pour rendre le clic impossible hors du masque
		levelSprite.hitArea = rectangle;
	}
	

	private function get_id (): Int {
		return levelId;
	}
}