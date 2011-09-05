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

		//dojo.connect(this.n_rewind, 'onclick', this, 'rewind');
		//dojo.connect(this.n_play_stop, 'onclick', this, '_playOrStop');
		//dojo.connect(this.n_play_pause, 'onclick', this, '_playOrPause');
		
		dojo.connect(this.n_stop, 'onclick', this, 'stop');
		dojo.connect(this.n_play, 'onclick', this, 'play');
		dojo.connect(this.n_pause, 'onclick', this, 'pause');
		
		dojo.connect(this.n_audio, 'timeupdate', this, '_onprogress');
	},

/******************************************************************************/

	play: function ()
	{
		var was_paused = this.is_pause;
		
		this.is_playing = true;
		this.is_pause = false;
		this.is_stopped = false;

		this.n_audio.play();
		
		dojo.removeClass(this.n_play, 'play');
		dojo.addClass(this.n_play, 'play_selected');
		
		dojo.removeClass(this.n_pause, 'pause_selected');
		dojo.addClass(this.n_pause, 'pause');
		
// 		dojo.attr(this.n_play_stop, "title", "Stop");
// 
// 		if( !was_paused )
// 		{
// 			dojo.removeClass(this.n_play_stop, 'play');
// 			dojo.addClass(this.n_play_stop, 'stop');
// 		}else{
// 			dojo.removeClass(this.n_play_pause, 'play');
// 			dojo.addClass(this.n_play_pause, 'pause');
// 		}
	},

	pause: function ()
	{
		this.is_playing = false;
		this.is_pause = true;
		this.is_stopped = false;

		this.n_audio.pause();
		
		dojo.removeClass(this.n_play, 'play_selected');
		dojo.addClass(this.n_play, 'play');
		
		dojo.removeClass(this.n_pause, 'pause');
		dojo.addClass(this.n_pause, 'pause_selected');
		
		//dojo.attr(this.n_play_pause, "title", "Pause");
		
		//dojo.removeClass(this.n_play_pause, 'pause');
		//dojo.addClass(this.n_play_pause, 'play');
	},

	stop: function ()
	{
		this.is_playing = false;
		this.is_pause = false;
		this.is_stopped = true;

		this.n_audio.pause();
		this.rewind();

		dojo.removeClass(this.n_play, 'play_selected');
		dojo.addClass(this.n_play, 'play');
		
		dojo.removeClass(this.n_pause, 'pause_selected');
		dojo.addClass(this.n_pause, 'pause');
		
		//dojo.attr(this.n_play_stop, "title", "Hrať");

		//dojo.removeClass(this.n_play_stop, 'stop');
		//dojo.addClass(this.n_play_stop, 'play');
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
	},
	
	_playOrPause: function ()
	{
		if ( this.is_playing )
			this.pause();
		else
			this.play();
	},
	
	_onprogress: function()
	{
		var loaded = parseInt(((this.n_audio.buffered.end(0) / this.n_audio.duration) * 100), 10);
		//loadingIndicator.css({width: loaded + '%'});
		
		var elapsedTime = Math.round( this.n_audio.currentTime );
		var duration = this.n_audio.duration;
		
		if ( this.canvas.getContext ) 
		{
			var ctx = this.canvas.getContext("2d");
			//clear canvas before painting
			ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
			
			ctx.fillStyle = "rgb(255,0,0)";
			
			var fWidth = ( elapsedTime / duration ) * ( this.canvas.clientWidth );
			
			if ( fWidth > 0 ) 
			{
				ctx.fillRect(0, 0, fWidth, this.canvas.clientHeight);
			}
        }
		
	}
});