import { FC, useEffect, useState } from 'react';
import FoodCard from './foodCard';
import Modal from 'react-modal'

interface FoodMenuProps {
  //todo: Add props (..?)
}

const customModalStyles = {
  content: {
    width: '500px',
    height: '250px',
    margin: 'auto', 
  },
};

const FoodMenu: FC<FoodMenuProps> = () => {
  const [selectedBreakfast, setSelectedBreakfast] = useState<string | null>(null);
  const [selectedLunch, setSelectedLunch] = useState<string | null>(null);
  const [selectedDinner, setSelectedDinner] = useState<string | null>(null);
  const [allMenusSelected, setAllMenusSelected] = useState(false); //track overall selection
  const [modalIsOpen, setModalIsOpen] = useState(false); //track modal state

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

  const handleSetMenu = () => {
    if (allMenusSelected) {
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  }

  return (
    <main className="flex min-h-screen flex-col justify-center">
      {/* Breakfast Section */}
      <div className="bg-yellow-200 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Breakfast Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {breakfastMenuItems.map((item) => (
            <div key={item.id}>
              <FoodCard key={item.id} {...item} selected={isItemSelected('breakfast', item.id)} />
              <button
                className={`w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:opacity-70 ${
                  isItemSelected('breakfast', item.id) ? 'bg-red-500' : ''
                }`}
                onClick={() => handleSelect('breakfast', item.id)}
              >
                {isItemSelected('breakfast', item.id) ? 'Unpick Breakfast' : 'Pick Breakfast'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lunch Section */}
      <div className="mt-8 bg-green-200 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lunch Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lunchMenuItems.map((item) => (
            <div key={item.id}>
              <FoodCard key={item.id} {...item} selected={isItemSelected('lunch', item.id)} />
              <button
                className={`w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:opacity-70 ${
                  isItemSelected('lunch', item.id) ? 'bg-red-500' : ''
                }`}
                onClick={() => handleSelect('lunch', item.id)}
              >
                {isItemSelected('lunch', item.id) ? 'Unpick Lunch' : 'Pick Lunch'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dinner Section */}
      <div className="mt-8 bg-purple-200 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dinner Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dinnerMenuItems.map((item) => (
            <div key={item.id}>
              <FoodCard key={item.id} {...item} selected={isItemSelected('dinner', item.id)} />
              <button
                className={`w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:opacity-70 ${
                  isItemSelected('dinner', item.id) ? 'bg-red-500' : ''
                }`}
                onClick={() => handleSelect('dinner', item.id)}
              >
                {isItemSelected('dinner', item.id) ? 'Unpick Dinner' : 'Pick Dinner'}
              </button>
            </div>
          ))}
        </div>
      </div>
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
            You have chosen your meal for today. You can find them in the <a className='text-blue-400' href="/history">History</a> tab.
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
  
// Data Structure
interface FoodMenuItem {
    id: string;
    name: string;
    image: string;
    description: string;
    ingredients: string[];
}

// todo: Replace with server data
const breakfastMenuItems: FoodMenuItem[] = [
    { id: '1', name: 'Coco Pops', image: 'breakfast.jpg', description: 'Breakfast option', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'] },
    { id: '2', name: 'Waffles', image: 'breakfast.jpg', description: 'Breakfast option', ingredients: ['Ingredient 4', 'Ingredient 5', 'Ingredient 6'] },
    { id: '3', name: 'Just Coffee', image: 'breakfast.jpg', description: 'Breakfast option', ingredients: ['Ingredient 7', 'Ingredient 8', 'Ingredient 9'] },
];

const lunchMenuItems: FoodMenuItem[] = [
    { id: '4', name: '16oz steak with fries', image: 'lunch.jpg', description: 'Lunch option', ingredients: ['Ingredient 10', 'Ingredient 11', 'Ingredient 12'] },
    { id: '5', name: 'Krabby Patty', image: 'lunch.jpg', description: 'Lunch option', ingredients: ['Ingredient 13', 'Ingredient 14', 'Ingredient 15'] },
    { id: '6', name: 'Salad', image: 'lunch.jpg', description: 'Lunch option', ingredients: ['Ingredient 16', 'Ingredient 17', 'Ingredient 18'] },
];

const dinnerMenuItems: FoodMenuItem[] = [
    { id: '7', name: 'Cheese Grazed Burger', image: 'dinner.jpg', description: 'Dinner option', ingredients: ['Ingredient 19', 'Ingredient 20', 'Ingredient 21'] },
    { id: '8', name: 'Cereal', image: 'dinner.jpg', description: 'Dinner option', ingredients: ['Ingredient 22', 'Ingredient 23', 'Ingredient 24'] },
    { id: '9', name: 'Double Pizza', image: 'dinner.jpg', description: 'Dinner option', ingredients: ['Ingredient 25', 'Ingredient 26', 'Ingredient 27'] },
];
  
export default FoodMenu;