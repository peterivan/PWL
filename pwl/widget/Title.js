dojo.provide('pwl.widget.Title');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.Tooltip');

/******************************************************************************/

dojo.declare(
	'pwl.widget.Title',
	[dijit._Widget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget', 'templates/Title.html'),
	
	title: '',
	original_title: null,
	
	delay: 250,
	
	use_tooltip: false,
	
	w_tootlip: null,
	
	n_container: null,
	n_title: null,
	n_gradient: null,
		
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
	},

	startup: function ()
	{
		this.inherited(arguments);
		
		if ( this.use_tooltip )
			this._setupTooltip();
	},

	destroy: function ()
	{
		this.inherited(arguments);
		
		if ( this.w_tooltip )
			this.w_tooltip.destroy();
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		
		if ( this.use_tooltip )
			this._setupTooltip();
	},

/******************************************************************************/
/** Events ********************************************************************/

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_setupTooltip: function ()
	{
		var b_this = dojo.contentBox(this.domNode);
		var b_title = dojo.marginBox(this.n_title);
		
		var show_tooltip = false;
		
		// 30px gradient, when text runs into gradient display tooltip
		if ( b_title.w > b_this.w - 30 )
			show_tooltip = true;
		
		if ( show_tooltip && !this.w_tooltip )
		{
			this.w_tootlip = new pwl.widget.Tooltip(
			{
				connectId: [this.n_title],
				label: this.original_title,
				position: ['above', 'below'],
				showDelay: this.delay
			});
		}
		else if ( !show_tooltip && this.w_tooltip )
		{
			this.w_tooltip.destroy();
			this.w_tootlip = null;
		}
	},

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setTitleAttr: function ( i_title )
	{
		this.title = i_title.replace(/\<br\>/g, '\n');
		this.original_title = i_title;
		
		this.n_title.innerHTML = this.title;
		
		if ( this._started && this.use_tooltip )
			this._setupTooltip();
	}
});