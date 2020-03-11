 // ページの読み込みを待つ
window.addEventListener('load', init);

var global = [];
var root = null;
class Node {
  constructor(str) {
    const geometry = new THREE.PlaneGeometry(6.4, 6.4, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: set_texture(str)
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.material.map.needsUpdate = true;
    scene.add(this.mesh);
    meshList.push(this.mesh);

    this.name = str;
    this.parent = null;
    this.children = [];
    this.line = null;
    this.selectFlag = false;
  }
}


function inputText() {
  meshList[meshNumber].material = new THREE.MeshBasicMaterial({
    map: set_texture(document.getElementById("inputText").value)
  });
  meshList[meshNumber].material.map.needsUpdate = true;
}
var meshNumber = 0;
const meshList = [];
const lineList = [];
const scene = new THREE.Scene();

var connectNumber = 0;
function connectNode() {
  const materialLine = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });  
  const geometryLine = new THREE.Geometry();
  geometryLine.vertices.push(new THREE.Vector3( - 10, 0, 0 ));
  geometryLine.vertices.push(new THREE.Vector3(  0, 10, 0 ));
  geometryLine.verticesNeedUpdate = true;
  geometryLine.elementNeedUpdate = true;
  const line = new THREE.Line( geometryLine, materialLine );
  scene.add( line );
  lineList.push( line );
}

function addNode() {
  let selectCount = 0;
  let selectNumber = 0;
  for (let i = 0; i < global.length; ++i) {
    if (global[i].selectFlag) {
      selectNumber = i;
      ++selectCount;
    }
  }
  if (selectCount == 1) {
    const node = new Node("node");
    node.parent = global[selectNumber];
    global[selectNumber].children.push( node );
    global.push( node );


    const materialLine = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });  
    const geometryLine = new THREE.Geometry();
    geometryLine.vertices.push( node.mesh.position );
    geometryLine.vertices.push( node.parent.mesh.position );
    geometryLine.verticesNeedUpdate = true;
    geometryLine.elementNeedUpdate = true;
    const line = new THREE.Line( geometryLine, materialLine );
    scene.add( line );
    lineList.push( line );
    node.line = line; 

  }
}

function set_texture(str) {
  const canvas2 = document.createElement('canvas');
  canvas2.width = 256;
  canvas2.height = 256;
  const textContext = canvas2.getContext('2d');
  textContext.font = "20px 'ＭＳ Ｐゴシック'";

  textContext.fillStyle = "rgb(255, 255, 255)";
  textContext.fillRect(0,0,256,256);

  textContext.fillStyle = "rgb(200, 30, 100)";
  textContext.fillText(str, 0, 20);

  texture = new THREE.Texture(canvas2);
  return texture;
}




function init() {
  let mouseDownFlag = false;
  let mouseUpFlag = true;
  let touchFlag = false;

   // サイズを指定
   const width = 960;
   const height = 540;

   // マウス座標管理用のベクトルを作成
   const mouse = new THREE.Vector2();
   const mouse3D = new THREE.Vector2();

   // canvas 要素の参照を取得する
   const canvas = document.querySelector('#myCanvas');

   // レンダラーを作成
   const renderer = new THREE.WebGLRenderer({
     canvas: canvas
   });
   renderer.setPixelRatio(window.devicePixelRatio);
   renderer.setSize(width, height);
   renderer.setClearColor( 0xaaaaaa, 1);

   // シーンを作成

   // カメラを作成
   const camera = new THREE.PerspectiveCamera(45, width / height);
   camera.position.set(0, 0, 100);
   camera.lookAt(0,0,0);

   // 平行光源
   const directionalLight = new THREE.DirectionalLight(0xffffff);
   directionalLight.position.set(1, 1, 1);
   scene.add(directionalLight);

   // 環境光源
   const ambientLight = new THREE.AmbientLight(0x333333);
   scene.add(ambientLight);

   // レイキャストを作成
   const raycaster = new THREE.Raycaster();


 //  メッシュ作り

  root = new Node("Root");
  root.mesh.position.x = -30;
  global.push(root);

  const node = new Node("node");
  node.parent = root;
  root.children.push( node );
  global.push( node );


  
  const materialLine = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });  
  const geometryLine = new THREE.Geometry();
  geometryLine.vertices.push(new THREE.Vector3( - 10, 0, 0 ));
  geometryLine.vertices.push(new THREE.Vector3(  0, 10, 0 ));
  geometryLine.verticesNeedUpdate = true;
  geometryLine.elementNeedUpdate = true;
  const line = new THREE.Line( geometryLine, materialLine );
  scene.add( line );
  lineList.push( line );

  node.line = line;

//    var imagecanvas = document.createElement('canvas'),
//     imagecontext = imagecanvas.getContext('2d');

// imagecanvas.width = 256;
// imagecanvas.height = 256;

// // クリップする円の位置と半径を指定する
// imagecontext.beginPath();
// imagecontext.arc(175, 175, 175, 0, Math.PI*2, false);
// imagecontext.clip();

// // 画像を用意する
// var img4 = new Image();
// img4.src = "image/base.jpg";
// img4.onload = function(){
//  imagecontext.drawImage(img4, 160, 0, 256, 256, 0, 0, 256, 256);

//   // Textureとして指定する．以下Three.jsでよくあるオブジェクト描画と同じ
//   var imagetexture = new THREE.Texture(imagecanvas);
//   imagetexture.needsUpdate = true; 
//   var imagematerial = new THREE.SpriteMaterial( { map: imagetexture, color: 0xff0000 } );
//   var imagesprite = new THREE.Sprite( imagematerial );
//   imagesprite.scale.set(2, 2, 2);
//   imagesprite.position.set(0, 0, 0);

