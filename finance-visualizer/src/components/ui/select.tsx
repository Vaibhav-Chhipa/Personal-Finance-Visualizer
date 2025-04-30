import * as React from 'react';

export function Select({ value, onValueChange, children }: any) {
  return (
    <div className="relative">
      <select 
        value={value} 
        onChange={(e) => onValueChange(e.target.value)} 
        className="block w-full p-2 border rounded-md bg-white"
      >
        {children}
      </select>
    </div>
  );
}

export function SelectItem({ value, children }: any) {
  return <option value={value}>{children}</option>;
}
