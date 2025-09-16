import * as THREE from 'three';

let scene, camera, renderer, ocean, stars, rain, light, ufos = [], time = 0;

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x051a1e);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, -200, 400);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Eerie red lighting for 1980s horror
  light = new THREE.PointLight(0x8B0000, 0.5, 1000);
  light.position.set(0, 0, 200);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0x2F1B14, 0.2);
  scene.add(ambient);

  // Add fog for horror atmosphere
  scene.fog = new THREE.Fog(0x000000, 100, 1000);

  // Distant planet
  const planetGeometry = new THREE.SphereGeometry(200, 32, 32);
  const planetMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513, emissive: 0x2F1B14 });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.set(500, 0, -800);
  scene.add(planet);

  // Dense stars for space
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  for (let i = 0; i < 1000; i++) {
    starPositions.push(
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 3000
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Meteors/Debris for horror
  const debrisGeometry = new THREE.BufferGeometry();
  const debrisPositions = [];
  for (let i = 0; i < 300; i++) {
    debrisPositions.push(
      (Math.random() - 0.5) * 1500,
      Math.random() * -1000,
      (Math.random() - 0.5) * 1500
    );
  }
  debrisGeometry.setAttribute('position', new THREE.Float32BufferAttribute(debrisPositions, 3));
  const debrisMaterial = new THREE.PointsMaterial({ color: 0x8B0000, size: 2 });
  rain = new THREE.Points(debrisGeometry, debrisMaterial);
  scene.add(rain);

  // Alien UFOs for horror
  for (let i = 0; i < 10; i++) {
    const ufoGroup = new THREE.Group();
    // Saucer body
    const bodyGeometry = new THREE.CylinderGeometry(20, 20, 8, 16);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2F1B14, emissive: 0x1a0d0a });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    ufoGroup.add(body);
    // Dome
    const domeGeometry = new THREE.SphereGeometry(10, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000, emissive: 0x4B0000 });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 6;
    ufoGroup.add(dome);
    // Red lights
    for (let j = 0; j < 8; j++) {
      const lightGeometry = new THREE.SphereGeometry(1.5, 8, 8);
      const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
      const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
      lightMesh.position.set(Math.cos(j * Math.PI / 4) * 15, -3, Math.sin(j * Math.PI / 4) * 15);
      ufoGroup.add(lightMesh);
    }
    ufoGroup.position.set(
      (Math.random() - 0.5) * 800,
      50 + Math.random() * 150,
      (Math.random() - 0.5) * 800
    );
    ufoGroup.userData.speed = { x: (Math.random() - 0.5) * 1.5, z: (Math.random() - 0.5) * 1.5 };
    ufos.push(ufoGroup);
    scene.add(ufoGroup);
  }

  // Generate necromantic horror music inspired by Jörg Buttgereit's Nekromantik
  let audioStarted = false;
  const startAudio = () => {
    if (audioStarted) return;
    audioStarted = true;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator1 = audioContext.createOscillator(); // Bass drone
    const oscillator2 = audioContext.createOscillator(); // High dissonance
    const noise = audioContext.createBufferSource(); // Industrial noise
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();


    // Bass oscillator
    oscillator1.frequency.setValueAtTime(40, audioContext.currentTime);
    oscillator1.type = 'square';
    // High oscillator for dissonance
    oscillator2.frequency.setValueAtTime(120, audioContext.currentTime);
    oscillator2.type = 'sawtooth';
    // Cthulhu ambient: deep rumble
    const oscillator3 = audioContext.createOscillator();
    oscillator3.frequency.setValueAtTime(20, audioContext.currentTime);
    oscillator3.type = 'sine';
    // Tragic and mysterious melancholic piano
    const pianoOsc = audioContext.createOscillator();
    const pianoGain = audioContext.createGain();
    const delay = audioContext.createDelay(2); // Delay for mystery
    const delayGain = audioContext.createGain();
    pianoOsc.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
    pianoOsc.type = 'sine';
    pianoGain.gain.setValueAtTime(0, audioContext.currentTime);
    pianoGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1); // Very dominant
    pianoGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 6);
    delay.delayTime.setValueAtTime(1.5, audioContext.currentTime);
    delayGain.gain.setValueAtTime(0.4, audioContext.currentTime); // Stronger echo
    pianoOsc.connect(pianoGain);
    pianoGain.connect(audioContext.destination);
    pianoGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(audioContext.destination);
    pianoOsc.start();
    // Very sad low notes
    const notes = [130.81, 123.47, 116.54, 110.00, 103.83, 98.00]; // C2 B1 Bb1 A1 Ab1 G1
    let noteIndex = 0;
    setInterval(() => {
      pianoOsc.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
      pianoGain.gain.setValueAtTime(0, audioContext.currentTime);
      pianoGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.5);
      pianoGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 6);
      noteIndex = (noteIndex + 1) % notes.length;
    }, 2000); // More frequent

    // Noise for industrial feel
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    noise.loop = true;

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    oscillator3.connect(filter);
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Master reverb for realistic sci-fi sound
    const masterDelay = audioContext.createDelay(2);
    const masterDelayGain = audioContext.createGain();
    masterDelay.delayTime.setValueAtTime(1, audioContext.currentTime);
    masterDelayGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.connect(masterDelay);
    masterDelay.connect(masterDelayGain);
    masterDelayGain.connect(audioContext.destination);

    // Space orchestra: melancholic pads
    const padOsc1 = audioContext.createOscillator();
    const padOsc2 = audioContext.createOscillator();
    const padOsc3 = audioContext.createOscillator();
    const padGain = audioContext.createGain();
    padOsc1.frequency.setValueAtTime(130.81, audioContext.currentTime); // C3
    padOsc1.type = 'sawtooth';
    padOsc2.frequency.setValueAtTime(155.56, audioContext.currentTime); // Eb3
    padOsc2.type = 'sawtooth';
    padOsc3.frequency.setValueAtTime(185.00, audioContext.currentTime); // F3
    padOsc3.type = 'sawtooth';
    padGain.gain.setValueAtTime(0.01, audioContext.currentTime);
    // Slow melancholic swell
    padGain.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 10);
    padGain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 20);
    padOsc1.connect(padGain);
    padOsc2.connect(padGain);
    padOsc3.connect(padGain);
    padGain.connect(filter);

    oscillator1.start();
    oscillator2.start();
    oscillator3.start();
    noise.start();
    padOsc1.start();
    padOsc2.start();
    padOsc3.start();

    // Dominant sad psychedelic guitar: space and dream related
    const guitarOsc = audioContext.createOscillator();
    const guitarGain = audioContext.createGain();
    const guitarFilter = audioContext.createBiquadFilter();
    const guitarDelay = audioContext.createDelay(0.5);
    const guitarDelayGain = audioContext.createGain();
    guitarOsc.frequency.setValueAtTime(196.00, audioContext.currentTime); // G3
    guitarOsc.type = 'sawtooth';
    guitarFilter.type = 'lowpass';
    guitarFilter.frequency.setValueAtTime(800, audioContext.currentTime);
    guitarDelay.delayTime.setValueAtTime(0.3, audioContext.currentTime);
    guitarDelayGain.gain.setValueAtTime(0.4, audioContext.currentTime);
    guitarGain.gain.setValueAtTime(0, audioContext.currentTime);
    guitarGain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.5);
    guitarGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 5);
    guitarOsc.connect(guitarFilter);
    guitarFilter.connect(guitarGain);
    guitarGain.connect(audioContext.destination);
    guitarGain.connect(guitarDelay);
    guitarDelay.connect(guitarDelayGain);
    guitarDelayGain.connect(audioContext.destination);
    guitarOsc.start();
    // Dreamy psychedelic melody
    const guitarNotes = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63]; // G A B C D E
    let guitarIndex = 0;
    setInterval(() => {
      guitarOsc.frequency.setValueAtTime(guitarNotes[guitarIndex], audioContext.currentTime);
      guitarGain.gain.setValueAtTime(0, audioContext.currentTime);
      guitarGain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.5);
      guitarGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 5);
      guitarIndex = (guitarIndex + 1) % guitarNotes.length;
    }, 5000);
  };

  // Start audio on user interaction
  document.addEventListener('click', startAudio);
  document.addEventListener('keydown', startAudio);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  time += 0.05;

  // Update debris
  const debrisPositions = rain.geometry.attributes.position.array;
  for (let i = 0; i < debrisPositions.length; i += 3) {
    debrisPositions[i + 1] += 2;
    if (debrisPositions[i + 1] > 100) {
      debrisPositions[i + 1] = Math.random() * -1000;
      debrisPositions[i] = (Math.random() - 0.5) * 1500;
      debrisPositions[i + 2] = (Math.random() - 0.5) * 1500;
    }
  }
  rain.geometry.attributes.position.needsUpdate = true;

  // Move UFOs with horror wobble
  ufos.forEach(ufo => {
    ufo.position.x += ufo.userData.speed.x;
    ufo.position.z += ufo.userData.speed.z;
    ufo.position.y += Math.sin(time + ufo.position.x * 0.01) * 0.5;
    ufo.rotation.y += 0.02;
    // Bounce off edges
    if (ufo.position.x > 400 || ufo.position.x < -400) ufo.userData.speed.x *= -1;
    if (ufo.position.z > 400 || ufo.position.z < -400) ufo.userData.speed.z *= -1;
  });

  // Pulsating red light for horror
  light.intensity = 0.5 + Math.sin(time * 2) * 0.3;

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();