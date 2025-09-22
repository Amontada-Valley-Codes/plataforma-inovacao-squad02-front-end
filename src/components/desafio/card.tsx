import { CalendarClock, Clock } from "lucide-react";
type cardProps = {
    title:string,
    stats:string,
    description:string,
    dateInicial:string,
    datefinal:string,
    tipo:'publico' | 'privado'
}


export default function Card ({title, stats, description, dateInicial, datefinal, tipo}:cardProps){
    return(
        <div className="px-4 py-6   max-w-[400px] rounded-2xl border">
            <div className="flex justify-between items-center">
                <p className="font-bold" >{title}</p>
                <p className="px-2 text-white bg-green-700 rounded-2xl">{stats}</p>
            </div>
            <div className="mt-5">
                <p>{description}</p>
            </div>

            <div className="mt-2 space-y-2 ">
                <div className="flex gap-1 items-center">
                  <CalendarClock size={20}/> 
                  <p className="text-sm"> {dateInicial} - {datefinal}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-3">
                <p className="px-2 rounded-2xl text-white  bg-green-700  ">{tipo}</p>
                <button className="bg-blue-500 text-white rounded px-2 p-1" >Ver Detalhes</button>
            </div>
        </div>
    )
}