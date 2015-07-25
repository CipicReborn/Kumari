package com.isartdigital.operationaaa.game.sprites;
import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.sounds.SoundManager;
import pixi.display.DisplayObjectContainer;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class Checkpoint extends Collisionnable {
	/**
	 * Liste des checkpoints
	*/
	public static var list: Map<String, StateGraphic> = new Map<String, StateGraphic>();
	
	/**
	 * Liste des checkpoints inactifs, celle que collisionnera le joueur pour éviter de tester les checkpoints déjà activés
	 */
	public static var inactiveList: Map<String, StateGraphic> = new Map<String, StateGraphic>();
	
	private static inline var ACTIVE_STATE: String  = "active";
	
	private var isScaled:Bool = false;
	public var isActivated:Bool = false;
	
	public function new () {
		
		super();
		assetName = 'Checkpoint';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	override public function start():Void {
		super.start();
	}
	
	/**
	 * Paramètre l'objet avant de l'ajouter à la DisplayList (après sortie du Pool)
	 * @param	pId la référence LD de l'objet
	 * @author	Cyprien
	 */
	 public function set (pId: String, pIsActivated: Bool): Void {
		//• Toute valeur spécifique à une instance doit être passée à cette méthode.
		//• Activer les écouteurs ici
		//• addChild l'instance
		//• list.push(this)
		//• lancer éventuellement le start ici
		id = pId;
		list.set(id , this);
		
		isActivated = pIsActivated;
		
		if (!isActivated) {
			inactiveList.set(id, this);
			setModeNormal();
		}
		else setModeActive();
	}
	
	/**
	 * Déparamètre l'objet avant de le remettre dans le Pool (après retrait de la DisplayList)
	 * @param	pIdla référence LD de l'objet
	 * @author	Cyprien
	 */
	public function unset (): Void {
		//• Désactivez les écouteurs et tout ce qui poursuivrait son exécution
		//• Passez en setModeVoid
		//• Retirez de list
		setModeVoid();
		if (id == null) trace ('WARNING: you are trying to remove a Checkpoint with no Id');
		if (!list.remove(id)) trace ('ERROR: removal of Checkpoint ' + id + ' has failed.') ;
		if (!isActivated && !inactiveList.remove(id)) trace ('ERROR: removal of Checkpoint ' + id + ' has failed.') ;
		isActivated = false;
	}
	
	
	override public function setModeNormal():Void {
		super.setModeNormal();
		if (!isActivated) setState(DEFAULT_STATE);
		else setState(ACTIVE_STATE);
		
		if (!isScaled) {
			anim.scale.x = anim.scale.y *= 2;
			isScaled = true;
		}
	}
	
	public function onCollision (): Void {
		
		SoundManager.getSound("activate_checkpoint").play();
		LevelManager.getInstance().setLastCheckpoint();
		setModeActive();
	}
	
	public function setModeActive(): Void {
		
		setState(ACTIVE_STATE);
		
		isActivated = true;
		
		if (id == null) trace ('WARNING: you are trying to remove a Checkpoint with no Id');
		if (!inactiveList.remove(id)) trace ('ERROR: removal of Checkpoint ' + id + ' has failed.') ;
		
	}
	
	override function get_hitBox():DisplayObjectContainer {
		if (!isActivated) return cast box.getChildByName("mcGlobalBox");
		return null;
	}
	
}