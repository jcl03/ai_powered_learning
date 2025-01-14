"use client";  
import DefaultLayout from "../components/Layouts/DefaultLaout";
import React from "react";
import OverviewPanel from "../components/OverviewPanel";
import Notifications from "../components/Notifications";
import FileUploadPanel from "../components/Dashboard/upload";

export default function Home() {
  return (
    
    <DefaultLayout>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-4 gap-3">
          {/* Left Column */}
          <div className="col-span-3">
            <FileUploadPanel />
            <OverviewPanel />
          </div>
          {/* Right Column */}
          <div className="col-span-1 space-y-6">
            <Notifications />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
