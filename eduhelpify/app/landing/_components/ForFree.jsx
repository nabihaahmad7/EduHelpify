"use client";
import { useRouter } from 'next/navigation';
export default function ForFree() {
  const router = useRouter();
    return (
      <section className="py-20 bg-gradient-to-r from-[#01427a] to-[#01b3ef] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Educational Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of teachers and students who are already using our platform to enhance teaching and learning.
          </p>
          <button className="bg-white text-[#01427a] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap cursor-pointer"        onClick={() => router.push('/auth')}  >
            Get Started for Free
          </button>
        </div>
      </section>
    );
  }