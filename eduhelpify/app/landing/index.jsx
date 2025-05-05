

import Hero from './_components/Hero';
import Features from './_components/Features';
import HowItWorks from './_components/HowItWorks';
import UserComparison from './_components/UserComparison';
import Header from "./_components/Header";
import ForFree from './_components/ForFree';
import Footer from './_components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen font-sans">


      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <UserComparison />
        <ForFree />
      </main>
      <Footer />

    </div>
  );
}