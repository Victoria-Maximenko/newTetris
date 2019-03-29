"use strict";

var rezgame=-1;
var FlagVisible=0;
var GlobalX=0;
var GlobalY=0;
var ExcelWidth=0;
var ExcelHeight=0;
var FlagMouseDown = 0;
var FlagGameOver=0;
var VolumeZvuk=0;


function ShowAvtor(ws) {
  if (ws<=70) {
    ws=ws+2;
    var wsp=ws+'%';
    document.getElementById('id_author').style.width =  wsp;
    setTimeout(ShowAvtor, 10, ws);
  } else ShowNadpis(0);
}

function ShowNadpis(font_size) {
  if (font_size<=18) {
    font_size=font_size+0.5;
    document.getElementById('id_match').style.fontSize =  font_size+'px';
    document.getElementById('id_match').style.transform =  'rotate('+font_size*19.45+'deg)';
    setTimeout(ShowNadpis, 25, font_size);
  } else ShowButtons(0);

}

function ShowButtons(opas) {
  if (opas<=1) {
    opas=opas+0.04;
    document.getElementById('id_easy').style.opacity = opas;
    document.getElementById('id_normal').style.opacity = opas;
    document.getElementById('id_hard').style.opacity = opas;
    document.getElementById('id_demo').style.opacity = opas;
    setTimeout(ShowButtons, 50, opas);
  }
}      


function HideTitle(opas) {
   if (opas>=0) {
    opas=opas-0.04;
    document.getElementById('id_title').style.opacity = opas;
    setTimeout(HideTitle, 50, opas);
   } else {
    document.getElementById('id_title').style.display = 'none';
    document.getElementById('id_games').style.opacity = 0;
    document.getElementById('id_games').style.display = 'flex';
    ShowGames(opas);
   }
}

function ShowGames(opas) {
   if (opas<=1) {
     opas=opas+0.04;
     document.getElementById('id_games').style.opacity = opas;
     setTimeout(ShowGames, 50, opas);
   }
}

// ==================================================================

window.onload=function(e){
   ShowAvtor(1);   
}




var modal = document.querySelector('.modal');

var speed = 0;

var notes = document.querySelector('.notes');

var flag_dvigenia = 0;


//--------------------------------------------------------------------

modal.addEventListener('click', function(e){
  if(e.target.classList.contains('easy')){
    HideTitle(1);
    speed = 1500;
    startGame();  
  }else if(e.target.classList.contains('normal')){
    HideTitle(1);
    speed = 750;
    startGame();  
  } else if(e.target.classList.contains('hard')){
    HideTitle(1);
    speed = 350;
    startGame();  
  }



});

function vibro(longFlag) {
 if ( navigator.vibrate ) { // есть поддержка Vibration API?
   if ( !longFlag )
     window.navigator.vibrate(100); // вибрация 100мс
   else
     window.navigator.vibrate([100,50,100,50,100]); // вибрация 3 раза по 100мс с паузами 50мс
 }
}

var clickMainAudio = new Audio('sound/main.mp3');
function clickSoundMain(){
 clickMainAudio.play();
};
function pauseSoundMain(){
 clickMainAudio.pause();
};

var clickLastAudio = new Audio('sound/end.mp3');
function clickSoundLast(){
 clickLastAudio.play();
};
function pauseSoundLast(){
 clickLastAudio.pause();
};



