import {useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";

interface InstanceProps {
    AZ: string,
    Instance: string,
    LaunchTime: string,
    Name: string,
    PrivateIpAddress: string,
    PublicIpAddress: string,
    State: string,
    Type: string,
    PublicDnsName: string,
}

const VpcComponent = () => {
    const [loading, setLoading] = useState(false);
    const [publicDnsName, setPublicDnsName] = useState("")
    const [instances, setInstances] = useState<InstanceProps[]>([]);
    const [query, setQuery] = useState("");

    async function onClickSearch() {
        setLoading(true);

        const result: InstanceProps[] = await invoke("describe_instances", {searchName: query})
        if (result.length > 0) {
            const data = JSON.parse(result).flat();
            setInstances(data);
        }
        setLoading(false);
    }

    async function onClickConnect(ip: string) {
        // TODO: pega o id da instancia se usar o ssm.
        // start_aws_session_ssm {id}

        await invoke("start_ssh_session", {ip, pemPath: "~/Downloads/maquina-pessoal.pem"})
    }

    return (
        <div>
            {/*Connect by id */}
            <div className={'flex flex-row items-start mt-8 gap-4'}>
                <div className={'w-full flex flex-col gap-2'}>
                    <input
                        value={publicDnsName}
                        onChange={(e) => setPublicDnsName(e.target.value)}
                        className={"border-b-[1px] border-b-gray-700 p-2 w-full bg-transparent text-white"}
                        placeholder={"Digite o Public DNS Name da instância"}
                    />
                    <small className={'text-white opacity-50 max-w-[70%]'}>
                        Você já tem o <b>Public DNS Name</b> da instância? Cole acima e clique em conectar.
                    </small>
                </div>
                <button
                    onClick={() => onClickConnect(publicDnsName)}
                    className="bg-transparent hover:bg-orange-400 text-white font-bold py-2 px-4 rounded"
                >
                    Conectar
                </button>
            </div>

            {/*Separator*/}
            <div className={'w-full border-b-[1px] border-b-[rgba(255,255,255,.1)] my-4 '}/>

            {/*Serach by name*/}
            <div className={'flex flex-row items-center mt-8 gap-4'}>
                <input
                    className={"border-b-[1px] border-b-gray-700 p-2 w-full bg-transparent text-white"}
                    placeholder={"Procurar pelo nome da instancia"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="bg-[#ff9900] hover:bg-orange-400 text-black font-bold py-2 px-4 rounded"
                    onClick={onClickSearch}
                >
                    Procurar
                </button>
            </div>

            {loading && (
                <div className={'flex flex-row items-center justify-center mt-4'}>
                    <h1 className={'text-xl'}>
                        Carregando...
                    </h1>
                </div>
            )}

            {/*Instances List*/}
            {instances.length > 0 && (
                <div className="grid grid-cols-1 gap-4 mt-8">
                    <div className={'mb-4'}>
                        <h2 className={'text-2xl'}>
                            Lista de instância(s) encontradas
                        </h2>
                        <p>
                            {instances.length} instância(s) encontrada(s).
                        </p>
                    </div>

                    {instances.map((instance) => (
                        <div key={instance.Instance}
                             className="flex flex-row bg-[#21252c] p-4 rounded-lg gap-0 justify-between items-start"
                        >
                            <div>
                                <div className={'flex flex-col mb-4'}>
                                    <small className={'text-gray-400'}>
                                        {instance.Instance}
                                    </small>
                                    <small>
                                        {instance.PrivateIpAddress}
                                    </small>
                                </div>
                                <div className={'flex flex-row items-center gap-2'}>
                                    {instance.State === "running" && (
                                        <span className={'rounded-full w-2 h-2 bg-green-500'}/>
                                    )}
                                    <h2 className="text-xl font-bold text-white">
                                        {instance.Name}
                                    </h2>
                                </div>
                                <small className={'text-blue-300 opacity-50'}>
                                    {instance.Type} - {instance.AZ}
                                </small>
                            </div>
                            <button
                                className="bg-[#ff9900] hover:bg-orange-300 text-black font-bold py-2 px-4 rounded"
                                onClick={() => onClickConnect(instance.PublicDnsName)}
                            >
                                Conectar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VpcComponent;
