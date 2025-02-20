"use strict";

var canvas;
var gl;

var program;
var texture;

var pointsArrayScreen = [];
var pointsArrayStage = [];

var normalsArrayScreen = [];
var normalsArrayStage = [];

var texCoordsArrayScreen = [];
var texCoordsArrayStage = [];

//texture for square
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

//texture for square
var texCoordStage = [
    vec2(0, 0),
    vec2(0, 0.75),
    vec2(0.75, 0.75),
    vec2(0.75, 0)
];

//stage vertices
var vertices = [
    //diamond
    vec4(-0.5, 0.0, 1.5, 1.0), //0
    vec4(0.0, 0.5, 1.5, 1.0),
    vec4(0.5, 0.0, 1.5, 1.0),
    vec4(0.0, -0.5, 1.5, 1.0),
    vec4(-0.5, 0.0, 1.25, 1.0),
    vec4(0.0, 0.5, 1.25, 1.0),
    vec4(0.5, 0.0, 1.25, 1.0),
    vec4(0.0, -0.5, 1.25, 1.0), //7
    
    //catwalk - front
    vec4(-0.15, -0.35, 1.499, 1.0), //8
    vec4(-0.15, -1.0, 1.499, 1.0),
    vec4(0.15, -1.0, 1.499, 1.0),
    vec4(0.15, -0.35, 1.499, 1.0),
    vec4(-0.15, -0.35, 1.25, 1.0),
    vec4(-0.15, -1.0, 1.25, 1.0),
    vec4(0.15, -1.0, 1.25, 1.0),
    vec4(0.15, -0.35, 1.25, 1.0), //15

    //front
    vec4(-0.4, -1.0, 1.5, 1.0), //16
    vec4(-0.4, -1.3, 1.5, 1.0),
    vec4(0.4, -1.3, 1.5, 1.0),
    vec4(0.4, -1.0, 1.5, 1.0),
    vec4(-0.4, -1.0, 1.25, 1.0),
    vec4(-0.4, -1.3, 1.25, 1.0),
    vec4(0.4, -1.3, 1.25, 1.0),
    vec4(0.4, -1.0, 1.25, 1.0), //23

    //catwalk - middle
    vec4(-0.15, 0.35, 1.495, 1.0), //24
    vec4(-0.15, 0.7, 1.495, 1.0),
    vec4(0.15, 0.7, 1.495, 1.0),
    vec4(0.15, 0.35, 1.495, 1.0),
    vec4(-0.15, 0.35, 1.25, 1.0),
    vec4(-0.15, 0.7, 1.25, 1.0),
    vec4(0.15, 0.7, 1.25, 1.0),
    vec4(0.15, 0.35, 1.25, 1.0), //31

    //catwalk - back
    vec4(-0.15, 1.0, 1.54, 1.0), //32
    vec4(0.15, 1.0, 1.54, 1.0),
    vec4(-0.15, 1.0, 1.25, 1.0),
    vec4(0.15, 1.0, 1.25, 1.0), //35

    //back stage 
    vec4(-0.6, 1.0, 1.54, 1.0), //36
    vec4(-0.8, 1.2, 1.54, 1.0),
    vec4(-0.8, 1.5, 1.54, 1.0),
    vec4(0.8, 1.5, 1.54, 1.0),
    vec4(0.8, 1.2, 1.54, 1.0),
    vec4(0.6, 1.0, 1.54, 1.0),
    vec4(-0.6, 1.0, 1.25, 1.0), //42
    vec4(-0.8, 1.2, 1.25, 1.0),
    vec4(-0.8, 1.5, 1.25, 1.0),
    vec4(0.8, 1.5, 1.25, 1.0),
    vec4(0.8, 1.2, 1.25, 1.0),
    vec4(0.6, 1.0, 1.25, 1.0), //47

    //screen
    vec4(-0.8,1.5,1.25,1.0), //48
    vec4(-0.8,1.5,2.25,1.0),
    vec4(0.8,1.5,1.25,1.0),
    vec4(0.8,1.5,2.25,1.0), //51

    //diamond framing 
    vec4(-0.15, -0.5, 1.5, 1.0), //52
    vec4(0.15, -0.5, 1.5, 1.0),
    vec4(-0.15, -0.5, 1.25, 1.0),
    vec4(0.15, -0.5, 1.25, 1.0) //55
];

//lighting variables
var lightPosition = vec4(0.0, -3.0, 1.0, 1.0);
//var lightAmbient = vec4(0.35, 0.35, 0.5, 1.0);
var lightAmbient = vec4(0.9, 0.9, 1.0, 1.0);
var lightDiffuse = vec4(0.7, 0.7, 1.0, 1.0);
var lightSpecular = vec4(0.7, 0.7, 1.0, 1.0);

var materialAmbient = vec4(0.35, 0.35 , 0.35, 1.0);
var materialDiffuse = vec4(1.0, 1.0 , 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0 , 1.0, 1.0);
var materialShininess = 50.0;

var ambientColor, diffuseColor, specularColor;

//perspective projection variables 
var near = 0.99;
var far = 9.9;
var radius = 4.0;
var theta = -1.0;
var phi = 1.57;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

const eye = vec3(-0.069,-3.365, 2.161);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var mvMatrix, pMatrix, trMatrix;
var modelView, projection, tran;

//animation variables
var flag;
var rotation = 80;