function startGame(){

 


  clickSoundMain();    

   var tetris = document.getElementsByClassName('tetris')[0];

   for(var i=1; i<181; i++){
      var excel = document.createElement('div');
      excel.classList.add('excel');
      tetris.appendChild(excel);
   }


   var excel = document.getElementsByClassName('excel');
   var i = 0;

   for(var y=18; y>0; y--){
      for(var x=1; x<11; x++){
        excel[i].setAttribute('posX', x);
        excel[i].setAttribute('posY', y);
// -------------------------------------------------------
// Отслеживание события нажатия левой кнопки мыши 
        excel[i].addEventListener('mousedown', function (e){
          event.preventDefault();
          var ld = this; 
          var x = e.clientX;
          var y = e.clientY;
          if (ld.classList.contains("figure")) {
            FlagMouseDown=1;
            GlobalX=x;
            GlobalY=y;

          }
         }, false);
// -------------------------------------------------------
// Отслеживание события передвижения мыши 
        excel[i].addEventListener('mousemove', function (e){
          event.preventDefault();
          var ld = this; 
          ExcelWidth = ld.getBoundingClientRect().width;
          ExcelHeight = ld.getBoundingClientRect().height;
          var x = e.clientX;
          var y = e.clientY;
          var c1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
          var c2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
          var c3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
          var c4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];
          if ( (GlobalX-x>ExcelWidth) && (FlagMouseDown==1)  ) {
            getNewState(-1,c1,c2,c3,c4);
            GlobalX=x;
          }
          if ( (x-GlobalX>ExcelWidth) && (FlagMouseDown==1)  ) {
            getNewState(1,c1,c2,c3,c4);
            GlobalX=x;
          }
          if ( (y-GlobalY>ExcelHeight) && (FlagMouseDown==1)  ) {
            move();
            GlobalY=y;
          }
         }, false);
// -------------------------------------------------------
// Отслеживание события отпускание левой кнопки мыши 
        excel[i].addEventListener('mouseup', function (e){
          event.preventDefault();
          var x = e.clientX;
          var y = e.clientY;
          GlobalX=x;
          GlobalY=y;
          FlagMouseDown=0;  
        }, false);
// -------------------------------------------------------
// Отслеживание события прокрутки колеса мыши 
        excel[i].addEventListener('wheel', function (e){
          event.preventDefault();
          var ld = this; 
          if (ld.classList.contains("figure")) {
            var coordinates1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
            var coordinates2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
            var coordinates3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
            var coordinates4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];
            getRotate(coordinates1,coordinates2,coordinates3,coordinates4);
          }          
        }, false);
//---------------------------------------------------
// Отслеживание события прикосновение к экрану
        excel[i].addEventListener('touchstart', function (event){
          event.preventDefault();
          var x = parseInt(event.changedTouches[0].pageX);
          var y = parseInt(event.changedTouches[0].pageY);
          GlobalX=x;
          GlobalY=y;
        }, false);
//---------------------------------------------------
// Отслеживание события перемещение пальца по экрану
        excel[i].addEventListener('touchmove', function (event){
          event.preventDefault();
          var ld = this; 
          ExcelWidth = ld.getBoundingClientRect().width;
          ExcelHeight = ld.getBoundingClientRect().height;
          var x = parseInt(event.changedTouches[0].pageX);
          var y = parseInt(event.changedTouches[0].pageY);
          var c1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
          var c2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
          var c3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
          var c4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];
          if ( GlobalX-x>ExcelWidth ) {
            getNewState(-1,c1,c2,c3,c4);
            GlobalX=x;
          }
          if ( x-GlobalX>ExcelWidth ) {
            getNewState(1,c1,c2,c3,c4);
            GlobalX=x;
          }
          if ( y-GlobalY>ExcelHeight ) {
            move();
            GlobalY=y;
          }
          if ( GlobalY-y>ExcelHeight ) {
            getRotate(c1,c2,c3,c4);
            GlobalY=y;
          }
        }, false);
// --------------------------------
// Отслеживание события отпускания пальца от экрана
        excel[i].addEventListener('touchend', function (event){
          event.preventDefault();
          var x = parseInt(event.changedTouches[0].pageX);
          var y = parseInt(event.changedTouches[0].pageY);
          GlobalX=x;
          GlobalY=y;
          FlagMouseDown=0;  
        }, false);
