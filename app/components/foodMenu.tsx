import { FC, useEffect, useState } from 'react';
import FoodCard from './foodCard';
import Modal from 'react-modal'

import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface MenuSectionProps {
  title: string;
  mealType: string;
  items: FoodMenuItem[];
  altItems?: FoodMenuItem[];
  selected: string | null;
  isAlternative: boolean;
  handleSelect: (mealType: string, itemId: string) => void;
  handleFindAlternatives: (mealType: string) => void;
  setSelectedMealTypeForAlternatives: (mealType: string | null) => void;
}

const MenuSection: FC<MenuSectionProps> = ({
  title,
  mealType,
  items,
  altItems,
  selected,
  isAlternative,
  handleSelect,
  handleFindAlternatives,
  setSelectedMealTypeForAlternatives,
}) => {
  let backgroundColorClass = '';

  switch (mealType) {
    case 'breakfast':
      backgroundColorClass = 'bg-yellow-200';
      break;
    case 'lunch':
      backgroundColorClass = 'bg-green-200';
      break;
    case 'dinner':
      backgroundColorClass = 'bg-purple-200';
      break;
    default:
      backgroundColorClass = 'bg-gray-200'; // Default color if meal type is not recognized
  }
  const menuClass = `mt-8 ${backgroundColorClass} p-6 rounded-md shadow-md`;

  return (
    <div className={menuClass}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title} Menu</h2>
      </div>
      {isAlternative && (
        <h3 className="text-xl font-semibold mb-2 text-blue-500">Alternative Menu Options:</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(isAlternative ? altItems : items)?.map((item) => (
          <div key={item.id}>
            <FoodCard key={item.id} {...item} selected={selected === item.id} />
            <button
              className={`w-full bg-blue-500 text-white px-4 py-2 mb-2 rounded-md transition duration-300 hover:opacity-70 ${
                selected === item.id ? 'bg-red-500' : ''
              }`}
              onClick={() => handleSelect(mealType, item.id)}
            >
              {selected === item.id ? `Unpick ${title}` : `Pick ${title}`}
            </button>
            <button
              type="button"
              className={`w-full text-blue-500 px-4 py-2 font-semibold bg-white border-4 border-blue-500 rounded-md transition duration-300 hover:opacity-70 mb-3`}
              onClick={() =>
                isAlternative ? setSelectedMealTypeForAlternatives(null) : handleFindAlternatives(mealType)
              }
            >
              {isAlternative ? 'Return to Original' : `Find Alternatives`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
interface FoodMenuItem {
  id: string;
  name: string;
  image: string;
  calories: string;
  ingredients: string[];
}

const customModalStyles = {
  content: {
    width: '500px',
    height: '250px',
    margin: 'auto', 
  },
};

const FoodMenu: FC = () => {
  const uid = auth.currentUser?.uid;
  const email = auth.currentUser?.email;
  const [selectedBreakfast, setSelectedBreakfast] = useState<string | null>(null);
  const [selectedLunch, setSelectedLunch] = useState<string | null>(null);
  const [selectedDinner, setSelectedDinner] = useState<string | null>(null);
  const [selectedMealTypeForAlternatives, setSelectedMealTypeForAlternatives] = useState<string | null>(null);
  const [allMenusSelected, setAllMenusSelected] = useState(false); //track overall selection
  const [modalIsOpen, setModalIsOpen] = useState(false); //track modal state

  const handleFindAlternatives = (mealType: string) => {
    setSelectedMealTypeForAlternatives(mealType);
  };

  const handleSelect = (mealType: string, itemId: string) => {
    switch (mealType) {
      case 'breakfast':
        setSelectedBreakfast((prev) => (prev === itemId ? null : itemId));
        break;
      case 'lunch':
        setSelectedLunch((prev) => (prev === itemId ? null : itemId));
        break;
      case 'dinner':
        setSelectedDinner((prev) => (prev === itemId ? null : itemId));
        break;
      default:
        break;
    }
  };

  const isItemSelected = (mealType: string, itemId: string) => {
    switch (mealType) {
      case 'breakfast':
        return selectedBreakfast === itemId;
      case 'lunch':
        return selectedLunch === itemId;
      case 'dinner':
        return selectedDinner === itemId;
      default:
        return false;
    }
  };

  // Check if all menus have selected option
  useEffect(() => {
    setAllMenusSelected(selectedBreakfast !== null && selectedLunch !== null && selectedDinner !== null);
  }, [selectedBreakfast, selectedLunch, selectedDinner]);

  const saveMealToFirestore = async (period: string, mealId: string | null) => {
    const currentTime = new Date();
    if (uid && mealId) {
      const mealHistoryCollection = collection(db, 'mealHistory');
      const mealHistoryDoc = doc(mealHistoryCollection, `${uid}_${currentTime}_${period}`);
      await setDoc(mealHistoryDoc, {
        email: email,
        date: currentTime,
        meal: mealId,
        period,
      });     
    }
  };

  const handleSetMenu = async () => {
    if (allMenusSelected) {
      await saveMealToFirestore('breakfast', selectedBreakfast);
      await saveMealToFirestore('lunch', selectedLunch);
      await saveMealToFirestore('dinner', selectedDinner);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  }

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <MenuSection
        title="Breakfast"
        mealType="breakfast"
        items={breakfastMenuItems}
        altItems={altBreakfastMenuItems}
        selected={selectedBreakfast}
        isAlternative={selectedMealTypeForAlternatives === 'breakfast'}
        handleSelect={handleSelect}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
      />

      <MenuSection
        title="Lunch"
        mealType="lunch"
        items={lunchMenuItems}
        altItems={altLunchMenuItems}
        selected={selectedLunch}
        isAlternative={selectedMealTypeForAlternatives === 'lunch'}
        handleSelect={handleSelect}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
      />

      <MenuSection
        title="Dinner"
        mealType="dinner"
        items={dinnerMenuItems}
        altItems={altDinnerMenuItems}
        selected={selectedDinner}
        isAlternative={selectedMealTypeForAlternatives === 'dinner'}
        handleSelect={handleSelect}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
      />

      {/* Show if all 3 options selected */}
      {allMenusSelected && (
        <button
          className="font-bold text-xl w-full mt-6 mb-3 bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 hover:opacity-70"
          onClick={handleSetMenu}
        >
          Set Menu for Day
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Selected Menu"
        ariaHideApp={false}
        style={customModalStyles}
      >
        <div className="modal-content">
          <h2 className='text-3xl font-bold mb-8'>Meal has been set</h2>
          <p className='text-xl'>
            You have chosen your meal for today. You can find them in the History tab.
          </p>
          <div className="text-center mt-8">
            <button
              type="button"
              className="text-xl font-semibold rounded-md shadow-md px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue transition duration-300"
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

// todo: Replace with server data
const breakfastMenuItems: FoodMenuItem[] = [
    { id: '1', name: 'Coco Pops', image: '', calories: 'Breakfast option', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'] },
    { id: '2', name: 'Waffles', image: '', calories: 'Breakfast option', ingredients: ['Ingredient 4', 'Ingredient 5', 'Ingredient 6'] },
    { id: '3', name: 'Just Coffee', image: '', calories: 'Breakfast option', ingredients: ['Ingredient 7', 'Ingredient 8', 'Ingredient 9'] },
];

const lunchMenuItems: FoodMenuItem[] = [
    { id: '4', name: '16oz steak with fries', image: '', calories: 'Lunch option', ingredients: ['Ingredient 10', 'Ingredient 11', 'Ingredient 12'] },
    { id: '5', name: 'Krabby Patty', image: '', calories: 'Lunch option', ingredients: ['Ingredient 13', 'Ingredient 14', 'Ingredient 15'] },
    { id: '6', name: 'Salad', image: '', calories: 'Lunch option', ingredients: ['Ingredient 16', 'Ingredient 17', 'Ingredient 18'] },
];

const dinnerMenuItems: FoodMenuItem[] = [
    { id: '7', name: 'Cheese Grazed Burger', image: '', calories: 'Dinner option', ingredients: ['Ingredient 19', 'Ingredient 20', 'Ingredient 21'] },
    { id: '8', name: 'Cereal', image: '', calories: 'Dinner option', ingredients: ['Ingredient 22', 'Ingredient 23', 'Ingredient 24'] },
    { id: '9', name: 'Double Pizza', image: '', calories: 'Dinner option', ingredients: ['Ingredient 25', 'Ingredient 26', 'Ingredient 27'] },
];

// todo: Replace with server data -- alternatives
const altBreakfastMenuItems: FoodMenuItem[] = [
  { id: '10', name: 'Pancakes with Syrup', image: '', calories: 'Breakfast option', ingredients: ['Flour', 'Milk', 'Eggs', 'Maple Syrup'] },
  { id: '11', name: 'Avocado Toast', image: '', calories: 'Breakfast option', ingredients: ['Avocado', 'Whole Grain Bread', 'Salt', 'Pepper'] },
  { id: '12', name: 'Blueberry Muffins', image: '', calories: 'Breakfast option', ingredients: ['Blueberries', 'Flour', 'Sugar', 'Butter'] },
];

const altLunchMenuItems: FoodMenuItem[] = [
  { id: '13', name: 'Grilled Chicken Salad', image: '', calories: 'Lunch option', ingredients: ['Grilled Chicken', 'Mixed Greens', 'Tomatoes', 'Balsamic Dressing'] },
  { id: '14', name: 'Vegetarian Wrap', image: '', calories: 'Lunch option', ingredients: ['Hummus', 'Cucumbers', 'Tomatoes', 'Whole Wheat Wrap'] },
  { id: '15', name: 'Quinoa Bowl', image: '', calories: 'Lunch option', ingredients: ['Quinoa', 'Roasted Vegetables', 'Feta Cheese', 'Olive Oil'] },
];

const altDinnerMenuItems: FoodMenuItem[] = [
  { id: '16', name: 'Salmon with Lemon Dill Sauce', image: '', calories: 'Dinner option', ingredients: ['Salmon', 'Lemon', 'Dill', 'Olive Oil'] },
  { id: '17', name: 'Pasta Primavera', image: '', calories: 'Dinner option', ingredients: ['Pasta', 'Assorted Vegetables', 'Parmesan Cheese', 'Tomato Sauce'] },
  { id: '18', name: 'Teriyaki Tofu Stir-Fry', image: '', calories: 'Dinner option', ingredients: ['Tofu', 'Broccoli', 'Carrots', 'Teriyaki Sauce'] },
];
  
export default FoodMenu;