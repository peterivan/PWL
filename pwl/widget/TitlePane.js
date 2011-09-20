dojo.provide('pwl.widget.TitlePane');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit.TitlePane');

dojo.require('pwl.widget.titlePane.TitleWidget');

/******************************************************************************/

dojo.declare(
	'pwl.widget.TitlePane',
	[dijit.TitlePane],
{
	templateString: dojo.cache('pwl.widget', 'templates/TitlePane.html'),
	widgetsInTemplate: true,

	title: '',
	title_is_editable: '',

	title_widget: 'pwl.widget.titlePane.TitleWidget',
	
	w_title_widget: null,
	
	n_title_widget: null,

	_on_show_counter: 0,
	_on_hide_counter: 0,

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
		
		this._connectAnimation();
	},

	//startup: 

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

	onTitleChange: function ( i_value ) {},
	
	onOpen: function () {},
	onClose: function () {},
	
/******************************************************************************/
/** protected **/
/******************************************************************************/

	_connectAnimation: function ()
	{
		dojo.connect(this._wipeIn, 'onEnd', this, 'onOpen');
		dojo.connect(this._wipeOut, 'onEnd', this, 'onClose');
	},

	_createTitleWidget: function ()
	{
		var obj = dojo.getObject(this.title_widget);
		
		this.w_title_widget = new obj(
		{
			title: this.title,
			title_is_editable: this.title_is_editable
		});
		
		dojo.connect(this.w_title_widget, 'onTitleChange', this, 'onTitleChange');
		
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