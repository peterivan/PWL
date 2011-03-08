dojo.provide('pwl.layout.IconStackController');

/******************************************************************************/

dojo.require('dijit.layout.StackController');

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.layout.IconStackController',
	[dijit.layout.StackController],
{
	templateString: dojo.cache('pwl.layout', 'templates/IconStackController.html'),

	baseClass: 'pwlLayoutIconStackController',

	buttonWidget: 'pwl.layout._IconStackControllerButton',

/******************************************************************************/
/** public **/
/******************************************************************************/

	orientation : 'vertical',

	/**************************************************************************/
	/** startup ***************************************************************/

	postCreate : function ()
	{
		this.inherited(arguments);
	},

	/**************************************************************************/

	setDisabled : function ( i_child, i_disabled )
	{
		var child = null;

		if ( dojo.isObject(i_child) )
			child = i_child;
		else if ( dojo.isString(i_child) )
			child = dijit.byId(i_child);
		else
			throw 'Child must be object or string.';

		/**********************************************************************/

		var tab_id = child.attr('id');

		dojo.forEach (this.getChildren(), function ( c )
		{
			if ( c.attr('id') === tab_id )
			{
				c.attr('disabled', i_disabled);
				c.controlButton.attr('disabled', i_disabled);
			}
		}, this);
	}

/******************************************************************************/
/** protected **/
/******************************************************************************/

});

/******************************************************************************/
/** IconStackControllerButton *************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.layout._IconStackControllerButton',
	[dijit.layout._StackButton],
{
	templateString: dojo.cache('pwl.layout', 'templates/IconStackControllerButton.html'),

	baseClass : 'pwlLayoutIconStackControllerButton',

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