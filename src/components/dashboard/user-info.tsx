import { User } from 'lucide-react'

interface UserInfoProps {
    node: {
        name: string
        email: string
        position: string
    }
}

export function UserInfo({ node }: UserInfoProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-right">
                <p className="text-sm font-medium text-white">{node.name}</p>
                <p className="text-xs text-slate-400">{node.position}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
            </div>
        </div>
    )
}
