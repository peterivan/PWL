dojo.provide('pwl.layout.TabletContainer');

/******************************************************************************/
/******************************************************************************/
dojo.require('dojo.fx');
dojo.require('pwl.layout.StackContainer');

dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.layout.TabletContainer',
	[pwl.layout.StackContainer,dijit._Templated],
{
	baseClass: 'pwlLayoutTabletContainer',

	templateString: dojo.cache('pwl.layout', 'templates/TabletContainer.html'),

	panes: [],
	current_pane: null,
	current_pane_index: 0,
	slide_duration: 500,
	is_created : false,
	show_next_navi_panel: true,
	is_next_pane: false,
	is_prev_pane: false,
	message_enabled: true,
	navigation_width: 40,
	
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
		
		dojo.connect(this.n_navigation_left, 'onclick', this, 'prev');
		dojo.connect(this.n_navigation_right, 'onclick', this, 'next');
				
		var index = 0;
		
		var b_parent = dojo.contentBox(this.domNode.parentNode);
		
		if(!this.container_height)
			this.container_height = b_parent.h;
		
		dojo.forEach(this.getChildren(),function(pane)
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
				
				this.selectChild(this.current_pane);
			}	
		
			index++;
		},this)
		

		dojo.style(this.n_navigation_left,"display","none");

		if( !this.show_next_navi_panel )	
			dojo.style(this.n_navigation_right,"display","none");
		
		this.message_height = dojo.style(this.n_messageNode,"height");

		if(!this.message_enabled)
		{
			dojo.style(this.n_messageNode,"display","none");
		}
		
		this.max_panes = index;//this.getChildren().length;
		
		this.resize();
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize : function ()
	{
		this.inherited(arguments);

		var b_parent = dojo.contentBox(this.domNode.parentNode);

		dojo.marginBox(this.domNode,b_parent);
		
		var b_this = dojo.contentBox(this.domNode);

		var b_navigation_left = dojo.marginBox(this.n_navigation_left);
		var b_navigation_right = dojo.marginBox(this.n_navigation_right);
		
		this.left_to  = b_navigation_left.w;//b_navigation_left.w this.navigation_width

		this.container_height = b_this.h;
		if(this.message_enabled)
		{
			if(!this.message_height)
				this.message_height = dojo.style(this.n_messageNode,"height");
			
			this.container_height = b_this.h - this.message_height - 2;
			
			dojo.style(this.n_messageNode,"left",this.left_to+"px")
		}else
			dojo.style(this.n_messageNode,"display","none");

		this.container_width = b_this.w - b_navigation_left.w - b_navigation_right.w  ;
		//this.container_width = b_this.w - this.navigation_width ;

		if( !this.show_next_navi_panel )
		{
			/*ak sa nezobrazuje na zaciatku prvy "next"... */
			
			/* vzdy schovam pravu stranu...*/
			dojo.style(this.n_navigation_right,"display","none");
			
			if(this.current_pane_index == 0)
			{
				/* ak je na prvom slide... tak sa rozsisri na komplet sirku */
				
				this.container_width = b_this.w 

			}
			
			if(this.is_next_pane && this.is_prev_pane)
			{
				/* ak je existuje aj prev a next pane */
				
				this.container_width = b_this.w - this.navigation_width
				this.left_to  = this.navigation_width
			}
			
			if(this.is_next_pane && !this.is_prev_pane)
			{
				/* ak je existuje next pane  a neexistuje prev*/
				
				this.container_width = b_this.w
			}
			
			if(!this.is_next_pane && this.is_prev_pane)
			{
				/* ak je existuje prev a neexistuje next pane */
				
				this.container_width = b_this.w - this.navigation_width
			}			
		}
		else
		{
			
			if(this.current_pane_index == 0 || !this.is_next_pane && this.is_prev_pane)
			{
				/* ak je na prvom slide... tak sa rozsisri na komplet sirku */
				this.container_width = b_this.w  - this.navigation_width
			}
			
			if(this.is_next_pane && this.is_prev_pane)
			{
				this.container_width = b_this.w - 2 * this.navigation_width
				this.left_to  = this.navigation_width
			}			
		}

		
		dojo.marginBox(this.domNode, {h: b_this.h});
		dojo.marginBox(this.containerNode, {h:this.container_height,w: this.container_width});
		dojo.marginBox(this.n_messageNode, {w: this.container_width});
		
		
		var marginSpan = b_this.h/2 - 27//27 1/2 vysky icony

		dojo.style(this.n_prev,"marginTop",marginSpan+"px")
		dojo.style(this.n_next,"marginTop",marginSpan+"px")
		
		if(this.current_pane)
		{
			this.current_pane.resize({h:this.container_height,w: this.container_width});
			dojo.style(this.current_pane.domNode,"left",this.left_to + "px")
		}
		
	},
		
	addPane: function(pane)
	{
		this.panes.push(pane);
	},
	
	setNavigation: function()
	{

		if(this.is_next_pane )
		{
			dojo.style(this.n_navigation_right,"display","block");
		}else
			dojo.style(this.n_navigation_right,"display","none");
		
		if(this.is_prev_pane)
		{
			dojo.style(this.n_navigation_left,"display","block");
		}else
			dojo.style(this.n_navigation_left,"display","none");
				
		this.resize();
	},

