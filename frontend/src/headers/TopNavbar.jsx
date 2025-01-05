import {
    Navbar,
    Typography,
    IconButton,
} from "@material-tailwind/react";

import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

import {
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Drawer,
    Card,
} from "@material-tailwind/react";

import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    InboxIcon,
} from "@heroicons/react/24/solid";

import {
    ChevronRightIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

import { useAuthContext } from "../context/AuthContext";

import { useEffect, useRef, useState } from "react";

export default function TopNavbar() {

    const [open, setOpen] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const closeDrawer = () => setIsDrawerOpen(false);
    const { authUser, logout } = useAuthContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);


    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const openDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        if (isDrawerOpen) {
            setTimeout(() => {
                const backdrop = document.querySelector(".absolute.inset-0");
                if (backdrop) {
                    backdrop.style.opacity = "0";
                    backdrop.style.pointerEvents = "none";
                }
            }, 50);
        }
    }, [isDrawerOpen]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    return (
        <div className="w-full mt-4">
            <div className="w-full mt-4">
                <Navbar
                    variant="gradient"
                    color="blue-gray"
                    className="mx-auto max-w-screen-xl from-blue-gray-900/20 to-blue-gray-800/30 px-3 py-3 rounded-full"
                >
                    <div className="grid grid-cols-2">
                        <div className="ml-7 rounded-2xl w-fit">
                            {authUser && (
                                <IconButton variant="text" size="lg" onClick={openDrawer}>
                                    {isDrawerOpen ? (
                                        <XMarkIcon className="h-8 w-8 stroke-2" />
                                    ) : (
                                        <Bars3Icon className="h-8 w-8 stroke-2" />
                                    )}
                                </IconButton>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-y-4 text-white" style={{ marginRight: '320px' }}>
                            <Typography
                                className="mr-4 ml-2 cursor-pointer py-1.5 text-3xl font-bold whitespace-nowrap"
                            >
                                <Link to="/">ShiftTrack</Link>
                            </Typography>

                            <Typography
                                className="mr-4 ml-2 cursor-pointer py-1.5 text-xl font-bold whitespace-nowrap"
                            >
                                <Link to="/guide">Guide</Link>
                            </Typography>

                            <Typography
                                className="mr-4 ml-2 cursor-pointer py-1.5 text-xl font-bold whitespace-nowrap"
                            >
                                <Link to="/contactus">Contact Us</Link>
                            </Typography>

                            <Typography
                                className="mr-4 ml-2 cursor-pointer py-1.5 text-xl font-bold whitespace-nowrap"
                                style={{ marginRight: '100px' }}
                            >
                                <Link to="/aboutus">About Us</Link>
                            </Typography>

                            {authUser && (
                                <div className="ml-auto flex gap-1 md:mr-4">
                                    <IconButton variant="text" color="white">
                                        <BellIcon className="h-4 w-4" />
                                    </IconButton>
                                </div>
                            )}

                            <div className="flex items-center">
                                {!authUser ? (
                                    <>
                                        <button>
                                            <Link
                                                to="/login"
                                                className="bg-gradient-to-r from-blue-gray-900 to-blue-gray-800 hover:from-blue-gray-600 hover:to-blue-gray-900/30 rounded-2xl px-4 py-1 text-white m-6 font-bold"
                                            >
                                                Login
                                            </Link>
                                        </button>
                                        <button>
                                            <Link
                                                to="/register"
                                                className="bg-gradient-to-r from-blue-gray-900 to-blue-gray-800 hover:from-blue-gray-600 hover:to-blue-gray-900/30 rounded-2xl px-4 py-1 text-white font-bold"
                                            >
                                                Register
                                            </Link>
                                        </button>
                                    </>
                                ) : (
                                    <div className="relative inline-block text-left" ref={dropdownRef}>
                                        <p
                                            className="text-xl font-bold m-1 ml-7 mr-7 rounded-xl bg-blue-gray-500 px-5 cursor-pointer"
                                            onClick={() => setDropdownOpen((prev) => !prev)}
                                        >
                                            {authUser.fullName}
                                        </p>
                                        {dropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                <ul className="py-1 text-gray-700">
                                                    <li>
                                                        <Link
                                                            to="/profile"
                                                            className="block px-4 py-2 hover:bg-gray-100"
                                                        >
                                                            Profile
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            to="/settings"
                                                            className="block px-4 py-2 hover:bg-gray-100"
                                                        >
                                                            Settings
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={logout}
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                        >
                                                            Logout
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Navbar>
            </div >
            {authUser && (
                <div>
                    {isDrawerOpen && (
                        <div className="">

                            <Drawer
                                open={isDrawerOpen}
                                onClose={closeDrawer}
                                hideBackdrop={true}
                            >
                                <Card
                                    color="transparent"
                                    shadow={false}
                                    className="h-[calc(100vh-2rem)] w-full p-4"
                                >
                                    <div className="mb-2 flex items-center gap-4 p-4" >
                                        <Typography variant="h5" color="blue-gray">
                                            <Link to="/" className="flex items-center">
                                                Pointer
                                            </Link>
                                        </Typography>
                                    </div>

                                    <List>
                                        <Accordion
                                            open={open === 1}
                                            icon={
                                                <ChevronDownIcon
                                                    strokeWidth={2.5}
                                                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""
                                                        }`}
                                                />
                                            }
                                        >
                                            <ListItem className="p-0" selected={open === 1}>
                                                <AccordionHeader
                                                    onClick={() => handleOpen(1)}
                                                    className="border-b-0 p-3"
                                                >
                                                    <ListItemPrefix>
                                                        <PresentationChartBarIcon className="h-5 w-5" />
                                                    </ListItemPrefix>
                                                    <Typography color="blue-gray" className="mr-auto font-normal">

                                                        Dashboard
                                                    </Typography>
                                                </AccordionHeader>
                                            </ListItem>

                                            <AccordionBody className="py-1">
                                                <List className="p-0">
                                                    <Link to="/pages/test" className="flex items-center">
                                                        <ListItem>

                                                            <ListItemPrefix>
                                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                            </ListItemPrefix>
                                                            List/Adding/Info of Employees
                                                        </ListItem>
                                                    </Link>
                                                    <Link to="/pages/reporting" className="flex items-center">
                                                        <ListItem>
                                                            <ListItemPrefix>
                                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                            </ListItemPrefix>
                                                            Reporting
                                                        </ListItem>
                                                    </Link>
                                                    <Link to="/projects">
                                                        <ListItem>
                                                            <ListItemPrefix>
                                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                            </ListItemPrefix>
                                                            Current Projects
                                                        </ListItem>
                                                    </Link>
                                                </List>
                                            </AccordionBody>
                                        </Accordion>


                                        <Accordion
                                            open={open === 2}
                                            icon={
                                                <ChevronDownIcon
                                                    strokeWidth={2.5}
                                                    className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""
                                                        }`}
                                                />
                                            }
                                        >
                                            <ListItem className="p-0" selected={open === 2}>
                                                <AccordionHeader
                                                    onClick={() => handleOpen(2)}
                                                    className="border-b-0 p-3"
                                                >
                                                    <ListItemPrefix>
                                                        <ShoppingBagIcon className="h-5 w-5" />
                                                    </ListItemPrefix>
                                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                                        Employee Space
                                                    </Typography>
                                                </AccordionHeader>
                                            </ListItem>
                                            <AccordionBody className="py-1">
                                                <List className="p-0">
                                                    <Link to="/schedulestable">
                                                        <ListItem>
                                                            <ListItemPrefix>
                                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                            </ListItemPrefix>
                                                            Schedule
                                                        </ListItem>
                                                    </Link>
                                                    <Link to="/allemp">
                                                        <ListItem>
                                                            <ListItemPrefix>
                                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                            </ListItemPrefix>
                                                            Teams Discussion
                                                        </ListItem>
                                                    </Link>
                                                </List>
                                            </AccordionBody>
                                        </Accordion>

                                        <hr className="my-2 border-blue-gray-50" />

                                        <Link to="/inbox">
                                            <ListItem>
                                                <ListItemPrefix>
                                                    <InboxIcon className="h-5 w-5" />
                                                </ListItemPrefix>
                                                Inbox
                                            </ListItem>
                                        </Link>

                                        <Link to="/profile">
                                            <ListItem>
                                                <ListItemPrefix>
                                                    <UserCircleIcon className="h-5 w-5" />
                                                </ListItemPrefix>
                                                Profile
                                            </ListItem>
                                        </Link>

                                        <Link to="/settings">
                                            <ListItem>
                                                <ListItemPrefix>
                                                    <Cog6ToothIcon className="h-5 w-5" />
                                                </ListItemPrefix>
                                                Settings
                                            </ListItem>
                                        </Link>
                                    </List>
                                </Card>
                            </Drawer>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}