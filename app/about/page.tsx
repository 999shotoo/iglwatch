import { PageHeader } from "@/components/page-header";

export default function AboutPage() {
    return (
        <div className="max-w-full animate-in fade-in duration-500 py-5 md:py-7">
            <PageHeader
                title="About India's Got Latent"
                description="A fan-managed archive for one of India's most talked-about comedy shows."
            />

            <div className="space-y-7 text-sm leading-relaxed text-muted-foreground md:text-base">
                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">The Show</h2>
                    <p>
                        India&apos;s Got Latent is a uniquely hilarious reality comedy talk show hosted by the renowned comedian Samay Raina. The show sets out to celebrate India&apos;s hidden—and often entirely pointless—talents. From bizarre human tricks to uniquely funny performances, India&apos;s Got Latent is unlike any traditional talent show.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">The Host: Samay Raina</h2>
                    <p>
                        Samay Raina is one of India&apos;s most popular stand-up comedians and the creator behind this show. Alongside a rotating panel of esteemed guest judges—including other comedians, creators, and public figures—Samay critiques, celebrates, and roasts the participants attempting to showcase their latent abilities.
                    </p>
                </section>

                <section className="rounded-xl border border-border/60 bg-card/40 p-5 md:p-6">
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">About This Website</h2>
                    <p>
                        This website is a fan-managed index and streaming portal. We are not officially affiliated with, endorsed by, or connected to Samay Raina or the official production team of India&apos;s Got Latent. Our goal is simply to organize and provide an accessible platform for fans to watch the episodes of the show they love.
                    </p>
                </section>
            </div>
        </div>
    );
}
