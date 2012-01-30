dojo.provide('pwl.widget.layout.VerticalCalendar');

/******************************************************************************/
/******************************************************************************/
dojo.require('dojo.fx');

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require("dojo.date");

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.VerticalCalendar',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutVerticalCalendar',

	templateString: dojo.cache('pwl.widget.layout', 'templates/VerticalCalendar.html'),

	slide_duration: 500,
	
	current_date: null,
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
		this.current_date = new Date();

	},

	startup : function ()
	{
		this.inherited(arguments);
		
		dojo.connect(this.n_prev, 'onclick', this, 'prev');
		dojo.connect(this.n_next, 'onclick', this, 'next');		
		
		this.showWeek(this.current_date);
		
	},
	
	showWeek: function()
	{
		
	},
	
/******************************************************************************/
/** Layout ********************************************************************/

	resize : function ()
	{
		this.inherited(arguments);

		var b_parent = dojo.contentBox(this.domNode.parentNode);
console.debug(b_parent.h)
		dojo.marginBox(this.domNode,b_parent);
		
		var b_this = dojo.contentBox(this.domNode);
		
		var b_navigation_left = dojo.marginBox(this.n_navigation_left);
		var b_navigation_right = dojo.marginBox(this.n_navigation_right);
		
		this.container_width = b_this.w - b_navigation_left.w - b_navigation_right.w  ;
		
		dojo.marginBox(this.domNode, {h: b_this.h});
		dojo.marginBox(this.containerNode, {h: b_this.h,w: this.container_width});		
		
		var marginSpan = b_this.h/2 - 27//27 1/2 vysky icony

		dojo.style(this.n_prev,"marginTop",marginSpan+"px")
		dojo.style(this.n_next,"marginTop",marginSpan+"px")
		
		var sections = dojo.query(".container section",this.domNode);
		var _w = this.container_width/sections.length ;
console.debug(sections)		
console.debug("_w",_w)		
		sections.forEach( function( day_column, index)
		{
			
			var _left = b_navigation_left.w + index*_w;
			dojo.style(day_column, "width", _w + "px");
			dojo.style(day_column, "left", _left + "px");
		},this)
		
	},
	
	prev: function()
	{
		
	},

	next: function()
	{
		
	}
});	