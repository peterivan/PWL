dojo.provide('pwl.widget.form.TextboxList');

dojo.require('pwl.widget.form.TextBox');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.TextboxList',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetFormTextboxList',

	templateString: dojo.cache('pwl.widget.form', 'templates/TextboxList.html'),

	min_empty_textboxes:1,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
		this.addTextBox();
	},

	startup : function ()
	{
		this.inherited(arguments);

	},

	addTextBox: function()
	{
		var children = this.getChildren();

		var count_children = children.length;

		var remove_child = null;

		var add_new_child = false;

		dojo.forEach(children,function(child,index)
		{
			index += 1;

			var child_value = child.get("value");

			if(child_value.length == 0 && count_children > this.min_empty_textboxes && index != count_children)
			{
				this.removeChild(child);
			}

			if(child_value.length != 0 && index == count_children)
			{
				this._createTextBox()
			}

		},this);


		if(count_children == 0)
		{
			this._createTextBox()
		}

	},

	onChange : function ()
	{

	},

	/*
		create textboxes according data
		data = ['value1','value2','value3','value4']
	*/
	_setDataAttr: function(data)
	{
		var children = this.getChildren();

		/* remove all textboxes: reset widget */
		dojo.forEach(children,function(child,index)
		{
			this.removeChild(child);

		},this);

		/* add textboxes from data array */
		dojo.forEach(data,function(item)
		{
			this._createTextBox(item);

		},this);

		this._createTextBox();//create last empty box

	},

	_getDataAttr: function()
	{
		var children = this.getChildren();

		var data = [];

		dojo.forEach(children,function(child)
		{
			if(child.get('value'))
				data.push(child.get('value'))
				
		},this);

		return data;

	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_createTextBox: function(value)
	{
		value = value ? value : '';

		var box = new pwl.widget.form.TextBox({value:value});

		this.addChild(box);

		dojo.connect(box,"onChange",this,"addTextBox");


		dojo.connect(box,"onChange",this,"onChange");
		dojo.connect(box,"onErase",this,"onChange");

		dojo.connect(box,"onKeyPress",this,function(i_evt)
		{

			if(i_evt.keyCode == 13) //ENTER = 13
			{
				this.addTextBox();

			}
			else if(i_evt.keyCode == 8) //Backspace = 8
			{
				var box_value = box.get("value");

				if(box_value.length == 0 )
				{
					this.addTextBox();
				}

			}

		});

		box.focus();
	}


});