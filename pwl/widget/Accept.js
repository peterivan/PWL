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

	accept_label: '',
	cancel_label: '',

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postMixInProperties: function ()
	{
		this.inherited(arguments);

		this.accept_label = this.accept_label || 'Použiť';
		this.cancel_label = this.cancel_label || 'Zrušiť';
	},

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