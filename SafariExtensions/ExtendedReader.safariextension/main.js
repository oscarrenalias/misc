(function() {
var css = "\
	body {font-family:Arial,sans-serif;background:#fff;} \
	#global-info{display:none;}#nav{position:absolute;top:0;width:240px;}\
	#chrome{margin-left:240px;}#lhn-add-subscription{left:775px;}\
	.goog-button-base-content{line-height:1.4em;}\
	#gbar,#logo-container,#viewer-footer{display:none;}\
	#search{top:1px;left:1px;position:absolute;}\
	#main{top:0;background:#fff;}\
	#search-input{font-size:13px;height:17px;margin:1px 0 0 1px;padding:3px 0 0 2px;width:144px;}\
	#search-restrict{border:0;}#search-restrict-button{margin:1px 0 0;}\
	.search-restrict-contents{width:60px;}\
	#search-restrict-input{width:60px;}\
	#search-submit{display:none;}\
	#lhn-selectors,#sub-tree,#friends-tree-item-0-main ul,.scroll-tree li,#lhn-selectors .selector{background-color:#fff;}\
	#lhn-selectors.lhn-section-minimized .selector,#lhn-subscriptions ,#lhn-friends .lhn-section-primary,#lhn-selectors .selected, #lhn-selectors .selected:hover{background-color:#fff;}\
	.lhn-section-footer {background-color:#C2CFF1;} \
	.scroll-tree li a .name{color:#888888;}\
	.scroll-tree li a .name-unread{color:#111111;} \
	#chrome-title{font-size:13px;line-height:1;}\
	#chrome-header{padding:3px 11px;}\
	#viewer-top-controls{height:22px;padding:3px 3px 1px;}\
	#chrome-title {display:none;}\
	#chrome-header {display:none;}\
	#entries.list .entry .collapsed {border:1px solid #FFFFFF;height:2.1ex;line-height:2.3ex;}";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		heads[0].appendChild(node); 
	}
}

// set up shift-v to open the current article in a background tab
document.addEventListener('keypress', function (event) {
    if (event.which === 86) {  // shift-v'
        var current = document.getElementById('current-entry');
        if (current === null) {
            return;
        }
        var url = current.getElementsByTagName('a')[0].getAttribute('href');
        event.stopPropagation();
        event.preventDefault();
        safari.self.tab.dispatchMessage('openBackgroundTab', url);
    }
}, true);

})();
