import { Outlet, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Navbar from "~/components/elements/Navbar";
import VoiceIndicator from "~/components/elements/VoiceIndicator";
import Sidebar from "~/components/ui/sidebar";
import { KeyPressProvider } from "~/hooks/useKeyPress";
import { getUser, type userData } from "~/lib/auth-client";

export async function loader(args: LoaderFunctionArgs) {
    const user = await getUser(args.request);

    if (!user) {
        return redirect("/auth/login");
    }

    return user;
}

export default function Index() {
    const user: userData = useLoaderData<typeof loader>();
    
    return (
        <main className="font-jakarta font-medium flex gap-10 h-screen items-center relative"
            onClick={async () => {
                // Trigger Client
                // const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/3AwU3nHsI4YWeBJbz6yn?output_format=mp3_44100_128", {
                //     method: "POST",
                //     headers: {
                //         'Xi-Api-Key': 'sk_97e880bc63a10c61ceac785d1fa91a95804f941f2f6b53c3',
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         text: "Hai! Tentu, fotosintesis itu adalah proses di mana tumbuhan mengubah cahaya matahari menjadi energi. Jadi, tumbuhan menggunakan sinar matahari, air, dan karbon dioksida buat bikin makanan sendiri dalam bentuk glukosa, dan mengeluarkan oksigen sebagai hasil sampingan. Keren banget, kan? Ada yang lain yang ingin kamu tahu? 😊🌿✨",
                //         model_id: "eleven_multilingual_v2"
                //     })
                // })

                // const audioBlob = await response.blob();
                // const audioUrl = URL.createObjectURL(audioBlob);
                // const audio = new Audio(audioUrl);
                // audio.play();
            }}
        >
            <img src="/home-bg.png" alt="" className="fixed w-screen h-screen z-0 object-cover opacity-60" />
            <KeyPressProvider>
                <Sidebar />
                <Navbar />
                <div className="h-full w-full relative">
                    <Outlet
                        context={user}
                    />
                    <VoiceIndicator />
                </div>
            </KeyPressProvider>
        </main>
    )
}