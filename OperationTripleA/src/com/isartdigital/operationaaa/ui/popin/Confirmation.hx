package com.isartdigital.operationaaa.ui.popin;
import com.isartdigital.operationaaa.ui.buttons.ButtonRefuse;
import com.isartdigital.operationaaa.ui.buttons.ButtonValidate;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.ui.Popin;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.text.Text;
import pixi.textures.Texture;

/**
 * ... Classe commune aux PopIn ayant les choix valider/refuser, 
 * il n'y a plus que le background à mettre (avant le super) dans les classes filles
 * @author Benjamin PAGEAUD
 */
class Confirmation extends Popin
{
	private static inline var MARGIN_LEFT:Int = -300;
	private static inline var MARGIN_RIGHT:Int = 300;
	private static inline var MARGIN_BOTTOM:Int = 150;
	
	private var background:Sprite;
	
	private var popInTitle:Text;
	private var validateBtn:ButtonValidate;
	private var refuseBtn:ButtonRefuse;
	
	public function new() 
	{
		super();
		background = new Sprite(Texture.fromImage(Config.assetsPath + "Confirm.png"));
		background.anchor.set(0.5, 0.5);
		background.position.y = -50;
		addChild(background);
		
		popInTitle = new Text("Placeholder_TEXT", { font: "48px Arial" } );
		popInTitle.anchor.set(0.5, 0.5);
		popInTitle.setStyle({fill:'white', stroke: 'black', strokeThickness: 5, align:'center', font : "86px GothicStyle" });
		popInTitle.position.y = -200;
		addChild(popInTitle);
		
		validateBtn = new ButtonValidate();
		validateBtn.position.set(MARGIN_LEFT, MARGIN_BOTTOM);
		validateBtn.onClick = onClickValidateBtn;
		addChild(validateBtn);
		
		refuseBtn = new ButtonRefuse();
		refuseBtn.position.set(MARGIN_RIGHT, MARGIN_BOTTOM);
		refuseBtn.onClick = onClickRefuseBtn;
		addChild(refuseBtn);
	}
	
	/**
	 * change le background de la PopIn
	 * @param	pImagePath : le chemin vers l'image du background
	 */
	private function setBackgroundTexture(pImagePath:String) {
		background.texture = Texture.fromImage(Config.assetsPath + pImagePath + ".png");
	}
	/**
	 * Callback bouton valider
	 */
	private function onClickValidateBtn(pEvent:InteractionData = null):Void {
	}
	
	/**
	 * Callback bouton refuser
	 */
	private function onClickRefuseBtn(pEvent:InteractionData = null):Void {
	}
	
}