import { OctagonX } from 'lucide-react'

interface CustomNotRegisterProps{
    title: string
}

export const CustomNotRegister = ({title}:CustomNotRegisterProps) => {
    return (
        <tr>
            <td colSpan={8} className="py-20 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-2">
                    <OctagonX className="w-10 h-10 text-gray-300" />
                    <p className="text-xl font-light">No Hay {title} registradas</p>
                </div>
            </td>
        </tr>
    )
}
