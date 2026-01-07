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
            <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-foreground">{node.name}</p>
                <p className="text-xs text-muted-foreground">{node.position}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border">
                <User className="w-5 h-5 text-primary" />
            </div>
        </div>
    )
}
