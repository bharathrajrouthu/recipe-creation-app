import abstractmethod
import Flask, request, jsonify

app = Flask(__name__)

'''
Psuedo Code for Multiple Robot Systems Interface using Python Flask
Adapter Software Design
'''

### Step 1: Create an Abstract Robot API Interface
class RobotAPI():
    @abstractmethod
    def execute_recipe():
        pass
    
    @abstractmethod
    def take_image():
        pass

    @abstractmethod
    def unscrew():
        pass

###  Step 2: Adapter for Robots
### Company A's Robot API Adapter
class CompanyARobotAPI(RobotAPI):
    ### Convert to Company A specific formats 
    converted_comopanyA_recipe = {
        'recipeName': "name",
        'steps': [{
            'actionType': "takeImage",
            'parameters': "(x,y)"
        }]
    }
    ## Call Company A's API
    
    ## Considering the actions Compnay A Robot can perform

    # take_image()
    # unscrew()
    # _convert_parameters()
    # etc

### Company B's Robot API Adapter
class CompanyBRobotAPI(RobotAPI):
    ##Convert to Company A specific formats 
    converted_comopanyB_recipe = {
        'recipeName': "name",
        'steps': [{
            'actionType': "takeImage",
            'parameters': "(x,y)"
        }]
    }
    ## Call Company B's API
    
    ## Considering the actions Compnay B Robot can perform

    # take_image()
    # unscrew()
    # convert_parameters()
    # step_type()
    # etc. 

### Step 3: API Adapter Switcher to get the appropriate robot API
class RobotAPISwitcher:
    @staticmethod
    def get_robot_api(company: str) -> RobotAPI:
        if company.lower() == 'company_a':
            return CompanyARobotAPI()
        elif company.lower() == 'company_b':
            return CompanyBRobotAPI()
        raise ValueError(f"Unsupported company: {company}")


### Step 4: Define Flask routes
@app.route('/api/recipe/execute', methods=['POST'])
def execute_recipe():
    ## Set company and other parameters data like recipe etc.

    ## Send JSON data result by calling specifc company adapter.
    try:
        robot_api = RobotAPISwitcher.get_robot_api(company)
        result = robot_api.execute_recipe(recipe)
        return f"Jsonify the {result}"
    except Exception as e:
        return "Error Message 400"

@app.route('/api/image/capture', methods=['POST'])
def capture_image():
    ## Set company and other parameters data 

    ## Send JSON data result by calling specifc company adapter.
    try:
        robot_api = RobotAPISwitcher.get_robot_api(company)
        result = robot_api.take_image(params)
        return f"Jsonify the {result}"
    except Exception as e:
        return "Error Message 400"
    
@app.route('/api/unscrew', methods=['POST'])
def unscrew():
    ## Set company and other parameters data 

    ## Send JSON data result by calling specifc company adapter.
    try:
        robot_api = RobotAPISwitcher.get_robot_api(company)
        result = robot_api.unscrew(params)
        return f"Jsonify the {result}"
    except Exception as e:
        return "Error Message 400"
    
if __name__ == '__main__':
    app.run(debug=True)

# -----------------------------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------------------------

### Step 5: React API Call

### Example React API call
"""
const executeRecipe = async (recipe) => {
  try {
    const resp = await fetch('/api/recipe/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company: 'company_a', // or 'company_b'
        recipe: recipe
      })
    });
    return await resp.json();
  } catch (error) {
    console.error('Return Error Message');
  }
};
"""
