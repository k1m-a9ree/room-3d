import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;


function RoomList() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const getRooms = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/room`);
                setRooms(res.data.rooms);
                console.log(res.data.rooms)
            } catch (error) {
                console.log(error);
            }
        }
        getRooms();
    }, [])

    return (
        <>
            <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
                {rooms.map((room) => (
                    <div
                        key={room.urlid}
                        className="card card-side bg-base-100 shadow-sm border border-base-200 transition-all overflow-hidden hover:shadow-md hover:-translate-y-1"
                    >
                        <figure className="w-2/5 min-w-[200px]">
                            <img
                                src={`${SERVER_URL}/api/images/${room.images[0].name}`}
                                alt={room.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                            />
                        </figure>

                        <div className="card-body w-3/5 p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="card-title text-2xl font-bold text-base-content">
                                    {room.name}
                                </h2>
                                <div className="badge badge-secondary badge-outline">판매 중</div>
                            </div>

                            <p className="text-base-content/70 line-clamp-2 mt-2">
                                {room.description}
                            </p>

                            <div className="card-actions justify-end mt-4">
                                <Link to={`/${room.urlid}`} className="btn btn-primary btn-md px-8 shadow-sm">
                                    자세히 보기
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Link to={'/write'} className="fixed bottom-10 right-10 btn btn-circle btn-primary btn-xl shadow-lg hover:scale-110 transition-transform z-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='size-10 fill-current'><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"></path></svg>
            </Link>
        </>
    );
}

export default RoomList;