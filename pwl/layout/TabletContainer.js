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

	panes:[],
	current_pane:null,
	current_pane_index:0,
	slide_duration: 500,
	is_created : false,
	first_next_visible:true,
	is_next_pane: false,
	is_prev_pane:false,
	message_enabled: true,
	navigation_width:40,
	is_programatically_pane:false,
	
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
		
		console.debug("message_enabled",this.message_enabled)
		
		var index = 0;
		
		var b_parent = dojo.contentBox(this.domNode.parentNode);
		
		if(!this.container_height)
			this.container_height = b_parent.h;
		
		console.debug("this.container_height",this.container_height)
		
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

		if(!this.first_next_visible)	
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

		if(!this.first_next_visible)
		{
			/*ak sa nezobrazuje na zaciatku prvy "next"... */
			//this.container_width += b_navigation_left.w
			
			if(this.current_pane_index == 0)
			{
				/* ak je na prvom slide... tak sa rozsisri na komplet sirku */
				this.container_width = b_this.w 

				dojo.style(this.n_navigation_right,"display","none");
			}
			
			if(this.is_next_pane && this.is_prev_pane)
			{
				this.container_width = b_this.w - 2 * this.navigation_width
				this.left_to  = this.navigation_width
			}
			
			if(this.is_next_pane && !this.is_prev_pane)
			{
				this.container_width = b_this.w
			}
			
			if(!this.is_next_pane && this.is_prev_pane)
			{
				this.container_width = b_this.w - this.navigation_width
			}			
		}else{
			
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
			this.current_pane.resize({h:this.container_height,w: this.container_width});
		
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
/** Action ********************************************************************/

	next: function()
	{
		
		this.current_pane_index++;
		
		if(this.current_pane_index >= this.max_panes)
		{
			this.current_pane_index--;
			return;
		}
				
		var nextPane = this._adjacent(true);
		
		this.direction = "left";
		
		this.left_to  = this.navigation_width
		
		this.selectChild(nextPane);

		this.current_pane = nextPane;
		
		var title = this.current_pane.title ? this.current_pane.title : "";
		this.n_messageNode.innerHTML = title

		this.is_next_pane = !nextPane.isLastChild;
		this.is_prev_pane = !nextPane.isFirstChild;
		
 		this.setNavigation();
	},	
	
	prev: function()
	{
		//console.debug("this.is_programatically_pane",this.is_programatically_pane)
		
		if(this.is_programatically_pane)
		{
			this.left_to = 0; //navtrdo ze bude vzdy v lavo
			
			this.direction = "right";
					
			this.selectChild(this.old_pane);
			
			this.current_pane = this.old_pane;
			
			var title = this.current_pane.title ? this.current_pane.title : "";
			this.n_messageNode.innerHTML = title

			this.is_next_pane = !this.current_pane.isLastChild;
			this.is_prev_pane = !this.current_pane.isFirstChild;
			
			this.setNavigation();
			
			this.is_programatically_pane = false;
			
		}else{
			
			this.current_pane_index--;

			if(this.current_pane_index < 0)
			{
				this.current_pane_index = 0;
				return;
			}
			if(this.current_pane_index == 0)
				this.left_to = 0;
					
			var prevPane = this._adjacent(false);    
			
			this.direction = "right";
					
			this.selectChild(prevPane);
			
			this.current_pane = prevPane;		
			
			var title = this.current_pane.title ? this.current_pane.title : "";
			this.n_messageNode.innerHTML = title

			this.is_next_pane = !prevPane.isLastChild;
			this.is_prev_pane = !prevPane.isFirstChild;
			
			this.setNavigation();
		}
		
		//console.debug("prev: this.current_pane",this.current_pane.id)
	},	
	
	_transition: function ( i_new_widget, i_old_widget)
	{
		var old_index = 0;
		var new_index = 0;

		//console.debug("i_old_widget",i_old_widget)
		//console.debug("i_new_widget",i_new_widget)
		
		this.getChildren().forEach( function ( i_child, i_index )
		{
			if ( i_child == i_new_widget )
				new_index = i_index;
			else if ( i_child == i_old_widget )
				old_index = i_index;
		}, this);
				
		//var direction = old_index > new_index ? 'left' : 'right';
		
		 this._showChild(i_new_widget);

		 console.debug("i_old_widget",i_old_widget.id)
		 console.debug("i_new_widget",i_new_widget.id)
		 console.debug("direction",this.direction)
		
 		if ( i_old_widget )
 			this.slideOut(this.direction,i_old_widget);
		
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
			
		});		
		anim.play();
		
		
	},
	
	selectPane: function(i_index)
	{
		
		var select_pane = null;
		var index = 0;
				
		dojo.forEach(this.getChildren(),function(pane)
		{
			if(i_index == index)
				select_pane = pane;
			index++;
		})
		
		//console.debug(select_pane)
		
		if(select_pane)
		{
			this.is_programatically_pane = true;
			
			this.direction = "left";
			
			this.left_to  = this.navigation_width
			
			this.selectChild(select_pane);

			this.old_pane = this.current_pane
			this.current_pane = select_pane;
			
			var title = this.current_pane.title ? this.current_pane.title : "";
			this.n_messageNode.innerHTML = title

			this.is_next_pane = false;
			this.is_prev_pane = true;
			
			this.setNavigation();
		}
	}
});