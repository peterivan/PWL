dojo.provide('pwl.fx');

/******************************************************************************/
/******************************************************************************/

dojo.require('dojo.fx');

/******************************************************************************/

( function ()
{
	var fx = pwl.fx;

	fx.outlineFade = function ( i_node, i_duration, i_outline_style )
	{
		var duration = i_duration || 1500;
		
		var default_style = 
		{
			outlineWidth: '4px',
			outlineStyle: 'solid',
			outlineColor: 'red'
		};
		
		var style = dojo.mixin(default_style, i_outline_style || {});
		
		dojo.style(i_node, default_style);
		
		var anim = dojo.animateProperty(
		{
            node: i_node,
            duration: duration,
            
			properties:
			{
                outlineColor: 
				{
					start: style.outlineColor,
					end: 'transparent'
                }                
			},
			
			onEnd: function ()
			{
				dojo.style(i_node, 'outline', null);
			}
		});
		
		return anim;
	}
}) ();