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
/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/


/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

		var b_this = dojo.contentBox(this.domNode);

//		if ( this.selectedChildWidget )
//			this.selectedChildWidget.resize(b_this);
		
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
		
		 this._showChild(i_new_widget);

 		if ( i_old_widget )
 			this.slideOut(direction,i_old_widget);
		
		this.slideIn(direction,i_new_widget);
			
	},

	slideOut: function(position,page)
	{
		
		var b_this = dojo.contentBox(this.domNode);
				
		if( this.type == 'up-down')
		{	
			var params = {duration:this.slide_duration,top:b_this.h };
		
			if(position == "up")
				params = {duration:this.slide_duration,top:-b_this.h };
		
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
		}	
		var anim = dojo.fx.slideTo(slideArgs);
		dojo.connect(anim, "onEnd", this,function()
		{
			this._hideChild(page);
		});		
		anim.play();
		
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
		}
		var anim = dojo.fx.slideTo(slideArgs);
		
		dojo.connect(anim, "onEnd", this,function()
		{

	 		if ( page.resize )
			{
				if ( this.doLayout )
					page.resize();
				else
					page.resize();
			}

			console.debug("koniec animacie");
		});		
		anim.play();

		
	}	
});