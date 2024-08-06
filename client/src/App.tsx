import TextContainer from './components/TextContainer';

function App() {
  return (
    <div className='flex justify-center align-middle h-full'>
      <div
        id='container-terminal'
        className=' border border-gray-300 overflow-hidden p-4'
      >
        <TextContainer />
      </div>
    </div>
  );
}

export default App;
