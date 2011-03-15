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

	title: '',

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

		if ( !this.title )
			dojo.style(this.n_header, 'display', 'none');

		this.refresh();
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

		var p_box = dojo.contentBox(this.domNode.parentNode);

		dojo.marginBox(this.domNode, { w: p_box.w, h: p_box.h });

		var t_box = dojo.marginBox(this.domNode);
		var h_box = dojo.marginBox(this.n_header);
		var a_box = dojo.marginBox(this.n_accept);

		var mc_box =
		{
			h: t_box.h - h_box.h - a_box.h
		};

		dojo.marginBox(this.n_main_container, mc_box);
	},

/******************************************************************************/
/** Events ********************************************************************/

	onLoad: function ()
	{},

	onNew: function ( i_item )
	{},

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

			this.store.save(
			{
				scope: this,

				onComplete: this.saveComplete,
				onError: this.saveError
			});

			this.set('mode', 'view');
		}
	},

	cancel: function ()
	{
		this.set('mode', 'view');

		this.refresh();
	},

	addNewItem: function ()
	{
		this.set('mode', 'edit');
		this._renderNewItem();
	},

/******************************************************************************/
/** Store event handlers ******************************************************/

	saveComplete: function ()
	{
	},

	saveError: function ()
	{
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_loadData: function ()
	{
		this.getChildren().forEach( function ( i_child )
		{
			i_child.destroyRecursive();
		});

		this.store.fetch(
		{
			scope: this,
			query: this.query,

			onComplete: function ( i_data )
			{
				if ( i_data.length > 0 )
					this._renderItems(i_data);

				this.onLoad();
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
			store: this.store,
			mode: 'new'
		};

		if ( dojo.isFunction(this.item_multimodal_widget) )
			widget = new this.item_multimodal_widget(attrs);
		else if ( typeof(this.item_multimodal_widget) == 'string' )
			widget = new dojo.getObject(this.item_multimodal_widget)(attrs);

		if ( widget )
		{
			this.addChild(widget);

			dojo.connect(widget, 'onClick', this, function ()
			{
				this.set('mode', 'edit');
			});

			this.onNew(widget);
		}
	},

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setModeAttr: function ( i_value )
	{
		if ( this.mode != i_value )
		{
			var anim_props =
			{
				node: this.n_accept,
				onEnd: dojo.hitch(this, function () { this.resize(); })
			};

			if ( this.mode == 'edit' )
				dojo.fx.wipeOut(anim_props).play();
			else
				dojo.fx.wipeIn(anim_props).play();

			this.mode = i_value;

			this.getChildren().forEach( function ( i_child )
			{
				i_child.set('mode', this.mode_map[i_value]);
			}, this);
		}
	},

	_setStoreAttr: function ( i_value )
	{
		this.store = i_value;
	},


});