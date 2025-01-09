import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
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

  const exportRecipe = () => {
    const recipe = {
      name: recipeName,
      createdAt: new Date().toISOString(),
      steps: steps
    };

    const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // download json
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipeName || 'recipe'}.json`;
    document.body.appendChild(link);
    link.click();
    
    // cleaning
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
}

const handleFileUpload = (event) => {
};

function App() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recipe Creator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Recipe Name"
                className="w-full p-2 border rounded"
              />
            </div>
            </CardContent>
            </Card>
    </div>
  );
}

export default App;