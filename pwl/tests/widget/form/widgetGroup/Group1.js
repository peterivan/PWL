dojo.provide('pwl.tests.widget.form.widgetGroup.Group1');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.widget.form.WidgetGroup');

dojo.require('dijit.form.TextBox');
dojo.require('dijit.form.ComboBox');
dojo.require('dijit.form.RadioButton');
dojo.require('dijit.form.CheckBox');
dojo.require('dijit.form.Button');
dojo.require('dijit.form.DropDownButton');
dojo.require('dijit.form.Textarea');
dojo.require('dijit.form.SimpleTextarea');
dojo.require('dijit.Editor');

/******************************************************************************/

dojo.declare(
	'pwl.tests.widget.form.widgetGroup.Group1',
	[pwl.widget.form.WidgetGroup],
{
	templateString: dojo.cache('pwl.tests.widget.form.widgetGroup', 'templates/Group1.html'),
	widgetsInTemplate: true	
});