dojo.provide('pwl.widget._MultiModal');

/******************************************************************************/
/******************************************************************************/

/******************************************************************************/

dojo.declare(
	'pwl.widget._MultiModal',
	null,
{
	mode: '',
	default_mode: '',
	available_modes: [],
	disabled_modes: [],

	display_as: 'block',

/******************************************************************************/
/** public **/
/******************************************************************************/

	postCreate: function ()
	{
		this.set('mode', this.mode || this.default_mode);
	},

/******************************************************************************/

	refreshAllModes: function ()
	{
		this.available_modes.forEach( this.refreshMode, this );
	},

	refreshMode: function ( i_mode )
	{
		var mode = i_mode.charAt(0).toUpperCase() + i_mode.substr(1);

		var method_name = 'refresh' + mode + 'Mode';

		if ( dojo.isFunction(this[method_name]) )
			this[method_name]();
	},

/******************************************************************************/
/** Events ********************************************************************/


/******************************************************************************/
/** protected **/
/******************************************************************************/

/******************************************************************************/
/** Attr Handlers *************************************************************/

	_setModeAttr: function ( i_value )
	{
		if ( this.mode != i_value )
		{
			this.mode = i_value;

			dojo.query("[mode]", this.domNode).forEach( function ( i_node )
			{
				var has_mode = false;

				dojo.attr(i_node, 'mode').split(' ').forEach( function ( i_mode )
				{
					this.available_modes.push(i_mode);

					if ( this.mode == i_mode )
						has_mode = true;
				}, this);

				if ( has_mode )
					dojo.style(i_node, 'display', this.display_as);
				else
					dojo.style(i_node, 'display', 'none');
			}, this);
		}
	}
});