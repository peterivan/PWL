dojo.provide('pwl.widget.form.TextBox');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.form.TextBox');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.TextBox',
	[dijit.form.TextBox],
{
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
		dojo.addClass(this.domNode,"pwlWidgetFormTextBox");

		var inputContainer = dojo.query(".dijitInputContainer",this.domNode)[0];

		var closeBox = dojo.create("div",{"class":"closeBox"},inputContainer);
		dojo.connect(closeBox,"onclick",this,"erase");
	},

	startup : function ()
	{
		this.inherited(arguments);

	},

/******************************************************************************/

	erase: function()
	{
		this.set("value","");
		this.onErase();
	},

/******************************************************************************/
/** Events ********************************************************************/

	onErase: function()
	{

	}

});