dojo.provide('pwl.widget.WidgetMatrix');

/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.widget.WidgetMatrix',
	[dijit._Widget, dijit._Templated],
{
	baseClass: 'pwlWidgetWidgetMatrix',

	templateString: dojo.cache('pwl.widget', 'templates/WidgetMatrix.html'),
	widgetsInTemplate: false,

	widget: '',

	x_store: '',
	has_x_data: false,

	y_store: '',
	has_y_data: false,

	cross_store: '',

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate : function()
	{
		this.inherited(arguments);

		this._render();
	},

/******************************************************************************/

	refresh: function ()
	{
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_render: function ()
	{
		if ( this.x_store && this.y_store )
		{
			this.x_store.fetch(
			{
				scope: this,

				onComplete: function ( i_data )
				{
					dojo.create('th', null, this.n_head_row); // empty cell

					i_data.forEach( function ( i_item )
					{
						var label = this.x_store.getValue(i_item, 'id');

						dojo.create('th', {innerHTML: label}, this.n_head_row);
					}, this);

				}
			});

			this.y_store.fetch(
			{
				scope: this,

				onComplete: function ( i_data )
				{
					i_data.forEach( function ( i_item )
					{
						var row = dojo.create('tr', null, this.n_body);

						var label = this.y_store.getValue(i_item, 'class');

						dojo.create('th', {innerHTML: label}, row);
					}, this);

				}
			});
		}
	}
});