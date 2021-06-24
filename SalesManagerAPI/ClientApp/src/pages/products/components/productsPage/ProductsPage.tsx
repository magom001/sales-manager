import { Grid } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import React from 'react';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { useProducts } from '../../hooks';

const columns: GridColDef[] = [
  { field: 'id', hide: true },
  { field: 'name', editable: true, headerName: 'Product description', flex: 1 },
  { field: 'unit', headerName: 'Unit of measure', width: 250 },
];

const ProductsPage = () => {
  const productsQuery = useProducts();

  return (
    <Grid container spacing={2} style={{ minHeight: '100%' }}>
      <Grid item xs={12} style={{ position: 'relative' }}>
        <DataGrid
          error={productsQuery.error ? true : undefined}
          loading={productsQuery.isLoading}
          onEditCellChangeCommitted={(params) => {
            console.log('params', params);
          }}
          rows={productsQuery.data || []}
          columns={columns}
        />
      </Grid>
    </Grid>
  );
};

export default ProductsPage;
