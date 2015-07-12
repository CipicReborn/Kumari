package com.isartdigital.operationaaa.ui.screens;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.sounds.SoundManager;
import com.isartdigital.utils.ui.Screen;
import pixi.display.Sprite;
import pixi.InteractionData;
import com.isartdigital.utils.ui.Button;
import pixi.text.Text;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Recol Cedric
 */
class CreditsScreen extends Screen 
{
	/* TO DO 
	 * 
	 * retour a l'ecran de selection avec un bouton 
	 */
	
	
	/**
	 * instance unique de la classe CreditsScreen
	 */
	private static var instance: CreditsScreen;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): CreditsScreen {
		if (instance == null) instance = new CreditsScreen();
		return instance;
	}
	
	private var background:Sprite;
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		super();
		background = new Sprite(Texture.fromImage(Config.assetsPath + "winFinal_bg.png"));
		background.anchor.set(0.5, 0.5); 
		addChild(background);
		
		var progCredits = new Text("PROGRAMMERS", { font: "78px Arial" } );
		progCredits.anchor.set(0.5, 0.5);
		progCredits.position.set(0, -200);
		addChild(progCredits);
		
		var daCredtis = new Text("DESGINERS", { font: "78px Arial" } );
		daCredtis.anchor.set(0.5, 0.5);
		daCredtis.position.set(0, 200);
		addChild(daCredtis);
		
		var tcButton = new Button();
		tcButton.position.set(0, 400);
		tcButton.onClick = onClickTcButtonBtn;
		addChild(tcButton);
	}
	//fonction callback bouton TitleCard
	private function onClickTcButtonBtn(pEvent:InteractionData):Void {
		SoundManager.getSound("click").play();
		UIManager.getInstance().closeScreens();
		UIManager.getInstance().openScreen(TitleCard.getInstance());
		
	}
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
		super.destroy();
	}

}