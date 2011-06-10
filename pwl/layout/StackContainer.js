dojo.provide('pwl.layout.StackContainer');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout.StackContainer');

/******************************************************************************/

dojo.declare(
	'pwl.layout.StackContainer',
	[dijit.layout.StackContainer],
{
/******************************************************************************/
/** public **/
/******************************************************************************/

	selectChild: function ( i_page, i_animate )
	{
		if ( this.selectedChildWidget )
		{
			if ( dojo.isFunction(this.selectedChildWidget.canLeavePage) )
			{
				if ( !this.selectedChildWidget.canLeavePage() )
					return false;
			}
		}

		this.inherited(arguments);
	}

/******************************************************************************/
/** protected **/
/******************************************************************************/

});
