package com.isartdigital.utils.game;

import com.isartdigital.operationaaa.game.sprites.Player;
import com.isartdigital.utils.system.DeviceCapabilities;
import com.isartdigital.utils.loader.Loader;
import haxe.Json;
import js.Lib;
import pixi.display.DisplayObject;
import pixi.display.DisplayObjectContainer;
import pixi.display.MovieClip;
import pixi.geom.Circle;
import pixi.geom.Ellipse;
import pixi.geom.Point;
import pixi.geom.Rectangle;
import pixi.primitives.Graphics;
import pixi.textures.Texture;

/**
 * Classe de base des objets interactifs ayant plusieurs états graphiques
 * Gère la représentation graphique (anim) et les conteneurs utiles au gamePlay (box) qui peuvent être de simples boites de collision ou beaucoup plus
 * suivant l'implémentation faite par le développeur dans les classes filles
 * @author Mathieu ANTHOINE
 */
class StateGraphic extends GameObject 
{
	/**
	 * anim de l'état courant
	 */
	private var anim:MovieClip;
	
	/**
	 * box de l'état courant
	 */
	private var box:DisplayObjectContainer;
	
	/**
	 * suffixe du nom d'export des symboles Animés
	 */
	private static inline var ANIM_SUFFIX:String = "";
	
	/**
	 * suffixe du nom d'export des symboles Box
	 */
	private static inline var BOX_SUFFIX:String = "box";	
	
	/**
	 * longueur de la numérotation des textures
	 */
	public static var textureDigits (default, set) :UInt = 4;
	
	private static function set_textureDigits (pDigits:UInt) : UInt {
		digits = "";
		for (i in 0...pDigits) digits += "0";
		return textureDigits = pDigits;	
	}
	
	/**
	 * nombre de zéro a ajouter pour construire un nom de frame
	 */
	private static var digits:String;
	
	/**
	 * etat par défaut
	 */
	private var DEFAULT_STATE (default, null): String = "";
	
	/**
	 * Nom de l'asset (sert à identifier les textures à utiliser)
	 * Prend le nom de la classe Fille par défaut
	 */
	private var assetName:String;
	
	/**
	 * état en cours
	 */
	private var state:String;
	
	/**
	 * Type de box de collision
	 * Si boxType est égal à BoxType.NONE, aucune collision ne se fait, il n'est pas nécessaire d'avoir une boite de collision définie
	 * Si boxType est égal à BoxType.SIMPLE, seul un symbole sert de Box pour tous les états, son nom d'export etant assetName+"_"+BOX_SUFFIX
	 * Si boxType est égal à BoxType.MULTIPLE, chaque state correspond à une boite de collision, chaque state va cherche la boite assetName+"_"+ANIM_SUFFIX+"_"+BOX_SUFFIX
	 * Si boxType est égal à BoxType.SELF, hitBox retourne le MovieClip anim
	 */
	private var boxType:BoxType=BoxType.NONE;
	
	/**
	 * niveau d'alpha des anim
	 */
	public static var animAlpha:Float = 1;
	
	/**
	 * niveau d'alpha des Boxes
	 */
	public static var boxAlpha:Float = 0;
	
	/**
	 * définition des textures (nombre d'images)
	 */
	private static var texturesDefinition:Map<String,Int>;
	
	/**
	 * cache des textures de tous les StateGraphic
	 */
	private static var texturesCache:Map<String,Array<Texture>>;
	
	/**
	 * cache des ancres de tous les StateGraphic
	 */
	private static var anchorsCache:Map<String,Point>;
	
	/**
	 * cache des boxes de tous les StateGraphic
	 */
	private static var boxesCache:Map<String,Map<String,Dynamic>>;
	
	/**
	 * l'anim est-elle terminée ?
	 */
	public var isAnimEnd (default, null):Bool;
	
	private function setAnimEnd ():Void {
		isAnimEnd = true;
	}
	
	public function new() {
		super();
	}
	
