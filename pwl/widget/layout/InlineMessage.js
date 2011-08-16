dojo.provide('pwl.widget.layout.InlineMessage');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.InlineMessage',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutInlineMessage',

	templateString: dojo.cache('pwl.widget.layout', 'templates/InlineMessage.html'),
			 
	widgetsInTemplate : true,
	helpToken: '',
	label_button_edit: "Upraviť",

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		//this.help_store = academy.StoreManager.getStore({ target:djConfig.serviceRoot+'/help',cacheByDefault: false});

// 		dojo.connect(this.buttonEdit, 'onClick', this, '_toogleButton');
// 
// 		dojo.subscribe("saved_help", dojo.hitch(this,function(message){
// 			this.wView.setContent(message.text)
// 		}));
		
	},

	_toogleButton: function()
	{
		console.debug("zmena helpu");
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
	},

	
	loadText: function()
	{

	},
});