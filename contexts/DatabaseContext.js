import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import { FoodEntrySchema } from '../models/FoodEntry';
import { ExerciseSchema, WorkoutPlanSchema } from '../models/WorkoutPlan';

const DatabaseContext = createContext({
  realm: null,
  isReady: false,
});

export const DatabaseProvider = ({ children }) => {
  const [realm, setRealm] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initRealm = async () => {
      try {
        const realmInstance = await Realm.open({
          schema: [FoodEntrySchema, ExerciseSchema, WorkoutPlanSchema],
          schemaVersion: 1,
        });
        setRealm(realmInstance);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to open realm:', error);
      }
    };

    initRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ realm, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);

