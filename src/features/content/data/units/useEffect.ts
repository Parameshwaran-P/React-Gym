// src/features/content/data/units/useEffect.ts

export const useEffectUnit = {
  "id": "react-002-useeffect",
  "title": "useEffect Hook",
  "description": "Master side effects and lifecycle in React",
  "duration": 8,
  "difficulty": "beginner" as const,
  "tags": ["hooks", "side-effects", "lifecycle"],
  "prerequisites": ["react-001-usestate"],
  "unlocks": ["react-003-props"],
  "xp": 60,
  "steps": {
    "refresher": {
      "type": "markdown",
      "title": "What is useEffect?",
      "content": "# useEffect Hook\n\n## What problem does it solve?\n\nReact components often need to do things **after** rendering:\n- Fetch data from an API\n- Set up subscriptions or timers\n- Update the document title\n- Listen to browser events\n\n**useEffect** lets you perform side effects in functional components.\n\n## When do you use it?\n\n- Fetching data when component mounts\n- Setting up/cleaning up event listeners\n- Syncing with external systems (localStorage, APIs)\n- Running code after state changes\n\n## Basic Syntax\n\n```javascript\nuseEffect(() => {\n  // Your side effect code here\n  \n  return () => {\n    // Cleanup (optional)\n  };\n}, [dependencies]);\n```\n\n- **Effect function**: Runs after render\n- **Cleanup function**: Runs before next effect or unmount\n- **Dependency array**: Controls when effect runs\n\n**Next: Let's see it in action! →**"
    },
    "positive": {
      "type": "interactive-code",
      "title": "✅ Positive Case: Document Title Updater",
      "description": "useEffect updates the browser tab title whenever count changes.",
      "code": "import { useState, useEffect } from 'react';\n\nfunction DocumentTitle() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]); // Runs when count changes\n\n  return (\n    <div className=\"p-6 bg-white rounded-lg shadow-md\">\n      <h2 className=\"text-2xl font-bold mb-4\">Document Title Demo</h2>\n      <p className=\"text-lg mb-2\">Current count: <span className=\"font-bold text-blue-600\">{count}</span></p>\n      <p className=\"text-sm text-gray-600 mb-4\">Watch your browser tab title change! 👆</p>\n      <button \n        onClick={() => setCount(count + 1)}\n        className=\"bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700\"\n      >\n        Increment\n      </button>\n    </div>\n  );\n}\n\nexport default DocumentTitle;",
      "showPreview": true,
      "explanation": "**How it works:**\n\n1. `useEffect` runs **after** every render where `count` changed\n2. The dependency array `[count]` tells React to only re-run when count changes\n3. Inside the effect, we update `document.title`\n4. This happens automatically without blocking the UI\n\n✅ **Key Point:** Effects run AFTER render, not during!"
    },
    "negative": {
      "type": "debug-quiz",
      "title": "🐛 Common Mistake: Infinite Loop",
      "description": "This code causes an infinite loop. Can you spot why?",
      "code": "import { useState, useEffect } from 'react';\n\nfunction InfiniteLoop() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    setCount(count + 1);\n  }); // Missing dependency array!\n\n  return (\n    <div className=\"p-6\">\n      <p>Count: {count}</p>\n    </div>\n  );\n}\n\nexport default InfiniteLoop;",
      "question": "Why does this create an infinite loop?",
      "options": [
        {
          "id": "a",
          "text": "You can't call setState inside useEffect",
          "isCorrect": false,
          "explanation": "Actually, calling setState in useEffect is common and correct when done properly."
        },
        {
          "id": "b",
          "text": "Missing dependency array makes effect run after EVERY render",
          "isCorrect": true,
          "explanation": "✅ Correct! Without a dependency array, the effect runs after every render. Since the effect calls setCount, which triggers a re-render, it loops forever: render → effect → setState → render → effect..."
        },
        {
          "id": "c",
          "text": "count should be in the dependency array",
          "isCorrect": false,
          "explanation": "Adding count to dependencies would still cause a loop here because we're updating count in the effect."
        },
        {
          "id": "d",
          "text": "useEffect needs a return statement",
          "isCorrect": false,
          "explanation": "Return statements are only needed for cleanup, not required for all effects."
        }
      ],
      "correctCode": "import { useState, useEffect } from 'react';\n\nfunction WorkingEffect() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    // This runs only ONCE on mount\n    console.log('Component mounted!');\n  }, []); // Empty array = run once\n\n  return (\n    <div className=\"p-6\">\n      <p className=\"text-2xl mb-4\">Count: {count}</p>\n      <button \n        onClick={() => setCount(count + 1)}\n        className=\"bg-green-600 text-white px-4 py-2 rounded\"\n      >\n        Increment\n      </button>\n    </div>\n  );\n}\n\nexport default WorkingEffect;",
      "lesson": "**Remember:** \n- No deps array → runs after every render ⚠️\n- Empty array `[]` → runs once on mount ✅\n- `[value]` → runs when value changes ✅"
    },
    "task": {
      "type": "coding-task",
      "title": "🛠️ Your Turn: Auto-Save to localStorage",
      "description": "Create a component that automatically saves input to localStorage using useEffect.",
      "requirements": [
        "Use useState for the input value",
        "Use useEffect to save to localStorage when value changes",
        "Load saved value on mount",
        "Show 'Saved!' indicator briefly after saving"
      ],
      "starterCode": "import { useState, useEffect } from 'react';\n\nfunction AutoSave() {\n  const [text, setText] = useState('');\n  const [saved, setSaved] = useState(false);\n  \n  // TODO: Load from localStorage on mount\n  \n  // TODO: Save to localStorage when text changes\n  \n  return (\n    <div className=\"p-6 max-w-md\">\n      <h2 className=\"text-2xl font-bold mb-4\">Auto-Save Notes</h2>\n      <textarea\n        value={text}\n        onChange={(e) => setText(e.target.value)}\n        className=\"w-full p-3 border rounded-lg mb-2\"\n        placeholder=\"Type something...\"\n        rows={4}\n      />\n      {saved && (\n        <p className=\"text-green-600 text-sm\">✓ Saved!</p>\n      )}\n    </div>\n  );\n}\n\nexport default AutoSave;",
      "solution": "import { useState, useEffect } from 'react';\n\nfunction AutoSave() {\n  const [text, setText] = useState('');\n  const [saved, setSaved] = useState(false);\n  \n  // Load from localStorage on mount\n  useEffect(() => {\n    const savedText = localStorage.getItem('autoSaveText');\n    if (savedText) {\n      setText(savedText);\n    }\n  }, []);\n  \n  // Save to localStorage when text changes\n  useEffect(() => {\n    if (text) {\n      localStorage.setItem('autoSaveText', text);\n      setSaved(true);\n      \n      // Hide \"Saved!\" after 1 second\n      const timer = setTimeout(() => setSaved(false), 1000);\n      return () => clearTimeout(timer);\n    }\n  }, [text]);\n  \n  return (\n    <div className=\"p-6 max-w-md\">\n      <h2 className=\"text-2xl font-bold mb-4\">Auto-Save Notes</h2>\n      <textarea\n        value={text}\n        onChange={(e) => setText(e.target.value)}\n        className=\"w-full p-3 border rounded-lg mb-2\"\n        placeholder=\"Type something...\"\n        rows={4}\n      />\n      {saved && (\n        <p className=\"text-green-600 text-sm\">✓ Saved!</p>\n      )}\n      <p className=\"text-xs text-gray-500 mt-2\">\n        Your text is automatically saved to localStorage\n      </p>\n    </div>\n  );\n}\n\nexport default AutoSave;",
      "hints": [
        "Use useEffect with empty array [] for mounting logic",
        "Use useEffect with [text] to run when text changes",
        "localStorage.setItem('key', value) saves data",
        "localStorage.getItem('key') retrieves data",
        "Remember to clear the timeout in cleanup!"
      ],
      "tests": [
        "Component loads saved text on mount",
        "Typing saves to localStorage",
        "Shows 'Saved!' indicator",
        "Saved indicator disappears after 1 second"
      ]
    },
    "challenge": {
      "type": "coding-challenge",
      "title": "🏆 Challenge: Fetch & Display User",
      "description": "Build a component that fetches user data from an API and displays it.",
      "requirements": [
        "Fetch data from https://jsonplaceholder.typicode.com/users/1",
        "Show loading state while fetching",
        "Display user name and email",
        "Handle errors gracefully",
        "Add a refresh button"
      ],
      "starterCode": "import { useState, useEffect } from 'react';\n\nfunction UserProfile() {\n  // TODO: Add state for user, loading, error\n  \n  // TODO: Fetch user data on mount\n  \n  return (\n    <div className=\"p-6 max-w-md\">\n      <h2 className=\"text-2xl font-bold mb-4\">User Profile</h2>\n      {/* TODO: Show loading, error, or user data */}\n    </div>\n  );\n}\n\nexport default UserProfile;",
      "solution": "import { useState, useEffect } from 'react';\n\nfunction UserProfile() {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n  \n  const fetchUser = async () => {\n    try {\n      setLoading(true);\n      setError(null);\n      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');\n      if (!response.ok) throw new Error('Failed to fetch');\n      const data = await response.json();\n      setUser(data);\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setLoading(false);\n    }\n  };\n  \n  useEffect(() => {\n    fetchUser();\n  }, []);\n  \n  return (\n    <div className=\"p-6 max-w-md\">\n      <h2 className=\"text-2xl font-bold mb-4\">User Profile</h2>\n      \n      {loading && (\n        <div className=\"text-center py-8\">\n          <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto\"></div>\n          <p className=\"mt-2 text-gray-600\">Loading...</p>\n        </div>\n      )}\n      \n      {error && (\n        <div className=\"bg-red-50 text-red-600 p-4 rounded-lg\">\n          Error: {error}\n        </div>\n      )}\n      \n      {user && !loading && (\n        <div className=\"bg-white border rounded-lg p-4\">\n          <h3 className=\"font-bold text-lg mb-2\">{user.name}</h3>\n          <p className=\"text-gray-600\">📧 {user.email}</p>\n          <p className=\"text-gray-600\">🏢 {user.company.name}</p>\n          <button\n            onClick={fetchUser}\n            className=\"mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700\"\n          >\n            Refresh\n          </button>\n        </div>\n      )}\n    </div>\n  );\n}\n\nexport default UserProfile;",
      "hints": [
        "Use three pieces of state: user, loading, error",
        "Create an async function for fetching",
        "Call fetch function inside useEffect with []",
        "Use try/catch/finally for error handling",
        "Show different UI based on loading/error/success state"
      ],
      "tests": [
        "Shows loading spinner initially",
        "Fetches and displays user data",
        "Handles errors if API fails",
        "Refresh button re-fetches data"
      ]
    }
  }
};