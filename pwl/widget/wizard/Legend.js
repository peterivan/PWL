dojo.provide('pwl.widget.wizard.Legend');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.wizard.legend.Intro');
dojo.require('pwl.widget.wizard.legend.Group');
dojo.require('pwl.widget.wizard.legend.Item');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.Legend',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.wizard', 'templates/Legend.html'),
	
	w_intro: null,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

	addIntro: function ( i_intro )
	{
		//TODO: check if intro is present
		
		this.w_intro = new pwl.widget.wizard.legend.Intro({label: i_intro.legend || ''}, this.n_intro);
	},
	
	addSummary: function ( i_summary )
	{
	},

/******************************************************************************/
/** Groups ********************************************************************/

	addGroup: function ( i_group )
	{
		console.log(i_group);
		
		var group = new pwl.widget.wizard.legend.Group();
		
		i_group.getChildren().forEach( function ( i_step ) 
		{
			var item = new pwl.widget.wizard.legend.Item({label: i_step.legend});
			
			group.addChild(item);
		});
		
		this.addChild(group);
	},

/******************************************************************************/

	addStep: function ( i_step )
	{
		if ( !i_step )
			return;
		
		// temp intro exception
		
		if ( i_step.isInstanceOf(pwl.widget.wizard.Intro) )
			return;
		
		if ( !this._stepExists(i_step) )
		{
			var item = new pwl.widget.wizard.legend.Item({label: i_step.legend});
			
			item.w_step = i_step;
			
			this.addChild(item);
		}
	},
	
	removeStep: function ( i_step )
	{
		console.log('remove')
	},

	selectStep: function ( i_step )
	{
		//this.addStep(i_step);
		
		var step = this._findStep(i_step);
	},
	
	enableStep: function ( i_step )
	{
		console.log('enable step');
	},
	
	disableStep: function ( i_step )
	{
		console.log('disable step');
	},
	
	setStepCompletion: function ( i_step, i_is_completed )
	{
		console.log('complete');
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_stepExists: function ( i_step )
	{
		return dojo.some(this.getChildren(), function ( i_item ) 
		{
			if ( i_item.w_step == i_step )
				return true;
			
			return false;
		});
	},
	
	_findStep: function ( i_step )
	{
		var step = null;
		
		this.getChildren().forEach( function ( i_item ) 
		{
			if ( i_item.w_step == i_step )
				step = i_item;
		}, this);
		
		return step;
	}
});