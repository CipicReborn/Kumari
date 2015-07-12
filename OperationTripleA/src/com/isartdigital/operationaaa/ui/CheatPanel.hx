package com.isartdigital.operationaaa.ui;
import com.isartdigital.operationaaa.game.GameManager;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.operationaaa.game.sprites.Template;
import com.isartdigital.utils.Config;
import com.isartdigital.utils.effects.Trail;
import com.isartdigital.utils.game.Camera;
import dat.gui.GUI;

	
/**
 * Classe permettant de manipuler des parametres du projet au runtime
 * Si la propriété Config.debug et à false ou que la propriété Config.data.cheat est à false, aucun code n'est executé.
 * Il n'est pas nécessaire de retirer ou commenter le code du CheatPanel dans la version "release" du jeu
 * @author Mathieu ANTHOINE
 */
class CheatPanel 
{
	
	/**
	 * instance unique de la classe CheatPanel
	 */
	private static var instance: CheatPanel;
	
	/**
	 * instance de dat.GUI composée par le CheatPanel
	 */
	private var gui:GUI;
	private var trail:Trail;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): CheatPanel {
		if (instance == null) instance = new CheatPanel();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		init();
		//setPlayer();
	}
	
	private function init():Void {
		if (Config.debug && Config.data.cheat) gui = new GUI();
	}
	
	// exemple de méthode configurant le panneau de cheat suivant le contexte
	public function ingame (): Void {
		// ATTENTION: toujours intégrer cette ligne dans chacune de vos méthodes pour ignorer le reste du code si le CheatPanel doit être désactivé
		if (gui == null) return;
		
		
		gui.add(Player.getInstance(), "x", 0, 2048);
		gui.add(Player.getInstance(), "y", 0, 1366);
		
		gui.add(GameManager.getInstance(), "win");
		gui.add(GameManager.getInstance(), "winFinal");
		
		//setPlayer();
		setCamera();
	}
	
	public function setPlayer():Void {
		if (gui == null) return;
		
		var lPosition:GUI = gui.addFolder("position");
		lPosition.open();
		var lSpeed:GUI = gui.addFolder("speed");
		lSpeed.open();
		var lAcc:GUI = gui.addFolder("acceleration");
		lAcc.open();
		var lParams:GUI = gui.addFolder("friction");
		lParams.open();
		
		lPosition.add(untyped Player.getInstance(), "state").listen();
		//lPosition.add(Player.getInstance().position, "x").listen();
		//lPosition.add(Player.getInstance().position, "y").listen();
		//
		lSpeed.add(untyped Player.getInstance().speed, "x").listen();
		lSpeed.add(untyped Player.getInstance().speed, "y").listen();
		lSpeed.add(untyped Player.getInstance(), 'maxHSpeed').min(0).max(100).step(1).listen();
		lSpeed.add(untyped Player.getInstance(), 'maxVSpeed').min(0).max(100).step(1).listen();
		
		lAcc.add(untyped Player.getInstance().acceleration, "x").listen();
		lAcc.add(untyped Player.getInstance().acceleration, "y").listen();
		
		lParams.add(untyped Player.getInstance(), "accelerationGround").min(0).max(100).step(1).listen();
		lParams.add(untyped Player.getInstance(), "frictionGround").min(0).max(1).step(0.01).listen();
		lParams.add(untyped Player.getInstance(), "accelerationAir").min(0).max(100).step(1).listen();
		lParams.add(untyped Player.getInstance().frictionAir, "x").min(0).max(1).step(0.01).listen();
		lParams.add(untyped Player.getInstance().frictionAir, "y").min(0).max(1).step(0.01).listen();
		lParams.add(untyped Player.getInstance(), "GRAVITY_JUMP").min(0).max(20).step(1).listen();
		lParams.add(untyped Player.getInstance(), "GRAVITY_NORMAL").min(0).max(20).step(1).listen();
		lParams.add(untyped Player.getInstance(), "impulse").min(0).max(50).step(1).listen();
		lParams.add(untyped Player.getInstance(), "impulseDuration").listen();
		lParams.add(untyped Player.getInstance(), "impulseCounter").listen();
		//lParams.add(untyped Player.getInstance(), "counterDuration").min(0).max(20).step(1).listen();
		
		//gui.add(Player.getInstance(), "kill");

		trail = new Trail(Player.getInstance());


	}
	
	public function setCamera():Void {
		if (gui == null) return;
		var lParams:GUI = gui.addFolder("Parameters");
		lParams.open();
		
		var lFocus:GUI = gui.addFolder("Focus");
		lFocus.open();
		
		lParams.add(untyped Camera.getInstance().inertiaMax, "x").min(1).max(100).listen();
		lParams.add(untyped Camera.getInstance().inertiaMax, "y").min(1).max(100).listen();
		lParams.add(untyped Camera.getInstance().inertiaMin, "x").min(1).max(100).listen();
		lParams.add(untyped Camera.getInstance().inertiaMin, "y").min(1).max(100).listen();
		
		/*lParams.add(untyped Camera.getInstance(), "countH").min(1).max(100).listen();
		lParams.add(untyped Camera.getInstance(), "countV").min(1).max(100).listen();
		lParams.add(untyped Camera.getInstance(), "delayH").min(1).max(100).listen();
		lParams.add(untyped Camera.getInstance(), "delayV").min(1).max(100).listen();*/
		lFocus.add(untyped Player.getInstance().box.getChildByName("mcCamera").position , "x").step(5).listen();
		lFocus.add(untyped Player.getInstance().box.getChildByName("mcCamera").position , "y").step(5).listen();
	}
	
	
	/**
	 * vide le CheatPanel
	 */
	public function clear ():Void {
		if (gui == null) return;
		
		if (trail != null) {
			trail.destroy();
			trail = null;
		}
		
		gui.destroy();
		init();
	}	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}

}