// ---------------------------------------------------        
        i++;
      }
   }

   var x = 5;
   var y = 15;
   var mainArr=[[[0,1],[0,2],[0,3],[[-1,1],[0,0],[1,-1],[2,-2],],[[1,-1],[0,0],[-1,1],[-2,2],],[[-1,1],[0,0],[1,-1],[2,-2],],[[1,-1],[0,0],[-1,1],[-2,2],],],[[1,0],[0,1],[1,1],[[0,0],[0,0],[0,0],[0,0],],[[0,0],[0,0],[0,0],[0,0],],[[0,0],[0,0],[0,0],[0,0],],[[0,0],[0,0],[0,0],[0,0],],],[[1,0],[0,1],[0,2],[[0,0],[-1,1],[1,0],[2,-1],],[[1,-1],[1,-1],[-1,0],[-1,0],],[[-1,0],[0,-1],[2,-2],[1,-1],],[[0,-1],[0,-1],[-2,0],[-2,0],],],[[1,0],[1,1],[1,2],[[0,0],[0,0],[1,-1],[-1,-1],],[[0,-1],[-1,0],[-2,1],[1,0],],[[2,0],[0,0],[1,-1],[1,-1],],[[-2,0],[1,-1],[0,0],[-1,1],],],[[1,0],[-1,1],[0,1],[[0,-1],[-1,0],[2,-1],[1,0],],[[0,0],[1,-1],[-2,0],[-1,-1],],[[0,-1],[-1,0],[2,-1],[1,0],],[[0,0],[1,-1],[-2,0],[-1,-1],],],[[1,0],[1,1],[2,1],[[2,-1],[0,0],[1,-1],[-1,0],],[[-2,0],[0,-1],[-1,0],[1,-1],],[[2,-1],[0,0],[1,-1],[-1,0],],[[-2,0],[0,-1],[-1,0],[1,-1],],],[[1,0],[2,0],[1,1],[[1,-1],[0,0],[0,0],[0,0],],[[0,0],[-1,0],[-1,0],[1,-1],],[[1,-1],[1,-1],[1,-1],[0,0],],[[-2,0],[0,-1],[0,-1],[-1,-1],],],];

   var currentFigure = 0;
   var nextFigure = 0;

   var figureBody = 0;
   var rotate = 1;

// Функция создания фигур
   function create(){
    function getRandom(){
      return Math.round(Math.random()*(mainArr.length-1));
    }
    rotate = 1;

    currentFigure = nextFigure;
    nextFigure = getRandom();
    
    document.getElementById('id_next_figure').style.backgroundImage = 'url("img/'+nextFigure+'.png"';

    figureBody = [
      document.querySelector(`[posX = '${x}'][posY = '${y}']`),
      document.querySelector(`[posX = '${x+mainArr[currentFigure][0][0]}'][posY = '${y+mainArr[currentFigure][0][1]}']`),
      document.querySelector(`[posX = '${x+mainArr[currentFigure][1][0]}'][posY = '${y+mainArr[currentFigure][1][1]}']`),
      document.querySelector(`[posX = '${x+mainArr[currentFigure][2][0]}'][posY = '${y+mainArr[currentFigure][2][1]}']`),
    ];
    var colors = ['yellow', 'orange', 'red', 'blue', 'cyan', 'purple', 'springgreen'];
    var color = Math.round(Math.random()*(colors.length-1));
    for (var i=0; i<figureBody.length; i++){
      figureBody[i].classList.add('figure');
      var elem = figureBody[i];
      elem.style.backgroundColor = colors[color];
      elem.style.borderRadius = '10%';
    }
   }
//-------------------------------------

create();


  var cvet = []; //Цвет клеточки блока
  var bordur = []; //Стиль ободка клеточки
  var score = 0;
  var input = document.getElementById('id_score');
  input.innerHTML = `Ваши очки: ${score}`;


