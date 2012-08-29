dojo.provide('pwl.widget.Wizard');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('pwl.layout.StackContainer');

dojo.require('pwl.widget.wizard.Legend');
dojo.require('pwl.widget.wizard.Status');
dojo.require('pwl.widget.wizard.Step');
dojo.require('pwl.widget.wizard.StepContainer');
dojo.require('pwl.widget.wizard.StepGroup');
dojo.require('pwl.widget.wizard.Intro');
dojo.require('pwl.widget.wizard.Summary');

/******************************************************************************/

dojo.declare(
	'pwl.widget.Wizard',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget', 'templates/Wizard.html'),
	widgetsInTemplate: true,

	show_legend: true,
	show_status: true,
	
	w_intro: null,
	w_summary: null,
	w_legend: null,
	w_status: null,
	w_next_button: null,
	w_container: null,

	_subscriptions: null,
	_steps: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postMixInProperties: function ()
	{
		this.inherited(arguments);

		this._subscriptions = [];
	},

	buildRendering: function ()
	{
		this.inherited(arguments);
		
		//console.log(this._startupWidgets);
	},

	startup: function ()
	{
		this._setupLegend();
		
		// TODO: isolate child checking
		this.getChildren().forEach( function ( i_step, i_idx ) 
		{
			this.removeChild(i_step);
			
			if ( this._isChildValid(i_step) )
				this._setupStep(i_step);
			else
				console.error('Step ' + (i_idx + 1) + ' of pwl.widget.Wizard is invalid: ', i_step);
		}, this);
		
		if ( this.w_summary )
			this.addSummary(this.w_summary);
		
		this.inherited(arguments);
		
		dojo.connect(window, "onkeypress", this, function( kp )
		{
			console.debug("key press", kp)
			if( kp.keyCode == 40 ) //||  kp.keyCode == dojo.keys.RIGHT_ARROW
			{
				this.next();
			}
			
			if( kp.keyCode ==  38 )//dojo.keys.LEFT_ARROW || kp.keyCode == dojo.keys.UP_ARROW
			{
				this.prev();
			}			
		});
		
		this._setFirstStep();
	},

	destroy: function ()
	{
		this.inherited(arguments);
		
		this._subscriptions.forEach(dojo.unsubscribe);
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		
		var b_parent = dojo.contentBox(this.domNode.parentNode);
		
		dojo.marginBox(this.domNode,b_parent);
		
		var b_this = dojo.contentBox(this.domNode);
		var b_container = b_this;
		
		if ( this.show_legend )
		{
			var b_legend = dojo.marginBox(this.w_legend.domNode);
			var gutter = 5;
			
			b_container = 
			{
				w: b_this.w - b_legend.w - gutter,
				h: b_container.h
			};
		}

		this.w_container.resize(b_container);
	},

/******************************************************************************/
/** Events ********************************************************************/

	onFinish: function () {},
	onCancel: function () {},

/******************************************************************************/
/** Navigation ****************************************************************/

	prev: function ()
	{
		var first = this.isFirstStep( this.w_container.selectedChildWidget.w_step );
		
		console.debug("first",first)		
		if( !first)
			this.w_container.back();
		
		var new_first = this.isFirstStep( this.w_container.selectedChildWidget.w_step );
		
		if( new_first )
			this.hidePrevButton()
		
		this.showNextButton()

	},
	
	next: function ()
	{
		var current = this.w_container.selectedChildWidget;
		
		if ( current.isInstanceOf(pwl.widget.wizard.Intro)  )
		{
			this.w_container.forward();
		}
		else
		{
			var last = this.isLastStep( current );
			
			if( !last)
				this.w_container.forward();

			var new_step_is_last = this.isLastStep( this.w_container.selectedChildWidget.w_step );

			if( new_step_is_last)
				this.hideNextButton()

			this.showPrevButton()
		}
	},
	
	
	showPrevButton: function ()
	{
		
	},
	
	hidePrevButton: function ()
	{
		
	},	
	
	showNextButton: function ()
	{
		
	},
	
	hideNextButton: function ()
	{
		
	},

	finish: function ()
	{
		this.onFinish()
	},
/******************************************************************************/
/** Content manipulation ******************************************************/

	addIntro: function ( i_intro )
	{
		if ( !i_intro.isInstanceOf(pwl.widget.wizard.Intro) )
		{
			console.error('Intro is invalid: ', i_intro);
			
			return this;
		}
		
		this.w_intro = i_intro;
		this.w_intro.w_wizard = this;
		
		this.w_container.addChild(i_intro, 0);
		this.w_legend.addIntro(i_intro);
		
		return this;
	},
	
	addSummary: function ( i_summary )
	{
		if ( !i_summary.isInstanceOf(pwl.widget.wizard.Summary) )
		{
			console.error('Summary is invalid: ', i_summary);
			
			return this;
		}
		
		this.w_summary = i_summary;
		this.w_summary.w_wizard = this;// toto bolo vyblokovane.., 
//		
		this.w_container.addChild(i_summary, 'last');
		this.w_legend.addSummary(i_summary);
		
		return this;		
	},

	addGroup: function ( i_group )
	{
		if ( !i_group.isInstanceOf(pwl.widget.wizard.StepGroup) )
		{
			console.error('Step group is invalid: ', i_group);
			
			return this;
		}
		
		this.w_legend.addGroup(i_group);
		
		//TODO: check validity
		
		i_group.getChildren().forEach( function ( i_step )
		{
			this.addStep(i_step, false);
		}, this);
		
		return this;
	},
	
	addStep: function ( i_step, i_add_into_legend )
	{
		i_step.w_wizard = this;
		
		var container = new pwl.widget.wizard.StepContainer({w_wizard: this});
		
		container.addChild(i_step);
		
		this.w_container.addChild(container);
		
		if ( i_add_into_legend )
			this.w_legend.addStep(i_step);
	},
	
	selectStep: function ( i_step )
	{
		
	},
	
	getStep: function ( i_step )
	{
		if ( dojo.isString(i_step) )
		{
			var step = null;
			
			this.w_container.getChildren().forEach( function ( i_sc ){
				if ( i_sc.w_step.name == i_step )
					step = i_sc.w_step;
			});
			
			return step;
		}
		
		return null;
	},

	isFirstStep: function ( i_step )
	{
		if( !i_step )
			return false;
		
		var is_first = false;	
		this.w_container.getChildren().forEach( function ( i_sc, index )
		{

			if ( i_sc.w_step && i_step )
			{
				if( index== 0 && i_sc.w_step.id == i_step.id)
					is_first = true;
			}
		});
			
		return is_first;
	},


	isLastStep: function ( i_step )
	{
		if( !i_step )
			return true;
		
		var is_last = false;	
		var current_step_position = 0;
		var max_steps = this.w_container.getChildren().length;
		
		this.w_container.getChildren().forEach( function ( i_sc, index )
		{
			if ( i_sc.w_step && i_step )
			{
				if( i_sc.w_step.id == i_step.id)
					current_step_position = index + 1
			}
		});

		return current_step_position == max_steps;
	},
	
	reset: function()
	{
		/* destroy container */
		this.w_container.getChildren().forEach( function ( i_child )
		{
			this.w_container.removeChild( i_child );
			dojo.destroy( i_child )
		},this);		
		
		/* destroy legend */
		this.w_legend.getChildren().forEach( function ( i_child )
		{
			this.w_legend.removeChild( i_child );
			dojo.destroy( i_child )
		},this);		
		
	},
	
	getValues: function()
	{
		var r_value = [];
		
		this.w_container.getChildren().forEach( function ( i_child )
		{
			if( i_child.isInstanceOf( pwl.widget.wizard.StepContainer ) )
			{
				
				var child = i_child.getChildren()[0];
				r_value.push( child.get("value") ) ;
			}
			
		});		
		
		return r_value;
	},	
/******************************************************************************/
/** protected **/
/******************************************************************************/

	_setupLegend: function ()
	{
		if ( !this.show_legend )
			dojo.style(this.w_legend.domNode, 'display', 'none');
		
		var topic_remove_child = this.w_container.id + '-removeChild';
		var topic_select_child = this.w_container.id + '-selectChild';
		
		this._subscriptions.push(dojo.subscribe(topic_remove_child, dojo.hitch(this, function ( i_step_container ) 
		{
			var step = i_step_container.w_step;
			
			this.w_legend.removeStep(step);
		})));
		
		this._subscriptions.push(dojo.subscribe(topic_select_child, dojo.hitch(this, function ( i_step_container ) 
		{
			var step = i_step_container.w_step;			
			this.w_legend.selectStep(step);
		})));						
		
	},

	_setFirstStep: function()
	{
		
		if( !this.w_intro && this.w_container.getChildren().length > 0 )
			this.w_legend.selectStep( this.w_container.getChildren()[0].w_step );
	},
	
	_setupStep: function ( i_step )
	{
		if ( i_step.isInstanceOf(pwl.widget.wizard.Step) )
			this.addStep(i_step, true);
		else if ( i_step.isInstanceOf(pwl.widget.wizard.StepGroup) )
			this.addStepGroup(i_step);
		else if ( i_step.isInstanceOf(pwl.widget.wizard.Intro) )
		{
			this.w_intro = i_step;
			
			this.w_container.addChild(i_step, 0);
		}
		else if ( i_step.isInstanceOf(pwl.widget.wizard.Summary) )
		{	
			this.addSummary( i_step );
			this.w_summary = i_step;
		}	
	},

	_isChildValid: function ( i_child )
	{
		if ( i_child.isInstanceOf(pwl.widget.wizard.Step) )
			return true;
		if ( i_child.isInstanceOf(pwl.widget.wizard.StepGroup) )
			return true;
		if ( i_child.isInstanceOf(pwl.widget.wizard.Intro) )
			return true;
		if ( i_child.isInstanceOf(pwl.widget.wizard.Summary) )
			return true;
		
		return false;
	}
	
	
});