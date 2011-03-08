dojo.provide('pwl.Toolbar');

/******************************************************************************/

dojo.require('dijit.Toolbar');
dojo.require('dijit.form.Button');
dojo.require('dijit.ToolbarSeparator');

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.Toolbar',
	[dijit.Toolbar],
{
	definition : {},

/******************************************************************************/
/** public **/
/******************************************************************************/

	/**************************************************************************/
	/** startup ***************************************************************/

	postCreate : function()
	{
		this.inherited(arguments);

		var groups = this.definition.length;
		var i = 0;
		var separator = false;

		// prechadanie skupin
		dojo.forEach(this.definition, function(group)
		{
			i++;
			separator = false;

			if (groups > i)
			{
				separator = true;
			}

			// prechadzanie tlacidiel v skupine
			dojo.forEach(group, function(button)
			{
				var driver = button.driver || dijit.form.Button;

				delete button.driver;

				var button_params = {
				}

				var button_body = new driver(
				{
					label: button.label,
					showLabel: false,

					id: button.id ? this.id + '_' + button.id : null
				});

				this.addChild(button_body);

			}, this);

			if ( separator )
			{
				var separator = new dijit.ToolbarSeparator();
				this.addChild(separator);
			}
		}, this);
	},


	disableActiveButtons : function(disable)
	{

	},

	disableAllButtons : function (disable)
	{

	},

	getButton : function (id)
	{

	},

});

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.provide('pwl.toolbar.PreddefinedButtons');

(function ()
{
	var b = pwl.toolbar.PreddefinedButtons;

	b.Save = {
		label: 'Uložiť',
		iconClass: 'save'
	}
}) ();