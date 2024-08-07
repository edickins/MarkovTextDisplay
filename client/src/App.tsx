import TextContainer from './components/TextContainer';

function App() {
  return (
    <div className='flex justify-center items-center h-full bg-blue-400'>
      <div
        id='container-terminal'
        className='border border-gray-300 h-full p-4 overflow-hidden'
      >
        <TextContainer />
      </div>
    </div>
  );
}

export default App;
