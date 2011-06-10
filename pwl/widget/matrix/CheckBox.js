dojo.provide('pwl.widget.matrix.CheckBox');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.widget._Matrix');

dojo.require('dijit.form.CheckBox');

/******************************************************************************/

dojo.declare(
	'pwl.widget.matrix.CheckBox',
	[pwl.widget._Matrix],
{
	value_widget: 'dijit.form.CheckBox',

/******************************************************************************/
/** public **/
/******************************************************************************/

	isChecked: function ( i_item, i_value_store, i_x_id, i_y_id )
	{
		// TODO: provide default way of decission, key value based

		return false;
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_applyValueData: function ( i_widget, i_x_id, i_y_id )
	{
		var checked = false

		this._value_data.forEach( function ( i_item )
		{
			if ( !checked )
				checked = this.isChecked(i_item, this.value_store, i_x_id, i_y_id);
		}, this);

		i_widget.set('checked', checked);
	}
});