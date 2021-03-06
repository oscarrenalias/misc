function getFirstElementMatchingClassName(root,tag,vaclass)
{
  var elements=root.getElementsByTagName(tag); var i=0;
  while (elements[i] && !elements[i].className.match(vaclass)) { i++; }
  return ((!elements[i]) ? null : (elements[i]));
}

function getElementsByClassName(root,tag,vaclass)
{
  var elements = root.getElementsByTagName(tag);
  var results = new Array();
  for(var i=0; i<elements.length; i++) { if(elements[i].className.indexOf(vaclass)>-1) { results.push(elements[i]); } }
  return (results);
}

function findParentNode(el,tag,vaclass)
{
  el=el.parentNode;
  if (arguments.length==3)
  {
    // Find first element's parent node matching tag and className
    while (el.nodeName.toLowerCase()!='body' && (el.nodeName.toLowerCase()!=tag || (el.className!=vaclass && el.className.indexOf(vaclass+' ')==-1))) { el=el.parentNode; }
    return ((el.nodeName.toLowerCase()!='body') ? el : false);
  }
  else
  {
    // Find first element's parent node matching tag
    while (el.nodeName.toLowerCase()!='body' && el.nodeName.toLowerCase()!=tag) { el=el.parentNode; }
    return ((el.nodeName.toLowerCase()!='body') ? el : false);
  }
}

function addStyles(css)
{
  var head=document.getElementsByTagName('head')[0];
  if (head)
  {
    var style=document.createElement('style');
    style.type='text/css';
    style.innerHTML=css;
    head.appendChild(style);
  }
}

function catchEntryAdded(e)
{
    var el=e.target;
    if (el.nodeName=='DIV' && el.className.indexOf('entry')>-1)
    {
      if (el.className.indexOf('entry-actions')>-1)
      {
        // Expanding article in list view
        addPreviewButton(el);
      }
      else if (getFirstElementMatchingClassName(el,'div','card-bottom'))
      {
        // Adding article in expanded view
        addPreviewButton(getFirstElementMatchingClassName(el,'div','entry-actions'));
      }
    }
}

function addPreviewButton(el)
{
  // Top link
  var entry=findParentNode(el,'div','entry');
  var link=getFirstElementMatchingClassName(entry,'a','entry-title-link');
  //link.addEventListener('click', previewMouseClick, false);
  link.addEventListener('click', function(e) { if (!e.ctrlKey) { previewMouseClick(e); }  }, false);

  // Bottom button
  var preview=document.createElement('span');
  preview.className='item-preview preview link';
  preview.innerHTML='Preview';
  el.appendChild(preview);
  preview.addEventListener('click', previewMouseClick, false);
}

function calcEntryIndex(e)
{
    var index=0;
    while (e.previousSibling)
    {
      index++;
      e=e.previousSibling;
    }
    return index;
}

function previewMouseClick(e)
{
    var el=e.target;
    var entry=findParentNode(el,'div','entry');

    var index = calcEntryIndex(entry);
    preview(entry,index);

    e.preventDefault();
}

function previewShortcut()
{
    preview(document.getElementById('current-entry'));
}

function preview(entry)
{
    var preview;

    // Update entry with preview mode, need to do it before scrolling, because scrolling will repaint preview button (list view only)
    if (entry.className.indexOf('preview')==-1)
    {
      entry.className=entry.className+' preview';
      preview=true;
    }
    else
    {
      entry.className=entry.className.replace('preview','');
      preview=false;
    }

    // Need to scroll before changing entry-body, because scrolling repaints article from scratch (list view only)
    scrollTo(entry);

    var body = getFirstElementMatchingClassName(entry,'div','entry-body');
    var entryBody = getFirstElementMatchingClassName(body,'div','item-body');

    if (preview)
    {
       // classic mode-> preview mode

       // hide rss item
       entryBody.style.display='none';

       // iframe creation/display
       var iframe = getFirstElementMatchingClassName(entry,'iframe','preview');
       if (iframe)
       {
         // iframe already in document, display it
         iframe.style.display='block';
       }
       else
       {
         // iframe not in document, create it
         iframe = document.createElement('iframe');
         iframe.setAttribute('width','100%');
         iframe.setAttribute('height','85%');
         iframe.setAttribute('src',getFirstElementMatchingClassName(entry,'a','entry-title-link'));
         iframe.className='preview';
         body.appendChild(iframe);
       }

       // Scale article container to fullwidth
       body.setAttribute('style','max-width: 98%');
    }
    else
    {
       // preview mode -> classic mode

       // hide iframe
       var iframe = getFirstElementMatchingClassName(entry,'iframe','preview');
       if (iframe) iframe.style.display='none';

       // show rss item
       entryBody.style.display='block';

       // Go back to initial width
       body.removeAttribute('style','');
    }
}

