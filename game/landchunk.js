var LandChunk = function(width, height, maxHeight, scale,x,y){
    this._maxHeight = maxHeight;
	this._width = width;
	this._height = height;
	this._x = x;
	this._y = y;
    this._scale = scale;

	this._vertexBuffer = null;
	this._indexBuffer = null;
	this._indexCount = 0;
	this._colourBuffer = null;
	this._texturecoordsBuffer = null;
	
	this._texture = null;
    this._detailtexture = null;
    this._hovertexture = null;
    this._data = null;
    
    this._frame = 0.0;
    this._playerPosition = vec3.create();
};

LandChunk.prototype.getProgram = function(){
    return "landscape";
};

LandChunk.prototype.loadTextures = function(resources) {
    this._texture = resources.getTexture("/textures/gridlow.jpg");
    this._detailtexture = resources.getTexture("/textures/gridhigh.jpg");
    this._hovertexture = resources.getTexture("/textures/bars.jpg");
};

LandChunk.prototype.setData = function(data) {
    this._data = data;
};

LandChunk.prototype.activate = function(context) {
    var gl = context.gl;
  	 
	this._vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._data.vertices), gl.STATIC_DRAW)

	this._colourBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this._colourBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._data.colours), gl.STATIC_DRAW)
	
	this._texturecoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this._texturecoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._data.texturecoords), gl.STATIC_DRAW)

	this._indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._data.indices), gl.STATIC_DRAW);

	this._indexCount = this._data.indices.length;    	
};

LandChunk.prototype.upload = function(context) {
    var gl = context.gl;
	var program = context.program;

	gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
	gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexPosition'));

	gl.bindBuffer(gl.ARRAY_BUFFER, this._colourBuffer);
	gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexColour'), 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexColour'));
			
	gl.bindBuffer(gl.ARRAY_BUFFER, this._texturecoordsBuffer);
	gl.vertexAttribPointer(gl.getAttribLocation(program, 'aTextureCoords'), 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aTextureCoords'));

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
	
    gl.uniform1f(gl.getUniformLocation(program, 'time'), this._frame);         
    gl.uniform3f(gl.getUniformLocation(program, 'uPlayerPosition'), this._playerPosition[0], this._playerPosition[1], this._playerPosition[2]);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this._texture.get());
	gl.uniform1i(gl.getUniformLocation(program, 'uDiffuseSampler'), 0); 
	
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._detailtexture.get());
    gl.uniform1i(gl.getUniformLocation(program, 'uDetailSampler'), 1); 
    
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this._hovertexture.get());
    gl.uniform1i(gl.getUniformLocation(program, 'uHoverSampler'), 2); 

};

LandChunk.prototype.render = function(context) {
    this._frame++;
	var gl = context.gl;
	gl.drawElements(gl.TRIANGLE_STRIP, this._indexCount, gl.UNSIGNED_SHORT, 0);
};

LandChunk.prototype.getHeightAt = function(x, z) {
    if(!this._data) {
        return 6;
    }
    
    var heightmap = this._data.heights;
    
    // Transform to values we can (almost) index our array with
    var transformedX = x - this._x;
    var transformedZ = z - this._y;
    
    var baseX = Math.floor(transformedX);
    var baseZ = Math.floor(transformedZ);

    var horizontalWeight = transformedX - baseX;
    var verticalWeight = transformedZ - baseZ; 
    
    var leftX = baseX;
    var rightX = baseX + 1;
    var topX = baseZ; 
    var bottomX = baseZ + 1;
        
    var topLeft = heightmap[leftX + topX * this._width];
    var topRight = heightmap[rightX + topX * this._width];
    var bottomLeft = heightmap[leftX + bottomX * this._width];
    var bottomRight = heightmap[rightX + bottomX * this._width];
    
    var top = (horizontalWeight*topRight)+(1.0-horizontalWeight)*topLeft;
    var bottom = (horizontalWeight*bottomRight)+(1.0-horizontalWeight)*bottomLeft;
    
    return (verticalWeight*bottom)+(1.0-verticalWeight)*top;
};

exports.LandChunk = LandChunk;