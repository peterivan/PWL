dojo.provide('pwl.widget.wizard.Intro');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dijit.layout.ContentPane');

dojo.require('dijit.form.Button');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.Intro',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.wizard', 'templates/Intro.html'),
	widgetsInTemplate: true,
	
	legend: 'Úvod',
	
	w_wizard: null,
	w_content: null,
	w_start: null,
	
	n_button: null,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	startup: function ()
	{
		this.inherited(arguments);
		
		dojo.connect(this.w_start, 'onClick', this.w_wizard, 'next');
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		
		var b_parent = dojo.contentBox(this.domNode.parentNode);
		var b_button = dojo.marginBox(this.n_button);
		
		var box = 
		{
			h: b_parent.h - b_button.h - 5
		};
		
		this.w_content.resize(box);
	},

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