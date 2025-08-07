
import { Kontrakt, MainBanner, News, Services } from "./section/index";

export default function Home() {
  return (
    <div className="container">
      <MainBanner />
      <Services />
      <Kontrakt />
      <News />
    </div>
  );
}
