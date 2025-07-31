export function ProductTypeAttributeTableHeader() {
  return (
    <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 font-medium text-sm">
      <div>Name</div>
      <div>Type</div>
      <div>Required</div>
      <div>Searchable</div>
      <div>Filterable</div>
      <div className="text-right">Actions</div>
    </div>
  );
}
