var greetingEl = document.getElementById('greeting');
var clockEl    = document.getElementById('clock');
var tanggalEl  = document.getElementById('tanggal');
var umurWebEl  = document.getElementById('umur-web');

var canvas = document.getElementById('pixel-bg');
var ctx    = canvas.getContext('2d');
var W = canvas.width  = window.innerWidth;
var H = canvas.height = window.innerHeight;
var mx=W/2, my=H/2, pmx=W/2, pmy=H/2, mouseSpeed=0, tick=0;
var partikel=[], ledakan=[], jejak=[], shockwave=[], snake=[], portal=[], meteor=[];
var SNAKE_LEN=40;
var NEON=[[0,255,200],[0,200,255],[180,0,255],[255,0,180],[255,220,0],[0,255,100],[255,80,0],[80,255,255],[200,255,0]];
function rn(){ return NEON[Math.floor(Math.random()*NEON.length)]; }
function nc(c,a){ return 'rgba('+c[0]+','+c[1]+','+c[2]+','+(a===undefined?1:a)+')'; }
function sp(v,g){ return Math.floor(v/g)*g; }
function px(x,y,s,c,a){ ctx.globalAlpha=Math.max(0,Math.min(1,a)); ctx.fillStyle=nc(c); ctx.fillRect(sp(x,2),sp(y,2),s,s); ctx.globalAlpha=1; }
function gpx(x,y,s,c,a){ ctx.shadowBlur=10; ctx.shadowColor=nc(c); px(x,y,s,c,a); ctx.shadowBlur=0; }function initAll(){
  partikel=[];
  for(var i=0;i<250;i++){
    partikel.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5,s:(Math.floor(Math.random()*2)+1)*2,c:rn(),a:0.1+Math.random()*0.35,fase:Math.random()*Math.PI*2,spd:0.01+Math.random()*0.02});
  }
  snake=[];
  for(var j=0;j<SNAKE_LEN;j++) snake.push({x:W/2,y:H/2});
  meteor=[];
  for(var k=0;k<6;k++) meteor.push({x:Math.random()*W,y:Math.random()*H,vx:2+Math.random()*4,vy:1.5+Math.random()*3,len:6+Math.floor(Math.random()*8),c:rn(),a:0.5+Math.random()*0.4});
}
document.addEventListener('mousemove',function(e){
  pmx=mx; pmy=my; mx=e.clientX; my=e.clientY;
  mouseSpeed=Math.sqrt((mx-pmx)*(mx-pmx)+(my-pmy)*(my-pmy));
  var n=Math.min(Math.floor(mouseSpeed/2)+1,8);
  for(var i=0;i<n;i++){
    var f=i/n;
    jejak.push({x:sp(pmx+(mx-pmx)*f,2),y:sp(pmy+(my-pmy)*f,2),vx:(Math.random()-0.5)*mouseSpeed*0.2,vy:(Math.random()-0.5)*mouseSpeed*0.2,s:4,c:rn(),a:1,fade:0.05+Math.random()*0.04});
  }
  if(mouseSpeed>18) shockwave.push({x:mx,y:my,r:0,maxR:mouseSpeed*5,a:0.6,c:rn(),spd:7});
});
document.addEventListener('click',function(e){
  var cx=e.clientX,cy=e.clientY;
  portal.push({x:cx,y:cy,r:0,maxR:260,a:1,c:rn(),t:0});
  for(var w=0;w<8;w++) shockwave.push({x:cx,y:cy,r:w*18,maxR:380+w*55,a:1-w*0.1,c:NEON[w%NEON.length],spd:4+w*2});
  for(var i=0;i<280;i++){
    var ang=Math.random()*Math.PI*2,spd=0.5+Math.random()*14,sz=(Math.floor(Math.random()*3)+1)*4;
    ledakan.push({x:cx,y:cy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,s:sz,c:rn(),a:1,fade:0.005+Math.random()*0.015,grav:0.03+Math.random()*0.09});
  }
  for(var j=0;j<partikel.length;j++){
    var p=partikel[j],dx=cx-p.x,dy=cy-p.y,d=Math.sqrt(dx*dx+dy*dy)||1;
    if(d<380){var ff=(380-d)/380*20; p.vx+=(dx/d)*ff; p.vy+=(dy/d)*ff;}
  }
});
document.addEventListener('contextmenu',function(e){
  e.preventDefault();
  for(var i=0;i<4;i++) meteor.push({x:e.clientX,y:e.clientY,vx:(2+Math.random()*5)*(Math.random()<0.5?1:-1),vy:1.5+Math.random()*4,len:8+Math.floor(Math.random()*8),c:rn(),a:1});
});

