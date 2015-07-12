package com.isartdigital.utils;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.system.DeviceCapabilities;
import js.Browser;
import js.html.Image;
import js.stats.Stats;
import pixi.utils.EventTarget;

/**
 * Classe de Debug
 * @author Mathieu ANTHOINE
 */
class Debug
{

	/**
	 * instance unique de la classe Main
	 */
	private static var instance: Debug;	
	
	private var stats:Stats;
	private static inline var QR_SIZE:Float=0.35;

	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Debug {
		if (instance == null) instance = new Debug();
		return instance;
	}	
	
	private function new() {}
	
	/**
	 * initialisation du débogueur
	 * @param	pGameDispatcher
	 */
	public function init(pGameDispatcher:EventTarget):Void {
		if (Config.fps) {
			
			stats = new Stats();
			//stats.setMode(1); // 0: fps, 1: ms

			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			Browser.document.body.appendChild(stats.domElement);
			
			pGameDispatcher.addEventListener(GameEvent.GAME_LOOP, updateStats);
		}
		
		if (Config.qrcode) {
			var lQr:Image = new Image();
			lQr.style.position = 'absolute';
			lQr.style.right = '0px';
			lQr.style.bottom = '0px';
			var lSize:Int = Std.int(QR_SIZE * DeviceCapabilities.getSizeFactor());
			lQr.src = 'https://chart.googleapis.com/chart?chs='+lSize+'x'+lSize+'&cht=qr&chl=' + Browser.location.href + '&choe=UTF-8';
			Browser.document.body.appendChild(lQr);
		}
	}
	
	private function updateStats (pEvent:GameEvent):Void {
		stats.end();
		stats.begin();
	}
	
	public static function error (pArg:Dynamic): Void {
		untyped console.error (pArg);
	}
	
	public static function warn (pArg:Dynamic): Void {
		untyped console.warn (pArg);
	}

	public static function table (pArg:Dynamic): Void {
		untyped console.table (pArg);
	}

	public static function info (pArg:Dynamic): Void {
		untyped console.info (pArg);
	}

}