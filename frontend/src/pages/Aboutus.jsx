export const Aboutus = () => {
    return (
        <>
            <h1 className="m-5 text-6xl font-bold text-center text-gray-800">About Our Web Site And Services</h1>

            <div className="border-2 max-w-screen-2xl mx-auto border-black rounded-3xl bg-white/40"
                style={{ marginTop: "15vh" }}
            >
                <div className="grid grid-cols-2  px-4 py-16 mx-auto sm:max-w-xl  md:max-w-full lg:max-w-screen-2xl md:px-24 lg:px-8 lg:py-5">

                    <div className="grid gap-3 row-gap-10 sm:grid-cols-2 lg:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full">
                                <svg
                                    className="w-7 h text-black"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M8.291,18.709,4.182,22.818c-.419.419-1.43.086-2.258-.742s-1.161-1.839-.742-2.258l4.11-4.11"
                                        fill="none"
                                        stroke="currentColor"
                                    />
                                    <ellipse
                                        cx="19.078"
                                        cy="4.922"
                                        fill="none"
                                        rx="2.5"
                                        ry="4.95"
                                        stroke="currentColor"
                                        transform="translate(2.107 14.932) rotate(-45)"
                                    />
                                    <path
                                        d="M9.185,9.815,5.3,13.7c-.7.7-.143,2.382,1.238,3.762S9.6,19.4,10.3,18.7l3.885-3.885"
                                        fill="none"
                                        stroke="currentColor"
                                    />
                                    <path
                                        d="M15.578,1.422,9.422,7.578c-.976.976-.2,3.335,1.732,5.268s4.292,2.708,5.268,1.732l6.156-6.156"
                                        fill="none"
                                        stroke="currentColor"
                                    />
                                </svg>
                            </div>
                            <h6 className="mb-2 font-semibold leading-5">Explore space</h6>
                            <p className="mb-3 text-sm text-gray-900">
                                We are all connected to the universe atomically, strong bonds.
                            </p>
                            <ul className="mb-4 -ml-1 space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-1">
                                        <svg
                                            className="w-5 h-5 mt-px text-black"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </span>
                                    Infinity
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-1">
                                        <svg
                                            className="w-5 h-5 mt-px text-black"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </span>
                                    Stars
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-1">
                                        <svg
                                            className="w-5 h-5 mt-px text-black"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </span>
                                    Black Holes
                                </li>
                            </ul>
                            <a
                                href="/"
                                aria-label=""
                                className="inline-flex items-center font-semibold transition-colors duration-200 text-blue-gray-500 hover:text-deep-purple-800"
                            >
                                Learn more
                            </a>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full ">
                                <svg
                                    className="w-7 h-7 text-black"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M8,13l3,3,9.379-9.379a2.122,2.122,0,0,0,0-3h0a2.122,2.122,0,0,0-3,0Z"
                                        fill="none"
                                        stroke="currentColor"
                                    />
                                    <polyline
                                        fill="none"
                                        points="10 11 10 6 6 2 3 5 7 9"
                                        stroke="currentColor"
                                    />
                                    <polyline
                                        fill="none"
                                        points="15 12 15 17 19 21 22 18 18 14"
                                        stroke="currentColor"
                                    />
                                    <path d="M8,23a7,7,0,0,1-7-7" fill="none" stroke="currentColor" />
                                    <path d="M8,19a3,3,0,0,1-3-3" fill="none" stroke="currentColor" />
                                </svg>
                            </div>
                            <h6 className="mb-2 font-semibold leading-5">First contact</h6>
                            <p className="mb-3 text-sm text-gray-900">
                                For those who have seen the Earth from space or in dreams.
                            </p>
                            <ul className="mb-4 -ml-1 space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-1">
                                        <svg
                                            className="w-5 h-5 mt-px text-black"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </span>
                                    Listen
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-1">
                                        <svg
                                            className="w-5 h-5 mt-px text-black"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </span>
                                    Communicate
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-1">
                                        <svg
                                            className="w-5 h-5 mt-px text-black"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </span>
                                    Run
                                </li>
                            </ul>
                            <a
                                href="/"
                                aria-label=""
                                className="inline-flex items-center font-semibold transition-colors duration-200 text-blue-gray-500 hover:text-deep-purple-800"
                            >
                                Learn more
                            </a>
                        </div>
                    </div>

                    <div className="shadow-lg shadow-black absolute bg-gray-300 border-2 max-w-screen-sm z-10 border-black m-2 rounded-3xl p-6 flex flex-col mb-6 lg:flex-row md:mb-10"
                        style={{
                            height: "60vh",
                            paddingTop: "10vh",
                            top: "-10vh",
                            left: "95vh",
                        }}
                    >
                        <div>
                            <h2 className="max-w-md mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none xl:max-w-lg">
                                To conquer the space you must trust.
                            </h2>
                            <p className="text-base text-gray-700 md:text-lg">
                                For those who have seen the Earth from space, and for the hundreds
                                and perhaps thousands more who will, the experience most certainly
                                changes your perspective.
                            </p>
                        </div>
                    </div>

                    <div>

                    </div>


                </div>
            </div>

            <div className="relative grid grid-cols-2 overflow-hidden"
                style={{ height: "130vh" }}
            >
                {/* first one */}
                <div className="absolute px-4 py-16 mt-20 z-10"
                    style={{
                        marginRight: "30%",
                        left: "30%",
                    }}
                >
                    <div className="w-full border-2 border-black rounded-3xl bg-gray-300 px-4 py-16 mx-auto shadow-xl shadow-black">
                        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                            <div>
                                <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                                    Just do it
                                </p>
                            </div>
                            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                                <span className="relative inline-block">
                                    <svg
                                        viewBox="0 0 52 24"
                                        fill="currentColor"
                                        className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                                    >
                                        <defs>
                                            <pattern
                                                id="a0b40128-6963-4319-aeeb-471e92fa2d74"
                                                x="0"
                                                y="0"
                                                width=".135"
                                                height=".30"
                                            >
                                                <circle cx="1" cy="1" r=".7" />
                                            </pattern>
                                        </defs>
                                        <rect
                                            fill="url(#a0b40128-6963-4319-aeeb-471e92fa2d74)"
                                            width="52"
                                            height="24"
                                        />
                                    </svg>
                                    <span className="relative">You</span>
                                </span>{' '}
                                miss 100% of the shots you {"don't"} take
                            </h2>
                            <p className="text-base text-gray-700 md:text-lg">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                accusantium doloremque rem aperiam, eaque ipsa quae.
                            </p>
                        </div>
                        <div className="max-w-lg space-y-3 sm:mx-auto lg:max-w-xl">
                            <div className="border-2 border-black bg-gray-300 cursor-pointer flex items-center p-2 duration-300 transform rounded shadow hover:scale-105 sm:hover:scale-110">
                                <div className="mr-2">
                                    <svg
                                        className="w-6 h-6 text-blue-gray-500 sm:w-8 sm:h-8"
                                        stroke="currentColor"
                                        viewBox="0 0 52 52"
                                    >
                                        <polygon
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                            points="29 13 14 29 25 29 23 39 38 23 27 23"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-800">
                                    Change the world by being yourself.
                                </span>
                            </div>
                            <div className="border-2 border-black bg-gray-300 cursor-pointer flex items-center p-2 duration-300 transform  rounded shadow hover:scale-105 sm:hover:scale-110">
                                <div className="mr-2">
                                    <svg
                                        className="w-6 h-6 text-blue-gray-500 sm:w-8 sm:h-8"
                                        stroke="currentColor"
                                        viewBox="0 0 52 52"
                                    >
                                        <polygon
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                            points="29 13 14 29 25 29 23 39 38 23 27 23"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-800">Die with memories, not dreams.</span>
                            </div>
                            <div className="border-2 border-black bg-gray-300 cursor-pointer flex items-center p-2 duration-300 transform rounded shadow hover:scale-105 sm:hover:scale-110">
                                <div className="mr-2">
                                    <svg
                                        className="w-6 h-6 text-blue-gray-500 sm:w-8 sm:h-8"
                                        stroke="currentColor"
                                        viewBox="0 0 52 52"
                                    >
                                        <polygon
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                            points="29 13 14 29 25 29 23 39 38 23 27 23"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-800">What we think, we become.</span>
                            </div>
                            <div className="border-2 border-black bg-gray-300 cursor-pointer flex items-center p-2 duration-300 transform rounded shadow hover:scale-105 sm:hover:scale-110">
                                <div className="mr-2">
                                    <svg
                                        className="w-6 h-6 text-blue-gray-500 sm:w-8 sm:h-8"
                                        stroke="currentColor"
                                        viewBox="0 0 52 52"
                                    >
                                        <polygon
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                            points="29 13 14 29 25 29 23 39 38 23 27 23"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-800">
                                    Be so good they can’t ignore you.
                                </span>
                            </div>
                            <div className="border-2 border-black bg-gray-300 cursor-pointer flex items-center p-2 duration-300 transform  rounded shadow hover:scale-105 sm:hover:scale-110">
                                <div className="mr-2">
                                    <svg
                                        className="w-6 h-6 text-blue-gray-500 sm:w-8 sm:h-8"
                                        stroke="currentColor"
                                        viewBox="0 0 52 52"
                                    >
                                        <polygon
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                            points="29 13 14 29 25 29 23 39 38 23 27 23"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-800">
                                    Simplicity is the ultimate sophistication.
                                </span>
                            </div>
                            <div className="border-2 border-black bg-gray-300 cursor-pointer flex items-center p-2 duration-300 transform  rounded shadow hover:scale-105 sm:hover:scale-110">
                                <div className="mr-2">
                                    <svg
                                        className="w-6 h-6 text-blue-gray-500 sm:w-8 sm:h-8"
                                        stroke="currentColor"
                                        viewBox="0 0 52 52"
                                    >
                                        <polygon
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                            points="29 13 14 29 25 29 23 39 38 23 27 23"
                                        />
                                    </svg>
                                </div>
                                <span className="text-gray-800">
                                    Yesterday you said tomorrow. Just do it today.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                </div>

                {/* second one */}
                <div className="absolute px-4 py-20 ml-20"
                    style={{ marginLeft: "10%" }}
                >
                    <div className="w-full border-2 border-black rounded-3xl p-3 bg-white/40 py-5">
                        <div className="max-w-xl pr-16 mx-auto mb-10">
                            <div className="grid gap-5 row-gap-5 sm:grid-cols-2">
                                <div className="max-w-md ml-12">
                                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                                        <svg
                                            className="w-12 h-12 text-blue-gray-500"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </div>
                                    <h6 className="mb-2 font-semibold leading-5">When has justice</h6>
                                    <p className="text-sm text-gray-700">
                                        Rough pomfret lemon shark plownose chimaera southern sandfish
                                        kokanee northern sea robin Antarctic cod. Yellow-and-black
                                        triplefin.
                                    </p>
                                </div>

                                <div className="max-w-md">

                                </div>

                                <div className="max-w-md ml-12">
                                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                                        <svg
                                            className="w-12 h-12 text-blue-gray-500"
                                            stroke="currentColor"
                                            viewBox="0 0 52 52"
                                        >
                                            <polygon
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                fill="none"
                                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                                            />
                                        </svg>
                                    </div>
                                    <h6 className="mb-2 font-semibold leading-5">A slice of heaven</h6>
                                    <p className="text-sm text-gray-700">
                                        Disrupt inspire and think tank, social entrepreneur but
                                        preliminary thinking think tank compelling. Inspiring, invest
                                        synergy capacity.
                                    </p>
                                </div>
                                <div className="max-w-md">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="absolute px-4 py-16"
                        style={{ marginTop: "50vh" }}
                    >
                        <div className="w-full border-2 border-black rounded-3xl p-3 bg-white/40 py-5">
                            <div className="max-w-xl pr-16 mx-auto mb-10">
                                <div className="grid gap-5 row-gap-5 sm:grid-cols-2">
                                    <div className="max-w-md">

                                    </div>

                                    <div className="max-w-md ml-14">
                                        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                                            <svg
                                                className="w-12 h-12 text-blue-gray-500"
                                                stroke="currentColor"
                                                viewBox="0 0 52 52"
                                            >
                                                <polygon
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    fill="none"
                                                    points="29 13 14 29 25 29 23 39 38 23 27 23"
                                                />
                                            </svg>
                                        </div>
                                        <h6 className="mb-2 font-semibold leading-5">When has justice</h6>
                                        <p className="text-sm text-gray-700">
                                            Rough pomfret lemon shark plownose chimaera southern sandfish
                                            kokanee northern sea robin Antarctic cod. Yellow-and-black
                                            triplefin.
                                        </p>
                                    </div>

                                    <div className="max-w-md">

                                    </div>
                                    <div className="max-w-md ml-14">
                                        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                                            <svg
                                                className="w-12 h-12 text-blue-gray-500"
                                                stroke="currentColor"
                                                viewBox="0 0 52 52"
                                            >
                                                <polygon
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    fill="none"
                                                    points="29 13 14 29 25 29 23 39 38 23 27 23"
                                                />
                                            </svg>
                                        </div>
                                        <h6 className="mb-2 font-semibold leading-5">A slice of heaven</h6>
                                        <p className="text-sm text-gray-700">
                                            Disrupt inspire and think tank, social entrepreneur but
                                            preliminary thinking think tank compelling. Inspiring, invest
                                            synergy capacity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};