	/**
	 * défini l'état courant du StateGraphic
	 * @param	pState nom de l'état (run, walk...)
	 * @param	pLoop l'anim boucle (isAnimEnd sera toujours false) ou pas
	 * @param	pAutoPlay lance l'anim automatiquement
	 * @param	pStart lance l'anim à cette frame
	 */
	private function setState (pState:String, ?pLoop:Bool = false, ?pAutoPlay:Bool=true, ?pStart:UInt = 0): Void {

		if (state == pState) return;
		
		if (assetName == null) assetName = Type.getClassName(Type.getClass(this)).split(".").pop();
		
		state = pState;
		
		if (anim == null) {
			anim = new MovieClip(getTextures(state));
			anim.scale.set(1 / DeviceCapabilities.textureRatio , 1 / DeviceCapabilities.textureRatio);
			if (animAlpha < 1) anim.alpha = animAlpha;
			addChild(anim);
		} else anim.textures = getTextures(state);
		
		isAnimEnd = false;
		anim.onComplete = setAnimEnd;
		
		anim.loop = pLoop;		
		if (anim.totalFrames > 1) anim.gotoAndStop(pStart);
		else anim.gotoAndStop(0);
		if (pAutoPlay) anim.play();
		
		if (box == null) {
			if (boxType == BoxType.SELF) {
				box = anim;
				return;
			} else {
				box = new DisplayObjectContainer();
				if (boxType != BoxType.NONE) createBox();
			}
			addChild(box);
		} else if (boxType == BoxType.MULTIPLE) {
			removeChild(box);
			box = new DisplayObjectContainer();
			createBox();
			addChild(box);
		} 
		
		setAnimAnchor(pState);
	}
	
	
	/**
	 * Force la mise à jour de la matrices de transformation des éléments constituant le StateGraphic
	 */
	public function update (): Void {
		if (stage == null) {
			Debug.warn("[StateGraphic.update] Vous essayez de mettre à jour un StateGraphic qui n'est pas attaché à la DisplayList, la mise à jour est ignorée.");
			return;
		}
		untyped this.updateTransform();
		if (hitBox == null) {
			Debug.warn("StateGraphic.update] Vous essayez de mettre à jour un StateGraphic qui n'est pas été setState : " + id);
			return;
		}
		untyped hitBox.updateTransform();
		
		for (i in 0...hitBox.children.length) {
			untyped hitBox.getChildAt(i).updateTransform();
		}

	}
	
	
	/**
	 * crée la ou les box de collision de l'état
	 */
	private function createBox ():Void {
		var lBoxes:Map<String,Dynamic> = getBox((boxType == BoxType.MULTIPLE ? state+ "_": "" )  + BOX_SUFFIX);
		var lChild:Graphics;
		
		for (lBox in lBoxes.keys()) {
			lChild = new Graphics();
			lChild.alpha = boxAlpha;
			lChild.beginFill(0xFF2222);
			if (Std.is(lBoxes[lBox], Rectangle)) {
				lChild.drawRect(lBoxes[lBox].x, lBoxes[lBox].y, lBoxes[lBox].width, lBoxes[lBox].height);
			}
			else if (Std.is(lBoxes[lBox], Ellipse)) {
				lChild.drawEllipse(lBoxes[lBox].x, lBoxes[lBox].y, lBoxes[lBox].width, lBoxes[lBox].height);
			}
			else if (Std.is(lBoxes[lBox], Circle)) {
				lChild.drawCircle(lBoxes[lBox].x,lBoxes[lBox].y,lBoxes[lBox].radius);
			}
			else if (Std.is(lBoxes[lBox], Point)) {
				lChild.drawCircle(0, 0, 10);
			}
			lChild.endFill();
			lChild.updateCache();
			
			lChild.name = lBox;
			if (Std.is(lBoxes[lBox], Point)) lChild.position.set(lBoxes[lBox].x, lBoxes[lBox].y);
			else lChild.hitArea = lBoxes[lBox];
			 
			box.addChild(lChild);
		}
		box.renderable = false;
	}

	/**
	 * Analyse et crée les définitions de textures
	 * @param	pJson Fichier contenant la description des assets
	 */
	static public function addTextures (pJson:Json): Void {
		
		var lFrames:Dynamic = Reflect.field(pJson, "frames");
		
		if (texturesDefinition == null) texturesDefinition = new Map<String,Int>();
		if (digits == null) textureDigits = textureDigits;
		
		var lID:String;
		var lNum:Int;
		
		for (lID in Reflect.fields(lFrames)) {
			
			lID = lID.split(".")[0];
			lNum = Std.parseInt(lID.substr(-1*textureDigits));
			if (lNum != null) lID = lID.substr(0, lID.length - textureDigits);
			
			if (texturesDefinition[lID] == null) texturesDefinition[lID] = lNum == null ? 1 : lNum;
			else if (lNum > texturesDefinition[lID]) texturesDefinition[lID] = lNum;
			
		}
		
		if (texturesCache == null) texturesCache = new Map<String,Array<Texture>>();
	}
	
	/**
	 * Vide le cache de textures correspondant à la description passée en paramètres
	 * @param	pJson Fichier contenant la description des assets
	 */
	static public function clearTextures (pJson:Json): Void {
		
		var lFrames:Dynamic = Reflect.field(pJson, "frames");
		
		if (texturesDefinition == null) return;
		
		var lID:String;
		var lNum:Int;
		
		for (lID in Reflect.fields(lFrames)) {
			
			lID = lID.split(".")[0];
			lNum = Std.parseInt(lID.substr(-1*textureDigits));
			if (lNum != null) lID = lID.substr(0, lID.length - textureDigits);
			
			texturesDefinition[lID] = null;
			texturesCache[lID] = null;
		}
	}	

