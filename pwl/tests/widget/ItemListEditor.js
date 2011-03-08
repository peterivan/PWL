dojo.provide('pwl.tests.widget.ItemListEditor');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.require('dijit.form.TextBox');

dojo.declare(
	'pwl.tests.widget.ItemListEditor._View',
	[dijit._Widget, dijit._Templated],
{
	title: '', value: '', store: '', identity: '',

	templateString: '<div><strong dojoAttachPoint="n_title">${title}</strong>:<span dojoAttachPoint="n_value">${value}</span></div>',

	_setIdentityAttr: function ()
	{
		this.n_title.innerHTML = this.store.getValue(this.identity, 'title');
		this.n_value.innerHTML = this.store.getValue(this.identity, 'value');
	}
});

dojo.declare(
	'pwl.tests.widget.ItemListEditor._Edit',
	[dijit._Widget, dijit._Templated],
{
	title: '', value: '', store: '', identity: '',

	templateString: '<div><div><em>Title:</em><span dojoType="dijit.form.TextBox" dojoAttachPoint="w_title"></span></div><div><em>Value:</em><span dojoType="dijit.form.TextBox" dojoAttachPoint="w_value"></span></div></div>',
	widgetsInTemplate: true,

	saveValues: function ()
	{
		 this.store.setValue(this.identity, 'title', this.w_title.get('value'));
		 this.store.setValue(this.identity, 'value', this.w_value.get('value'));
	},

	_setIdentityAttr: function ()
	{
		this.w_title.set('value', this.store.getValue(this.identity, 'title'));
		this.w_value.set('value', this.store.getValue(this.identity, 'value'));
	}
});

dojo.declare(
	'pwl.tests.widget.ItemListEditor._New',
	[dijit._Widget, dijit._Templated],
{
	title: '', value: '', store: '', identity: '',

	templateString: '<div><div><em>Title:</em><span dojoType="dijit.form.TextBox" dojoAttachPoint="w_title"></span></div><div><em>Value:</em><span dojoType="dijit.form.TextBox" dojoAttachPoint="w_value"></span></div></div>',
	widgetsInTemplate: true,

	saveValues: function ()
	{
		this.identity = this.store.newItem();

		this.store.setValue(this.identity, 'title', this.w_title.get('value'));
		this.store.setValue(this.identity, 'value', this.w_value.get('value'));
	},
});