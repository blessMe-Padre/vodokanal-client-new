import GosuslugiWidget from "@/app/components/GosuslugiWidget/GosuslugiWidget";

import { Kontrakt, MainBanner, News, Services } from "./section/index";

export default function Home() {
  return (
    <div className="container">
      <MainBanner />
      <GosuslugiWidget />
      <Services />
      <Kontrakt />
      <News />
    </div>
  );
}
