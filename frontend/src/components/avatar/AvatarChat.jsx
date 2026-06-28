'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { RiSendPlaneLine, RiMicLine, RiMicOffLine, RiLoader4Line, RiVolumeUpLine, RiVolumeMuteLine } from 'react-icons/ri';

export default function AvatarChat() {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const currentActionRef = useRef(null);
  const morphMeshesRef = useRef([]);
  const lipSyncRef = useRef(null);
  const lastTimeRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animIdRef = useRef(null);
  const threeRef = useRef(null);
  const vrmRef = useRef(null);

  // Procedural arm animation state
  const animStateRef = useRef('Idle'); // 'Idle' | 'Wave' | 'Talking'
  const animTimerRef = useRef(0);
  const currentArmPoseRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: 'avatar', text: "Hi! I'm Iris, your AI learning assistant! Ask me anything — I'll help you learn. ✨" }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Loading avatar...');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [avatarReady, setAvatarReady] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Three.js Setup ──
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const THREE = await import('three');
      threeRef.current = THREE;
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { VRMLoaderPlugin } = await import('@pixiv/three-vrm');
      lastTimeRef.current = performance.now();

      const container = mountRef.current;
      if (!container || cancelled) return;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Scene with light cream background
      const scene = new THREE.Scene();
      // scene.background = new THREE.Color(0xfff8f0);
      sceneRef.current = scene;

      // Camera — portrait framing for upper body
      const camera = new THREE.PerspectiveCamera(
        30,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 1.45, 3.2);
      camera.lookAt(0, 1.05, 0);
      cameraRef.current = camera;

      // Lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
      keyLight.position.set(2, 3, 3);
      keyLight.castShadow = true;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x7c3aed, 0.4);
      fillLight.position.set(-2, 1.5, -1);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x4d96ff, 0.3);
      rimLight.position.set(0, 2, -3);
      scene.add(rimLight);

      // Optional ground plane (subtle)
      const groundGeo = new THREE.CircleGeometry(2, 32);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.8,
        transparent: true,
        opacity: 0.5,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      scene.add(ground);

      // Load avatar with VRM plugin for proper bone handling
      const loader = new GLTFLoader();
      loader.register((parser) => new VRMLoaderPlugin(parser));

      loader.load(
        '/3d-model/avatar.glb',
        (gltf) => {
          if (cancelled) return;
          const vrm = gltf.userData.vrm;
          const avatar = vrm ? vrm.scene : gltf.scene;

          if (vrm) {
            vrmRef.current = vrm;
            console.log('[AvatarChat] VRM model loaded successfully');
          } else {
            console.log('[AvatarChat] Loaded as standard GLTF (no VRM data)');
          }

          // Center the avatar
          const box = new THREE.Box3().setFromObject(avatar);
          const center = box.getCenter(new THREE.Vector3());
          avatar.position.x -= center.x;
          avatar.position.y -= box.min.y;
          scene.add(avatar);

          // Collect morph target meshes for lip sync
          avatar.traverse((node) => {
            if (node.isMesh && node.morphTargetDictionary) {
              morphMeshesRef.current.push(node);
            }
          });

          // Setup animation mixer — play ALL tracks unfiltered
          const mixer = new THREE.AnimationMixer(avatar);
          mixerRef.current = mixer;

          if (gltf.animations && gltf.animations.length > 0) {
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              actionsRef.current[clip.name] = action;
              console.log('[AvatarChat] Registered animation:', clip.name, '— tracks:', clip.tracks.length);
            });

            // Play Idle immediately
            const idleAction = findAction('Idle');
            if (idleAction) {
              idleAction.reset();
              idleAction.setLoop(THREE.LoopRepeat, Infinity);
              idleAction.clampWhenFinished = false;
              idleAction.enabled = true;
              idleAction.setEffectiveWeight(1.0);
              idleAction.play();
              currentActionRef.current = idleAction;
            }
          }

          setAvatarReady(true);
          setStatus('Ready');

          // Greeting: speak only, no wave on load
          setTimeout(() => {
            setAnimState('Idle');
            if (ttsEnabled) {
              startLipSync();
              speakText("Hi! I'm Iris, your AI assistant! How can I help you today?", () => {
                stopLipSync();
                setAnimState('Idle');
              });
            }
          }, 800);
        },
        (progress) => {
          if (progress.total > 0) {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            setStatus(`Loading avatar... ${pct}%`);
          }
        },
        (error) => {
          console.error('Avatar load error:', error);
          setStatus('Avatar load failed');
          setAvatarReady(true);
        }
      );

      // ── Animation loop ──
      const animate = () => {
        animIdRef.current = requestAnimationFrame(animate);
        const now = performance.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        const t = now / 1000;

        // 1. Update the animation mixer (plays base body animation)
        if (mixerRef.current) mixerRef.current.update(delta);

        // 2. Override arm bones AFTER the mixer to fix the T-pose
        applyArmPose(t, delta, THREE);

        // 3. Update VRM (spring bones for hair/clothing physics)
        if (vrmRef.current) vrmRef.current.update(delta);

        // 4. Render
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
      };
    };

    init();

    return () => {
      cancelled = true;
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        const canvas = rendererRef.current.domElement;
        canvas?.parentNode?.removeChild(canvas);
      }
      stopLipSync();
      // Clean up Smallest.ai Web Audio
      if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch (e) {}
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Arm Pose Override ──
  // This function runs AFTER mixer.update() each frame to correct the T-pose arms.
  // The GLB animations have the arms locked in T-pose (confirmed via binary analysis).
  // We override UpperArm and LowerArm with correct rotations.
  const applyArmPose = useCallback((t, delta, THREE) => {
    if (!vrmRef.current && !mixerRef.current) return;

    // Get bone references — try VRM humanoid API first, then fall back to scene traversal
    let leftUpperArm, rightUpperArm, leftLowerArm, rightLowerArm, leftHand, rightHand;

    const vrm = vrmRef.current;
    if (vrm && vrm.humanoid) {
      leftUpperArm = vrm.humanoid.getRawBoneNode('leftUpperArm');
      rightUpperArm = vrm.humanoid.getRawBoneNode('rightUpperArm');
      leftLowerArm = vrm.humanoid.getRawBoneNode('leftLowerArm');
      rightLowerArm = vrm.humanoid.getRawBoneNode('rightLowerArm');
      leftHand = vrm.humanoid.getRawBoneNode('leftHand');
      rightHand = vrm.humanoid.getRawBoneNode('rightHand');
    }

    // Fallback: find bones by name in scene
    if (!leftUpperArm) {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.traverse((node) => {
        if (!node.isBone) return;
        switch (node.name) {
          case 'J_Bip_L_UpperArm': leftUpperArm = node; break;
          case 'J_Bip_R_UpperArm': rightUpperArm = node; break;
          case 'J_Bip_L_LowerArm': leftLowerArm = node; break;
          case 'J_Bip_R_LowerArm': rightLowerArm = node; break;
          case 'J_Bip_L_Hand': leftHand = node; break;
          case 'J_Bip_R_Hand': rightHand = node; break;
        }
      });
    }

    if (!leftUpperArm || !rightUpperArm) return;

    const state = animStateRef.current;
    const Q = THREE.Quaternion;
    const V = THREE.Vector3;

    // Initialize our persistent pose state for smooth slerping
    if (!currentArmPoseRef.current) {
      currentArmPoseRef.current = {
        leftUpperArm: new Q(), rightUpperArm: new Q(),
        leftLowerArm: new Q(), rightLowerArm: new Q(),
        rightHand: new Q(),
        initialized: false
      };
    }
    const curPose = currentArmPoseRef.current;

    // ── Target Quaternions ──
    const targetLeftUpperArm = new Q();
    const targetRightUpperArm = new Q();
    const targetLeftLowerArm = new Q();
    const targetRightLowerArm = new Q();
    const targetRightHand = new Q();

    // Arms-down pose quaternions (base)
    const leftArmDown = new Q().setFromAxisAngle(new V(0, 0, 1), -1.2);
    const rightArmDown = new Q().setFromAxisAngle(new V(0, 0, 1), 1.2);
    const leftElbowBend = new Q().setFromAxisAngle(new V(0, 1, 0), 0.15);
    const rightElbowBend = new Q().setFromAxisAngle(new V(0, 1, 0), -0.15);

    // Breathing: very subtle shoulder movement
    const breathAmt = Math.sin(t * 1.5) * 0.02;
    const breathL = new Q().setFromAxisAngle(new V(0, 0, 1), breathAmt);
    const breathR = new Q().setFromAxisAngle(new V(0, 0, 1), -breathAmt);

    if (state === 'Idle') {
      targetLeftUpperArm.copy(leftArmDown).multiply(breathL);
      targetRightUpperArm.copy(rightArmDown).multiply(breathR);
      targetLeftLowerArm.copy(leftElbowBend);
      targetRightLowerArm.copy(rightElbowBend);
      targetRightHand.identity();

    } else if (state === 'Wave') {
      targetLeftUpperArm.copy(leftArmDown).multiply(breathL);
      targetLeftLowerArm.copy(leftElbowBend);

      const waveArmUp = new Q().setFromAxisAngle(new V(0, 0, 1), 0.3);
      const waveArmForward = new Q().setFromAxisAngle(new V(1, 0, 0), 0.3);
      targetRightUpperArm.copy(waveArmUp).multiply(waveArmForward);

      const waveElbow = new Q().setFromAxisAngle(new V(0, 1, 0), -2.0);
      targetRightLowerArm.copy(waveElbow);

      const waveHandAngle = Math.sin(t * 8) * 0.6;
      targetRightHand.setFromAxisAngle(new V(0, 0, 1), waveHandAngle);

      animTimerRef.current += delta;
      if (animTimerRef.current > 2.5) {
        animStateRef.current = 'Idle';
        animTimerRef.current = 0;
      }

    } else if (state === 'Talking') {
      const gesturePhase = t * 2.5;

      const leftGestureZ = -1.0 + Math.sin(gesturePhase) * 0.15;
      const leftGestureX = 0.15 + Math.sin(gesturePhase * 0.7) * 0.1;
      const leftUp = new Q().setFromAxisAngle(new V(0, 0, 1), leftGestureZ);
      const leftFwd = new Q().setFromAxisAngle(new V(1, 0, 0), leftGestureX);
      targetLeftUpperArm.copy(leftUp).multiply(leftFwd);

      const rightGestureZ = 1.0 + Math.cos(gesturePhase * 1.1) * 0.15;
      const rightGestureX = 0.15 + Math.cos(gesturePhase * 0.8) * 0.1;
      const rightUp = new Q().setFromAxisAngle(new V(0, 0, 1), rightGestureZ);
      const rightFwd = new Q().setFromAxisAngle(new V(1, 0, 0), rightGestureX);
      targetRightUpperArm.copy(rightUp).multiply(rightFwd);

      const leftElbowGesture = 0.3 + Math.sin(gesturePhase * 1.3) * 0.2;
      const rightElbowGesture = -0.3 + Math.cos(gesturePhase * 1.4) * 0.2;
      targetLeftLowerArm.setFromAxisAngle(new V(0, 1, 0), leftElbowGesture);
      targetRightLowerArm.setFromAxisAngle(new V(0, 1, 0), rightElbowGesture);
      targetRightHand.identity();
    }

    // ── Smooth Interpolation (Slerp) ──
    // Use a framerate-independent lerp factor. 12 = speed of transition.
    const slerpFactor = curPose.initialized ? (1.0 - Math.exp(-12 * delta)) : 1.0;

    curPose.leftUpperArm.slerp(targetLeftUpperArm, slerpFactor);
    curPose.rightUpperArm.slerp(targetRightUpperArm, slerpFactor);
    curPose.leftLowerArm.slerp(targetLeftLowerArm, slerpFactor);
    curPose.rightLowerArm.slerp(targetRightLowerArm, slerpFactor);
    curPose.rightHand.slerp(targetRightHand, slerpFactor);
    curPose.initialized = true;

    // Apply to actual bones
    leftUpperArm.quaternion.copy(curPose.leftUpperArm);
    rightUpperArm.quaternion.copy(curPose.rightUpperArm);
    if (leftLowerArm) leftLowerArm.quaternion.copy(curPose.leftLowerArm);
    if (rightLowerArm) rightLowerArm.quaternion.copy(curPose.rightLowerArm);
    if (rightHand) rightHand.quaternion.copy(curPose.rightHand);

  }, []);

  // ── Animation State Helpers ──
  const findAction = (name) => {
    const actions = actionsRef.current;
    return actions[name] ||
      actions[Object.keys(actions).find(k => k.toLowerCase().includes(name.toLowerCase()))];
  };

  const setAnimState = useCallback((state) => {
    animStateRef.current = state;
    animTimerRef.current = 0;
  }, []);

  const playAnimation = useCallback((name, loop) => {
    const THREE = threeRef.current;
    const action = findAction(name);
    if (!action) return;

    if (currentActionRef.current && currentActionRef.current !== action) {
      currentActionRef.current.fadeOut(0.3);
    }

    action.reset();
    action.setLoop(loop ? (THREE?.LoopRepeat ?? 2201) : (THREE?.LoopOnce ?? 2200), loop ? Infinity : 1);
    action.clampWhenFinished = !loop;
    action.enabled = true;
    action.setEffectiveWeight(1.0);
    action.fadeIn(0.3).play();
    currentActionRef.current = action;
  }, []);

  // ── Lip Sync ──
  const MOUTH_KEYS = ['Fcl_MTH_A', 'vrc.v_aa', 'MTH_A', 'mouthOpen', 'jawOpen', 'viseme_aa'];

  const setMouthOpen = useCallback((val) => {
    morphMeshesRef.current.forEach(mesh => {
      MOUTH_KEYS.forEach(key => {
        const idx = mesh.morphTargetDictionary?.[key];
        if (idx !== undefined) {
          mesh.morphTargetInfluences[idx] = val;
        }
      });
    });
  }, []);

  const startLipSync = useCallback(() => {
    stopLipSync();
    let phase = 0;
    lipSyncRef.current = setInterval(() => {
      const val = Math.abs(Math.sin(phase)) * 0.7 + Math.random() * 0.2;
      setMouthOpen(Math.min(val, 1));
      phase += 0.35;
    }, 70);
  }, [setMouthOpen]);

  const stopLipSync = useCallback(() => {
    if (lipSyncRef.current) {
      clearInterval(lipSyncRef.current);
      lipSyncRef.current = null;
    }
    setMouthOpen(0);
  }, [setMouthOpen]);

  // ── TTS via Smallest.ai (sub-100ms latency) ──
  const audioContextRef = useRef(null);
  const currentSourceRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const speakText = useCallback(async (text, onEnd) => {
    if (!ttsEnabled || typeof window === 'undefined') {
      if (onEnd) setTimeout(onEnd, Math.min(text.length * 50, 3000));
      return;
    }

    // Stop any currently playing audio
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
      currentSourceRef.current = null;
    }

    setIsSpeaking(true);

    try {
      // Call our backend TTS endpoint (Smallest.ai Waves)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text, voiceId: 'emily', speed: 1.0 }),
      });

      // If TTS service is unavailable, fall back to browser speech synthesis
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (errData.fallback) {
          console.warn('[TTS] Smallest.ai not configured, using browser fallback');
          fallbackBrowserTTS(text, onEnd);
          return;
        }
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const latencyMs = response.headers.get('X-TTS-Latency-Ms');
      console.log(`[TTS] Smallest.ai audio received in ${latencyMs}ms`);

      // Decode the WAV audio and play via Web Audio API
      const arrayBuffer = await response.arrayBuffer();
      const ctx = getAudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      currentSourceRef.current = source;

      source.onended = () => {
        setIsSpeaking(false);
        currentSourceRef.current = null;
        if (onEnd) onEnd();
      };

      source.start(0);
    } catch (err) {
      console.warn('[TTS] Fallback activated due to error:', err.message);
      // Graceful fallback to browser TTS
      fallbackBrowserTTS(text, onEnd);
    }
  }, [ttsEnabled, getAudioContext]);

  // Browser TTS fallback (used when Smallest.ai is not available)
  const fallbackBrowserTTS = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) {
      setIsSpeaking(false);
      if (onEnd) setTimeout(onEnd, Math.min(text.length * 50, 3000));
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.0;
    utt.pitch = 1.15;

    // Select a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice =
      voices.find(v => v.name.includes('Zira')) ||                                    // Windows female
      voices.find(v => v.name.includes('Samantha')) ||                                 // macOS female
      voices.find(v => v.name.includes('Google UK English Female')) ||                 // Chrome female
      voices.find(v => v.name.includes('Female') && v.lang.startsWith('en')) ||        // Any English female
      voices.find(v => v.name.includes('Victoria')) ||
      voices.find(v => v.name.includes('Karen')) ||
      voices.find(v => v.name.includes('Susan')) ||
      voices.find(v => v.lang.startsWith('en'));                                       // Fallback: any English

    if (femaleVoice) utt.voice = femaleVoice;

    setIsSpeaking(true);
    utt.onend = () => { setIsSpeaking(false); if (onEnd) onEnd(); };
    utt.onerror = () => { setIsSpeaking(false); if (onEnd) onEnd(); };
    window.speechSynthesis.speak(utt);
  }, []);

  // ── Pick animation based on text ──
  const getAnimForText = (text) => {
    const t = text.toLowerCase();
    if (/\b(hi|hello|hey|bye|goodbye|welcome)\b/.test(t)) return 'Wave';
    return 'Talking';
  };

  // ── Handle Send Message ──
  const handleSend = useCallback(async (text, options = {}) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isSending) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsSending(true);
    setStatus('Thinking...');

    let reply = '';
    try {
      // Get real session ID for budget and routing
      let currentSessionId = 'demo-session-id';
      try {
        const authData = await api.get('/api/auth/me');
        if (authData?.user) {
          currentSessionId = authData.user._id || authData.user.id;
        }
      } catch (e) {
        console.warn('Could not fetch user session for avatar chat');
      }

      const payload = {
        message: trimmed,
        sessionId: currentSessionId,
      };
      
      if (options.webSearch) payload.webSearchMode = true;
      if (options.socratic) payload.socraticMode = true;

      const res = await api.post('/api/ai/chat', payload);
      reply = res.answer || "I'm here to help! Ask me anything.";
    } catch (err) {
      console.error('Avatar chat error:', err);
      reply = err?.data?.message || "I'm having trouble connecting right now. Please try again!";
    }

    setMessages(prev => [...prev, { role: 'avatar', text: reply }]);
    setIsSending(false);

    // Animate based on user input content
    const anim = getAnimForText(trimmed);
    setAnimState(anim);

    // Lip sync + TTS
    if (ttsEnabled) {
      startLipSync();
      setStatus('Speaking...');
      speakText(reply, () => {
        stopLipSync();
        setAnimState('Idle');
        setStatus('Ready');
      });
    } else {
      setStatus('Ready');
      // Return to idle after a bit if no TTS
      setTimeout(() => setAnimState('Idle'), 3000);
    }
  }, [isSending, ttsEnabled, setAnimState, startLipSync, stopLipSync, speakText]);

  // ── Mobile Bridge (JS to Flutter) ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.avatarSpeak = (reply) => {
        const anim = getAnimForText(reply);
        if (anim === 'Wave') {
          playAnimation('Wave', false);
          setTimeout(() => playAnimation('Idle', true), 2500);
        } else {
          const talkAction = findAction('Talking');
          if (talkAction) playAnimation('Talking', true);
          else playAnimation('Idle', true);
        }

        if (ttsEnabled) {
          startLipSync();
          setStatus('Speaking...');
          speakText(reply, () => {
            stopLipSync();
            playAnimation('Idle', true);
            setStatus('Ready');
          });
        } else {
          playAnimation('Idle', true);
          setStatus('Ready');
        }
      };

      window.avatarThink = () => {
        const thinkAction = findAction('Thinking');
        if (thinkAction) playAnimation('Thinking', true);
        setStatus('Thinking...');
      };
      
      window.avatarReceiveNativeSTT = (text) => {
        handleSend(text);
      };
    }
  }, [ttsEnabled, playAnimation, startLipSync, stopLipSync, speakText, handleSend]);

  // ── Speech Recognition (Mic) ──
  const handleMic = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      handleSend(transcript);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.start();
    setIsListening(true);
  }, [handleSend]);

  const toggleTTS = useCallback(() => {
    if (isSpeaking) {
      // Stop Smallest.ai Web Audio
      if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch (e) {}
        currentSourceRef.current = null;
      }
      // Stop browser fallback
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopLipSync();
      setAnimState('Idle');
      setIsSpeaking(false);
      setStatus('Ready');
    }
    setTtsEnabled(prev => !prev);
  }, [isSpeaking, stopLipSync, setAnimState]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">

      {/* ── 3D Avatar Viewport ── */}
      <div className="avatar-viewport flex-1 min-h-[350px] lg:min-h-0 bg-white border-[4px] border-ink rounded-3xl shadow-[8px_8px_0_#1A1A2E] overflow-hidden relative">
        <div ref={mountRef} className="w-full h-full" />

        {/* Status pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-ink/80 backdrop-blur-sm border-[3px] border-ink rounded-full shadow-[4px_4px_0_#7C3AED]"
          >
            <motion.div
              className={`w-2.5 h-2.5 rounded-full ${
                status === 'Ready' ? 'bg-mint' :
                status === 'Speaking...' ? 'bg-iris-purple' :
                status === 'Thinking...' ? 'bg-sunny' : 'bg-sky'
              }`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-white font-bold text-xs uppercase tracking-wider">{status}</span>
          </motion.div>
        </div>

        {/* TTS toggle */}
        <button
          onClick={toggleTTS}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-[3px] border-ink rounded-full flex items-center justify-center shadow-[3px_3px_0_#1A1A2E] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1A1A2E] active:translate-y-[2px] active:shadow-[1px_1px_0_#1A1A2E] transition-all"
          title={ttsEnabled ? 'Mute voice' : 'Unmute voice'}
        >
          {ttsEnabled ? (
            <RiVolumeUpLine className="w-5 h-5 text-ink" />
          ) : (
            <RiVolumeMuteLine className="w-5 h-5 text-ink/50" />
          )}
        </button>
      </div>

      {/* ── Chat Panel ── */}
      <div className="chat-panel w-full lg:w-[380px] shrink-0 flex flex-col bg-white border-[4px] border-ink rounded-3xl shadow-[8px_8px_0_#1A1A2E] overflow-hidden h-[400px] lg:h-auto">
        
        {/* Chat header */}
        <div className="px-5 py-4 border-b-[4px] border-ink bg-cream flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-iris-purple rounded-full border-[3px] border-ink flex items-center justify-center shadow-[2px_2px_0_#1A1A2E]">
            <span className="text-white font-black text-sm">IR</span>
          </div>
          <div>
            <h3 className="font-black text-ink text-base leading-tight">Iris Avatar</h3>
            <p className="text-ink/50 font-bold text-xs uppercase tracking-wider">3D AI Assistant</p>
          </div>
          <motion.div
            className={`ml-auto w-3 h-3 rounded-full border-[2px] border-ink shadow-[2px_2px_0_#1A1A2E] ${avatarReady ? 'bg-mint' : 'bg-coral'}`}
            animate={avatarReady ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-cream/50">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 font-medium text-sm leading-relaxed border-[3px] border-ink rounded-2xl shadow-[3px_3px_0_#1A1A2E] ${
                    m.role === 'user'
                      ? 'bg-iris-purple text-white rounded-br-sm'
                      : 'bg-white text-ink rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border-[3px] border-ink rounded-2xl rounded-bl-sm px-4 py-3 shadow-[3px_3px_0_#1A1A2E]">
                <div className="flex items-center gap-2">
                  <motion.div className="w-2 h-2 rounded-full bg-iris-purple" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-iris-purple" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-iris-purple" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div className="border-t-[4px] border-ink bg-white p-3 shrink-0">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Talk to Iris..."
              disabled={isSending}
              className="flex-1 bg-cream border-[3px] border-ink rounded-xl px-4 py-3 text-ink font-medium text-sm outline-none transition-all shadow-[3px_3px_0_#1A1A2E] focus:border-iris-purple focus:shadow-[3px_3px_0_var(--color-iris-purple)] disabled:opacity-50 placeholder:text-ink/40"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isSending}
              className="w-11 h-11 bg-iris-purple text-white border-[3px] border-ink rounded-xl flex items-center justify-center shadow-[3px_3px_0_#1A1A2E] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1A1A2E] active:translate-y-[2px] active:shadow-[1px_1px_0_#1A1A2E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isSending ? (
                <RiLoader4Line className="w-5 h-5 animate-spin" />
              ) : (
                <RiSendPlaneLine className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleMic}
              disabled={isSending}
              className={`w-11 h-11 border-[3px] border-ink rounded-xl flex items-center justify-center shadow-[3px_3px_0_#1A1A2E] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1A1A2E] active:translate-y-[2px] active:shadow-[1px_1px_0_#1A1A2E] transition-all flex-shrink-0 ${
                isListening
                  ? 'bg-coral text-white'
                  : 'bg-sunny text-ink'
              }`}
            >
              {isListening ? (
                <RiMicOffLine className="w-5 h-5" />
              ) : (
                <RiMicLine className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
