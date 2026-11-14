import { PageHeader } from "@/components/page-header";

export default function PrivacyPage() {
    return (
        <div className="max-w-full animate-in fade-in duration-500 py-5 md:py-7">
            <PageHeader
                title="Privacy Policy"
                description="Last updated: April 12, 2026"
            />

            <div className="space-y-7 text-sm leading-relaxed text-muted-foreground md:text-base">
                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">1. Information We Collect</h2>
                    <p>
                        We do not collect personally identifiable information from you directly unless you voluntarily provide it. When you visit our website, we or our third-party partners may automatically collect non-personal information such as your IP address, browser type, operating system, and pages visited through the use of cookies.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">2. Use of Cookies and Web Beacons</h2>
                    <p>
                        We use cookies to store information about your preferences and to optimize your experience by customizing our web page content based on your browser type. You can choose to disable cookies through your individual browser options.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">3. Google AdSense &amp; Analytics</h2>
                    <p>
                        We use Google Analytics and Google AdSense on our site. Google uses cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
                    </p>
                    <p className="mt-2">
                        Users may opt out of personalized advertising by visiting Ads Settings.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">4. Push Notifications</h2>
                    <p>
                        If you choose to opt-in to our push notifications (provided via gdls.me), a unique identifier will be stored to deliver these notifications. You can unsubscribe at any time through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">5. Contact Us</h2>
                    <p>
                        If you have any questions or require more information about our Privacy Policy, please feel free to contact us.
                    </p>
                </section>
            </div>
        </div>
    );
}
