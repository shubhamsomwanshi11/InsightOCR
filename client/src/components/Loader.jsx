import React from 'react';
import { BallTriangle } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className="loader-container">
            <BallTriangle
                height={100}
                width={100}
                className="loader"
                radius={5}
                color="#4fa94d"
                ariaLabel="ball-triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
};

export default Loader;
