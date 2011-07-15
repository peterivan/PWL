dojo.provide('pwl.widget.form._FormWidget');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.form._FormWidget');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form._FormWidget',
	[dijit.form._FormWidget],
{
	is_modified: false,

/******************************************************************************/
/** public **/
/******************************************************************************/

	save: function () {},
	reload: function () {},

/******************************************************************************/
/** Events ********************************************************************/

	onChange: function ( i_data )
	{
		this.is_modified = true;

		if ( this.change_topic )
		{
			console.debug('published topic: ', this.change_topic, i_data);

			dojo.publish(this.change_topic, [i_data]);
		}
	},

	onLoad: function ( i_data )
	{
		this.is_modified = false;

		if ( this.load_topic )
		{
			console.debug('published topic: ', this.load_topic, i_data);

			dojo.publish(this.load_topic, i_data);
		}
	},

	onLoadError: function ( i_error ) {},

	onSave: function ( i_data )
	{
		this.is_modified = false;

		if ( this.save_topic )
		{
			console.debug('published topic: ', this.save_topic, i_data);

			dojo.publish(this.save_topic, [i_data]);
		}
	},

	onSaveError: function ( i_error ) {},

	onReset: function ( i_data )
	{
		this.is_modified = false;

		if ( this.reset_topic )
		{
			console.debug('published topic: ', this.reset_topic, i_data);

			dojo.publish(this.reset_topic, [i_data]);
		}
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

});