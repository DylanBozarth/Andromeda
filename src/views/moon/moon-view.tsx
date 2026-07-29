import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

function MoonSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.1;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color='#c8c8c8' roughness={0.9} metalness={0.0} />
    </mesh>
  );
}

export const MoonView = () => {
  const { activeMoon, sector, activeSystem } = useGame();
  const navigate = useNavigate();
  const { sectorName, systemName } = useParams();

  if (!activeMoon) return null;

  const backPath = `/${sectorName ?? sector?.sectorName}/system/${systemName ?? activeSystem?.systemName}`;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex' }}>
      {/* 3D scene */}
      <div style={{ flex: 1 }}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 45 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <OrbitControls enableDamping dampingFactor={0.08} minDistance={4} maxDistance={20} />
          <MoonSphere />
        </Canvas>
      </div>

      {/* Info panel */}
      <div style={{
        width: '300px', padding: '80px 24px 24px',
        background: 'rgba(0,0,0,0.85)', borderLeft: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', overflowY: 'auto', flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(backPath)}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px', color: 'rgba(255,255,255,0.6)', padding: '6px 12px',
            cursor: 'pointer', fontSize: '11px', letterSpacing: '1px',
            textTransform: 'uppercase', marginBottom: '24px',
          }}
        >
          ← Back to {systemName ?? activeSystem?.systemName}
        </button>

        <h2 style={{ margin: '0 0 4px', fontSize: '22px', color: '#fff' }}>
          {activeMoon.name}
        </h2>
        <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
          Moon of {activeMoon.parentPlanet}
        </p>

        {activeMoon.averageTemperatureC !== null && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#7CBDBD', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Avg. Temperature
            </div>
            <div style={{ fontSize: '15px' }}>{activeMoon.averageTemperatureC}°C</div>
          </div>
        )}

        {activeMoon.terrain.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#7CBDBD', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Terrain
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {activeMoon.terrain.map(t => (
                <span key={t} style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '4px', padding: '3px 8px', fontSize: '12px',
                  color: 'rgba(255,255,255,0.75)',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeMoon.atmosphere && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#7CBDBD', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Atmosphere
            </div>
            <div style={{ fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.6)' }}>
              {activeMoon.atmosphere.type}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {activeMoon.atmosphere.composition.map(c => (
                <span key={c} style={{
                  background: 'rgba(124,189,189,0.1)', border: '1px solid rgba(124,189,189,0.25)',
                  borderRadius: '4px', padding: '3px 8px', fontSize: '12px', color: '#7CBDBD',
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {!activeMoon.atmosphere && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#7CBDBD', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Atmosphere
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>None</div>
          </div>
        )}
      </div>
    </div>
  );
};
