import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faComments, faEnvelope, faXTwitter  } from '@fortawesome/free-solid-svg-icons';



const Contactus = () => {
    return (
        <div>
            <div className="max-w-screen-xl mx-auto p-5">
                <div
                    className="mb-8"
                >
                    <h1 className="text-6xl font-bold text-center text-gray-800 ">Contact Us</h1>
                    <p className="text-center font-bold text-black">We are here to help you. If you have any questions or need assistance, please contact us.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 border-2 bg-gray-800/30 border-black p-2 rounded-3xl">
                    <div className=" md:col-span-4 p-10 text-white rounded-3xl">
                        <h3 className="text-lg sm:text-2xl leading-normal font-extrabold tracking-tight">
                            Chat <span className="text-blue-gray-800">with us</span>
                        </h3>

                        <p className="mt-4 leading-7 text-gray-200">
                            Speak to our friendly team via live chat.
                        </p>

                        <div className="mb-4 flex items-center mt-5">
                            <span className="mr-2 text-lg text-white">
                                <FontAwesomeIcon icon={faComments} />
                            </span>
                            <span className=" font-bold underline">Start a live chat</span>
                        </div>

                        <div className="mb-4 flex items-center mt-5">
                            <span className="mr-2 text-lg text-white">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                            <span className=" font-bold underline">Reach us via email</span>
                        </div>

                        <div className="mb-4 flex items-center mt-5">
                            <span className="mr-2 text-lg text-white">
                                <FontAwesomeIcon icon={faXTwitter} />
                            </span>
                            <span className=" font-bold underline">Reach us via email</span>
                        </div>

                        <h3 className="text-lg sm:text-2xl leading-normal font-extrabold tracking-tight">
                            Get In <span className="text-blue-gray-800">Touch</span>
                        </h3>

                        <div className="flex items-center mt-5">
                            <svg className="h-6 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <span className="text-sm">+93 749 99 65 50</span>
                        </div>

                        <h3 className="text-lg sm:text-2xl leading-normal font-extrabold tracking-tight">
                            Get In <span className="text-blue-gray-800">Touch</span>
                        </h3>

                        <div className="flex items-center mt-5">
                            <svg className="h-6 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                            <span className="text-sm">24/7</span>
                        </div>

                        <div className="flex items-center mt-5">
                            <svg className="h-14     mr-2 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span className="text-sm">House #14, Street #12, Darulaman Road, Kabul, Afghanistan.</span>
                        </div>
                    </div>


                    <form action="https://fabform.io/f/{form-id}" method="post" className="md:col-span-8 p-10">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-black text-sm font-bold mb-2"
                                    htmlFor="grid-first-name">
                                    First Name
                                </label>
                                <input
                                    className=" border-2 border-black appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name" type="text" placeholder="Jane"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-black text-sm font-bold mb-2"
                                    htmlFor="grid-last-name">
                                    Last Name
                                </label>
                                <input
                                    className=" border-2 border-black appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-last-name" type="text" placeholder="Doe"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-black text-sm font-bold mb-2"
                                    htmlFor="grid-password">
                                    Email Address
                                </label>
                                <input
                                    className=" border-2 border-black appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-email" type="email" placeholder="********@*****.**"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-black text-sm font-bold mb-2"
                                    htmlFor="grid-password">
                                    Your Message
                                </label>
                                <textarea rows="10"
                                    className=" border-2 border-black appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"></textarea>
                            </div>
                            <div className="flex justify-between w-full px-3">
                                <div className="md:flex md:items-center">
                                    <label className="block text-black font-bold">
                                        <input className="mr-2 leading-tight" type="checkbox" />
                                        <span className="text-sm">
                                            Send me your newsletter!
                                        </span>
                                    </label>
                                </div>
                                <button
                                    className="border-2 border-gray-700 shadow bg-gray-800 hover:bg-gray-400 hover:text-black hover:border-2 hover:border-black focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                                    type="submit">
                                    Send Message
                                </button>

                            </div>
                            <a href="https://veilmail.io/e/FkKh7o" className="font-medium text-blue-600 hover:underline">Or click here to reveal our protected email address</a>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default Contactus