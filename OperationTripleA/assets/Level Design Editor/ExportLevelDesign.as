package  {
	
	import flash.display.InteractiveObject;
	import flash.display.MovieClip;
	import flash.utils.*;
	import flash.display.DisplayObjectContainer;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	import flash.events.Event;
	import flash.display.DisplayObject;
	import flash.geom.Point;
	
	
	
	public class ExportLevelDesign extends MovieClip {
		
		static private var collectableCount: int = 0;
		
		private var content:Object;
		private var file: FileReference;
		private var level:String;
		
		private var playerFound: Boolean = false;
		
		public function ExportLevelDesign() {
			stop();
			browse();
		}
		
		private function browse (pEvent:Event=null): void {
			browseLevel(DisplayObjectContainer(getChildAt(0)));
			if (pEvent==null) nextFrame();
		}
		
		private function browseLevel (pChild:DisplayObjectContainer): void {
			
			content = { 
				objects: {},
				leveldesign: []
			};
			file = new FileReference();			
			
			var lItem;
			var lName:String;
			trace('ok');
			for (var i:int = 0; i < pChild.numChildren ; i++) {
				lItem=pChild.getChildAt(i);
				if (lItem is DisplayObjectContainer) {
					lName=lItem.name;
					trace('ok ' + lName);
					content.objects[lName] 				= {};
					content.objects[lName].type			= getQualifiedClassName(lItem);
					content.objects[lName].x 			= Math.round(lItem.x);
					content.objects[lName].y 			= Math.round(lItem.y);
					content.objects[lName].width 		= Math.round(lItem.width);
					content.objects[lName].height		= Math.round(lItem.height);
					content.objects[lName].scaleX		= Math.round(lItem.scaleY * 10) / 10;
					content.objects[lName].scaleY		= Math.round(lItem.scaleY * 10) / 10;
					content.objects[lName].rotation 	= lItem.rotation;
					content.objects[lName].cells		= getCells(lItem);
					
					if (getQualifiedClassName(lItem).indexOf('Enemy') != -1) {
						if (Math.round(lItem.rotation) == 0) {
							content.objects[lName].scaleX = 1;
							content.objects[lName].rotation = 0;
						} else if (Math.round(lItem.rotation) == 180) {
							content.objects[lName].scaleX = -1;
							content.objects[lName].rotation = 0;
						}
					}
					
					if (getQualifiedClassName(lItem) == 'Collectable') {
						content.objects[lName].id = collectableCount;
						collectableCount++;
					}
					
					
					if (lName == 'player') {
						playerFound = true; //requis pour la sauvegarde
					} else {
						
						// si ce n'est pas le player on le met dans la grille virtuelle du LD pour le clipping
						var lLength: int = content.objects[lName].cells.length;
						
						for (var j:int = 0; j < lLength ; j++) {
							var lCell = content.objects[lName].cells[j];
							if (content.leveldesign[lCell.x] == undefined) content.leveldesign[lCell.x] = [];
							if (content.leveldesign[lCell.x][lCell.y] == undefined) content.leveldesign[lCell.x][lCell.y] = [];
							
							content.leveldesign[lCell.x][lCell.y].push(lName);
						}
					}
				}
			}
			
			
			
			
			//trace (JSON.stringify(content,null,"\t"));
			
			if (!playerFound) {
				trace('ATTENTION : Vous devez renseigner le nom d\'occurrence "player" sur le player pour autoriser l\'export du Level');
				return;
			}
			var lData:ByteArray = new ByteArray();
			lData.writeMultiByte(JSON.stringify(content,null,"\t"), "utf-8" );

			if (currentFrame<totalFrames) file.addEventListener(Event.COMPLETE,browse);
			
			file.save(lData, getQualifiedClassName(pChild)+".json" );
			
			trace('================ SAVE COMPLETE =================');
			
		}
		
		private function getCells (lItem: DisplayObjectContainer): Vector.<Object> {
			
			var lCells: Vector.<Object> = new Vector.<Object>();
			var lTopLeft = new Point(Math.floor(lItem.x / 280), Math.floor(lItem.y /280));
			var lTopRight = new Point(Math.floor((lItem.x + lItem.width) / 280), Math.floor(lItem.y /280));
			var lBottomRight = new Point(Math.floor((lItem.x + lItem.width) / 280), Math.floor((lItem.y + lItem.height )/280));
			var lBottomLeft = new Point(Math.floor(lItem.x / 280), Math.floor((lItem.y + lItem.height )/280));
			
			var gridXmin: int = Math.floor(Math.floor(lItem.x) / 280);
			var gridXmax: int = Math.ceil((Math.floor(lItem.x) + lItem.width) / 280)-1;
			var gridYmin: int = Math.floor(Math.floor(lItem.y) / 280);
			var gridYmax: int = Math.ceil((Math.floor(lItem.y) + lItem.height) / 280)-1;
			
			for	(var col: int = gridXmin ; col <= gridXmax ; col++) {
				for (var row: int = gridYmin ; row <= gridYmax ; row++) {
					
					lCells.push({x : col, y: row});
				}
			}
			
			return lCells;
		}
		
	}
	
}
