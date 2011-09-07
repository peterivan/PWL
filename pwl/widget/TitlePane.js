dojo.provide('pwl.widget.TitlePane');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit.TitlePane');

/******************************************************************************/

dojo.declare(
	'pwl.widget.TitlePane',
	[dijit.TitlePane],
{
	templateString: dojo.cache('pwl.widget', 'templates/TitlePane.html'),
	widgetsInTemplate: true,

	title: '',

	title_widget: 'pwl.widget.titlePane._TitleWidget',
	
	w_title_widget: null,
	
	n_title_widget: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		if ( this.title_widget )
			this._createTitleWidget().placeAt(this.n_title_widget);
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		
		if ( this.w_title_widget && dojo.isFunction(this.w_title_widget.resize) )
			this.w_title_widget.resize();
	},

/******************************************************************************/
/** Events ********************************************************************/

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_createTitleWidget: function ()
	{
		var obj = dojo.getObject(this.title_widget);
		
		this.w_title_widget = new obj({title: this.title});
		
		return this.w_title_widget;
	},
	
/******************************************************************************/
/** Attr handlers *************************************************************/

	_setTitleAttr: function ( i_title )
	{
		if ( this.w_title_widget )
			this.w_title_widget.set('title', i_title);
	}
});

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.widget.titlePane._TitleWidget',
	[dijit.layout.ContentPane],
{
/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setTitleAttr: function ( i_title )
	{
		this.set('content', i_title);
	}
});