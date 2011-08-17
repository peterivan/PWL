dojo.provide('pwl.widget.layout.TabletWizard');

/******************************************************************************/
/******************************************************************************/
dojo.require('dojo.fx');

dojo.require('dijit.layout._LayoutWidget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.widget.layout.TabletWizard',
	[dijit.layout._LayoutWidget, dijit._Templated],
{
	baseClass: 'pwlWidgetLayoutTabletWizard',

	templateString: dojo.cache('pwl.widget.layout', 'templates/TabletWizard.html'),

	panes:[],
	current_pane:null,
	slide_duration: 500,
	is_created : false,
	first_next_visible:true,
	is_next_pane: false,
	message_enabled: true,
	
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
		
		
	},
	
	createWizard: function()
	{
		if(!this.is_created)
		{
			
			this.count_panes = this.panes.length;

			var index = 0;
			
			dojo.forEach(this.panes,function(pane)
			{
				
				dojo.marginBox(pane.domNode,{h:this.container_height - 1,w:this.container_width})

				pane.resize();
				
				if(index != 0)
				{
					dojo.style(pane.domNode,"right",- this.container_width - 100 +"px");
					this.is_next_pane = true;
				}	
				
				if(index == 0)
				{
					this.current_pane = pane;
					this.current_pane_index = index;
					dojo.style(pane.domNode,"left","0");
					
					var title = pane.title ? pane.title : "";
					this.n_messageNode.innerHTML = title
				}	
								

					
				index++;
			},this)
			
			this.navigation_width = dojo.marginBox(this.n_navigation_left).w;
			
			dojo.style(this.n_navigation_left,"display","none");
			
			
			if(!this.first_next_visible)	
				dojo.style(this.n_navigation_right,"display","none");
			
			this.message_height = dojo.style(this.n_messageNode,"height");
			
			if(!this.message_enabled)
			{
				dojo.style(this.n_messageNode,"display","none");
			}
				
			this.is_created = true;
			
			this.resize();
		}

	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize : function ()
	{
		this.inherited(arguments);

		var b_parent = dojo.contentBox(this.domNode.parentNode);
console.debug(b_parent.h)
		dojo.marginBox(this.domNode,b_parent);
		
		var b_this = dojo.contentBox(this.domNode);
		
		var b_navigation_left = dojo.marginBox(this.n_navigation_left);
		var b_navigation_right = dojo.marginBox(this.n_navigation_right);
		
		this.left_to  = b_navigation_left.w
		
		this.container_height = b_this.h;
		if(this.message_enabled)
		{
			
			this.container_height = b_this.h - this.message_height - 2;
			
			dojo.style(this.n_messageNode,"left",this.left_to+"px")
		}

		this.container_width = b_this.w - b_navigation_left.w - b_navigation_right.w  ;
		
		if(!this.first_next_visible)
		{
			/*ak sa nezobrazuje na zaciatku prvy "next"... */
			//this.container_width += b_navigation_left.w
			
			if(this.current_pane_index == 0)
			{
				/* ak je na prvom slide... tak sa rozsisri na komplet sirku */
				this.container_width += 2 * b_navigation_left.w
				
				dojo.style(this.n_navigation_right,"display","none");
			}
			
			if(this.is_next_pane && this.is_prev_pane)
			{
				this.container_width = b_this.w - b_navigation_left.w - b_navigation_right.w
				this.left_to  = b_navigation_left.w
			}
			
			if(this.is_next_pane && !this.is_prev_pane)
			{
				this.container_width = b_this.w
			}
		}

		dojo.marginBox(this.domNode, {h: b_this.h});
		dojo.marginBox(this.containerNode, {h:this.container_height,w: this.container_width});
		
		dojo.marginBox(this.n_messageNode, {w: this.container_width});
		
		
		var marginSpan = b_this.h/2 - 27//27 1/2 vysky icony

		dojo.style(this.n_prev,"marginTop",marginSpan+"px")
		dojo.style(this.n_next,"marginTop",marginSpan+"px")
		
		dojo.forEach(this.panes,function(pane)
		{
			pane.resize({h:this.container_height,w: this.container_width});
			
		},this)		
	},
		
	addPane: function(pane)
	{
		this.panes.push(pane);
	},
	
	setNavigation: function()
	{
		this.is_next_pane = false;
		this.is_prev_pane = false;
		
		if(this.next_pane)
		{
			dojo.style(this.n_navigation_right,"display","block");
			this.is_next_pane = true;
		}	
		else
			dojo.style(this.n_navigation_right,"display","none");
		
		if(this.prev_pane)
		{
			dojo.style(this.n_navigation_left,"display","block");
			this.is_prev_pane = true;
		}	
		else
			dojo.style(this.n_navigation_left,"display","none");

		
		this.resize();
	},
	
/******************************************************************************/
/** Action ********************************************************************/

	next: function()
	{
		
		this.next_pane = this.panes[this.current_pane_index+1] ? this.panes[this.current_pane_index+1] : null;
		
		//dojo.style(this.n_messageNode,"display","none");
		
		/* slide zmenit */
		if(this.next_pane)
		{	
 			this.left_to  = this.navigation_width

			this.slideOut("left",this.current_pane.domNode);
			
			this.slideIn("left",this.next_pane.domNode);
					
			this.current_pane = this.next_pane;
			this.current_pane_index = this.current_pane_index+1;
		
			this.next_pane = this.panes[this.current_pane_index+1] ? this.panes[this.current_pane_index+1] : null;
			this.prev_pane = this.panes[this.current_pane_index-1] ? this.panes[this.current_pane_index-1] : null;
			
			if(!this.next_pane)
				this.is_next_pane = false;
			
			var title = this.current_pane.title ? this.current_pane.title : "";
			this.n_messageNode.innerHTML = title
		}
		
		this.setNavigation();
	},	
	
	prev: function()
	{
		
		this.prev_pane = this.panes[this.current_pane_index-1] ? this.panes[this.current_pane_index-1] : null;
		
		//dojo.style(this.n_messageNode,"display","none");
		
		/* slide zmenit  */
		if(this.prev_pane)
		{	
			if(this.current_pane_index-1 == 0)
				this.left_to = 0;
			
			this.slideOut("right",this.current_pane.domNode);
			this.slideIn("right",this.prev_pane.domNode);
		
			this.current_pane = this.prev_pane;
			this.current_pane_index = this.current_pane_index-1;
		
			this.next_pane = this.panes[this.current_pane_index+1] ? this.panes[this.current_pane_index+1] : null;
			this.prev_pane = this.panes[this.current_pane_index-1] ? this.panes[this.current_pane_index-1] : null;
			
			if(!this.prev_pane)
				this.is_prev_pane = false;
			
			var title = this.current_pane.title ? this.current_pane.title : "";
			this.n_messageNode.innerHTML = title
			
		}
		
		this.setNavigation();
	},	
	

	slideOut: function(position,page)
	{
		
		var b_this = dojo.contentBox(this.domNode);
		
		dojo.style(page,{"zIndex":"90"});
		
		/* slide to left */
		var params = {duration:this.slide_duration,left:-b_this.w };
		
		/* slide to right */
		if(position == "right")
			params = {duration:this.slide_duration,left:b_this.w };
		
        var slideArgs = {
            node: page,
			duration: params.duration,
            left: params.left,
            unit: "px"
        };
		
		var anim = dojo.fx.slideTo(slideArgs);
		dojo.connect(anim, "onEnd", this,function()
		{
			if(this.message_enabled)
				dojo.style(this.n_messageNode,"display","block");
			
		});		
		anim.play();
		
	},
	
	slideIn: function(position,page)
	{
		var b_this = dojo.contentBox(this.domNode);
		
		dojo.style(page,{"left":b_this.w + "px"});//,"zIndex":"100"
		
		/* slide to left */
		var params = {duration:this.slide_duration,left:this.left_to};//this.left_to
		
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
		
		var anim = dojo.fx.slideTo(slideArgs);
		dojo.connect(anim, "onEnd", this,function()
		{
			if(this.message_enabled)
				dojo.style(this.n_messageNode,"display","block");
			
		});		
		anim.play();

		
	},		
});