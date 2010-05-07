dojo.provide('pwl.layout.IconTabContainer');

/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.StackContainer');

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.layout.IconTabContainer',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlLayoutIconTabContainer',

	templateString: dojo.cache('pwl.layout', 'templates/IconTabContainer.html'),
	widgetsInTemplate: true,

	border_container: null,
	stack_controller: null,
	stack_container: null,

	icon_controller_position: 'leading',
	gutters: true,

	_bc_initial_size_set: false,
	_bc_width: null,
	_bc_height: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

	/**************************************************************************/
	/** startup ***************************************************************/

	postCreate : function ()
	{
		this.inherited(arguments);

		this.border_container = dijit.byId(this.id + '_BorderContainer');
		this.stack_container = dijit.byId(this.id + '_StackContainer');
		this.stack_controller = dijit.byId(this.id + '_StackController');
	},

	addChild : function ( child )
	{
		this.inherited(arguments);

		this.stack_container.addChild(child);
	},

	startup : function ()
	{
		if ( this._started )
			return;

		this.border_container.startup();
		this.stack_container.startup();

		this.inherited(arguments);
	},

	layout : function ()
	{
		this.inherited(arguments);
	},

	resize : function ()
	{
		if ( !this._bc_initial_size_set )
		{
			this._bc_initial_size_set = true;
			this.border_container.resize({w: this._bc_width, h: this._bc_height});
		}
		else
			this.border_container.resize();

		this.stack_container.resize();

		this.inherited(arguments);
	},

	/**************************************************************************/

	disableTab : function ( tab )
	{
		var tab_id = tab.attr('id');
		var children = this.stack_container.getChildren();

		dojo.forEach (children, function ( child )
		{
			if ( child.attr('id') === tab_id )
			{
				if ( dojo.isFunction(child.disable) )
					child.disable();

				dojo.addClass(child.controlButton.domNode, this.baseClass + 'Disabled dijitDisabled');
				child.controlButton.attr('disabled', true);
			}
		}, this);


	},

	enableTab : function ( tab )
	{
		var tab_id = tab.attr('id');
		var children = this.stack_container.getChildren();

		dojo.forEach (children, function ( child )
		{
			if ( child.attr('id') === tab_id )
			{
				if ( dojo.isFunction(child.disable) )
					child.enable();

				dojo.removeClass(child.controlButton.domNode, this.baseClass + 'Disabled dijitDisabled');
				child.controlButton.attr('disabled', false);
			}
		}, this);
	}

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