var image0, image1;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    aspect =  canvas.width/canvas.height;

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //lighting paramenters
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program,
        "ambientProduct"),flatten(ambientProduct) );
     gl.uniform4fv( gl.getUniformLocation(program,
        "diffuseProduct"),flatten(diffuseProduct) );
     gl.uniform4fv( gl.getUniformLocation(program,
        "specularProduct"),flatten(specularProduct) );
     gl.uniform4fv( gl.getUniformLocation(program,
        "lightPosition"),flatten(lightPosition) );
     gl.uniform1f( gl.getUniformLocation(program,
        "shininess"),materialShininess );

    //projection 
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );
    mvMatrix = lookAt(eye, at , up);
    pMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    //transformation
    trMatrix = mat4();
    tran = gl.getUniformLocation(program, "tran");


    //load textures images
    image0 = document.getElementById("texImage0"); //taylor
    image1 = document.getElementById("texImage1"); //purple pattern

    pushToArrays();

    render();
}


function pushToArrays(){
    //screen vertices
    quadScreen( 48, 49, 51, 50);

    // stage vertices
    //diamond
    quadStage( 0, 1, 2, 3 );
    quadStage( 2, 3, 7, 6);
    quadStage( 3, 0, 4, 7);
    quadStage( 6, 5, 1, 2);
    quadStage( 4, 5, 6, 7);
    quadStage( 5, 4, 0, 1);

    //catwalk - front
    quadStage( 8, 11, 10, 9);
    quadStage( 11, 10, 14, 15);
    quadStage( 10, 14, 13, 9);
    quadStage( 9, 13, 12, 8);
    quadStage( 12, 15, 14, 13);

    //front
    quadStage( 17, 16, 19, 18);
    quadStage( 19, 18, 22, 23);
    quadStage( 22, 21, 17, 18);
    quadStage( 20, 16, 17, 21);
    quadStage( 20, 16, 19, 23);

    //catwalk - middle
    quadStage( 24, 25, 26, 27);
    quadStage( 27, 26, 30, 31);
    quadStage( 30, 29, 25, 26);
    quadStage( 29, 25, 24, 28);

    //catwalk - back
    quadStage( 32, 33, 26, 25);
    quadStage( 32, 25, 29, 34);
    quadStage( 26, 33, 35, 30);

    //back stage
    quadStage( 36, 37, 40, 41);
    quadStage( 37, 38, 39, 40);
    quadStage( 36, 41, 47, 42);
    quadStage( 36, 42, 43, 37);
    quadStage( 37, 38, 44, 43);
    quadStage( 40, 46, 47, 41);
    quadStage( 40, 39, 45, 46);
}

function quadScreen(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    pointsArrayScreen.push(vertices[a]);
    normalsArrayScreen.push(normal);

    pointsArrayScreen.push(vertices[b]);
    normalsArrayScreen.push(normal);

    pointsArrayScreen.push(vertices[c]);
    normalsArrayScreen.push(normal);

    pointsArrayScreen.push(vertices[a]);
    normalsArrayScreen.push(normal);

    pointsArrayScreen.push(vertices[c]);
    normalsArrayScreen.push(normal);

    pointsArrayScreen.push(vertices[d]);
    normalsArrayScreen.push(normal);
}

function quadStage(a, b, c, d){
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    pointsArrayStage.push(vertices[a]);
    texCoordsArrayStage.push(texCoordStage[1]);
    normalsArrayStage.push(normal);

    pointsArrayStage.push(vertices[b]);
    texCoordsArrayStage.push(texCoordStage[2]);
    normalsArrayStage.push(normal);

    pointsArrayStage.push(vertices[c]);
    texCoordsArrayStage.push(texCoordStage[0]);
    normalsArrayStage.push(normal);

    pointsArrayStage.push(vertices[a]);
    texCoordsArrayStage.push(texCoordStage[2]);
    normalsArrayStage.push(normal);

    pointsArrayStage.push(vertices[c]);
    texCoordsArrayStage.push(texCoordStage[3]);
    normalsArrayStage.push(normal);

    pointsArrayStage.push(vertices[d]);
    texCoordsArrayStage.push(texCoordStage[0]);
    normalsArrayStage.push(normal);
}

function initScreenBuffers(){

    //vertex buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArrayScreen), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArrayScreen), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image0);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texCoordsArrayScreen.push(texCoord[0]);
    texCoordsArrayScreen.push(texCoord[1]);
    texCoordsArrayScreen.push(texCoord[2]);
    texCoordsArrayScreen.push(texCoord[0]);
    texCoordsArrayScreen.push(texCoord[2]);
    texCoordsArrayScreen.push(texCoord[3]);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArrayScreen), gl.STATIC_DRAW );
  
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    gl.uniform1i(gl.getUniformLocation( program, "texture"), 0);

}

function initStageBuffers(){

    
    //vertex buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArrayStage), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArrayStage), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArrayStage), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    gl.uniform1i(gl.getUniformLocation( program, "texture"), 0);
}

function rotationCalculation(){
    if (rotation > 80){
        flag = 1.0;
    }
    else if (rotation < -80){
        flag = 0.0;
    }

    if (flag == 1.0){
        rotation -= 0.15;
    }
    else {
        rotation += 0.15;
    }

    return rotation;
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //stage rotation (and some transformations to center the stage)
    rotation = rotationCalculation();
    trMatrix = mult(scalem(0.55,0.55,0.55), rotateZ(rotation));
    trMatrix = mult(trMatrix, translate(0.0,-1.0, 0.0));
    gl.uniformMatrix4fv( tran, false, flatten(trMatrix) );

    //create buffers and draw for screen
    initScreenBuffers();
    gl.drawArrays(gl.TRIANGLES, 0, 10);

    //create buffers and draw for stage
    initStageBuffers();
    gl.drawArrays(gl.TRIANGLES, 0, 200);

    requestAnimFrame(render);
}