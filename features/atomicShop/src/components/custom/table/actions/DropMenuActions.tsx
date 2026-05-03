// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { Eye, Lock, MoreVertical, Pencil, Trash2, Unlock } from 'lucide-react'

// interface DropMenuActionsProps {
//     onClick: () => void
// }

// export const DropMenuActions = () => {
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none">
//                     <MoreVertical className="w-5 h-5 text-gray-500" />
//                 </button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-48">
//                 <DropdownMenuLabel>Acciones</DropdownMenuLabel>

//                 <DropdownMenuItem onClick={() => console.log("Ver", client._id)}>
//                     <Eye className="mr-2 h-4 w-4 text-blue-500" />
//                     <span>Ver detalles</span>
//                 </DropdownMenuItem>

//                 <DropdownMenuItem onClick={() => console.log("Editar", client._id)}>
//                     <Pencil className="mr-2 h-4 w-4 text-amber-500" />
//                     <span>Editar</span>
//                 </DropdownMenuItem>

//                 <DropdownMenuSeparator />

//                 {/* Lógica Condicional de Restricción */}
//                 {client.state.toLowerCase() === "restringido" ? (
//                     <DropdownMenuItem
//                         className="text-green-600 focus:text-green-700"
//                         onClick={() => console.log("Quitar restricción", client._id)}
//                     >
//                         <Unlock className="mr-2 h-4 w-4" />
//                         <span>Habilitar</span>
//                     </DropdownMenuItem>
//                 ) : (
//                     <DropdownMenuItem
//                         className="text-orange-600 focus:text-orange-700"
//                         onClick={() => console.log("Restringir", client._id)}
//                     >
//                         <Lock className="mr-2 h-4 w-4" />
//                         <span>Restringir</span>
//                     </DropdownMenuItem>
//                 )}

//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem
//                     className="text-red-600 focus:text-red-700"
//                     onClick={() => console.log("Eliminar"d)}
//                 >
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     <span>Eliminar</span>
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     )
// }
