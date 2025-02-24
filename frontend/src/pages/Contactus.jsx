import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faEnvelope, faPhoneVolume, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Contactus = () => {
    return (
        <div>
            <div className="max-w-screen-2xl mx-auto p-5">
                <div
                    className="mb-8"
                >
                    <h1 className="text-6xl font-bold text-center text-gray-800 ">Contact Us</h1>
                    <p className="text-center font-bold text-black">We are here to help you. If you have any questions or need assistance, please contact us.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 border-2 bg-gray-800/20 border-black p-2 rounded-3xl">
                    <div className=" md:col-span-4 p-10 text-white rounded-3xl">
                        <div>
                            <h3 className="text-lg sm:text-2xl leading-normal font-extrabold tracking-tight">
                                Chat <span className="text-blue-gray-800">with us</span>
                            </h3>

                            <p className=" mb-4 text-sm leading-7 text-black font-bold">
                                Speak to our friendly team via live chat.
                            </p>

                            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
                                <div className="text-lg text-black ">
                                    <FontAwesomeIcon icon={faComments} />
                                </div>
                                <a href="#" className="font-bold text-black hover:underline transition-colors cursor-pointer w-fit">
                                    Start a live chat
                                </a>

                                <div className="text-lg text-black">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <a href="#" className="font-bold text-black hover:underline transition-colors cursor-pointer w-fit">
                                    Reach us via email
                                </a>

                                <div className="text-lg text-black">
                                    <FontAwesomeIcon icon={faXTwitter} size="lg" />
                                </div>
                                <a href="#" className="font-bold text-black hover:underline transition-colors cursor-pointer w-fit">
                                    Reach us via X (Twitter)
                                </a>
                            </div>
                        </div>

                        <div className='mt-8'>
                            <h3 className="text-lg sm:text-2xl leading-normal font-extrabold tracking-tight">
                                Call <span className="text-blue-gray-800">us</span>
                            </h3>

                            <p className=" mb-4 text-sm leading-7 text-black font-bold">
                                Call our team from Monday to Friday, 9am to 5pm.
                            </p>

                            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
                                <div className="text-lg text-black ">
                                    <FontAwesomeIcon icon={faPhoneVolume} />
                                </div>
                                <a href="#" className="font-bold text-black hover:underline transition-colors cursor-pointer w-fit">
                                    +211 123 456 789
                                </a>
                            </div>
                        </div>

                        <div className='mt-8'>
                            <h3 className="text-lg sm:text-2xl leading-normal font-extrabold tracking-tight">
                                Visit <span className="text-blue-gray-800">us</span>
                            </h3>

                            <p className=" mb-4 text-sm leading-7 text-black font-bold">
                                Visit our office for consulting and more info.
                            </p>

                            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
                                <div className="text-lg text-black ">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                </div>
                                <a href="#" className="font-bold text-black hover:underline transition-colors cursor-pointer w-fit">
                                    1234 Street Name, City Name, Country Name
                                </a>
                            </div>
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