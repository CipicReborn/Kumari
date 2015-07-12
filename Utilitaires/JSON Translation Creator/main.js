$(function() {
	//languages et transUnitsArray sont dans translations.js

	$('#form').append(createList("source"));
	$('#form').append(createList("target"));
	$('#form').append('<br><input id="jsonButton" value="Générer le Json" type=submit>');
	$('#form').append('<br><input id="xlifButton" value="Générer le Xlif" type=submit>');

	$('input[type=submit]').on('click', function(pEvent){
		pEvent.preventDefault();
		var langSource = $('#list_source').val();
		var langTarget = $('#list_target').val();

		if($(this).attr("id") == "jsonButton") {
			$("#jsonDisplay").text(JSON.stringify(buildTranslationJson(langSource, langTarget), null, 4));
		} else {
			$("#jsonDisplay").text(buildTranslationXlif(langSource, langTarget));
		}
		
		$("#enumDisplay").text(buildLabelsFile());
	});

	function buildLabelsFile() {
		var labelsFile = "";
		for (lUnit of transUnitsArray) {
			labelsFile += 'public static inline var ' + lUnit.id + ':String = "'+ lUnit.id + '";\n';
		}

		return labelsFile;
	}

	function createList(pName) {
		$('#form').append($('<p>'+ pName +'</p>'));
		var selectionList = $('<select id="list_'+pName+'" name="'+pName+'"><select>');
		for (var i = 0; i < languages.length; i++) {
			selectionList.append('<option value="'+ languages[i] + '">' + languages[i] + '</option> ');
		}

		return selectionList;
	}
	/**
	* @params pTarget Le langage de destination
	*/
	function buildTranslationJson(pSource, pTarget) {
		var finalTranslation = {};
		finalTranslation["source-language"] = pSource;
		finalTranslation["target-language"] = pTarget;
		finalTranslation["transUnits"] = new Array();

		for (var lUnit of transUnitsArray) {
			var lTransUnit = {
				"id" : lUnit.id,
				"source" : lUnit[pSource],
				"target" : lUnit[pTarget]
			}
			finalTranslation.transUnits.push(lTransUnit);
		}

		return finalTranslation;
	}

	function buildTranslationXlif(pSource, pTarget) {
		var xmlString = "<xliff version='1.2'>\n";
		xmlString += "    <file original='' source-language='"+pSource+"' target-language='"+pTarget+"'>\n";
		xmlString += "        <header></header>\n";
		xmlString += "        <body>\n";

		for (var lUnit of transUnitsArray) {
			xmlString+= "            <trans-unit id='"+lUnit.id+"'>\n";

			xmlString+= "                <source>"+lUnit[pSource]+"</source>\n";
			xmlString+= "                <target>"+lUnit[pTarget]+"</target>\n";
			xmlString+= "            </trans-unit>\n"
		}

		xmlString += "        </body>\n"
		xmlString += "    </file>\n";
		xmlString += "</xliff>\n";

		console.log(xmlString);
		return xmlString;
	}

});