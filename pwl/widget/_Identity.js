dojo.provide('pwl.widget._Identity');

/******************************************************************************/
/******************************************************************************/

/******************************************************************************/

dojo.declare(
	'pwl.widget._Identity',
	null,
{
	store: '',
	identity: '',

	event_manager: '',

	delete_message: 'Naozaj vymazať?',

/******************************************************************************/
/** public **/
/******************************************************************************/

	saveValues: function ()
	{
	},

	save: function ()
	{
	},

	delete: function ( i_immediately )
	{
		var immediately = i_immediately || false;

		if ( this.store && this.identity )
		{
			var e = new academy.widget.eventBar.event.YesNo(
			{
				message: this.delete_message
			});

			this.event_manager.registerEvent(e);

			e.fire().then( function ()
			{
				this.store.deleteItem(this.identity);

				if ( immediately )
					this.store.save();
			});
		}
	},

	reset: function ()
	{
	}

/******************************************************************************/
/** protected **/
/******************************************************************************/

});