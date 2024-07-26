import "./App.css";
import VpcComponent from "./components/Vpcs.tsx";

function App() {
    return (
        <div className={'h-full overflow-auto'}>
            <div className="container p-8">
                <header className="bg-transparent text-white py-4 mb-4 rounded-lg">
                    <h1 className="text-2xl font-bold">
                        AWS Toolbox
                    </h1>
                </header>

                {/*Action Buttons*/}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col bg-[#2a2e33] p-4 rounded-lg gap-0">
                        <h2 className="text-xl font-bold text-white">S3</h2>
                        <p className={'text-gray-400'}>
                            Liste todos os buckets da sua conta.
                        </p>
                        <button
                            className="bg-[#ff9900] hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mt-4"
                            onClick={() => {
                            }}
                        >
                            Listar Buckets
                        </button>
                    </div>
                    <div className="flex flex-col bg-[#2a2e33] p-4 rounded-lg gap-0">
                        <h2 className="text-xl font-bold text-white">EC2</h2>
                        <p className={'text-gray-400'}>
                            Liste todas as instâncias EC2 da sua conta.
                        </p>
                        <button
                            className="bg-[#ff9900] hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mt-4"
                            onClick={() => {
                            }}
                        >
                            Listar VPCs
                        </button>
                    </div>
                </div>

                <VpcComponent/>
            </div>
        </div>
    );
}

export default App;
