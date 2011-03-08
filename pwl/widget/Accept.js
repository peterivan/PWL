dojo.provide('pwl.widget.Accept');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('dijit.form.Button');

/******************************************************************************/

dojo.declare(
	'pwl.widget.Accept',
	[dijit._Widget, dijit._Templated],
{
	baseClass: 'pwlWidgetAccept',

	templateString: dojo.cache('pwl.widget', 'templates/Accept.html'),
	widgetsInTemplate: true,

	accept_label: 'Použiť',
	cancel_label: 'Zrušiť',

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		dojo.connect(this.w_accept, 'onClick', this, 'onAccept');
		dojo.connect(this.n_cancel, 'onclick', this, 'onCancel');
	},

/******************************************************************************/
/** Events ********************************************************************/

	onAccept: function () {},
	onCancel: function () {}

/******************************************************************************/
/** protected **/
/******************************************************************************/


});