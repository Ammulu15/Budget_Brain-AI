/**
 * ==============================================================================
 * FINANCIAL CHARACTER PHYSICS & EXPRESSION CONTROLLER (WebGL / Three.js / R3F)
 * ==============================================================================
 * Architect: Principal Creative Frontend Engineer & WebGL Architect
 *
 * Description:
 * Production-ready reactive physics and facial expression engine that maps real-time
 * financial states (Loss, Gain, Savings) and cursor interactions (elastic spring giggle,
 * emotional amplification, and dampening) directly to 3D character rigs.
 *
 * Compatible with:
 * - Three.js (Vanilla / WebGLRenderer)
 * - React Three Fiber (R3F) via useFrame hooks
 * - GSAP or internal analytical 2nd-order spring physics
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// 1. SECOND-ORDER DYNAMICS SPRING SOLVER (Zero-dependency, high performance)
// -----------------------------------------------------------------------------
export class SpringDynamics {
  /**
   * @param {number} f Natural frequency (Hz) - higher = snappier/faster
   * @param {number} z Damping ratio (zeta) - 0 = no damping, 1 = critically damped, <1 = bouncy
   * @param {number} r Initial response - 0 = sluggish, 1 = immediate, >1 = anticipates
   * @param {number} x0 Initial state
   */
  constructor(f = 3.5, z = 0.5, r = 2.0, x0 = 1.0) {
    this.updateCoefficients(f, z, r);
    this.xp = x0;
    this.y = x0;
    this.yd = 0;
  }

  updateCoefficients(f, z, r) {
    const PI = Math.PI;
    this.k1 = z / (PI * f);
    this.k2 = 1.0 / ((2 * PI * f) * (2 * PI * f));
    this.k3 = (r * z) / (2 * PI * f);
  }

  update(x, xd = null, dt = 0.016) {
    // Clamp delta time to prevent physics explosions on tab switch
    const clampedDt = Math.min(Math.max(dt, 0.001), 0.05);

    if (xd === null) {
      xd = (x - this.xp) / clampedDt;
      this.xp = x;
    }

    // Semi-implicit Euler integration for stability
    const k2_stable = Math.max(this.k2, 1.1 * (clampedDt * clampedDt / 4 + clampedDt * this.k1 / 2));
    this.y = this.y + clampedDt * this.yd;
    this.yd = this.yd + (clampedDt * (x + this.k3 * xd - this.y - this.k1 * this.yd)) / k2_stable;

    return this.y;
  }

  impulse(velocity) {
    this.yd += velocity;
  }
}

// -----------------------------------------------------------------------------
// 2. FINANCIAL STATE EXPRESSION MATRIX SPECIFICATION
// -----------------------------------------------------------------------------
/**
 * Standard Morph Target names mapped to standard ARKit / FACS blend shapes.
 * If your GLTF uses custom names, simply remap the keys in morphMapping.
 */
export const FINANCIAL_EXPRESSION_PRESETS = {
  // Over-budget, deficit, expenses > income
  LOSS: {
    morphs: {
      browDownLeft: 0.85,
      browDownRight: 0.85,
      browInnerUp: 0.9,
      eyeSquintLeft: 0.3,
      eyeSquintRight: 0.3,
      eyeWideLeft: 0.0,
      eyeWideRight: 0.0,
      mouthFrownLeft: 0.95,
      mouthFrownRight: 0.95,
      mouthSmileLeft: 0.0,
      mouthSmileRight: 0.0,
      mouthOpen: 0.25,
      sparkleEyes: 0.0,
      tearGlisten: 0.8,
    },
    bones: {
      headTiltX: -0.15, // Head droops down
      headTiltZ: 0.05,
      spineCurvature: -0.08,
    },
    idleBreathing: {
      speed: 1.8,
      amplitude: 0.02,
      jitter: 0.008, // Trembling breath
    },
    colorMood: 0xff6b8b,
  },

  // In the green, income > expenses, healthy cashflow
  GAIN: {
    morphs: {
      browDownLeft: 0.0,
      browDownRight: 0.0,
      browInnerUp: 0.2,
      eyeSquintLeft: 0.1,
      eyeSquintRight: 0.1,
      eyeWideLeft: 0.75,
      eyeWideRight: 0.75,
      mouthFrownLeft: 0.0,
      mouthFrownRight: 0.0,
      mouthSmileLeft: 0.9,
      mouthSmileRight: 0.9,
      mouthOpen: 0.45,
      sparkleEyes: 1.0,
      tearGlisten: 0.0,
    },
    bones: {
      headTiltX: 0.12, // Cheerful confident chin lift
      headTiltZ: 0.08,
      spineCurvature: 0.05,
    },
    idleBreathing: {
      speed: 3.2,
      amplitude: 0.045,
      jitter: 0.0,
    },
    colorMood: 0x3de8c5,
  },

  // On target with long-term savings goals, safe surplus
  SAVINGS: {
    morphs: {
      browDownLeft: 0.1,
      browDownRight: 0.1,
      browInnerUp: 0.0,
      eyeSquintLeft: 0.8, // Peaceful closed squint eyes
      eyeSquintRight: 0.8,
      eyeWideLeft: 0.0,
      eyeWideRight: 0.0,
      mouthFrownLeft: 0.0,
      mouthFrownRight: 0.0,
      mouthSmileLeft: 0.7,
      mouthSmileRight: 0.7,
      mouthOpen: 0.05,
      sparkleEyes: 0.3,
      tearGlisten: 0.0,
    },
    bones: {
      headTiltX: 0.02,
      headTiltZ: -0.06, // Relaxed slight head-tilt
      spineCurvature: 0.0,
    },
    idleBreathing: {
      speed: 1.2, // Deep calm yogic respiration
      amplitude: 0.035,
      jitter: 0.0,
    },
    colorMood: 0x6a8fff,
  },
};

