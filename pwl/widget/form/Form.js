dojo.provide('pwl.widget.form.Form');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit.form.Form');

dojo.require('pwl.widget.form._FormMixin');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.Form',
	[dijit.layout._LayoutWidget, dijit.form.Form, pwl.widget.form._FormMixin],
{
	is_modified: false,

	disable_change_event: false,
	disable_autosave: false,
	disable_autoreset: false,

	_children_with_save: 0,
	_saved_children: 0,
	
	_event:{},

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
				if ( i_child.autosave && dojo.isFunction(i_child.save) )
				{							
					i_child.save();
				}
					
			}, this);
			
			
		}
	},

	reload: function () {},

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
	},
	
	_setIs_modifiedAttr: function ( i_is_modified )
	{
		this.is_modified = i_is_modified;
		
		console.debug('IM change: ', i_is_modified);
	}
});