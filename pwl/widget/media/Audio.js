dojo.provide('pwl.widget.media.Audio');

/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

dojo.declare(
	'pwl.widget.media.Audio',
	[dijit._Widget, dijit._Templated],
{
	baseClass: 'pwlWidgetMediaAudio',

	templateString: dojo.cache('pwl.widget.media', 'templates/Audio.html'),
	widgetsInTemplate: true,

	src: '',
	file_name: '',
	title: '',

	is_playing: false,
	is_paused: false,
	is_stopped: true,

/******************************************************************************/
/** public **/
/******************************************************************************/

/******************************************************************************/
/** Startup *******************************************************************/

	postCreate: function()
	{
		this.inherited(arguments);

		dojo.connect(this.n_rewind, 'onclick', this, 'rewind');
		dojo.connect(this.n_play_pause, 'onclick', this, '_playOrStop');
		//dojo.connect(this.n_stop, 'onclick', this, 'stop');
	},

/******************************************************************************/

	play: function ()
	{
		this.is_playing = true;
		this.is_pause = false;
		this.is_stopped = false;

		this.n_audio.play();

		this.n_play_pause.title = 'Stop';

		dojo.removeClass(this.n_play_stop, 'play');
		dojo.addClass(this.n_play_stop, 'stop');
	},

	pause: function ()
	{
		this.is_playing = false;
		this.is_pause = true;
		this.is_stopped = false;

		this.n_audio.pause();

		this.n_play_pause.title = 'Hrať';

		dojo.removeClass(this.n_play_pause, 'pause');
		dojo.addClass(this.n_play_pause, 'play');
	},

	stop: function ()
	{
		this.is_playing = false;
		this.is_pause = false;
		this.is_stopped = true;

		this.n_audio.pause();
		this.rewind();

		this.n_play_pause.title = 'Hrať';

		dojo.removeClass(this.n_play_stop, 'stop');
		dojo.addClass(this.n_play_stop, 'play');
	},

	rewind: function ()
	{
		this.n_audio.currentTime = 0;
	},

/******************************************************************************/
/** protected **/
/******************************************************************************/

	_playOrStop: function ()
	{
		if ( this.is_playing )
			this.stop();
		else if ( this.is_stopped )
			this.play();
	}
});