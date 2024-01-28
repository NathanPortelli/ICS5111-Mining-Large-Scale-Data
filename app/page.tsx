"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/diet");
  };

  return (
    <main className="flex flex-col">
      <h1 className="mt-8 text-4xl sm:text-6xl mb-6 font-semibold text-center text-white">
        Personalised Diet Recommender
      </h1>
      <p className="mt-4 mb-2 text-xl ml-9 mr-9 text-white">
        Todo: Change the below text to a more fitting introduction
      </p>
      <p className="mt-4 mb-8 text-2xl font-semibold ml-9 mr-9 text-white">
        Welcome to our intelligent diet recommendation web application! Powered
        by academic panic, this application offers you personalised dietary
        suggestions based on your BMI, preferences, and similar users’
        preferences, time permitting.
      </p>

      <div className="mb-8 ml-9 mr-9 pl-3 pr-3 p-2 border-2 bg-gray-600 rounded-md shadow-md">
        <p className="text-2xl mb-2 font-semibold text-white">
          Project Details:
        </p>
        <p className="text-xl text-white">
          Title: Utilising Structured and Unstructured Data for Intelligent Diet
          Recommendations
        </p>
        <p className="text-xl text-white">
          Created in fulfillment of the requirements for the ICS5111 Mining
          Large Scale Data assignment by: Nathan Portelli and Oleg Grech.
        </p>
        <br />
        <p className="text-xl font-bold text-white">Email:</p>
        <p className="text-xl mb-5 text-white">
          <a
            className="text-blue-400"
            href="mailto:nathan.portelli.19@um.edu.mt"
          >
            nathan.portelli.19@um.edu.mt
          </a>
          ,{" "}
          <a className="text-blue-400" href="mailto:oleg.grech.19@um.edu.mt">
            oleg.grech.19@um.edu.mt
          </a>
        </p>
        <p className="text-xl font-bold text-white">
          Full project code available at:
        </p>
        <p className="text-xl">
          <a
            className="text-blue-400"
            href="https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data"
          >
            github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data
          </a>
        </p>
      </div>

      <div className="text-center mb-4">
        <button
          type="button"
          className="text-2xl font-bold shadow-md px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue transition duration-300"
          onClick={handleButtonClick}
        >
          Click here to get started
        </button>
      </div>
    </main>
  );
}
