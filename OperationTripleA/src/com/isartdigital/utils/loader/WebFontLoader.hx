package com.isartdigital.utils.loader;

/**
 * extern pour webfontloader
 * @author Maxime Lo Re
 */

@:native("WebFont")
extern class WebFontLoader 
{	
	public static function load(WebConfig:Dynamic):Void;
}