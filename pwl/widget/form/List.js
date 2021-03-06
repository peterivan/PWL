dojo.provide('pwl.widget.form.List');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('dojo.fx');

dojo.require('pwl.widget.Accept');
dojo.require('pwl.widget.form.TextBox');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.List',
	[dijit._Widget, dijit._Templated],
{
	baseClass: 'pwlWidgetFormCheckList',

	templateString: dojo.cache('pwl.widget.form', 'templates/List.html'),
	widgetsInTemplate: true,

	store: '',
	query: null,
	default_id_attribute: 'id',
	id_attribute: 'id',
	label_attribute: 'id',

	item: null,

	change_topic: null,
	load_topic: null,

	enable_search: false,
	w_search_box: null,
	search_label: 'Hľadaj',
	default_search_attribute: 'id',
	search_attribute: 'id',

	load_everything: true,

	value: [], // dummy attr, not really used, intentional

	_data: null,
	_dummy_items: null,

	_search_timer: null,

	_store_connects: [],

	show_overlay: false,
	_overlay: null,        
	auto_size: true,
    
	can_deselect: false,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postMixInProperties: function ()
	{
		this.inherited(arguments);

		if ( this.load_everything == 0 )
			this.load_everything = false;
		else
			this.load_everything = true;
	},

	postCreate: function ()
	{
		this.inherited(arguments);

		this._dummy_items = [];

		var chanel = '/' + this.declaredClass.replace('.', '/') + '/';

		if ( !this.change_topic )
			this.change_topic = chanel + this.id + '/changed';
		if ( !this.load_topic )
			this.load_topic = chanel + this.id + '/loaded';

		if ( this.enable_search )
			this._createSearchBox();

		this._connect();
		this._connectStore();

		this._createSearchBox();

		this._render();
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

        if( this.auto_size )
		{
				var b_parent = dojo.contentBox(this.domNode.parentNode);
				dojo.marginBox(this.domNode, b_parent);                        
        }

		var b_this = dojo.contentBox(this.domNode);

		var b_header = dojo.marginBox(this.n_header);
		var b_search = dojo.contentBox(this.n_search);

		dojo.marginBox(this.n_list_container,
		{
			h: b_this.h - b_header.h - b_search.h - 5
		});

		dojo.style(this.n_list_container,"overflow","auto");
		/**********************************************************************/
	},

/******************************************************************************/

	reload: function ( i_clear_cache )
	{
		this.reset();

		this._render();
	},

	reset: function ()
	{
		if ( this.w_search_box )
			this.w_search_box.set('value', '');

		dojo.query('li', this.n_list).forEach( function ( i_node )
		{
			dojo.removeClass(i_node, 'selected');

			var label_item = dojo.getNodeProp(i_node, 'data-item');

			if ( dojo.isFunction(this._compare) ) // TODO: provide default _compare function
			{
				this._data.forEach( function ( i_value_item )
				{
					if ( this._compare(label_item, i_value_item) )
						dojo.addClass(i_node, 'selected');
				}, this);
			}
		}, this);

		this.item = null;
	},

	formatter: function ( i_item, i_store )
	{
		var field = this.label_attribute || this.id_attribute || this.default_id_attribute;
		var label = this.store.getValue(i_item, field);

		return label;
	},

	search: function ( i_search_term )
	{
		if ( i_search_term && i_search_term.length > 0 )
			search_term = i_search_term;
		else if ( this.w_search_box )
			search_term = this.w_search_box.get('value');

		var regex = new RegExp('^' + search_term + '.*', 'i');
		var field = this.search_attribute || this.default_search_attribute;

		var result = dojo.filter(this._data, function ( i_item )
		{
			var value = this.store.getValue(i_item, field);

			if ( value.match(regex) || search_term.length == 0 )
				return true;

			return false;
		}, this);

		this._renderItems(result);

		this._search_timer = null;
	},

/******************************************************************************/
/** Dummy items ***************************************************************/

	addDummyItem: function ( i_identifier, i_label, i_position )
	{
		var item =
		{
			id: i_identifier,
			label: i_label,
                        title: i_label,
			position: i_position || 'last',
			is_dummy: true
		};

		this._dummy_items.push(item);

		this._renderDummyItem(item);
	},

/******************************************************************************/
/** Events ********************************************************************/

	onChange: function ( i_items )
	{
		if ( this.change_topic )
		{
			console.debug('published topic: ', this.change_topic, i_items);

			dojo.publish(this.change_topic, [i_items]);
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
		var item = null;

		dojo.query('li[class~=selected]', this.n_list).forEach( function ( i_node )
		{
			item = dojo.getNodeProp(i_node, 'data-item');
		});

		return item;
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

	_setStoreAttr: function ( i_store )
	{
		
		this.store = i_store;

		this._store_connects.forEach(dojo.disconnect);

		this._connectStore();
		this._render();
	},

	_setQueryAttr: function ( i_query )
	{
		this.query = i_query;

		this.reload();
	},

/******************************************************************************/

	_connect: function (  )
	{
		dojo.connect(this.n_list, 'onclick', this, function ( i_evt )
		{
			var target = i_evt.target;

			if ( target.nodeName == 'LI' )
			{
				dojo.query('li[class~=selected]', this.n_list).forEach( function ( i_node )
				{
					dojo.toggleClass(i_node, 'selected');
				});

				dojo.toggleClass(target, 'selected');

				if( this.can_deselect )// moze deselektnut item
				{
					if ( this.item == this.get('value') )// klikne na neho druhy krat za sebou tak chcem deseletnut
					{
						dojo.toggleClass(target, 'selected');
						this.item = null;
						this.onChange( null );
					}else					
						this._onChange(this.get('value'));					
				}else
					this._onChange(this.get('value'));
			}
		});
	},

	_connectStore: function ()
	{
		if ( this.store )
		{
			var c1 = dojo.connect(this.store, 'onNew', this, function ( i_new_item )
			{
				this._data.push(i_new_item);
				this._renderItem(i_new_item);
			});

			this._store_connects.push(c1);
		}
	},


        _showOverlay: function()
        {
            if( this.show_overlay)
            {
                console.debug("showing overlay")
                if( !this._overlay )
                {
                    console.debug("creating overlay")
                    
                    var coords = dojo.marginBox(this.domNode);
                    this._overlay = dojo.create("div",{},this.domNode);
                    dojo.style(this._overlay,"position", "absolute")
                    dojo.style(this._overlay,"height", (coords.h - 5) + "px")                    
                    dojo.style(this._overlay,"width", (coords.w - 5) + "px")
                    dojo.addClass(this._overlay,"overlay");
                } 
                dojo.style(this._overlay,"display", "block")
            }    
        },

        _hideOverlay: function()
        {
            if( this.show_overlay && this._overlay)
            {
                dojo.style(this._overlay,"display", "none")
            }    
        },
/******************************************************************************/
/** Rendering *****************************************************************/

	_render: function ()
	{
                this._showOverlay();
                
		this._loadData().then( dojo.hitch(this, function( i_data )
		{
			this._renderItems(i_data);
                        
                        this._hideOverlay();
                        
			this.onLoad();
		}));
	},

	_renderItems: function ( i_data )
	{
		dojo.empty(this.n_list);
                
       // this.debug_list = [];
		i_data.forEach( this._renderItem, this );

		//this._dummy_items.forEach( this._renderDummyItem, this );
	},

	_renderItem: function ( i_item )
	{
		var id = this.store.getValue(i_item, this.id_attribute || this.default_id_attribute);
		var label = this.formatter(i_item, this.store);
                
//		if( this.debug_list[id] )
//		{
//			console.debug("nasiel rovnake id...",id)
//			return;
//		}else{
//			console.debug("vkladam id:",id)
//		}   
//
//		this.debug_list.push(id);
                
		var node_params =
		{
			'data-identifier': id,
			innerHTML: label
		};

		var node = dojo.create('li', node_params, this.n_list);

		node['data-item'] = i_item;
	},

	_renderDummyItem: function ( i_item )
	{
		if ( !i_item.id )
			throw 'Dummy item must have id field.';

		var node_params =
		{
			'data-identifier': i_item.id,
			innerHTML: i_item.label || '',
			'class': 'dummy'
		};

		var node = dojo.create('li', node_params, this.n_list, i_item.position);

		node['data-item'] = i_item;
	},

/******************************************************************************/
/** Data loading **************************************************************/

	_loadData: function ()
	{
		var p = new dojo.Deferred();

		if (this.store)
		{
			this._data = null;

			var search_attr = this.search_attribute || this.default_search_attribute;

			if ( this.query && this.query[search_attr] )
				this.query[search_attr] = '*';

			var query_string = dojo.objectToQuery(this.query);

			if ( query_string )
				query_string = '?' + query_string;

			if ( this._shouldLoadAll() )
			{
				this.store.fetch(
				{
					scope: this,
					query: query_string,

					onComplete: function ( i_data )
					{
						this._data = i_data;
//console.debug("pwl list data",i_data)
						p.callback(i_data);
					}
				});
			}
			else
			{
				this._data = [];
				p.callback([]);
			}

		}

		return p;
	},

	_shouldLoadAll: function ()
	{
		var qs = dojo.queryToObject(dojo.objectToQuery(this.query));

		if ( qs.order )
			delete qs.order;

		qs = dojo.objectToQuery(qs);

		var load_all = this.load_everything || qs;

		return load_all;
	},

	_createSearchBox: function ()
	{
		if ( this.enable_search && !this.w_search_box )
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
		}
	},

/******************************************************************************/
/** False events **************************************************************/

	_onChange: function ( i_item )
	{
		if ( this.item != i_item )
		{
			this.item = i_item;

			this.onChange(i_item);
		} 
	}
});