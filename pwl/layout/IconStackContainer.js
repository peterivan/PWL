dojo.provide('pwl.layout.IconStackContainer');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.layout.StackContainer');
dojo.require('pwl.layout.IconStackController');


/******************************************************************************/

dojo.declare(
	'pwl.layout.IconStackContainer',
	[pwl.layout.StackContainer, dijit._Templated],
{
	baseClass: 'pwlLayoutIconStackContainer',

	templateString: dojo.cache('pwl.layout', 'templates/IconStackContainer.html'),
	widgetsInTemplate: true,

	w_controller: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

		var box = this._getContainerBox();

		dojo.style(this.containerNode, 'width', box.w + 'px');

		var b_container = dojo.contentBox(this.containerNode);

		this.selectedChildWidget.resize(b_container);
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_transition: function ( i_new_widget, i_old_widget)
	{
		if ( i_old_widget )
			this._hideChild(i_old_widget);

		this._showChild(i_new_widget);

		if ( i_new_widget.resize )
		{
			if ( this.doLayout )
				i_new_widget.resize(this._getContainerBox());
			else
				i_new_widget.resize();
		}
	},

	_getContainerBox: function ()
	{
		var b_this = dojo.contentBox(this.domNode);
		var b_controller = dojo.marginBox(this.w_controller.domNode);

		var width = b_this.w - b_controller.w - 10; // 10 = buffer

		return {w: width, h: b_this.h};
	}
});