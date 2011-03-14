dojo.provide('pwl.widget.ItemListEditor');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dojo.fx');

dojo.require('pwl.widget.Accept');

/******************************************************************************/

dojo.declare(
	'pwl.widget.ItemListEditor',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetItemListEditor',

	templateString: dojo.cache('pwl.widget', 'templates/ItemListEditor.html'),
	widgetsInTemplate: true,

	accept_widget: '',

	item_multimodal_widget: '',
	item_view_widget: '',
	item_edit_widget: '',
	item_new_widget: '',

	mode_map: null,

	mode: 'view',
	edit_mode: 'all',

	store: '',
	query: '',

	value_attr: '',

	_store_connects: [],

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		this.mode_map =
		{
			'new': 'new',
			'edit': 'edit',
			'view': 'view'
		};

		if ( this.accept_widget )
		{
			if ( dojo.isFunction(this.accept_widget) )
				this.accept_widget = new this.accept_widget({}, dojo.create('div', null, this.n_accept));
			else if ( dojo.isObject(this.accept_widget) )
				this.accept_widget.placeAt(this.n_accept);
			else if ( typeof(this.accept_widget) == 'string' )
				this.accept_widget = new dojo.getObject(this.accept_widget)({}, dojo.create('div', null, this.n_accept));
		}
		else
			this.accept_widget = new pwl.widget.Accept({}, dojo.create('span', null, this.n_accept));

		dojo.connect(this.accept_widget, 'onAccept', this, 'accept');
		dojo.connect(this.accept_widget, 'onCancel', this, 'cancel');
		dojo.connect(this.n_new_item, 'onclick', this, 'addNewItem');

		this.refresh();
	},

/******************************************************************************/

	refresh: function ()
	{
		this._loadData();
	},

	accept: function ()
	{
		if ( this.mode == 'edit' )
		{
			var is_children_valid = true;

			this.getChildren().forEach( function ( i_child )
			{
				//var is_valid = false;

				// TODO: validation first;

				if ( dojo.isFunction(i_child.saveValues) )
					i_child.saveValues();
			});

			this.store.save();

			this.set('mode', 'view');
		}
	},

	cancel: function ()
	{
		this.set('mode', 'view');
	},

	addNewItem: function ()
	{
		this.set('mode', 'edit');
		this._renderNewItem();
	},

/******************************************************************************/
/** Events ********************************************************************/


/******************************************************************************/
/** protected **/
/******************************************************************************/

	_loadData: function ()
	{
		this.store.fetch(
		{
			scope: this,
			query: this.query,

			onComplete: function ( i_data )
			{
				if ( i_data.length > 0 )
					this._renderItems(i_data);
			}
		});
	},

	_renderItems: function ( i_items )
	{
		i_items.forEach( function ( i_item )
		{
			var widget = null;
			var attrs =
			{
				store: this.store,
				identity: i_item,

				default_mode: this.mode
			};

			var widget_prop = this.item_multimodal_widget;

			if ( dojo.isFunction(widget_prop) )
				widget = new widget_prop(attrs);
			else if ( typeof(widget_prop) == 'string' )
				widget = new dojo.getObject(widget_prop)(attrs);

			if ( widget )
			{
				if ( this.value_attr )
					widget.set('value', this.store.getValue(i_item, this.value_attr));

				if ( this.mode == 'view' )
				{
					dojo.connect(widget, 'onClick', this, function ()
					{
						this.set('mode', 'edit');
					});
				}

				this.addChild(widget);
			}
		}, this);
	},

	_renderNewItem: function ()
	{
		var widget = null;
		var attrs =
		{
			store: this.store
		};

		if ( dojo.isFunction(this.item_multimodal_widget) )
			widget = new this.item_multimodal_widget(attrs);
		else if ( typeof(this.item_multimodal_widget) == 'string' )
			widget = new dojo.getObject(this.item_multimodal_widget)(attrs);

		if ( widget )
		{
			this.addChild(widget);
		}
	},

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setModeAttr: function ( i_value )
	{
		if ( this.mode != i_value )
		{
			if ( this.mode == 'edit' )
				dojo.fx.wipeOut({node: this.n_accept}).play();
			else
				dojo.fx.wipeIn({node: this.n_accept}).play();

			this.mode = i_value;

			this.getChildren().forEach( function ( i_child ) { i_child.destroyRecursive(); });

			this._loadData();
		}
	},

	_setStoreAttr: function ( i_value )
	{
		this.store = i_value;
	},


});