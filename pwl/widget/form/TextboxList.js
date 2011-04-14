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

	c_textBoxes: [],

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
		var box = new pwl.widget.form.TextBox();
		this.addChild(box);
		this.c_textBoxes.push(dojo.connect(box,"onChange",this,"addNewChild"));
		box.focus();
	},


	addNewChild: function()
	{
		var children = this.getChildren();

		var count_children = children.length;

		var remove_child = null;

		var add_new_child = false;

		var index = 0;

		dojo.forEach(children,function(child)
		{
			index++;

			var child_value = child.get("value");

			if(child_value.length == 0 && count_children > 1 && index != count_children)
				remove_child = child;

			if(child_value.length != 0 && index == count_children)
				add_new_child = true;

		});

		if(remove_child)
		{
			this.removeChild(remove_child);
		}

		if(add_new_child && !remove_child)
		{
			var new_child = new pwl.widget.form.TextBox();
			this.addChild(new_child);
			this.c_textBoxes.push(dojo.connect(new_child,"onChange",this,"addNewChild"));
			new_child.focus();

		}
	}

});