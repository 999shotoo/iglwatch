import { PageHeader } from "@/components/page-header";

export default function DisclaimerPage() {
    return (
        <div className="max-w-3xl animate-in fade-in duration-500 py-5 md:py-7">
            <PageHeader title="Disclaimer" />

            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                    The content featured on this platform is made available with the sole intention of preserving and sharing entertainment material that is otherwise inaccessible to the public. The videos showcased here are not restricted or banned by any government authorities. They were originally published on public platforms but later made private by their respective uploaders due to reasons unrelated to legal prohibitions.
                </p>
                <p>
                    I do not claim ownership of the content, nor do I intend to infringe upon any copyrights or intellectual property rights. My goal is solely to distribute and archive this comedy show and similar entertainment content for those who appreciate and enjoy it.
                </p>
                <p>
                    If any copyright owner or relevant party has concerns regarding the availability of specific content, please feel free to contact me, and I will take appropriate action accordingly.
                </p>
                <p>
                    By accessing this platform, users acknowledge that they are doing so at their own discretion and agree that I bear no responsibility for any consequences arising from the viewing or distribution of this material.
                </p>
            </div>
        </div>
    );
}
