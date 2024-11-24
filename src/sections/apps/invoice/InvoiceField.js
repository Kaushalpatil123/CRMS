import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const InvoiceField = ({ onEditItem, cellData }) => {
  const [selectValue, setSelectValue] = useState(cellData.value || ''); // Initialize with the value from props or an empty string

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectValue(value); // Update the local state
    onEditItem(event, name, value); // Pass the event, name, and value to the parent component
  };

  return (
    <TableCell sx={{ '& .MuiFormHelperText-root': { position: 'absolute', bottom: -24, ml: 0 } }}>
      {cellData.type === 'select' ? (
        <FormControl fullWidth>
          <InputLabel id={cellData.id}>{cellData.label}</InputLabel>
          <Select
            labelId={cellData.id}
            id={cellData.id}
            name={cellData.name}
            value={selectValue} // Use local state value
            onChange={handleChange}
            error={Boolean(cellData.errors && cellData.touched)}
          >
            
            {cellData.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
        required
          type={cellData.type}
          placeholder={cellData.placeholder}
          name={cellData.name}
          id={cellData.id}
          value={cellData.type === 'number' ? (cellData.value > 0 ? cellData.value : '') : cellData.value}
          onChange={onEditItem}
          label={cellData.label}
          error={Boolean(cellData.errors && cellData.touched)}
          inputProps={{
            ...(cellData.type === 'number' && { min: 0 })
          }}
        />
      )}
    </TableCell>
  );
};

InvoiceField.propTypes = {
  onEditItem: PropTypes.func,
  cellData: PropTypes.shape({
    type: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    errors: PropTypes.bool,
    touched: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    }))
  })
};

export default InvoiceField;
