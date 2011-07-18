dojo.provide('pwl.widget.form.Form');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.form.Form');
dojo.require('dijit.layout._LayoutWidget');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.Form',
	[dijit.layout._LayoutWidget, dijit.form.Form],
{
	is_modified: false,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

/******************************************************************************/

	save: function () {},
	reload: function () {},

	reset: function ()
	{
		this.inherited(arguments);

		this.getChildren().forEach( function ( i_widget )
		{
			if ( dojo.isFunction(i_widget.reset) )
				i_widget.reset();
		}, this);

	},

/******************************************************************************/
/** Events ********************************************************************/

	onChange: function () { this.is_modified = true; },

	onLoad: function () { this.is_modified = false; },
	onLoadError: function ( i_error ) {},

	onSave: function ( i_data ) { this.is_modified = false; },
	onSaveError: function ( i_error ) {},

	onReset: function () { this.is_modified = false; },

/******************************************************************************/
/** protected **/
/******************************************************************************/

});