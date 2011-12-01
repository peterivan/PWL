dojo.provide('pwl.widget.form.TwoLevelCheckList');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dijit.layout.TabContainer');
dojo.require('dijit.layout.ContentPane');


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
	

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/


	postCreate: function ()
	{
		this.inherited(arguments);

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
		console.debug('dddd2');
		this.store.fetch({
			scope: this,
			onComplete: function ( i_data )
			{
				console.debug('dddd3',i_data);
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
			var tab = new dijit.layout.ContentPane({'title':data_tab.title});
			this.w_tab_container.addChild(tab);
			
		},this);
		this.w_tab_container.resize();
	}

	
});