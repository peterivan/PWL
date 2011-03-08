dojo.provide('pwl.widget.ItemListEditor');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.Accept');

/******************************************************************************/

dojo.declare(
	'pwl.widget.ItemListEditor',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetItemListEditor',

	templateString: dojo.cache('pwl.widget', 'templates/ItemListEditor.html'),
	widgetsInTemplate: false,

	accept_widget: '',

	item_view_widget: '',
	item_edit_widget: '',
	item_new_widget: '',


	store: '',
	query: '',

	value_attr: '',

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

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

		this.refresh();
	},

/******************************************************************************/

	refresh: function ()
	{
		if ( this.store && this.item_widget )
			this._loadData();
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

			onComplete: function ( i_data )
			{
				i_data.forEach( function ( i_item )
				{
					var widget = null;

					if ( dojo.isFunction(this.item_widget) )
						widget = new this.item_widget();
					else if ( typeof(this.item_widget) == 'string' )
						widget = new dojo.getObject(this.item_widget)({});

					if ( this.value_attr )
						widget.set('value', this.store.getValue(i_item, this.value_attr));

					if ( widget )
						this.addChild(widget);
				}, this);
			}
		});
	}
});