import { setupCronJobs } from "@/lib/cron";

import { Kontrakt, MainBanner, News, Services } from "./section/index";

export default function Home() {
  // Только на сервере
  if (typeof window === 'undefined') {
    setupCronJobs();
  }

  return (
    <div className="container">
      <MainBanner />
      <Services />
      <Kontrakt />
      <News />
    </div>
  );
}
