safari.application.addEventListener("contextmenu", handleContextMenu, false);
safari.application.addEventListener("command", handleContextMenuAction, false);

sites = {
	'google': {
		'desc': 'Google',
		'uri': 'http://www.google.com/search?q=',
		ssl: true
	},
	'googleimages': {
		'desc': 'Google Image Search',
		'uri': 'http://www.google.com/images?q=',
		ssl: true
	},
	'wikipedia': {
		'desc': 'Wikipedia',
		'uri': 'http://en.wikipedia.org/wiki/',
		ssl: false
	},
	'imdb': {
		'desc': 'IMDB',
		'uri': 'http://www.imdb.com/find?s=all&q=',
		ssl: false
	},
	'bing': {
		'desc': 'Bing',
		'uri': 'http://www.bing.com/search?q=',
		ssl: false
	},
	'amazon': {
		'desc': 'Amazon',
		'uri': 'http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=',
		ssl: false
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
		var uri = sites[event.target.identifier].uri;		
		if((safari.extension.settings.usehttps == true) && (sites[event.target.identifier].ssl == true)) {
			// https mode, we have to replace "http" with "https" but only if supported
			uri = uri.replace("http:", "https:");
		}
		
		searchText(event.userInfo, uri);
	}
	else {
		console("Unrecognized command:" + event.command);
	}	
}

function searchText(text, uri) {
	url = uri + encodeURIComponent(text);
	safari.application.activeBrowserWindow.openTab().url = url;	
}