dojo.provide('pwl.widget.wizard.Step');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.Step',
	[dijit.layout._LayoutWidget],
{
	is_complete: false,
	is_mandatory: false,
	
	legend: '',
	title: '',
	subtitle: '',
	
	name: '',

	w_wizard: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

	show: function()
	{
		this.inherited(arguments);
		
		this.w_wizard.w_container.selectChild( this.getParent() );
	},
	
/******************************************************************************/
/** Startup, Teardown *********************************************************/

/******************************************************************************/
/** Events ********************************************************************/

	onCompletionChange: function ( i_is_complete )
	{
		this.is_complete = i_is_complete;
	}

/******************************************************************************/
/** protected **/
/******************************************************************************/

});