dojo.provide('pwl.layout.IconStackContainer');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.layout.StackContainer');
dojo.require('pwl.layout.IconStackController');

dojo.require('dojo.fx');

/******************************************************************************/

dojo.declare(
	'pwl.layout.IconStackContainer',
	[pwl.layout.StackContainer, dijit._Templated],
{
	baseClass: 'pwlLayoutIconStackContainer',

	templateString: dojo.cache('pwl.layout', 'templates/IconStackContainer.html'),
	widgetsInTemplate: true,
	slide_duration:500,
	w_controller: null,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup, Teardown *********************************************************/

	postCreate: function ()
	{
		this.inherited(arguments);
	},

/******************************************************************************/
/** Layout ********************************************************************/

	resize: function ()
	{
		this.inherited(arguments);

		var box = this._getContainerBox();

		dojo.style(this.containerNode, 'width', box.w + 'px');

		var b_container = dojo.contentBox(this.containerNode);

		if ( this.selectedChildWidget )
			this.selectedChildWidget.resize(b_container);
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
				
		var direction = old_index > new_index ? 'up' : 'down';
		
		 this._showChild(i_new_widget);

 		if ( i_old_widget )
 			this.slideOut(direction,i_old_widget);
		
		this.slideIn(direction,i_new_widget);
			
	},

	_getContainerBox: function ()
	{
		var b_this = dojo.contentBox(this.domNode);
		var b_controller = dojo.marginBox(this.w_controller.domNode);

		var width = b_this.w - b_controller.w - 10; // 10 = buffer

		return {w: width, h: b_this.h};
	},

	slideOut: function(position,page)
	{
		
		var b_this = dojo.contentBox(this.domNode);
				
		/* slide to down */
		var params = {duration:this.slide_duration,top:b_this.h };
		
		if(position == "up")
			params = {duration:this.slide_duration,top:-b_this.h };
		
        var slideArgs = {
            node: page.domNode,
			duration: params.duration,
            top: params.top,
            unit: "px"
        };
		
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
		
		var anim = dojo.fx.slideTo(slideArgs);
		
		dojo.connect(anim, "onEnd", this,function()
		{

	 		if ( page.resize )
			{
				if ( this.doLayout )
					page.resize(this._getContainerBox());
				else
					page.resize();
			}

			console.debug("koniec animacie");
		});		
		anim.play();

		
	},			
});