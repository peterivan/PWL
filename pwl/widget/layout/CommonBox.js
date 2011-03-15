dojo.provide('pwl.widget.layout.CommonBox');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.CommonBox',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutCommonBox',

	templateString: dojo.cache('pwl.widget.layout', 'templates/CommonBox.html'),

	helpToken: '',

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		if ( this.helpToken ) // FIXME: dependncies on academy
		{
			dojo.style(this.helpNode, 'display', 'block');

			dojo.connect(this.helpNode, 'onclick', this, function()
			{
				var dialog = academy.Application.getHelpDialog();
				if(dijit.byId('_Help_Dialog'))
				{
					dijit.byId('_Help_Dialog').attr('uuid',this.helpToken);
				}
				dialog.show();
			});
		}
	},

	startup : function ()
	{
		this.inherited(arguments);
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize : function ()
	{
		this.inherited(arguments);

		var t_box = dojo.contentBox(this.domNode);
		var header_box = dojo.contentBox(this.n_header);

		var cn_height = t_box.h - header_box.h;

		dojo.marginBox(this.containerNode, {h: cn_height});
	}
});