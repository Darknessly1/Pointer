import {
    Navbar,
    Typography,
    IconButton,
} from "@material-tailwind/react";

import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

import React from "react";

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
    PowerIcon,
} from "@heroicons/react/24/solid";

import {
    ChevronRightIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function TopNavbar() {

    const [open, setOpen] = React.useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const closeDrawer = () => setIsDrawerOpen(false);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const openDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    // Remove the backdrop element when the drawer is open
    React.useEffect(() => {
        if (isDrawerOpen) {
            // Wait for the DOM to update after drawer opens
            setTimeout(() => {
                const backdrop = document.querySelector(".absolute.inset-0");
                if (backdrop) {
                    // Hide the backdrop by setting its opacity to 0 and disabling pointer events
                    backdrop.style.opacity = "0";
                    backdrop.style.pointerEvents = "none";
                }
            }, 50); // Adjust timing if necessary
        }
    }, [isDrawerOpen]);


    return (
        <div className="w-full mt-4">
            <Navbar
                variant="gradient"
                color="blue-gray"
                className=" mx-auto max-w-screen-xl from-blue-gray-900/20 to-blue-gray-800/30 px-3 py-3 rounded-full"
            >
                <div className="grid grid-cols-2">
                    <div className="ml-7 border-2 rounded-2xl w-fit">
                        <IconButton variant="text" size="lg" onClick={openDrawer}>
                            {isDrawerOpen ? (
                                <XMarkIcon className="h-8 w-8 stroke-2" />
                            ) : (
                                <Bars3Icon className="h-8 w-8 stroke-2" />
                            )}
                        </IconButton>
                    </div>

                    <div className="flex items-center justify-center gap-y-4 text-white"
                        style={{ marginRight: '320px' }}
                    >
                        <Typography
                            as="a"
                            href="#"
                            variant="h6"
                            className="mr-4 ml-2 cursor-pointer py-1.5 text-3xl"
                            style={{ marginRight: '100px' }}
                        >
                            <Link to="/">
                                ShiftTrack
                            </Link>
                        </Typography>
                        <div className="ml-auto flex gap-1 md:mr-4">
                            <Link to="/settings">
                                <IconButton variant="text" color="white">
                                    <Cog6ToothIcon className="h-4 w-4" />
                                </IconButton>
                            </Link>

                            <IconButton variant="text" color="white">
                                <BellIcon className="h-4 w-4" />
                            </IconButton>
                        </div>

                        <div>
                            <button>
                                <Link
                                    to="/login"
                                    className="bg-gradient-to-r  from-blue-gray-900 to-blue-gray-800  hover:from-blue-gray-600 hover:to-blue-gray-900/30  rounded-2xl px-4 py-2 text-white m-6 font-bold"
                                >
                                    Login
                                </Link>
                            </button>
                        </div>
                        <div>
                            <button>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r  from-blue-gray-900 to-blue-gray-800  hover:from-blue-gray-600 hover:to-blue-gray-900/30  rounded-2xl px-4 py-2 text-white font-bold"
                                >
                                    Register
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </Navbar>

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


                                {/* This part Should be visible to both the employee and the Admin/Manager  */}
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

                                <Link to="/logout">
                                    <ListItem>
                                        <ListItemPrefix>
                                            <PowerIcon className="h-5 w-5" />
                                        </ListItemPrefix>
                                        Log Out
                                    </ListItem>
                                </Link>
                            </List>
                        </Card>
                    </Drawer>
                </div>
            )}
        </div>
    );
}