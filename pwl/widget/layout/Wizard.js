dojo.provide('pwl.widget.layout.Wizard');

/******************************************************************************/
/******************************************************************************/
dojo.require('dojo.fx');

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.Wizard',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutWizard',

	templateString: dojo.cache('pwl.widget.layout', 'templates/Wizard.html'),

	panes:[],
	current_pane:null,
	slide_duration: 350,
	
	step_by_step : true,
	
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);

	},

	startup : function ()
	{
		this.inherited(arguments);
		
		this.getChildren().forEach( function ( i_child )
		{
			this.addPane(i_child);
			
		}, this);
		
		dojo.connect(this.n_prev, 'onclick', this, 'prev');
		dojo.connect(this.n_next, 'onclick', this, 'next');
		
		this.createWizard();
	},
	
	createWizard: function()
	{
		this.count_panes = this.panes.length;
		
		var index = 0;
		dojo.forEach(this.panes,function(pane)
		{
			dojo.style(pane.domNode,"height",this.container_height - 1 + "px");
			dojo.style(pane.domNode,"width",this.container_width+"px");
			pane.resize();
			
			if(index != 0)
				dojo.style(pane.domNode,"right",- this.container_width - 20 +"px");
			
			if(index == 0)
			{
				this.current_pane = pane;
				this.current_pane_index = index;
			}	
			
			if(index == 1)
			{
				var title = pane.title ? pane.title + " >> " : "next >> ";
				this.n_next.innerHTML = title
					
			}			
			index++;
		},this)
		
		if(this.step_by_step)
		{
			dojo.style(this.n_prev,"display","none");
		}
			
		
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize : function ()
	{
		this.inherited(arguments);

		var b_this = dojo.contentBox(this.domNode);

		var b_navigation = dojo.marginBox(this.n_navigation);
		this.container_height = b_this.h - b_navigation.h - 1;
		this.container_width = b_this.w ;
		
		dojo.marginBox(this.domNode, {h: b_this.h});
		dojo.style(this.containerNode,"height",this.container_height+"px")
	},
		
	addPane: function(pane)
	{
		this.panes.push(pane);
	},
	
	setNavigation: function()
	{
		if(this.step_by_step)
		{
			
			if(this.next_pane)
			{
				dojo.style(this.n_next,"display","inline");
				var title = this.next_pane.title ? this.next_pane.title + " >> " : "next >> ";
				this.n_next.innerHTML = title;
			}	
			else
				dojo.style(this.n_next,"display","none");
			
			if(this.prev_pane)
			{
				dojo.style(this.n_prev,"display","inline");
				var title = this.prev_pane.title ? " << " + this.prev_pane.title : " << prev";
				this.n_prev.innerHTML = title;
			}	
			else
				dojo.style(this.n_prev,"display","none");
		}
		
	},
	
/******************************************************************************/
/** Action ********************************************************************/

	next: function()
	{
		
		this.next_pane = this.panes[this.current_pane_index+1] ? this.panes[this.current_pane_index+1] : null;
		
		/* slide zmenit */
		if(this.next_pane)
		{	
			
			this.slideOut("left",this.current_pane.domNode);
			
			this.slideIn("left",this.next_pane.domNode);
		
			this.current_pane = this.next_pane;
			this.current_pane_index = this.current_pane_index+1;
		
			this.next_pane = this.panes[this.current_pane_index+1] ? this.panes[this.current_pane_index+1] : null;
			this.prev_pane = this.panes[this.current_pane_index-1] ? this.panes[this.current_pane_index-1] : null;
		}
		
		this.setNavigation();
	},	
	
	prev: function()
	{
		
		this.prev_pane = this.panes[this.current_pane_index-1] ? this.panes[this.current_pane_index-1] : null;
		
		/* slide zmenit  */
		if(this.prev_pane)
		{	
			
			this.slideOut("right",this.current_pane.domNode);
			this.slideIn("right",this.prev_pane.domNode);
		
			this.current_pane = this.prev_pane;
			this.current_pane_index = this.current_pane_index-1;
		
			this.next_pane = this.panes[this.current_pane_index+1] ? this.panes[this.current_pane_index+1] : null;
			this.prev_pane = this.panes[this.current_pane_index-1] ? this.panes[this.current_pane_index-1] : null;
		}
		
		this.setNavigation();
	},	
	

	slideOut: function(position,page)
	{
		
		var b_this = dojo.contentBox(this.domNode);
		
		dojo.style(page,{"zIndex":"90"});
		
		/* slide to left */
		var params = {duration:this.slide_duration,left:-b_this.w - 20};
		
		/* slide to right */
		if(position == "right")
			params = {duration:this.slide_duration,left:b_this.w + 20};
		
        var slideArgs = {
            node: page,
			duration: params.duration,
            left: params.left,
            unit: "px"
        };
		
		dojo.fx.slideTo(slideArgs).play();
		
	},
	
	slideIn: function(position,page)
	{
		var b_this = dojo.contentBox(this.domNode);
		
		dojo.style(page,{"left":b_this.w + "px","zIndex":"100"});
		
		/* slide to left */
		var params = {duration:this.slide_duration,left:0};
		
		/* slide to right */
		if(position == "right")
		{
			dojo.style(page,{"left":-b_this.w + "px"});
		}	
		
        var slideArgs = {
            node: page,
			duration: params.duration,
            left: params.left,
            unit: "px"
        };
		
		dojo.fx.slideTo(slideArgs).play();
		
	},		
});