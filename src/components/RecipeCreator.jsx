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

    /**
     * Exports the current recipe as an object containing the recipe name,creation date, and steps.
     * @returns {Object} The recipe object with name, createdAt timestamp, and steps.
     */
    const exportRecipe = () => {
        const recipe = {
        name: recipeName,
        createdAt: new Date().toISOString(),
        steps: steps
        };

        const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${recipeName || 'recipe'}.json`;
        document.body.appendChild(link);
        link.click();
        
        // cleaning
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
  };

    /**
     * Handles the file upload event to read and parse a recipe JSON file.
     * @param {Event} event - The file upload event triggered by the input element.
     * This function reads the uploaded file, parses its content as JSON,and validates the structure.
     * If valid, it updates the recipe name and steps state.nIf not an error message is displayed to the user.
     */
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            try {
                const recipe = JSON.parse(e.target.result);
                
                // validation
                if (!recipe.steps || !Array.isArray(recipe.steps)) {
                throw new Error('Invalid recipe format');
                }
                
                setRecipeName(recipe.name || '');
                setSteps(recipe.steps.map(step => ({
                ...step,
                id: step.id || crypto.randomUUID()
                })));
            } catch (error) {
                alert('Error loading file: ' + error.message);
            }
            };
            reader.readAsText(file);
        }
    };

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
            
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="border rounded p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {step.type === 'image' ? '📷' : '🔧'}
                      </span>
                      <span className="capitalize">{step.type} Step</span>
                    </div>
                    <button
                      onClick={() => removeStep(index)}
                      className="px-2 py-1 text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
  
                  {step.type === 'image' && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={step.includePointcloud}
                          onChange={(e) => updateStep(index, { includePointcloud: e.target.checked })}
                        />
                        Include Pointcloud
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={step.isFullImage}
                          onChange={(e) => updateStep(index, { isFullImage: e.target.checked })}
                        />
                        Full Battery Image
                      </label>
                      {!step.isFullImage && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="X coordinate"
                            value={step.coordinates?.x || ''}
                            onChange={(e) => updateStep(index, {
                              coordinates: { 
                                x: Number(e.target.value), 
                                y: step.coordinates?.y || 0 
                              }
                            })}
                            className="w-24 p-2 border rounded"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="Y coordinate"
                            value={step.coordinates?.y || ''}
                            onChange={(e) => updateStep(index, {
                              coordinates: { 
                                x: step.coordinates?.x || 0, 
                                y: Number(e.target.value) 
                              }
                            })}
                            className="w-24 p-2 border rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}
  
                  {step.type === 'unscrew' && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`unscrewType-${step.id}`}
                          checked={step.isAutomatic}
                          onChange={() => updateStep(index, { 
                            isAutomatic: true, 
                            coordinates: undefined 
                          })}
                        />
                        Automatic Unscrewing
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`unscrewType-${step.id}`}
                          checked={!step.isAutomatic}
                          onChange={() => updateStep(index, { isAutomatic: false })}
                        />
                        Specific Unscrewing
                      </label>
                      {!step.isAutomatic && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="X coordinate"
                            value={step.coordinates?.x || ''}
                            onChange={(e) => updateStep(index, {
                              coordinates: { 
                                x: Number(e.target.value), 
                                y: step.coordinates?.y || 0 
                              }
                            })}
                            className="w-24 p-2 border rounded"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="Y coordinate"
                            value={step.coordinates?.y || ''}
                            onChange={(e) => updateStep(index, {
                              coordinates: { 
                                x: step.coordinates?.x || 0, 
                                y: Number(e.target.value) 
                              }
                            })}
                            className="w-24 p-2 border rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
  
            <div className="flex gap-2">
              <button
                onClick={() => addStep('image')}
                className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Image Step
              </button>
              <button
                onClick={() => addStep('unscrew')}
                className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Unscrew Step
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <button
              onClick={exportRecipe}
              className="flex items-center gap-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export Recipe 💾
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              style={{ display: 'none' }}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Import Recipe 📥 
            </button>
          </CardFooter>
        </Card>
      </div>
  );
};

export default RecipeCreator;