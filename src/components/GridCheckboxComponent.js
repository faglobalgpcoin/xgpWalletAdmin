import React from 'react';

export const GridCheckbox = (props) => (
  <label className="k-form-field">
    <input
      type="checkbox"
      id={props.field + props.dataIndex}
      className="k-checkbox"
      disabled
      defaultChecked={!props.dataItem[props.field]}
    />
    <label
      className="k-checkbox-label"
      htmlFor={props.field + props.dataIndex}
    />
  </label>
);