// Функция движения фигуры вниз
  function move(){
    var moveFlag = true;
    var coordinates = [
      [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')],
      [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')],
      [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')],
      [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')],
    ];
    for(var i=0; i<coordinates.length; i++){
      if(coordinates[i][1] == 1 || document.querySelector(`[posX = '${coordinates[i][0]}'][posY = '${coordinates[i][1]-1}']`).classList.contains('set')){
        moveFlag = false;
        break;
      }
    }
    if(moveFlag){
      for(var i=0; i<figureBody.length; i++){
        cvet[i] = figureBody[i].style.backgroundColor;
        bordur[i] = figureBody[i].style.borderRadius;
        figureBody[i].style.backgroundColor = '#DBFDFD';
        figureBody[i].style.borderRadius = '0%';
        figureBody[i].classList.remove('figure');
      }
      figureBody = [
        document.querySelector(`[posX = '${coordinates[0][0]}'][posY = '${coordinates[0][1]-1}']`),
        document.querySelector(`[posX = '${coordinates[1][0]}'][posY = '${coordinates[1][1]-1}']`),
        document.querySelector(`[posX = '${coordinates[2][0]}'][posY = '${coordinates[2][1]-1}']`),
        document.querySelector(`[posX = '${coordinates[3][0]}'][posY = '${coordinates[3][1]-1}']`),
      ];
      for(var i=0; i<figureBody.length; i++){
        figureBody[i].classList.add('figure');
        figureBody[i].style.backgroundColor = cvet[i];
        figureBody[i].style.borderRadius = bordur[i];
      }
    }else{
      for(var i=0; i<figureBody.length; i++){
        cvet[i] = figureBody[i].style.backgroundColor;
        bordur[i] = figureBody[i].style.borderRadius;
        figureBody[i].style.backgroundColor = '#DBFDFD';
        figureBody[i].style.borderRadius = '0%';
        figureBody[i].classList.remove('figure');
        figureBody[i].classList.add('set');
        figureBody[i].style.backgroundColor = cvet[i];
        figureBody[i].style.borderRadius = bordur[i];
      }
      for(var i=1; i<15; i++){
        var count = 0;
        for(var k=1; k<11; k++){
          if(document.querySelector(`[posX='${k}'][posY='${i}']`).classList.contains('set')){
            count++;
            if(count == 10){

              var clickAudio = new Audio('sound/music.mp3');
              function clickSoundInit(){
                clickAudio.play();
              };
              clickSoundInit();
              vibro(true);
              score+=10;
              input.innerHTML = `Ваши очки: ${score}`;

              for(var m=1; m<11; m++){
                document.querySelector(`[posX='${m}'][posY='${i}']`).style.backgroundColor='#DBFDFD';
                document.querySelector(`[posX='${m}'][posY='${i}']`).style.borderRadius='0%';
                document.querySelector(`[posX='${m}'][posY='${i}']`).classList.remove('set');
              }
              var set = document.querySelectorAll('.set');
              var newSet = [];
              for(var s=0; s<set.length; s++){
                var setCoordinates = [set[s].getAttribute('posX'), set[s].getAttribute('posY')];
                if(setCoordinates[1]>i){
                  cvet[i] = set[s].style.backgroundColor;
                  bordur[i] = set[s].style.borderRadius;
                  set[s].style.backgroundColor = '#DBFDFD';
                  set[s].style.borderRadius = '0%';
                  set[s].classList.remove('set');
                  newSet.push(document.querySelector(`[posX='${setCoordinates[0]}'][posY='${setCoordinates[1]-1}']`));
                }
              }
              for(var a=0; a<newSet.length; a++){
                newSet[a].classList.add('set');
                newSet[a].style.backgroundColor = cvet[i];
                newSet[a].style.borderRadius = bordur[i];
              }
              i--;
            }
          }
        }
      }

      for(var n=1; n<11; n++){
        if(document.querySelector(`[posX='${n}'][posY='15']`).classList.contains('set')){
          clearInterval(interval);
          pauseSoundMain();
          clickSoundLast();

          document.getElementById('id_end_warning').innerHTML=`Игра окончена!<br>Ваши очки: ${score}`;
          document.getElementById('id_end').style.visibility='visible';
          rezgame=score;
          FlagGameOver=1;
          break;
        }
      }
      create();
    }
  }
//---------------------------------------------------

// Старт функции движения фигуры вниз
  var interval = setInterval(() => {
    move();
  }, speed);
  var flag=true;
//---------------------------------------------------



// Смещение фигуры влево или вправо
function getNewState(a,c1,c2,c3,c4){
   var coordinates1=c1;
   var coordinates2=c2;
   var coordinates3=c3;
   var coordinates4=c4;
   flag=true;
   var figureNew=[
      document.querySelector(`[posX="${+coordinates1[0]+a}"][posY="${coordinates1[1]}"]`),
      //параметр а буде равен 1 или -1. в зависимости от нажатой клавиши
      document.querySelector(`[posX="${+coordinates2[0]+a}"][posY="${coordinates2[1]}"]`),
      document.querySelector(`[posX="${+coordinates3[0]+a}"][posY="${coordinates3[1]}"]`),
      document.querySelector(`[posX="${+coordinates4[0]+a}"][posY="${coordinates4[1]}"]`),
   ];
   for (var i=0; i<figureNew.length; i++){
      if(!figureNew[i] || figureNew[i].classList.contains('set')){
         flag = false;
      }
   }
   if(flag==true){
      for(var i=0; i<figureBody.length; i++){
         cvet[i]= figureBody[i].style.backgroundColor;
         bordur[i]= figureBody[i].style.borderRadius;
         figureBody[i].style.backgroundColor='#DBFDFD';
         figureBody[i].style.borderRadius = '0%';
         figureBody[i].classList.remove('figure');
      }
      figureBody = figureNew;
      for(var i=0; i<figureBody.length; i++){
         figureBody[i].classList.add('figure');
         figureBody[i].style.backgroundColor=cvet[i];
         figureBody[i].style.borderRadius = bordur[i];
      }
   }
}
//------------------------------------

// Поворот фигуры
function getRotate(c1,c2,c3,c4){
   var coordinates1=c1;
   var coordinates2=c2;
   var coordinates3=c3;
   var coordinates4=c4;
   flag = true;
   var figureNew=[
      document.querySelector(`[posX="${+coordinates1[0]+mainArr[currentFigure][rotate+2][0][0]}"][posY="${+coordinates1[1]+mainArr[currentFigure][rotate+2][0][1]}"]`),
      document.querySelector(`[posX="${+coordinates2[0]+mainArr[currentFigure][rotate+2][1][0]}"][posY="${+coordinates2[1]+mainArr[currentFigure][rotate+2][1][1]}"]`),
      document.querySelector(`[posX="${+coordinates3[0]+mainArr[currentFigure][rotate+2][2][0]}"][posY="${+coordinates3[1]+mainArr[currentFigure][rotate+2][2][1]}"]`),
      document.querySelector(`[posX="${+coordinates4[0]+mainArr[currentFigure][rotate+2][3][0]}"][posY="${+coordinates4[1]+mainArr[currentFigure][rotate+2][3][1]}"]`),
   ];
   for (var i=0; i<figureNew.length; i++){
      if(!figureNew[i] || figureNew[i].classList.contains('set')){
         flag = false;
      }
   }
   if(flag==true){
      for(var i=0; i<figureBody.length; i++){
         cvet[i]= figureBody[i].style.backgroundColor;
         bordur[i]= figureBody[i].style.borderRadius;
         figureBody[i].style.backgroundColor='#DBFDFD';
         figureBody[i].style.borderRadius = '0%';
         figureBody[i].classList.remove('figure');
      }
      figureBody = figureNew;
      for(var i=0; i<figureBody.length; i++){
         figureBody[i].classList.add('figure');
         figureBody[i].style.backgroundColor=cvet[i];
         figureBody[i].style.borderRadius = bordur[i];
      }
      if (rotate<4){
         rotate++;
      }else{
         rotate=1;
      }
   }
}
//------------------------------------

// Временная остановка движения фигуры
function Pausa() {
   if (flag_dvigenia==0) {
      var elem = notes;
      elem.style.visibility='visible';
      pauseSoundMain();
      clearInterval(interval);
      flag_dvigenia=1;
   } else {
      var elem = notes;
      elem.style.visibility='hidden';
      clickSoundMain();
      interval = setInterval(() => {
         move();
      }, speed);
      flag_dvigenia=0;
   }
}
//------------------------------------

//Блок событий нажатия клавиши, клика мыши
window.addEventListener('keydown', function (e){
   var coordinates1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
   var coordinates2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
   var coordinates3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
   var coordinates4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];


   if (( e.keyCode == 37) || ( e.keyCode == 100) )    {
      event.preventDefault();
      getNewState(-1,coordinates1,coordinates2,coordinates3,coordinates4);//влево
   } else if (( e.keyCode == 39) || ( e.keyCode == 102) ) { 
      event.preventDefault();
      getNewState(1,coordinates1,coordinates2,coordinates3,coordinates4);//вправо
   } else if (( e.keyCode == 40) || ( e.keyCode == 101) ) { 
      event.preventDefault();
      move();//вниз
   } else if ( ( e.keyCode == 38) || ( e.keyCode == 104) ) { //вверх = крутить фигуру
      event.preventDefault();
      getRotate(coordinates1,coordinates2,coordinates3,coordinates4);
   } else if (e.keyCode == 96){ //NumPad 0 = пауза/продолжение игры
      event.preventDefault();
      Pausa();
   }
});

// --------------------------------------------------------------------------------------
// Клик мышкой по кнопке со стрелкой влево
var left_knopka = document.querySelector('.left');
left_knopka.addEventListener('click', function (e){
//    event.preventDefault();
   var c1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
   var c2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
   var c3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
   var c4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];
   getNewState(-1,c1,c2,c3,c4);

});

// Клик мышкой по кнопке со стрелкой вправо
var right_knopka = document.querySelector('.right');
right_knopka.addEventListener('click', function (e){
//    event.preventDefault();
   var c1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
   var c2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
   var c3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
   var c4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];
   getNewState(1,c1,c2,c3,c4);
});

// Клик мышкой по кнопке со стрелкой вверх
var up_knopka = document.querySelector('.up');
up_knopka.addEventListener('click', function (e){
   var c1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
   var c2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
   var c3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
   var c4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];
   getRotate(c1,c2,c3,c4);
});

