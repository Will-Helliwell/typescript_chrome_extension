import React, { useState } from 'react';

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = ({ title }) => {
  const [count, setCount] = useState<number>(0);

  const handleClick = (): void => {
    setCount(count + 1);
    alert(`Button clicked ${count + 1} times!`);
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="mb-4">This is a React proof of concept.</p>
      <p className="mb-4">Click count: {count}</p>
      <button
        id="testButton"
        className="bg-blue-100 px-4 py-2 rounded"
        onClick={handleClick}
      >
        Click Me
      </button>
    </div>
  );
};

export default App;
