dojo.provide('pwl.widget.titlePane.ToolbarTitleWidget');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.Title');

/******************************************************************************/

dojo.declare(
	'pwl.widget.titlePane.ToolbarTitleWidget',
	[dijit._Widget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.titlePane', 'templates/ToolbarTitleWidget.html'),
	widgetsInTemplate: true,
	
	title_is_editable: '',
	
	w_title: null,
	w_toolbar: null,
	
	n_toolbar_container: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		dojo.connect(this.w_title, 'onChange', this, 'onTitleChange');
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		
		var b_this = dojo.contentBox(this.domNode);
		var b_tc = dojo.marginBox(this.n_toolbar_container);
		
		var b_tc_left = dojo.style(this.n_toolbar_container,"right").replace("px","");
		
		var w = b_this.w - b_tc.w - b_tc_left - 10; // 10 - buffer

		dojo.marginBox(this.w_title.domNode, {w: w});
	},

/******************************************************************************/
/** Events ********************************************************************/

	onTitleChange: function ( i_value ) {},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	
	
/******************************************************************************/
/** Attr handlers *************************************************************/

	_setW_toolbarAttr: function ( i_w_toolbar )
	{
		if ( this.w_toolbar )
			this.w_toolbar.destroyRecursive();
		
		this.w_toolbar = i_w_toolbar;
		
		this.w_toolbar.placeAt(this.n_toolbar_container);
	},
	
	_setTitleAttr: function( i_title )
	{
		this.w_title.set('title', i_title);
	}
});