function animasi(){
  tick++;
  ctx.fillStyle=BGC;
  ctx.fillRect(0,0,W,H);
  if(tick%3===0){
    ctx.globalAlpha=0.06; ctx.strokeStyle=nc(NEON[0]); ctx.lineWidth=1;
    var G=40;
    for(var gx=0;gx<W;gx+=G){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
    for(var gy=0;gy<H;gy+=G){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}
    ctx.globalAlpha=1;
  }
  snake[0].x+=(mx-snake[0].x)*0.12; snake[0].y+=(my-snake[0].y)*0.12;
  for(var si=1;si<snake.length;si++){snake[si].x+=(snake[si-1].x-snake[si].x)*0.6; snake[si].y+=(snake[si-1].y-snake[si].y)*0.6;}
  for(var si2=0;si2<snake.length;si2++) gpx(snake[si2].x,snake[si2].y,Math.max(2,(1-si2/snake.length)*8),NEON[si2%NEON.length],(1-si2/snake.length)*0.9);
  for(var i=0;i<partikel.length;i++){
    var p=partikel[i],dx=mx-p.x,dy=my-p.y,d=Math.sqrt(dx*dx+dy*dy)||1;
    if(d<50){p.vx-=(dx/d)*0.15;p.vy-=(dy/d)*0.15;}
    else if(d<150){var ff=(150-d)/150;p.vx+=(dx/d)*0.018*ff;p.vy+=(dy/d)*0.018*ff;p.vx+=(-dy/d)*0.006*ff;p.vy+=(dx/d)*0.006*ff;}
    p.vx*=0.97;p.vy*=0.97;p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    p.fase+=p.spd;
    gpx(p.x,p.y,p.s,p.c,p.a*(0.4+Math.abs(Math.sin(p.fase))*0.6));
  }
  for(var a=0;a<partikel.length;a++){
    var pa=partikel[a]; if(Math.sqrt((mx-pa.x)*(mx-pa.x)+(my-pa.y)*(my-pa.y))>160) continue;
    for(var b=a+1;b<partikel.length;b++){
      var pb=partikel[b]; if(Math.sqrt((mx-pb.x)*(mx-pb.x)+(my-pb.y)*(my-pb.y))>160) continue;
      var ld=Math.sqrt((pa.x-pb.x)*(pa.x-pb.x)+(pa.y-pb.y)*(pa.y-pb.y));
      if(ld<65){ctx.globalAlpha=(1-ld/65)*0.3;ctx.strokeStyle=nc(pa.c);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();ctx.globalAlpha=1;}
    }
  }
  for(var mi=meteor.length-1;mi>=0;mi--){
    var m=meteor[mi];
    for(var ml=0;ml<m.len;ml++) gpx(m.x-m.vx*ml,m.y-m.vy*ml,4,m.c,m.a*(1-ml/m.len));
    m.x+=m.vx;m.y+=m.vy;
    if(m.x>W+50||m.y>H+50){m.x=Math.random()<0.5?-10:Math.random()*W;m.y=m.x<0?Math.random()*H:-10;m.c=rn();}
  }
  for(var poi=portal.length-1;poi>=0;poi--){
    var po=portal[poi];po.t++;po.r+=7;po.a-=0.02;
    for(var ring=0;ring<5;ring++){
      var rr=po.r-ring*16;if(rr<=0)continue;
      for(var dg=0;dg<360;dg+=5){
        var rd=dg*Math.PI/180;
        ctx.globalAlpha=Math.max(0,po.a-ring*0.18);ctx.fillStyle=nc(NEON[(ring+tick)%NEON.length]);
        ctx.shadowBlur=8;ctx.shadowColor=nc(po.c);
        ctx.fillRect(sp(po.x+Math.cos(rd+tick*0.05)*rr,4),sp(po.y+Math.sin(rd+tick*0.05)*rr,4),4,4);
        ctx.shadowBlur=0;
      }
    }
    ctx.globalAlpha=1;
    if(po.a<=0||po.r>po.maxR)portal.splice(poi,1);
  }
  for(var swi=shockwave.length-1;swi>=0;swi--){
    var sw=shockwave[swi];sw.r+=sw.spd;sw.a-=0.022;
    var stp=Math.max(3,Math.floor(sw.r/18));
    for(var dg2=0;dg2<360;dg2+=stp){
      var rd2=dg2*Math.PI/180;
      ctx.globalAlpha=Math.max(0,sw.a);ctx.fillStyle=nc(sw.c);
      ctx.shadowBlur=6;ctx.shadowColor=nc(sw.c);
      ctx.fillRect(sp(sw.x+Math.cos(rd2)*sw.r,4),sp(sw.y+Math.sin(rd2)*sw.r,4),4,4);
      ctx.shadowBlur=0;
    }
    ctx.globalAlpha=1;
    if(sw.a<=0||sw.r>sw.maxR)shockwave.splice(swi,1);
  }
  for(var ji=jejak.length-1;ji>=0;ji--){
    var t=jejak[ji];gpx(t.x,t.y,t.s,t.c,t.a);
    t.x+=t.vx;t.y+=t.vy;t.vy+=0.05;t.vx*=0.96;t.vy*=0.96;t.a-=t.fade;
    if(t.a<=0)jejak.splice(ji,1);
  }
  for(var li=ledakan.length-1;li>=0;li--){
    var lp=ledakan[li];
    gpx(lp.x-lp.vx,lp.y-lp.vy,lp.s,lp.c,lp.a*0.4);
    gpx(lp.x,lp.y,lp.s,lp.c,lp.a);
    lp.x+=lp.vx;lp.y+=lp.vy;lp.vy+=lp.grav;lp.vx*=0.99;lp.a-=lp.fade;
    if(lp.a<=0)ledakan.splice(li,1);
  }
  for(var cg=0;cg<16;cg++){
    var rad=(cg/16)*Math.PI*2+(tick*0.05);
    var cr=22+Math.sin(tick*0.08+cg)*7;
    ctx.shadowBlur=10;ctx.shadowColor=nc(NEON[cg%NEON.length]);
    ctx.globalAlpha=0.6+Math.sin(tick*0.15+cg)*0.3;
    ctx.fillStyle=nc(NEON[cg%NEON.length]);
    ctx.fillRect(sp(mx+Math.cos(rad)*cr,2),sp(my+Math.sin(rad)*cr,2),4,4);
    ctx.shadowBlur=0;ctx.globalAlpha=1;
  }
  requestAnimationFrame(animasi);
}
window.addEventListener('resize',function(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;initAll();});
initAll();
animasi();

var namaHari  = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
var namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function updateTanggal() {
  var sekarang  = new Date();
  var hari      = namaHari[sekarang.getDay()];
  var tanggal   = sekarang.getDate();
  var bulan     = namaBulan[sekarang.getMonth()];
  var tahun     = sekarang.getFullYear();

  tanggalEl.textContent = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;

  var tanggalLahir = new Date(2026, 6, 14);
  var selisihMs    = sekarang - tanggalLahir;
  var selisihHari  = Math.floor(selisihMs / (1000 * 60 * 60 * 24));

  umurWebEl.textContent = 'Web ini sudah berjalan selama ' + selisihHari + ' hari';
}

updateTanggal();
setInterval(updateTanggal, 60000);

document.getElementById('tahun-copyright').textContent = new Date().getFullYear();

var suaraCheckboxAudio = new Audio('sound.se/freesound_community-music-box-98027.mp3');
suaraCheckboxAudio.volume = 0.6;

var suaraHapusAudio = new Audio('sound.se/freesound_community-crumple-03-40747.mp3');
suaraHapusAudio.volume = 0.6;

var suaraAlarmAudio = new Audio('sound.se/taureon-clip_10_drippling_drops_short-3060.mp3');
suaraAlarmAudio.volume = 0.8;

var suaraTombolAudio = new Audio('sound.se/universfield-bubble-pop-293342.mp3');
suaraTombolAudio.volume = 0.5;

var alarmId         = null;
var alarmAktif      = false; 

function mulaiAlarm() {
  if (alarmAktif) return; 
  alarmAktif = true;

  suaraAlarmAudio.currentTime = 0;
  suaraAlarmAudio.play();

  alarmId = setInterval(function () {
    suaraAlarmAudio.currentTime = 0;
    suaraAlarmAudio.play();
  }, 5000);
}

function hentikanAlarm() {
  if (alarmId !== null) {
    clearInterval(alarmId);
    alarmId = null;
  }
  alarmAktif = false;
  suaraAlarmAudio.pause();
  suaraAlarmAudio.currentTime = 0;
}

function suaraCheckbox() {
  suaraCheckboxAudio.currentTime = 0;
  suaraCheckboxAudio.play();
}

function suaraHapus() {
  suaraHapusAudio.currentTime = 0;
  suaraHapusAudio.play();
}

function suaraTombol() {
  suaraTombolAudio.currentTime = 0;
  suaraTombolAudio.play();
}

var jam = new Date().getHours();

var TEMA = {
  pagi: {
    bg:        '#fff8f0',
    bgCanvas:  'rgba(255,248,240,0.18)',
    surface:   'rgba(255,245,230,0.9)',
    border:    '#f97316',
    teks:      '#7c2d12',
    aksen:     '#f97316',
    neon: [
      [255,165,0],[255,120,50],[255,200,50],
      [255,80,0],[255,230,100],[230,100,0],
      [255,140,20],[200,80,0],[255,190,80]
    ]
  },
  siang: {
    bg:        '#f0f9ff',
    bgCanvas:  'rgba(240,249,255,0.18)',
    surface:   'rgba(224,242,254,0.9)',
    border:    '#0284c7',
    teks:      '#0c4a6e',
    aksen:     '#0ea5e9',
    neon: [
      [0,200,255],[50,150,255],[100,230,255],
      [0,160,220],[80,200,255],[0,120,200],
      [0,180,240],[40,180,255],[100,210,255]
    ]
  },
  sore: {
    bg:        '#fff1f2',
    bgCanvas:  'rgba(255,241,242,0.18)',
    surface:   'rgba(254,226,226,0.9)',
    border:    '#e11d48',
    teks:      '#881337',
    aksen:     '#f43f5e',
    neon: [
      [255,80,120],[255,120,60],[255,60,100],
      [255,160,50],[220,50,100],[255,100,80],
      [255,40,80],[200,60,120],[255,140,100]
    ]
  },
  malam: {
    bg:        '#050510',
    bgCanvas:  'rgba(5,5,16,0.18)',
    surface:   'rgba(15,15,40,0.85)',
    border:    '#2e3270',
    teks:      '#e0e7ff',
    aksen:     '#6366f1',
    neon: [
      [0,255,200],[0,200,255],[180,0,255],
      [255,0,180],[255,220,0],[0,255,100],
      [255,80,0],[80,255,255],[200,255,0]
    ]
  }
};

function getTema() {
  if (jam >= 5  && jam < 12) return TEMA.pagi;
  if (jam >= 12 && jam < 15) return TEMA.siang;
  if (jam >= 15 && jam < 19) return TEMA.sore;
  return TEMA.malam;
}

function terapkanTema() {
  var t = getTema();
  document.body.style.backgroundColor = t.bg;
  document.body.style.color = t.teks;

  var sections = document.querySelectorAll('section');
  for (var i = 0; i < sections.length; i++) {
    sections[i].style.backgroundColor = t.surface;
    sections[i].style.borderColor = t.border;
  }

  NEON = t.neon;

  BGC = t.bgCanvas;
}

var BGC = 'rgba(5,5,16,0.18)'; 
terapkanTema();

if (jam >= 5 && jam < 12) {
  greetingEl.textContent = 'Selamat Pagi';
} else if (jam >= 12 && jam < 15) {
  greetingEl.textContent = 'Selamat Siang';
} else if (jam >= 15 && jam < 19) {
  greetingEl.textContent = 'Selamat Sore';
} else {
  greetingEl.textContent = 'Selamat Malam';
}

function updateJam() {
  var sekarang = new Date();
  var hh = String(sekarang.getHours()).padStart(2, '0');
  var mm = String(sekarang.getMinutes()).padStart(2, '0');
  var ss = String(sekarang.getSeconds()).padStart(2, '0');
  clockEl.textContent = hh + ':' + mm + ':' + ss;
}

updateJam();
setInterval(updateJam, 1000);

var sisaWaktu    = 25 * 60;
var durasiWaktu  = 25 * 60;
var timerId      = null;
var waktuMulai   = null; 
var sisaWaktuPause = 25 * 60; 

var displayWaktu = document.getElementById('time');
var statusTimer  = document.getElementById('timer-status');
var inputMenit   = document.getElementById('input-menit');

function tampilkanWaktu() {
  var menit = Math.floor(sisaWaktu / 60);
  var detik = sisaWaktu % 60;
  displayWaktu.textContent = menit + ':' + String(detik).padStart(2, '0');
}

document.getElementById('timer-form').addEventListener('submit', function (e) {
  e.preventDefault();

  if (timerId !== null) {
    statusTimer.textContent = 'Hentikan timer sebelum mengubah durasi.';
    return;
  }

  var nilai = parseInt(inputMenit.value, 10);

  if (isNaN(nilai) || nilai < 1 || nilai > 120) {
    statusTimer.textContent = 'Durasi harus antara 1 hingga 120 menit.';
    return;
  }

  suaraTombol();
  durasiWaktu      = nilai * 60;
  sisaWaktu        = durasiWaktu;
  sisaWaktuPause   = durasiWaktu;
  tampilkanWaktu();
  statusTimer.textContent = 'Durasi diatur: ' + nilai + ' menit. Siap fokus.';
});

document.getElementById('start').addEventListener('click', function () {
  if (timerId !== null) return;
  suaraTombol();

  waktuMulai = Date.now() - ((durasiWaktu - sisaWaktuPause) * 1000);

  statusTimer.textContent = 'Sedang berjalan...';

  timerId = setInterval(function () {
    var terlewat = Math.floor((Date.now() - waktuMulai) / 1000);
    sisaWaktu = durasiWaktu - terlewat;

    if (sisaWaktu <= 0) {
      sisaWaktu = 0;
      tampilkanWaktu();
      clearInterval(timerId);
      timerId = null;
      statusTimer.textContent = 'Sesi selesai. Silakan istirahat.';
      mulaiAlarm();
      kirimNotifikasi('Sesi fokus selesai!', 'Waktunya istirahat. Kerja bagus!');
      return;
    }

    tampilkanWaktu();
  }, 500); 
});

document.getElementById('stop').addEventListener('click', function () {
  if (timerId === null && !alarmAktif) return;
  suaraTombol();
  clearInterval(timerId);
  timerId = null;
  sisaWaktuPause = sisaWaktu;
  hentikanAlarm();
  statusTimer.textContent = 'Dijeda';
});

document.getElementById('reset').addEventListener('click', function () {
  suaraTombol();
  clearInterval(timerId);
  timerId        = null;
  hentikanAlarm();
  sisaWaktu      = durasiWaktu;
  sisaWaktuPause = durasiWaktu;
  waktuMulai     = null;
  tampilkanWaktu();
  statusTimer.textContent = 'Siap fokus';
});

var inputTugas    = document.getElementById('todo-input');
var inputDeadline = document.getElementById('todo-deadline');
var listTugas     = document.getElementById('todo-list');
var pesanKosong   = document.getElementById('todo-empty');

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

function kirimNotifikasi(judul, pesan) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(judul, { body: pesan, icon: 'favicon.svg' });
  }
}

