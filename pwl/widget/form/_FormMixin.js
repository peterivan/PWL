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

	autosave: true,
	autoreset: true,

	_connections: null,
	
	_modified_children: 0,
	_children_with_save: 0,
	_children_saved: 0,

	_children_to_handle: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postMixInProperties: function ()
	{
		this.inherited(arguments);
		
		this._connections = [];
	},

/******************************************************************************/

	connectChildren: function ()
	{
		this.inherited(arguments);

		this._connections.forEach(dojo.disconnect);
		
		this._children_to_handle = 
		{
			change: [],
			reset: []
		};

		this._findChildren(this);
		
		this._children_to_handle.change.forEach( function ( i_child )
		{
			var change_events = this._findChangeEvents( i_child );

			change_events.forEach( function ( i_event ) 
			{
				var c = dojo.connect(i_child, i_event, this, '_onChange');

				if ( c )
					this._connections.push(c);
			}, this);
		}, this);		

		console.debug(this, this._children_to_handle);
	},

	reset: function()
	{
		if ( !this.disable_autoreset )
		{
			this._children_to_handle.reset.forEach( function ( i_child )
			{
				i_child.reset();
			}, this);
		}
	},

/******************************************************************************/
/** Events ********************************************************************/

	onChange: function ( i_data )
	{
		this.set('is_modified', true);
	},

	onLoad: function ( i_data )
	{
		this.set('is_modified', false);

		if ( this.load_topic )
		{
			console.debug('published topic: ', this.load_topic, i_data);

			dojo.publish(this.load_topic, i_data);
		}
	},

	onLoadError: function ( i_error ) {},

	onSave: function ( i_data )
	{
		this.set('is_modified', false);

		if ( this.save_topic )
		{
			console.debug('published topic: ', this.save_topic, i_data);

			dojo.publish(this.save_topic, [i_data]);
		}
	},

	onSaveError: function ( i_error ) {},

	onReset: function ( i_data )
	{
		this.set('is_modified', false);

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

	/**
	 * Determine if child should be observed for change event.
	 * 
	 * Child that is members of widget group (WG) is ignored, WG is responsible 
	 * for observation of its children.
	 * 
	 * Change event can also be ignored by setting "ignore_change_event" flag.
	 */
	_shouldListenToChangeEvent: function ( i_child )
	{
		if ( i_child.ignore_change_event )
			return false;
		
		// don't listen when child is member of group other then this
		if ( i_child.widget_group && i_child.widget_group != this )
			return false;
		
		return true;
	},

	/**
	 * Find appropriate change event for child.
	 * In most cases its onChange, but may differ for each widget.
	 */
	_findChangeEvents: function ( i_child )
	{
		var all_events = [];
		
		if ( this._childIsInstanceOf(i_child, 'dijit.form.ComboBox') )
			all_events.push('onChange');
		if ( this._childIsInstanceOf(i_child, 'dijit.form.TextBox') )
			all_events.push('onKeyUp');
		if ( this._childIsInstanceOf(i_child, 'dijit.form.DateTextBox') )
			all_events.push('onChange');
		if ( this._childIsInstanceOf(i_child, 'dijit.form.TimeTextBox') )
			all_events.push('onChange');			
		if ( this._childIsInstanceOf(i_child, 'dijit.form.CheckBox') )
			all_events.push('onChange');
		if ( this._childIsInstanceOf(i_child, 'dijit.Editor') )
			all_events.push('onKeyUp');
		if ( this._childIsInstanceOf(i_child, 'dijit.form.Button') )
			all_events.push('onClick');
		if ( this._childIsInstanceOf(i_child, 'dijit.form.SimpleTextArea') )
			all_events.push('onKeyUp');
		if ( dojo.isFunction(i_child.onChange) )
			all_events.push('onChange');
		
		/**********************************************************************/
		
		var events = [];
		
		all_events.forEach( function ( i_event ) 
		{
			if ( dojo.indexOf(events, i_event)  == -1 )
				events.push(i_event);
		});
		
		return events;
	},

	
	_findChildren: function ( i_container )
	{
		i_container.getChildren().forEach( function ( i_child )
		{
			if ( i_child.isContainer )
			{
				var widget_group_exists = dojo.getObject('pwl.widget.form.WidgetGroup');
				
				if ( widget_group_exists && i_child.isInstanceOf(pwl.widget.form.WidgetGroup) )
				{
					this._children_to_handle.change.push(i_child);
					
					if ( this._childMayReset(i_child) )
						this._children_to_handle.reset.push(i_child);
				}
				
				this._findChildren(i_child);
			}
			else
			{
				if ( this._shouldListenToChangeEvent(i_child) )
				{
					this._children_to_handle.change.push(i_child);

					/**********************************************************/
					/** Autosave **********************************************/

					if ( !this.disable_autosave || !this.autosave_disabled )
					{
						if ( i_child.autosave )
						{
							console.warn('Autosaving of widget groups is bugged, though it works in simple cases. Consider custom handling.');

							if ( dojo.isFunction(i_child.save) && !i_child.is_pwl_form_connected )
							{
								dojo.connect(i_child, 'onSave', this, '_onSave');

								this._children_with_save++;

								i_child.is_pwl_form_connected = true;
							}
						}
					}
					
					/**********************************************************/
					/** Autoreset *********************************************/
					
					if ( this._childMayReset(i_child) )
						this._children_to_handle.reset.push(i_child);
				}
			}
		}, this);
	},

	_childMayReset: function ( i_child )
	{
		if ( i_child.autoreset == false )
			return false;
				
		if ( !dojo.isFunction( i_child.reset ) )
			return false;
					
		return true;
	},

/******************************************************************************/
/** Events ********************************************************************/

	_onChange: function ( i )
	{
		if ( !this.disable_change_event || !this.change_event_disabled )
			this.onChange();
	},
	
	_onSave: function ()
	{
	}
	
/******************************************************************************/
/** Attr handlers *************************************************************/
	
});