package com.isartdigital.utils.game;
import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.operationaaa.ui.hud.Hud;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.system.DeviceCapabilities;
import js.Browser;
import js.html.Rect;
import pixi.display.Stage;
import pixi.geom.Point;
import pixi.display.DisplayObject;
import pixi.geom.Rectangle;
import pixi.primitives.Graphics;
import pixi.renderers.webgl.WebGLRenderer;

/**
 * Classe Camera
 * @author Mathieu ANTHOINE
 */
class Camera {

	private var target:DisplayObject;
	private var focus:DisplayObject;
	private var inertiaMax:Point = new Point(40, 20);
	private var inertiaMin:Point = new Point(6.5, 8);
	private var countH:UInt = 40;
	private var delayH:UInt = 40;
	private var countV:UInt = 5;
	private var delayV:UInt = 60;
	private var idleCounter:Int = 0;
	private var idleDelay:Int = 60;
	private var isIdle:Bool;
	private var zoomSpeed:Float = 0.001;
	private var zoomMax:Float = 1.2;

	private var focusXOnCameraBlocked:Float = null;
	/**
	 * instance unique de la classe GamePlane
	 */
	private static var instance: Camera;

	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): Camera {
		if (instance == null) instance = new Camera();
		return instance;
	}

	private function new()
	{

	}

	/**
	 * Définit la cible de la caméra
	 * @param	pTarget cible
	 */
	public function setTarget (pTarget:DisplayObject): Void {
		if (pTarget.stage == null) {
			Debug.warn("L'élément que vous voulez cibler n'est pas attaché à la DisplayList, l'action est ignorée.");
			return;
		}
		target = pTarget;
	}

	/**
	 * Définit l'élement à repositionner au centre de l'écran
	 * @param	pFocus focus
	 */
	public function setFocus(pFocus:DisplayObject):Void {
		focus = pFocus;
	}

	/**
	 * Recadre la caméra
	 * @param	pDelay si false, la caméra est recadrée instantannément
	 * @return true si la caméra à bougé
	 */
	private function changePosition (?pDelay:Bool=true, ?pVLock: Bool=false) :Bool {
		
		countH++;
		countV++;
		
		var lCenter:Rectangle = DeviceCapabilities.getScreenRect(target.parent);
		var lFocus:Point = target.toLocal(focus.position, focus.parent);

		var lInertiaX:Float = pDelay ? getInertiaX() : 1;
		var lInertiaY:Float = pDelay ? getInertiaY() : 1;

		var lDeltaX:Float = (lCenter.x + lCenter.width / 2 - lFocus.x - target.x) / lInertiaX;
		var lDeltaY:Float = (lCenter.y + lCenter.height / 2 - lFocus.y - target.y) / lInertiaY;
		if (pVLock) lDeltaY = 0;
		

		// Permet de faire un zoom après une période d'inactivité, TODO : régler le problème du scale qui décale tout 
		/*if (Math.abs(lDeltaX) < 1) {
			isIdle = true;
		} else {
			isIdle = false;
			idleCounter = 0;
		}
		
		if (isIdle) idleCounter++;
		else idleCounter = 0;
		
		if (idleCounter>idleDelay) {
			if (target.scale.x < zoomMax) {
				target.scale.x += zoomSpeed;
				target.scale.y += zoomSpeed;
			}
		} else if(!isIdle) {
			if(target.scale.x > 1) {
				target.scale.x -= zoomSpeed * Math.abs(lDeltaX) / 10;
				target.scale.y -= zoomSpeed * Math.abs(lDeltaX) / 10;
			}
		}
		trace(lDeltaX, isIdle, idleCounter);
		*/
		
		var lMoved: Bool = true;
		if (Math.round(lDeltaX * 1000) / 1000 == 0 && Math.round(lDeltaY * 1000) / 1000 == 0 ) lMoved = false;
		
		if (!limitsHorizontalReached()) target.x+= lDeltaX;
		target.y += lDeltaY;
		return lMoved;
	}

	/**
	 * retourne une inertie en X variable suivant le temps
	 * @return inertie en X
	 */
	private function getInertiaX() : Float {
		if (countH > delayH) return inertiaMin.x;
		return inertiaMax.x + (inertiaMin.x-inertiaMax.x)*countH/delayH;
	}

	/**
	 * retourne une inertie en Y variable suivant le temps
	 * @return inertie en Y
	 */
	private function getInertiaY() : Float {
		if (countV > delayV) return inertiaMin.y;
		return inertiaMax.y + (inertiaMin.y-inertiaMax.y)*countV/delayV;
	}

	/**
	 * cadre instantannément la caméra sur le focus
	 */
	public function setPosition():Void {
		GameStage.getInstance().render();
		changePosition(false);
	}

	/** ATTENTION A CA, C'est simple mais ça lie fortement la caméra au player
	 * Vérifie si la caméra est bloquée par des Limits
	 * @return true si la caméra est bloquée par des limits à gauche ou à droite
	 */
	public function limitsHorizontalReached(): Bool {
		//var lScreen:Rectangle = DeviceCapabilities.getScreenRect(Player.getInstance());
		return Player.getInstance().x < 1700 && !Player.getInstance().isDead || Player.getInstance().x > LevelManager.getInstance().levelWidthInPixels - 1700;
	}
	
	/**
	 * cadre la caméra sur le focus avec de l'inertie
	 */
	public function move():Bool {
		return changePosition(true);
	}

	/**
	 * remet à zéro le compteur qui fait passer la caméra de l'inertie en X maximum à minimum
	 */
	public function resetX():Void {
		countH = 0;
	}

	/**
	 * remet à zéro le compteur qui fait passer la caméra de l'inertie en Y maximum à minimum
	 */
	public function resetY():Void {
		countV = 0;
	}

	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}

}