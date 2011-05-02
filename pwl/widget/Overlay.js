dojo.provide('pwl.widget.Overlay');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.Overlay',
	[dijit._Widget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget', 'templates/Overlay.html'),

	baseClass: 'pwlWidgetOverlay',

	parent_node: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		if ( !this.parent_node )
			throw('Overlay parent node is undefined.');

		if ( dojo.isString(this.parent_node) )
			this.parent_node = dojo.byId(this.parent_node);

		if ( this.iconClass && this.iconNode )
			dojo.addClass(this.iconNode, this.iconClass);

		dojo.style(this.domNode, 'display', 'none');

		dojo.place(this.domNode, dojo.body());
	},

	isVisible: function ()
	{
		return (dojo.style(this.domNode, 'display') == 'block');
	},

	show: function ()
	{
		if ( !this.isVisible() )
		{
			var parent_position = dojo.position(this.parent_node);

			dojo.style(this.domNode,
			{
				'position': 'absolute',
				'display': 'block',
				'left': parent_position.x + 'px',
				'top': parent_position.y + 'px',
				'width': parent_position.w + 'px',
				'height': parent_position.h + 'px',
				'backgroundColor': 'White',
				'lineHeight': parent_position.h + 'px',
				'opacity': 1,
				'zIndex': 3
			});

			this.domNode.innerHTML = '<em>' + this.message + '</em>';
		}

		this.onShow();
	},

	hide: function ()
	{
		dojo.style(this.domNode, 'display', 'none');

		this.onHide();
	},

/******************************************************************************/
/** Events ********************************************************************/

	onShow: function () {},
	onHide: function () {}

/******************************************************************************/
/** protected **/
/******************************************************************************/

});