import CollectionsScene from "@/scenes/CollectionsScene";
import { FinalCTA } from "@/scenes/FinalCTA";
import HeroScene from "@/scenes/HeroScene";
import NewArrivalsScene from "@/scenes/NewArrivalsScene";
import Showroom from "@/scenes/showroom";
import WhyUsScene from "@/scenes/WhyUsScene";
import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";
import CustomFurnitureScene from "@/scenes/CustomFurnitureScene";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroScene />
        <NewArrivalsScene />
        <CollectionsScene />
        <CustomFurnitureScene />
        <WhyUsScene />
        <Showroom />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}

export default Home;
