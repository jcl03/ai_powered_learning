"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "../Sidebar/SidebarItem";
import ClickOutside from "../ClickOutside";
import { FaBook, FaLightbulb, FaHighlighter, FaCheckCircle } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuItems = [
  {
    icon: <FaBook className="w-6 h-6" />,
    label: "Flashcards",
    route: "/flashcards",
  },
  {
    icon: <FaLightbulb className="w-6 h-6" />,
    label: "Example Guides",
    route: "/example-guides",
  },
  {
    icon: <FaHighlighter className="w-6 h-6" />,
    label: "Summarization",
    route: "/summarization",
  },
  {
    icon: <FaCheckCircle className="w-6 h-6" />,
    label: "Test Yourself",
    route: "/test-yourself",
  },
  {
    icon: (
      <svg
        className="stroke-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m7-7v14m-7-7h14"
        />
      </svg>
    ),
    label: "AI Chatbot",
    route: "/ai-chatbot",
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 duration-300 ease-linear" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                width={176}
                height={32}
                src="/images/logo/ai-tutors-light.svg"
                alt="AI Tutors Logo"
                priority
                className="dark:hidden"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                width={50}
                height={32}
                src="/images/logo/ai-tutors-dark.svg"
                alt="AI Tutors Logo Dark"
                priority
                className="hidden dark:block"
                style={{ width: "auto", height: "auto" }}
              />
              {/* Title next to logo */}
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                AI Tutors
              </span>
            </div>
          </Link>

          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="block lg:hidden">
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        {/* Sidebar Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            <ul className="mb-6 flex flex-col gap-2">
              {menuItems.map((menuItem, index) => (
                <SidebarItem key={index} item={menuItem} isActive={pathname === menuItem.route} />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
