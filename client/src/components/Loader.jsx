import React from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className="loader-container">
            <MagnifyingGlass
                visible={true}
                height="150"
                width="150"
                ariaLabel="magnifying-glass-loading"
                wrapperStyle={{}}
                wrapperClass="magnifying-glass-wrapper"
                glassColor="#c0efff"
                color="#e15b64"
            />
        </div>
    );
};

export default Loader;
