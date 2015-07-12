package com.isartdigital.operationaaa.ui.hud;
import com.isartdigital.utils.Config;
import pixi.display.Sprite;
import pixi.geom.Point;
import pixi.textures.Texture;

/**
 * ...
 * @author Benjamin
 */
class CollectibleJuicyIcon extends Sprite
{
	static public var list:Array<CollectibleJuicyIcon> = new Array<CollectibleJuicyIcon>();
	public var speed:Point;
	public function new() 
	{
		speed = new Point(-10 + Math.random() * 20, Math.random() * -15);
		super(Texture.fromFrame(Config.assetsPath + "collectible_icon.png"));
		
		list.push(this);
	}
	
	public function doAction(): Void {
		x += speed.x;
		y += speed.y;
		
		speed.y++;
		
		alpha   -= 0.05;
		scale.x = scale.y -= 0.05;
		if (alpha <= 0) destroy();
	}
	
	public function destroy(): Void {
		if (parent != null) parent.removeChild(this);
		list.remove(this);
	}
}