"use client";
import React , { Suspense, useContext }from "react";
import { DataContext } from '@/contexts/data-provider';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Paginate } from "../ui/pagination/paginate";
import { ProjectsList } from "./projects-list";
import 'dotenv/config';
import { Metadata } from "next";



const CardsProject: React.FC = () => {

  const {
    account: { isOwner: contextIsOwner, isConnected },
    data: { eventLogs, getCampaignCount, deployedCampaigns: contextDeployedCampaigns },
  } = useContext(DataContext);


  return (
    
      <>
        <title>List of campaigns</title>
        <link rel="icon" href="../favicon.ico" />
        <Breadcrumb pageName="Cards"/>
        <Suspense>
            <Paginate baseUrl="/projects" nbItems={Number(getCampaignCount) ?? 0} pageSize={10} />
              <ProjectsList />
            <Paginate baseUrl="/projects" nbItems={Number(getCampaignCount) ?? 0} pageSize={10} />
        </Suspense>
    </>
  );
};

export default CardsProject;
