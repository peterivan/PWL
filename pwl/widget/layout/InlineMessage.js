dojo.provide('pwl.widget.layout.InlineMessage');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.InlineMessage',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutInlineMessage',

	templateString: dojo.cache('pwl.widget.layout', 'templates/InlineMessage.html'),
			 
	widgetsInTemplate: true,


/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
		
	},

	
	startup : function ()
	{
		this.inherited(arguments);
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize : function ()
	{
		this.inherited(arguments);
		
		var t_box = dojo.contentBox(this.domNode);
	},

	_setContentAttr: function( i_message )
	{
		this.containerNode.innerHTML = i_message
	}
	
});