package com.isartdigital.operationaaa.ui;

import com.isartdigital.operationaaa.ui.elements.GraphicElement;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.system.DeviceCapabilities;
import com.isartdigital.utils.ui.Screen;
import pixi.display.Sprite;
import pixi.geom.Rectangle;
import pixi.textures.Texture;

/**
 * Preloader Graphique principal
 * @author Mathieu ANTHOINE
 */
class GraphicLoader extends Screen {
	
	/**
	 * instance unique de la classe GraphicLoader
	 */
	private static var instance: GraphicLoader;

	private var loaderBar: GraphicElement;
	//private var funkySprites: Array<Sprite>;
	//private var spritesCount: Int = 10;

	public function new() {
		
		super();
		
		// ajout des sprites de décoration sur le fond
		//funkySprites = [];
		//for (i in 0...spritesCount) {
			//
			//var lSprite: Sprite = new (Texture.fromFrame("preload_ovale.png"));
			//lSprite.position.set(Math.floor(Math.random() * 2430) - 2430 / 2, Math.floor(Math.random() * 1536) - 1536 / 2);
			//addChild(lSprite);
			//funkySprites.push(lSprite);
		//}
		
		var title: GraphicElement = new GraphicElement("preload_title");
		title.y -= title.height/2;
		addChild(title);
		
		var lBg:GraphicElement = new GraphicElement("preload_bg");
		lBg.y = 200;
		addChild(lBg);
		
		loaderBar = new GraphicElement("preload", 0.05, 0.5);
		loaderBar.x = -loaderBar.width / 2 + 20;
		loaderBar.y = 200;
		addChild(loaderBar);
		loaderBar.scale.x = 0;
		

		
		// enregistre le GraphicLoader en tant qu'écouteur de la gameloop principale
		//Main.getInstance().addEventListener(GameEvent.GAME_LOOP, loaderLoop);
	}
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): GraphicLoader {
		if (instance == null) instance = new GraphicLoader();
		return instance;
	}
	
	/**
	 * mise à jour de la barre de chargement
	 * @param	pProgress
	 */
	public function update (pProgress:Float): Void {
		loaderBar.scale.x = pProgress;
	}
	
	//private function loaderLoop (): Void {
		//
		//for (i in 0...spritesCount) {
			//var lSprite: Sprite = funkySprites[i];
			//lSprite.position.x += 10;
			//
			//var lFrame: Rectangle = DeviceCapabilities.getScreenRect(this);
			//if (lSprite.position.x > (lFrame.x + lFrame.width)) { lSprite.position.x = lFrame.x - lSprite.width; }
		//}
	//}
	
	override public function close(): Void {
		//Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, loaderLoop);
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