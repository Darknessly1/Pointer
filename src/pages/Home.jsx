import "../App.css"

const Home = () => {
    return (
        <>
            <div className="grid grid-cols-2 border-4 border-black p-7 rounded-3xl">
                <div className="">
                    <h1 className="font-bold text-7xl font-custom mb-10 text-shadow">
                        Effortless Schedule Management for Hourly Teams
                    </h1>
                    <p className="mt-4 text-xl">
                        <span> Streamline worker scheduling and payroll tracking with precision and ease.</span>
                        <span>  Designed to save time and boost productivity for hourly-based businesses.</span>
                    </p>
                    <p>
                        <h1 className="h1-style mt-3">Hi, Fell Free to Join!</h1>
                    </p>
                </div>

                <div className="w-full mr-20">
                    <img
                        src="./pointer1.png"
                        alt="Pointer"
                    />
                </div>
            </div>

            <div>
                <div className="mt-10 flex items-center justify-center ">
                    <span className="absolute mx-auto py-4 flex border w-fit bg-gradient-to-r blur-xl from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-6xl box-content font-extrabold text-transparent text-center select-none">
                        Explore More Sections in Details
                    </span>
                    <h1
                        className="relative font-custom top-0 w-fit h-auto py-4 justify-center flex bg-gradient-to-r items-center from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-6xl font-extrabold text-transparent text-center ">
                        Explore More Sections in Details
                    </h1>
                </div>

                <div className="flex min-h-screen items-center justify-center text-black rounded"
                    style={{ marginTop: '-120px' }}
                >

                    <div className="mr-4 max-w-sm bg-white p-6 rounded-xl space-y-2  border-t-2 border-l-2  border-r-8 border-b-8 border-black">
                        <img src="https://svgur.com/i/1BbM.svg" alt="" className="rounded-xl " />
                        <button
                            className="bg-blue-gray-600/50 text-white border-2 border-black rounded-full p-2 text-sm font-bold"
                        >
                            Fast Handling
                        </button>
                        {/* <p className="">Published 21 Dec 2023</p> */}
                        <h1 className="font-bold text-2xl">Manage Your Workers Schudle</h1>
                        <p className="">These languages are the backbone of every website, defining structure, content, and presentation.</p>


                        <div className="flex  items-center space-x-4 " >
                            <img src="https://i.ibb.co/6FD1R8H/image-avatar.webp" alt="" className=" h-10 w-10 " />
                            <h1 className="font-bold">Greg Hooper</h1>

                        </div>
                    </div>

                    <div className="mr-4 max-w-sm bg-white p-6 rounded-xl space-y-2  border-t-2 border-l-2  border-r-8 border-b-8 border-black">
                        <img src="https://svgur.com/i/1BbM.svg" alt="" className="rounded-xl " />
                        <button
                            className="bg-blue-gray-600/50 text-white border-2 border-black rounded-full p-2 text-sm font-bold"
                        >
                            Orgnized tables
                        </button>
                        {/* <p className="">Published 21 Dec 2023</p> */}
                        <h1 className="font-bold text-2xl">More Orgnized Table For Easy Navigation</h1>
                        <p className="">These languages are the backbone of every website, defining structure, content, and presentation.</p>


                        <div className="flex  items-center space-x-4 " >
                            <img src="https://i.ibb.co/6FD1R8H/image-avatar.webp" alt="" className=" h-10 w-10 " />
                            <h1 className="font-bold">Greg Hooper</h1>

                        </div>
                    </div>

                    <div className="max-w-sm bg-white p-6 rounded-xl space-y-2  border-t-2 border-l-2  border-r-8 border-b-8 border-black">
                        <img src="https://svgur.com/i/1BbM.svg" alt="" className="rounded-xl " />
                        <button
                            className="bg-blue-gray-600/50 text-white border-2 border-black rounded-full p-2 text-sm font-bold"
                        >
                            Easy Use
                        </button>
                        {/* <p className="">Published 21 Dec 2023</p> */}
                        <h1 className="font-bold text-2xl">The Easiest Way To Use Complicated Data</h1>
                        <p className="">These languages are the backbone of every website, defining structure, content, and presentation.</p>


                        <div className="flex  items-center space-x-4 " >
                            <img src="https://i.ibb.co/6FD1R8H/image-avatar.webp" alt="" className=" h-10 w-10 " />
                            <h1 className="font-bold">Greg Hooper</h1>

                        </div>
                    </div>

                </div>


                


            </div>
        </>
    );
};

export default Home;
