dojo.provide('pwl.widget.wizard.StepContainer');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

dojo.require('dijit.form.Button');

/******************************************************************************/

dojo.declare(
	'pwl.widget.wizard.StepContainer',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	templateString: dojo.cache('pwl.widget.wizard', 'templates/StepContainer.html'),
	widgetsInTemplate: true,
	
	show_back_button: false,
	
	w_wizard: null,
	w_step: null,
	w_next_button: null,
	w_prev_button: null,
	
	n_button_container: null,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	startup: function ()
	{
		if ( !this._started )
		{
			this.inherited(arguments);

			this.w_step = this.getChildren()[0];

			if ( this.w_step )
				this._setupStep(this.w_step);

			this._connect();
		}
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);
		
		var b_parent = dojo.contentBox(this.domNode.parentNode);
		var b_button_container = dojo.marginBox(this.n_button_container);
		
		var b_step = 
		{
			h: b_parent.h - b_button_container.h
		};
		
		this.w_step.resize(b_step);
	},

/******************************************************************************/
/** Events ********************************************************************/

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_setupStep: function ( i_step )
	{
		if ( i_step.get('is_mandatory') )
			this.w_next_button.set('disabled', true);
	},

	_connect: function ()
	{
		dojo.connect(this.w_next_button, 'onClick', this.w_wizard, 'next');
		
		dojo.connect(this.w_prev_button, 'onClick', this.w_wizard, 'prev');
		
		if ( this.w_step )
		{
			dojo.connect(this, 'onShow', this.w_step, 'onShow');
			
			dojo.connect(this.w_step, 'onCompletionChange', this, function ( i_is_complete ) 
			{
				if ( i_is_complete )
					this.w_next_button.set('disabled', false);
				else
				{
					if ( this.w_step.get('is_mandatory') )
						this.w_next_button.set('disabled', true);
					else
						this.w_next_button.set('disabled', false);
				}
			});
		}
		
		dojo.connect(this.w_wizard, 'hideNextButton', this, function()
		{
			dojo.style(this.w_next_button.domNode,"visibility","hidden");
		});

		dojo.connect(this.w_wizard, 'showNextButton', this, function()
		{
			dojo.style(this.w_next_button.domNode,"visibility","visible");
		});

		dojo.connect(this.w_wizard, 'hidePrevButton', this, function()
		{
			dojo.style(this.w_prev_button.domNode,"visibility","hidden");
		});

		dojo.connect(this.w_wizard, 'showPrevButton', this, function()
		{
			dojo.style(this.w_prev_button.domNode,"visibility","visible");
		});
		
	}
});