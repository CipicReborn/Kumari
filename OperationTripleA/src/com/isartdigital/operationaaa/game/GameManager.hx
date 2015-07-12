package com.isartdigital.operationaaa.game;

import com.isartdigital.operationaaa.game.leveldesign.LevelLoader;
import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.planes.ScrollingPlane;
import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.operationaaa.game.sprites.upgradeActive.Magnet;
import com.isartdigital.operationaaa.game.sprites.upgradeActive.Shield;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.operationaaa.game.sprites.Template;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.operationaaa.ui.CheatPanel;
import com.isartdigital.operationaaa.ui.hud.Hud;
import com.isartdigital.operationaaa.ui.popin.WinInterlevel;
import com.isartdigital.operationaaa.ui.screens.FinalWin;
import com.isartdigital.operationaaa.ui.screens.SelectScreen;
import com.isartdigital.operationaaa.ui.UIManager;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.game.Camera;
import com.isartdigital.utils.game.CollisionManager;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.system.DeviceCapabilities;
import pixi.display.DisplayObject;
import pixi.geom.Point;

/**
 * Manager (Singleton) en charge de gérer le déroulement d'une partie
 * @author team platformer
 */
class GameManager 
{
	
	// =======================##### VARIABLES ET FONCTIONS STATIQUES #####=======================
	
	
	/**
	 * instance unique de la classe GameManager
	 */
	private static var instance: GameManager;
	
