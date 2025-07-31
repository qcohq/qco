import { Skeleton } from "@qco/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";

// TODO: Использовать тип из схемы пропсов скелетона таблицы клиентов, если появится в @qco/validators
export function CustomersTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Имя</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="hidden md:table-cell">Телефон</TableHead>
          <TableHead className="hidden md:table-cell">
            Дата регистрации
          </TableHead>
          <TableHead className="hidden text-right md:table-cell">
            Заказов
          </TableHead>
          <TableHead className="hidden text-right md:table-cell">
            Сумма
          </TableHead>
          <TableHead className="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={`customers-table-skeleton-${Date.now()}-${i}`}>
            <TableCell>
              <Skeleton className="h-4 w-[180px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell className="hidden text-right md:table-cell">
              <Skeleton className="ml-auto h-4 w-[40px]" />
            </TableCell>
            <TableCell className="hidden text-right md:table-cell">
              <Skeleton className="ml-auto h-4 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8 rounded" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
