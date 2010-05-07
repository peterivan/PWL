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
		this._positionStackController();

		this.inherited(arguments);
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
		var children = this.getChildren();

		dojo.forEach (children, function ( c )
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
		var children = this.getChildren();

		dojo.forEach (children, function ( c )
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

	_positionStackController : function ()
	{
		var sc = dijit.byId(this.id + '_StackController');

		var its_pos = dojo.position(this.domNode);
		var sc_pos = dojo.position(sc.domNode);

		dojo.style(sc.domNode, 'height', its_pos.h + 'px');

		dojo.style(this.containerNode, 'left', sc_pos.w + 'px');
	}

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