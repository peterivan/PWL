dojo.provide('pwl.widget.layout.InlineHelp');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.InlineHelp',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutInlineHelp',

	templateString: dojo.cache('pwl.widget.layout', 'templates/InlineHelp.html'),
			 
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

//  		this.help_store.fetchItemByIdentity
// 		({
// 				handleAs: 'json',
// 				identity:this.helpToken,
// 				scope:this,
// 				onItem: function ( data )
// 				{
// 
// 					this.item = data;
// 
// 					if(data.text)
// 					{
// 						this.containerNode.setContent(data.text); // nastavim text helpu na zobrazenie
// 					}else{
// 						this.containerNode.setContent("Žiadna pomoc nie je dostupná")
// 					}
// 
// 				}
// 		})
	},
});