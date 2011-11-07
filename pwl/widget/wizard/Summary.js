dojo.provide('pwl.widget.wizard.Summary');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dijit.layout.ContentPane');

dojo.require('dijit.form.Button');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.Summary',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.wizard', 'templates/Summary.html'),
	widgetsInTemplate: true,
	
	legend: 'Zhrnutie',
	title: 'Zhrnutie',
	
	w_wizard: null,
	w_content: null,
	w_finish: null,
	
	n_button: null,
	

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/
	startup: function ()
	{
		this.inherited(arguments);
		
		dojo.connect(this.w_finish, 'onClick', this.w_wizard, 'finish');
		
		var _content = this.w_content.get('content');
		if( !_content )
			this.w_content.set('content', 'Ďakujeme za vyplnenie dotazníka. Dotazník sa ukončí až po stlačení tlačítka <b>Ukončiť dotazník</b>.');
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		
		var b_parent = dojo.contentBox(this.domNode.parentNode);
		var b_header = dojo.marginBox(this.n_header);
		var b_button = dojo.marginBox(this.n_button);
		
		var box = 
		{
			h: b_parent.h - b_header.h - b_button.h + 5
		};
		
		this.w_content.resize(box);
	},

/******************************************************************************/
/** Events ********************************************************************/

/******************************************************************************/
/** protected **/
/******************************************************************************/


/******************************************************************************/
/** Attr handlers *************************************************************/

	_setContentAttr: function ( i_content )
	{
		this.w_content.set('content', i_content);
	}
});