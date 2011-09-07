dojo.provide('pwl.widget.titlePane.ToolbarTitleWidget');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.titlePane.ToolbarTitleWidget',
	[dijit._Widget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.titlePane', 'templates/ToolbarTitleWidget.html'),
	
	w_toolbar: null,
	
	n_title: null,
	n_toolbar_container: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		console.debug('ok');
		var b_this = dojo.contentBox();
		var b_tc = dojo.marginBox(this.n_toolbar_container);
		
		var w = b_this.w - b_tc.w - 10; // 10 - buffer
		
		dojo.marginBox(this.n_title, {w: w});
	},

/******************************************************************************/
/** Events ********************************************************************/

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
		this.n_title.innerHTML = i_title;
	}
});