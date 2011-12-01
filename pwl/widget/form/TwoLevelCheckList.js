dojo.provide('pwl.widget.form.TwoLevelCheckList');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dijit.layout.TabContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('pwl.widget.form.CheckList');
dojo.require('dojo.data.ItemFileWriteStore');


/******************************************************************************/

dojo.declare(
	'pwl.widget.form.TwoLevelCheckList',
	[dijit.layout._LayoutWidget, dijit._Templated,],
{
	baseClass: 'pwlWidgetFormCheckList',

	templateString: dojo.cache('pwl.widget.form', 'templates/TwoLevelCheckList.html'),
	widgetsInTemplate : true,
	
	autolayout: true,
	w_tab_container: null,
	store: null,
	data: null,
	label_store_id_attribute: 'id',
	value_store_id_attribute: 'id',
	

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/


	postCreate: function ()
	{
		this.inherited(arguments);

	},
	
	save: function()
	{
		this._save();
	},


/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

		if ( this.autolayout )
		{
			var box = dojo.contentBox(this.domNode.parentNode);
		
			var w = box.w-10;
			var h = box.h;
			
			this.w_tab_container.resize({w:w,h:h});
		}
	},

/******************************************************************************/

	
/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Attr handlers *************************************************************/


	_setStoreAttr: function ( i_store )
	{
		if (i_store)
		{
			this.store = i_store;
			this._loadData();
			
		}
			
	},

/******************************************************************************/

	
/******************************************************************************/
/**  **************************************************************/

	_loadData: function ()
	{
		this.store.fetch({
			scope: this,
			onComplete: function ( i_data )
			{
				this._removeAllTabs();
				this.data = i_data;
				this._renderTabs()
			}
		})
	},
	
	_removeAllTabs: function()
	{
		this.w_tab_container.getChildren().forEach(function(child)
		{
			this.w_tab_container.removeChild(child);
			child.destroyRecursive();
		},this);
	},
	
	_renderTabs: function()
	{
		
		this.data.forEach(function(data_tab)
		{
			var child = null;			
			
			var store_label_data = [];
			var store_value_data = [];
			
			data_tab.data.forEach(function(i_value,i_index)
			{
				if(typeof i_index == 'string')
				{
					var name = i_index.substr(0,2);
					if(name != '__')
					{
						var tmp = {};
						for (var i in i_value) 
						{
							if (typeof i == 'string')
							{
								var name = i.substr(0,2);
								if(name != '__')
								{
									tmp[i] = i_value[i];
								}
							}
							else
								tmp[i] = i_value[i];
							
						}
						store_label_data.push(tmp);
					}
				}
				else
				{
					var tmp = {};
					for (var i in i_value) 
					{
						if (typeof i == 'string')
						{
							var name = i.substr(0,2);
							if(name != '__')
							{
								tmp[i] = i_value[i];
							}
						}
						else
							tmp[i] = i_value[i];

					}
					store_label_data.push(tmp);
				}
				
			},this);
			
			data_tab.selection.forEach(function(i_value,i_index)
			{
				if(typeof i_index == 'string')
				{

					var name = i_index.substr(0,2);
					if(name != '__')
					{
						var tmp = {};
						tmp.organization = i_value.organization;
						tmp.title = i_value.title;
						store_value_data.push(tmp);
					}
						

				}
				else
				{
					var tmp = {};
					tmp.organization = i_value.organization;
					tmp.title = i_value.title;
					store_value_data.push(tmp);
				}
					
			},this);
			
			
			var store_label = new dojo.data.ItemFileWriteStore(
			{
				data:
				{
					identifier: this.label_store_id_attribute,
					items: store_label_data
				}
			});

			var store_value = new dojo.data.ItemFileWriteStore(
			{
				data:
				{
					identifier: this.value_store_id_attribute,
					items: store_value_data
				}
			});

			
			child = new pwl.widget.form.CheckList({
				id: this.id+'CheckList'+data_tab.id,
				label_store_id_attribute: this.label_store_id_attribute,
				value_store_id_attribute: this.value_store_id_attribute,
				label_store: store_label,
				value_store: store_value
			});
			
			
			var tab = new dijit.layout.ContentPane({'title':data_tab.title,'content': child});
			
			this.w_tab_container.addChild(tab);
			child.startup();
			child.reload();
			
			
		},this);
		this.w_tab_container.resize();
	},
	
	_save: function()
	{
		this.data.forEach(function(data_tab)
		{
			var data = dijit.byId(this.id+'CheckList'+data_tab.id).get('value');
			var new_selection = [];
			data.forEach(function(item)
			{
				var tmp = {};
				tmp[this.value_store_id_attribute] = item[this.value_store_id_attribute];
				new_selection.push(tmp);
			},this);
			
			this.store.setValue(data_tab,'selection',new_selection);
			
		},this);
		
		this.store.save();
	}

	
});