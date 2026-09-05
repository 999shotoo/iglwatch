export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-8">
                About India's Got Latent
            </h1>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-3">The Show</h2>
                    <p>
                        India's Got Latent is a uniquely hilarious reality comedy talk show hosted by the renowned comedian Samay Raina. The show sets out to celebrate India's hidden—and often entirely pointless—talents. From bizarre human tricks to uniquely funny performances, India's Got Latent is unlike any traditional talent show.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-3">The Host: Samay Raina</h2>
                    <p>
                        Samay Raina is one of India's most popular stand-up comedians and the creator behind this show. Alongside a rotating panel of esteemed guest judges—including other comedians, creators, and public figures—Samay critiques, celebrates, and roasts the participants attempting to showcase their latent abilities.
                    </p>
                </section>

                <section className="bg-muted/30 p-6 rounded-lg border border-border mt-8">
                    <h2 className="text-xl font-bold text-foreground mb-3">About This Website</h2>
                    <p>
                        This website is a fan-managed index and streaming portal. We are not officially affiliated with, endorsed by, or connected to Samay Raina or the official production team of India's Got Latent. Our goal is simply to organize and provide an accessible platform for fans to watch and download episodes of the show they love.
                    </p>
                </section>
            </div>
        </div>
    );
}
