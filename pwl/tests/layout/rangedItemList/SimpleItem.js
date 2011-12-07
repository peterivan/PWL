dojo.provide('pwl.tests.layout.rangedItemList.SimpleItem');

/******************************************************************************/
/******************************************************************************/

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

/******************************************************************************/

dojo.declare(
	'pwl.tests.layout.rangedItemList.SimpleItem',
	[dijit._Widget, dijit._Templated],
{
/******************************************************************************/
/** public **/
/******************************************************************************/

	templateString: '<li id=${id} style="height: 80px;" dojoAttachPoint="titleNode">${title}</li>',
	
	postCreate: function ()
	{
		this.inherited(arguments);
		this.titleNode.innerHTML = this.store.getValue(this.identity, 'title');
	}
});