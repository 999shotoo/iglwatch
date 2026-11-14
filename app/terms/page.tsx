import { PageHeader } from "@/components/page-header";

export default function TermsPage() {
    return (
        <div className="max-w-full animate-in fade-in duration-500 py-5 md:py-7">
            <PageHeader title="Terms of Service" />

            <div className="space-y-7 text-sm leading-relaxed text-muted-foreground md:text-base">
                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using indiasgotlatent.watchtvs.live (the &quot;Website&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Website.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">2. Fan Website Status</h2>
                    <p>
                        This is an unofficial, fan-made website. We are not officially affiliated with Samay Raina or the producers of India&apos;s Got Latent. All embedded videos, images, and brand assets remain the intellectual property of their respective creators.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">3. Content and Liability</h2>
                    <p>
                        The content provided on this Website is for informal, entertainment, and informational purposes only. We do not host video files on our own servers. All media is provided via third-party iframe embeds or external link redirects. We hold no liability for the content present on external services.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">4. Limitation of Liability</h2>
                    <p>
                        In no event shall the Website owner or administrators be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the site or any links provided herein.
                    </p>
                </section>
            </div>
        </div>
    );
}