// -----------------------------------------------------------------------------
// 3. CORE CONTROLLER CLASS
// -----------------------------------------------------------------------------
export class FinancialCharacterController {
  /**
   * @param {Object} config
   * @param {import('three').Object3D} config.characterRoot - The root group of the 3D model
   * @param {import('three').Mesh} [config.facialMesh] - Mesh containing facial morph targets
   * @param {Object<string, import('three').Bone>} [config.rigBones] - Map of bones (head, neck, spine)
   * @param {HTMLCanvasElement} config.canvas - WebGL Canvas
   * @param {import('three').Camera} config.camera - Three.js Camera
   * @param {import('three').Raycaster} [config.raycaster] - Optional custom raycaster
   */
  constructor({
    characterRoot,
    facialMesh = null,
    rigBones = {},
    canvas,
    camera,
    raycaster = null,
  }) {
    this.root = characterRoot;
    this.face = facialMesh || this.findFacialMesh(characterRoot);
    this.bones = rigBones;
    this.canvas = canvas;
    this.camera = camera;
    this.raycaster = raycaster;

    // --- State variables ---
    this.currentState = "GAIN"; // 'LOSS' | 'GAIN' | 'SAVINGS'
    this.stateTransitionWeight = 1.0;
    this.previousPreset = FINANCIAL_EXPRESSION_PRESETS.GAIN;
    this.targetPreset = FINANCIAL_EXPRESSION_PRESETS.GAIN;

    // --- Dynamic morph blending cache ---
    this.currentMorphWeights = {};
    this.initMorphCache();

    // --- Base transform preservation ---
    this.baseScale = this.root.scale.clone();
    this.basePosition = this.root.position.clone();
    this.baseRotation = this.root.rotation.clone();

    // --- Elastic Spring Physics Engines (Squash & Stretch) ---
    // High frequency bounciness for the "giggle"
    this.scaleSpringY = new SpringDynamics(5.5, 0.45, 2.5, 1.0);
    this.tiltSpringZ = new SpringDynamics(4.0, 0.5, 1.8, 0.0);
    this.shakeSpringX = new SpringDynamics(8.0, 0.35, 1.5, 0.0);

    // --- Interaction flags ---
    this.isHovered = false;
    this.isTouched = false; // Mouse click or sustained pointerdown
    this.touchStartTime = 0;
    this.time = 0;

    // Initialize event listeners
    this.initInteractionListeners();
  }

