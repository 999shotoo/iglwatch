export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-2">
                Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: April 12, 2026</p>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
                    <p>
                        We do not collect personally identifiable information from you directly unless you voluntarily provide it. When you visit our website, we or our third-party partners may automatically collect non-personal information such as your IP address, browser type, operating system, and pages visited through the use of cookies.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">2. Use of Cookies and Web Beacons</h2>
                    <p>
                        We use cookies to store information about your preferences and to optimize your experience by customizing our web page content based on your browser type. You can choose to disable cookies through your individual browser options.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">3. Google AdSense & Analytics</h2>
                    <p>
                        We use Google Analytics and Google AdSense on our site. Google uses cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
                    </p>
                    <p className="mt-2">
                        Users may opt out of personalized advertising by visiting Ads Settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">4. Push Notifications</h2>
                    <p>
                        If you choose to opt-in to our push notifications (provided via gdls.me), a unique identifier will be stored to deliver these notifications. You can unsubscribe at any time through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-3">5. Contact Us</h2>
                    <p>
                        If you have any questions or require more information about our Privacy Policy, please feel free to contact us.
                    </p>
                </section>
            </div>
        </div>
    );
}
