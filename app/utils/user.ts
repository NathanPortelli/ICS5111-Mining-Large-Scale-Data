import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const fetchUserFoodPreferences = async () => {
  const uid = auth.currentUser?.uid;

  if (uid) {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const { prefBreakfast, prefLunch, prefDinner } = userData || {};

      return {
        prefBreakfast,
        prefLunch,
        prefDinner,
      };
    }
  }
};
