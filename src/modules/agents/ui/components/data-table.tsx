'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui'

interface Props<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	onRowClick?: (row: TData) => void
}

export const DataTable = <TData, TValue> ({ columns, data, onRowClick }: Props<TData, TValue>) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className='overflow-hidden rounded-lg border bg-background'>
			<Table>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
								onClick={() => onRowClick?.(row.original)}
								className='cursor-pointer'
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className='p-4 text-sm'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-19 text-center text-muted-foreground'>
								No results
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
