dojo.provide('pwl.tests.widget.wizard.Step2_WidgetGroup');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.widget.wizard.Step');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.form.WidgetGroup');

dojo.require('dijit.form.ValidationTextBox');
dojo.require('dijit.form.CheckBox');
dojo.require('dijit.form.RadioButton');

/******************************************************************************/

dojo.declare(
	'pwl.tests.widget.wizard.Step2_WidgetGroup',
	[pwl.widget.wizard.Step, dijit._Templated],
{
	templateString: dojo.cache('pwl.tests.widget.wizard', 'templates/Step2_WidgetGroup.html'),
	widgetsInTemplate: true,
	
	w_group: null,
	
/******************************************************************************/
/** public **/
/******************************************************************************/
	
	startup: function ()
	{
		this.inherited(arguments);
		
		dojo.connect(this.w_group, 'onChange', this, function ()
		{
			var is_valid = this.w_group.isValid();
			
			this.onCompletionChange(is_valid);
				
		});
	}
});