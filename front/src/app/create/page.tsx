"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import {compaign} from '@/contracts/compaign.contract'
import { DataContext } from "@/contexts/data-provider";
import { useContract } from "@/hooks/useContract";
import { ChangeEvent, useContext, useRef, useState } from "react";
import { create } from '@web3-storage/w3up-client'
import { FileLike } from "@web3-storage/w3up-client/types";


const CreateProject: React.FC = () => {

    const {
      account,
      chainId,
      data: { eventLogs, getCampaignCount, deployedCampaigns: contextDeployedCampaigns },
    } = useContext(DataContext);
  
    const [minimumContribution, setMinimumContribution] =  useState(0);
    const [dataUrl, setDataUrl] = useState<string | null>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { isConnected, isPending, writeContract } = useContract(() => {
        setMinimumContribution(0);
        
    });

    async function submitAddProposal(event: React.FormEvent<HTMLFormElement>) {

        event.preventDefault();
        if (!account.address || !chainId) {
          return;
        }

        /* 

        const client = await create();
        await client.login('mmkbennani@gmail.com');
        await client.setCurrentSpace('did:key:z6MkjD9PWJhecFawyHePcrz3VJzEcpobGhHGYbZWoHZsvXpa');

        const files: FileLike = {
          name: selectedFile?.name || 'unknown', // Fournit un fallback pour éviter undefined
          stream: () => {
            if (!selectedFile?.stream) {
              throw new Error("Le flux du fichier n'est pas disponible.");
            }
            return selectedFile.stream(); // Retourne un ReadableStream valide
          },
        };
        const directoryCid = await client.uploadDirectory([files])*/
        writeContract({
          ...compaign(chainId),
          account: account.address,
          args: [
            BigInt(minimumContribution)
          ],
          functionName: 'createCampaign',
        });
      }

      const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Récupère le premier fichier sélectionné
        if (file) {
          setSelectedFile(file); // Met à jour l'état avec le fichier sélectionné
        }
      };
      const fileInput = useRef<HTMLInputElement>(null);
  
    return (
      
        <>
          <title>New campaign</title>
          <link rel="icon" href="../favicon.ico" />
          <Breadcrumb pageName="New campaign"/>
          <div className="flex flex-col gap-9">
          {/* <!-- Contact Form 2 --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form  onSubmit={submitAddProposal}>
              <div className="p-6.5">
                <div className="mb-5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Minimum contribution
                    </label>
                    <input
                      type="text"
                      value={minimumContribution}
                      onChange={(e) => setMinimumContribution(Number(e.target.value))}
                      placeholder="Minimum Contribution"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Image
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      ref={fileInput}
                      className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                    />
                  </div>

                  
                </div>

               

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                 disabled={isPending || !isConnected} type="submit"
                    >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };
  
export default CreateProject;