var deadlineYangSudahBerbunyi = {}; 

function cekDeadlineTugas() {
  var todos    = ambilTugas();
  var sekarang = new Date();

  for (var i = 0; i < todos.length; i++) {
    var tugas = todos[i];

    if (tugas.selesai || !tugas.deadline) continue;

    var waktuDeadline = new Date(tugas.deadline);
    var selisihMs     = waktuDeadline - sekarang;
    var selisihMenit  = Math.floor(selisihMs / 60000);

    if (selisihMenit <= 10 && selisihMenit > 0 && !deadlineYangSudahBerbunyi[tugas.id + '_10']) {
      deadlineYangSudahBerbunyi[tugas.id + '_10'] = true;
      suaraAlarmAudio.currentTime = 0;
      suaraAlarmAudio.play();
      kirimNotifikasi(
        'Deadline dalam 10 menit!',
        'Tugas: ' + tugas.teks
      );
    }

    if (selisihMenit <= 0 && selisihMenit > -1 && !deadlineYangSudahBerbunyi[tugas.id + '_0']) {
      deadlineYangSudahBerbunyi[tugas.id + '_0'] = true;
      mulaiAlarm();
      kirimNotifikasi(
        'Deadline tiba!',
        'Tugas "' + tugas.teks + '" harus diselesaikan sekarang!'
      );
    }
  }
}