// Клик мышкой по кнопке со стрелкой вниз
var down_knopka = document.querySelector('.down');
down_knopka.addEventListener('click', function (e){
   var c1=[figureBody[0].getAttribute('posX'),figureBody[0].getAttribute('posY')];
   var c2=[figureBody[1].getAttribute('posX'),figureBody[1].getAttribute('posY')];
   var c3=[figureBody[2].getAttribute('posX'),figureBody[2].getAttribute('posY')];
   var c4=[figureBody[3].getAttribute('posX'),figureBody[3].getAttribute('posY')];
   move();
});

// Клик мышкой по кнопке с паузой
var pauza_knopka = document.querySelector('.stop');
pauza_knopka.addEventListener('click', function (e){
   Pausa();
});

// Клик мышкой по кнопке с перезагрузкой страницы
var reloadpage_knopka = document.querySelector('.reloadpage');
reloadpage_knopka.addEventListener('click', function (e){
   location.reload(true); 
});

// Клик мышкой по кнопке со звуком
var volume_knopka = document.querySelector('.volume');
volume_knopka.addEventListener('click', function (e){
  if (VolumeZvuk==1) {
    volume_knopka.style.backgroundImage = "url('./img/volume1.png')";
    clickSoundMain();
    VolumeZvuk=0;    
  } else {
    volume_knopka.style.backgroundImage = "url('./img/volume2.png')";
    pauseSoundMain();
    pauseSoundLast();
    VolumeZvuk=1;    
  }
});

