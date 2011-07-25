dojo.provide('pwl.widget.layout.FloatingBox');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dojox.html.metrics');

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.FloatingBox',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutFloatingBox',

	templateString: dojo.cache('pwl.widget.layout', 'templates/FloatingBox.html'),
			 
	widgetsInTemplate : true,

	inicialized: false,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
		
	},
	
	resize: function()
	{
		
	},
	
	_setMessageAttr: function(content)
	{
		this.inherited(arguments);
		this.containerNode.innerHTML = content;
	},
	
	_setSourceElementAttr: function(source_element)
	{
		this.source_element = source_element;
		this.source_element_position = dojo.position(source_element);
		this.setPosition();
/*		dojo.connect(source_element,"onmouseover",this,function()
		{
			this.set("message",source_element.innerHTML + "...");
			this.setPosition();	
		})
		
		dojo.connect(source_element,"onmouseout",this,function(){
			this.hide();	
		})	*/	
	},
	
	
	setPosition: function()
	{
		
		if(!this.inicialized)
		{
			dojo.place(this.domNode,dojo.body());
			this.inicialized = true;
		}	
		
		dojo.style(this.domNode,{'display':"block"});
		
		var b_this = dojo.position(this.domNode);
		
		var top = this.source_element_position.y - b_this.h - 3;//3 medzera
		var left = this.source_element_position.x - b_this.w/2 + this.source_element_position.w/2;//3 medzera
		left = left < 0 ? 0 : left;
		top = top < 0 ? 0 : top;
		
		dojo.style(this.domNode,{"left":left+"px","top":top+"px",'display':"inline-block"});
		
		
	},
	
	hide: function()
	{
		dojo.style(this.domNode,{'display':"none"});
	}
	
});