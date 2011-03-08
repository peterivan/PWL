dojo.provide('pwl._ValueStack');

/******************************************************************************/

dojo.require('dijit._Widget');

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl._ValueStack',
	[dijit._Widget],
{
	id_store : [],
	current_item_idx : 0,

	_connections : [],

	_eventsToListen : {
		'dijit.form.CheckBox' : 'onChange'
	},

/******************************************************************************/
/** public **/
/******************************************************************************/

	/**************************************************************************/
	/** startup ***************************************************************/

	postMixInProperties : function ()
	{
		this.inherited(arguments);
	},

	postCreate : function ()
	{
		this.inherited(arguments);

		this.attr(this.id_store);
	},

	/**************************************************************************/

	forward : function ()
	{
		if ( this.current_item_idx < this.id_store.length )
		{
			var next_item_idx = this.current_item_idx + 1;

			if ( this.id_store[next_item_idx] )
			{
				this._setValues(this.id_store[next_item_idx]);

				this.current_item_idx = next_item_idx;
			}
		}
	},

	back : function ()
	{
		if ( this.current_item_idx > 0 )
		{
			var prev_item_idx = this.current_item_idx - 1;

			if ( this.id_store[prev_item_idx] )
			{
				this._setValues(this.id_store[prev_item_idx]);

				this.current_item_idx = prev_item_idx;
			}
		}
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	/**************************************************************************/
	/** attrs *****************************************************************/

	_setId_storeAttr : function ( id_store )
	{
		if ( dojo.isArray(id_store) && id_store.length > 0 )
		{
			this._disconnectObjects();

			this.id_store = id_store;

			var item = this.id_store[0];

			for ( var w_id in item )
			{
				var widget = dijit.byId(w_id);

				if ( widget )
					this._connectObject(widget, item[w_id]);
			}

			this._setValues(0);
		}
	},

	/**************************************************************************/

	_setValues : function ( i_item )
	{
		var item = null;

		if ( dojo.isObject(i_item) )
			item = i_item;
		else
			item = this.id_store[i_item];

		for ( var w_id in item )
		{
			var widget = dijit.byId(w_id);

			if ( widget )
			{
				if ( typeof(item[w_id]) == 'object' && item[w_id].attr )
					widget.attr(item[w_id].attr, item[w_id].value);
				else
					widget.attr('value', item[w_id]);
			}
		}
	},

	_connectObject : function ( target, store_declaration )
	{
		target.attr('value_stack', this);

		var t_id = target.attr('id');
		var declared_class = target.attr('declaredClass');

		var event = store_declaration.event || this._eventsToListen[declared_class] || 'onBlur';

		this._connections.push( dojo.connect(target, event, function ()
		{
			this.value_stack._storeValue(this);
		}) );
	},

	_disconnectObjects : function ()
	{
		dojo.forEach(this._connections, function( connection )
		{
			dojo.disconnect(connection);
		});

		this._connections = [];
	},

	_storeValue : function ( target )
	{
		var w_id = target.attr('id');
		var item = this.id_store[this.current_item_idx][w_id];

		if ( typeof(item) == 'object' && item.attr )
		{
			this.id_store[this.current_item_idx][w_id] = target.attr(item.attr);
		}
		else
			this.id_store[this.current_item_idx][w_id] = target.attr('value');
	}
});