/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card/card';
import { DataContext } from '@/contexts/data-provider';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { Calendar, Clock, LandPlot, Leaf, MapPin } from 'lucide-react';
import Link from 'next/link';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import 'dotenv/config';
import { Skeleton } from './skeleton';


export function ProjectsList() {
  const searchParams = useSearchParams();
  const pageIndex = Number(searchParams.get('p') ?? 1);
  const PAGE_SIZE= 10;

  const [isOwner, setIsOwner] = useState(false);
    const [deployedCampaigns, setDeployedCampaigns] = useState<`0x${string}`[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const {
      account: { isOwner: contextIsOwner, isConnected },
      data: { campaigns, currentCampaigns, eventLogs, getCampaignCount, deployedCampaigns: contextDeployedCampaigns },
      queries: { campaignsBatchIsLoading },
      fetchcampaignsPage,
    } = useContext(DataContext);
  

    useEffect(() => {
      fetchcampaignsPage(pageIndex);
      setIsLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex]);

    // useEffect(() => {
    //   if (contextDeployedCampaigns !== undefined && contextDeployedCampaigns.length > 0) {
    //     setIsOwner(contextIsOwner);
    //     setDeployedCampaigns(contextDeployedCampaigns);
    //     setIsLoading(false);
    //   } else if (contextDeployedCampaigns !== undefined) {
    //     // Si les données sont définies mais vides
    //     setIsLoading(false);
    //   }
    // }, [contextIsOwner, contextDeployedCampaigns]);

  return (
    
      campaignsBatchIsLoading && currentCampaigns.length==0
        ?
        (
          <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3 pt-2.5 pb-2.5">
            {[...new Array(PAGE_SIZE)].map((_, index) => <Skeleton className="h-[482px] w-full" key={index} />)}
          </div>
        )
        :
        (
          currentCampaigns.length != 0 
          ?(
            <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3 pt-2.5 pb-2.5">
              {
                currentCampaigns.map((card, key) => {
                  if (!card) {
                    return;
                  }
                  return (

                    <Link
                      className="w-full max-w-[490px] hover:-translate-y-1 transition-transform "
                      href={`/project/${key}`}
                      key={key}>
                      <Card className="hover:border-[green] overflow-hidden">
                        <CardHeader className="bg-muted">
                          <CardTitle>{card}</CardTitle>
                          <CardDescription>"project.description"</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <AspectRatioPrimitive.Root ratio={16 / 9} className="rounded-md overflow-hidden mt-6">
                            <div className="animate-pulse dark:bg-gray-600 bg-gray-300 h-full w-full absolute -z-10">{card}</div>
                            <img
                              className="w-full z-10"
                              style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%', position: 'absolute' }}
                              src="/images/cards/cards-02.png"
                              onError={(e: any) => (e.target.src = '/images/image-placeholder.webp')}
                            />
                          </AspectRatioPrimitive.Root>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-3 text-sm">
                          <div className="flex flex-row gap-1">
                            <MapPin className="h-5 w-5" /> project.data.continent, project.data.region
                          </div>
                          <div className="flex flex-row w-full">
                            <div className="flex-1 flex flex-row gap-1">
                              <LandPlot className="h-5 w-5" /> Surface:{' '}
                              <span className="text-green-700 dark:text-green-500">project.data.ares / 100 ha.</span>
                            </div>
                            <div className="flex flex-row gap-1 justify-end">
                              <Leaf className="h-5 w-5" /> CO2:
                              <span className="text-green-700 dark:text-green-500">
                                project.data.expectedCo2Tons tons
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-row w-full">
                            <div className="flex-1 flex flex-row gap-1">
                              <Calendar className="h-5 w-5" />
                              projectDateStart.toDateString()
                            </div>
                            <div className="flex flex-row gap-1 justify-end">
                              <Clock className="h-5 w-5" /> Duration:{' '}
                              <span className="text-green-700 dark:text-green-500">project.data.duration years</span>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                  </Link>

                )})
              }
            </div>
              
                
          )









          :(
            (
              <div className="flex w-full border-l-6 border-warning bg-warning bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9 pt-2.5 pb-2.5 mt-[62px] mb-[62px]">
                <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-warning bg-opacity-30">
                  <svg
                    width="19"
                    height="16"
                    viewBox="0 0 19 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.50493 16H17.5023C18.6204 16 19.3413 14.9018 18.8354 13.9735L10.8367 0.770573C10.2852 -0.256858 8.70677 -0.256858 8.15528 0.770573L0.156617 13.9735C-0.334072 14.8998 0.386764 16 1.50493 16ZM10.7585 12.9298C10.7585 13.6155 10.2223 14.1433 9.45583 14.1433C8.6894 14.1433 8.15311 13.6155 8.15311 12.9298V12.9015C8.15311 12.2159 8.6894 11.688 9.45583 11.688C10.2223 11.688 10.7585 12.2159 10.7585 12.9015V12.9298ZM8.75236 4.01062H10.2548C10.6674 4.01062 10.9127 4.33826 10.8671 4.75288L10.2071 10.1186C10.1615 10.5049 9.88572 10.7455 9.50142 10.7455C9.11929 10.7455 8.84138 10.5028 8.79579 10.1186L8.13574 4.75288C8.09449 4.33826 8.33984 4.01062 8.75236 4.01062Z"
                      fill="#FBBF24"
                    ></path>
                  </svg>
                </div>
                <div className="w-full">
                  <h5 className="mb-3 text-lg font-semibold text-[#9D5425]">
                    Attention
                  </h5>
                  <p className="leading-relaxed text-[#D0915C]">
                    No campaign has been created
                  </p>
                </div>
              </div>
            )
          )
      )

        
      
  );
}
