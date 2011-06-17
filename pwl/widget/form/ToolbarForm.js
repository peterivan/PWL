dojo.provide('pwl.widget.form.ToolbarForm');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.form.Form');

dojo.require('dijit.Toolbar');

dojo.require('pwl.widget._Acceptable');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.ToolbarForm',
	[dijit.form.Form, pwl.widget._Acceptable],
{
	baseClass: 'pwlWidgetFormToolbarForm',

	templateString: dojo.cache('pwl.widget.form', 'templates/ToolbarForm.html'),
	widgetsInTemplate:true,

	toolbar_position: 'top',

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
			if ( i_child.declaredClass && i_child.declaredClass == 'dijit.Toolbar' )
			{
				i_child.placeAt(this.n_toolbar);
			}
		}, this);

		this.set('toolbar_position', this.toolbar_position);

		this._connect();
	},

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
		this.getChildren().forEach( function ( i_child )
		{
			if ( i_child.declaredClass.match(/form/i) )
			{
				if ( i_child.declaredClass.match(/textbox/i) )
					dojo.connect(i_child, 'onKeyUp', this, 'showAccept');
				else
					dojo.connect(i_child, 'onChange', this, 'showAccept');
			}
		}, this);

		dojo.connect(this, 'onValidStateChange', this, function ( i_valid )
		{
			if ( i_valid )
				this.showAccept();
			else
				this.hideAccept();
		});

		dojo.connect(this, 'onSubmit', this, 'hideAccept');
		dojo.connect(this, 'onReset', this, 'hideAccept');

		dojo.connect(this.w_accept, 'onAccept', this, 'submit');
		dojo.connect(this.w_accept, 'onCancel', this, 'reset');
	}
});