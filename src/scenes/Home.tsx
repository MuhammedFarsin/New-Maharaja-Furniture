import CollectionsScene from "@/scenes/CollectionsScene";
import { FinalCTA } from "@/scenes/FinalCTA";
import HeroScene from "@/scenes/HeroScene";
import NewArrivalsScene from "@/scenes/NewArrivalsScene";
import Showroom from "@/scenes/showroom";
import WhyUsScene from "@/scenes/WhyUsScene";
import { Navbar } from "@/scenes/navbar";
import Footer from "@/scenes/Footer";
import CustomFurnitureScene from "@/scenes/CustomFurnitureScene";
import { Helmet } from "react-helmet-async";

function Home() {
  return (
    <>
    <Helmet>
        <title>Premium Teak Wood Furniture in Coimbatore | Maharaja Furniture</title>

        <meta
          name="description"
          content="Visit Maharaja Furniture in Ganeshapuram, Kunnathur, Coimbatore for premium teak wood furniture, sofa sets, cots, wardrobes, dining tables, TV units, mattresses and custom furniture at affordable prices."
        />

        <meta
          name="keywords"
          content="teak furniture, wooden furniture, furniture shop Coimbatore, sofa sets, cots, wardrobes, dining tables, mattresses, TV units, custom furniture"
        />

        <meta
          property="og:title"
          content="Premium Teak Wood Furniture in Coimbatore | Maharaja Furniture"
        />

        <meta
          property="og:description"
          content="Explore premium teak wood furniture including sofa sets, cots, wardrobes, dining tables and custom furniture from Maharaja Furniture."
        />

        <meta
          property="og:url"
          content="https://new-maharaja-furniture.vercel.app/"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Premium Teak Wood Furniture in Coimbatore | Maharaja Furniture"
        />

        <meta
          name="twitter:description"
          content="Premium teak wood furniture, sofa sets, cots, wardrobes, dining tables and custom furniture in Coimbatore."
        />

        <link
          rel="canonical"
          href="https://new-maharaja-furniture.vercel.app/"
        />
      </Helmet>
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
