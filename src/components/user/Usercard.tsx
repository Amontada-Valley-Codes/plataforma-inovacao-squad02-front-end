import { User, Mail, Phone, Badge } from "lucide-react"

type UserCardProps = {
    id: string,
    name: string,
    email: string,
    type: string,
    phone?: string,
    photo?: string,
    createdAt?: string,
}

export default function UserCard({ name, email, type, phone, createdAt }: UserCardProps) {
  
    // Função para formatar o tipo de usuário
    const formatUserType = (userType: string) => {
        const types: { [key: string]: string } = {
            'COMMON': 'Comum',
            'EVALUATOR': 'Avaliador',
            'MANAGER': 'Gerente'
        };
        return types[userType] || userType;
    };

    // Função para obter a cor baseada no tipo de usuário
    const getTypeColor = (userType: string) => {
        const colors: { [key: string]: string } = {
            'COMMON': 'bg-blue-100 text-blue-800 border-blue-200',
            'EVALUATOR': 'bg-purple-100 text-purple-800 border-purple-200',
            'MANAGER': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colors[userType] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const badgeClass = `px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(type)}`;

    return (
        <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 w-full overflow-hidden">
           
            {/* Header Compacto */}
            <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                            <User size={16} className="text-gray-600" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[120px]">
                                {name}
                            </h3>
                        </div>
                    </div>
                    <span className={badgeClass}>
                        {formatUserType(type)}
                    </span>
                </div>
            </div>

            {/* Conteúdo Compacto */}
            <div className="px-4 py-3">
                <div className="space-y-2">
                    {/* Email */}
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                        <p className="text-gray-600 text-sm truncate flex-1">
                            {email}
                        </p>
                    </div>

                    {/* Telefone */}
                    {phone && (
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400 flex-shrink-0" />
                            <p className="text-gray-600 text-sm">
                                {phone}
                            </p>
                        </div>
                    )}

                    {/* Data de criação */}
                    {createdAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Badge size={12} className="flex-shrink-0" />
                            <span>Desde {createdAt}</span>
                        </div>
                    )}
                </div>

                {/* Footer com Status */}
                
                
            </div>
        </div>
    )
}