	/**
	 * Cherche dans le cache général de textures le tableau de textures correspondant au state et le retourne.
	 * Si le tableau de texture n'éxiste pas, il le crée et le stocke dans le cache
	 * @param	pState State de l'instance
	 * @return	le tableau de texture correspondant au state de l'instance
	 */
	private function getTextures(pState:String):Array<Texture> {
		
		var lID:String;
		
		if (pState == DEFAULT_STATE) lID = assetName+ANIM_SUFFIX;
		else lID = assetName+"_" + pState+ANIM_SUFFIX;
		
		if (texturesCache[lID] == null) {
			var lFrames:UInt = texturesDefinition[lID];
			if (lFrames == 1) texturesCache[lID] =[Texture.fromFrame(lID+".png")];
			else {
				texturesCache[lID] = new Array<Texture>();
				for (i in 1...lFrames+1) texturesCache[lID].push(Texture.fromFrame(lID+(digits + i).substr(-1*textureDigits) + ".png"));
			}
			
		}
		return texturesCache[lID];
	}	
	
	/**
	 * Créer toutes les Boxes
	 * @param	pJson Fichier contenant la description des boxes
	 */
	static public function addBoxes (pJson:Json): Void {
		
		if (boxesCache == null) boxesCache = new Map<String,Map<String,Dynamic>>();
		
		var lItem;
		var lObj;
		for (lName in Reflect.fields(pJson)) {
			lItem = Reflect.field(pJson, lName);
			boxesCache[lName] = new Map<String,Dynamic>();			
			
			for (lObjName in Reflect.fields(lItem)) {
				lObj = Reflect.field(lItem, lObjName);
				
				if (lObj.type == "Rectangle") boxesCache[lName][lObjName] = new Rectangle(lObj.x, lObj.y, lObj.width, lObj.height);
				else if (lObj.type == "Ellipse") boxesCache[lName][lObjName] = new Ellipse(lObj.x, lObj.y, lObj.width/2, lObj.height/2);
				else if (lObj.type == "Circle") boxesCache[lName][lObjName] = new Circle(lObj.x, lObj.y, lObj.radius);
				else if (lObj.type == "Point") boxesCache[lName][lObjName] = new Point(lObj.x, lObj.y);

			}
			
		}
		
	}
	
	/**
	 * Cherche dans le cache général des boxes, celle correspondant au state demandé
	 * @param	pState State de l'instance
	 * @return	la box correspondante
	 * @return
	 */
	public function getBox (pState:String):Map<String,Dynamic> {
		return boxesCache[assetName+"_" +pState];
	}		
	
	/**
	 * Ajoute les ancres du fichier au cache des ancres
	 * @param	pJson Fichier contenant les coordonnées des ancres de chaque anim
	 */
	public static function addAnchors (pJson:Json):Void {
		if (anchorsCache == null) anchorsCache = new Map<String, Point>();
		
		var lAnchor;
		for (lName in Reflect.fields(pJson)) {
			lAnchor = Reflect.field(pJson, lName);
			anchorsCache[lName] = new Point(lAnchor.x, lAnchor.y);
		}
	}
	
	/**
	 * Cherche dans le cache des ancres, l'ancre correspondant à celle demandée
	 * @param	pState L'état dont on veut l'ancre
	 * @return  l'ancre sous forme d'un Point
	 */
	private function getAnchor(pState:String):Point {
		var lAnchorName:String;
		
		if(pState == DEFAULT_STATE) {
			lAnchorName = assetName;
		} else {
			lAnchorName = assetName + '_' + pState;
		}
		return anchorsCache[lAnchorName];
	}
	
	/**
	 * Repositionne l'anim en fonction de l'ancre de cette anim
	 */
	private function setAnimAnchor(pState:String):Void {
		
		
		var lAnchor:Point = getAnchor(pState);
		if (lAnchor != null) anim.pivot.set(lAnchor.x , lAnchor.y);
		//else {
			//trace("[StateGraphic.setAnimAnchor] Attention : Vous tentez d'affecter la position d'une ancre non spécifiée à votre anim d'assetName " + assetName + "_" + state);
		//}
		
	}
	
	/**
	 * met en pause l'anim
	 */
	public function pause ():Void {
		if (anim != null) anim.stop();
	}
	
	/**
	 * relance l'anim
	 */
	public function resume ():Void {
		if (anim != null) anim.play();
	}
	
	/**
	 * retourne la zone de hit de l'objet
	 */
	public var hitBox (get, null):DisplayObjectContainer;
	 
	private function get_hitBox (): DisplayObjectContainer {
		return box;
		// Si on veut cibler une box plus précise: return box.getChildByName("nom d'instance du MovieClip de type Rectangle ou Circle dans Flash IDE");
	}

	/**
	 * retourne un tableau de points de collision dont les coordonnées sont exprimées dans le systeme global
	 */
	public var hitPoints (get, null): Array<Point>;
	 
	private function get_hitPoints (): Array<Point> {
		return null;
		// liste de Points : return [box.toGlobal(box.getChildByName("nom d'instance du MovieClip de type Point dans Flash IDE").position,box.toGlobal(box.getChildByName("nom d'instance du MovieClip de type Point dans Flash IDE").position];
	}
	
	/**
	 * nettoyage et suppression de l'instance
	 */
	override public function destroy (): Void {
		
		anim.stop();
		removeChild(anim);
		anim = null;
		removeChild(box);
		box = null;
		super.destroy();
	}
	
}