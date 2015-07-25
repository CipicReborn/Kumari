package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import pixi.display.DisplayObjectContainer;

/**
 * La classe GameObjectSetter représente une brique de GamePlay positionnée et paramétrée.
 * Elle peut être liée ou non à un GameObject la représentant à l'écran (attribut inGameInstance de type StateGraphic, qui peut être null).
 * 
 * Chaque Setter est initialisé grâce à l'objet dynamique du level.json, mais permet un typage strict au lieu de Dynamic.
 * @author Cyprien LARROUY
 */
class GameObjectSetter{
	
	// ====#### META-ATTRIBUTS ####====
	
	/**
	 * le nom d'instance de l'objet tel que référencé dans level.json et dans les listes d'objets graphiques
	 */
	public var id: String;
	
	/**
	 * Le nom de classe de la brique de GamePlay (Player, Collectable, EnemyFire, etc.)
	 */
	public var type (get, null): String;
	
	/**
	 * La classe qualifiée de la brique de GamePlay. à utiliser dans un Type.createInstance(object.class, []);
	 */
	public var objectClass: Class<Dynamic>;

	/**
	 * référence vers le GameObject en jeu, null si l'objet n'est pas en jeu
	 */
	public var inGameInstance: StateGraphic;

	
	// ====#### ATTRIBUTS DE POSITIONNEMENT ####====
	
	/**
	 * la position en x de la brique de GamePlay
	 */
	public var x (get, null): Int;
	
	/**
	 * La position en y de la brique de GamePlay
	 */
	public var y (get, null): Int;
	
	/**
	 * Le scaleX de la brique de GamePlay
	 */
	public var scaleX (get, null): Float;
	
	/**
	 * Le scaleY de la brique de GamePlay
	 */
	public var scaleY (get, null): Float;
	
	/**
	 * L'angle de rotation de la brique de GamePlay
	 */
	public var rotation (get, null): Float;
	
	/**
	 * Le plan de positionnement en z de la brique de GamePlay
	 */
	public var plane: DisplayObjectContainer;
	
	/**
	 * La liste des cells dans lesquelles la brique est présente
	 */
	public var cells: Array<String>;
	

	// ====#### MéTHODES ####====
	
	/**
	 * Créé un Setter en fonction des données du json passées en paramètre
	 * @param	pModel Les données du JSON
	 * @param	pClass La classe (dynamique) de l'objet à créer.
	 * @param	pId La référence d'instance dans le JSON
	 */
	public function new (pModel: Dynamic, pClass: Class<Dynamic>, pId: String) {
		
		id 			= pId.toString();
		type 		= pModel.type;
		objectClass = pClass;
		x 			= pModel.x;
		y 			= pModel.y;
		scaleX		= pModel.scaleX;
		scaleY		= pModel.scaleY;
		rotation 	= pModel.rotation;
		cells		= pModel.cells;
	}
	
	
	/**
	 * Prend un StateGraphic et le paramètre entièrement pour qu'il puisse représenter la brique de GamePlay à l'écran
	 * - positionnement en fonction des attributs de positionnement du Setter
	 * - ajout à l'écran et démarrage de l'objet (avec update pour les matrices de transformation StateGraphic)
	 * - paramétrage spécifique de la classe fille
	 * @return Le StateGraphic mis en place
	 */
	public function setupGameObject (): GameObject {
		
		inGameInstance = PoolManager.getInstance().getFromPool(type);
		if (inGameInstance == null) Debug.error('POOLING ISSUE - no inGameInstanceFound');
		// Paramétrage de positionnement
		inGameInstance.x = x;
		inGameInstance.y = y;
		inGameInstance.scale.set(scaleX/Math.abs(scaleX), scaleY/Math.abs(scaleY));
		inGameInstance.rotation = rotation * GameManager.DEG2RAD;
		if (plane == null) {
			Debug.error(id + 'of type ' + type + ' has no GamePlane layer associated with');
			return null;
		}
		
		// Ajout en jeu et démarrage
		plane.addChild(inGameInstance);
		inGameInstance.start();
		if (inGameInstance.hitBox == null) trace(id + ' of ' + type);
		inGameInstance.update();
		
		// Paramétrage spécifique à la classe fille (notamment ajout dans les listes)
		// TODO : cette méthode doit en fait être une méthode de l'instance de type inGameInstance.init({ objet de paramètres })
		specificSetup();
		
		//• Ne pas faire de new
		//• créez une variable (locale) du type qui vous intéresse, transtypez le résultat de 
		//PoolManager.getFromPool
		//• exécutez la méthode d'initialisation de l'instance
		//• positionnez, ajoutez à la displayList
		
		//if (type == LevelLoader.COLLECTABLE) trace(cast(inGameInstance, Collectable).hitPoint);
		return inGameInstance;
	}
	
	// pour override
	private function specificSetup(): Void {}
	
	//pour override
	/**
	 * Met l'instance InGame en ModeVoid et brise le lien avec le Setter
	 */
	public function unset(): Void {
		inGameInstance = null;
	}
	
	private function get_type (): String {
		return type;
	}
	
	private function get_x (): Int {
		return x;
	}
	
	private function get_y (): Int {
		return y;
	}
	
	private function get_scaleX (): Float {
		return scaleX;
	}
	
	private function get_scaleY (): Float {
		return scaleY;
	}
	
	private function get_rotation (): Float {
		return rotation;
	}
	
	private function get_id (): String {
		return id;
	}
}