dojo.provide('pwl.layout.IconStackContainer');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.layout.StackContainer');
dojo.require('pwl.layout.IconStackController');


/******************************************************************************/

dojo.declare(
	'pwl.layout.IconStackContainer',
	[pwl.layout.StackContainer, dijit._Templated],
{
	baseClass: 'pwlLayoutIconStackContainer',

	templateString: dojo.cache('pwl.layout', 'templates/IconStackContainer.html'),
	widgetsInTemplate: true,

	doLayout: false,

	w_controller: null,

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

		var b_this = dojo.contentBox(this.domNode);
		var b_container = dojo.marginBox(this.w_container.domNode);

		var width = b_this.w - b_container.w - 10; // 10 = buffer

		dojo.style(this.containerNode, 'width', width + 'px');
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

});