dojo.provide('pwl.widget._Matrix');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget._Matrix',
	[dijit._Widget, dijit._Templated],
{
	baseClass: 'pwlWidgetMatrix',

	templateString: dojo.cache('pwl.widget', 'templates/_Matrix.html'),
	widgetsInTemplate: false,

	widget: '',

	x_store: '',
	x_id_attribute: 'id',
	x_label_attribute: 'id',
	x_query: null,
	_x_data: null,

	y_store: '',
	y_id_attribute: 'id',
	y_label_attribute: 'id',
	y_query: null,
	_y_data: null,

	value_store: '',
	value_query: '',
	value_widget: '',
	_value_data: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate : function()
	{
		this.inherited(arguments);

		this.render();
	},

/******************************************************************************/

	render: function ()
	{
		this._loadData().then( dojo.hitch(this, function( i_data )
		{
			this._renderXData();
			this._renderYData();

			this.onLoad();
		}));
	},

	reload: function ()
	{
	},

	reset: function ()
	{
	},

	xFormatter: function ( i_item )
	{
		var field = this.x_label_attribute || this.x_id_attribute || 'id';
		var label = this.x_store.getValue(i_item, field);

		return label;
	},

	yFormatter: function ( i_item )
	{
		var field = this.y_label_attribute || this.y_id_attribute || 'id';
		var label = this.y_store.getValue(i_item, field);

		return label;
	},

/******************************************************************************/

	save: function ( i_save_mixin )
	{

	},

/******************************************************************************/
/** Events ********************************************************************/

	onLoad: function ()
	{
	},

	onSave: function ()
	{
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_renderXData: function ()
	{
		if ( dojo.isArray(this._x_data) )
		{
			this._x_data.forEach( function ( i_item )
			{
				var label = this.xFormatter(i_item);

				var e_th = dojo.create('th',
				{
					innerHTML: label
				}, this.n_head_row);

				e_th['data-item'] = i_item;
			}, this);
		}
	},

	_renderYData: function ()
	{
		if ( dojo.isArray(this._y_data) )
		{
			this._y_data.forEach( function ( i_item )
			{
				var label = this.yFormatter(i_item);

				var e_tr = dojo.create('tr', null, this.n_body);

				var e_th = dojo.create('th',
				{
					innerHTML: label
				}, e_tr);

				e_th['data-item'] = i_item;

				for ( var i = 0; i < this._x_data.length; i++ )
				{
					var e_td = dojo.create('td',
					{

					}, e_tr);

					var x_item = this._x_data[i];

					this._createValueWidget(e_td, x_item, i_item);
				}
			}, this);
		}
	},

	_createValueWidget: function ( i_cell_node, i_x_item, i_y_item )
	{
		if ( this.value_widget )
		{
			var widget_obj = null;

			if ( dojo.isObject(this.value_widget) )
				widget_obj = this.value_widget;
			else
				widget_obj = dojo.getObject(this.value_widget);

			var widget = new widget_obj(
			{
				x_item: i_x_item,
				y_item: i_y_item
			});

			widget.placeAt(i_cell_node);

			var x_id = this.x_store.getValue(i_x_item, this.x_id_attribute || 'id');
			var y_id = this.y_store.getValue(i_y_item, this.y_id_attribute || 'id');

			dojo.attr(widget.domNode, 'data-x_id', x_id);
			dojo.attr(widget.domNode, 'data-y_id', y_id);

			this._applyValueData(widget, x_id, y_id);
		}
	},

	_applyValueData: function ( i_widget, i_x_id, i_y_id )
	{
	},

/******************************************************************************/
/** Data loading **************************************************************/

	_loadData: function ()
	{
		var p = new dojo.Deferred();

		this._x_data = null;
		this._y_data = null;
		this._value_data = null;

		this._loadXData(p);
		this._loadYData(p);
		this._loadValueData(p);

		return p;
	},

	_loadXData: function ( i_promise )
	{
		if ( this.x_store )
		{
			this.x_store.fetch(
			{
				scope: this,
				query: this.x_query,

				onComplete: function ( i_data )
				{
					this._x_data = i_data;

					if ( i_promise && dojo.isArray(this._x_data) && dojo.isArray(this._y_data) && dojo.isArray(this._value_data) )
						i_promise.callback([this._x_data, this._y_data, this._value_data]);
				}
			});
		}
	},

	_loadYData: function ( i_promise )
	{
		if ( this.y_store )
		{
			this.y_store.fetch(
			{
				scope: this,
				query: this.y_query,

				onComplete: function ( i_data )
				{
					this._y_data = i_data;

					if ( i_promise && dojo.isArray(this._x_data) && dojo.isArray(this._y_data) && dojo.isArray(this._value_data) )
						i_promise.callback([this._x_data, this._y_data, this._value_data]);
				}
			});
		}
	},

	_loadValueData: function ( i_promise )
	{
		if ( this.value_store )
		{
			this.value_store.fetch(
			{
				scope: this,
				query: this.value_query,

				onComplete: function ( i_data )
				{
					this._value_data = i_data;

					if ( i_promise && dojo.isArray(this._x_data) && dojo.isArray(this._y_data) && dojo.isArray(this._value_data) )
						i_promise.callback([this._x_data, this._y_data, this._value_data]);
				}
			});
		}
	},
});