import TextContainer from './components/TextContainer';

function App() {
  return (
    <div className='flex justify-center items-center h-full radiantGreenBg font-custom'>
      <div
        id='container-terminal'
        className='border border-gray-300 h-full w-full sm:p-10 md:p-12 overflow-hidden'
      >
        <TextContainer />
      </div>
    </div>
  );
}

export default App;
