import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>Phaser Nextjs Template</title>
                <meta
                    name="description"
                    content="A Phaser 3 Next.js project template that demonstrates Next.js with React communication and uses Vite for bundling."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <div className="w-full flex items-center justify-center">
                    <div className="w-full max-w-[1440px] flex items-center justify-between p-4">
                        <p>Wild Strike</p>
                        <ConnectButton />
                    </div>
                </div>
                <AppWithoutSSR />
            </main>
        </>
    );
}

