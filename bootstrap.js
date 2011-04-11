var blah = blah || {};

$app = function(callback){    
    LazyLoad.js([        
        '/glMatrix-0.9.5.min.js', 
        '/package.js',
        '/Shaders.js'
        ],
        function(){
            Camera = require('camera').Camera;
            ChaseCamera = require('chasecamera').ChaseCamera;
            Clipping = require('clipping').Clipping;
            Controller = require('controller').Controller;
            DefaultModelLoader = require('defaultmodelloader').DefaultModelLoader;
            DefaultTextureLoader = require('defaulttextureloader').DefaultTextureLoader;
            Entity = require('entity').Entity;
            Hovercraft = require('hovercraft').Hovercraft;
            HovercraftController = require('hovercraftcontroller').HovercraftController;
            HovercraftFactory = require('hovercraftfactory').HovercraftFactory;
            KeyboardStates = require('keyboard').KeyboardStates;
            LandChunk = require('landchunk').LandChunk;
            LandChunkModelLoader = require('landchunkloader').LandChunkModelLoader;
            LandscapeController = require('landscapecontroller').LandscapeController;
            Model = require('model').Model;          
            RenderContext = require('rendercontext').RenderContext;
            ResourceManager = require('resources').ResourceManager;           
            Scene = require('scene').Scene;           
            Texture = require('texture').Texture;            
            callback();
    });
};

blah.Application = function(target) {
  this._target = target;  
  this.context = null;
};

blah.Application.prototype.init = function(finishedCallback){
    var context = new RenderContext();
    context.init(this._target);
    this.go(context);
    finishedCallback();    
};

blah.Application.prototype.go = function(context) {
    this.context = context;
    this.scene = new Scene();
    this.resources = new ResourceManager(this);
    this.controller = new Controller(this.scene);
    var app = this;
};

blah.Application.prototype.tick = function(){
  this.controller.tick();  
};

blah.Application.prototype.render = function(){
   this.scene.render(this.context);  
};