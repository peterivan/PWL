dojo.provide('pwl.widget.titlePane.TitleWidget');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.Title');

/******************************************************************************/

dojo.declare(
	'pwl.widget.titlePane.TitleWidget',
	[dijit._Widget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.titlePane', 'templates/TitleWidget.html'),
	widgetsInTemplate: true,

	title_is_editable: '',

	w_title: null,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
		
		dojo.connect(this.w_title, 'onChange', this, 'onTitleChange');
	},

/******************************************************************************/
/** Events ********************************************************************/

	onTitleChange: function ( i_value ) {},

/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setTitleAttr: function( i_title )
	{
		this.w_title.set('title', i_title);
	}
});