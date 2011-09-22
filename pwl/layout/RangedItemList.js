dojo.provide('pwl.layout.RangedItemList');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');

/******************************************************************************/

dojo.declare(
	'pwl.layout.RangedItemList',
	[dijit.layout._LayoutWidget],
{

	store: '',
	query: '',
	items_per_page: 20,

	item_widget: '',

	_total_item_count: 0,
	_loaded_items_count: 0,
	_current_offset: 0,

	_fetch_locked: false,

	n_not_found: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

		dojo.connect(this.containerNode, 'onscroll', this, '_loadNextPage');


	},

/******************************************************************************/

	createItem: function ( i_item, i_store )
	{
		if ( this.item_widget )
		{
			var object = dojo.getObject(this.item_widget);
			var item = new object(
			{
				store: i_store, 
				identity: i_item
			});

			return item;
		}
	},

/******************************************************************************/
/** Events ********************************************************************/

	onAddChild: function()
	{

	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_loadNextPage: function ()
	{
		var load_next_page = ((this._total_item_count + 1) > this._loaded_items_count);

		var b_this = dojo.contentBox(this.containerNode);
		var scroll_height = this.containerNode.scrollHeight;
		var scroll_top = this.containerNode.scrollTop;

		var scrollbar_is_shown = scroll_height > b_this.h;

		if ( !scrollbar_is_shown && load_next_page )
			this._loadData();
		else if ( load_next_page )
		{
			var percentage = (scroll_top/(scroll_height - b_this.h)) * 100;

			if ( percentage > 75 && !this._fetch_locked )
			{
				this._fetch_locked = true;

				this._loadData();
			}
		}
	},


	_loadData: function ()
	{
		if(this.n_not_found)
			dojo.destroy( this.n_not_found );

		var n_loading = dojo.create("div",{'class':'loading',innerHTML:'načítavam...'},this.domNode);

		this.store.fetch(
		{
			scope: this,
			query: this.query,
			start: this._current_offset,
			count: this.items_per_page,

			onComplete: function ( i_data, i_args, i_io )
			{
				dojo.destroy( n_loading );

				var content_range = i_io.xhr.getResponseHeader('Content-Range');

				var split = content_range.split(/items=([0-9]+)-([0-9]+)\/([0-9]+)/);

				var bottom = parseInt(split[1]);
				var top = parseInt(split[2]);
				var total = parseInt(split[3]);

				this._total_item_count = total;
				this._loaded_items_count += top - bottom + 1;
				this._current_offset = this._current_offset + this.items_per_page;

				i_data.forEach( function ( i_item, i_index )
				{
/*					if(i_index <= top)
					{*/
						var child = this.createItem( i_item, this.store );

						if ( child )
							this.addChild( child );

						this.onAddChild( child )
//					}
				}, this);

				this._loadNextPage();

				this._fetch_locked = false;

				if(i_data.length == 0)
				{
					this.n_not_found = dojo.create("div",{'class':'not_found',innerHTML:'nenašiel žiadne záznamy'},this.domNode);
				}
			}
		});
	},

	_clearResult: function()
	{
		dojo.forEach( this.getChildren(),function( i_child )
		{
			this.removeChild(i_child);
			dojo.destroy(i_child);
		},this );

		dojo.empty(this.containerNode);

		this._current_offset = 0;
		this._total_item_count = 0;
		this._loaded_items_count = 0;
	},

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setStoreAttr: function ( i_store )
	{
		this.store = this._fixStore(i_store);

		dojo.empty(this.containerNode);

		this._loadData();
	},

	_setQueryAttr: function ( i_query )
	{
		this.query = i_query;
	},

	_fixStore: function ( i_store )
	{
		console.warn('ProxiaAcademy: JsonRestStore::fetch must be fixed so it returns ioArgs.');

		var f = function(args)
		{
			args = args || {};

			if("syncMode" in args ? args.syncMode : this.syncMode){
				dojox.rpc._sync = true;
			}
			var self = this;

			var scope = args.scope || self;
			var defResult = this.cachingFetch ? this.cachingFetch(args) : this._doQuery(args);
			defResult.request = args;
			defResult.addCallback(function(results){
				if(args.clientFetch){
					results = self.clientSideFetch({query:args.clientFetch,sort:args.sort,start:args.start,count:args.count},results);
				}
				var resultSet = self._processResults(results, defResult);
				results = args.results = resultSet.items;
				if(args.onBegin){
					args.onBegin.call(scope, resultSet.totalCount, args);
				}
				if(args.onItem){
					for(var i=0; i<results.length;i++){
						args.onItem.call(scope, results[i], args);
					}
				}
				if(args.onComplete){
					args.onComplete.call(scope, args.onItem ? null : results, args, defResult.ioArgs);
				}
				return results;
			});
			defResult.addErrback(args.onError && function(err){
				return args.onError.call(scope, err, args);
			});
			args.abort = function(){
				// abort the request
				defResult.cancel();
			};
			args.store = this;
			return args;
		};

		i_store.fetch = dojo.hitch(i_store, f);

		return i_store;
	}
});