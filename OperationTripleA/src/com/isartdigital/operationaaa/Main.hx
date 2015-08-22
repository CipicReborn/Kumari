package com.isartdigital.operationaaa;

import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.operationaaa.game.leveldesign.LevelLoader;
import com.isartdigital.operationaaa.ui.GraphicLoader;
import com.isartdigital.operationaaa.ui.screens.Options;
import com.isartdigital.operationaaa.ui.screens.SelectScreen;
import com.isartdigital.operationaaa.ui.screens.TitleCard;
import com.isartdigital.operationaaa.ui.UIManager;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.events.LoaderEvent;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.game.GameStageScale;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.loader.Loader;
import com.isartdigital.utils.loader.WebFontLoader;
import com.isartdigital.utils.system.DeviceCapabilities;
import com.isartdigital.utils.ui.TranslationManager;
import haxe.Timer;
import js.Browser;
import pixi.display.Stage;
import pixi.loaders.JsonLoader;
import pixi.renderers.webgl.WebGLRenderer;
import pixi.utils.Detector;
import pixi.utils.Event;
import pixi.utils.EventTarget;
	

/**
 * Classe d'initialisation et lancement du jeu
 * @author Mathieu ANTHOINE
 */

class Main extends EventTarget {
	
	static inline var FRAMERATE: Int = 16;
	
	/**
	 * Compteur de frames global
	 */
	public var frames (default, null): Int = 0;
	
	/**
	 * chemin vers le fichier de configuration
	 */
	private static inline var CONFIG_PATH:String = "config.json";	
	
	/**
	 * instance unique de la classe Main
	 */
	private static var instance: Main;
	
	/**
	 * renderer (WebGL ou Canvas)
	 */
	public var renderer:WebGLRenderer;
	
	/**
	 * Element racine de la displayList
	 */
	public var stage:Stage;
	
	/**
	 * Interrupteur pour la gameLoop qui fait un render 1 frame sur 2 (input reçu à 60 fps, rendu graphique à 30 fps)
	 */
	private var canRender: Bool = true;
	
	/**
	 * initialisation générale
	 */
	private static function main ():Void {
		Main.getInstance();
	}

	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Main {
		if (instance == null) instance = new Main();
		return instance;
	}
	
	/**
	 * création du jeu et lancement du chargement du fichier de configuration
	 */
	private function new () {
		
		super();
		
		stage = new Stage(0x999999);
		DeviceCapabilities.scaleViewport();
		renderer = Detector.autoDetectRenderer(DeviceCapabilities.width, DeviceCapabilities.height);
		
		Browser.document.body.appendChild(renderer.view);
		
		var lConfig:JsonLoader = new JsonLoader(CONFIG_PATH);
		lConfig.addEventListener("loaded", preloadAssets);
		
		lConfig.load();
		
	}
	
	/**
	 * charge les assets graphiques du preloader principal
	 */
	private function preloadAssets(pEvent:Event):Void {
		pEvent.target.removeEventListener("loaded", preloadAssets);
		
		// initialise les paramètres de configuration
		Config.init(cast(pEvent.target, JsonLoader).json);
		
		//Spécifie le ratio des textures (HD, MD, LD) 
		// ----- CHANGER LES RATIOS UNE FOIS LES TEXTURES GENEREES AVEC LES BONNES DEF, mettre 0.5, 0.375, 0.25 ---
		DeviceCapabilities.init(0.5, 0.375, 0.25);
		
		// Active le mode debug
		if (Config.debug) Debug.getInstance().init(this);
		// défini l'alpha des Boxes de collision
		if (Config.data.boxAlpha != null) StateGraphic.boxAlpha = Config.data.boxAlpha;
		// défini l'alpha des anims
		if (Config.data.animAlpha != null) StateGraphic.animAlpha = Config.data.animAlpha;
		
		// défini le mode de redimensionnement du Jeu
		GameStage.getInstance().scaleMode = GameStageScale.SHOW_ALL;
		// initialise le GameStage et défini la taille de la safeZone
		GameStage.getInstance().init(render,2048, 1366, false);
		
		// affiche le bouton FullScreen quand c'est nécessaire
		DeviceCapabilities.displayFullScreenButton();
		
		// Ajoute le GameStage au stage
		stage.addChild(GameStage.getInstance());
		
		// ajoute Main en tant qu'écouteur des évenements de redimensionnement
		Browser.window.addEventListener("resize", resize);
		resize();
		
		// lance le chargement des assets graphiques du preloader
		var lLoader:Loader = new Loader();
		lLoader.addTxtFile("anchors.json");
		lLoader.addAssetFile("black_bg.png"); // 143 octets seulement, à la racine de assets pour ne pas modifier la classe utils com.isartdigital.utils.ui.Screen;
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/preload/LoadingScreen.json");
		//lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/preload/preload_ovale.png");
		
		lLoader.addEventListener(LoaderEvent.COMPLETE, loadFonts);
		lLoader.load();
	}
	
	//Chargement des polices
	private function loadFonts(pEvent:LoaderEvent):Void {
		
		pEvent.target.removeEventListener(LoaderEvent.COMPLETE, loadFonts);
		var webFontConfig = {
            custom: {
                families: ['GothicStyle'], // Nom des fonts dans CSS
                urls: [Config.cssPath + 'fonts.css'], // Path des fichiers css
            },
            active: function() { //Callback
                loadAssets();
            }
        };
        WebFontLoader.load(webFontConfig); //Lancement du loader
		
	}
	
