import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import FoodCard from "./foodCard";
import CircularProgress from "@mui/material/CircularProgress";

import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useMeals } from "../hooks/meals";
import { useUser } from "../hooks/user";
import { AlternativesMealsAPIResponse } from "../interfaces/alternativesMealsAPIResponse";
import { FoodMenuItem } from "../interfaces/foodMenuItem";
import StarRating from "./starRating";

interface MenuSectionProps {
  title: string;
  mealType: string;
  items: FoodMenuItem[];
  altItems?: FoodMenuItem[] | null;
  selected: string | number | null;
  alternate: string | number | null;
  isAlternative: boolean;
  handleSelect: (mealType: string, itemId: string | number) => void;
  handleAlternate: (
    mealType: string,
    itemId: string | number,
    title: string,
    calories: string | number
  ) => void;
  selectedFoodName: (mealType: string) => string;
  handleFindAlternatives: (mealType: string) => void;
  setSelectedMealTypeForAlternatives: (mealType: string | null) => void;
}

const MenuSection: FC<MenuSectionProps> = ({
  title,
  mealType,
  items,
  altItems,
  selected,
  alternate,
  isAlternative,
  handleSelect,
  handleAlternate,
  selectedFoodName,
  handleFindAlternatives,
  setSelectedMealTypeForAlternatives,
}) => {
  let backgroundColorClass = "";

  switch (mealType) {
    case "breakfast":
      backgroundColorClass = "bg-yellow-200";
      break;
    case "lunch":
      backgroundColorClass = "bg-green-200";
      break;
    case "dinner":
      backgroundColorClass = "bg-purple-200";
      break;
    default:
      backgroundColorClass = "bg-gray-200";
  }

  return (
    <div className="p-6 mb-5 rounded-md shadow-md border-2 bg-gray-600 rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <div className={`gap-8 mb-4 w-full text-center rounded-md shadow-md ${backgroundColorClass}`}>
          <h3 className= "mt-3 text-2xl font-bold mb-3 text-black">
          {title} Menu
          </h3>
        </div>
      </div>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items?.map((item) => (
            <div key={item.id}>
              <FoodCard
                key={item.id}
                {...item}
                selected={selected === item.id}
                alternate={alternate === item.id}
              />
              <button
                className={`w-full bg-blue-500 text-white px-4 py-2 mb-2 rounded-md transition duration-300 hover:opacity-70 ${
                  selected === item.id ? "bg-red-500" : ""
                }`}
                onClick={() => handleSelect(mealType, item.id)}
              >
                {selected === item.id ? `Unpick ${title}` : `Pick ${title}`}
              </button>
              <button
                className={`w-full text-blue-500 px-4 py-2 font-semibold ${
                  alternate === item.id
                    ? "bg-green-700 text-white"
                    : "bg-white text-blue-500"
                } rounded-md transition duration-300 hover:opacity-70 mb-2`}
                onClick={() => {
                  handleAlternate(mealType, item.id, item.title, item.calories);
                  setSelectedMealTypeForAlternatives(mealType);
                }}
              >
                {alternate === item.id
                  ? "Hide Alternatives"
                  : "Find Alternatives"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-row justify-center">
          <CircularProgress />
        </div>
      )}
      {alternate && (
        <div className="bg-green-100 mt-5 p-5 rounded-md py-2">
          <h3 className="text-xl font-semibold mt-3 mb-2 text-green-700">
            Alternative Menu Options for {selectedFoodName(mealType)}:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {altItems && altItems?.length > 0 ? (
              <>
                {altItems.map((altItems) => (
                  <div key={altItems.id}>
                    <FoodCard
                      key={altItems.id}
                      {...altItems}
                      selected={selected === altItems.id}
                      alternate={alternate === altItems.id}
                    />
                    <button
                      className={`w-full bg-blue-500 text-white px-4 py-2 mb-2 rounded-md transition duration-300 hover:opacity-70 ${
                        selected === altItems.id ? "bg-red-500" : ""
                      }`}
                      onClick={() => handleSelect(mealType, altItems.id)}
                    >
                      {selected === altItems.id
                        ? `Unpick ${title}`
                        : `Pick ${title}`}
                    </button>
                  </div>
                ))}
              </>
            ) : altItems && altItems?.length === 0 ? (
              <div className="flex flex-row justify-center">
                <h3>No Alternative Results Found.</h3>
              </div>
            ) : (
              <div className="flex flex-row justify-center">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const customModalStyles = {
  content: {
    width: "500px",
    height: "250px",
    margin: "auto",
  },
};

interface FoodMenuProps {
  submitKcal: number;
}

const FoodMenu: FC<FoodMenuProps> = ({ submitKcal }) => {
  const [selectedBreakfast, setSelectedBreakfast] = useState<
    string | number | null
  >(null);
  const [selectedLunch, setSelectedLunch] = useState<string | number | null>(
    null
  );
  const [selectedDinner, setSelectedDinner] = useState<string | number | null>(
    null
  );

  const [alternateBreakfast, setAlternateBreakfast] = useState<
    string | number | null
  >(null);
  const [alternateLunch, setAlternateLunch] = useState<string | number | null>(
    null
  );
  const [alternateDinner, setAlternateDinner] = useState<
    string | number | null
  >(null);
  const [selectedMealTypeForAlternatives, setSelectedMealTypeForAlternatives] =
    useState<string | null>(null);
  const [allMenusSelected, setAllMenusSelected] = useState(false); //track overall selection
  const [modalIsOpen, setModalIsOpen] = useState(false); //track modal state
  const [alternateBreakfastMenuItems, setAlternateBreakfastMenuItems] =
    useState<FoodMenuItem[] | null>(null);
  const [alternateLunchMenuItems, setAlternateLunchMenuItems] = useState<
    FoodMenuItem[] | null
  >(null);
  const [alternateDinnerMenuItems, setAlternateDinnerMenuItems] = useState<
    FoodMenuItem[] | null
  >(null);
  const [userRating, setUserRating] = useState<number>(0);

  const { meals, getAlternativeMeals } = useMeals(submitKcal);
  const { uid } = useUser();

  const handleFindAlternatives = (mealType: string) => {
    setSelectedMealTypeForAlternatives(mealType);
  };

  const handleRating = (value: number) => {
    setUserRating(value);
  };

  const handleSelect = (mealType: string, itemId: string | number) => {
    switch (mealType) {
      case "breakfast":
        setSelectedBreakfast((prev) => (prev === itemId ? null : itemId));
        break;
      case "lunch":
        setSelectedLunch((prev) => (prev === itemId ? null : itemId));
        break;
      case "dinner":
        setSelectedDinner((prev) => (prev === itemId ? null : itemId));
        break;
      default:
        break;
    }
  };

  const handleAlternate = async (
    mealType: string,
    itemId: string | number,
    title: string,
    calories: string | number
  ) => {
    const alternativeMeals: AlternativesMealsAPIResponse =
      await getAlternativeMeals(title, calories);

    if (alternativeMeals) {
      switch (mealType) {
        case "breakfast":
          setAlternateBreakfastMenuItems(alternativeMeals.alternatives);
          setAlternateBreakfast((prev) => (prev === itemId ? null : itemId));
          break;
        case "lunch":
          setAlternateLunchMenuItems(alternativeMeals.alternatives);
          setAlternateLunch((prev) => (prev === itemId ? null : itemId));
          break;
        case "dinner":
          setAlternateDinnerMenuItems(alternativeMeals.alternatives);
          setAlternateDinner((prev) => (prev === itemId ? null : itemId));
          break;
        default:
          break;
      }
    }
  };

  const isItemSelected = (mealType: string, itemId: string | number) => {
    switch (mealType) {
      case "breakfast":
        return selectedBreakfast === itemId;
      case "lunch":
        return selectedLunch === itemId;
      case "dinner":
        return selectedDinner === itemId;
      default:
        return false;
    }
  };

  const saveMealToFirestore = async (
    unpicked_breakfast_options,
    unpicked_lunch_options,
    unpicked_dinner_options,
    userRating // Receive the user rating here
  ) => {
    const currentTime = new Date();
    if (uid) {
      const mealHistoryCollection = collection(db, "mealHistory");
      const mealHistoryDoc = doc(
        mealHistoryCollection,
        `${uid}_${currentTime}`
      );
  
      await setDoc(mealHistoryDoc, {
        uid: uid,
        date: currentTime,
        breakfast: selectedBreakfast || null,
        lunch: selectedLunch || null,
        dinner: selectedDinner || null,
        unpicked_breakfast_options,
        unpicked_lunch_options,
        unpicked_dinner_options,
        userRating
      });
    }
  };

  // Check if all menus have selected option
  useEffect(() => {
    setAllMenusSelected(
      selectedBreakfast !== null &&
        selectedLunch !== null &&
        selectedDinner !== null
    );
  }, [selectedBreakfast, selectedLunch, selectedDinner]);

  const handleSetMenu = async () => {
    if (allMenusSelected) {
      const original_breakfast_notpicked = meals?.breakfast
        .filter((item) => item.id !== selectedBreakfast)
        .map((item) => item.id);

      const original_lunch_notpicked = meals?.lunch
        .filter((item) => item.id !== selectedLunch)
        .map((item) => item.id);

      const original_dinner_notpicked = meals?.dinner
        .filter((item) => item.id !== selectedDinner)
        .map((item) => item.id);

      const alternative_breakfast_notpicked = alternateBreakfastMenuItems
        ?.filter((item) => item.id !== selectedBreakfast)
        .map((item) => item.id);

      const alternative_lunch_notpicked = alternateLunchMenuItems
        ?.filter((item) => item.id !== selectedLunch)
        .map((item) => item.id);

      const alternative_dinner_notpicked = alternateDinnerMenuItems
        ?.filter((item) => item.id !== selectedDinner)
        .map((item) => item.id);

      const unpicked_breakfast_options = (
        original_breakfast_notpicked || []
      ).concat(alternative_breakfast_notpicked || []);
      const unpicked_lunch_options = (original_lunch_notpicked || []).concat(
        alternative_lunch_notpicked || []
      );
      const unpicked_dinner_options = (original_dinner_notpicked || []).concat(
        alternative_dinner_notpicked || []
      );

      await saveMealToFirestore(
        unpicked_breakfast_options,
        unpicked_lunch_options,
        unpicked_dinner_options,
        userRating
      )
        .then(() => {
          setModalIsOpen(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <main className="flex flex-col justify-center">
      <MenuSection
        title="Breakfast"
        mealType="breakfast"
        items={meals?.breakfast || []}
        altItems={alternateBreakfastMenuItems}
        selected={selectedBreakfast}
        alternate={alternateBreakfast}
        isAlternative={selectedMealTypeForAlternatives === "breakfast"}
        handleSelect={handleSelect}
        handleAlternate={handleAlternate}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
        selectedFoodName={(mealType) => {
          switch (mealType) {
            case "breakfast":
              return alternateBreakfast
                ? meals?.breakfast.find(
                    (altItem) => altItem.id === alternateBreakfast
                  )?.title || ""
                : "";
            default:
              return "";
          }
        }}
      />

      <MenuSection
        title="Lunch"
        mealType="lunch"
        items={meals?.lunch || []}
        altItems={alternateLunchMenuItems}
        selected={selectedLunch}
        alternate={alternateLunch}
        isAlternative={selectedMealTypeForAlternatives === "lunch"}
        handleSelect={handleSelect}
        handleAlternate={handleAlternate}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
        selectedFoodName={(mealType) => {
          switch (mealType) {
            case "lunch":
              return alternateLunch
                ? meals?.lunch.find((altItem) => altItem.id === alternateLunch)
                    ?.title || ""
                : "";
            default:
              return "";
          }
        }}
      />

      <MenuSection
        title="Dinner"
        mealType="dinner"
        items={meals?.dinner || []}
        altItems={alternateDinnerMenuItems}
        selected={selectedDinner}
        alternate={alternateDinner}
        isAlternative={selectedMealTypeForAlternatives === "dinner"}
        handleSelect={handleSelect}
        handleAlternate={handleAlternate}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
        selectedFoodName={(mealType) => {
          switch (mealType) {
            case "dinner":
              return alternateDinner
                ? meals?.dinner.find(
                    (altItem) => altItem.id === alternateDinner
                  )?.title || ""
                : "";
            default:
              return "";
          }
        }}
      />
      {/* Star rating section */}
      <div className="flex flex-col justify-center items-center text-lg p-2 border-2 bg-gray-600 rounded-md shadow-md">
        <div className="gap-8 m-2 w-full text-center rounded-md shadow-md bg-white">
          <p className="text-2xl font-semibold m-2">Rate the food recommendations</p>
        </div>
        <div>
          <StarRating handleRating={handleRating} />
        </div>
      </div>
      {/* Available only if all 3 meals selected */}
      <button
        className={`font-bold text-xl w-full mt-6 mb-3 px-4 py-2 rounded-md transition duration-300 ${
          allMenusSelected ? "bg-green-500 text-white hover:opacity-70" : "bg-gray-400 text-gray-600 cursor-not-allowed"
        }`}
        onClick={handleSetMenu}
        disabled={!allMenusSelected}
      >
        Set Menu for Today
      </button>
      
      {/* Successful save */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Selected Menu"
        ariaHideApp={false}
        style={customModalStyles}
      >
        <div className="modal-content">
          <h2 className="text-3xl font-bold mb-8">Meal has been set</h2>
          <p className="text-xl">
            You have chosen your meal for today. You can find them in the
            History tab.
          </p>
          <div className="text-center mt-8">
            <button
              type="button"
              className="text-xl font-semibold shadow-md px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue transition duration-300"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default FoodMenu;
