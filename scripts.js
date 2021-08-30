// $("#canvas").click(function(e){
//      getPosition(e); 
// });

// var pointSize = 6;

// function getPosition(event){
//      var rect = canvas.getBoundingClientRect();
//      var x = event.clientX - rect.left;
//      var y = event.clientY - rect.top;
        
//      drawCoordinates(x,y);
// }

// function drawCoordinates(x,y){	
//   	var ctx = document.getElementById("canvas").getContext("2d");


//   	ctx.fillStyle = "#ff2626"; // Red color

//     ctx.beginPath();
//     ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
//     ctx.fill();
// }


    var renderer, scene, camera;
    var line;
    var count = 0;
    var mouse = new THREE.Vector3();

    init();
    animate();

    function init() {

        // renderer
        renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 1000);

        // geometry
        var geometry = new THREE.BufferGeometry();
        var MAX_POINTS = 6;
        positions = new Float32Array(MAX_POINTS * 3);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

        // material
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 2
        });

        // line
        line = new THREE.Line(geometry, material);
        scene.add(line);

        document.addEventListener("mousemove", onMouseMove, false);
        document.addEventListener('mousedown', onMouseDown, false);
    }

    // update line
    function updateLine() {
        positions[count * 3 - 3] = mouse.x;
        positions[count * 3 - 2] = mouse.y;
        positions[count * 3 - 1] = mouse.z;
        line.geometry.attributes.position.needsUpdate = true;
    }

    // mouse move handler
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.z = 0;
        mouse.unproject(camera);
        if( count !== 0 ){
  	        updateLine();
        }
    }

    // add point
    function addPoint(event){
        console.log("point nr " + count + ": " + mouse.x + " " + mouse.y + " " + mouse.z);
        positions[count * 3 + 0] = mouse.x;
        positions[count * 3 + 1] = mouse.y;
        positions[count * 3 + 2] = mouse.z;
        count++;
        line.geometry.setDrawRange(0, count);
        updateLine();
    }

    // mouse down handler
    function onMouseDown(evt) {
        // on first click add an extra point
        if( count === 0 ){
            addPoint();
        }
        addPoint();
    }

    // render
    function render() {
        renderer.render(scene, camera);
    }

    // animate
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
