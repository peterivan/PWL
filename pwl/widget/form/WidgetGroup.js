dojo.provide('pwl.widget.form.WidgetGroup');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.form._FormMixin');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.WidgetGroup',
	[dijit.layout._LayoutWidget, dijit._Templated, pwl.widget.form._FormMixin],
{
	templateString: dojo.cache('pwl.widget.form', 'templates/WidgetGroup.html'),
	
	change_event_disabled: false,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	startup: function ()
	{
		this.inherited(arguments);

		if ( !this.containerNode )
			this.containerNode = this.domNode;

		this.getChildren().forEach( function ( i_child )
		{
			i_child.set('widget_group', this);
		}, this);
		
		this.connectChildren();
	},

/******************************************************************************/

	reset: function ()
	{
		this.change_event_disabled = true;

		this.inherited(arguments);

		this.onReset();

		setTimeout(dojo.hitch(this, function ()
		{
			this.change_event_disabled = false;
		}), 0);

	},

/******************************************************************************/
/** Events ********************************************************************/



/******************************************************************************/
/** protected **/
/******************************************************************************/

	

});