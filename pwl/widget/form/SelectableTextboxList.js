dojo.provide('pwl.widget.form.SelectableTextboxList');

dojo.require('pwl.widget.form.SelectableTextBox');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.form.SelectableTextboxList',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.form', 'templates/SelectableTextboxList.html'),

	min_empty_textboxes:1,
	title_check: '',
	title_text: '',

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
	
	resize : function ()
	{
		this.inherited(arguments);
		this.getChildren().forEach(function(child)
		{
			child.resize();
		},this);
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

			var child_value = child.get("value").text;

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
		data = [{is_selected:true,'text':'value1'},{is_selected:true,'text':'value2'}...]
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
//			if(child.get('value').text)
				data.push(child.get('value'))
				
		},this);

		return data;

	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_createTextBox: function(i_value)
	{
//		value = value ? value : '';

		var box = new pwl.widget.form.SelectableTextBox({value:i_value});

		this.addChild(box);
		
		box.resize();

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