setInterval(cekDeadlineTugas, 30000);

function ambilTugas() {
  var data = localStorage.getItem('todos');

  if (!data) return [];

  var hasil;
  try {
    hasil = JSON.parse(data);
  } catch (e) {
    console.warn('Data localStorage tidak valid. Data direset.');
    localStorage.removeItem('todos');
    return [];
  }

  if (!Array.isArray(hasil)) {
    console.warn('Format data tidak dikenali. Data direset.');
    localStorage.removeItem('todos');
    return [];
  }

  var valid = hasil.filter(function (item) {
    return (
      item !== null &&
      typeof item === 'object' &&
      typeof item.teks === 'string' &&
      typeof item.selesai === 'boolean'
    );
  });

  return valid;
}

function simpanTugas(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function tampilkanTugas() {
  var todos = ambilTugas();

  listTugas.innerHTML = '';

  if (todos.length === 0) {
    pesanKosong.style.display = 'block';
    return;
  }

  pesanKosong.style.display = 'none';

  for (var i = 0; i < todos.length; i++) {
    (function (index) {
      var tugas = todos[index];

      var li = document.createElement('li');

      var checkbox = document.createElement('input');
      checkbox.type    = 'checkbox';
      checkbox.checked = tugas.selesai;

      checkbox.addEventListener('change', function () {
        suaraCheckbox();
        todos[index].selesai = checkbox.checked;
        simpanTugas(todos);
        tampilkanTugas();
      });

      var teks = document.createElement('span');
      teks.textContent = tugas.teks;
      if (tugas.selesai) {
        teks.className = 'selesai';
      }

      var infoDeadline = document.createElement('span');
      if (tugas.deadline) {
        var tglDeadline = new Date(tugas.deadline);
        var tgl  = tglDeadline.getDate();
        var bln  = namaBulan[tglDeadline.getMonth()];
        var thn  = tglDeadline.getFullYear();
        var jam  = String(tglDeadline.getHours()).padStart(2, '0');
        var mnt  = String(tglDeadline.getMinutes()).padStart(2, '0');

        var sudahLewat = (new Date() > tglDeadline) && !tugas.selesai;
        infoDeadline.className = sudahLewat ? 'deadline deadline--lewat' : 'deadline';
        infoDeadline.textContent = tgl + ' ' + bln + ' ' + thn + ' ' + jam + ':' + mnt;
      }

      var hapus = document.createElement('button');
      hapus.textContent = 'Hapus';
      hapus.className   = 'tombol-hapus';

      hapus.addEventListener('click', function () {
        suaraHapus();
        todos.splice(index, 1);
        simpanTugas(todos);
        tampilkanTugas();
      });

      li.appendChild(checkbox);
      li.appendChild(teks);
      if (tugas.deadline) { li.appendChild(infoDeadline); }
      li.appendChild(hapus);
      listTugas.appendChild(li);
    })(i);
  }
}

function tambahTugas() {
  var teks = inputTugas.value.trim();

  if (teks === '') return;

  if (teks.length > 200) {
    alert('Tugas terlalu panjang. Maksimal 200 karakter.');
    return;
  }

  var todos = ambilTugas();

  if (todos.length >= 100) {
    alert('Daftar tugas sudah penuh. Hapus beberapa tugas terlebih dahulu.');
    return;
  }

  todos.push({ 
    id:       Date.now(),
    teks:     teks, 
    selesai:  false,
    deadline: inputDeadline.value
  });
  simpanTugas(todos);

  inputTugas.value    = '';
  inputDeadline.value = '';
  tampilkanTugas();
}

document.getElementById('todo-form').addEventListener('submit', function (e) {
  e.preventDefault();
  suaraTombol();
  tambahTugas();
});

tampilkanTugas();
