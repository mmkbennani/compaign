"use client";

import { WagmiProvider, cookieToInitialState } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from 'connectkit';
//import { config } from "@/lib/wagmi.config";
import { config } from "@/lib/config";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
  cookie?: string | null;
};

export default function Providers({ children, cookie }: Props) {
  const initialState = cookieToInitialState(config, cookie);

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
         <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#7b3fe4",
            accentColorForeground: "white",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider> 
        {/*<ConnectKitProvider
          customTheme={{
            '--ck-connectbutton-border-radius': '6px',
            '--ck-connectbutton-background': 'hsl(var(--background))',
            '--ck-connectbutton-color': 'hsl(var(--accent-foreground))',
            '--ck-connectbutton-hover-background': 'hsl(var(--accent))',
            '--ck-connectbutton-active-background': 'hsl(var(--background))',
            '--ck-connectbutton-balance-background': 'hsl(var(--muted))',
            '--ck-connectbutton-balance-color': 'hsl(var(--accent-foreground))',
            '--ck-connectbutton-balance-hover-background': 'hsl(var(--muted))',
            '--ck-connectbutton-balance-active-background': 'hsl(var(--background))',
            '--ck-connectbutton-box-shadow': '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-balance-box-shadow': '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-hover-box-shadow': '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-balance-hover-box-shadow': '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-active-box-shadow': '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-balance-active-box-shadow': '0 0 0 1px hsl(var(--input))',
          }}
          options={{
            language: 'en-US',
          }}
          mode="auto"
          theme="auto"
        >
          {children}
        </ConnectKitProvider>*/}
      </QueryClientProvider>
    </WagmiProvider>
  );
}