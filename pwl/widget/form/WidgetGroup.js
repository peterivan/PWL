dojo.provide('pwl.widget.form.WidgetGroup');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dijit.form._FormMixin');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.WidgetGroup',
	[dijit.layout._LayoutWidget, dijit._Templated, dijit.form._FormMixin],
{
	is_modified: false,
	change_event_disabled: false,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	startup: function ()
	{
		this.inherited(arguments);

		if ( !this.containerNode )
			this.containerNode = this.domNode;

		this.getChildren().forEach( function ( i_child )
		{
			i_child.set('widget_group', this);

			if ( i_child.isInstanceOf(dijit.form._FormWidget) )
			{
				var obj = dojo.getObject('dijit.form.TextBox');

				if ( obj && i_child.isInstanceOf(obj) )
				{
					dojo.connect(i_child, 'onKeyUp', this, '_onChange');
				}
			}

		}, this);
	},

/******************************************************************************/

	reset: function ()
	{
		this.change_event_disabled = true;

		this.inherited(arguments);

		this.onReset();

		setTimeout(dojo.hitch(this, function ()
		{
			this.change_event_disabled = false;
		}), 0);

	},

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

	_onChange: function ()
	{
		if ( !this.change_event_disabled )
			this.onChange();
	}

});