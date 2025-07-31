import { TableCell, TableRow } from "@qco/ui/components/table";

export function BannerTableSkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-12 w-16 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-20 bg-muted rounded animate-pulse" />
      </TableCell>
    </TableRow>
  );
}
