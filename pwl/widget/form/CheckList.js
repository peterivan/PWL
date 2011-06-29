dojo.provide('pwl.widget.form.CheckList');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('dojo.fx');

dojo.require('pwl.widget.Accept');
dojo.require('pwl.widget.form.TextBox');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.CheckList',
	[dijit._Widget, dijit._Templated],
{
	baseClass: 'pwlWidgetFormCheckList',

	templateString: dojo.cache('pwl.widget.form', 'templates/CheckList.html'),
	widgetsInTemplate: true,

	label_store: null,
	label_store_id_attribute: 'id',

	value_store: null,
	value_store_id_attribute: 'id',

	change_topic: null,
	save_topic: null,
	load_topic: null,

	enable_search: false,
	w_search_box: null,
	search_label: 'Hľadaj',
	search_attr: 'id',

	show_accept_widget: false,
	w_accept_widget: null,
	accept_widget_mixin: null,
	save_mixin: null,

	value: [], // dummy attr, not really used, intentional

	_label_data: null,
	_value_data: null,

	_search_timer: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		this.change_topic = '/pwl/widget/form/CheckList/' + this.id + '/changed';
		this.save_topic = '/pwl/widget/form/CheckList/' + this.id + '/saved';
		this.load_topic = '/pwl/widget/form/CheckList/' + this.id + '/loaded';

		dojo.connect(this.n_list, 'onclick', this, function ( i_evt )
		{
			var target = i_evt.target;

			if ( target.nodeName == 'LI' )
			{
				dojo.toggleClass(target, 'selected');

				this.onChange(this.get('value'));
			}
		});

		if ( this.enable_search )
			this._createSearchBox();

		if ( this.show_accept_widget )
			this._createAcceptWidget();

		this._render();
	},


	
/******************************************************************************/

	setLabelStore: function ( i_store, i_query, i_id_attribute )
	{
	},

	setValueStore: function ( i_store, i_query, i_id_attribute )
	{
	},

	save: function ( i_save_mixin )
	{
		var current_value = this.get('value');
		var old_value = this._value_data;

		/***********************************************************************/
		/* search for modified items *******************************************/

		var to_delete = []; // items of value store
		var to_add = []; // items of label store

		current_value.forEach( function ( i_current_item )
		{
			var found = false;

			old_value.forEach( function ( i_old_item )
			{
				if ( this._compare(i_current_item, i_old_item) )
					found = true;
			}, this);

			if ( !found )
				to_add.push(i_current_item);
		}, this);

		old_value.forEach( function ( i_old_item )
		{
			var found = false;

			current_value.forEach( function ( i_current_item )
			{
				if ( this._compare(i_current_item, i_old_item) )
					found = true;
			}, this);

			if ( !found )
				to_delete.push(i_old_item);
		}, this);

		/***********************************************************************/
		/* apply differences ***************************************************/

		to_delete.forEach( function ( i_item )
		{
			this.value_store.deleteItem(i_item);
		}, this);

		to_add.forEach( function ( i_item )
		{
			var new_item = this.createNewValueItem(i_item, this);

			this.value_store.newItem(new_item);
		}, this);

		/***********************************************************************/

		var save_mixin = i_save_mixin || this.save_mixin || {};

		var save_handler =
		{
			scope: this,

			onComplete: function ()
			{
				this._loadValueData();

				this.onSave(this.get('value'));

				if ( dojo.isFunction(save_mixin.onComplete) )
					dojo.hitch(this.save_mixin.onComplete)();
			},

			onError: function ()
			{
			}
		};

		this.value_store.save(save_handler);
	},

	reload: function ()
	{
		if ( this.w_search_box )
			this.w_search_box.set('value', '');

		this._hideAcceptWidget();

		this._render();
	},

	reset: function ()
	{
		if ( this.w_search_box )
			this.w_search_box.set('value', '');

		this._hideAcceptWidget();

		dojo.query('li', this.n_list).forEach( function ( i_node )
		{
			dojo.removeClass(i_node, 'selected');

			var label_item = dojo.getNodeProp(i_node, 'data-item');

			this._value_data.forEach( function ( i_value_item )
			{
				if ( this._compare(label_item, i_value_item) )
					dojo.addClass(i_node, 'selected');
			}, this);
		}, this);
	},

	formatter: function ( i_item )
	{
		var field = this.label_store_id_attribute || 'id';
		var label = this.label_store.getValue(i_item, field);

		return label;
	},

	search: function ( i_search_term, i_query_options )
	{
		var search_term = null;

		if ( i_search_term && i_search_term.length > 0 )
			search_term = i_search_term;
		else if ( this.w_search_box )
			search_term = this.w_search_box.get('value');

		var search_attr = this.search_attr || 'id';

		var query = {};
		query[search_attr] = search_term + '*';

		var query_options =
		{
			ignoreCase: true
		};

		if ( i_query_options )
			dojo.mixin(query, i_query_options);

		this.label_store.fetch(
		{
			scope: this,
			query: query,
			queryOptions: query_options,

			onComplete: function ( i_data )
			{
				this._renderItems(i_data, this._value_data);
			}
		});

		this._search_timer = null;
	},

	createNewValueItem: function ( i_label_item, i_this )
	{
		var new_item = {};

		new_item[this.value_store_id_attribute] = this.label_store.getValue(i_label_item, this.label_store_id_attribute);

		for ( var i in i_label_item )
		{
			if ( i != this.label_store_id_attribute && i[0] != '_' )
				new_item[i] = i_label_item[i];
		}

		return new_item;
	},

