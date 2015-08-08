package com.isartdigital.utils.ui;
import com.isartdigital.utils.game.BoxType;
import com.isartdigital.utils.game.StateGraphic;
import pixi.InteractionData;
import pixi.text.Text;

/**
 * Classe de base des boutons
 * @author Mathieu ANTHOINE
 */
class Button extends StateGraphic
{
	
	private static inline var UP:Int = 0;
	private static inline var OVER:Int = 1;
	private static inline var DOWN:Int = 2;
	
	public var onMouseOver:Dynamic;
	public var onMouseDown:Dynamic;
	public var onClick:Dynamic;
	public var onMouseOut:Dynamic;
	
	private var txt:Text;
	
	private var upStyle:TextStyle;
	private var overStyle:TextStyle;
	private var downStyle:TextStyle;
	
	public function new() 
	{
		
		super();
		boxType = BoxType.SELF;
		interactive = true;
		buttonMode = true;
		
		onMouseOver = _mouseVoid;
		onMouseDown = _mouseVoid;
		onClick = _mouseVoid;
		onMouseOut = _mouseVoid;
		
		click = tap = _click;
		mousedown = _mouseDown;
		mouseover = _mouseOver;
		mouseupoutside = mouseout = _mouseOut;
		
		initStyle();
		txt = new Text("",upStyle);
		txt.anchor.set(0.5, 0.5);		
		
		start();
		
	}
	
	private function initStyle ():Void {
		upStyle={ font: "80px Arial", fill: "#000000", align:"center"};
		overStyle={ font: "80px Arial", fill: "#AAAAAA", align:"center"};
		downStyle={ font: "80px Arial", fill: "#FFFFFF", align:"center"};
	}
	
	public function setText(pText:String):Void {
		txt.setText(pText);
	}
	
	public function setTint (pValue: Int): Void {
		anim.tint = pValue;
	}
	
	override private function setModeNormal ():Void {
		setState(DEFAULT_STATE);
		anim.anchor.set(0.5, 0.5);
		anim.gotoAndStop(UP);
		addChild(txt);
		super.setModeNormal();
	}
	
	private function _mouseVoid ():Void {}

	private function _click (pEvent:InteractionData): Void {
		anim.gotoAndStop(UP);
		txt.setStyle(upStyle);
		onClick(pEvent);
	}	
	
	private function _mouseDown (pEvent:InteractionData): Void {
		anim.gotoAndStop(DOWN);
		txt.setStyle(downStyle);
		onMouseDown(pEvent);
	}
	
	private function _mouseOver (pEvent:InteractionData): Void {
		anim.gotoAndStop(OVER);
		txt.setStyle(overStyle);
		onMouseOver(pEvent);
	}
	
	private function _mouseOut (pEvent:InteractionData): Void {
		anim.gotoAndStop(UP);
		txt.setStyle(upStyle);
		onMouseOut(pEvent);
	}
}