package com.isartdigital.operationaaa.ui.popin;
import com.isartdigital.operationaaa.ui.buttons.ButtonRefuse;
import com.isartdigital.operationaaa.ui.buttons.ButtonValidate;
import com.isartdigital.operationaaa.ui.elements.Background;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.ui.Popin;
import pixi.display.Sprite;
import pixi.InteractionData;
import pixi.text.Text;
import pixi.textures.Texture;

/**
 * ... Classe commune aux PopIn ayant les choix valider/refuser, 
 * il n'y a plus que le background à mettre (avant le super) dans les classes filles
 * '@modif de Cipic: ptite classe elementaire Background qui gère la liaison avec StateGraphic pour le changement de def, on passe juste le nom de l'asset du bg au constructeur d'une popin confirm.
 * @author Benjamin PAGEAUD
 */
class Confirmation extends Popin {
	
	private static inline var MARGIN_LEFT:Int = -300;
	private static inline var MARGIN_RIGHT:Int = 300;
	private static inline var MARGIN_BOTTOM:Int = 150;
	
	private var background:Background;
	
	private var popInTitle:Text;
	private var validateBtn:ButtonValidate;
	private var refuseBtn:ButtonRefuse;
	
	public function new (pAssetName: String) {
		super();
		background = new Background(pAssetName);
		//Texture.fromImage(Config.assetsPath + "Confirm.png")
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