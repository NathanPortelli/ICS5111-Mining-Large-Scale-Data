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
      <p className="mt-4 mb-8 text-2xl ml-9 mr-9 text-white">
        Welcome to our diet recommendation web app! This platform, created using Next.js Framework, Python and 
        <a className="text-blue-400" href="https://spoonacular.com/food-api/"> Spoonacular API</a>, provides
        personalised dietary suggestions tailored to your Body Mass Index (BMI), preferences, dietary goals, 
        and patterns from similar users.
      </p>
      <div className="text-lg mb-8 ml-9 mr-9 pl-3 pr-3 p-2 border-2 bg-gray-600 rounded-md shadow-md">
        <p className="text-2xl mb-4 font-semibold text-white">
          Project Details
        </p>
        <p className="text-white">
          <b>Title:</b> Utilising Structured and Unstructured Data for Intelligent Diet
          Recommendations
        </p>
        <p className="text-white">
          Created in fulfillment of the requirements for the ICS5111 Mining
          Large Scale Data assignment by{" "}
          <a
            className="text-blue-400"
            href="https://github.com/NathanPortelli/"
          >
            Nathan Portelli 
          </a>
          {" "}and{" "}  
          <a
            className="text-blue-400"
            href="https://github.com/oleggrech7"
          >
            Oleg Grech
          </a>
          .
        </p>
        <br />
        <p className="text-white"><b>Email:</b>{" "}
          <a
            className="text-blue-400 "
            href="mailto:nathan.portelli.19@um.edu.mt"
          >
            nathan.portelli.19@um.edu.mt
          </a>
          ,{" "}
          <a className="text-blue-400" href="mailto:oleg.grech.19@um.edu.mt">
            oleg.grech.19@um.edu.mt
          </a>
        </p>
        <p className="text-white">
          <b>Full project code available at:{" "}</b>
          <a
            className="text-blue-400"
            href="https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data"
          >
            github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data
          </a>
        </p>
        <p className="font-bold text-white mt-4">
          Public Datasets/Websites used:
        </p>
        <p className="text-xl">
          <a
            className="text-blue-400"
            href="https://fdc.nal.usda.gov/"
          >
            FoodData Central
          </a>
        </p>
        <p className="text-xl">
          <a
            className="text-blue-400"
            href="https://www.jamieoliver.com/recipes/"
          >
            Jamie Oliver Recipes
          </a>
        </p>
        <p className="text-xl">
          <a
            className="text-blue-400"
            href="https://spoonacular.com/"
          >
            Spoonacular
          </a>
        </p>
        <p className="text-xl">
          <a
            className="text-blue-400"
            href="https://www.kaggle.com/datasets/heeraldedhia/stop-words-in-28-languages?select=english.txt"
          >
            Stopwords
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
