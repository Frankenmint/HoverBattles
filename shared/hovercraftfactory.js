var Entity = require('./entity').Entity;
var Hovercraft = require('./hovercraft').Hovercraft;
var Clipping = require('./clipping').Clipping;
var Tracking = require('./aiming').Tracking;
var Targeting = require('./aiming').Targeting;
var NamedItem = require('./nameditem').NamedItem;
var FiringController = require('./firingcontroller').FiringController;

var HovercraftFactory = function(app){
  this._app = app;  
};

HovercraftFactory.prototype.create = function(id) {
  var model = this._app.resources.getModel("Hovercraft.json");
  var entity = new Entity(id);
  
  entity.setModel(model); 
  entity.attach(Hovercraft);
  entity.attach(Tracking);
  entity.attach(Targeting);
  entity.attach(NamedItem);
  entity.attach(FiringController);
  
 // entity.attach(Clipping);
//  entity.setBounds([-1000,-1000, -1000], [1000,1000,1000]);
  return entity;
};

exports.HovercraftFactory = HovercraftFactory;
