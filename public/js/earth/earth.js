// document.body.style.backgroundColor = '#000';//'#171133';
// document.getElementById("earth").style.width = '100%';
// document.getElementById("earth").style.height = '100%';

// * Create initial instances
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 35, 1, 1, 10000 );//window.innerWidth / window.innerHeight, 1, 10000 );
var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

renderer.setSize( 1920, 1080 );
renderer.setClearColor( 0x000000, 0 );
document.getElementById("earth").appendChild( renderer.domElement );
// document.getElementById("earth").getElementsByTagName("canvas")[0].id = 'earth-canvas';

// * Create light
const light = new THREE.PointLight(0xbfb0cc, 2);
light.position.set(10, 10, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0xbfb0cc, 0.1);
scene.add(ambient);

var textureLoader = new THREE.TextureLoader();

// * Create earth
var earthgeometry = new THREE.SphereGeometry(0.99, 128, 128);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: textureLoader.load('/images/earthmap5k.jpg'),//textureLoader.load('/images/earthmap2k.jpg'),
    bumpMap  : textureLoader.load('/images/earthbump1k.jpg'),
    bumpScale: 0.1,
    specularMap: textureLoader.load('/images/earthspec1k.jpg'),
    specular : 0x000000,
});

var earthMesh = new THREE.Mesh(earthgeometry, material);

var lightsgeometry = new THREE.SphereGeometry(0.995, 128, 128);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: textureLoader.load('/images/earthlights1k.jpg'),
    bumpMap  : textureLoader.load('/images/earthbump1k.jpg'),
    bumpScale: 0.1,
    opacity     : 0.9,
    transparent : true,
    specularMap: textureLoader.load('/images/earthspec1k.jpg'),
    specular : 0x000000,
});

var lightsMesh = new THREE.Mesh(lightsgeometry, material);

// * Create clouds
var cloudsgeometry   = new THREE.SphereGeometry(1, 128, 128)
var material  = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map         : textureLoader.load('/images/earthcloudmap.jpg'),//new THREE.Texture(canvasCloud),
    side        : THREE.DoubleSide,
    opacity     : 0.4,
    transparent : true,
    // depthWrite  : false,
    specularMap: textureLoader.load('/images/earthcloudmaptrans.jpg'),
    specular : 0x333333,
});
var cloudMesh = new THREE.Mesh(cloudsgeometry, material);


const clouds = textureLoader.load( '/images/earth_clouds_2048.png' );
clouds.encoding = THREE.sRGBEncoding;

const earthCloudsMat = new THREE.MeshLambertMaterial( {
    color: 0xffffff,
    blending: THREE.NormalBlending,
    opacity     : 0.8,
    transparent: true,
    depthTest: false,
    map: clouds
} );

const sphereCloudsMesh = new THREE.Mesh( earthgeometry, earthCloudsMat );
earthMesh.add( sphereCloudsMesh );

scene.add( earthMesh );
scene.add(camera);
camera.position.z = 4;

// earthMesh.add(cloudMesh);
earthMesh.add(lightsMesh);

// * Mouse and drag movement
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

let moveratio = {x:0,y:0};

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var raycaster = new THREE.Raycaster();
function onMouseClick(e) {
    var mouse = {
        x: ((e.clientX / renderer.domElement.clientWidth) * 2 - 1)*2*1.15,
        y: (-(e.clientY / renderer.domElement.clientHeight) * 2 + 1 - 0.10)*1.25
    };
    console.log(mouse);
    raycaster.setFromCamera(mouse, camera);
    aircrafts.forEach(plane => {
        var intersects = raycaster.intersectObjects(plane.children[0].children, true);
        
        for ( let i = 0; i < intersects.length; i ++ ) {
            console.log(intersects[i])
            intersects[ i ].object.giveInfo();
        }
    });
}
renderer.domElement.addEventListener('click', onMouseClick);

