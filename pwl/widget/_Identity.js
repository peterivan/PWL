dojo.provide('pwl.widget._Identity');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');

dojo.require('pwl.widget.Overlay');

/******************************************************************************/

dojo.declare(
	'pwl.widget._Identity',
	[dijit._Widget],
{
	store: '',
	identity: '',

	event_manager: '',

	is_changed: false,

	identity_load_topic: null,
	identity_load_error_topic: null,
	save_topic: null,
	change_topic: null,
	reset_topic: null,

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

		var chanel = '/' + this.declaredClass.replace('.', '/') + '/';

		if ( !this.identity_load_topic )
			this.identity_load_topic = chanel + this.id + '/identityLoaded';
		if ( !this.identity_load_error_topic )
			this.identity_load_error_topic = chanel + this.id + '/identityLoadError';
		if ( !this.save_topic )
			this.save_topic = chanel + this.id + '/saved';
		if ( !this.change_topic )
			this.change_topic = chanel + this.id + '/changed';
		if ( !this.reset_topic )
			this.reset_topic = chanel + this.id + '/reseted';
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
		this._setDataFromIdentity(this.identity);

		this.onReset();
	},

/******************************************************************************/
/** Events ********************************************************************/

	onIdentityLoad: function ( i_identity )
	{
		this._setDataFromIdentity(i_identity);

		if ( this.identity_load_topic )
		{
			console.debug('published topic: ' + this.identity_load_topic, i_identity);

			dojo.publish(this.identity_load_topic, [i_identity]);
		}
	},

	onIdentityLoadError: function ( i_error )
	{
		if ( this.identity_load_error_topic )
		{
			console.debug('published topic: ' + this.identity_load_error_topic, i_error);

			dojo.publish(this.identity_load_error_topic, [i_error]);
		}
	},

	onChange: function ()
	{
		this.is_changed = true;

		if ( this.change_topic )
		{
			console.debug('published topic: ' + this.change_topic);

			dojo.publish(this.change_topic, []);
		}
	},

	onSave: function ( i_identity )
	{
		if ( this.save_topic )
		{
			console.debug('published topic: ' + this.save_topic. i_identity);

			dojo.publish(this.save_topic, [i_identity]);
		}
	},

	/*onRemove: function ()
	{
	},*/

	onReset: function ()
	{
		if ( this.reset_topic )
		{
			console.debug('published topic: ' + this.reset_topic);

			dojo.publish(this.reset_topic, []);
		}
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Data loading **************************************************************/

	_loadIdentity: function ( i_identity )
	{
		if ( this.store )
		{
			this.store.fetchItemByIdentity(
			{
				scope: this,
				identity: i_identity,

				onItem: function ( i_item )
				{
					this.set('identity', i_item);
				},

				onError: function ( i_error )
				{
					this.onIdentityLoadError(i_error);
				}
			});
		}
	},

	_setDataFromIdentity: function ( i_identity )
	{
		this.is_changed = false;
	},

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setIdentityAttr: function ( i_identity )
	{
		if ( dojo.isObject(i_identity) )
		{
			if ( this.store.isItem(i_identity) )
			{
				this.identity = i_identity;

				this.onIdentityLoad(i_identity);
			}
		}
		else
		{
			this._loadIdentity(i_identity);
		}
	}
});