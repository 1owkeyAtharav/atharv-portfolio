import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Sparkles,
  Stars,
  Torus,
} from "@react-three/drei";
import gsap from "gsap";
import "./App.css";

function EnergyCore() {
  const core = useRef(null);
  const wire = useRef(null);
  const group = useRef(null);

  useFrame((state, delta) => {
    if (core.current) {
      core.current.rotation.y += delta * 0.17;
      core.current.rotation.x += delta * 0.07;
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.12;
      wire.current.rotation.z += delta * 0.08;
    }
    if (group.current) {
      group.current.rotation.x +=
        (state.pointer.y * 0.12 - group.current.rotation.x) *
        Math.min(delta * 1.8, 1);
      group.current.rotation.y +=
        (state.pointer.x * 0.18 - group.current.rotation.y) *
        Math.min(delta * 1.8, 1);
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.13} floatIntensity={0.25}>
      <group ref={group}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.05, 5]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            emissive="#6d28d9"
            emissiveIntensity={0.65}
            metalness={0.72}
            roughness={0.2}
            distort={0.2}
            speed={1.35}
          />
        </mesh>

        <mesh ref={wire} scale={1.13}>
          <icosahedronGeometry args={[1.05, 2]} />
          <meshBasicMaterial color="#ddd6fe" wireframe transparent opacity={0.3} />
        </mesh>

        <mesh scale={0.46}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#171323"
            metalness={0.9}
            roughness={0.13}
            clearcoat={1}
          />
        </mesh>

        <Torus args={[1.43, 0.009, 8, 180]} rotation={[0.7, 0.25, 0.3]}>
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.9} />
        </Torus>
        <Torus args={[1.62, 0.005, 8, 180]} rotation={[1.05, 0.8, -0.55]}>
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.48} />
        </Torus>
        <Torus args={[1.82, 0.003, 8, 180]} rotation={[0.2, -0.7, 1.1]}>
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} />
        </Torus>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.1], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ddd6fe", "#171323", 1.2]} />
      <directionalLight position={[3, 4, 5]} intensity={2.5} color="#f5f3ff" />
      <pointLight position={[-3, 1, 2]} intensity={18} distance={8} color="#8b5cf6" />
      <pointLight position={[3, -2, -1]} intensity={9} distance={7} color="#a78bfa" />
      <Suspense fallback={null}>
        <Stars radius={8} depth={4} count={150} factor={1.7} saturation={0} fade speed={0.35} />
        <Sparkles count={55} scale={4.2} size={2} speed={0.3} opacity={0.75} color="#c4b5fd" />
        <EnergyCore />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.45}
      />
    </Canvas>
  );
}

const skillGroups = [
  { title: "Programming", items: ["Java", "Python", "JavaScript"] },
  { title: "Web & creative", items: ["React", "HTML / CSS", "3D graphics"] },
  { title: "Foundations", items: ["Data structures", "Algorithms", "Problem solving"] },
];

const projects = [
  {
    number: "01",
    title: "Interactive portfolio",
    category: "WEB / 3D",
    description: "A personal space for experiments in interactive design and motion.",
    status: "CURRENT PROJECT",
    visual: "orb",
  },
  {
    number: "02",
    title: "Java & DSA practice",
    category: "JAVA",
    description: "Building programming fundamentals through data structures and algorithms.",
    status: "LEARNING",
    visual: "blocks",
  },
  {
    number: "03",
    title: "Next experiment",
    category: "EXPLORATION",
    description: "A placeholder for the next project. Replace this card when you have a real project to showcase.",
    status: "IDEA SPACE",
    visual: "wire",
  },
];

function ProjectVisual({ type }) {
  if (type === "blocks") {
    return (
      <div className="block-visual" aria-hidden="true">
        <span /><span /><span />
      </div>
    );
  }
  if (type === "wire") {
    return (
      <div className="wire-visual" aria-hidden="true">
        <span /><span /><span /><i />
      </div>
    );
  }
  return (
    <div className="mini-orb" aria-hidden="true">
      <span className="mini-orb-ring" />
      <span className="mini-orb-core" />
    </div>
  );
}

