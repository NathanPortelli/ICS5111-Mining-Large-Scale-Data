import { FC } from 'react';
import { useForm } from 'react-hook-form';

const Preferences: FC = () => {
  const { register } = useForm();

  return (
    <section className="">
      {/* Food Preferences Section */}
      <div className="mb-6">
        <p className="mb-2 font-semibold text-white">Please tick your preferences/allergies:</p>
        <div className="grid grid-cols-2 gap-4 text-white">
          {['Dairy Free', 'Gluten Free', 'Halal', 'Kosher', 'Nut Free', 'Shellfish Free', 'Vegetarian', 'Vegan'].map((preference) => (
            <label key={preference} className="flex items-center">
              <input type="checkbox" {...register(preference)} className="mr-2" />
              {preference}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Preferences;