$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
}).on('mousemove', function(e) {
    mousemove(e);
});

// $(renderer.domElement).on('touchstart', function() {
//     isDragging = true;
// }).bind('touchy-drag', function(e) {
//     mousemove(e);
//     e.preventDefault();
// });

function mousemove(e) {
    //console.log(e);
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {
        if(moveratio.x + 0.002 <= deltaMove.x) moveratio.x+=0.002;
        else if(moveratio.x - 0.002 >= deltaMove.x) moveratio.x-=0.002;
        else moveratio.x=0;

        if(moveratio.y + 0.002 <= deltaMove.y) moveratio.y+=0.002;
        else if(moveratio.y - 0.002 >= deltaMove.y) moveratio.y-=0.002;
        else moveratio.y=0;

        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y*0.25),
                toRadians(deltaMove.x*0.25),
                0,
                'XYZ'
            ));

        earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
}

setInterval(() => {
    if (!isDragging) {
        if(moveratio.x + 0.004 <= 0) moveratio.x+=0.004;
        else if(moveratio.x - 0.004 >= 0) moveratio.x-=0.004;
        else moveratio.x=0;

        if(moveratio.y + 0.004 <= 0) moveratio.y+=0.004;
        else if(moveratio.y - 0.004 >= 0) moveratio.y-=0.004;
        else moveratio.y=0;
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(moveratio.y==0?0:moveratio.y*2),
                toRadians(moveratio.x==0?-0.02:moveratio.x*2),
                0,
                'XYZ'
            ));

        earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
    } else {
        if(moveratio.x + 0.002 <= 0) moveratio.x+=0.002;
        else if(moveratio.x - 0.002 >= 0) moveratio.x-=0.002;
        else moveratio.x=0;

        if(moveratio.y + 0.002 <= 0) moveratio.y+=0.002;
        else if(moveratio.y - 0.002 >= 0) moveratio.y-=0.002;
        else moveratio.y=0;
    }
}, 1000/60);
/* */

$(document).on('mouseup', function(e) {
    isDragging = false;
});

// $(document).on('touchend', function() {
//     isDragging = false;
// });

let hour = 0;
document.getElementById("hour-range").value = `${new Date().getHours()*60*60 + new Date().getMinutes()*60 + new Date().getSeconds()}`;
setInterval(()=>{
    document.getElementById("hour-range").value = `${(parseInt(document.getElementById("hour-range").value)+1>86399?0:parseInt(document.getElementById("hour-range").value)+1)}`;
    hour = (document.getElementById("hour-range").value/60/60);
    if(hour>=24) hour = 0;
    document.getElementById("hour-range-label").innerText = `${Math.floor(hour)<10?`0`+Math.floor(hour):Math.floor(hour)}:${Math.floor((hour-Math.floor(hour))*60)<10?`0`+Math.floor((hour-Math.floor(hour))*60):Math.floor((hour-Math.floor(hour))*60)}`;
}, 1000);

// * Animations and events loop
function animate() {
    requestAnimationFrame( animate );

    let time = hour-12;
    let opacity = 1/12*(time<0?-time:time);
    lightsMesh.material.opacity = opacity;
    sphereCloudsMesh.material.opacity = 0.9-(1/12*(time<0?-time:time))*0.8;
    sphereCloudsMesh.rotation.y -= (1-(1/12*(time<0?-time:time))*0.8)*(1 / 64 * 0.01);

    renderer.render( scene, camera );
}
setInterval(() => {
    let size = {x: document.getElementById("earth").clientWidth, y: document.getElementById("earth").clientHeight};
    renderer.setSize(size.x, size.y);
    camera.aspect = size.x / size.y;
    camera.updateProjectionMatrix();
}, 500)

animate();
// setInterval(animate, 16);

// * Conversion degrees to radians
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// * Conversion degrees to degrees
function toDegrees(angle) {
    return angle * (180 / Math.PI);
}