/******************************************************************************/
/** Events ********************************************************************/

	onAnimationEnd: function()
	{
		
	},

/******************************************************************************/
/** Action ********************************************************************/

	next: function()
	{

		var new_selected_index = this.current_pane_index + 1;
		
		if(new_selected_index >= this.max_panes)
		{
			new_selected_index--;
			return;
		}
		
		this.selectPane( new_selected_index, "left" )

	},	
	
	prev: function()
	{
		
		var new_selected_index = this.current_pane_index - 1;

		if( new_selected_index < 0 )
		{
			this.current_pane_index = 0;
			return;
		}
		
		if( new_selected_index == 0 )
			this.left_to = 0;
		
		if( !this.show_next_navi_panel )
			new_selected_index = 0;
		
		this.selectPane( new_selected_index, "right" )
		
	},	
	
	_transition: function ( i_new_widget, i_old_widget)
	{
		var old_index = 0;
		var new_index = 0;
		
		this.getChildren().forEach( function ( i_child, i_index )
		{
			if ( i_child == i_new_widget )
				new_index = i_index;
			else if ( i_child == i_old_widget )
				old_index = i_index;
		}, this);
				
		
		this._showChild(i_new_widget);
		
 		if ( i_old_widget )
 			this.slideOut(this.direction,i_old_widget);
		
		this.__old_pane = i_old_widget;
		
		this.slideIn(this.direction,i_new_widget);
		
	},
	
	slideOut: function(position,page)
	{

		var b_this = dojo.contentBox(this.domNode);
		
		dojo.style(page.domNode,{"zIndex":"90"});
		
		/* slide to left */
		var params = {duration:this.slide_duration,left:-b_this.w };
		
		/* slide to right */
		if(position == "right")
			params = {duration:this.slide_duration,left:b_this.w };
		
        var slideArgs = {
            node: page.domNode,
			duration: params.duration,
            left: params.left,
            unit: "px"
        };
		
		var anim = dojo.fx.slideTo(slideArgs);
		dojo.connect(anim, "onEnd", this,function()
		{
			if(this.message_enabled)
				dojo.style(this.n_messageNode,"display","block");
			
			dojo.publish("/pwl/layout/TabletContainer/slideOut", [{pane:page}]);
			
		});		
		anim.play();

	},
	
	slideIn: function(position,page)
	{

		var b_this = dojo.contentBox(this.domNode);
		
		dojo.style(page.domNode,{"left":b_this.w + "px"});//,"zIndex":"100"

		/* slide to left */
		var params = {duration:this.slide_duration,left:this.left_to};//this.left_to
		
		/* slide to right */
		if(position == "right")
		{
			dojo.style(page.domNode,{"left":-b_this.w + "px"});
		}	
		
        var slideArgs = {
            node: page.domNode,
			duration: params.duration,
            left: params.left,
            unit: "px"
        };
		
		var anim = dojo.fx.slideTo(slideArgs);
		dojo.connect(anim, "onEnd", this,function()
		{
			if(this.message_enabled)
				dojo.style(this.n_messageNode,"display","block");
			
			dojo.publish("/pwl/layout/TabletContainer/slideIn", [{current_pane:page,old_pane:this.__old_pane}]);
			
			this.onAnimationEnd( page );
			
		});		
		anim.play();
		
		
	},
	
	selectPane: function( i_index , direction)
	{

		if(i_index == this.current_pane_index)
			return;
		
		var select_pane = null;
		
		var index = 0;
		
		var count_children = this.getChildren().length;
		
		dojo.forEach(this.getChildren(),function( pane )
		{
			if(i_index == index)
				select_pane = pane;
			index++;
		})	
		
		if( select_pane )
		{
			this.current_pane_index = i_index;

			var is_last_child = (count_children - 1) == i_index;
			var is_first_child =  i_index == 0;
			
			this.direction = direction ? direction : "left";
			
			this.left_to  = is_first_child ? 0 : this.navigation_width;
			
			this.selectChild(select_pane);

			this.old_pane = this.current_pane
			this.current_pane = select_pane;
			
			var title = this.current_pane.title ? this.current_pane.title : "";
			this.n_messageNode.innerHTML = title

			this.is_next_pane = !is_last_child;
			this.is_prev_pane = !is_first_child;

			this.setNavigation();

		}
		
	},

	
});