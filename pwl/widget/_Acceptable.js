dojo.provide('pwl.widget._Acceptable');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');

dojo.require('dojo.fx');

dojo.require('pwl.widget.Accept');

/******************************************************************************/

dojo.declare(
	'pwl.widget._Acceptable',
	[dijit._Widget],
{
	n_accept: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		dojo.addClass(this.domNode, 'pwlAcceptable');
	},

	startup: function()
	{
		this.inherited(arguments);
		
		dojo.style(this.n_accept,"display","none");
	},
/******************************************************************************/

	isAcceptVisible: function ()
	{
		if ( this.n_accept )
			return dojo.contentBox(this.n_accept).h > 0;

		return false;
	},

	showAccept: function ()
	{
		if ( this.n_accept && !this.isAcceptVisible() )
		{
			
			dojo.fx.wipeIn(
			{
				node: this.n_accept
			}).play()
		}
	},

	hideAccept: function ()
	{
		if ( this.n_accept && this.isAcceptVisible() )
		{
			
			dojo.fx.wipeOut(
			{
				node: this.n_accept
			}).play()
		}
	},
});