import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CarbonThink",
  icons: 'favicon.ico'
};

export default function Home() {
  return (
    <>
      <ECommerce />
    </>
  );
}
