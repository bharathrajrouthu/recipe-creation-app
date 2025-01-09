import React, { useState, useRef } from 'react';
import { Card, CardContent} from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

const RecipeCreator = () => {
  const [steps, setSteps] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const fileInputRef = useRef(null);

  /**
  * Adds a new step to the steps array based on the given type.
  * @param {string} type - The type of step to add ('image' or 'unscrew').
  * Assumption: Generates a randomUUID for each step to uniquely identify
  */
  const addStep = (type) => {
    const newStep = type === 'image' 
        ? {
            id: crypto.randomUUID(),
            type: 'image',
            includePointcloud: false,
            isFullImage: true
          }
        : {
            id: crypto.randomUUID(),
            type: 'unscrew',
            isAutomatic: true
          };
    setSteps([...steps, newStep]);
  };
  /**
   * Assumption: There will be a removeStep and update for subsequent addStep 
   */
  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index, updates) => {
    setSteps(steps.map((step, i) => 
      i === index ? { ...step, ...updates } : step
    ));
  };
}

function App() {
  return (
    <div className="container mx-auto py-8">
      <h1>
      Welocome to Recipe Creation App
      </h1>
    </div>
  );
}

export default App;