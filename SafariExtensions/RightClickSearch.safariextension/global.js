safari.application.addEventListener("contextmenu", handleContextMenu, false);
safari.application.addEventListener("command", handleContextMenuAction, false);
safari.application.addEventListener("message", handleMessage, false);

sites = {
	'google': {
		'desc': 'Search in Google',
		'uri': 'http://www.google.com/?q=',
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
	//alert("searching: " + sites[event.target.identifier].desc);
	if(event.command == "doSearch") {
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("doTextSearch", sites[event.target.identifier]);
	}
	else {
		alert(event.command);
	}	
}

function handleMessage(event) {
	if(event.name == "searchSelectedText" ) {
		// extract the parameters and create the url for the search site
		text = encodeURIComponent(event.message.selection);
		url = event.message.message.uri + text;
		// open a new tab and perform the search		
		safari.application.activeBrowserWindow.openTab().url = url;
	}
}