  // Auto-discover SkinnedMesh with morphTargetDictionary if not provided
  findFacialMesh(obj) {
    let found = null;
    obj.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary && Object.keys(child.morphTargetDictionary).length > 0) {
        found = child;
      }
    });
    return found;
  }

  initMorphCache() {
    const allMorphKeys = new Set([
      ...Object.keys(FINANCIAL_EXPRESSION_PRESETS.LOSS.morphs),
      ...Object.keys(FINANCIAL_EXPRESSION_PRESETS.GAIN.morphs),
      ...Object.keys(FINANCIAL_EXPRESSION_PRESETS.SAVINGS.morphs),
    ]);

    for (const key of allMorphKeys) {
      this.currentMorphWeights[key] = 0;
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTION LAYER (Giggle, Jiggle, and Touch Amplification)
  // ---------------------------------------------------------------------------
  initInteractionListeners() {
    if (!this.canvas) return;

    this.onPointerEnter = () => {
      this.isHovered = true;
      // High frequency squishy giggle impulse
      // Squashes on Y, elastic rebound will overshoot
      this.scaleSpringY.impulse(0.55);
      this.tiltSpringZ.impulse(0.18 * (Math.random() > 0.5 ? 1 : -1));
    };

    this.onPointerLeave = () => {
      this.isHovered = false;
      this.isTouched = false;
      // Settling impulse to naturally return to resting baseline
      this.scaleSpringY.impulse(-0.15);
    };

    this.onPointerDown = () => {
      this.isTouched = true;
      this.touchStartTime = this.time;

      // Dynamic reactive impulse based on current financial state
      if (this.currentState === "GAIN") {
        // Joyous jump!
        this.scaleSpringY.impulse(0.85);
        this.tiltSpringZ.impulse(0.25);
      } else if (this.currentState === "LOSS") {
        // Shock tremble
        this.shakeSpringX.impulse(0.45);
        this.scaleSpringY.impulse(-0.4); // Cowering squash
      } else {
        // SAVINGS purring wobble
        this.scaleSpringY.impulse(0.4);
        this.tiltSpringZ.impulse(0.12);
      }
    };

    this.onPointerUp = () => {
      this.isTouched = false;
      this.scaleSpringY.impulse(0.2);
    };

    this.canvas.addEventListener("pointerenter", this.onPointerEnter);
    this.canvas.addEventListener("pointerleave", this.onPointerLeave);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointerup", this.onPointerUp);
  }

  // ---------------------------------------------------------------------------
  // FINANCIAL METRIC MAPPING & STATE MACHINE
  // ---------------------------------------------------------------------------
  /**
   * Evaluates application financial metrics and triggers smooth cross-fades
   * @param {Object} metrics
   * @param {number} metrics.income
   * @param {number} metrics.expenses
   * @param {number} [metrics.allocatedToGoals]
   * @param {number} [metrics.totalBalance]
   */
  setFinancialMetrics({ income = 0, expenses = 0, allocatedToGoals = 0, totalBalance = 0 }) {
    let nextState = "SAVINGS";

    const netSavings = income - expenses;
    const savingsRatio = income > 0 ? netSavings / income : -1;

    if (income === 0 && expenses > 0) {
      nextState = "LOSS";
    } else if (savingsRatio < 0 || expenses > income) {
      nextState = "LOSS";
    } else if (allocatedToGoals > 0 && netSavings >= 0) {
      nextState = "SAVINGS";
    } else if (savingsRatio >= 0.2 || totalBalance > 50000) {
      nextState = "GAIN";
    } else {
      nextState = "SAVINGS";
    }

    this.transitionToState(nextState);
  }

  /**
   * Cross-fade to target state over time
   * @param {'LOSS' | 'GAIN' | 'SAVINGS'} newState
   */
  transitionToState(newState) {
    if (this.currentState === newState) return;

    this.previousPreset = {
      morphs: { ...this.currentMorphWeights },
      bones: { ...this.targetPreset.bones },
      idleBreathing: { ...this.targetPreset.idleBreathing },
    };

    this.currentState = newState;
    this.targetPreset = FINANCIAL_EXPRESSION_PRESETS[newState];
    this.stateTransitionWeight = 0.0; // Reset interpolation progression

    // Subtle state shift bounce
    this.scaleSpringY.impulse(0.3);
  }

  // ---------------------------------------------------------------------------
  // TICK / ANIMATION UPDATE (Call inside RequestAnimationFrame or useFrame)
  // ---------------------------------------------------------------------------
  update(deltaTime = 0.016) {
    this.time += deltaTime;

    // 1. Cross-fade financial state expressions (Morphs & Base Bone Poses)
    if (this.stateTransitionWeight < 1.0) {
      this.stateTransitionWeight = Math.min(1.0, this.stateTransitionWeight + deltaTime * 2.2); // ~0.45s transition
    }
    const blendAlpha = this.stateTransitionWeight;

    // 2. Compute Target Morphs with Touch Amplification
    let amplificationFactor = 1.0;
    if (this.isTouched) {
      amplificationFactor = 1.6; // Extreme emotional reaction!
    } else if (this.isHovered) {
      amplificationFactor = 1.15;
    }

    for (const key in this.currentMorphWeights) {
      const startVal = this.previousPreset.morphs[key] ?? 0;
      const endVal = this.targetPreset.morphs[key] ?? 0;
      const baseInterpolated = startVal + (endVal - startVal) * blendAlpha;

      // Apply dynamic amplified emotion
      let targetWeight = baseInterpolated * amplificationFactor;

      // Add high-frequency trembling mouth/eye flutter if in panic LOSS state during touch
      if (this.currentState === "LOSS" && (this.isTouched || this.isHovered)) {
        if (key.includes("Frown") || key.includes("brow")) {
          targetWeight += Math.sin(this.time * 28.0) * 0.12;
        }
      }

      // Add laughing wide mouth vibration if in GAIN state during touch
      if (this.currentState === "GAIN" && this.isTouched) {
        if (key === "mouthOpen" || key.includes("Smile")) {
          targetWeight += Math.abs(Math.sin(this.time * 22.0)) * 0.25;
        }
      }

      // Smooth dampening towards target morph
      this.currentMorphWeights[key] += (targetWeight - this.currentMorphWeights[key]) * (deltaTime * 14.0);

      // Apply to actual GLTF mesh morph target if found
      if (this.face && this.face.morphTargetDictionary && this.face.morphTargetInfluences) {
        const morphIndex = this.face.morphTargetDictionary[key];
        if (morphIndex !== undefined) {
          this.face.morphTargetInfluences[morphIndex] = Math.max(0, Math.min(1, this.currentMorphWeights[key]));
        }
      }
    }

    // 3. Evaluate Spring Physics (Giggle / Jiggle Squash & Stretch)
    // Continuous hover creates a sustained playful frequency oscillation
    let targetScaleY = 1.0;
    if (this.isHovered) {
      targetScaleY += Math.sin(this.time * 12.0) * 0.04;
    }
    if (this.isTouched) {
      targetScaleY += Math.sin(this.time * 20.0) * (this.currentState === "GAIN" ? 0.12 : 0.05);
    }

    const currentY = this.scaleSpringY.update(targetScaleY, null, deltaTime);

    // Poisson volume preservation: when stretching on Y, squash X and Z equally
    // Volume = X * Y * Z = 1 => X = Z = sqrt(1 / Y)
    const clampedY = Math.max(0.4, Math.min(2.0, currentY));
    const volumePreservingXZ = Math.sqrt(1.0 / clampedY);

    this.root.scale.x = this.baseScale.x * volumePreservingXZ;
    this.root.scale.y = this.baseScale.y * clampedY;
    this.root.scale.z = this.baseScale.z * volumePreservingXZ;

    // 4. Idle Breathing & Micro-vibrations
    const breathProfile = this.targetPreset.idleBreathing;
    const breathCycle = Math.sin(this.time * breathProfile.speed);
    const breathOffset = breathCycle * breathProfile.amplitude;

    // Jitter / Shivering in LOSS state
    let jitterOffset = 0;
    if (breathProfile.jitter > 0) {
      jitterOffset = (Math.random() - 0.5) * breathProfile.jitter * (this.isHovered ? 2.5 : 1.0);
    }

    this.root.position.y = this.basePosition.y + breathOffset;
    this.root.position.x = this.basePosition.x + jitterOffset;

    // 5. Head / Spine Bone Orientation Blending
    const currentTiltZ = this.tiltSpringZ.update(0.0, null, deltaTime);
    this.root.rotation.z = this.baseRotation.z + currentTiltZ;

    if (this.bones.head) {
      const targetTiltX = this.targetPreset.bones.headTiltX;
      this.bones.head.rotation.x += (targetTiltX - this.bones.head.rotation.x) * (deltaTime * 4.0);
      this.bones.head.rotation.z = currentTiltZ * 0.5;
    }
  }

  // Clean up listeners when component unmounts
  destroy() {
    if (!this.canvas) return;
    this.canvas.removeEventListener("pointerenter", this.onPointerEnter);
    this.canvas.removeEventListener("pointerleave", this.onPointerLeave);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointerup", this.onPointerUp);
  }
}
