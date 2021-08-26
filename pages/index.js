import { Suspense, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';

function Box() {
  return (
    <mesh>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  );
}

function Model({ url }) {
  const gltf = useGLTF(url, true);
  return <primitive object={gltf.scene} dispose={null} scale={[2.5, 2.5, 2.5]} />;
}

const HTMLContent = ({ domContent, children, bgColor, modelPath, position }) => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.001));
  const [refItem, inView] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [bgColor, inView]);
  return (
    <group position={[0, position, 0]}>
      <mesh ref={ref} position={[0, -30, -90]}>
        <Model url={modelPath} />
      </mesh>
      <Html fullscreen portal={domContent}>
        <div ref={refItem} className="container">
          <h1 className="title">{children}</h1>
        </div>
      </Html>
    </group>
  );
};

export default function Home() {
  const domContent = useRef();

  return (
    <div className={styles.container}>
      <Head>
        <title>ByLoot</title>
        <meta name="description" content="ByLoot Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>ByLoot</h1>
        <p>Coming Soon</p>
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.8} />
            <spotLight position={[10, 15, 100]} angle={0.9} />
            <HTMLContent
              domContent={domContent}
              bgColor="#000"
              modelPath="/scene.gltf"
              position={25}
            />
            {/* <OrbitControls /> */}
          </Suspense>
        </Canvas>
      </main>

      <footer className={styles.footer}>
        <a href="https://querymobile.co" target="_blank" rel="noopener noreferrer">
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/logo.png" alt="QueRy Logo" width={32} height={26} />
          </span>
        </a>
      </footer>
    </div>
  );
}
