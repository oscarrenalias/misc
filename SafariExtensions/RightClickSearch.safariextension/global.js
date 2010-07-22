safari.application.addEventListener("contextmenu", handleContextMenu, false);
safari.application.addEventListener("command", handleContextMenuAction, false);
safari.application.addEventListener("message", handleMessage, false);

sites = {
	'google': {
		'desc': 'Search in Google',
		'uri': 'http://www.google.com/search?q=',
	},
	'googleimages': {
		'desc': 'Search in Google Image Search',
		'uri': 'http://www.google.com/images?q=',
	},
	'wikipedia': {
		'desc': 'Search in Wikipedia',
		'uri': 'http://en.wikipedia.org/wiki/',		
	},
	'imdb': {
		'desc': 'Search in IMDB',
		'uri': 'http://www.imdb.com/find?s=all&q=',
	}
};
 
function handleContextMenu(event) {	
	if(event.userInfo.length > 0) {
		for(i in sites) {
			event.contextMenu.appendContextMenuItem(i, sites[i].desc, "doSearch");	
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