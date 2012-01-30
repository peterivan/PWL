dojo.provide('pwl.widget.wizard.Legend');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('pwl.widget.wizard.legend.Intro');
dojo.require('pwl.widget.wizard.legend.Summary');
dojo.require('pwl.widget.wizard.legend.Group');
dojo.require('pwl.widget.wizard.legend.Item');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.Legend',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.wizard', 'templates/Legend.html'),
	
	w_intro: null,
	w_summary: null,
	
	w_current_step: null,
	w_previous_step: null,
	
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
		this.w_summary = new pwl.widget.wizard.legend.Summary({label: i_summary.legend || ''}, this.n_summary);
	},

/******************************************************************************/
/** Groups ********************************************************************/

	addGroup: function ( i_group )
	{
		//console.log(i_group);
		
		var group = new pwl.widget.wizard.legend.Group({label: i_group.legend});
		
		i_group.getChildren().forEach( function ( i_step ) 
		{
			var item = new pwl.widget.wizard.legend.Item({label: i_step.legend});
			
			item.w_step = i_step;
			
			group.addChild( item );
			
			dojo.connect( i_step ,"onCompletionChange", this, function( value )
			{
				this.setStepCompletion( item, value);
			});

			dojo.connect( item, "onClick", i_step, "show");
			
		},this);
		
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
			
			dojo.connect( i_step ,"onCompletionChange", this, function( value )
			{
				this.setStepCompletion( item, value);
			});
			
			//dojo.connect( item, "onClick", i_step, "show");
		}
	},
	
	removeStep: function ( i_step )
	{
		console.log('remove')
	},

	selectStep: function ( i_active_step )
	{
		//this.addStep(i_step);

		var step = this._findStep( i_active_step );
		this.w_current_step = step;
	
		
		/* zrusi sa disabled a nastavy active */
		if( this.w_previous_step ) 
		{
			dojo.removeClass(this.w_previous_step.domNode,"active");
			dojo.removeClass(this.w_previous_step.domNode,"disabled");
			dojo.addClass(this.w_previous_step.domNode,"enabled");
		}
		
		if( step )
		{
			
			dojo.removeClass(step.domNode,"disabled");
			dojo.addClass(step.domNode,"active");		
		}
		
		this.w_previous_step = this.w_current_step;

	},

	enableStep: function ( i_step )
	{
		console.log('enable step');
		
		dojo.removeClass(i_step.domNode,"disabled");
		dojo.addClass(i_step.domNode,"enabled");
		
		/* zrusi sa disabled a nastavy default*/
	},
	
	disableStep: function ( i_step )
	{
		console.log('disable step');
		dojo.addClass(i_step.domNode,"disabled");
		
	},
	
	setStepCompletion: function ( i_step, i_is_completed )
	{
		console.log('is complete ', i_is_completed);
		
		dojo.removeClass(i_step.domNode,"disabled");
		//dojo.removeClass(i_step.domNode,"active");			
		//dojo.removeClass(i_step.domNode,"completed");			
		
		if( i_is_completed )
		{
			//this.w_previous_step = i_step;
			dojo.addClass(i_step.domNode,"active");
			dojo.addClass(i_step.domNode,"completed");
						
		}else{
			dojo.removeClass(i_step.domNode,"completed");
		}
		//	dojo.addClass(i_step.domNode,"enabled");
		
		/* zrusi sa disabled ak je a nastavy li.completed */
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_stepExists: function ( i_step )
	{
//		return dojo.some(this.getChildren(), function ( i_item ) 
//		{
//			if ( i_item.w_step == i_step )
//				return true;
//			
//			return false;
//		});
		return this._findStep( i_step ) ? true : false;
	},
	
	_findStep: function ( i_step )
	{
		var step = null;
		
		this.getChildren().forEach( function ( i_item ) 
		{
			//console.debug(i_item);
			
			if ( i_item.isInstanceOf( pwl.widget.wizard.legend.Group ))
			{
				i_item.getChildren().forEach( function ( i_gitem ) 
				{
					//console.debug(i_gitem);
					
					if ( i_gitem.w_step == i_step )
					step = i_gitem;	
				}, this);
			}else{
				if ( i_item.w_step == i_step )
					step = i_item;		
			}
			
		}, this);
		
		return step;
	}
});