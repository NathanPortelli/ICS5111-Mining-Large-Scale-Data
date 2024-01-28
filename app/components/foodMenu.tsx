import { FC, useEffect, useState } from 'react';
import Modal from 'react-modal';
import FoodCard from './foodCard';

import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import { FoodMenuItem } from '../interfaces/foodMenuItem';
import { useMeals } from '../hooks/meals';

interface MenuSectionProps {
  title: string;
  mealType: string;
  items: FoodMenuItem[];
  altItems?: FoodMenuItem[];
  selected: string | null;
  alternate: string | null;
  isAlternative: boolean;
  handleSelect: (mealType: string, itemId: string) => void;
  handleAlternate: (mealType: string, itemId: string) => void;
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
      backgroundColorClass = 'bg-gray-200';
  }
  const menuClass = `mt-8 ${backgroundColorClass} p-6 rounded-md shadow-md`;

  return (
    <div className={menuClass}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title} Menu</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(items)?.map((item) => (
          <div key={item.id}>
            <FoodCard key={item.id} {...item} selected={selected === item.id} alternate={alternate === item.id}/>
            <button
              className={`w-full bg-blue-500 text-white px-4 py-2 mb-2 rounded-md transition duration-300 hover:opacity-70 ${
                selected === item.id ? 'bg-red-500' : ''
              }`}
              onClick={() => handleSelect(mealType, item.id)}
            >
              {selected === item.id ? `Unpick ${title}` : `Pick ${title}`}
            </button>
            <button
              className={`w-full text-blue-500 px-4 py-2 font-semibold ${
                alternate === item.id ? 'bg-green-700 text-white' : 'bg-white text-blue-500'
              } rounded-md transition duration-300 hover:opacity-70 mb-2`}
              onClick={() => {
                handleAlternate(mealType, item.id)
                setSelectedMealTypeForAlternatives(mealType)
              }}
            >
              {alternate === item.id ? 'Hide Alternatives' : 'Find Alternatives'}
            </button>           
          </div>
        ))}
      </div>
      {alternate && ( 
        <div className='bg-green-100 mt-5 p-5 rounded-md py-2'>
          <h3 className="text-xl font-semibold mt-3 mb-2 text-green-700">Alternative Menu Options for {selectedFoodName(mealType)}:</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(altItems)?.map((altItems) => (
              <div key={altItems.id}>
                <FoodCard key={altItems.id} {...altItems} selected={selected === altItems.id} alternate={alternate === altItems.id}/>
                <button
                  className={`w-full bg-blue-500 text-white px-4 py-2 mb-2 rounded-md transition duration-300 hover:opacity-70 ${
                    selected === altItems.id ? 'bg-red-500' : ''
                  }`}
                  onClick={() => handleSelect(mealType, altItems.id)}
                >
                  {selected === altItems.id ? `Unpick ${title}` : `Pick ${title}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
};

const customModalStyles = {
  content: {
    width: '500px',
    height: '250px',
    margin: 'auto', 
  },
};

interface FoodMenuProps {
  submitKcal: number;
}

const FoodMenu: FC<FoodMenuProps> = ({ submitKcal }) => {
  const uid = auth.currentUser?.uid;
  const email = auth.currentUser?.email;
  const [selectedBreakfast, setSelectedBreakfast] = useState<string | null>(null);
  const [selectedLunch, setSelectedLunch] = useState<string | null>(null);
  const [selectedDinner, setSelectedDinner] = useState<string | null>(null);

  const [alternateBreakfast, setAlternateBreakfast] = useState<string | null>(null);
  const [alternateLunch, setAlternateLunch] = useState<string | null>(null);
  const [alternateDinner, setAlternateDinner] = useState<string | null>(null);
  const [selectedMealTypeForAlternatives, setSelectedMealTypeForAlternatives] = useState<string | null>(null);
  const [allMenusSelected, setAllMenusSelected] = useState(false); //track overall selection
  const [modalIsOpen, setModalIsOpen] = useState(false); //track modal state

  const { meals } = useMeals(submitKcal);

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

  const handleAlternate = (mealType: string, itemId: string) => {
    switch (mealType) {
      case 'breakfast':
        setAlternateBreakfast((prev) => (prev === itemId ? null : itemId));
        break;
      case 'lunch':
        setAlternateLunch((prev) => (prev === itemId ? null : itemId));
        break;
      case 'dinner':
        setAlternateDinner((prev) => (prev === itemId ? null : itemId));
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

  const saveMealToFirestore = async () => {
    const currentTime = new Date();
    if (uid) {
      const mealHistoryCollection = collection(db, 'mealHistory');
      const mealHistoryDoc = doc(mealHistoryCollection, `${uid}_${currentTime}`);
  
      const breakfast_notpicked = meals?.breakfast
        .filter(item => item.id !== selectedBreakfast)
        .map(item => item.id);
  
      const lunch_notpicked = meals?.lunch
        .filter(item => item.id !== selectedLunch)
        .map(item => item.id);
  
      const dinner_notpicked = meals?.dinner
        .filter(item => item.id !== selectedDinner)
        .map(item => item.id);
  
      await setDoc(mealHistoryDoc, {
        uid: uid,
        date: currentTime,
        breakfast: selectedBreakfast || null,
        lunch: selectedLunch || null,
        dinner: selectedDinner || null,
        breakfast_notpicked,
        lunch_notpicked,
        dinner_notpicked,
      });
    }
  };

  // Check if all menus have selected option
  useEffect(() => {
    setAllMenusSelected(selectedBreakfast !== null && selectedLunch !== null && selectedDinner !== null);
  }, [selectedBreakfast, selectedLunch, selectedDinner]);  

  const handleSetMenu = async () => {
    if (allMenusSelected) {
      await saveMealToFirestore();
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
        items={meals?.breakfast || []}
        altItems={altBreakfastMenuItems}
        selected={selectedBreakfast}
        alternate={alternateBreakfast}
        isAlternative={selectedMealTypeForAlternatives === 'breakfast'}
        handleSelect={handleSelect}
        handleAlternate={handleAlternate}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
        selectedFoodName={(mealType) => {
          switch (mealType) {
            case 'breakfast':
              return alternateBreakfast ? meals?.breakfast.find((altItem) => altItem.id === alternateBreakfast)?.title || '' : '';
            default:
              return '';
          }
        }}
      />

      <MenuSection
        title="Lunch"
        mealType="lunch"
        items={meals?.lunch || []}
        altItems={altLunchMenuItems}
        selected={selectedLunch}
        alternate={alternateLunch}
        isAlternative={selectedMealTypeForAlternatives === 'lunch'}
        handleSelect={handleSelect}
        handleAlternate={handleAlternate}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
        selectedFoodName={(mealType) => {
          switch (mealType) {
            case 'lunch':
              return alternateLunch ? meals?.lunch.find((altItem) => altItem.id === alternateLunch)?.title || '' : '';
            default:
              return '';
          }
        }}
      />

      <MenuSection
        title="Dinner"
        mealType="dinner"
        items={meals?.dinner || []}
        altItems={altDinnerMenuItems}
        selected={selectedDinner}
        alternate={alternateDinner}
        isAlternative={selectedMealTypeForAlternatives === 'dinner'}
        handleSelect={handleSelect}
        handleAlternate={handleAlternate}
        handleFindAlternatives={handleFindAlternatives}
        setSelectedMealTypeForAlternatives={setSelectedMealTypeForAlternatives}
        selectedFoodName={(mealType) => {
          switch (mealType) {
            case 'dinner':
              return alternateDinner ? meals?.dinner.find((altItem) => altItem.id === alternateDinner)?.title || '' : '';
            default:
              return '';
          }
        }}
      />
      {/* Shown only if all 3 meals selected */}
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

// todo: Replace with server data -- alternatives
const altBreakfastMenuItems: FoodMenuItem[] = [
{ id: '10', title: 'Pancakes with Syrup', image: '', calories: '400', ingredients: ['Flour', 'Milk', 'Eggs', 'Maple Syrup'] },
{ id: '11', title: 'Avocado Toast', image: '', calories: '400', ingredients: ['Avocado', 'Whole Grain Bread', 'Salt', 'Pepper'] },
{ id: '12', title: 'Blueberry Muffins', image: '', calories: '400', ingredients: ['Blueberries', 'Flour', 'Sugar', 'Butter'] },
];

const altLunchMenuItems: FoodMenuItem[] = [
{ id: '13', title: 'Grilled Chicken Salad', image: '', calories: '500', ingredients: ['Grilled Chicken', 'Mixed Greens', 'Tomatoes', 'Balsamic Dressing'] },
{ id: '14', title: 'Vegetarian Wrap', image: '', calories: '500', ingredients: ['Hummus', 'Cucumbers', 'Tomatoes', 'Whole Wheat Wrap'] },
{ id: '15', title: 'Quinoa Bowl', image: '', calories: '500', ingredients: ['Quinoa', 'Roasted Vegetables', 'Feta Cheese', 'Olive Oil'] },
];

const altDinnerMenuItems: FoodMenuItem[] = [
{ id: '16', title: 'Salmon with Lemon Dill Sauce', image: '', calories: '450', ingredients: ['Salmon', 'Lemon', 'Dill', 'Olive Oil'] },
{ id: '17', title: 'Pasta Primavera', image: '', calories: '450', ingredients: ['Pasta', 'Assorted Vegetables', 'Parmesan Cheese', 'Tomato Sauce'] },
{ id: '18', title: 'Teriyaki Tofu Stir-Fry', image: '', calories: '450', ingredients: ['Tofu', 'Broccoli', 'Carrots', 'Teriyaki Sauce'] },
];
  
export default FoodMenu;