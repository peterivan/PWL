dojo.provide('pwl.widget.form.Form');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.form.Form');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.Form',
	[dijit.form.Form],
{
	is_changed: false,

	_sub_forms: [],

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	startup: function ()
	{
		this.getChildren().forEach( function ( i_child )
		{
			if ( i_child.isInstanceOf(dijit.form.Form) )
			{
				this._sub_forms.push(i_child);
			}
		}, this);
	},

/******************************************************************************/
/** Events ********************************************************************/

	onChange: function () { this.is_changed = true; },

	onLoad: function () { this.is_changed = false; },
	onLoadError: function ( i_error ) {},

	onSave: function ( i_data ) { this.is_changed = false; },
	onSaveError: function ( i_error ) {},

	onReset: function () { this.is_changed = false; },

/******************************************************************************/

	save: function ()
	{
		if ( this.isValid() )
		{
			this._sub_forms.forEach( function ( i_sub_form )
			{
				i_sub_form.save();
			});
		}
		else
			this.validate();
	},

	reset: function ()
	{
		this.getChildren().forEach( function ( i_widget )
		{
			console.log(i_widget);

			//if ( !i_widget.isInstanceOf(dijit.form.Form) )
			{
				if ( i_widget.reset )
					i_widget.reset();
			}
		});
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

});