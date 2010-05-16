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
	},

	/**************************************************************************/

	setIdStore : function ( id_store )
	{
		if ( dojo.isArray(id_store) && id_store.length > 0 )
		{
			this._disconnectObjects();

			this.id_store = id_store;

			dojo.forEach(id_store, function (item)
			{
				for ( var w_id in item )
				{
					var widget = dijit.byId(w_id);

					if ( widget )
					{
						widget.attr('value_stack', this);

						var conn = dojo.connect(widget, 'onBlur', function ()
						{
							this.value_stack._storeValue(this.id, this.attr('value'));
						});

						this._connections.push(conn);
					}
				}
			}, this);

			this._setValues(0);
		}
	},

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
				widget.attr('value', item[w_id]);
		}
	},

	_disconnectObjects : function ()
	{
		dojo.forEach(this._connections, function( connection )
		{
			dojo.disconnect(connection);
		});

		this._connections = [];
	},

	_storeValue : function ( w_id, value )
	{
		this.id_store[this.current_item_idx][w_id] = value;
	}
});