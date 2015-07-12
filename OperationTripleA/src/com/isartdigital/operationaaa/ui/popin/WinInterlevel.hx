package com.isartdigital.operationaaa.ui.popin;

import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.operationaaa.game.leveldesign.LevelLoader;
import com.isartdigital.operationaaa.ui.buttons.ButtonNextLevel;
import com.isartdigital.operationaaa.ui.screens.SelectScreen;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.Button;
import com.isartdigital.utils.ui.Gauge;
import com.isartdigital.utils.ui.Popin;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.text.Text;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Recol Cedric
 */
class WinInterlevel extends Popin 
{
	private var background:Sprite;
	private var nextBtn:Button;
	private var currentLevel:Int;
	
	/*
	 * besoin de 3 valeurs : 
		 * le nombre de collectible du niveau
		 * le nombre de collectible ramassé
		 * le niveau en cours pour choisir le sprite de l'upgrade obtenue
	 */

	/**
	 * instance unique de la classe WinInterlevel
	 */
	private static var instance: WinInterlevel;
	
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): WinInterlevel {
		if (instance == null) instance = new WinInterlevel();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		
		super();
		background = new Sprite(Texture.fromImage(Config.assetsPath+"WinInterlevel.png"));
		background.anchor.set(0.5, 0.5);
		addChild(background);
		
		currentLevel = GameManager.getInstance().currentLevelId;
		
		//trace('------------------CURRENT LEVEL : ' + currentLevel + ' ----------------');
		
		nextBtn = new ButtonNextLevel();
		nextBtn.position.set( 0, 300);
		nextBtn.scale.set(0.5,0.5);
		addChild(nextBtn);
		nextBtn.onClick = onClickNext;
		
		var winTxt = new Text("Bravo vous avez fini le niveau !!", { font: "36px Arial" } );
		winTxt.anchor.set(0.5, 0.5);
		winTxt.position.set(0, -300);
		addChild(winTxt);
		
		var winTxt2 = new Text("Vous obtenez le : ", { font: "36px Arial" } );
		winTxt2.anchor.set(0.5, 0.5);
		winTxt2.position.set(0, -240);
		addChild(winTxt2);
		
		var lTexture =  Texture.fromFrame("UpgradeWin000" + currentLevel + ".png");
		var currentUpgrade = new Sprite(lTexture);
		currentUpgrade.anchor.set(0.5, 0.5);
		currentUpgrade.position.set(0, -120);
		addChild(currentUpgrade);
		
		var winTxt3 = new Text("Complétion du niveau :", { font: "36px Arial" } );
		winTxt3.anchor.set(0.5, 0.5);
		winTxt3.position.set(0, 0);
		addChild(winTxt3);
		
		var winGauge = new Gauge();
		winGauge.anchor.set(0.5, 0.5);
		winGauge.position.set(0, 120);
		//trace(winGauge.position);
		addChild(winGauge);
	}
	
	private function onClickNext(pData:InteractionData):Void {
		
		SoundManager.getSound("click").play();
		UIManager.getInstance().closeCurrentPopin();
		UIManager.getInstance().closeHud();
		
		GameManager.getInstance().stopGameAndBackToSelection();
	}
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}