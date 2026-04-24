import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomPaginationProps{
    itemsPerPage: number
    setItemsPerPage: (value: number) => void;
    currentPage: number
    setCurrentPage: (value:number) => void
    totalPages: number
}
export const CustomPaginationPage = ({itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, totalPages}:CustomPaginationProps) => {
    return (

        < div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 rounded-lg " >
            <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm font-medium">Mostrar más</span>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                    <SelectTrigger className="border-2 border-gray-300 w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    return (
                        <motion.div key={pageNum} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant={pageNum === currentPage ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={
                                    pageNum === currentPage ? 'bg-blue-500 text-white border-0' : ''
                                }
                            >
                                {pageNum}
                            </Button>
                        </motion.div>
                    );
                })}

                {totalPages > 5 && <span className="text-gray-400">...</span>}

                {totalPages > 5 && (
                    <Button variant="outline" size="sm" disabled>
                        {totalPages}
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div >
    )
}
