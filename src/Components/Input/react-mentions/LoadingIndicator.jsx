import React from 'react';

function LoadingIndicator() {
  return (
    <div className="skeleton-loader">
      <div data-loader-type="block" />
      <div data-loader-type="block" />
      <div data-loader-type="block" />
      <div data-loader-type="block" />
    </div>
  );
}

export default LoadingIndicator;