function getEntryDOMObject(index)
{
    // Because of repaint, entry doesn't point to correct DOM object, we need to find entry using index
    var entries=document.getElementById('entries');
    var i=0;
    entry=entries.firstChild;
    while ((i++)<index)
    {
      entry=entry.nextSibling;
    }
    return entry;
}

function scrollTo(entry)
{
    // Force scrolling to top of article
    try
    {
		// Navigate through DOM until reaching "entries" item, in order to compute current entry's top coordinate relative to entries' main container
		var top=0;
		while (entry.id!='entries') { top+=entry.offsetTop; entry=entry.parentNode; }
		document.getElementById('entries').scrollTop=top;
    }
    catch(err) { }
}

function restyle()
{
    // Overwrites Better GReader extension css modifications regarding entry-actions class.
    // Indeed, entry-actions was set to "float : right", thus div was not in document flow.
    // Then, clicking on preview button let entry actions div in place instead of going down automatically when iframe was added.
    // That's why I use here text-align: right. That has the same effect, but keeps div in document flow.
    // restyle() is called after document load, in order to ensure that Better GReader has already added its styles modifications
    var styles = document.getElementsByTagName('head')[0].getElementsByTagName('style');
    var i=0;

    while (i<styles.length)
    {
    	if (styles[i].innerHTML.indexOf('.entry-actions { float:right !important; }')>-1)
    	{
          styles[i].innerHTML=styles[i].innerHTML.replace('.entry-actions { float:right !important; }','.entry-actions { text-align: right; !important; }');
    	}
    	i++;
    }
}

function handleKeypress(e)
{
  // Handle a Shift-V keypress
  if (e.target.nodeName.toLowerCase()!='input' && e.shiftKey && e.which==113)
  {
    previewShortcut();
    e.preventDefault();
  }
}

function initPreview()
{
  restyle();
  addStyles('span.item-preview { background: url("data:image/gif,GIF89a%10%00%10%00%D5%13%00%D8%D8%D8%FA%FA%FA%CB%CB%CB%C8%C8%C8%D2%D2%D2%BA%BA%BA%C6%C6%C6%A1%A1%A1%9C%9C%9C%BD%BD%BD%C9%C9%C9%AB%AB%AB%F4%F4%F4%BF%BF%BF%FC%FC%FC%DB%DB%DB%AD%AD%AD%FF%FF%FF%CC%CC%CC%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%13%00%2C%00%00%00%00%10%00%10%00%00%06I%C0%89pH%2C%1A%8F%C8d%F1!i%3A%9F%8F%E1%03B%ADZ%A9%D1%89%04%12%E9z%BF%10%89p%FB-G%C2c%AE%D9%8B%D6%AA%03_%F8Y%EC%8E%C8%E3%F3%F4%9AM\'%7B%1D%0E%60t%00W%85%10%00RO%8A%12YJ%8E%8EA%00%3B") no-repeat; padding-left: 16px; } div.entry.preview span.item-preview { background: url("data:image/gif,GIF89a%10%00%10%00%A2%05%00%D8%D8%D8%DB%DB%DB%AD%AD%AD%CC%CC%CC%FE%9A%20%FF%FF%FF%00%00%00%00%00%00!%F9%04%01%00%00%05%00%2C%00%00%00%00%10%00%10%00%00%03%3BX%BA%DC%FE0%B60%AA%BDa%05%C1%BB%E7Y1%08Di%9E%C2%A0%8C%A6%D7%AA%22Y%CA2%91%AE%B5%3B%C3%EC%7C%EE%B8%D6%CF%C6%AB%0D%89%0A%C0g)%00h.%D0AHB%A5%26%00%00%3B") no-repeat; padding-left: 16px; }');
}

document.body.addEventListener('DOMNodeInserted', catchEntryAdded, false);
window.addEventListener('load',initPreview,false);

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


document.addEventListener('keypress', function (event) {
	switch(event.which) {
		case 86:  // set up shift-v to open the current article in a background tab
	        var current = document.getElementById('current-entry');
	        if (current === null) {
	            return;
	        }
	        var url = current.getElementsByTagName('a')[0].getAttribute('href');
	        event.stopPropagation();
	        event.preventDefault();
	        safari.self.tab.dispatchMessage('openBackgroundTab', url);
			break;
		case 113: // preview key handler
			if(event.target.nodeName.toLowerCase() != 'input') {
				previewShortcut();
	    		event.preventDefault();
			}
			break;
	}
}, true);
})();