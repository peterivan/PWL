dojo.provide('pwl.layout.IconTabContainer');

/******************************************************************************/

dojo.require('dijit._Templated');

dojo.require('dijit.layout.StackContainer');
dojo.require('dijit.layout.StackController');

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.layout.IconTabContainer',
	[dijit.layout.StackContainer, dijit._Templated],
{
	baseClass: 'pwlLayoutIconTabContainer',

	templateString: dojo.cache('pwl.layout', 'templates/IconTabContainer.html'),
	widgetsInTemplate: true,

	stack_controller: null,

	controller_position: 'leading',
	gutters: true,

/******************************************************************************/
/** public **/
/******************************************************************************/

	/**************************************************************************/
	/** startup ***************************************************************/

	postCreate : function ()
	{
		this.inherited(arguments);
	},

	/**************************************************************************/
	/** layout ****************************************************************/

	resize : function ()
	{
		this.inherited(arguments);

		var sc = dijit.byId(this.id + '_StackController');

		var its_pos = dojo.position(this.domNode);
		var sc_pos = dojo.position(sc.domNode);

		var container_w = (its_pos.w - sc_pos.w - 8) + 'px';

		dojo.style(this.containerNode, 'width', container_w);

		dojo.forEach (this.getChildren(), function ( c )
		{
			dojo.style(c.domNode, 'width', container_w);
		});
	},

	/**************************************************************************/

	disableChild : function ( i_child )
	{
		var child = null;

		if ( dojo.isObject(i_child) )
			child = i_child;
		else if ( dojo.isString(i_child) )
			child = dijit.byId(i_child);

		/**********************************************************************/

		var tab_id = child.attr('id');

		dojo.forEach (this.getChildren(), function ( c )
		{
			if ( c.attr('id') === tab_id )
			{
				if ( dojo.isFunction(c.disable) )
					c.disable();

				c.controlButton.attr('disabled', true);
			}
		}, this);


	},

	enableChild : function ( i_child )
	{
		var child = null;

		if ( dojo.isObject(i_child) )
			child = i_child;
		else if ( dojo.isString(i_child) )
			child = dijit.byId(i_child);

		/**********************************************************************/

		var tab_id = child.attr('id');

		dojo.forEach (this.getChildren(), function ( c )
		{
			if ( c.attr('id') === tab_id )
			{
				if ( dojo.isFunction(c.disable) )
					c.enable();

				c.controlButton.attr('disabled', false);
			}
		}, this);
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

});

/******************************************************************************/
/** IconTabContainerButton ****************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.layout._IconTabContainerButton',
	[dijit.layout._StackButton],
{
	templateString: dojo.cache('pwl.layout', 'templates/IconTabContainerButton.html'),

	baseClass : 'pwlLayoutIconTabContainerButton',

/******************************************************************************/
/** public **/
/******************************************************************************/

	/**************************************************************************/
	/** events ****************************************************************/

	onClick : function ()
	{
		if ( this.attr('disabled') )
			return;

		this.inherited(arguments);
	}

/******************************************************************************/
/** protected **/
/******************************************************************************/
});