/******************************************************************************/
/** Events ********************************************************************/

	onChange: function ( i_items )
	{
		this._showAcceptWidget();

		if ( this.change_topic )
		{
			console.debug('published topic: ', this.change_topic, i_items);

			dojo.publish(this.change_topic, [i_items]);
		}
	},

	onSave: function ( i_items )
	{
		this._hideAcceptWidget();

		if ( this.save_topic )
		{
			console.debug('published topic: ', this.save_topic, i_items);

			dojo.publish(this.save_topic, [i_items]);
		}
	},

	onLoad: function ()
	{
		if ( this.load_topic )
		{
			console.debug('published topic: ', this.load_topic);

			dojo.publish(this.load_topic);
		}
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Attr handlers *************************************************************/

	_getValueAttr: function ()
	{
		var items = [];

		dojo.query('li[class~=selected]', this.n_list).forEach( function ( i_node )
		{
			var id = dojo.attr(i_node, 'data-identifier');

			this._label_data.forEach( function ( i_item )
			{
				var item_id = this.label_store.getValue(i_item, this.label_store_id_attribute || 'id');

				if ( item_id == id )
					items.push(i_item);
			}, this);
		}, this);

		return items;
	},

	_setEnable_searchAttr: function ( i_value )
	{
		this.enable_search = i_value ? true : false;

		if ( this.enable_search )
		{
			if ( !this.w_search_box )
				this._createSearchBox();
			else
				dojo.style(this.n_search, 'display', 'block');
		}
		else
		{
			if ( this.w_search_box )
				dojo.style(this.n_search, 'display', 'none');
		}
	},

/******************************************************************************/

	_compare: function ( i_label_item, i_value_item )
	{
		var label_field = this.label_store.getValue(i_label_item, this.label_store_id_attribute || 'id');
		var value_field = this.value_store.getValue(i_value_item, this.value_store_id_attribute || 'id');

		if ( label_field == value_field )
			return true;

		return false;
	},

	_render: function ()
	{
		this._loadData().then( dojo.hitch(this, function( i_data )
		{
			this._renderItems(i_data[0], i_data[1]);

			this.onLoad();
		}));
	},

	_renderItems: function ( i_label_data, i_value_data )
	{
		dojo.empty(this.n_list);

		i_label_data.forEach( function ( i_label_item )
		{
			var id = this.label_store.getValue(i_label_item, this.label_store_id_attribute || 'id');
			var label = this.formatter(i_label_item);

			var selected = false;

			i_value_data.forEach( function ( i_value_item )
			{
				if ( selected )
					return;

				selected = this._compare(i_label_item, i_value_item);
			}, this);

			var node_params =
			{
				'data-identifier': id,
				'class': selected ? 'selected' : '',
				innerHTML: label
			};

			var node = dojo.create('li', node_params, this.n_list);

			node['data-item'] = i_label_item;
		}, this);
	},

	_loadData: function ()
	{
		var p = new dojo.Deferred();

		this._label_data = null;
		this._value_data = null;

		this._loadLabelData(p);
		this._loadValueData(p);

		return p;
	},

	_loadLabelData: function ( i_promise )
	{
		if ( this.label_store )
		{
			this.label_store.fetch(
			{
				scope: this,

				onComplete: function ( i_data )
				{
					this._label_data = i_data;

					if ( i_promise && dojo.isArray(this._label_data) && dojo.isArray(this._value_data) )
						i_promise.callback([this._label_data, this._value_data]);
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

				onComplete: function ( i_data )
				{
					this._value_data = i_data;

					if ( i_promise && dojo.isArray(this._label_data) && dojo.isArray(this._value_data) )
						i_promise.callback([this._label_data, this._value_data]);
				}
			});
		}
	},

	_createSearchBox: function ()
	{
		this.w_search_box = new pwl.widget.form.TextBox({}, dojo.create('span', null, this.n_search));

		var func = function ()
		{
			if ( this._search_timer )
				clearTimeout(this._search_timer);

			this._search_timer = setTimeout(dojo.hitch(this, 'search'), 500);
		};

		dojo.connect(this.w_search_box, 'onKeyUp', this, func);
		dojo.connect(this.w_search_box, 'onErase', this, func);
	},

	_createAcceptWidget: function ()
	{
		dojo.style(this.n_accept_container, 'height', '2.6em');

		this.w_accept_widget = new pwl.widget.Accept(dojo.mixin({}, this.accept_widget_mixin || {}), dojo.create('span', null, this.n_accept));

		dojo.connect(this.w_accept_widget, 'onAccept', this, 'save');
		dojo.connect(this.w_accept_widget, 'onCancel', this, 'reset');
	},

	_acceptWidgetIsVisible: function ()
	{
		if ( this.w_accept_widget )
		{
			var b_accept = dojo.marginBox(this.n_accept);

			return b_accept.h > 0;
		}

		return false;
	},

	_showAcceptWidget: function ()
	{
		if ( this.w_accept_widget )
		{
			if ( !this._acceptWidgetIsVisible() )
			{
				dojo.fx.wipeIn(
				{
					node: this.n_accept
				}).play();
			}
		}
	},

	_hideAcceptWidget: function ()
	{
		if ( this.w_accept_widget )
		{
			if ( this._acceptWidgetIsVisible() )
			{
				dojo.fx.wipeOut(
				{
					node: this.n_accept
				}).play();
			}
		}
	}
});