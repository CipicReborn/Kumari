package com.isartdigital.operationaaa.controller;
import com.isartdigital.operationaaa.Main;
import com.isartdigital.operationaaa.ui.hud.Hud;
import js.Browser;
import js.html.CustomEvent;
import js.html.TouchEvent;
import pixi.display.DisplayObject;
import pixi.display.DisplayObjectContainer;
import pixi.geom.Point;
import pixi.InteractionData;

	
/**
 * ...
 * @author Cyprien LARROUY
 */
class TouchController extends Controller {
	
	/**
	 * instance unique de la classe TouchController
	 */
	private static var instance: TouchController;
	
	public static inline var INPUT_DETECTION_TRESHOLD: Int = 10;
	public static inline var LEFT_INPUT_MAX_SPREAD: Int = 100;
	public static var RAD2DEG: Float = 180/Math.PI;
	
	
	private var leftTouchIndex: Int;
	private var rightTouchIndex: Int;
	
	private var leftTouchOrigin: Point;
	private var rightTouchOrigin: Point;
	
	private var leftTouchPosition: Point;
	private var rightTouchPosition: Point;
	
	private var leftTouchVector: Point;
	private var rightTouchVector: Point;
	
	private var leftAngle: Float;
	private var rightAngle: Float;
	
	private var leftDirection: String;
	private var rightDirection: String;
	
