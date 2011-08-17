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

	disable_change_event: false,
	disable_autosave: false,

	_children_with_save: 0,
	_saved_children: 0,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

/******************************************************************************/

	save: function ()
	{
		if ( !this.disable_autosave )
		{
			this.getDescendants().forEach( function ( i_child )
			{
				if ( dojo.isFunction(i_child.save) )
					i_child.save();
			}, this);
		}
	},

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

	connectChildren: function ()
	{
		this.inherited(arguments);

		if ( !this.disable_autosave )
		{
			this.getDescendants().forEach( function ( i_child )
			{
				if ( dojo.isFunction(i_child.save) && !i_child.is_pwl_form_connected )
				{
					dojo.connect(i_child, 'onSave', this, '_onSave');

					this._children_with_save++;

					i_child.is_pwl_form_connected = true;
				}
			}, this);
		}
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

	_onSave: function ()
	{
		this._saved_children++;

		if ( this._children_with_save == this._saved_children )
		{
			this._saved_children = 0;

			this.onSave();
		}
	}
});