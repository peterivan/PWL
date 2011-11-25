dojo.provide('pwl.widget.form.SelectableTextBox');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.widget.form.TextBox');
dojo.require('dijit.form.CheckBox');

/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.SelectableTextBox',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.form', 'templates/SelectableTextBox.html'),
	
	widgetsInTemplate: true,
	value:{},
	
	w_check_box: null,
	w_text_box: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
		
		dojo.connect(this.w_text_box,'onChange',this,'onChange');
		dojo.connect(this.w_text_box,'onErase',this,'onErase');
		dojo.connect(this.w_text_box,'onKeyPress',this,'onKeyPress');
		
		if(this.value && this.value.text)
		{
			this.w_check_box.set('checked',this.value.is_selected);
			this.w_text_box.set('value',this.value.text);
		}

	},
	
	resize: function ()
	{
		this.inherited(arguments);
		var box = dojo.marginBox(this.domNode);
		var w = box.w - 30;
		dojo.style(this.w_text_box.domNode,'width',w + 'px');
	},
	
	focus: function()
	{
		this.w_text_box.focus();
	},
	
	onChange: function(){},
	onErase: function(){},
	onKeyPress: function(){},
	
	_getValueAttr: function()
	{
		var value = {};
		value.is_selected = this.w_check_box.get('checked');
		value.text = this.w_text_box.get('value');
		return value;
	}



});