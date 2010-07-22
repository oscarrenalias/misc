document.addEventListener("contextmenu", handleContextMenu, false);

function handleContextMenu(event) {
    sel = window.parent.getSelection().toString().trim();
    safari.self.tab.setContextMenuEventUserInfo(event, sel);
	console.log("Setting userInfo to:" + sel)
}