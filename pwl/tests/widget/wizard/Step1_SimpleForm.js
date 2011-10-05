dojo.provide('pwl.tests.widget.wizard.Step1_SimpleForm');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.widget.wizard.Step');
dojo.require('dijit._Templated');

dojo.require('dijit.form.Form');

dojo.require('dijit.form.ValidationTextBox');
dojo.require('dijit.form.CheckBox');

/******************************************************************************/

dojo.declare(
	'pwl.tests.widget.wizard.Step1_SimpleForm',
	[pwl.widget.wizard.Step, dijit._Templated],
{
	templateString: dojo.cache('pwl.tests.widget.wizard', 'templates/Step1_SimpleForm.html'),
	widgetsInTemplate: true,
	
	w_form: null,
	
/******************************************************************************/
/** public **/
/******************************************************************************/
	
	startup: function ()
	{
		this.inherited(arguments);
		
		dojo.connect(this.w_form, 'onValidStateChange', this,  function ( i_is_valid )
		{
			this.onCompletionChange(i_is_valid);
		});
	}
});