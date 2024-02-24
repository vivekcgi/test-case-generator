import React from 'react';

const Loading = (props) => {
  return (
    <div className="text-center">
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <div>{props.msg}</div>
    </div>
  )
}

export default Loading;
