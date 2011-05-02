dojo.provide('pwl.widget._Identity');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.widget.Overlay');

/******************************************************************************/

dojo.declare(
	'pwl.widget._Identity',
	null,
{
	store: '',
	identity: '',

	event_manager: '',

	delete_message: 'Naozaj vymazať?',
	delete_success_message: 'Vymazané',

	_overlay: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);


	},

	destory: function ()
	{
		this.inherited(arguments);

		if ( this._overlay )
			this._overlay.destroy();
	},

/******************************************************************************/

	saveValues: function ()
	{
	},

	save: function ()
	{
	},

	remove: function ( i_immediately )
	{
		var immediately = i_immediately || false;

		if ( this.store && this.identity )
		{
			var e = new academy.widget.eventBar.event.YesNo(
			{
				message: this.delete_message
			});

			this.event_manager.registerEvent(e);

			e.fire().then( dojo.hitch(this, function ()
			{
				this.store.deleteItem(this.identity);

				if ( immediately )
					this.store.save(
					{
						scope: this,

						onComplete: function ()
						{
							var e = new academy.widget.eventBar.event.Notification(
							{
								message: this.delete_success_message
							});

							this.event_manager.registerEvent(e);

							e.fire();

							this.onRemove();
						}
					});
				else
					this.onRemove();
			}));
		}
	},

	reset: function ()
	{
	},

/******************************************************************************/
/** Events ********************************************************************/

	onSave: function ()
	{
	},

	/*onRemove: function ()
	{
	},*/

	onReset: function ()
	{
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

});