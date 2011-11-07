dojo.provide('pwl.widget.wizard.legend.Summary');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit._CssStateMixin');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.legend.Summary',
	[dijit._Widget, dijit._Templated, dijit._CssStateMixin],
{
	templateString: dojo.cache('pwl.widget.wizard.legend', 'templates/Summary.html'),
	
	baseClass: 'pwlWidgetWizardLegendSummary',
	
	label: 'Zhrnutie'
	
/******************************************************************************/
/** public **/
/******************************************************************************/

	

/******************************************************************************/
/** protected **/
/******************************************************************************/

	
});