	private var leftTouchOriginEvent: CustomEvent;
	private var leftTouchMoveEvent: CustomEvent;
	private var leftTouchStopEvent: CustomEvent;
	private var rightTouchOriginEvent: CustomEvent;
	private var rightTouchMoveEvent: CustomEvent;
	private var swapFeedbackToJumpEvent: CustomEvent;
	private var rightTouchStopEvent: CustomEvent;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): TouchController {
		if (instance == null) instance = new TouchController();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		super();
		
		init();
	}
	
	override function init (): Void {
		
		Hud.getInstance().initTouchZones();
		
		Hud.getInstance().leftTouchZone.touchstart = touchLeftStart;
		Hud.getInstance().leftTouchZone.touchmove = touchLeftMove;
		Hud.getInstance().leftTouchZone.touchend = touchLeftEnd;
		Hud.getInstance().leftTouchZone.touchendoutside = touchLeftEnd;
		
		Hud.getInstance().rightTouchZone.touchstart = touchRightStart;
		Hud.getInstance().rightTouchZone.touchmove = touchRightMove;
		Hud.getInstance().rightTouchZone.touchend = touchRightEnd;
		Hud.getInstance().rightTouchZone.touchendoutside = touchRightEnd;
		
		//var lBottomLeft: TouchDetectionZone = Hud.getInstance().leftTouchZone;	
		//trace("Hud Bottom Left (x, y, width, height) : " + lBottomLeft.x + ", " + lBottomLeft.y + ", " + lBottomLeft.width + ", " + lBottomLeft.height);
		
		leftTouchIndex = null;
		rightTouchIndex = null;
		
		leftTouchOrigin = new Point(0, 0);
		leftTouchPosition = new Point(0, 0);
		leftTouchVector = new Point(0, 0);
		
		rightTouchOrigin = new Point(0, 0);
		rightTouchPosition = new Point(0, 0);
		rightTouchVector = new Point(0, 0);
		
		leftTouchOriginEvent = new CustomEvent('leftTouchOriginEvent');
		leftTouchMoveEvent = new CustomEvent('leftTouchMoveEvent');
		leftTouchStopEvent = new CustomEvent('leftTouchStopEvent');
		rightTouchOriginEvent = new CustomEvent('rightTouchOriginEvent');
		rightTouchMoveEvent = new CustomEvent('rightTouchMoveEvent');
		swapFeedbackToJumpEvent = new CustomEvent('swapFeedbackToJumpEvent');
		rightTouchStopEvent = new CustomEvent('rightTouchStopEvent');
		
		trace("Init Touch Done");
	}
	
	private function touchLeftStart (pEvent: InteractionData): Void {
		
		//trace("[TouchController.touchLeftStart] Starting");
		
		var lEvent: TouchEvent = untyped pEvent.originalEvent;
		
		lEvent.preventDefault();
		
		leftTouchIndex = lEvent.touches.length - 1;
		
		leftTouchOrigin.set(lEvent.touches[leftTouchIndex].clientX, lEvent.touches[leftTouchIndex].clientY);
		
		//// Dispatch Event écouté par l'UI Manager pour le feedback visuel. On envoie l'origine de l'input
		leftTouchOriginEvent.initCustomEvent('leftTouchOriginEvent', false, false, { "origin" : leftTouchOrigin, "position" : leftTouchOrigin } );
		Browser.window.dispatchEvent(leftTouchOriginEvent);
	}
	
	private function touchLeftMove (pEvent: InteractionData): Void {
			
		var lEvent: TouchEvent = untyped pEvent.originalEvent;
		lEvent.preventDefault();
		
		leftTouchPosition.set(lEvent.touches[leftTouchIndex].clientX, lEvent.touches[leftTouchIndex].clientY);
		leftTouchOrigin.y = leftTouchPosition.y;
		
		// calcul du vecteur entre l'origine et la nouvelle position
		leftTouchVector.set(leftTouchPosition.x - leftTouchOrigin.x, 0);
		
		
		if (leftTouchVector.x > LEFT_INPUT_MAX_SPREAD) {
			leftTouchOrigin.x = leftTouchPosition.x - LEFT_INPUT_MAX_SPREAD;
		} else if (leftTouchVector.x < -LEFT_INPUT_MAX_SPREAD) {
			leftTouchOrigin.x = leftTouchPosition.x + LEFT_INPUT_MAX_SPREAD;
		}
		leftTouchVector.set(leftTouchPosition.x - leftTouchOrigin.x, 0);
		
		// calcul de l'angle entre le vecteur unitaire (leftTouchOrigin, x) et le vecteur unitaire (leftTouchOrigin, leftTouchPosition)
		leftAngle = Math.round(Math.atan2(leftTouchVector.y, leftTouchVector.x) * RAD2DEG);
		
		// identification de la direction de l'input
			 if (leftAngle >= 0 && leftAngle <= 45) { leftDirection = "right";  }
		else if (leftAngle > 45 && leftAngle <= 135) { leftDirection = "down";  }
		else if (leftAngle > 135 && leftAngle <= 180) { leftDirection = "left";  }
		else if (leftAngle < 0 && leftAngle >= -45) { leftDirection = "right";  }
		else if (leftAngle < -45 && leftAngle >= -135) { leftDirection = "up";  }
		else if (leftAngle < -135 && leftAngle >= -180) { leftDirection = "left"; }
		
		// identification de l'input correspondant (limitation du seuil de détection TRESHOLD)
		// left :
		if (leftTouchVector.x < -INPUT_DETECTION_TRESHOLD && leftDirection == "left") { left = true; }
		else { left = false; }
		
		// right :
		if (leftTouchVector.x > INPUT_DETECTION_TRESHOLD && leftDirection == "right") { right = true; }
		else { right = false; }
		
		// up :
		if (leftTouchVector.y < -INPUT_DETECTION_TRESHOLD && leftDirection == "up") { up = true; }
		else { up = false; }
		
		// down :
		if (leftTouchVector.y > INPUT_DETECTION_TRESHOLD && leftDirection == "down") { down = true; }
		else { down = false; }
		
		// Dispatch Event écouté par l'UI Manager pour le feedback visuel. On envoie la nouvelle position
		leftTouchMoveEvent.initCustomEvent('leftTouchMoveEvent', false, false, { "origin" : leftTouchOrigin, "position" : leftTouchPosition } );
		Browser.window.dispatchEvent(leftTouchMoveEvent);
		
		//trace(direction);
		//trace(leftTouchVector);
	}
	
	private function touchLeftEnd (pEvent: InteractionData): Void {
		
		var lEvent: TouchEvent = untyped pEvent.originalEvent;
		lEvent.preventDefault();
		
		up = false;
		down = false;
		left = false;
		right = false;
		
		// Dispatch Event écouté par l'UI Manager pour le feedback visuel.
		leftTouchStopEvent.initCustomEvent('leftTouchStopEvent', false, false, { "origin" : leftTouchOrigin, "position" : leftTouchPosition } );
		Browser.window.dispatchEvent(leftTouchStopEvent);
	}
	
	private function touchRightStart (pEvent: InteractionData): Void {
		
		// on cast l'Event générique en TouchEvent, et on empêche le comportement par défaut
		var lEvent: TouchEvent = untyped pEvent.originalEvent;
		lEvent.preventDefault();
		
		// on enregistre l'id de la touche pour ne pas se mélanger entre pouce droit et pouce gauche
		rightTouchIndex = lEvent.touches.length - 1;
		
		// on enregistre la position en tant qu'origine et comme position courante
		rightTouchOrigin.set(lEvent.touches[rightTouchIndex].clientX, lEvent.touches[rightTouchIndex].clientY);
		rightTouchPosition.set(rightTouchOrigin.x, rightTouchOrigin.y);
		
		// on réinitialise les variables au cas ou (peut-être à supprimer)
		fire = true;
		jump = false;
		
		//// Dispatch Event écouté par l'UI Manager pour le feedback visuel. On envoie l'origine de l'input
		rightTouchOriginEvent.initCustomEvent('rightTouchOriginEvent', false, false, { "origin" : rightTouchOrigin, "position" : rightTouchPosition } );
		Browser.window.dispatchEvent(rightTouchOriginEvent);
	}
	
	private function touchRightMove (pEvent: InteractionData): Void {
		
		var lEvent: TouchEvent = untyped pEvent.originalEvent;
		lEvent.preventDefault();
		
		
		
		rightTouchPosition.set(lEvent.touches[rightTouchIndex].clientX, lEvent.touches[rightTouchIndex].clientY);
		
		// calcul du vecteur entre l'origine et la nouvelle position
		rightTouchVector.set(rightTouchPosition.x - rightTouchOrigin.x, rightTouchPosition.y - rightTouchOrigin.y);
		
		// calcul de l'angle entre le vecteur unitaire (rightTouchOrigin, x) et le vecteur unitaire (rightTouchOrigin, rightTouchPosition)
		rightAngle = Math.round(Math.atan2(rightTouchVector.y, rightTouchVector.x) * RAD2DEG);
		
		// identification de la direction de l'input
		if (rightAngle < -45 && rightAngle >= -135) { rightDirection = "up";  }
		else { rightDirection = ""; }
		
		// identification de l'input correspondant (limitation du seuil de détection TRESHOLD)
		// up :
		if (rightTouchVector.y < -INPUT_DETECTION_TRESHOLD && rightDirection == "up") {
			
			//si l'input n'était pas déjà à jump on switch
			if (!jump) Browser.window.dispatchEvent(swapFeedbackToJumpEvent);
			
			jump = true;
			fire = false;
			swapFeedbackToJumpEvent.initCustomEvent('swapFeedbackToJumpEvent', false, false, {  } );
			
		}

		
		// Dispatch Event écouté par l'UI Manager pour le feedback visuel. On envoie la nouvelle position
		rightTouchMoveEvent.initCustomEvent('rightTouchMoveEvent', false, false, { "origin" : rightTouchOrigin, "position" : rightTouchPosition } );
		Browser.window.dispatchEvent(rightTouchMoveEvent);
		
		//trace(rightDirection);
		//trace(rightTouchVector);
	}
	
	private function touchRightEnd (pEvent: InteractionData): Void {
		
		var lEvent: TouchEvent = untyped pEvent.originalEvent;
		lEvent.preventDefault();
		
		jump = false;
		fire = false;
		
		// Dispatch Event écouté par l'UI Manager pour le feedback visuel.
		rightTouchStopEvent.initCustomEvent('rightTouchStopEvent', false, false, { "origin" : rightTouchOrigin, "position" : rightTouchPosition } );
		Browser.window.dispatchEvent(rightTouchStopEvent);
	}
	
	override function get_up():Bool {
		return up;
	}
	override function get_down():Bool {
		return down;
	}
	override function get_left():Bool {
		return left;
	}
	override function get_right():Bool {
		return right;
	}
	override function get_jump():Bool {
		return jump;
	}
	override function get_fire():Bool {
		return fire;
	}
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	override public function destroy (): Void {
		instance = null;
	}

}