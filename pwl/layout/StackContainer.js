dojo.provide('pwl.layout.StackContainer');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout.StackContainer');

/******************************************************************************/

dojo.declare(
	'pwl.layout.StackContainer',
	[dijit.layout.StackContainer],
	
	
{
	
	current_index: null,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

	selectChild: function ( i_page, i_animate )
	{

		dojo.forEach(this.getChildren(),function( pane, index)
		{
			
			if( i_page == pane)
			{
				this.current_index = index;
			}
			
		},this)

		if ( this.selectedChildWidget )
		{
			if ( dojo.isFunction(this.selectedChildWidget.canLeavePage) )
			{
				if ( !this.selectedChildWidget.canLeavePage() )
				{

					if( this.selectedChildWidget != i_page )
					{
						var event_manager = dijit.byId("EventBar").get("event_manager");
						var e = new academy.widget.eventBar.event.Notification({message: "Na stránke ste vykonali zmeny, uložte ich alebo zrušte, potom možete opustiť stránku."});
						event_manager.registerEvent(e);
						e.fire();
					}
					
					return false;
				}
			}
		}

		this.inherited(arguments);
	}

/******************************************************************************/
/** protected **/
/******************************************************************************/

});