	/**
	 * lance le chargement principal
	 */
	private function loadAssets (): Void {
		
		var lLoader:Loader = new Loader();
		
		// -------- TXT
		lLoader.addTxtFile("boxes.json");
		lLoader.addTxtFile("anchors.json");
		lLoader.addTxtFile("main.json", Config.langPath + "en/");
		lLoader.addTxtFile("main.json", Config.langPath + "fr/");
		
		// -------- ASSETS
		lLoader.addAssetFile("alpha_bg.png");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/buttonsValidate.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/ButtonsNextPauseBack.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/tc/TitleCard.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/tc/buttons_TitleCard.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/options/OptionButtons.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/options/OptionsBackgrounds0.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/options/OptionsBackgrounds1.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/hud/hud.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_0.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_1.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_2.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_3.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_4.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/ui/touch/touch_feedback.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/player/shield.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/player/magnet.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/player/player.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/enemies/enemies_bomb_speed.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/enemies/enemies_fire_turret.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/enemies/EnemyBomb_death.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/enemies/EnemyFire_death.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/enemies/EnemySpeed_death.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/enemies/EnemySpeed_death2.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/enemies/EnemyTurret_death.json");
		for (i in 1...7)
			lLoader.addAssetFile(DeviceCapabilities.textureType + "/characters/shoots/shoots"+i+".json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/other/Collectable.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/other/checkpoint.json");
		lLoader.addAssetFile(DeviceCapabilities.textureType + "/other/UpgradeWin.json");
		
		// -------- SOUNDS
		if (!Config.data.debugNoSoundLoad) {
			lLoader.addSoundFile("sounds.json");
		}
		
		// pour le suivi du chargement et la suite des événements
		lLoader.addEventListener(LoaderEvent.PROGRESS, onLoadProgress);
		lLoader.addEventListener(LoaderEvent.COMPLETE, onLoadComplete);
		
		// transmet au StateGraphic la description des ancres utilisées par les instances de StateGraphic et met le preload en cache
		StateGraphic.addAnchors(Loader.getContent("anchors.json", Config.jsonPath));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/preload/LoadingScreen.json"));
		
		// affiche l'écran de préchargement
		UIManager.getInstance().openScreen(GraphicLoader.getInstance());
		
		Browser.window.requestAnimationFrame(cast gameLoop);
		
		lLoader.load();
	}
	
	/**
	 * transmet les paramètres de chargement au préchargeur graphique
	 * @param	pEvent evenement de chargement
	 */
	private function onLoadProgress (pEvent:LoaderEvent): Void {
		GraphicLoader.getInstance().update(pEvent.data.loaded/pEvent.data.total);
	}
	
	/**
	 * initialisation du jeu
	 * @param	pEvent evenement de chargement
	 */
	private function onLoadComplete (pEvent:LoaderEvent): Void {
		
		pEvent.target.removeEventListener(LoaderEvent.PROGRESS, onLoadProgress);
		pEvent.target.removeEventListener(LoaderEvent.COMPLETE, onLoadComplete);
		
		// transmet au StateGraphic la description des planches de Sprites utilisées par les instances de StateGraphic
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/buttonsValidate.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/ButtonsNextPauseBack.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/tc/TitleCard.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/tc/buttons_TitleCard.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/options/OptionButtons.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/options/OptionsBackgrounds0.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/options/OptionsBackgrounds1.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/hud/hud.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_0.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_1.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_2.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_3.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/selection_screen/selection_screen_4.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/ui/touch/touch_feedback.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/player/shield.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/player/magnet.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/player/player.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/enemies/enemies_bomb_speed.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/enemies/enemies_fire_turret.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/enemies/EnemyBomb_death.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/enemies/EnemyFire_death.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/enemies/EnemySpeed_death.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/enemies/EnemySpeed_death2.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/enemies/EnemyTurret_death.json"));
		for (i in 1...7)
			StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/characters/shoots/shoots"+i+".json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/other/Collectable.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/other/checkpoint.json"));
		StateGraphic.addTextures(Loader.getContent(DeviceCapabilities.textureType + "/other/UpgradeWin.json"));
		
		// transmet au StateGraphic la description des boxes de collision utilisées par les instances de StateGraphic
		StateGraphic.addBoxes(Loader.getContent("boxes.json", Config.jsonPath));
		
		// ajoute les traductions et paramètre la langue
		TranslationManager.addTranslations("en", Loader.getContent("main.json", Config.langPath + "en/"));
		TranslationManager.addTranslations("fr", Loader.getContent("main.json", Config.langPath + "fr/"));
		TranslationManager.getInstance().setLanguage(SaveManager.getInstance().userConfig["language"]);
		
		// Ouvre la TitleClard
		UIManager.getInstance().closeScreens();
		//UIManager.getInstance().openScreen(TitleCard.getInstance());
		
		// Raccourcis
		
		//UIManager.getInstance().openScreen(SelectScreen.getInstance());
		//UIManager.getInstance().openScreen(Options.getInstance());
		LevelLoader.getInstance().load(1);
	}
	
	/**
	 * game loop
	 */
	private function gameLoop() {
		

		Timer.delay(gameLoop, FRAMERATE);
		if (canRender) {
			renderer.render(stage);
			canRender = false;
		} else {
			canRender = true;
			untyped stage.updateTransform();
		}
		dispatchEvent(GameEvent.GAME_LOOP);
	}
	
	/**
	 * Ecouteur du redimensionnement
	 * @param	pEvent evenement de redimensionnement
	 */
	public function resize (pEvent:Event = null): Void {
		renderer.resize(DeviceCapabilities.width, DeviceCapabilities.height);
		GameStage.getInstance().resize();
	}
	
	/**
	 * fait le rendu de l'écran
	 */
	public function render (): Void {
		if (frames++ % 2 == 0) renderer.render(stage);
		else untyped stage.updateTransform();
	}
		
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		Browser.window.removeEventListener("resize", resize);
		instance = null;
	}
	
}