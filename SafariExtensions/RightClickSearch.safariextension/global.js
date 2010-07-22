safari.application.addEventListener("contextmenu", handleContextMenu, false);
safari.application.addEventListener("command", handleContextMenuAction, false);

sites = {
	'google': {
		'desc': 'Google',
		'uri': 'http://www.google.com/search?q='
	},
	'googleimages': {
		'desc': 'Google Image Search',
		'uri': 'http://www.google.com/images?q='
	},
	'wikipedia': {
		'desc': 'Wikipedia',
		'uri': 'http://en.wikipedia.org/wiki/'		
	},
	'imdb': {
		'desc': 'IMDB',
		'uri': 'http://www.imdb.com/find?s=all&q='
	},
	'bing': {
		'desc': 'Bing',
		'uri': 'http://www.bing.com/search?q='
	},
	'amazon': {
		'desc': 'Amazon',
		'uri': 'http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords='
	}
};
 
function handleContextMenu(event) {	
	if(event.userInfo.length > 0) {
		for(i in sites) {
			if(safari.extension.settings[i] == true) {
				event.contextMenu.appendContextMenuItem(i, "Search in " + sites[i].desc, "doSearch");	
			}
		}	
	}
}

function handleContextMenuAction(event) {
	if(event.command == "doSearch") {
		searchText(event.userInfo, sites[event.target.identifier].uri);
	}
	else {
		console("Unrecognized command:" + event.command);
	}	
}

function searchText(text, uri) {
	url = uri + encodeURIComponent(text);
	safari.application.activeBrowserWindow.openTab().url = url;	
}