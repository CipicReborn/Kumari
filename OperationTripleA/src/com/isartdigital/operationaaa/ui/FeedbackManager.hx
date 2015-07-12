package com.isartdigital.operationaaa.ui;
import com.isartdigital.operationaaa.ui.Feedback;
import com.isartdigital.operationaaa.ui.hud.Hud;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.game.GameStage;
import com.isartdigital.utils.game.StateGraphic;
import js.Browser;
import js.html.CustomEvent;
import pixi.display.Sprite;
import pixi.geom.Point;
import pixi.textures.Texture;

	
/**
 * ...
 * @author Cyprien LARROUY
 */
class FeedbackManager {
	
	private var leftThumbPosition: Point;
	private var rightThumbPosition: Point;
	
	private var leftTouchPositionFeedback: Feedback;
	private var leftTouchZeroFeedback: Feedback;
	private var shootInputFeedback: Feedback;
	private var chargedShootInputFeedback: Feedback;
	private var jumpInputFeedback: Feedback;
	private var doubleJumpInputFeedback: Feedback;
	private var rightThumbFeedback: Feedback;
	
	
	/**
	 * instance unique de la classe feedbackManager
	 */
	private static var instance: FeedbackManager;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): FeedbackManager {
		if (instance == null) instance = new FeedbackManager();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		
		Browser.window.addEventListener("leftTouchOriginEvent", feedbackLeftTouchOrigin);
		Browser.window.addEventListener("leftTouchMoveEvent", feedbackLeftTouchMove);
		Browser.window.addEventListener("leftTouchStopEvent", feedbackLeftTouchStop);
		
		Browser.window.addEventListener("rightTouchOriginEvent", feedbackRightTouchOrigin);
		Browser.window.addEventListener("rightTouchMoveEvent", feedbackRightTouchMove);
		Browser.window.addEventListener("rightTouchStopEvent", feedbackRightTouchStop);
		Browser.window.addEventListener("swapFeedbackToJumpEvent", feedbackSwapToJump);
		
		
		leftTouchPositionFeedback = new Feedback('leftcontrollerposition');
		leftTouchPositionFeedback.init();
		leftTouchZeroFeedback = new Feedback('leftcontrollerzero');
		leftTouchZeroFeedback.init();
		
		//rightTouchNormalTexture = Texture.fromImage(Config.assetsPath + "rightcontrollerzero.png");
		//rightTouchJumpTexture = Texture.fromImage(Config.assetsPath + "rightcontrollerjump.png");
		//rightTouchZeroFeedback = new Sprite(rightTouchNormalTexture);
		shootInputFeedback = new Feedback('fire');
		shootInputFeedback.init();
		chargedShootInputFeedback = new Feedback('charge');
		chargedShootInputFeedback.init();
		jumpInputFeedback = new Feedback('jump');
		jumpInputFeedback.init();
		doubleJumpInputFeedback = new Feedback('doublejump');
		doubleJumpInputFeedback.init();
		//
		//leftTouchPositionFeedback.anchor.set(0.5, 0.5);
		//leftTouchPositionFeedback.scale.set(0.5, 0.5);
		//
		//leftTouchZeroFeedback.anchor.set(0.5, 0.5);
		//leftTouchZeroFeedback.scale.set(0.5, 0.5);
		//
		//rightTouchZeroFeedback.anchor.set(0.5, 0.5);
		//rightTouchZeroFeedback.scale.set(0.5, 0.5);
		
		leftThumbPosition = new Point(0, 0);
		rightThumbPosition = new Point(0, 0);
		
		//trace("[FeedbackManager.new] FeedbackManager Created");
	}
	
	/**
	 * Callback sur un touchStart de la partie gauche de l'écran
	 * @param	pEvent
	 */
	private function feedbackLeftTouchOrigin (pEvent: CustomEvent): Void {
		
		//trace("[FeedbackManager.]");
		//trace("[FeedbackManager.feedbackLeftTouchOrigin] Start");
		
		//on récupère la position du pouce
		leftThumbPosition.set(pEvent.detail.position.x, pEvent.detail.position.y);
		
		//on cale le feedback de l'origine de l'input
		leftTouchZeroFeedback.position.set(leftThumbPosition.x, leftThumbPosition.y);
		Main.getInstance().stage.addChild(leftTouchZeroFeedback);
		
		//on cale le feedback de la position de l'input au même endroit
		leftTouchPositionFeedback.position.set(leftThumbPosition.x, leftThumbPosition.y);
		Main.getInstance().stage.addChild(leftTouchPositionFeedback);
		
		//trace("[FeedbackManager.feedbackLeftTouchOrigin] Complete");
	}
	
	/**
	 * Callback sur un touchMove de la partie gauche de l'écran
	 * @param	pEvent
	 */
	private function feedbackLeftTouchMove (pEvent: CustomEvent): Void {
		
		//trace(pEvent);
		//on récupère la position du pouce
		leftThumbPosition.set(pEvent.detail.position.x, pEvent.detail.position.y);
		
		// on recale la position de l'origine et de la position courante
		leftTouchZeroFeedback.position.set(pEvent.detail.origin.x, pEvent.detail.origin.y);
		leftTouchPositionFeedback.position.set(leftThumbPosition.x, leftThumbPosition.y);
	}
	
	/**
	 * Callback sur un touchEnd de la partie gauche de l'écran
	 * @param	pEvent
	 */
	private function feedbackLeftTouchStop (pEvent: CustomEvent): Void {
		
		//trace("[FeedbackManager.feedbackLeftTouchStop] Start");
		leftThumbPosition.set(pEvent.detail.x, pEvent.detail.y);
		
		leftTouchZeroFeedback.position.set(leftThumbPosition.x, leftThumbPosition.y);
		Main.getInstance().stage.removeChild(leftTouchZeroFeedback);
		
		leftTouchPositionFeedback.position.set(leftThumbPosition.x, leftThumbPosition.y);
		Main.getInstance().stage.removeChild(leftTouchPositionFeedback);
		
		//trace("[FeedbackManager.feedbackLeftTouchStop] Complete");
	}
	
	
	/**
	 * Callback sur un touchStart de la partie droite de l'écran > Feedback de tir normal
	 * @param	pEvent
	 */
	private function feedbackRightTouchOrigin (pEvent: CustomEvent): Void {
		
		//rightTouchZeroFeedback.setTexture(rightTouchNormalTexture);
		//rightTouchZeroFeedback.scale.set(0.6, 0.6);
		
		//trace("[FeedbackManager.feedbackRightTouchOrigin] Started");
		rightThumbPosition.set(pEvent.detail.position.x, pEvent.detail.position.y);
		
		//rightTouchZeroFeedback.position.set(rightThumbPosition.x, rightThumbPosition.y);
		//Main.getInstance().stage.addChild(rightTouchZeroFeedback);
		rightThumbFeedback = shootInputFeedback;
		rightThumbFeedback.position.set(rightThumbPosition.x, rightThumbPosition.y);
		Main.getInstance().stage.addChild(rightThumbFeedback);
		//trace(shootInputFeedback);
		
		//rightTouchPositionFeedback.position.set(rightThumbPosition.x, rightThumbPosition.y);
		//Hud.getInstance().hudBottomLeft.addChild(rightTouchPositionFeedback);
	}
	
	/**
	 * Callback sur un touchMove de la partie droite de l'écran
	 * @param	pEvent
	 */
	private function feedbackRightTouchMove (pEvent: CustomEvent): Void {
		
		rightThumbPosition.set(pEvent.detail.position.x, pEvent.detail.position.y);
		
		//rightTouchZeroFeedback.y = rightThumbPosition.y;
		rightThumbFeedback.y = rightThumbPosition.y;
	}
	
	/**
	 * Callback sur un touchEnd de la partie droite de l'écran
	 * @param	pEvent
	 */
	private function feedbackRightTouchStop (pEvent: CustomEvent): Void {
		
		rightThumbPosition.set(pEvent.detail.position.x, pEvent.detail.position.y);
		
		//rightTouchZeroFeedback.position.set(rightThumbPosition.x, rightThumbPosition.y);
		//Main.getInstance().stage.removeChild(rightTouchZeroFeedback);
		rightThumbFeedback.position.set(rightThumbPosition.x, rightThumbPosition.y);
		Main.getInstance().stage.removeChild(rightThumbFeedback);
		
		//rightTouchPositionFeedback.position.set(rightThumbPosition.x, rightThumbPosition.y);
		//Hud.getInstance().hudBottomLeft.removeChild(rightTouchPositionFeedback);
	}
	
	/**
	 * Callback quand l'input droit passe de tir à saut
	 * @param	pEvent
	 */
	private function feedbackSwapToJump (pEvent: CustomEvent): Void {
		//trace("Swap");
		//rightTouchZeroFeedback.setTexture(rightTouchJumpTexture);
		//rightTouchZeroFeedback.scale.set(0.8, 0.8);
		
		Main.getInstance().stage.removeChild(rightThumbFeedback);
		rightThumbFeedback = jumpInputFeedback;
		rightThumbFeedback.position.set(rightThumbPosition.x, rightThumbPosition.y);
		Main.getInstance().stage.addChild(rightThumbFeedback);
		
		//rightTouchZeroFeedback.scale.set(0.8, 0.8);
	}
	
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}

}