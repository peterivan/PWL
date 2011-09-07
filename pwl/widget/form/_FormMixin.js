dojo.provide('pwl.widget.form._FormMixin');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.form._FormMixin');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form._FormMixin',
	[dijit.form._FormMixin],
{
	is_modified: false,
	
	change_event_disabled: false,
	autosave_disabled: false,
	autoreset_disabled: false,

	_connections: [],

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

/******************************************************************************/

	connectChildren: function ()
	{
		this.inherited(arguments);

		this._connections.forEach(dojo.disconnect);

		this.getDescendants().forEach( function ( i_child )
		{
			// widget group is responsible for emiting change events
			// form elements can be ignored by seting flag: ignore_change_event
			if ( !i_child.widget_group && !i_child.ignore_change_event )
			{
				console.debug('--', i_child);
				var c = null;
				
				if ( this._childIsInstanceOf(i_child, 'dijit.form.TextBox') )
					c = dojo.connect(i_child, 'onKeyUp', this, '_onChange');
				else if ( this._childIsInstanceOf(i_child, 'dijit.form.ComboBox') )
					c = dojo.connect(i_child, 'onChange', this, '_onChange');
				else if ( this._childIsInstanceOf(i_child, 'dijit.form.CheckBox') )
					c = dojo.connect(i_child, 'onChange', this, '_onChange');
				else if ( this._childIsInstanceOf(i_child, 'dijit.Editor') )
					c = dojo.connect(i_child, 'onKeyUp', this, '_onChange');
				else if ( this._childIsInstanceOf(i_child, 'dijit.form.Button') )
					c = dojo.connect(i_child, 'onClick', this, '_onChange');
				else if ( this._childIsInstanceOf(i_child, 'dijit.form.SimpleTextArea') )
					c = dojo.connect(i_child, 'onKeyUp', this, '_onChange');
				else if ( dojo.isFunction(i_child.onChange) )
					c = dojo.connect(i_child, 'onChange', this, '_onChange');
				
				if ( c )
					this._connections.push(c);
				
				/**************************************************************/
				
				if ( !this.disable_autosave )
				{ // TODO: try autosave
					if ( dojo.isFunction(i_child.save) && !i_child.is_pwl_form_connected )
					{
						dojo.connect(i_child, 'onSave', this, '_onSave');

						this._children_with_save++;

						i_child.is_pwl_form_connected = true;
					}
				}
			}			

		}, this);
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
/** public **/
/******************************************************************************/

	_childIsInstanceOf: function ( i_child, i_class )
	{
		var obj = dojo.getObject(i_class);
				
		if ( obj && i_child.isInstanceOf(obj) )
			return true;
			
		return false;
	},

/******************************************************************************/
/** Events ********************************************************************/

	_onChange: function ( i )
	{
		if ( !this.disable_change_event )
			this.onChange();
	}
	
/******************************************************************************/
/** Attr handlers *************************************************************/

});