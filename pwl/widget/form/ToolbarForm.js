dojo.provide('pwl.widget.form.ToolbarForm');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.widget.form.Form');

dojo.require('dijit.Toolbar');

dojo.require('pwl.widget._Acceptable');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.ToolbarForm',
	[pwl.widget.form.Form, pwl.widget._Acceptable],
{
	baseClass: 'pwlWidgetFormToolbarForm',

	templateString: dojo.cache('pwl.widget.form', 'templates/ToolbarForm.html'),
	widgetsInTemplate: true,

	disable_change_event: false,

	toolbar_position: 'top',

	accept_label: '',
	cancel_label: '',
        
	autolayout: false,
        
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	startup: function ()
	{
		this.inherited(arguments);

		this.getChildren().forEach( function ( i_child )
		{
			if ( i_child.isInstanceOf(dijit.Toolbar) )
			{
				i_child.getChildren().forEach( function ( i_button ) 
				{
					i_button.ignore_change_event = true;
				}, this);
				
				i_child.placeAt(this.n_toolbar);
			}
		}, this);

		this.set('toolbar_position', this.toolbar_position);

		this.connectChildren(true);
		this._connect();
	},


	resize: function ()
	{
		this.inherited(arguments);
                
		if( !this.autolayout )
		{
			var b_parent = dojo.contentBox(this.domNode.parentNode);

			dojo.contentBox(this.domNode, b_parent);                    
		}    

		var b_this = dojo.contentBox(this.domNode);

		var b_toolbar_box = dojo.marginBox(this.n_toolbar_box);

		var work_height = b_this.h - b_toolbar_box.h - 1;

 		dojo.style(this.containerNode,
 		{
 			height: work_height + 'px',
 			overflow: 'auto'
 		});
	},

/******************************************************************************/

	connectChildren: function ( i_connect_now )
	{
		// delay connection until toolbar is setup
		if ( i_connect_now ) 
			this.inherited(arguments);
	},

/******************************************************************************/
/** Events ********************************************************************/

	onSave: function ()
	{
		this.inherited(arguments);

		this.hideAccept();
	},

	onAccept: function () {},
	onCancel: function () {},

/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setToolbar_positionAttr: function ( i_position )
	{
		dojo.removeClass(this.n_toolbar_box, 'top');
		dojo.removeClass(this.n_toolbar_box, 'bottom');

		switch ( i_position )
		{
			case 'bottom':
				dojo.place(this.n_toolbar_box, this.containerNode, 'after');
				dojo.addClass(this.n_toolbar_box, 'bottom');
				break;

			default: // top
				dojo.place(this.n_toolbar_box, this.containerNode, 'before');
				dojo.addClass(this.n_toolbar_box, 'top');
		}
	},

/******************************************************************************/

	_connect: function ()
	{
		dojo.connect(this, 'onReset', this, 'hideAccept');

		dojo.connect(this.w_accept, 'onAccept', this, '_onAccept');

		dojo.connect(this.w_accept, 'onCancel', this, '_onCancel');
	},

/******************************************************************************/
/** System events *************************************************************/

	_onChange: function ()
	{
		if ( !this.disable_change_event )
		{
			this.showAccept();

			this.onChange();
		}
	},

	_onAccept: function ()
	{
		this.save();

		this.onAccept();
	},

	_onCancel: function ()
	{
		this.hideAccept();

		this.reset();

		this.onCancel();
	}
});