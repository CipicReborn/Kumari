package com.isartdigital.operationaaa.ui.screens;

import com.isartdigital.utils.Config;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.Button;
import com.isartdigital.utils.ui.Screen;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.text.Text;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Recol Cedric
 */
class FinalWin extends Screen 
{
	
	/**
	 * instance unique de la classe FinalWin
	 */
	private static var instance: FinalWin;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): FinalWin {
		if (instance == null) instance = new FinalWin();
		return instance;
	}
	// fond de l'ecran
	private var background:Sprite;
	private var creditButton:Button;
	
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		background = new Sprite(Texture.fromImage(Config.assetsPath + "winFinal_bg.png"));
		background.anchor.set(0.5, 0.5); 
		addChild(background);
		
		var winTitle = new Text("VICTOIRE !!", { font: "78px Arial" } );
		winTitle.anchor.set(0.5, 0.5);
		winTitle.position.set(0, -400);
		addChild(winTitle);
		
		creditButton = new Button();
		creditButton.position.set(0, 400);
		creditButton.onClick = onClickCreditBtn;
		addChild(creditButton);
	}
	//fonction callback bouton credits
	private function onClickCreditBtn(pEvent:InteractionData):Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().closeScreens();
		CheatPanel.getInstance().clear();
		UIManager.getInstance().closeHud();
		UIManager.getInstance().openScreen(CreditsScreen.getInstance());
		
	}
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}
}