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
  const clockRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animIdRef = useRef(null);
  const threeRef = useRef(null);

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
      clockRef.current = new THREE.Clock();

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
      scene.background = new THREE.Color(0xfff8f0);
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

      // Load avatar
      const loader = new GLTFLoader();
      loader.load(
        '/3d-model/avatar.glb',
        (gltf) => {
          if (cancelled) return;
          const avatar = gltf.scene;

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

          // Setup animation mixer
          const mixer = new THREE.AnimationMixer(avatar);
          mixerRef.current = mixer;

          if (gltf.animations && gltf.animations.length > 0) {
            gltf.animations.forEach((clip) => {
              actionsRef.current[clip.name] = mixer.clipAction(clip);
            });
            playAnimation('Idle', true);
          }

          setAvatarReady(true);
          setStatus('Ready');

          // Greeting animation
          setTimeout(() => {
            const hasWave = findAction('Wave');
            if (hasWave) {
              playOnceReturnToIdle('Wave');
            }
            if (ttsEnabled) {
              startLipSync();
              speakText("Hi! I'm Iris, your AI assistant! How can I help you today?", () => {
                stopLipSync();
                playAnimation('Idle', true);
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
          setAvatarReady(true); // Still allow chat
        }
      );

      // Animation loop
      const animate = () => {
        animIdRef.current = requestAnimationFrame(animate);
        const delta = clockRef.current.getDelta();
        if (mixerRef.current) mixerRef.current.update(delta);
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
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Animation Helpers ──
  const findAction = (name) => {
    const actions = actionsRef.current;
    return actions[name] ||
      actions[Object.keys(actions).find(k => k.toLowerCase().includes(name.toLowerCase()))];
  };

  const playAnimation = useCallback((name, loop) => {
    const action = findAction(name);
    if (!action) return;

    if (currentActionRef.current && currentActionRef.current !== action) {
      currentActionRef.current.fadeOut(0.3);
    }

    action.reset();
    action.setLoop(loop ? 2201 : 2200, Infinity); // LoopRepeat : LoopOnce
    action.clampWhenFinished = !loop;
    action.fadeIn(0.3).play();
    currentActionRef.current = action;
  }, []);

  const playOnceReturnToIdle = useCallback((name) => {
    const action = findAction(name);
    if (!action) return;

    if (currentActionRef.current) currentActionRef.current.fadeOut(0.3);
    action.reset();
    action.setLoop(2200, 1); // LoopOnce
    action.clampWhenFinished = true;
    action.fadeIn(0.3).play();
    currentActionRef.current = action;

    const duration = action.getClip().duration * 1000;
    setTimeout(() => playAnimation('Idle', true), duration);
  }, [playAnimation]);

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

  // ── TTS ──
  const speakText = useCallback((text, onEnd) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) setTimeout(onEnd, Math.min(text.length * 50, 3000));
      return;
    }
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.0;
    utt.pitch = 1.15;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Female') || v.name.includes('Samantha') ||
      v.name.includes('Zira') || v.name.includes('Google') && v.lang.startsWith('en')
    );
    if (preferred) utt.voice = preferred;

    setIsSpeaking(true);
    utt.onend = () => { setIsSpeaking(false); if (onEnd) onEnd(); };
    utt.onerror = () => { setIsSpeaking(false); if (onEnd) onEnd(); };

    window.speechSynthesis.speak(utt);
  }, [ttsEnabled]);

  // ── Pick animation based on text ──
  const getAnimForText = (text) => {
    const t = text.toLowerCase();
    if (/\b(hi|hello|hey|bye|goodbye|welcome)\b/.test(t)) return 'Wave';
    if (/\b(think|hmm|consider|analyze|complex)\b/.test(t)) return 'Thinking';
    return 'Talking';
  };

  // ── Handle Send Message ──
  const handleSend = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isSending) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsSending(true);
    setStatus('Thinking...');

    // Play a thinking animation while waiting
    const thinkAction = findAction('Thinking');
    if (thinkAction) playAnimation('Thinking', true);

    let reply = '';
    try {
      const res = await api.post('/api/ai/chat', {
        message: trimmed,
        sessionId: 'avatar-session',
      });
      reply = res.answer || "I'm here to help! Ask me anything.";
    } catch (err) {
      console.error('Avatar chat error:', err);
      reply = err?.data?.message || "I'm having trouble connecting right now. Please try again!";
    }

    setMessages(prev => [...prev, { role: 'avatar', text: reply }]);
    setIsSending(false);

    // Animate based on content
    const anim = getAnimForText(trimmed);
    if (anim === 'Wave') {
      playOnceReturnToIdle('Wave');
    } else {
      const talkAction = findAction('Talking');
      if (talkAction) playAnimation('Talking', true);
      else playAnimation('Idle', true);
    }

    // Lip sync + TTS
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
  }, [isSending, ttsEnabled, playAnimation, playOnceReturnToIdle, startLipSync, stopLipSync, speakText]);

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
    if (isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      stopLipSync();
      playAnimation('Idle', true);
      setIsSpeaking(false);
      setStatus('Ready');
    }
    setTtsEnabled(prev => !prev);
  }, [isSpeaking, stopLipSync, playAnimation]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">

      {/* ── 3D Avatar Viewport ── */}
      <div className="flex-1 min-h-[350px] lg:min-h-0 bg-white border-[4px] border-ink rounded-3xl shadow-[8px_8px_0_#1A1A2E] overflow-hidden relative">
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
      <div className="w-full lg:w-[380px] shrink-0 flex flex-col bg-white border-[4px] border-ink rounded-3xl shadow-[8px_8px_0_#1A1A2E] overflow-hidden h-[400px] lg:h-auto">
        
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