// Клик мышкой по кнопке с вопросом
var vopros_knopka = document.querySelector('.question');
vopros_knopka.addEventListener('click', function (e){
  if (document.getElementById('id_question').style.display == 'block') {
    document.getElementById('id_question').style.display = 'none';
  } else {
    document.getElementById('id_question').style.display = 'block';
  }
});


}
// ==============================================================================
// Отправка сообщения на сервер
 var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
 var messages; // элемент массива - {name:'Иванов',mess:'Привет'};
 var updatePassword;

 var stringName='VIKTORIA_MAXIMENKO';

  // показывает все сообщения из messages на страницу
  function showMessages() {
      var str='';
      for ( var m=0; m<messages.length; m++ ) {
          var message=messages[m];
          str+="<b>"+escapeHTML(message.name)+":</b> "
              +escapeHTML(message.mess)+"<br />";
      }
      document.getElementById('IChat').innerHTML=str;
  }

  function escapeHTML(text) {
      if ( !text )
          return text;
      text=text.toString()
          .split("&").join("&amp;")
          .split("<").join("&lt;")
          .split(">").join("&gt;")
          .split('"').join("&quot;")
          .split("'").join("&#039;");
      return text;
  }

  // получает сообщения с сервера и потом показывает
  function refreshMessages() {

      $.ajax( {
              url : ajaxHandlerScript,
              type : 'POST', dataType:'json',
              data : { f : 'READ', n : stringName },
              cache : false,
              success : readReady,
              error : errorHandler
          }
      );
  }

  function readReady(callresult) { // сообщения получены - показывает

      if ( callresult.error!=undefined )
          alert(callresult.error); 
      else {
          messages=[];
          if ( callresult.result!="" ) { // либо строка пустая - сообщений нет
              // либо в строке - JSON-представление массива сообщений
              messages=JSON.parse(callresult.result); 
              // вдруг кто-то сохранил мусор?
              if ( !Array.isArray(messages) )
                  messages=[];
          }
          showMessages();
      }
  }

  // получает сообщения с сервера, добавляет новое,
  // показывает и сохраняет на сервере
  function sendMessage() {
      updatePassword=Math.random();
      $.ajax( {
              url : ajaxHandlerScript,
              type : 'POST', dataType:'json',
              data : { f : 'LOCKGET', n : stringName,
                  p : updatePassword },
              cache : false,
              success : lockGetReady,
              error : errorHandler
          }
      );
  }

  // сообщения получены, добавляет, показывает, сохраняет
  function lockGetReady(callresult) {
      if ( callresult.error!=undefined )
          alert(callresult.error); 
      else {
          messages=[];
          if ( callresult.result!="" ) { // либо строка пустая - сообщений нет
              // либо в строке - JSON-представление массива сообщений
              messages=JSON.parse(callresult.result); 
              // вдруг кто-то сохранил мусор?
              if ( !Array.isArray(messages) )
                  messages=[];
          }

          var senderName=document.getElementById('IName').value;
          if (senderName=='') {
            senderName='Anonim';
          }
         var message=rezgame;

          messages.push( { name:senderName, mess:message } );
          if ( messages.length>10 )
              messages=messages.slice(messages.length-10);

          showMessages();

          $.ajax( {
                  url : ajaxHandlerScript,
                  type : 'POST', dataType:'json',
                  data : { f : 'UPDATE', n : stringName,
                      v : JSON.stringify(messages), p : updatePassword },
                  cache : false,
                  success : updateReady,
                  error : errorHandler
              }
          );
      }
  }

  // сообщения вместе с новым сохранены на сервере
  function updateReady(callresult) {
      if ( callresult.error!=undefined )
          alert(callresult.error); 
  }

  function errorHandler(jqXHR,statusStr,errorStr) {
      alert(statusStr+' '+errorStr);
  }

  refreshMessages();

// =================================================================================
