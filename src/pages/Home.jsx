import "../App.css"

const Home = () => {
    return (
        <>
            <div className="grid grid-cols-2">
                <div className="">
                    <h1 className="text-8xl font-custom mt-10 text-shadow">
                        Orgnize your business management 
                    </h1>
                </div>
                <div className="w-full mr-20">
                    <img 
                        src="./pointer1.png"
                        alt="Pointer"
                    />
                </div>
            </div>
        </>
    );
};

export default Home;
