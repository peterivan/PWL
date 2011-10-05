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
			this.w_container.addChild(this.w_summary);
		
		this.inherited(arguments);
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

	onComplete: function () {},
	onCancel: function () {},

/******************************************************************************/
/** Navigation ****************************************************************/

	prev: function ()
	{
		
	},
	
	next: function ()
	{
		this.w_container.forward();
	},
	
	showNextButton: function ()
	{
		
	},
	
	hideNextButton: function ()
	{
		
	},
	
/******************************************************************************/
/** Content manipulation ******************************************************/

	addGroup: function ( i_group )
	{
		//TODO: implement groups
	},
	
	addStep: function ( i_step )
	{
		i_step.w_wizard = this;
		
		var container = new pwl.widget.wizard.StepContainer({w_wizard: this});
		
		container.addChild(i_step);		
		
		this.w_container.addChild(container);
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
			
			this.w_container.getChildren().forEach( function ( i_sc )
			{
				if ( i_sc.w_step.name == i_step )
					step = i_sc.w_step;
			});
			
			return step;
		}
		
		return null;
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

	_setupStep: function ( i_step )
	{
		if ( i_step.isInstanceOf(pwl.widget.wizard.Step) )
			this.addStep(i_step);
		else if ( i_step.isInstanceOf(pwl.widget.wizard.StepGroup) )
			this.addStepGroup(i_step);
		else if ( i_step.isInstanceOf(pwl.widget.wizard.Intro) )
		{
			this.w_intro = i_step;
			
			this.w_container.addChild(i_step, 0);
		}
		else if ( i_step.isInstanceOf(pwl.widget.wizard.Summary) )
			this.w_summary = i_step;
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
	},
});