safari.self.addEventListener("message", messageHandler, false);

function messageHandler(event) {
    event.stopPropagation();
    event.cancelBubble = true;
    
    if (event.name === "doTextSearch") {
        sel = window.parent.getSelection().toString();
        if (sel.length > 0) {
			safari.self.tab.dispatchMessage("searchSelectedText", {"message": event.message, "selection": sel } );
		}
	}
}

// *** handle right-click ***
document.addEventListener("contextmenu", handleContextMenu, false);

function handleContextMenu(event) {
    sel = window.parent.getSelection().toString();
    safari.self.tab.setContextMenuEventUserInfo(event, sel);
}