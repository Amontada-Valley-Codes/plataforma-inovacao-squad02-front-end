import { CalendarClock, Building2,  } from "lucide-react"

type CardsProps = {
    name: string,
    cnpj: string,
    description: string,
    createdAt: string,
}

export default function Cards({ name, cnpj, description, createdAt }: CardsProps) {
  

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-[400px] w-full overflow-hidden">
           
            <div className="bg-gradient-to-r from-[#fb6514] to-[#ec4a0a] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Building2 size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg truncate max-w-[200px]">{name}</h3>
                            <p className="text-[#ffead5] text-sm">Empresa</p>
                        </div>
                    </div>
                </div>
            </div>

          
            <div className="px-6 py-5">
                
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      
                        <span className="text-sm font-medium text-gray-500">Descrição</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed line-clamp-3">{description}</p>
                </div>

                <div className="space-y-4">
                  
                    <div className="flex items-center gap-3 p-3  rounded-lg ">
                        <div className="p-2 bg-[#fff6ed] rounded-lg">
                            <CalendarClock size={18} className="text-[#fb6514]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Criado em</p>
                            <p className="text-gray-900 font-medium">{createdAt}</p>
                        </div>
                    </div>

                   
                    <div className="flex justify-between items-center p-3  rounded-lg ">
                        <div>
                            <p className="text-sm text-gray-600">CNPJ</p>
                            <p className="text-gray-900 font-mono font-semibold">
                                {cnpj}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-[#fb6514] text-white rounded-full text-sm font-medium">
                            Ativo
                        </div>
                    </div>
                </div>
            </div>

            
            
        </div>
    )
}