function App() {
  const root = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.12,
        }
      );

      gsap.utils.toArray(".section-reveal").forEach((element) => {
        gsap.set(element, { y: 28, opacity: 0 });
      });
    }, root);

    const sections = ["home", "about", "skills", "projects", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id) setActiveSection(entry.target.id);
            if (entry.target.classList.contains("section-reveal")) {
              gsap.to(entry.target, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                overwrite: true,
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: "-12% 0px -10% 0px", threshold: 0.05 }
    );
    sections.forEach((section) => observer.observe(section));
    root.current?.querySelectorAll(".section-reveal").forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }

  const navItems = [
    ["home", "Home"],
    ["about", "About"],
    ["skills", "Skills"],
    ["projects", "Projects"],
    ["contact", "Contact"],
  ];

  return (
    <main ref={root} className="site-shell" onMouseMove={handlePointerMove}>
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Atharv Bawankule home">
          AB<span>.</span>
        </a>
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
          {navItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="#contact">
          LET&apos;S TALK <span>↗</span>
        </a>
      </header>

      <section id="home" className="hero section-grid">
        <div className="hero-copy">
          <div className="eyebrow reveal"><span className="eyebrow-mark">✳</span> CS STUDENT <i /> DEVELOPER <i /> 3D EXPLORER</div>
          <h1 className="hero-title reveal">
            ATHARV
            <span>BAWANKULE</span>
          </h1>
          <p className="hero-description reveal">
            I&apos;m a Computer Science student and aspiring developer, exploring the intersection of code, creativity and interactive 3D experiences.
          </p>
          <div className="hero-actions reveal">
            <a className="button button-primary" href="#projects">EXPLORE MY WORK <span>↗</span></a>
            <a className="button button-ghost" href="#about">ABOUT ME <span>↓</span></a>
          </div>
          <div className="hero-meta reveal">
            <span className="status-dot" /> DEVELOPER IN PROGRESS <b /> INDIA <b /> BUILDING MY NEXT STEP
          </div>
        </div>

        <div className="hero-art reveal" style={{ "--pointer-x": `${pointer.x * 8}px`, "--pointer-y": `${pointer.y * 8}px` }}>
          <div className="art-grid" />
          <div className="art-glow" />
          <div className="art-label art-label-top"><span className="status-dot" /> CREATIVE CODE / 001</div>
          <div className="scene-frame"><Scene /></div>
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="art-label art-label-bottom">3D · WEB · EXPERIMENTS</div>
          <span className="art-cross cross-a">+</span>
          <span className="art-cross cross-b">+</span>
          <span className="art-coordinate">FIG. 001 / INTERACTIVE FORM</span>
        </div>

        <div className="scroll-cue"><span>SCROLL TO EXPLORE</span><i /></div>
      </section>

      <section id="about" className="about-section section-grid section-reveal">
        <div className="section-heading">
          <p className="section-kicker">01 / ABOUT</p>
          <h2>Curious by nature.<br /><span>Building by choice.</span></h2>
          <p className="body-copy">
            I&apos;m at the beginning of my Computer Science journey. I enjoy solving problems, learning new technologies, and turning ideas into things people can interact with.
          </p>
          <a className="text-link" href="#skills">A LITTLE MORE ABOUT ME <span>↗</span></a>
        </div>

        <div className="about-console" aria-label="Developer mindset illustration">
          <div className="console-top"><span /><span /><span /><small>ATHARV / DEV_LOG</small></div>
          <div className="console-lines">
            <p><span>01</span> const curiosity = true;</p>
            <p><span>02</span> while (learning) &#123;</p>
            <p className="indent"><span>03</span> build();</p>
            <p className="indent"><span>04</span> experiment();</p>
            <p><span>05</span> &#125;</p>
            <p className="console-comment">// always becoming better</p>
          </div>
          <div className="console-orbit"><div /></div>
          <div className="console-stamp">LEARN<br />BUILD<br />REPEAT<span>↗</span></div>
        </div>

        <div id="skills" className="skills-panel">
          <p className="section-kicker">CURRENT TOOLKIT</p>
          <h3>Things I&apos;m exploring</h3>
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.title}>
              <p>{group.title}</p>
              <div className="skill-tags">
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          ))}
          <p className="skills-note"><span>✳</span> Always learning. Always building.</p>
        </div>
      </section>

      <section id="projects" className="projects-section section-reveal">
        <div className="projects-intro">
          <p className="section-kicker">02 / SELECTED WORK</p>
          <h2>Ideas in motion.</h2>
          <p className="body-copy">A snapshot of what I&apos;m exploring. As projects evolve, this is where the real work will live.</p>
          <span className="text-link muted-link">SMALL STEPS. REAL PROGRESS.</span>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className="project-card-top"><span>{project.number}</span><span className="project-arrow">↗</span></div>
              <ProjectVisual type={project.visual} />
              <div className="project-card-content">
                <p className="project-category">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="project-status">{project.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section section-reveal">
        <div className="contact-backdrop" />
        <div className="contact-title">
          <p className="section-kicker">03 / CONTACT</p>
          <h2>Have an idea?<br /><span>Let&apos;s make it real.</span></h2>
        </div>
        <div className="contact-message">
          <p>I&apos;m open to learning, collaborating on projects, and having good conversations about code, creativity and the future.</p>
          <a className="button button-primary" href="mailto:YOUR_EMAIL_HERE?subject=Hello%20Atharv">
            GET IN TOUCH <span>↗</span>
          </a>
          <small>Before publishing, replace the email placeholder in App.jsx with your real email address.</small>
        </div>
        <div className="contact-signoff">
          <a className="brand footer-brand" href="#home">AB<span>.</span></a>
          <p>DESIGNED & BUILT BY<br /><strong>ATHARV BAWANKULE</strong></p>
          <a className="text-link" href="#home">BACK TO TOP ↑</a>
        </div>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} ATHARV BAWANKULE</span>
        <span>MADE WITH CURIOSITY <b>✳</b></span>
        <a href="#home">RETURN TO TOP ↑</a>
      </footer>
    </main>
  );
}

export default App;
