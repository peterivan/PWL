dojo.provide('pwl.widget.form.CheckList');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');

dojo.require('dojo.DeferredList');

dojo.require('dijit.form._FormWidget');
dojo.require('dijit.form.CheckBox');

dojo.require('pwl.widget.form.WidgetGroup');
dojo.require('pwl.widget.form.TextBox');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.CheckList',
	[pwl.widget.form.WidgetGroup],
{
	baseClass: 'pwlWidgetFormCheckList',

	templateString: dojo.cache('pwl.widget.form', 'templates/CheckList.html'),

	label_store: null,
	label_store_id_attribute: 'id',
	label_store_default_id_attribute: 'id',
	label_store_label_attribute: 'title',
	label_store_query: null,

	value_store: null,
	value_store_id_attribute: 'id',
	value_store_default_id_attribute: 'id',
	value_store_query: null,

	change_topic: null,
	save_topic: null,
	load_topic: null,

	enable_search: false,
	w_search_box: null,
	search_label: 'Hľadaj',
	search_attribute: 'id',
	default_search_attribute: 'id',

	save_mixin: null,

	selection: null,

	autolayout: true,
	
	enable_title: false,
	n_title: '',
	
	n_search: null,	
	n_list_container: null,
	n_list: null,

	_label_data: null,
	_value_data: null,

	_label_data_loaded: true,
	_value_data_loaded: true,

	_search_timer: null,

	_checkboxes: null,

        show_overlay: false,
        _overlay: null,  
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postMixInProperties: function ()
	{
		this.inherited(arguments);

		this.selection = [];
		this._checkboxes = [];
		this._value_data = [];
	},

	postCreate: function ()
	{
		this.inherited(arguments);

		this.change_topic = '/pwl/widget/form/CheckList/' + this.id + '/changed';
		this.save_topic = '/pwl/widget/form/CheckList/' + this.id + '/saved';
		this.load_topic = '/pwl/widget/form/CheckList/' + this.id + '/loaded';

		dojo.connect(this.n_list, 'onclick', this, function ( i_evt )
		{
			i_evt.preventDefault();

			var target = this._getTargetListItem(i_evt.target);

			this._toggleSelectedNode(target, 'selected');
			this._toggleSelectedItem(dojo.getNodeProp(target, 'data-item'));

			dojo.query('label', target).forEach( function ( i_label_node )
			{
				i_label_node.focus();
			})

			this.onChange(this.get('value'));
		});

		if ( this.enable_search )
			this._createSearchBox();

		if( this.enable_title)	
			this.n_title.innerHTML = this.title;
		
		this._render();
	},

	destroy: function ()
	{
		this.inherited(arguments);

		this._destroyCheckboxes();
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

		if ( this.autolayout )
		{
			var b_parent = dojo.contentBox(this.domNode.parentNode);

			dojo.marginBox(this.domNode, b_parent);

			var b_this = dojo.contentBox(this.domNode);
			var b_search_box = dojo.marginBox(this.n_search);
			var b_title_box = dojo.marginBox(this.n_title);

			dojo.marginBox(this.n_list_container, {h: b_this.h - b_search_box.h - b_title_box.h});

			if ( this.w_search_box )
			{
				//var b_list_container = dojo.contentBox(this.n_list_container);

				//dojo.style(this.w_search_box.domNode, 'width', b_list_container.w + 'px');
			}
		}
	},

/******************************************************************************/

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
				if ( this._compareStoreItems(i_current_item, i_old_item) )
					found = true;
			}, this);

			if ( !found )
				to_add.push(i_current_item);
		}, this);

		if( old_value )
		{
			old_value.forEach( function ( i_old_item )
			{
				var found = false;

				current_value.forEach( function ( i_current_item )
				{
					if ( this._compareStoreItems(i_current_item, i_old_item) )
						found = true;
				}, this);

				if ( !found )
					to_delete.push(i_old_item);
			}, this);			
		}
		
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
			},

			onError: function ( i_error )
			{
				this.onSaveError(i_error);
			}
		};

		if( this.value_store && this.value_store.isDirty()) //&& this.value_store.isDirty()
		{
			this.value_store.save(save_handler);
			this.onSaveStart(this.get('value'));
		}
			
	},

	reload: function ()
	{
		if ( this.w_search_box )
			this.w_search_box.set('value', '');

		this._render();
	},
	
	reloadValues: function()
	{
		this._showOverlay();
             
		this._loadValueData().then( dojo.hitch(this, function()
		{
			this._renderItems(this._label_data, this._value_data);

            this._hideOverlay();
                        
			this.onLoad();
		}));
	},

	reset: function ()
	{
		this.selection = [];

		this._unselectItems();
		this._selectItems(this._value_data);
	},

	hard_reset: function ()
	{
		this.selection = [];
		this._unselectItems();
	},
        
	formatter: function ( i_item )
	{
		var field = this.label_store_label_attribute || this.label_store_id_attribute || this.label_store_default_id_attribute;
		var label = this.label_store.getValue(i_item, field);

		return label;
	},

	search: function ( i_search_term, i_query_options )
	{
            
		this._showOverlay();
            
		var search_term = null;

		if ( i_search_term && i_search_term.length > 0 )
			search_term = i_search_term;
		else if ( this.w_search_box )
			search_term = this.w_search_box.get('value');

		var search_attr = this.search_attribute || this.default_search_attribute;

		var query = this.label_store_query || {};
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
				this._renderItems(i_data, this.selection);
                                
				this._hideOverlay();
			}
		});

		this._search_timer = null;
	},

	
	createNewValueItem: function ( i_label_item, i_this )
	{
		var new_item = {};
		
		new_item['id'] = this.label_store.getValue(i_label_item, this.label_store_id_attribute);
		new_item[this.value_store_id_attribute] = this.label_store.getValue(i_label_item, this.label_store_id_attribute);

		for ( var i in i_label_item )
		{
			if ( i != this.label_store_id_attribute && i[0] != '_' )
				new_item[i] = i_label_item[i];
		}

		return new_item;
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Attr handlers *************************************************************/

	_getValueAttr: function ()
	{
		var value = [];

		this.selection.forEach( function ( i_item )
		{
			if ( i_item )
				value.push(i_item);
		});

		this.selection = value;

		return this.selection;
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

	_compareStoreItems: function ( i_label_item, i_value_item )
	{
		var label_field = this.label_store.getValue(i_label_item, this.label_store_id_attribute || this.label_store_default_id_attribute);
		var value_field = null;
					
		// value items may come from label or value stores
		// items from label store are usualy in selection

		if ( this.label_store.isItem(i_value_item) )
		{
			//value_field = this.label_store.getValue(i_value_item, this.value_store_id_attribute || this.value_store_default_id_attribute);
			// zablokovane nakolko pri roznom id_attribute pre obe store sa nevybral spravne value item
			value_field = this.label_store.getValue(i_value_item, this.label_store_id_attribute || this.label_store_default_id_attribute);
		}	
		else
			value_field = this.value_store.getValue(i_value_item, this.value_store_id_attribute || this.value_store_default_id_attribute);
		
		if ( label_field == value_field )
			return true;

		return false;
	},

	_render: function ()
	{
        this._showOverlay();
             
		this._loadData().then( dojo.hitch(this, function()
		{

			this._renderItems(this._label_data, this._value_data);

            this._hideOverlay();
                        
			this.onLoad();
		}));
	},

	_renderItems: function ( i_label_data, i_value_data )
	{                            
            
		dojo.empty(this.n_list);

		this._destroyCheckboxes();

		if ( dojo.isArray(i_label_data) )
		{
			i_label_data.forEach( function ( i_label_item )
			{
				var id = this.label_store.getValue(i_label_item, this.label_store_id_attribute || this.label_store_default_id_attribute);
				var label = this.formatter(i_label_item);

				var selected = false;

				var node_params =
				{
					'data-identifier': id,
					'class': selected ? 'selected' : ''
				};

				var cb_id = this.id + id;

				var node = dojo.create('li', node_params, this.n_list);
				var n_label = dojo.create('label', {'for': cb_id, innerHTML: label})

				var cb = new dijit.form.CheckBox({id: cb_id});

				this._checkboxes.push(cb);

				cb.placeAt(node);
				dojo.place(n_label, node);

				node['data-item'] = i_label_item;
				
				
			}, this);
		}

		this._selectItems(i_value_data);
	},

	_unselectItems: function ()
	{
		dojo.query('li', this.n_list).forEach( function ( i_node )
		{
			var label_item = dojo.getNodeProp(i_node, 'data-item');

			this._unselectNode(i_node);

			this._removeItemFromSelection(label_item);
		}, this);
	},

	_selectItems: function ( i_value_items )
	{
		dojo.query('li', this.n_list).forEach( function ( i_node )
		{
			var label_item = dojo.getNodeProp(i_node, 'data-item');

			if(dojo.isArray(i_value_items))
			{
				i_value_items.forEach( function ( i_value_item )
				{
					if ( !i_value_item ) // upon delete of array index, taht index is now undefined
						return;

					if ( this._compareStoreItems(label_item, i_value_item) )
					{

						this._selectNode(i_node);

						this._addItemToSelection(label_item);
					}
				}, this)
			}
		}, this);
	},

/******************************************************************************/
/** Data loading **************************************************************/

	_loadData: function ()
	{
		this._label_data = null;
		this._value_data = null;
		
		this.selection = [];
		
		if ( this.label_store )
			this._label_data_loaded = false;
		if ( this.value_store )
			this._value_data_loaded = false;

		var p1 = this._loadLabelData();
		var p2 = this._loadValueData();

		return new dojo.DeferredList([p1, p2]);
	},

	_loadLabelData: function ()
	{
		var p = new dojo.Deferred();
		
		if ( this.label_store )
		{
			var query = null;

			if ( this.label_store_query )
				query = '?' + dojo.objectToQuery(this.label_store_query);

			this.label_store.fetch(
			{
				scope: this,
				query: query,

				onComplete: function ( i_data )
				{
					this._label_data = i_data;
					this._label_data_loaded = true;

					p.callback();
				}
			});
		}
		
		return p;
	},

	_loadValueData: function ()
	{
		var p = new dojo.Deferred();
		
		if ( this.value_store )
		{
			var query = null;

			if ( this.value_store_query )
				query = '?' + dojo.objectToQuery(this.value_store_query);
                            
			this.value_store.fetch(
			{
				scope: this,
				query: query,
                                
				onComplete: function ( i_data )
				{
					
					this._value_data = i_data;
					this._value_data_loaded = true;

					p.callback();
				}
			});
		}
		else
			p.callback();
		
		return p;
	},

	_showOverlay: function()
	{
		if( this.show_overlay)
		{
			console.debug("showing overlay")
			if( !this._overlay )
			{
				this._overlay = dojo.create("div",{},this.domNode);
			} 
			var coords = dojo.marginBox(this.domNode);                

			dojo.style(this._overlay,"position", "absolute")
			dojo.style(this._overlay,"height", (coords.h - 5) + "px")                    
			dojo.style(this._overlay,"width", (coords.w - 5) + "px")
			dojo.addClass(this._overlay,"overlay");                
			dojo.style(this._overlay,"display", "block")
		}    
	},

	_hideOverlay: function()
	{
		if( this.show_overlay && this._overlay)
		{
			console.debug("hiding overlay")
			dojo.style(this._overlay,"display", "none")
		}    
	},
/******************************************************************************/
/** Item selection manipulation ***********************************************/

	_toggleSelectedItem: function ( i_item )
	{
	
		var item_was_deleted = false;

		this.selection.forEach( function ( i_selection_item, i_index )
		{
			if ( i_selection_item == i_item )
			{
				delete this.selection[i_index];

				item_was_deleted = true;
			}
		}, this );

		if ( !item_was_deleted )
			this.selection.push(i_item);
		

	},

	_addItemToSelection: function ( i_item )
	{
	
		var already_in_selection = dojo.some( this.selection, function ( i_selection_item )
		{
			return (i_selection_item == i_item);
		});

		if ( !already_in_selection )
		{
			this.selection.push(i_item);
		}

	},

	_removeItemFromSelection: function ( i_item )
	{
	
		this.selection.forEach( function ( i_selection_item, i_index )
		{
			if ( i_selection_item == i_item )
				delete this.selection[i_index];
		}, this );
		

	},

/******************************************************************************/
/** Node selection manipulation ***********************************************/

	_toggleSelectedNode: function ( i_node )
	{
		//dojo.toggleClass(i_node, 'selected');

		if ( dojo.hasClass(i_node, 'selected') )
			this._unselectNode(i_node);
		else
			this._selectNode(i_node);
	},

	_selectNode: function ( i_node )
	{
		dojo.addClass(i_node, 'selected');

		dojo.query('.dijitCheckBox', i_node).forEach( function ( i_cb_node )
		{
			dijit.byNode(i_cb_node).set('checked', true);
		});
	},

	_unselectNode: function ( i_node )
	{
		dojo.removeClass(i_node, 'selected');

		dojo.query('.dijitCheckBox', i_node).forEach( function ( i_cb_node )
		{
			dijit.byNode(i_cb_node).set('checked', false);
		});
	},

/******************************************************************************/

	_createSearchBox: function ()
	{
		this.w_search_box = new pwl.widget.form.TextBox({ignore_form_events: true}, dojo.create('span', null, this.n_search));

		var func = function ()
		{
			if ( this._search_timer )
				clearTimeout(this._search_timer);

			this._search_timer = setTimeout(dojo.hitch(this, 'search'), 500);
		};

		this.focusNode = this.w_search_box.domNode;

		dojo.connect(this.w_search_box, 'onKeyUp', this, func);
		dojo.connect(this.w_search_box, 'onErase', this, func);
	},

	_getTargetListItem: function ( i_original_target )
	{
		// cascade upwards until li is found

		var node = i_original_target;

		while ( node.nodeName != 'LI' )
			node = node.parentNode;

		return node;
	},

	_destroyCheckboxes: function ()
	{
		this._checkboxes.forEach( function ( i_checkbox )
		{
			i_checkbox.destroy();
			delete i_checkbox; 
		});

		this._checkboxes = [];
	}
});