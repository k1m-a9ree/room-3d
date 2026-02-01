import React, { useState, useEffect, Suspense, useRef } from "react";
import { useParams } from "react-router";
import axios from 'axios';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF, Html } from "@react-three/drei";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function FPSControls() {
    const { camera } = useThree();
    const [move, setMove] = useState({ forward: false, backward: false, left: false, right: false });
    const speed = 0.05; 

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': setMove(m => ({ ...m, forward: true })); break;
                case 'KeyS': case 'ArrowDown': setMove(m => ({ ...m, backward: true })); break;
                case 'KeyA': case 'ArrowLeft': setMove(m => ({ ...m, left: true })); break;
                case 'KeyD': case 'ArrowRight': setMove(m => ({ ...m, right: true })); break;
            }
        };
        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': setMove(m => ({ ...m, forward: false })); break;
                case 'KeyS': case 'ArrowDown': setMove(m => ({ ...m, backward: false })); break;
                case 'KeyA': case 'ArrowLeft': setMove(m => ({ ...m, left: false })); break;
                case 'KeyD': case 'ArrowRight': setMove(m => ({ ...m, right: false })); break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        if (move.forward) camera.translateZ(-speed);
        if (move.backward) camera.translateZ(speed);
        if (move.left) camera.translateX(-speed);
        if (move.right) camera.translateX(speed);
    });

    return <PointerLockControls selector="#canvas-container" />;
}

function Model({ url }) {
    const { scene } = useGLTF(url);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyX') {
                scene.rotation.x += Math.PI / 2;
            }
            if (e.code === 'KeyY') {
                scene.rotation.y += Math.PI / 2;
            }
            if (e.code === 'KeyZ') {
                scene.rotation.z += Math.PI / 2;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [scene]);

    return <primitive object={scene} />;
}

function RoomDetail() {
    const { urlid } = useParams();
    const [roomData, setRoomData] = useState(null);

    useEffect(() => {
        const getRoom = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/room/${urlid}`);
                setRoomData(res.data.room);
            } catch (error) {
                console.log(error);
            }
        }
        getRoom();
    }, [urlid]);

    return (
        <div className="container mx-auto p-4">
            {roomData && (
                <>
                    <h1 className="text-3xl font-bold mb-4">{roomData.name}</h1>
                    <p className="mb-4 text-gray-600">{roomData.description}</p>
                    
                    {/* 안내 문구 추가 (중요!) */}
                    <div className="alert shadow-sm mb-2 text-sm">
                        <div>
                            <p><b>조작법:</b> 화면 클릭 후, <b>WASD</b> 이동 / 마우스 회전</p>
                            <p><b>집 회전:</b> <b>X, Y, Z</b> 키를 눌러 집 회전</p>
                            <p className="font-bold text-error mt-1">아래 사진을 보려면 ESC를 누르세요</p>
                        </div>
                    </div>
                </>
            )}

            <div id="canvas-container" className="w-full h-[600px] bg-gray-200 rounded-xl overflow-hidden shadow-lg border relative cursor-pointer">
                {roomData?.glb?.name ? (
                    <Canvas shadows dpr={[1, 2]} camera={{ fov: 60, position: [0, 2, 8] }}>
                        <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
                            
                            <ambientLight intensity={0.6} />
                            <pointLight position={[10, 20, 10]} />
                            
                            <Model url={`${SERVER_URL}/api/glbs/${roomData.glb.name}`} />

                            <FPSControls />

                        </Suspense>
                    </Canvas>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        {roomData ? "3D 모델이 없습니다." : "데이터 로딩중..."}
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4">사진</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
                {roomData?.images?.map((img, idx) => (
                    <div key={idx} className="card bg-base-100 shadow-xl overflow-hidden">
                        <figure>
                            <img src={`${SERVER_URL}/api/images/${img.name}`} alt="room" className="w-full h-48 object-cover hover:scale-105 transition-transform" />
                        </figure>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RoomDetail;