//   scene.add( imagesprite );
// }


   canvas.addEventListener('mousemove', onMouseMove);
   canvas.addEventListener('mousedown', onMouseDown, false);
   canvas.addEventListener('mouseup', onMouseUp, false);
   canvas.addEventListener("wheel", function(event) {
      camera.position.z += event.deltaY;
   });

  //  controls.update();

   tick();

   // マウスを動かしたときのイベント
   function onMouseMove(event) {
     const element = event.currentTarget;
     // canvas要素上のXY座標
     const x = event.clientX - element.offsetLeft;
     const y = event.clientY - element.offsetTop;
     // canvas要素の幅・高さ
     const w = element.offsetWidth;
     const h = element.offsetHeight;

     // -1〜+1の範囲で現在のマウス座標を登録する
     mouse.x = (x / w) * 2 - 1;
     mouse.y = -(y / h) * 2 + 1;
     if (touchFlag == true && mouseDownFlag == true) {
      mouse3D.x = camera.position.x + mouse.x * camera.position.z / 1.35;
      mouse3D.y = camera.position.y + mouse.y * camera.position.z / 2.4;
       meshList[meshNumber].position.x = mouse3D.x;
      meshList[meshNumber].position.y = mouse3D.y;

      meshList[meshNumber].material.color.setHex(0xff0000);
      global[meshNumber].selectFlag = true;
  
     }
     else if (touchFlag == false && mouseDownFlag == true) {
      const xx = -(event.clientX - element.offsetLeft) + mouseDownX;
      const yy = -(event.clientY - element.offsetTop) + mouseDownY;
 
      mouse.x = -(( xx) / w) * camera.position.z / 20;
      mouse.y = (( yy) / h) * camera.position.z / 20;
 
      camera.position.x -= mouse.x;
      camera.position.y -= mouse.y;
      camera.lookAt(camera.position.x, camera.position.y, 0);

     mouse3D.x = camera.position.x;//mouse.x * camera.position.z / 1.35;
     mouse3D.y = camera.position.y;//mouse.y * camera.position.z / 2.4;
    } else {
     mouse3D.x = camera.position.x + mouse.x * camera.position.z / 1.35;
     mouse3D.y = camera.position.y + mouse.y * camera.position.z / 2.4;
    }
    
   }

   let mouseDownX = 0.0;
   let mouseDownY = 0.0;
   function onMouseDown(event) {
     if (mouseDownFlag == false) {
      const element = event.currentTarget;
      // canvas要素上のXY座標
      mouseDownX = event.clientX - element.offsetLeft;
      mouseDownY = event.clientY - element.offsetTop;
     }
     mouseDownFlag = true;
     mouseUpFlag = false;



     raycaster.setFromCamera(mouse, camera);

     // その光線とぶつかったオブジェクトを得る
      const intersects = raycaster.intersectObjects(meshList);

      for (let i = 0; i < meshList.length; ++i) {
       // 交差しているオブジェクトが1つ以上存在し、
       // 交差しているオブジェクトの1番目(最前面)のものだったら
        if (intersects.length > 0 && meshList[i] === intersects[0].object) {
          meshNumber = i;
          global[meshNumber].selectFlag = !global[meshNumber].selectFlag;

          if (global[meshNumber].selectFlag) {
            meshList[meshNumber].material.color.setHex(0xff0000);
          } else {
            meshList[meshNumber].material.color.setHex(0xffffff);
          }
          break;
        } else {
          // if (global[i].selectFlag) {
          //   meshList[i].material.color.setHex(0xffffff);
          // }
        }
      }
   }

   function onMouseUp(event) {
    mouseDownFlag = false;
    touchFlag = false;
    mouseUpFlag = true;
  }





   // 毎フレーム時に実行されるループイベントです
  function tick() {
    // controls.update();
     // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成

    if (mouseUpFlag == false) {
      raycaster.setFromCamera(mouse, camera);

     // その光線とぶつかったオブジェクトを得る
      const intersects = raycaster.intersectObjects(meshList);

      for (let i = 0; i < meshList.length; ++i) {
       // 交差しているオブジェクトが1つ以上存在し、
       // 交差しているオブジェクトの1番目(最前面)のものだったら
        if (intersects.length > 0 && meshList[i] === intersects[0].object) {
          touchFlag = true;

          if (mouseDownFlag) {
            meshNumber = i;

            meshList[i].position.x = mouse3D.x;
            meshList[i].position.y = mouse3D.y;


            if (i > 0) {
              global[i].line.geometry.vertices[0].setX(meshList[i].position.x);
              global[i].line.geometry.vertices[0].setY(meshList[i].position.y);
            }
            for (const child of global[i].children) {
              child.line.geometry.vertices[1].setX(global[i].mesh.position.x);
              child.line.geometry.vertices[1].setY(global[i].mesh.position.y);
            }
            // if (meshList[i] === meshList[0]) {
            //   lineList[connectNumber].geometry.vertices[0].setX(meshList[i].position.x);
            //   lineList[connectNumber].geometry.vertices[0].setY(meshList[i].position.y);
            // }
            // if (meshList[i] === meshList[1]) {
            //   lineList[connectNumber].geometry.vertices[1].setX(meshList[i].position.x);
            //   lineList[connectNumber].geometry.vertices[1].setY(meshList[i].position.y);
            // }
            if (i > 0) {
              global[i].line.geometry.verticesNeedUpdate = true;
            }
            for (const child of global[i].children) {
              child.line.geometry.verticesNeedUpdate = true;              
            }


          } else {
            // if (global[i].selectFlag) {
            //   meshList[i].material.color.setHex(0xffffff);
            // }
          }
          break;
        } else {
          // if (global[i].selectFlag) {
          //   meshList[i].material.color.setHex(0xffffff);
          // }
        }
      }
    }

     // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}