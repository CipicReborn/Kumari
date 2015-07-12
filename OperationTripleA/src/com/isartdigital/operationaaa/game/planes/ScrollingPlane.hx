package com.isartdigital.operationaaa.game.planes;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.system.DeviceCapabilities;
import pixi.display.DisplayObject;
import pixi.display.Sprite;
import pixi.geom.Point;
import pixi.geom.Rectangle;
import pixi.textures.Texture;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class ScrollingPlane extends GameObject
{
	private static inline var PART_WIDTH:Int = 1239;
	private var partsArray:Array<Sprite> = new Array<Sprite>();
	
	public var scrollSpeed:Point = new Point(1, 1);

	private var assetsArray:Array<String> = new Array<String>();
	
	//width, height d'une partie
	private var partDimensions:Rectangle;
	/**
	 * Constructeur de scrolling plane
	 * @param	pAssets Tableau contenant les png qui constitueront les différentes parties du plane (possibilité d'en mettre autant que voulu)
	 */
	public function new(pAssets:Array<String>) 
	{
		super();
		assetsArray = pAssets;
	}
	
	private function createParts():Void {
		var lScreenRect:Rectangle = DeviceCapabilities.getScreenRect(this);
		//trace('lScreenRect dimensions : X ' + lScreenRect.x + ' Width : ' + lScreenRect.width);
		
		/*var lCeil = Math.ceil(lScreenRect.width / PART_WIDTH);
		trace('On peut faire tenir ' + lCeil + ' parties dans l\'écran');
		trace('Donc ' + Math.ceil(lCeil / assetsArray.length) + ' fois les 3 parties');*/
		
		//On calcule le nombre de fois dont on aura besoin de dupliquer les parties de background pour couvrir tout l'écran
		var howManyPartsFitInScreen = Math.ceil(lScreenRect.width / PART_WIDTH);
		var duplicateAllPartsCount = Math.ceil(howManyPartsFitInScreen / assetsArray.length) + 1;
		
		for (i in 0...assetsArray.length * duplicateAllPartsCount) {
			partsArray[i] = new Sprite(Texture.fromFrame(assetsArray[i%assetsArray.length]));
			partsArray[i].x = PART_WIDTH * i;
			addChild(partsArray[i]);
		}
		partDimensions = new Rectangle(0, 0, partsArray[0].width, partsArray[0].height);
	}
	
	override public function setModeNormal():Void {
		createParts();
		super.setModeNormal();
	}
	
	override public function doActionNormal():Void {
		x = GamePlane.getInstance().x * scrollSpeed.x;// - partDimensions.width / 2;
		y = (GamePlane.getInstance().y + height*2) * scrollSpeed.y;
		
		//Si l'objet disparait à gauche de l'écran
		if (toGlobal(partsArray[0].position).x + PART_WIDTH < 0 - partDimensions.width/2) {
			partsArray[0].x = partsArray[partsArray.length - 1].x + PART_WIDTH;
			partsArray.push(partsArray.shift());
		//Si l'objet disparait à droite de l'écran
		} else if (toGlobal(partsArray[partsArray.length - 1].position).x > DeviceCapabilities.getScreenRect(this).width) {
			partsArray[partsArray.length - 1].x = partsArray[0].x - PART_WIDTH;
			partsArray.unshift(partsArray.pop());
		}
	}
	
	override public function destroy():Void {
		super.destroy();
		parent.removeChild(this);
	}
	
	
	
	
}