	public var background:ScrollingPlane;
	public var backgroundTransparent:ScrollingPlane;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): GameManager {
		
		if (instance == null) instance = new GameManager();
		return instance;
	}
	
	static public var DEG2RAD:Float = Math.PI / 180;
	
	// =======================##### VARIABLES #####=======================
	
	
	/**
	 * l'id du niveau chargé. null entre temps
	 */
	public var currentLevelId(default, null):Int;
	
	
	private var winLoopFramesCount: Int = 0;
	static inline var WINLOOP_FRAMES_COUNT: Int = 60;
	
	// =======================##### FONCTIONS #####=======================
	
	
	private function new() {
		
	}
	
	
	/**
	 * Lance une game dans le level donné. Appellée par LevelManager à la fin du chargement des assets du niveau.
	 * @param	pLevel L'id du niveau demandé.
	 */
	public function start (?pLevel: Int = 1): Void {
		
		currentLevelId = pLevel;
		trace('[GameManager.start] Level ' + currentLevelId + ' starting...');
		
		setBackgrounds();
		
		// début de l'initialisation du jeu
		LevelManager.getInstance().init();
		Camera.getInstance().setTarget(GamePlane.getInstance());
		Player.getInstance().takeCameraFocus();
		Camera.getInstance().setPosition();
		LevelManager.getInstance().populateScreen(); // après le Camera.setPosition car on va clipper ce qui est dans le champ caméra
		Player.getInstance().update();
		
		//CheatPanel.getInstance().setPlayer();
		//CheatPanel.getInstance().ingame();
		//CheatPanel.getInstance().setPlayer();
		//CheatPanel.getInstance().setCamera();
		
		// demande au Manager d'interface de se mettre en mode "jeu" : ferme tous les écrans et affiche le Hud
		UIManager.getInstance().startGame();
		
		runGameLoop();
	}
	
	
	/**
	 * boucle de jeu (répétée à la cadence du jeu en fps)
	 */
	public function gameLoop (): Void {
		background.doAction();
		backgroundTransparent.doAction();
		
		
		Player.getInstance().doAction();
		
		if (Camera.getInstance().move()) {
			LevelManager.getInstance().checkClipping();
		}
		
		Hud.getInstance().doAction();
		for (lObject in Shoot.list[0]) lObject.doAction();
		for (lObject in Shoot.list[1]) lObject.doAction();
		for (lObject in Wall.list) lObject.doAction();
		for (lObject in Enemy.list) lObject.doAction();
		for (lObject in KillZoneDynamic.list) lObject.doAction();
		for (lObject in Collectable.list) lObject.doAction();
		for (lObject in Collectable.dyingList) lObject.doAction();
		Shield.getInstance().doAction();
		Magnet.getInstance().doAction();
	}
	
	public function winLoop (): Void {
		
		background.doAction();
		backgroundTransparent.doAction();
		
		Player.getInstance().doAction();
		
		if (Camera.getInstance().move()) {
			LevelManager.getInstance().checkClipping();
		}
		
		Hud.getInstance().doAction();
		
		if (winLoopFramesCount++ > WINLOOP_FRAMES_COUNT) {
			UIManager.getInstance().openPopin(WinInterlevel.getInstance());
			runNoLoop();
		}
	}
	
	private function runGameLoop(): Void {
		
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, winLoop);
		
		// enregistre le GameManager en tant qu'écouteur de la gameloop principale
		Main.getInstance().addEventListener(GameEvent.GAME_LOOP, gameLoop);
	}
	
	/**
	 * Loop de 0.5 sec avant d'afficher la popin de victoire
	 */
	private function runWinLoop(): Void {
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, gameLoop);
		
		winLoopFramesCount = 0;
		
		// enregistre le GameManager en tant qu'écouteur de la gameloop principale
		Main.getInstance().addEventListener(GameEvent.GAME_LOOP, winLoop);
	}
	
	/**
	 * enlève les loop
	 */
	private function runNoLoop(): Void {
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, gameLoop);
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, winLoop);
	}
	
	/**
	 * Crée les backgrounds, avec leurs sprites et leur vitesse et les ajoute au jeu
	 * @author Benjamin
	 */
	private function setBackgrounds():Void {
		//Ca peut paraitre étrange de mettre le nom des assets en dur, mais vu qu'on écrase les textures au chargement des niveaux, il ne devrait pas y avoir de problème
		background = new ScrollingPlane([
			"BackgroundScroll_1.png",
			"BackgroundScroll_2.png",
			"BackgroundScroll_3.png"
		]);
		background.scrollSpeed.set(0.1, 0.01);
		background.pivot.y = 20;
		
		backgroundTransparent = new ScrollingPlane([
			"BackgroundScrollTransparent_1.png",
			"BackgroundScrollTransparent_2.png",
			"BackgroundScrollTransparent_3.png"
		]);
		backgroundTransparent.scrollSpeed.set(0.2, 0.15);
		backgroundTransparent.pivot.y = -120;
		
		var lGameStage:GameStage = GameStage.getInstance();
		lGameStage.addChildAt(background, 0);
		lGameStage.addChildAt(backgroundTransparent, 1);
		background.start();
		backgroundTransparent.start();
	}
	
	
	public function respawnAt (pX:Int, pY: Int) {
		//LevelManager.getInstance().setModeDontCheckClipping();
		Player.getInstance().position.set(pX, pY);
		Camera.getInstance().setPosition();
		LevelManager.getInstance().reloadLevelAtLastCheckpoint();
		Player.getInstance().update();
		LevelManager.getInstance().setModeCheckClipping();
	}
	
	/**
	 * fonction inverse de start
	 * @param pSave true
	 * @author Cyprien
	 */
	public function stopGameAndBackToSelection (?pSave: Bool = false): Void {
		
		Player.getInstance().setModeVoid();
		
		runNoLoop();
		
		if (pSave) {
			
			SaveManager.getInstance().saveLevelData(currentLevelId, LevelLoader.getInstance().getCurrentLevelData());
		}
		
		
		UIManager.getInstance().openScreen(SelectScreen.getInstance());
		
		CheatPanel.getInstance().clear();
		
		Camera.getInstance().destroy();
		//Player.getInstance().destroy();
		
		LevelManager.getInstance().destroyLevel();
		
		currentLevelId = null;
	}
	
	
	/**
	 * Sauvegarde la progression et ouvre la popin de Win.
	 * @author Cyprien
	 */
	public function win():Void {
		
		trace('VICTORY');
		
		Player.getInstance().setUpgrade(currentLevelId);
		LevelLoader.getInstance().recordUpgradeForCurrentLevel();

		SoundManager.getSound(LevelLoader.getInstance().soundLevel).fadeOut(10, 10, null);
		SoundManager.getSound('unlock').play();
		
		runWinLoop();
		
		trace(LevelLoader.getInstance().getCurrentLevelData());
		SaveManager.getInstance().saveLevelData(currentLevelId, LevelLoader.getInstance().getCurrentLevelData());
		
		//UIManager.getInstance().openPopin(WinInterlevel.getInstance());
	}
	
	
	
	
	/**
	 * Fait intervenir l'ecran de winFinal aprés la vitoire qui renverra sur l'ecran de credits
	 */
	public function winFinal():Void {
		
		UIManager.getInstance().openScreen(FinalWin.getInstance());
	}
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP,gameLoop);
		instance = null;
	}

}