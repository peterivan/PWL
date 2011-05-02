dojo.provide('pwl.PasswordGenerator');

/******************************************************************************/
/******************************************************************************/

dojo.require('pwl.passwordGenerator.Pronouncable');

/******************************************************************************/

( function ()
{
	var g = pwl.PasswordGenerator;

	g.generate = function ( i_type, i_max_length )
	{
		return pwl.passwordGenerator.Pronouncable.generate(i_max_length);
	}
}) ();