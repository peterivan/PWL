dojo.provide('pwl.widget.Title');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('dijit.InlineEditBox');

/******************************************************************************/

dojo.declare(
	'pwl.widget.Title',
	[dijit._Widget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget', 'templates/Title.html'),
	
	title: '',
	original_title: null,
	
	is_editable: '',
	
	delay: 250,
	
	use_tooltip: false,

	w_edit_box: null,
	
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
		
		if ( this.is_editable )
			this._setupEditBox();
	},

	startup: function ()
	{
		this.inherited(arguments);
		
	},

	destroy: function ()
	{
		this.inherited(arguments);
		
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		var c_box = dojo.marginBox(this.n_container);
        if( c_box.w > 0)
            dojo.style(this.n_title,"width",c_box.w + "px");
	},

/******************************************************************************/
/** Events ********************************************************************/

	onChange: function ( i_value ) {},

/******************************************************************************/
/** protected **/
/******************************************************************************/


	_setupEditBox: function ()
	{
		this.w_edit_box = new dijit.InlineEditBox({}, this.n_title);
        this.w_edit_box.set("editorParams",{ maxLength : 150 });

		dojo.connect(this.w_edit_box, 'onChange', this, 'onChange');
	},

/******************************************************************************/
/** Attr handlers *************************************************************/

	_setTitleAttr: function ( i_title )
	{
		if ( !i_title )
			i_title = '';
		
		this.title = i_title.replace(/\<br\>/g, '\n');
		this.original_title = i_title;

		if ( this.w_edit_box )
			this.w_edit_box.set('value', this.title);
		else
			this.n_title.innerHTML = this.title;

        dojo.attr(this.n_title,"title",this.title);

	}
});