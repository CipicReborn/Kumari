package com.isartdigital.operationaaa.ui.screens;

import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.operationaaa.ui.buttons.ButtonOptions;
import com.isartdigital.operationaaa.ui.buttons.ButtonPlay;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.system.DeviceCapabilities;
import com.isartdigital.utils.ui.Screen;
import pixi.display.Sprite;
import pixi.geom.Point;
import pixi.InteractionData;
import pixi.textures.Texture;

	
/**
 * Exemple de classe héritant de Screen
 * @author Mathieu ANTHOINE
 */
class TitleCard extends Screen {
	
	private var background: Sprite;
	private var title: Sprite;
	private var buttonPlay: ButtonPlay;
	private var buttonPlayFinalPosition: Point;
	private var buttonOptions: ButtonOptions;
	private var buttonOptionsFinalPosition: Point;
	private var countdown: Int = 45;
	private var tweenOn: Bool;
	
	private var character: Sprite;
	
	/**
	 * compteur pour faire blober le bouton play;
	 */
	private var playBlobCount: Float;
	
	/**
	 * instance unique de la classe TitleCard
	 */
	private static var instance: TitleCard;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): TitleCard {
		if (instance == null) instance = new TitleCard();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	public function new() {
		super();
		background = new Sprite(Texture.fromFrame("TitleCard_bg.png"));
		background.anchor.set(0.5, 0.5);
		addChild(background);
		
		title = new Sprite(Texture.fromFrame("TitleCard_title.png"));
		title.anchor.set(0.5, 0.45);
		addChild(title);
		background.scale = title.scale = new Point(1 / DeviceCapabilities.textureRatio , 1 / DeviceCapabilities.textureRatio);
		
		// bouton Play créé à 1000px au dessus du centre de l'écran, sera tweené vers sa position
		buttonPlay = new ButtonPlay();
		buttonPlay.position.set(-18, -1000);
		buttonPlayFinalPosition = new Point(-18, 390);
		buttonPlay.scale.x = buttonPlay.scale.y *= 0.6;
		addChild(buttonPlay);
		
		// bouton Options créé à 1000px au dessus du centre de l'écran, sera tweené vers sa position
		buttonOptions = new ButtonOptions();
		buttonOptions.position.set(729, -1000);
		buttonOptionsFinalPosition = new Point(729, 520);
		buttonOptions.scale.x = buttonOptions.scale.y *= 0.65;
		
		addChild(buttonOptions);
		
		buttonPlay.onClick = buttonPlay.tap = onClickOnPlay;
		buttonOptions.onClick = buttonOptions.tap = onClickOnOptions;
		
		// enregistre la TC en tant qu'écouteur de la gameloop principale
		Main.getInstance().addEventListener(GameEvent.GAME_LOOP, TCLoop);
	}
	
	private function onClickOnPlay (pData:InteractionData): Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().openScreen(SelectScreen.getInstance());
		
		//UIManager.getInstance().openPopin(Confirm.getInstance());
		//GameManager.getInstance().start();
	}
	
	private function onClickOnOptions (pData:InteractionData): Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().openScreen(Options.getInstance());
		
	}
	
	// loop pour afficher dynamiquement les 2 boutons
	private function TCLoop (): Void {
		
		// le compte à rebours permet de laisser un petit temps avant que le tween qui fait entrer les boutons à l'écran ne se déclenche.
		// ça laisse le temps au joueur de lire le titre
		if (countdown > 0) {
			countdown --;
			return;
		}
		
		// tween de la position des boutons
		if (tweenOn) {
			buttonPlay.position.y += (buttonPlayFinalPosition.y - buttonPlay.position.y) * 0.1;
			buttonOptions.position.y += (buttonOptionsFinalPosition.y - buttonOptions.position.y) * 0.1;
			
			// si on arrive suffisamment proche de la position souhaitée, on set la position définitive et on sort de la condition
			if ((buttonPlay.position.y - buttonPlayFinalPosition.y) > -5 && (buttonOptions.position.y - buttonOptionsFinalPosition.y) > -5) {
				
				buttonPlay.position.y = buttonPlayFinalPosition.y;
				buttonOptions.position.y = buttonOptionsFinalPosition.y;
				tweenOn = false;
			}
		}
		
		// blob du bouton play
		buttonPlay.scale.x = 1 + Math.sin(playBlobCount) * 0.04;
		buttonPlay.scale.y = 1 + Math.cos(playBlobCount) * 0.04;
		playBlobCount += 0.1;
		
		// anim
	}
	override public function open():Void {
		super.open();
		playBlobCount = 0;
		tweenOn = true;
		SoundManager.getSound("main_music").play();
	}
	override public function close():Void {
		SoundManager.getSound("main_music").pause();
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, TCLoop);
		super.close();
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}