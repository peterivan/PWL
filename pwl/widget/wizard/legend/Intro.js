dojo.provide('pwl.widget.wizard.legend.Intro');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit._CssStateMixin');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.legend.Intro',
	[dijit._Widget, dijit._Templated, dijit._CssStateMixin],
{
	templateString: dojo.cache('pwl.widget.wizard.legend', 'templates/Item.html'),
	
	baseClass: 'pwlWidgetWizardLegendIntro',
	
	legend: 'Úvod',
	
/******************************************************************************/
/** public **/
/******************************************************************************/

	

/******************************************************************************/
/** protected **/
/******************************************************************************/

	
});