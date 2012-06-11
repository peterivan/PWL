dojo.provide('pwl.layout.SlideStackContainer');

/******************************************************************************/
/******************************************************************************/
dojo.require('dijit.layout.StackContainer');

dojo.require('dojo.fx');

/******************************************************************************/

dojo.declare(
	'pwl.layout.SlideStackContainer',
	[dijit.layout.StackContainer, dijit._Templated],
{
	baseClass: 'pwlLayoutSlideStackContainer',

	templateString: dojo.cache('pwl.layout', 'templates/SlideStackContainer.html'),
	widgetsInTemplate: true,
	slide_duration:500,
	w_controller: null,

	type: "up-down",
	transition: "fade",
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
            this.inherited(arguments);				
            
            this.overlay = dojo.create("div",null,this.domNode)    
            var base_url = dojo.moduleUrl('academy').uri;

		    var image  = base_url + "/themes/proxia/images/loading/loading2.gif";

            dojo.style(this.overlay,"background","white")
            dojo.style(this.overlay,"opacity","0.85")      
            dojo.style(this.overlay,"zIndex","20") 
            dojo.style(this.overlay,"display","none")
            dojo.style(this.overlay,"backgroundImage","url(" + image +")")
            dojo.style(this.overlay,"backgroundPosition","center, center")
            dojo.style(this.overlay,"backgroundRepeat","no-repeat")
            
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

		var b_this = dojo.contentBox(this.domNode);

		dojo.style(this.overlay,"height",b_this.h + "px")
		dojo.style(this.overlay,"width",b_this.w + "px")                
		
		this.getChildren().forEach( function ( i_child, i_index )
		{
			i_child.resize(b_this);
		})		
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/
	
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
		
		if( this.type == 'up-down')
			var direction = old_index > new_index ? 'up' : 'down';
		else
			var direction = old_index > new_index ? 'right' : 'left';

			if( this.transition == "fade")
			{
				this._showChild(i_new_widget);

				var anim1 = null;
				if ( i_old_widget )
				{
					anim1 = this.slideOut(direction,i_old_widget);
				}

				var anim2 = this.slideIn(direction,i_new_widget);

				if( anim1 )
					dojo.fx.chain([anim1, anim2]).play();
				else
					anim2.play();                    
			} else {
				this.changePage(i_old_widget, i_new_widget)	                    
			}    
               
	},

        changePage: function(i_old_widget, i_new_widget)
        {
            //this.is_animated = false;             
            var slideArgs = 
            {
				node: this.overlay,
				duration: this.slide_duration,
				unit: "px",

				beforeBegin: dojo.hitch(this,function()
				{
					this.is_animated = true; 
					dojo.style(this.overlay,"display","block")                            
				}),

				onEnd: dojo.hitch(this,function()
				{
					this.is_animated = false; 

					if( i_old_widget )
						this._hideChild(i_old_widget);

					this._showChild(i_new_widget);
					this.selectChild(i_new_widget);

					dojo.style(this.overlay,"display","none")  
					
					dojo.publish("/pwl/layout/SlideStackContainer/pageChanged", [{pane:i_new_widget}]);
					
				}), 

				onAnimate: function()
				{

				}
            }   
            
            if( !this.is_animated )
            {
                var anim = dojo.fx.slideTo(slideArgs);
                anim.play();
            }
            
        },
        
	slideOut: function(position,page)
	{
		
		var b_this = dojo.contentBox(this.domNode);
				
		if( this.type == 'up-down')
		{	
			var params = {duration:this.slide_duration,top: b_this.h + 1};
		
			if(position == "up")
				params = {duration:this.slide_duration,top: - b_this.h - 1};
		
			var slideArgs = {
				node: page.domNode,
				duration: params.duration,
				top: params.top,
				unit: "px"
			};
		}
		else
		{
			/* slide to left */
                        //dojo.style(page.domNode,{"top":0});
			var params = {duration:this.slide_duration,left: - b_this.w - 1};

			/* slide to right */
			if(position == "right")
				params = {duration:this.slide_duration,left: b_this.w + 1};
                            
			var slideArgs = {
				node: page.domNode,
				duration: params.duration,
				left: params.left,
				unit: "px",
                                beforeBegin: dojo.hitch(this,function()
                                {
                                    this._hideChild(page);
                                     dojo.style(page.domNode, {top: "0px"});                                
                                }),
                                onAnimate: function()
                                {
                                    var _t = dojo.style(page.domNode,"top")    
                                    console.debug("_t",_t)
                                }
                        }
		}	
                
		var anim = dojo.fx.slideTo(slideArgs);
                
		dojo.connect(anim, "onEnd", this,function()
		{
			this._hideChild(page);
                        dojo.publish("/pwl/layout/SlideStackContainer/slideOut", [{pane:page}]);
                        console.debug("koniec animacie /pwl/layout/SlideStackContainer/slideOut");
		});		
		return anim;
		
	},
	
	slideIn: function(position,page)
	{
		
		var b_this = dojo.contentBox(this.domNode);
		
		if( this.type == 'up-down')
		{		
			dojo.style(page.domNode,{"top":-b_this.h + "px"});

			/* slide to down */
			var params = {duration:this.slide_duration,top:0};		

			if(position == "up")
			{
				dojo.style(page.domNode,{"top":b_this.h + "px"});
			}	

			var slideArgs = {
				node: page.domNode,
				duration: params.duration,
				top: params.top,
				unit: "px"
			};
		}
		else
		{
			dojo.style(page.domNode,{"left":b_this.w + "px"});//,"zIndex":"100"
                        dojo.style(page.domNode,{"top":b_this.t + "px"});//,"zIndex":"100"

			/* slide to left */
			var params = {duration:this.slide_duration,left: 0};//this.left_to

			/* slide to right */
			if(position == "right")
			{
				dojo.style(page.domNode,{"left": - b_this.w + "px"});
			}	
                        
			var slideArgs = {
				node: page.domNode,
				duration: params.duration,
				left: params.left,
				unit: "px"
			};			
		}
		var anim = dojo.fx.slideTo(slideArgs);
		
		dojo.connect(anim, "onEnd", this,function()
		{

	 		if ( page.resize )
			{
//				if ( this.doLayout )
//					page.resize();
//				else
					page.resize();
			}
                        
                        dojo.publish("/pwl/layout/SlideStackContainer/slideIn", [{pane:page}]);
                        
			console.debug("koniec animacie /pwl/layout/SlideStackContainer/slideIn");
		});		
		return anim;

		
	}	
});